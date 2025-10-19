// Service for university ad publishing endpoints

const API_BASE = "/api";

export async function uploadUniversityAdMedia(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/universities/university-ads/upload/`, {
    method: "POST",
    body: form,
  });
  return res.json();
}

export async function payForUniversityAd(ad, payment) {
  const res = await fetch(`${API_BASE}/payments/university-ad/pay/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ad, payment }),
  });
  return res.json();
}

export async function listUniversityAds(universityId) {
  const res = await fetch(
    `${API_BASE}/universities/university-ads/?university_id=${universityId}`
  );
  return res.json();
}
