const BASE = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/users";

// ── Shared types ──────────────────────────────────────────────

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  dob: string;
}

export interface UserPayload {
  username: string;
  firstName: string;
  lastName: string;
  dob: string;
}

export interface SearchCriteria {
  field: string;
  operation: string;
  value: string;
  valueTo?: string;
}

// ── Internal helper ───────────────────────────────────────────

/**
 * Wraps fetch and throws a descriptive Error for any non-2xx response,
 * using the server's error body message when available.
 */
async function guardedFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed with status ${res.status}`);
  }
  return res;
}

// ── API functions ─────────────────────────────────────────────

export async function getUsers(): Promise<User[]> {
  const res = await guardedFetch(BASE, { cache: "no-store" });
  return res.json();
}

export async function searchUsers(criteria: SearchCriteria[]): Promise<User[]> {
  const res = await guardedFetch(`${BASE}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ criteria }),
  });
  return res.json();
}

export async function createUser(payload: UserPayload): Promise<User> {
  const res = await guardedFetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/** Reserved for the future edit-user feature. */
export async function updateUser(id: number, payload: UserPayload): Promise<User> {
  const res = await guardedFetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteUser(id: number): Promise<void> {
  await guardedFetch(`${BASE}/${id}`, { method: "DELETE" });
}

