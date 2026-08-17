"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ChatMessage = { role: "user" | "assistant"; content: string };

const OFFER_STORAGE_KEY = "hdu-mystery-box-offer";

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi! Ask me about our sweets, drinks, snacks, or where to find something.",
};

const FALLBACK_MESSAGE =
  "Our chat assistant isn't connected yet — email hottestdealsukwebsite@gmail.com or find us on TikTok/Whatnot in the meantime.";

function CandyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 9a4 4 0 0 1 8 0v6a4 4 0 0 1-8 0V9Z" />
      <path d="M8 10 3 7v10l5-3" />
      <path d="M16 10l5-3v10l-5-3" />
    </svg>
  );
}

type OfferStatus = "open" | "submitting" | "submitted" | "dismissed" | "error";

function OfferBanner({
  status,
  onSubmit,
  onDismiss,
}: {
  status: OfferStatus;
  onSubmit: (email: string) => void;
  onDismiss: () => void;
}) {
  const [email, setEmail] = useState("");

  if (status === "submitted") {
    return (
      <div className="bg-blue-tint text-navy px-4 py-3 text-sm font-medium text-center">
        Thanks! We&apos;ll email your 30% off mystery box code shortly.
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email.trim()) onSubmit(email.trim());
      }}
      className="bg-blue-tint text-text px-4 py-3 flex flex-col gap-2"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm leading-snug">
          New customers get 30% off mystery boxes — pop your email in to claim it.
        </p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss offer"
          className="shrink-0 w-6 h-6 rounded-[var(--radius)] flex items-center justify-center hover:bg-navy/10"
        >
          ×
        </button>
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-[var(--radius)] border border-grey-line bg-white px-3 py-1.5 text-sm text-text focus:outline-none focus:border-navy"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-[var(--radius)] bg-navy text-white font-medium px-3 py-1.5 text-sm hover:bg-blue transition-colors duration-150 disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Claim"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-blue font-medium">
          Something went wrong — please try again.
        </p>
      )}
    </form>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [offerStatus, setOfferStatus] = useState<OfferStatus>("dismissed");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(OFFER_STORAGE_KEY);
    setOfferStatus(stored === "submitted" ? "submitted" : stored === "dismissed" ? "dismissed" : "open");
  }, []);

  async function handleOfferSubmit(email: string) {
    setOfferStatus("submitting");
    const supabase = createClient();
    const { error } = await supabase
      .from("email_signups")
      .insert({ email, source: "chat_widget_mystery_box_offer" });

    if (error) {
      setOfferStatus("error");
      return;
    }
    setOfferStatus("submitted");
    window.localStorage.setItem(OFFER_STORAGE_KEY, "submitted");
  }

  function handleOfferDismiss() {
    setOfferStatus("dismissed");
    window.localStorage.setItem(OFFER_STORAGE_KEY, "dismissed");
  }

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, loading]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();

      const reply: string =
        data.configured === false
          ? FALLBACK_MESSAGE
          : data.reply ?? "Sorry, something went wrong — please try again.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong — please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[92vw] max-w-sm h-[70vh] max-h-[560px] flex flex-col rounded-[var(--radius)] border border-grey-line bg-white overflow-hidden">
          <div className="flex items-center justify-between bg-navy text-white px-4 py-3">
            <span className="font-medium">Chat with us</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="w-8 h-8 rounded-[var(--radius)] flex items-center justify-center hover:bg-white/15 transition-colors duration-150"
            >
              ×
            </button>
          </div>

          {(offerStatus === "open" ||
            offerStatus === "submitting" ||
            offerStatus === "submitted" ||
            offerStatus === "error") && (
            <OfferBanner
              status={offerStatus}
              onSubmit={handleOfferSubmit}
              onDismiss={handleOfferDismiss}
            />
          )}

          <div ref={listRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-4 py-2 rounded-[var(--radius)] text-sm leading-relaxed ${
                  m.role === "user"
                    ? "self-end bg-navy text-white"
                    : "self-start bg-blue-tint text-text"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="self-start bg-blue-tint text-muted px-4 py-2 rounded-[var(--radius)] text-sm">
                Typing…
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-grey-line p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 rounded-[var(--radius)] border border-grey-line bg-white px-4 py-2 text-sm text-text focus:outline-none focus:border-navy"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-[var(--radius)] bg-navy text-white font-medium px-4 py-2 text-sm hover:bg-blue transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="w-14 h-14 rounded-full bg-navy text-white flex items-center justify-center hover:bg-blue transition-colors duration-150"
      >
        <CandyIcon />
      </button>
    </div>
  );
}
