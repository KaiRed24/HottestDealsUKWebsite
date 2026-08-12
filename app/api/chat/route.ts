import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";
import { SOCIAL_LINKS } from "@/lib/social";

export const runtime = "nodejs";

const MODEL = "claude-haiku-4-5-20251001";
const MAX_HISTORY = 12;
const MAX_PRODUCTS_IN_CONTEXT = 300;

type ChatMessage = { role: "user" | "assistant"; content: string };

async function buildSystemPrompt(): Promise<string> {
  const products = await getProducts();
  const catalogLines = products
    .slice(0, MAX_PRODUCTS_IN_CONTEXT)
    .map(
      (p) =>
        `- ${p.name} | category: ${p.category} | £${p.price.toFixed(2)} | ${
          p.stock_quantity > 0 ? "in stock" : "sold out"
        } | /product/${p.sku}`
    )
    .join("\n");

  return `You are the customer-help chat assistant on the Hottest Deals UK website — a UK importer of American candy, sodas, Asian treats and European chocolate, selling via TikTok Shop, eBay and Whatnot (live auctions).

Ground every answer strictly in the information below. Never invent stock levels, prices, shipping timeframes, return windows, company registration details, or anything not explicitly given to you here.

CURRENT CATALOGUE (name | category | price | stock | product page):
${catalogLines || "(no active products right now)"}

HOW CUSTOMERS ACTUALLY BUY:
- Every product page (linked above) has "Buy on TikTok" and/or "Buy on eBay" buttons when available.
- We also sell live on Whatnot (auctions/drops): ${SOCIAL_LINKS.whatnot.href}
- Follow on TikTok for restocks and new arrivals: ${SOCIAL_LINKS.tiktok.href}
- The site has an on-site basket for browsing/collecting items, but on-site checkout/payment is NOT live yet — do not tell customers they can pay on this website.

POLICIES:
- Our Terms, Refunds, and Shipping pages are currently honest placeholders — real policy text hasn't been published yet. If asked about shipping times, returns, or refunds, say this honestly and point them to /contact rather than guessing or inventing a policy.
- For anything you don't have solid information on, say so plainly and suggest they use the Contact page or our social channels.

STYLE:
- Friendly, concise, helpful — a couple of sentences is usually enough.
- No emoji.
- Don't make up product details (flavours, ingredients, allergens) beyond what's in the catalogue above — if asked, suggest checking the product page or contacting us, especially for allergen questions where accuracy matters.`;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ configured: false });
  }

  const body = await request.json().catch(() => null);
  const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : [];

  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  const trimmedHistory = messages.slice(-MAX_HISTORY);
  const system = await buildSystemPrompt();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      system,
      messages: trimmedHistory.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("Anthropic API error:", response.status, errorText);
    return NextResponse.json(
      { error: "The chat assistant is temporarily unavailable." },
      { status: 502 }
    );
  }

  const data = await response.json();
  const reply = data.content?.[0]?.text ?? "Sorry, I couldn't come up with a reply to that.";

  return NextResponse.json({ configured: true, reply });
}
