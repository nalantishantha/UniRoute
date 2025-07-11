import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Paperclip,
  Smile,
  Search,
  Phone,
  Video,
  MoreVertical,
  User,
} from "lucide-react";

const mockChats = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: null,
    lastMessage: "Thanks for the math help today!",
    timestamp: "2 min ago",
    unread: 2,
    online: true,
    type: "tutoring",
  },
  {
    id: 2,
    name: "Mike Brown",
    avatar: null,
    lastMessage: "When can we schedule the next mentoring session?",
    timestamp: "15 min ago",
    unread: 1,
    online: false,
    type: "mentoring",
  },
  {
    id: 3,
    name: "Emma Wilson",
    avatar: null,
    lastMessage: "The physics concepts are much clearer now",
    timestamp: "1 hour ago",
    unread: 0,
    online: true,
    type: "tutoring",
  },
  {
    id: 4,
    name: "Alex Johnson",
    avatar: null,
    lastMessage: "Thank you for the university application guidance",
    timestamp: "3 hours ago",
    unread: 0,
    online: false,
    type: "mentoring",
  },
];

const mockMessages = [
  {
    id: 1,
    senderId: 1,
    text: "Hi! I'm having trouble with calculus derivatives",
    timestamp: "10:30 AM",
    isMe: false,
  },
  {
    id: 2,
    senderId: "me",
    text: "No problem! Let's work through some examples together. Which specific part are you struggling with?",
    timestamp: "10:32 AM",
    isMe: true,
  },
  {
    id: 3,
    senderId: 1,
    text: "I don't understand the chain rule and how to apply it",
    timestamp: "10:35 AM",
    isMe: false,
  },
  {
    id: 4,
    senderId: "me",
    text: "Great question! The chain rule is used when you have a composite function. Let me share a step-by-step example.",
    timestamp: "10:36 AM",
    isMe: true,
  },
  {
    id: 5,
    senderId: 1,
    text: "Thanks for the math help today!",
    timestamp: "11:45 AM",
    isMe: false,
  },
];

export default function Chat({ isOpen, onClose }) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message logic here
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = mockChats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end pr-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Messages</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {selectedChat && (
              <div className="mt-2 flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{selectedChat.name}</p>
                  <p className="text-xs text-white/80">
                    {selectedChat.online ? "Online" : "Last seen 2 hours ago"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {!selectedChat ? (
            /* Chat List */
            <div className="flex-1 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-neutral-silver">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-grey" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-neutral-silver/50 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white"
                  />
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {filteredChats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    whileHover={{ backgroundColor: "#f8f9fa" }}
                    onClick={() => setSelectedChat(chat)}
                    className="p-4 border-b border-neutral-silver/50 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        {chat.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-neutral-black truncate">
                            {chat.name}
                          </p>
                          <span className="text-xs text-neutral-grey">
                            {chat.timestamp}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-neutral-grey truncate">
                            {chat.lastMessage}
                          </p>
                          {chat.unread > 0 && (
                            <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                        <div className="mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              chat.type === "tutoring"
                                ? "bg-info/20 text-info"
                                : "bg-primary-100 text-primary-600"
                            }`}
                          >
                            {chat.type === "tutoring"
                              ? "Tutoring"
                              : "Mentoring"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            /* Chat Messages */
            <div className="flex-1 flex flex-col">
              {/* Back Button */}
              <div className="p-3 border-b border-neutral-silver">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  ← Back to chats
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.isMe
                          ? "bg-primary-500 text-white"
                          : "bg-neutral-silver text-neutral-black"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.isMe ? "text-white/80" : "text-neutral-grey"
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-neutral-silver">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-neutral-grey hover:text-primary-600 transition-colors">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-2 bg-neutral-silver/50 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white"
                    />
                  </div>
                  <button className="p-2 text-neutral-grey hover:text-primary-600 transition-colors">
                    <Smile className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
