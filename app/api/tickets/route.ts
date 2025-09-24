import { NextResponse } from "next/server";
import { google } from "googleapis";
import { z } from "zod";

const CORS_HEADERS: HeadersInit = {
  "Access-Control-Allow-Origin": "https://the-fix-website.vercel.app",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const payloadSchema = z.object({
  ticketId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  device: z.string().min(1),
  category: z.string().min(1),
  location: z.string().min(1),
});

const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "";
const sheetTabName = process.env.GOOGLE_SHEETS_TAB_NAME || "";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(request: Request) {
  const pkEnv = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "";

  if (!serviceAccountEmail || !pkEnv || !spreadsheetId || !sheetTabName) {
    console.error("[tickets] Missing Google Sheets configuration");
    return NextResponse.json(
      { ok: false, error: "Missing Google Sheets configuration" },
      { status: 500, headers: CORS_HEADERS },
    );
  }

  const sanitizedKey = pkEnv.includes("\\n") ? pkEnv.replace(/\\n/g, "\n") : pkEnv;
  const privateKey = sanitizedKey.replace(/\r\n?/g, "\n").trim();

  if (!privateKey.startsWith("-----BEGIN PRIVATE KEY-----") || !privateKey.includes("END PRIVATE KEY-----")) {
    console.error("[tickets] Bad private key format");
    const errorHeaders = new Headers(CORS_HEADERS);
    errorHeaders.set("Content-Type", "application/json");
    return new Response(
      JSON.stringify({ ok: false, error: "bad private key format" }),
      {
        status: 500,
        headers: errorHeaders,
      },
    );
  }

  const rawBody = await request.json().catch(() => null);
  if (!rawBody) {
    return NextResponse.json(
      { message: "Invalid JSON" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const parsed = payloadSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid ticket payload" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const auth = new google.auth.JWT(
    serviceAccountEmail,
    undefined,
    privateKey,
    ["https://www.googleapis.com/auth/spreadsheets"],
  );

  const sheets = google.sheets({ version: "v4", auth });

  const { ticketId, name, email, device, category, location } = parsed.data;
  const values = [
    [
      new Date().toISOString(),
      ticketId,
      name,
      email,
      device,
      category,
      location,
    ],
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetTabName}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values,
      },
    });

    return NextResponse.json(
      { success: true },
      { headers: CORS_HEADERS },
    );
  } catch (error) {
    console.error("[tickets] Failed to append row", error);
    return NextResponse.json(
      { message: "Failed to log ticket" },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}
