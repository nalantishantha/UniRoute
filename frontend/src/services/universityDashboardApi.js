// Simple API client for University Dashboard Admin endpoints
const API_BASE = "/api/universities";

export async function fetchDashboard(universityId) {
  const url = `${API_BASE}/dashboard-admin/?university_id=${encodeURIComponent(
    universityId
  )}`;
  const res = await fetch(url);
  return res.json();
}

export async function createDashboard(universityId, initialPayload = {}) {
  const res = await fetch(`${API_BASE}/dashboard-admin/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ university_id: universityId, ...initialPayload }),
  });
  return res.json();
}

// update accepts a partial payload of fields to update; server resolves dashboard_id by lookup
export async function updateDashboard(universityId, partial) {
  // First get or create dashboard to obtain dashboard_id
  const getRes = await fetchDashboard(universityId);
  let dashboardId = getRes?.dashboard?.dashboard_id;
  if (!dashboardId) {
    const created = await createDashboard(universityId);
    dashboardId = created?.dashboard_id;
  }
  const res = await fetch(
    `${API_BASE}/dashboard-admin/${dashboardId}/update/`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    }
  );
  return res.json();
}
