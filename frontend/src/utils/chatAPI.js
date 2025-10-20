const API_BASE_URL = "http://127.0.0.1:8000/api/communications";

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || "Chat request failed";
    throw new Error(message);
  }
  return data;
};

export const chatAPI = {
  async getConversations(userId) {
    const url = new URL(`${API_BASE_URL}/conversations/`);
    url.searchParams.set("user_id", userId);
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return handleResponse(response);
  },

  async getMessages(userId, peerId, limit = 50) {
    const url = new URL(`${API_BASE_URL}/messages/${peerId}/`);
    url.searchParams.set("user_id", userId);
    if (limit) {
      url.searchParams.set("limit", limit);
    }
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return handleResponse(response);
  },

  async sendMessage(senderId, receiverId, messageText) {
    const response = await fetch(`${API_BASE_URL}/messages/send/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_id: senderId,
        receiver_id: receiverId,
        message_text: messageText,
      }),
    });
    return handleResponse(response);
  },

  async markRead(userId, peerId) {
    const response = await fetch(`${API_BASE_URL}/messages/mark-read/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, peer_id: peerId }),
    });
    return handleResponse(response);
  },

  async resolveParticipant({ studentId, universityStudentId }) {
    const url = new URL(`${API_BASE_URL}/resolve-participant/`);
    if (studentId) {
      url.searchParams.set("student_id", studentId);
    }
    if (universityStudentId) {
      url.searchParams.set("university_student_id", universityStudentId);
    }
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return handleResponse(response);
  },
};

export const generateRoomId = (userId, peerId) => {
  const [a, b] = [Number(userId), Number(peerId)].sort((x, y) => x - y);
  return `room_${a}_${b}`;
};
