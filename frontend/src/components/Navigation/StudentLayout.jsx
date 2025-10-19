import React from "react";
import StudentNavbar from "./StudentNavbar";
import ChatSidebar from "../UniStudents/Chat";
import { useChatContext } from "../../context/ChatContext";

const StudentLayout = ({ children }) => {
  const { isChatOpen, selectedUser, closeChat } = useChatContext();

  return (
    <div className="min-h-screen bg-primary-50">
      <StudentNavbar />
      <ChatSidebar
        isOpen={isChatOpen}
        onClose={closeChat}
        selectedUser={selectedUser}
      />
      <main className="pt-4">{children}</main>
    </div>
  );
};

export default StudentLayout;
