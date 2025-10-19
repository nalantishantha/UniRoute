const API = "/api/mentoring/university";

export async function fetchMentorRequests(universityId) {
  const res = await fetch(
    `${API}/mentor-requests/?university_id=${encodeURIComponent(universityId)}`
  );
  return res.json();
}

export async function fetchActiveMentors(universityId) {
  const res = await fetch(
    `${API}/active-mentors/?university_id=${encodeURIComponent(universityId)}`
  );
  return res.json();
}

export async function acceptMentor(preMentorId) {
  const res = await fetch(`${API}/mentor-requests/${preMentorId}/accept/`, {
    method: "POST",
  });
  return res.json();
}

export async function rejectMentor(preMentorId, reason) {
  const res = await fetch(`${API}/mentor-requests/${preMentorId}/reject/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  return res.json();
}
