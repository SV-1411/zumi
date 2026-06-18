import { chatCompletion, openRouterEnabled, type ChatMessage } from '../../lib/openrouter.js';
import { enrichLead } from '../../lib/ai.js';
import { createLead } from '../leads/leads.service.js';
import { logger } from '../../lib/logger.js';

export interface LeadFields {
  name?: string;
  email?: string;
  company?: string;
  projectType?: string;
  requirements?: string;
  budget?: string;
  timeline?: string;
}

export type Emotion = 'neutral' | 'happy' | 'thinking' | 'confused';

export interface AssistantTurn {
  reply: string;
  fields: LeadFields;
  recommended: string | null;
  emotion: Emotion;
  done: boolean;
  leadId?: string;
  aiEnabled: boolean;
}

const SERVICES = `AI agents, AI receptionists, AI office automation, custom software,
SaaS development, web & mobile apps, enterprise dashboards, healthcare HMS/EHR,
CRM, ERP, workflow automation, AI chat & customer support, lead qualification,
knowledge bases, cloud & DevOps, API & WhatsApp integrations, BI & analytics,
and digital transformation consulting`;

const SYSTEM_PROMPT = `You are ZUMI's AI solutions consultant — warm, sharp and concise.
ZUMI is a premium technology & AI transformation studio. Services: ${SERVICES}.

Your job: understand what the visitor is trying to build, ask ONE smart question at a
time, recommend the best ZUMI service(s), and collect enough to brief the team.

You MUST reply with a single JSON object, no markdown, with this exact shape:
{
  "reply": "your next message to the visitor (1-3 sentences, friendly, no JSON)",
  "fields": {
    "name": "", "email": "", "company": "",
    "projectType": "", "requirements": "", "budget": "", "timeline": ""
  },
  "recommended": "the ZUMI service you'd recommend, or null if not enough info yet",
  "emotion": "one of: neutral | happy | thinking | confused",
  "done": false
}

Rules:
- Carry forward every field already known; only fill new ones. Leave unknown fields as "".
- Ask for name and email naturally during the chat (needed so the team can follow up).
- Set "emotion" to reflect your tone: "happy" when excited or sharing a recommendation /
  good news, "confused" when the visitor's message is unclear or you need to clarify,
  "thinking" when weighing options, otherwise "neutral".
- Set "done": true only once you have at least name, email and a clear project need,
  AND you have given a recommendation. When done, "reply" should thank them and say
  the team will reach out.
- Never invent fields the user didn't say. Keep replies human, not robotic.`;

const SCRIPT: { field: keyof LeadFields; q: string }[] = [
  { field: 'name', q: "Hi! I'm ZUMI's assistant. What's your name?" },
  { field: 'email', q: 'Great to meet you{name}. What email should the team use to reach you?' },
  { field: 'projectType', q: 'What are you looking to build? (e.g. AI agent, SaaS, healthcare platform, CRM, automation)' },
  { field: 'requirements', q: 'Tell me a bit about the problem and what success looks like.' },
  { field: 'company', q: 'Which company or team are you with?' },
  { field: 'budget', q: 'Roughly what budget range are you working with?' },
  { field: 'timeline', q: 'And your ideal timeline?' },
];

function parseJsonLoose(raw: string): Record<string, unknown> | null {
  const cleaned = raw.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
      } catch {
        return null;
      }
    }
    return null;
  }
}

function mergeFields(prior: LeadFields, next: Record<string, unknown> | undefined): LeadFields {
  const out: LeadFields = { ...prior };
  if (!next) return out;
  for (const k of ['name', 'email', 'company', 'projectType', 'requirements', 'budget', 'timeline'] as const) {
    const v = next[k];
    if (typeof v === 'string' && v.trim()) out[k] = v.trim();
  }
  return out;
}

async function finalize(fields: LeadFields, messages: ChatMessage[]): Promise<string | undefined> {
  if (!fields.email) return undefined;
  try {
    const lead = await createLead({
      ...fields,
      source: 'assistant',
      messages: messages.map((m) => ({
        role: m.role === 'assistant' ? 'ASSISTANT' : 'USER',
        content: m.content,
      })),
    });
    return lead.id;
  } catch (err) {
    logger.warn({ err }, 'assistant finalize/createLead failed');
    return undefined;
  }
}

/** Scripted fallback when no OpenRouter key is configured. */
async function scriptedTurn(history: ChatMessage[], prior: LeadFields): Promise<AssistantTurn> {
  const fields = { ...prior };
  // capture the latest user answer into the first still-missing field
  const lastUser = [...history].reverse().find((m) => m.role === 'user');
  const missing = SCRIPT.find((s) => !fields[s.field]);
  if (lastUser && missing) fields[missing.field] = lastUser.content.trim();

  const nextMissing = SCRIPT.find((s) => !fields[s.field]);
  if (nextMissing) {
    const q = nextMissing.q.replace('{name}', fields.name ? `, ${fields.name}` : '');
    return { reply: q, fields, recommended: null, emotion: 'neutral', done: false, aiEnabled: false };
  }

  const enr = enrichLead(fields);
  const leadId = await finalize(fields, history);
  return {
    reply: `Thanks${fields.name ? `, ${fields.name}` : ''}! Based on what you've shared, I'd recommend: ${enr.recommendedSolution}. Our team will reach out at ${fields.email}.`,
    fields,
    recommended: enr.recommendedSolution,
    emotion: 'happy',
    done: true,
    leadId,
    aiEnabled: false,
  };
}

const EMOTIONS: Emotion[] = ['neutral', 'happy', 'thinking', 'confused'];

export async function respond(
  history: ChatMessage[],
  prior: LeadFields = {}
): Promise<AssistantTurn> {
  if (!openRouterEnabled()) return scriptedTurn(history, prior);

  try {
    const known = `Known fields so far: ${JSON.stringify(prior)}`;
    const messages: ChatMessage[] = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n${known}` },
      ...history,
    ];
    const raw = await chatCompletion(messages, { json: true });
    const parsed = parseJsonLoose(raw);

    if (!parsed) {
      return { reply: raw || 'Sorry, could you rephrase that?', fields: prior, recommended: null, emotion: 'confused', done: false, aiEnabled: true };
    }

    const fields = mergeFields(prior, parsed.fields as Record<string, unknown> | undefined);
    const done = parsed.done === true && !!fields.email;
    const recommended = typeof parsed.recommended === 'string' ? parsed.recommended : null;
    const reply = typeof parsed.reply === 'string' ? parsed.reply : 'Tell me more about what you need.';
    const emotion: Emotion = EMOTIONS.includes(parsed.emotion as Emotion)
      ? (parsed.emotion as Emotion)
      : done || recommended
        ? 'happy'
        : 'neutral';

    let leadId: string | undefined;
    if (done) leadId = await finalize(fields, history);

    return { reply, fields, recommended, emotion, done, leadId, aiEnabled: true };
  } catch (err) {
    logger.warn({ err }, 'assistant LLM failed — using scripted fallback');
    return scriptedTurn(history, prior);
  }
}
