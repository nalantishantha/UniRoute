import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { getCurrentUser } from "../utils/auth";

// WebSocket connects to backend; override with Vite env var VITE_BACKEND_WS_HOST if needed
// In Vite use import.meta.env.VITE_BACKEND_WS_HOST
const BACKEND_WS_HOST = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_WS_HOST) || '127.0.0.1:8000';
const WS_URL = (userId) => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${BACKEND_WS_HOST}/ws/chat/?user_id=${userId}`;
}

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState({}); // messages per user id
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const wsRef = useRef(null);

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser && !wsRef.current) {
      try {
        const ws = new WebSocket(WS_URL(currentUser.user_id));
        ws.onopen = () => console.log('chat ws open');
        ws.onmessage = (e) => {
          const data = JSON.parse(e.data);
          if (data.action === 'message') {
            const msg = data.message;
            const otherId = msg.sender_id === currentUser.user_id ? msg.receiver_id : msg.sender_id;

            // append message to conversation
            setMessages((prev) => {
              const conv = prev[otherId] || [];
              return { ...prev, [otherId]: [...conv, msg] };
            });

            // Update chatList in-place to reflect new last message and unread counts
            setChatList((prev) => {
              const next = prev ? [...prev] : [];
              const idx = next.findIndex((u) => u.user_id === otherId);
              const isForMe = msg.receiver_id === currentUser.user_id;
              if (idx !== -1) {
                const entry = { ...next[idx] };
                entry.last_message = msg.text || entry.last_message;
                entry.last_timestamp = msg.sent_at || entry.last_timestamp;
                // If the message is for me and I'm not viewing the conversation, increment unread
                if (isForMe) {
                  if (!selectedUser || selectedUser.user_id !== otherId) {
                    entry.unread = (entry.unread || 0) + 1;
                  } else {
                    // If chat is open with this user, we'll mark read below via fetchMessages
                  }
                }
                next.splice(idx, 1);
                // move to top
                next.unshift(entry);
                return next;
              } else {
                // Not in list, trigger a full refresh to pick up new conversation
                fetchChatList('');
                return next;
              }
            });

            // If we're the recipient and the conversation with sender is open, fetch messages to mark as read
            try {
              const amRecipient = msg.receiver_id === currentUser.user_id;
              if (amRecipient && selectedUser && selectedUser.user_id === otherId) {
                // fetchMessages will mark messages as read server-side and refresh chat list
                fetchMessages(otherId);
              } else if (amRecipient && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                // send delivered ack to notify sender
                const ack = { action: 'delivered', message_id: msg.id || msg.message_id, to: msg.sender_id };
                wsRef.current.send(JSON.stringify(ack));
              }
            } catch (err) {
              console.error('delivered ack / read refresh failed', err);
            }
          } else if (data.action === 'online') {
            setOnlineUsers((s) => new Set(Array.from(s).concat([data.user_id])));
          } else if (data.action === 'message_delivered') {
            // Sender received delivered ack for a message
            const { message_id, delivered_by } = data;
            if (message_id) {
              setMessages((prev) => {
                const next = { ...prev };
                Object.keys(next).forEach((otherId) => {
                  next[otherId] = next[otherId].map((m) => {
                    if ((m.id === message_id || m.message_id === message_id) && m.sender_id === currentUser.user_id) {
                      return { ...m, delivered: true };
                    }
                    return m;
                  });
                });
                return next;
              });
            }
          } else if (data.action === 'messages_read') {
            // another user read messages; refresh chat list to update unread counts
            // mark messages in state as read for the reader
            const readerId = data.reader_id;
            const lastId = data.last_read_message_id;
            if (lastId) {
              setMessages((prev) => {
                const next = { ...prev };
                Object.keys(next).forEach((otherId) => {
                  next[otherId] = next[otherId].map((m) => {
                    if (m.id <= lastId && m.sender_id === currentUser.user_id) {
                      return { ...m, is_read: true };
                    }
                    return m;
                  });
                });
                return next;
              });
            }
            // Also refresh chat list to update unread badges
            fetchChatList('');
          }
        };
        ws.onerror = (err) => console.error('chat ws error', err);
        ws.onclose = () => console.log('chat ws closed');
        wsRef.current = ws;
      } catch (e) {
        console.error('ws init error', e);
      }
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    }
  }, [currentUser]);

  // openChat defined below with fetching behavior

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedUser(null);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const fetchChatList = async (query = '') => {
    if (!currentUser) return;
    const res = await fetch(`/api/communications/chats/?user_id=${currentUser.user_id}&q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.success) setChatList(data.users || []);
  };

  const fetchMessages = async (otherUserId) => {
    if (!currentUser) return;
    const res = await fetch(`/api/communications/chats/${otherUserId}/messages/?me=${currentUser.user_id}`);
    const data = await res.json();
    if (data.success) {
      // mark messages sent by current user as delivered (they exist in DB)
      const msgs = (data.messages || []).map((m) => ({ ...m, delivered: m.sender_id === currentUser.user_id }));
      setMessages((prev) => ({ ...prev, [otherUserId]: msgs }));
      // After loading messages, refresh the chat list so unread counts clear
      await fetchChatList('');
    }
  };

  const sendMessage = async (toUserId, text) => {
    if (!currentUser) return;
    // send via REST to persist and notify recipient via channel layer
    try {
      const res = await fetch(`/api/communications/chats/${toUserId}/send/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ me: currentUser.user_id, text }),
      });
      const data = await res.json();
      if (data.success) {
        const msg = data.data || data.message || {};
        // normalize message shape
        const normalized = {
          id: msg.id || msg.message_id,
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          text: msg.text,
          sent_at: msg.sent_at,
          is_read: msg.is_read || 0,
          delivered: true, // we got persistence from server
        };
        setMessages((prev) => {
          const conv = prev[toUserId] || [];
          return { ...prev, [toUserId]: [...conv, normalized] };
        });
        // refresh chat list to show unread changes for the recipient side
        await fetchChatList('');
      }
    } catch (e) {
      console.error('sendMessage error', e);
    }
  };

  const openChat = (user = null) => {
    setSelectedUser(user);
    setIsChatOpen(true);
    if (user && user.user_id) fetchMessages(user.user_id);
  };


  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        selectedUser,
        chatList,
        messages,
        onlineUsers,
        fetchChatList,
        fetchMessages,
        sendMessage,
        openChat,
        closeChat,
        toggleChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
