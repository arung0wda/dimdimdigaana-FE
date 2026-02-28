const BASE = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/users";

export interface SearchCriteria {
  field: string;
  operation: string;
  value: string;
  valueTo?: string;
}

export async function getUsers() {
  const res = await fetch(BASE, { cache: "no-store" });
  return res.json();
}

export async function searchUsers(criteria: SearchCriteria[]) {
  const res = await fetch(`${BASE}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ criteria }),
  });
  return res.json();
}

export async function createUser(payload: any) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function updateUser(id: number, payload: any) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function deleteUser(id: number) {
  await fetch(`${BASE}/${id}`, { method: "DELETE" });
}