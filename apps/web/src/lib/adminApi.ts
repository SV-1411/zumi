'use client';

/* ----------------------------------------------------------------------------
   Minimal admin API client for the ZUMI team dashboard.
   Stores tokens in localStorage, transparently refreshes on 401, and exposes
   typed helpers for the leads/analytics endpoints.
---------------------------------------------------------------------------- */

// Same-origin: the backend now lives in Next.js route handlers (Vercel-native).
const API = '';

const ACCESS_KEY = 'zumi_admin_access';
const REFRESH_KEY = 'zumi_admin_refresh';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LeadSummary {
  summary: string;
  recommendedSolution: string;
  projectScope: string[];
  technicalRequirements: string[];
  estimatedComplexity: string;
  leadScore: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  projectType?: string | null;
  requirements?: string | null;
  budget?: string | null;
  timeline?: string | null;
  score: number;
  complexity: string;
  status: string;
  source: string;
  createdAt: string;
  summary?: LeadSummary | null;
}

export interface Analytics {
  totalLeads: number;
  qualifiedLeads: number;
  wonLeads: number;
  conversionRate: number;
  activeProjects: number;
  revenuePaid: number;
  avgLeadScore: number;
}

function getAccess() {
  return typeof window !== 'undefined' ? localStorage.getItem(ACCESS_KEY) : null;
}
function getRefresh() {
  return typeof window !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null;
}
function setTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}
export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}
export function isAuthed() {
  return !!getAccess();
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = getRefresh();
  if (!refreshToken) return false;
  const res = await fetch(`${API}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return false;
  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return true;
}

/** Authenticated fetch with one transparent refresh-and-retry on 401. */
async function authFetch(path: string, init: RequestInit = {}, retry = true): Promise<Response> {
  const access = getAccess();
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
  });
  if (res.status === 401 && retry && (await tryRefresh())) {
    return authFetch(path, init, false);
  }
  return res;
}

export async function login(email: string, password: string): Promise<AdminUser> {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? 'Login failed');
  }
  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.user as AdminUser;
}

export async function logout() {
  const refreshToken = getRefresh();
  try {
    await fetch(`${API}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    /* ignore */
  }
  clearTokens();
}

export async function me(): Promise<AdminUser> {
  const res = await authFetch('/api/auth/me');
  if (!res.ok) throw new Error('Unauthorized');
  return (await res.json()).user as AdminUser;
}

export async function getLeads(status?: string): Promise<{ items: Lead[]; total: number }> {
  const q = status ? `?status=${status}&take=100` : '?take=100';
  const res = await authFetch(`/api/admin/leads${q}`);
  if (!res.ok) throw new Error('Failed to load leads');
  return res.json();
}

export async function updateLeadStatus(id: string, status: string): Promise<Lead> {
  const res = await authFetch(`/api/admin/leads/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

export async function getAnalytics(): Promise<Analytics> {
  const res = await authFetch('/api/analytics');
  if (!res.ok) throw new Error('Failed to load analytics');
  return res.json();
}
