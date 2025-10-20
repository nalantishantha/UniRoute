const API_BASE = "/api/universities";

export async function fetchPortfolio(universityId) {
  const res = await fetch(
    `/api/universities/manage-portfolio/?university_id=${universityId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch portfolio");
  return res.json();
}

export async function createPortfolio(universityId, initial = {}) {
  const res = await fetch(`/api/universities/manage-portfolio/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ university_id: universityId, ...initial }),
  });
  if (!res.ok) throw new Error("Failed to create portfolio");
  return res.json();
}

export async function updatePortfolio(portfolioId, partial) {
  const res = await fetch(
    `/api/universities/manage-portfolio/${portfolioId}/update/`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    }
  );
  if (!res.ok) throw new Error("Failed to update portfolio");
  return res.json();
}
