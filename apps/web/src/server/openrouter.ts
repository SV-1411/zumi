import { env } from './env';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const openRouterEnabled = () => !!env.OPENROUTER_API_KEY;

export async function chatCompletion(
  messages: ChatMessage[],
  opts: { json?: boolean; temperature?: number } = {}
): Promise<string> {
  if (!env.OPENROUTER_API_KEY) throw new Error('OpenRouter not configured');

  const res = await fetch(`${env.OPENROUTER_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://zumi.studio',
      'X-Title': 'ZUMI Assistant',
    },
    body: JSON.stringify({
      model: env.OPENROUTER_MODEL,
      messages,
      temperature: opts.temperature ?? 0.6,
      ...(opts.json ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? '';
}
