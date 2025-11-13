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
  async getEarnings(userId, { timeRange = "6months", userType = "university-student" } = {}) {
    if (!userId) {
      throw new Error("A valid userId is required to fetch earnings data.");
    }

    const searchParams = new URLSearchParams();
    searchParams.append("user_id", userId);
    if (timeRange) {
      searchParams.append("time_range", timeRange);
    }

    // Determine the correct endpoint based on user type
    let url;
    if (userType === "pre-mentor") {
      url = `${API_BASE_URL}/pre-mentors/earnings/?${searchParams.toString()}`;
    } else {
      // Default to university-students endpoint
      url = `${API_BASE_URL}/university-students/user/${userId}/earnings/?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
      credentials: "include",
    });

    return buildResponse(response);
  },
};

export default earningsAPI;
