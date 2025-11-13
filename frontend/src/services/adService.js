// Simple service for ad publishing endpoints

const API_BASE = "/api";

export async function uploadAdMedia(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/companies/company-ads/upload/`, {
    method: "POST",
    body: form,
  });
  return res.json();
}

export async function createCompanyAd(ad) {
  const res = await fetch(`${API_BASE}/companies/company-ads/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ad),
  });
  return res.json();
}

export async function payForCompanyAd(ad, payment) {
  const res = await fetch(`${API_BASE}/payments/company-ad/pay/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ad, payment }),
  });
  return res.json();
}

export async function listCompanyAds(companyId) {
  const res = await fetch(
    `${API_BASE}/companies/company-ads/?company_id=${companyId}`
  );
  return res.json();
}
