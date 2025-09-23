import OpenAI from "openai";

export interface SupportRequestPayload {
  name: string;
  email: string;
  device: string;
  category: string;
  description: string;
  locationName?: string;
}

export interface SupportSummary {
  problemBrief: string;
  urgency: string;
  suggestedAction: string;
}

export interface SupportChatMessage {
  role: "user" | "assistant";
  content: string;
}

const apiKey = process.env.OPENAI_API_KEY;
const client = apiKey ? new OpenAI({ apiKey }) : null;

const ticketSystemPrompt = `You are The Fix support concierge. Collect the customer's details and craft:
- problemBrief: one-sentence description of device + issue
- urgency: classify as high/medium/low with short reason
- suggestedAction: next step with reassurance, mention backups/warranty if relevant.
Use warm, concise tone.`;

const chatSystemPrompt = `You are FixBot, a helpful support assistant for The Fix electronics repair shops.
- Ask focused clarifying questions.
- Share pricing ranges or timelines only when confident.
- Encourage scheduling a visit, booking online, or using curbside drop-off.
- Keep responses under 120 words and use a friendly, professional voice.`;

export async function summarizeSupportTicket(payload: SupportRequestPayload): Promise<SupportSummary> {
  if (!client) {
    return {
      problemBrief: `${payload.device} reported for ${payload.category.toLowerCase()} issue. ${payload.description}`.slice(0, 220),
      urgency: "medium – schedule repair within 24 hours.",
      suggestedAction: "Our Midtown team will reach out shortly to confirm appointment options. Please back up your data if possible before drop-off.",
    };
  }

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: ticketSystemPrompt },
      {
        role: "user",
        content: `Customer: ${payload.name}\nEmail: ${payload.email}\nDevice: ${payload.device}\nCategory: ${payload.category}\nLocation: ${payload.locationName ?? "unspecified"}\nDescription: ${payload.description}`,
      },
    ],
    max_output_tokens: 200,
  });

  const text = response.output_text ?? "";
  const segments = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const summary: SupportSummary = {
    problemBrief:
      segments.find((line) => line.toLowerCase().startsWith("problem"))?.replace(/^problem[:\-]\s*/i, "") ||
      segments[0] ||
      "Device issue summary unavailable.",
    urgency:
      segments.find((line) => line.toLowerCase().startsWith("urgency"))?.replace(/^urgency[:\-]\s*/i, "") ||
      "medium – review details with the customer.",
    suggestedAction:
      segments
        .find((line) =>
          /^(next\ssteps?|suggested action)/i.test(line)
        )
        ?.replace(/^(next\ssteps?|suggested action)[:\-]\s*/i, "") ||
      segments[segments.length - 1] ||
      "Please follow up with the customer.",
  };

  return summary;
}

export async function getSupportChatReply(messages: SupportChatMessage[]): Promise<string> {
  if (!messages.length) {
    return "I am here and ready when you are!";
  }

  if (!client) {
    const latest = messages[messages.length - 1]?.content ?? "";
    if (/price|cost/i.test(latest)) {
      return "Screen repairs typically start at $99 and batteries at $69, depending on the device. Let me know which model you have and I can narrow it down.";
    }
    if (/how long|turnaround|time/i.test(latest)) {
      return "Most phone repairs finish the same day, often within 2 hours. Drop-offs after 5pm may be ready next morning.";
    }
    return "Thanks for the details! I will package this up for our human team and they will follow up shortly.";
  }

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: chatSystemPrompt },
      ...messages.map((message) => ({ role: message.role, content: message.content })),
    ],
    max_output_tokens: 200,
  });

  return response.output_text?.trim() || "Let me double-check that for you.";
}


