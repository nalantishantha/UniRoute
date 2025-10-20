// Simple API client for University Announcements using Vite proxy to /api

const BASE = "/api/universities/announcements";

export async function getAnnouncements({ university_id, seed = true } = {}) {
  const params = new URLSearchParams();
  if (university_id) params.append("university_id", university_id);
  if (seed != null) params.append("seed", String(seed));
  const res = await fetch(`${BASE}/?${params.toString()}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to fetch announcements (${res.status})`);
  return res.json();
}

export async function createAnnouncement(payload) {
  const res = await fetch(`${BASE}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to create announcement (${res.status})`);
  return res.json();
}

export async function updateAnnouncement(id, payload, { legacy } = {}) {
  const qs = legacy ? `?legacy=true` : "";
  const res = await fetch(`${BASE}/${id}/${qs}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to update announcement (${res.status})`);
  return res.json();
}

export async function deleteAnnouncement(id, { legacy } = {}) {
  const qs = legacy ? `?legacy=true` : "";
  const res = await fetch(`${BASE}/${id}/${qs}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to delete announcement (${res.status})`);
  return res.json();
}
