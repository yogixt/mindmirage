import { NextResponse } from "next/server";
import { generateText, type ModelMessage } from "ai";
import { z } from "zod";
import { selectModel } from "@/lib/ai";
import { SANT_AI_SYSTEM_PROMPT } from "@/lib/sant-ai-prompt";

export const runtime = "nodejs";

const Body = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(40),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Trim history to the last N turns to keep within free-tier limits.
  const recent = parsed.messages.slice(-12);

  const messages: ModelMessage[] = recent.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    const { text } = await generateText({
      model: selectModel(),
      system: SANT_AI_SYSTEM_PROMPT,
      messages,
      maxOutputTokens: 600,
      temperature: 0.6,
    });
    return NextResponse.json({ content: text.trim() });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Sant Ai is resting.";
    console.error("[sant-ai]", msg);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? msg
            : "Sant Ai is resting. Please try again, or write to Acharya Ji.",
      },
      { status: 500 },
    );
  }
}
