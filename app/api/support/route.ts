import { NextResponse } from "next/server";
import { z } from "zod";

import locations from "@/data/locations.json";
import { getSupportChatReply, summarizeSupportTicket } from "@/lib/ai";

const ticketPayloadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  device: z.string().min(2),
  category: z.string().min(2),
  description: z.string().min(10),
  locationId: z.string().min(1),
  consent: z.literal(true).optional(),
});

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

const chatRequestSchema = z.object({
  mode: z.literal("chat"),
  messages: z.array(chatMessageSchema).min(1),
  identity: z
    .object({
      name: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
});

const ticketRequestSchema = z.object({
  mode: z.literal("ticket").optional(),
  payload: ticketPayloadSchema,
});

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  if (!raw) {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  if (raw.mode === "chat") {
    const parsedChat = chatRequestSchema.safeParse(raw);
    if (!parsedChat.success) {
      return NextResponse.json({ message: "Invalid chat request" }, { status: 400 });
    }

    const reply = await getSupportChatReply(parsedChat.data.messages);
    return NextResponse.json({ reply });
  }

  const parsedTicket = ticketRequestSchema.safeParse(raw);
  let payload = parsedTicket.success ? parsedTicket.data.payload : null;

  if (!payload) {
    const direct = ticketPayloadSchema.safeParse(raw);
    if (!direct.success) {
      return NextResponse.json({ message: "Invalid ticket payload" }, { status: 400 });
    }
    payload = direct.data;
  }

  const location = locations.find((item) => item.id === payload.locationId);

  const summary = await summarizeSupportTicket({
    name: payload.name,
    email: payload.email,
    device: payload.device,
    category: payload.category,
    description: payload.description,
    locationName: location?.name,
  });

  const ticketId = `FIX-${Date.now()}`;

  console.info("[support] new ticket", {
    ticketId,
    name: payload.name,
    email: payload.email,
    device: payload.device,
    category: payload.category,
    location: location?.name ?? payload.locationId,
  });

  return NextResponse.json({
    ticketId,
    summary: `${summary.problemBrief} (Urgency: ${summary.urgency})`,
    nextSteps: summary.suggestedAction,
  });
}


