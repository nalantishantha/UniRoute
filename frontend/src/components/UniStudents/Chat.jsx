import React, { useState, useRef, useEffect } from "react";
import { useChatContext } from "../../context/ChatContext";
import { getCurrentUser } from "../../utils/auth";
import {
  X,
  Send,
  MessageSquare,
  Users,
  Search,
  Phone,
  Video,
  ArrowLeft,
} from "lucide-react";
import Button from "../../components/ui/Button";
import UserProfileSidebar from './UserProfileSidebar';

const ChatSidebar = ({ isOpen, onClose, selectedUser = null }) => {
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChat, setActiveChat] = useState(selectedUser);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);
  const { fetchChatList, chatList, fetchMessages, messages, sendMessage, onlineUsers, openChat } = useChatContext();

  // Load chat list on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingList(true);
      try {
        await fetchChatList('');
      } finally {
        if (mounted) setLoadingList(false);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      fetchChatList(searchTerm);
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Note: above require hack is for static edit; we'll import hook normally
  const messagesEndRef = useRef(null);

  // chatList and messages come from context

  useEffect(() => {
    if (selectedUser) {
      setActiveChat(selectedUser);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = message.trim();
    if (text && activeChat) {
      // Clear the input immediately for better UX, then send in background.
      setMessage("");
      try {
        await sendMessage(activeChat.user_id, text);
      } catch (err) {
        // If send fails, we could optionally restore the message or show an error.
        console.error('sendMessage failed', err);
      }
    }
  };

  const handleBackToList = () => {
    setActiveChat(null);
  };

  const filteredChats = (chatList || []).filter(
    (chat) =>
      chat.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (chat.last_message || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMessages = activeChat ? messages[activeChat.user_id] || [] : [];
  const currentUser = getCurrentUser();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:bg-transparent"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary-50">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-primary-600" />
              <h2 className="text-lg font-semibold text-primary-900">
                Messages
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-primary-600" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Chat List - Show when no active chat OR on larger screens */}
            {!activeChat && (
              <div className="flex flex-col w-full">
                {/* Search */}
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

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                  {filteredChats.length > 0 ? (
                    filteredChats.map((chat) => (
                      <div
                        key={chat.user_id}
                        onClick={() => {
                          setActiveChat(chat);
                          openChat(chat);
                        }}
                        className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                      >
                        <div className="relative">
                          <img
                            src={chat.avatar}
                            alt={chat.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {(onlineUsers && onlineUsers.has && onlineUsers.has(chat.user_id)) || chat.online ? (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          ) : null}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {chat.full_name || chat.username}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {chat.timestamp}
                            </span>
                          </div>
                            <p className="text-sm text-gray-600 truncate">
                            {chat.last_message || ''}
                          </p>
                        </div>
                        {chat.unread > 0 && (
                          <div className="ml-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {chat.unread}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 flex items-center justify-center p-8">
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No conversations found
                        </h3>
                        <p className="text-gray-500">
                          {searchTerm
                            ? "Try a different search term"
                            : "Start a new conversation"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Chat Window - Show when active chat is selected */}
            {activeChat && (
              <div className="flex flex-col w-full">
                {/* Chat Header with Back Button */}
                <div className="flex items-center p-4 border-b border-gray-200 bg-white">
                  <button
                    onClick={handleBackToList}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <div className="flex items-center space-x-3 flex-1">
                    <img
                      src={activeChat.avatar}
                      alt={activeChat.full_name || activeChat.username || activeChat.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <button
                        onClick={() => setProfileSidebarOpen(true)}
                        className="text-left w-full"
                      >
                        <h3 className="font-medium text-gray-900">
                          {activeChat.full_name || activeChat.username || activeChat.name}
                        </h3>
                      </button>
                      {activeChat.online ? (
                        <p className="text-sm text-gray-500">Online</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* User profile sidebar component (renders as overlay) */}
                <UserProfileSidebar userId={activeChat?.user_id} isOpen={profileSidebarOpen} onClose={() => setProfileSidebarOpen(false)} />

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {currentMessages.length > 0 ? (
                    <>
                          {currentMessages.map((msg) => {
                            const isMine = currentUser && msg.sender_id === currentUser.user_id;
                            const timeStr = msg.sent_at ? new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                            return (
                              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isMine ? 'bg-primary-500 text-white' : 'bg-white text-gray-900 shadow-sm'}`}>
                                  <p className="text-sm">{msg.text}</p>
                                  <div className="flex items-center justify-between">
                                    <p className={`text-xs mt-1 ${isMine ? 'text-primary-100' : 'text-gray-500'}`}>{timeStr}</p>
                                    {isMine && (
                                      <span className="ml-2 inline-flex items-center">
                                        {/* single tick = delivered, double tick = read */}
                                        {msg.is_read ? (
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                                          </svg>
                                        ) : msg.delivered ? (
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-100" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M7.707 10.293a1 1 0 00-1.414 1.414l1.414-1.414z" />
                                            <path d="M10.707 7.293a1 1 0 00-1.414 1.414l1.414-1.414z" />
                                          </svg>
                                        ) : null}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
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
                          Send a message to {activeChat.full_name || activeChat.username}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-gray-200 bg-white"
                >
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    />
                    <Button type="submit" disabled={!message.trim()}>
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
