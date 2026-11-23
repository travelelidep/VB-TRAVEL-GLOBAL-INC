export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  json?: boolean;
  timeoutMs?: number;
}

interface LLMConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-4o-mini";

export function getLLMConfig(): LLMConfig | null {
  const apiKey =
    process.env.AI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    "";

  if (!apiKey) return null;

  const baseUrl = (
    process.env.AI_BASE_URL ||
    (process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY && !process.env.AI_API_KEY
      ? "https://api.groq.com/openai/v1"
      : DEFAULT_BASE_URL)
  ).replace(/\/+$/, "");

  return {
    apiKey,
    baseUrl,
    model: process.env.AI_MODEL || DEFAULT_MODEL,
  };
}

export function isLLMEnabled(): boolean {
  return getLLMConfig() !== null;
}

/**
 * Llama a cualquier proveedor compatible con la API de OpenAI.
 * Devuelve null ante cualquier fallo para que el orquestador use su motor
 * determinista sin romper el flujo del cliente.
 */
export async function chat(
  messages: LLMMessage[],
  options: LLMOptions = {}
): Promise<string | null> {
  const config = getLLMConfig();
  if (!config) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 20000);

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: options.temperature ?? 0.3,
        max_tokens: options.maxTokens ?? 700,
        ...(options.json ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.warn(`[LLM] ${response.status}: ${detail.slice(0, 300)}`);
      return null;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    return typeof content === "string" && content.trim() ? content.trim() : null;
  } catch (error) {
    console.warn("[LLM] Error de conexión:", error instanceof Error ? error.message : error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export function parseJsonLoose<T>(raw: string | null): T | null {
  if (!raw) return null;
  const cleaned = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end <= start) return null;
    try {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    } catch {
      return null;
    }
  }
}
