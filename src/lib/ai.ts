/**
 * Sant Ai model selection.
 *
 *   - In production we use Groq (free tier) — fast hosted inference of open
 *     models. Set GROQ_API_KEY.
 *   - For local development you can run Ollama and we'll use that instead.
 *     Set USE_OLLAMA=1 (and optionally OLLAMA_BASE_URL, OLLAMA_MODEL).
 */

import { groq } from "@ai-sdk/groq";
import { createOllama } from "ollama-ai-provider-v2";
import type { LanguageModel } from "ai";

const DEFAULT_GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
const DEFAULT_OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "gemma3:4b";

export function selectModel(): LanguageModel {
  if (process.env.USE_OLLAMA === "1") {
    const ollama = createOllama({
      baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/api",
    });
    return ollama(DEFAULT_OLLAMA_MODEL);
  }
  return groq(DEFAULT_GROQ_MODEL);
}

export const SELECTED_MODEL_LABEL =
  process.env.USE_OLLAMA === "1" ? `ollama:${DEFAULT_OLLAMA_MODEL}` : `groq:${DEFAULT_GROQ_MODEL}`;
