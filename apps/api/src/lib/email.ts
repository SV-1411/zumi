import { env } from '../config/env.js';
import { logger } from './logger.js';
import type { LeadEnrichment } from './ai.js';

interface LeadEmailInput {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  projectType?: string | null;
  requirements?: string | null;
  budget?: string | null;
  timeline?: string | null;
}

function renderLeadEmail(lead: LeadEmailInput, ai: LeadEnrichment): string {
  const row = (k: string, v?: string | null) =>
    v ? `<tr><td style="padding:4px 12px 4px 0;color:#888">${k}</td><td>${v}</td></tr>` : '';
  return `
  <div style="font-family:Inter,Arial,sans-serif;background:#0B0B0B;color:#F7F7F7;padding:24px;border-radius:12px">
    <p style="color:#4F6FFF;letter-spacing:.2em;text-transform:uppercase;font-size:11px">New inquiry · score ${ai.score}/100</p>
    <h2 style="margin:6px 0 18px">${lead.name}${lead.company ? ` — ${lead.company}` : ''}</h2>
    <table style="font-size:14px;border-collapse:collapse">
      ${row('Email', lead.email)}
      ${row('Project', lead.projectType)}
      ${row('Budget', lead.budget)}
      ${row('Timeline', lead.timeline)}
      ${row('Complexity', ai.complexity)}
    </table>
    ${lead.requirements ? `<p style="margin-top:16px;color:#ccc"><b>Requirements:</b><br>${lead.requirements}</p>` : ''}
    <p style="margin-top:16px;color:#ccc"><b>AI recommendation:</b><br>${ai.recommendedSolution}</p>
    <p style="margin-top:8px;color:#888;font-size:13px">${ai.summary}</p>
    <p style="margin-top:20px;font-size:12px;color:#666">Lead ID: ${lead.id}</p>
  </div>`;
}

/**
 * Sends a new-lead notification via Resend. If RESEND_API_KEY / LEAD_NOTIFY_TO
 * are unset (or the call fails), it logs instead — never blocks lead capture.
 */
export async function sendLeadNotification(lead: LeadEmailInput, ai: LeadEnrichment): Promise<void> {
  const to = env.LEAD_NOTIFY_TO?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];

  if (!env.RESEND_API_KEY || to.length === 0) {
    logger.info(
      { leadId: lead.id, score: ai.score, name: lead.name },
      'lead notification (email not configured — logging only)'
    );
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to,
        subject: `New inquiry · ${lead.name} (score ${ai.score})`,
        html: renderLeadEmail(lead, ai),
      }),
    });
    if (!res.ok) {
      logger.warn({ status: res.status, body: await res.text() }, 'resend email failed');
    } else {
      logger.info({ leadId: lead.id, to }, 'lead notification email sent');
    }
  } catch (err) {
    logger.warn({ err }, 'lead notification email error');
  }
}
