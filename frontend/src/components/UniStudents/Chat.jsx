import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  MessageSquare,
  Phone,
  Search,
  Send,
  Video,
  X,
} from "lucide-react";
import Button from "../../components/ui/Button";
import { useChatContext } from "../../context/ChatContext";
import { getCurrentUser } from "../../utils/auth";
import { chatAPI, generateRoomId } from "../../utils/chatAPI";

const WS_BASE_URL =
  import.meta.env.VITE_CHAT_WS_BASE || "ws://127.0.0.1:8000";

const ChatSidebar = ({ isOpen: propIsOpen, onClose: propOnClose, selectedUser: propSelectedUser = null }) => {
  const {
    isChatOpen,
    selectedUser,
    setSelectedUser,
    setUnreadCount,
    refreshFlag,
    closeChat,
    forceListKey,
  } = useChatContext();

  const isOpen = propIsOpen ?? isChatOpen;
  const handleClose = propOnClose ?? closeChat;
  const preselectedUser = propSelectedUser ?? selectedUser;

  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageDraft, setMessageDraft] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  const messagesEndRef = useRef(null);

  const currentUserId = currentUser?.user_id;

  const activePeerId = activeConversation?.user?.user_id;
  const activeRoomId = useMemo(() => {
    if (!currentUserId || !activePeerId) {
      return null;
    }
    return activeConversation?.room_id || generateRoomId(currentUserId, activePeerId);
  }, [currentUserId, activePeerId, activeConversation?.room_id]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setActiveConversation(null);
      setMessages([]);
      if (socket) {
        socket.close();
      }
    }
  }, [isOpen, socket]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setActiveConversation(null);
    setMessages([]);
  }, [forceListKey, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setCurrentUser(getCurrentUser());
    }
  }, [isOpen]);

  const loadConversations = useCallback(async () => {
    if (!currentUserId) {
      setConversations([]);
      setFilteredConversations([]);
      return;
    }
    try {
      setIsLoadingConversations(true);
      const data = await chatAPI.getConversations(currentUserId);
      const list = data.conversations || [];
      setConversations(list);
      setFilteredConversations(list);
      const unreadTotal = list.reduce(
        (total, item) => total + (item.unread_count || 0),
        0
      );
      setUnreadCount(unreadTotal);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingConversations(false);
    }
  }, [currentUserId, setUnreadCount]);

  useEffect(() => {
    if (isOpen && currentUserId) {
      loadConversations();
    }
  }, [isOpen, currentUserId, loadConversations, refreshFlag]);

  useEffect(() => {
    if (!preselectedUser || !isOpen) {
      return;
    }

    let isCancelled = false;
    setError(null);

    const ensureConversation = async () => {
      let resolvedUser = preselectedUser;
      let peerId = resolvedUser.user_id || resolvedUser.userId || null;

      if (!peerId && (resolvedUser.student_id || resolvedUser.university_student_id)) {
        try {
          const response = await chatAPI.resolveParticipant({
            studentId: resolvedUser.student_id,
            universityStudentId: resolvedUser.university_student_id,
          });
          if (!isCancelled && response?.user) {
            resolvedUser = response.user;
            peerId = response.user.user_id;
            setSelectedUser(response.user);
          }
        } catch (err) {
          if (!isCancelled) {
            setError(err.message);
          }
        }
      }

      if (!peerId && resolvedUser.id && resolvedUser.user_type) {
        peerId = resolvedUser.id;
      }

      if (!peerId || isCancelled) {
        return;
      }

      if (activeConversation?.user?.user_id === peerId) {
        return;
      }

      const conversationFromList = conversations.find(
        (convo) => convo.user?.user_id === peerId
      );

      if (conversationFromList) {
        if (!isCancelled) {
          setActiveConversation(conversationFromList);
        }
        return;
      }

      const placeholderConversation = {
        room_id: currentUserId ? generateRoomId(currentUserId, peerId) : null,
        user: {
          user_id: peerId,
          full_name: resolvedUser.full_name || resolvedUser.name || "",
          username: resolvedUser.username || resolvedUser.email || "",
          email: resolvedUser.email || "",
          user_type: resolvedUser.user_type || "student",
          profile_picture: resolvedUser.profile_picture || null,
        },
        last_message: "",
        last_message_time: null,
        unread_count: 0,
      };

      if (!isCancelled) {
        setActiveConversation(placeholderConversation);
        setConversations((prev) => {
          const exists = prev.some((item) => item.user?.user_id === peerId);
          if (exists) return prev;
          return [placeholderConversation, ...prev];
        });
      }
    };

    ensureConversation();

    return () => {
      isCancelled = true;
    };
  }, [
    preselectedUser,
    conversations,
    isOpen,
    currentUserId,
    activeConversation?.user?.user_id,
    setSelectedUser,
  ]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredConversations(conversations);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = conversations.filter((conversation) => {
      const name =
        conversation.user?.full_name || conversation.user?.username || "";
      const lastMessage = conversation.last_message || "";
      return (
        name.toLowerCase().includes(lower) ||
        lastMessage.toLowerCase().includes(lower)
      );
    });
    setFilteredConversations(filtered);
  }, [searchTerm, conversations]);

  const loadMessages = useCallback(
    async (conversation) => {
      if (!currentUserId || !conversation?.user?.user_id) {
        setMessages([]);
        return;
      }
      try {
        setIsLoadingMessages(true);
        setError(null);
        const data = await chatAPI.getMessages(
          currentUserId,
          conversation.user.user_id
        );
        setMessages(data.messages || []);
        setConversations((prev) =>
          prev.map((item) =>
            item.user?.user_id === conversation.user.user_id
              ? { ...item, unread_count: 0 }
              : item
          )
        );
        setUnreadCount((prev) => Math.max(prev - (conversation.unread_count || 0), 0));
        scrollToBottom();
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [currentUserId, scrollToBottom, setUnreadCount]
  );

  useEffect(() => {
    if (activeConversation && isOpen) {
      loadMessages(activeConversation);
    } else {
      setMessages([]);
    }
  }, [activeConversation, loadMessages, isOpen]);

  useEffect(() => {
    if (!activeRoomId || !currentUserId || !activePeerId || !isOpen) {
      return;
    }

    const ws = new WebSocket(
      `${WS_BASE_URL}/ws/chat/${activeRoomId}/?user_id=${currentUserId}&peer_id=${activePeerId}`
    );

    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onclose = () => {
      setSocket(null);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chat_message" && data.message) {
          const message = data.message;
          const isIncoming = message.sender_id !== currentUserId;
          const isActiveConversation =
            activePeerId === message.sender_id ||
            activePeerId === message.receiver_id;

          setMessages((prev) => {
            const alreadyExists = prev.some(
              (item) => item.message_id === message.message_id
            );
            if (alreadyExists) {
              return prev;
            }
            return [...prev, message];
          });

          setConversations((prev) =>
            prev.map((item) => {
              if (
                item.user?.user_id === message.sender_id ||
                item.user?.user_id === message.receiver_id
              ) {
                return {
                  ...item,
                  last_message: message.message_text,
                  last_message_time: message.sent_at,
                  unread_count:
                    isIncoming && !isActiveConversation
                      ? (item.unread_count || 0) + 1
                      : 0,
                };
              }
              return item;
            })
          );

          if (isIncoming && !isActiveConversation) {
            setUnreadCount((prev) => prev + 1);
          }

          if (isIncoming && isActiveConversation) {
            chatAPI
              .markRead(currentUserId, message.sender_id)
              .catch(() => {
                /* non-blocking */
              });
          }

          scrollToBottom();
        }
        if (data.type === "messages_read" && data.reader_id !== currentUserId) {
          setConversations((prev) =>
            prev.map((item) =>
              item.user?.user_id === data.reader_id
                ? { ...item, unread_count: 0 }
                : item
            )
          );
        }
      } catch (err) {
        console.error("Chat socket parse error", err);
      }
    };

    return () => {
      ws.close();
    };
  }, [activeRoomId, currentUserId, activePeerId, isOpen, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!messageDraft.trim() || !activeConversation || !activePeerId) {
      return;
    }

    const payload = {
      type: "message",
      message: messageDraft.trim(),
      receiver_id: activePeerId,
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
    } else {
      try {
        const response = await chatAPI.sendMessage(
          currentUserId,
          activePeerId,
          payload.message
        );
        if (response?.message) {
          setMessages((prev) => [...prev, response.message]);
        }
      } catch (err) {
        setError(err.message);
      }
    }

    setMessageDraft("");
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    setSelectedUser({
      user_id: conversation.user.user_id,
      full_name: conversation.user.full_name,
    });
  };

  const handleBackToList = () => {
    setActiveConversation(null);
  };

  const conversationsToRender = filteredConversations;

  const activeUserInfo = activeConversation?.user;
  const activeDisplayName =
    activeUserInfo?.full_name || activeUserInfo?.username || "";
  const hasActiveConversation = Boolean(activeConversation);

  const renderMessageBubble = (msg) => {
    const isMine = msg.sender_id === currentUserId;
    return (
      <div
        key={msg.message_id}
        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isMine
              ? "bg-primary-500 text-white"
              : "bg-white text-gray-900 shadow-sm"
          }`}
        >
          <p className="text-sm break-words">{msg.message_text}</p>
          <p
            className={`text-xs mt-1 ${
              isMine ? "text-primary-100" : "text-gray-500"
            }`}
          >
            {msg.sent_at
              ? new Date(msg.sent_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:bg-transparent"
          onClick={handleClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[34rem] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary-50">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-primary-600" />
              <h2 className="text-lg font-semibold text-primary-900">
                Messages
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-primary-600" />
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div
              className={`flex flex-col transition-all duration-200 bg-white ${
                hasActiveConversation
                  ? "hidden sm:flex sm:w-80 border-r border-gray-200"
                  : "flex w-full"
              }`}
            >
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {error && <div className="p-4 text-sm text-red-600">{error}</div>}
                {isLoadingConversations ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-primary-500">Loading conversations...</p>
                  </div>
                ) : conversationsToRender.length > 0 ? (
                  conversationsToRender.map((chat) => (
                    <button
                      type="button"
                      key={chat.user?.user_id || chat.room_id}
                      onClick={() => handleSelectConversation(chat)}
                      className="w-full text-left flex items-center p-4 hover:bg-gray-50 border-b border-gray-100"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                          {chat.user?.full_name?.charAt(0) || chat.user?.username?.charAt(0) || "U"}
                        </div>
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {chat.user?.full_name || chat.user?.username}
                          </h3>
                          {chat.last_message_time && (
                            <span className="text-xs text-gray-500">
                              {new Date(chat.last_message_time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {chat.last_message || "Start a conversation"}
                        </p>
                      </div>
                      {chat.unread_count > 0 && (
                        <div className="ml-2 bg-primary-500 text-white text-xs rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center">
                          {chat.unread_count}
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No conversations yet
                      </h3>
                      <p className="text-gray-500">
                        Start a conversation from mentoring or tutoring pages
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {hasActiveConversation && (
              <div className="flex flex-col flex-1 bg-gray-50">
                <div className="flex items-center p-4 border-b border-gray-200 bg-white">
                  <button
                    onClick={handleBackToList}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3 sm:hidden"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                      {activeDisplayName?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {activeDisplayName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Conversation active
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-primary-500">Loading messages...</p>
                    </div>
                  ) : messages.length > 0 ? (
                    <>
                      {messages.map((msg) => renderMessageBubble(msg))}
                      <div ref={messagesEndRef} />
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Start your conversation
                        </h3>
                        <p className="text-gray-500">
                          Send a message to {activeDisplayName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-gray-200 bg-white"
                >
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={messageDraft}
                      onChange={(e) => setMessageDraft(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    />
                    <Button type="submit" disabled={!messageDraft.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
