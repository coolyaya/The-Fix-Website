import { NextResponse } from "next/server";
import { google } from "googleapis";
import { z } from "zod";

const payloadSchema = z.object({
  ticketId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  device: z.string().min(1),
  category: z.string().min(1),
  location: z.string().min(1),
});

export async function POST(request: Request) {
  const rawBody = await request.json().catch(() => null);
  if (!rawBody) {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid ticket payload" }, { status: 400 });
  }

  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const serviceAccountPrivateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!serviceAccountEmail || !serviceAccountPrivateKey || !spreadsheetId) {
    console.error("[tickets] Missing Google Sheets configuration");
    return NextResponse.json({ message: "Service unavailable" }, { status: 500 });
  }

  const privateKey = serviceAccountPrivateKey.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const { ticketId, name, email, device, category, location } = parsed.data;
  const values = [[
    new Date().toISOString(),
    ticketId,
    name,
    email,
    device,
    category,
    location,
  ]];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Tickets",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[tickets] Failed to append row", error);
    return NextResponse.json({ message: "Failed to log ticket" }, { status: 500 });
  }
}
