"use client";

import { FormEvent, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Role = "user" | "assistant" | "system";

interface ChatMessage {
  id: string;
  role: Role;
  content: string;
}

const followUps = [
  "Do you offer rush repairs?",
  "What accessories fit the iPhone 17?",
  "How long does water damage repair take?"
];

const initialMessages: ChatMessage[] = [
  {
    id: "intro",
    role: "assistant",
    content:
      "Hey! I'm the FixBot. Tell me what happened with your device and I'll prep a quick summary for the team.",
  },
];

interface SupportChatProps {
  defaultEmail?: string;
  defaultName?: string;
}

export function SupportChat({ defaultEmail = "", defaultName = "" }: SupportChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const canSend = inputValue.trim().length > 1 && !isLoading;

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed) return;
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((current) => [...current, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "chat",
          messages: [...messages, userMessage]
            .filter((message) => message.role !== "system")
            .map(({ role, content }) => ({ role, content })),
          identity: { name: defaultName, email: defaultEmail },
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed with status ${response.status}`);
      }

      const data = (await response.json()) as { reply: string };

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Support chat error", error);
      setMessages((current) => [
        ...current,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Hmm, I could not reach support right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
      requestAnimationFrame(() => {
        containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;
    void sendMessage(inputValue);
  }

  const groupedMessages = useMemo(() => messages, [messages]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-background shadow-soft">
      <header className="border-b border-border/60 p-6">
        <h2 className="text-lg font-semibold">AI concierge</h2>
        <p className="text-sm text-muted-foreground">
          Ask anything about repairs, pricing, or store availability. The FixBot will prep a summary for the support team.
        </p>
      </header>
      <div ref={containerRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {groupedMessages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex max-w-[85%] flex-col gap-1 text-sm",
              message.role === "user" ? "ml-auto items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "rounded-2xl px-4 py-3",
                message.role === "user"
                  ? "bg-fix-blue text-white"
                  : "bg-muted/70 text-foreground ring-1 ring-border/60"
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading ? (
          <div className="flex items-center gap-2 rounded-2xl bg-muted/70 px-4 py-3 text-sm text-muted-foreground">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-fix-pink" />
                        The FixBot is typing...
          </div>
        ) : null}
      </div>
      <div className="border-t border-border/60 p-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Describe your device issue or question."
            rows={3}
            aria-label="Message"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={!canSend} className="rounded-xl">
              Send
            </Button>
            <ul className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {followUps.map((suggestion) => (
                <li key={suggestion}>
                  <button
                    type="button"
                    onClick={() => setInputValue(suggestion)}
                    className="rounded-full border border-border/60 bg-muted/40 px-3 py-1 transition-colors hover:bg-muted"
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}


