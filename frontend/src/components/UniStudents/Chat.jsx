import React, { useState, useRef, useEffect } from "react";
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

const ChatSidebar = ({ isOpen, onClose, selectedUser = null }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChat, setActiveChat] = useState(selectedUser);
  const messagesEndRef = useRef(null);

  // Sample chat list
  const [chatList] = useState([
    {
      id: "1",
      name: "John Doe",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Thanks for the help with calculus!",
      timestamp: "2 min ago",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      name: "Sarah Wilson",
      avatar: "/api/placeholder/40/40",
      lastMessage: "When is our next mentoring session?",
      timestamp: "1 hour ago",
      unread: 0,
      online: false,
    },
    {
      id: "3",
      name: "Mike Johnson",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Great explanation on physics concepts",
      timestamp: "3 hours ago",
      unread: 1,
      online: true,
    },
  ]);

  // Sample messages for active chat
  const [chatMessages] = useState({
    1: [
      {
        id: 1,
        text: "Hi! I need help with calculus problems",
        sender: "them",
        timestamp: "10:30 AM",
      },
      {
        id: 2,
        text: "Of course! I'd be happy to help. What specific topic are you struggling with?",
        sender: "me",
        timestamp: "10:32 AM",
      },
      {
        id: 3,
        text: "Integration by parts. I'm having trouble understanding when to use it.",
        sender: "them",
        timestamp: "10:35 AM",
      },
      {
        id: 4,
        text: "Great question! Let me explain the LIATE rule for choosing u and dv...",
        sender: "me",
        timestamp: "10:36 AM",
      },
    ],
    2: [
      {
        id: 1,
        text: "When is our next mentoring session?",
        sender: "them",
        timestamp: "9:00 AM",
      },
    ],
    3: [
      {
        id: 1,
        text: "Great explanation on physics concepts",
        sender: "them",
        timestamp: "8:00 AM",
      },
    ],
  });

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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && activeChat) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  const handleBackToList = () => {
    setActiveChat(null);
  };

  const filteredChats = chatList.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMessages = activeChat ? chatMessages[activeChat.id] || [] : [];

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
                        key={chat.id}
                        onClick={() => setActiveChat(chat)}
                        className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                      >
                        <div className="relative">
                          <img
                            src={chat.avatar}
                            alt={chat.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {chat.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {chat.name}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {chat.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {chat.lastMessage}
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
                      alt={activeChat.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {activeChat.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {activeChat.online ? "Online" : "Last seen 2 hours ago"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {currentMessages.length > 0 ? (
                    <>
                      {currentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender === "me"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.sender === "me"
                                ? "bg-primary-500 text-white"
                                : "bg-white text-gray-900 shadow-sm"
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.sender === "me"
                                  ? "text-primary-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {msg.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                      {messages.map((msg) => (
                        <div key={msg.id} className="flex justify-end">
                          <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-primary-500 text-white">
                            <p className="text-sm">{msg.text}</p>
                            <p className="text-xs mt-1 text-primary-100">
                              {msg.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
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
                          Send a message to {activeChat.name}
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
