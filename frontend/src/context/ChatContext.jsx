import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

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
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [forceListKey, setForceListKey] = useState(0);

  const openChat = useCallback((user = null, options = {}) => {
    const showList = options.showList === true;
    if (showList) {
      setSelectedUser(null);
      setForceListKey((value) => value + 1);
    } else {
      setSelectedUser(user);
    }
    setIsChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
    setSelectedUser(null);
  }, []);

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  const triggerRefresh = useCallback(
    () => setRefreshFlag((value) => value + 1),
    []
  );

  const value = useMemo(
    () => ({
      isChatOpen,
      selectedUser,
      unreadCount,
      refreshFlag,
      openChat,
      closeChat,
      toggleChat,
      setUnreadCount,
      setSelectedUser,
      triggerRefresh,
      forceListKey,
    }),
    [
      isChatOpen,
      selectedUser,
      unreadCount,
      refreshFlag,
      openChat,
      closeChat,
      toggleChat,
      triggerRefresh,
      forceListKey,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
