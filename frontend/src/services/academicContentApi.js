// Academic Content API client
// Uses relative URLs so Vite will proxy to the Django backend (/api/...)

const BASE = "/api/university-programs/academic";

export async function getSummary(universityId) {
  const res = await fetch(
    `${BASE}/summary/?university_id=${encodeURIComponent(universityId)}`
  );
  if (!res.ok) throw new Error(`summary failed: ${res.status}`);
  return res.json();
}

export async function getFaculties(universityId) {
  const res = await fetch(
    `${BASE}/faculties/?university_id=${encodeURIComponent(universityId)}`
  );
  if (!res.ok) throw new Error(`faculties failed: ${res.status}`);
  return res.json();
}

export async function getProgramsByFaculty(facultyId) {
  const res = await fetch(`${BASE}/faculties/${facultyId}/programs/`);
  if (!res.ok) throw new Error(`programs failed: ${res.status}`);
  return res.json();
}

export async function getSubjectsByProgram(programId) {
  const res = await fetch(`${BASE}/programs/${programId}/subjects/`);
  if (!res.ok) throw new Error(`subjects failed: ${res.status}`);
  return res.json();
}

export async function createProgram({
  university_id,
  faculty_id,
  title,
  code = "",
  description = "",
}) {
  const res = await fetch(`${BASE}/programs/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      university_id,
      faculty_id,
      title,
      code,
      description,
    }),
  });
  if (!res.ok) throw new Error(`create program failed: ${res.status}`);
  return res.json();
}
