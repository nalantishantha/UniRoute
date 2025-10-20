const API_BASE_URL = "http://127.0.0.1:8000/api";

const buildResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.message || data?.detail || "Unexpected server error";
    throw new Error(message);
  }

  return data;
};

export const earningsAPI = {
  async getEarnings(userId, { timeRange = "6months" } = {}) {
    if (!userId) {
      throw new Error("A valid userId is required to fetch earnings data.");
    }

    const searchParams = new URLSearchParams();
    if (timeRange) {
      searchParams.append("time_range", timeRange);
    }

    const url = `${API_BASE_URL}/university-students/user/${userId}/earnings/?${searchParams.toString()}`;
    const response = await fetch(url, {
      credentials: "include",
    });

    return buildResponse(response);
  },
};

export default earningsAPI;
