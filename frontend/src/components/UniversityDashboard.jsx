import React, { useState } from "react";
import UniHeader from "./UniHeader";
import UniSidebar from "./UniSidebar";

const UniversityDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div>
      <UniSidebar collapsed={sidebarCollapsed} />
      <UniHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
      />
      <main
        style={{
          marginLeft: sidebarCollapsed ? 64 : 240,
          marginTop: 64,
          padding: 32,
          minHeight: "calc(100vh - 64px)",
          background: "#f8fafc",
          transition: "margin-left 0.3s",
        }}
      >
        {/* Your dashboard content goes here */}
        <h2>Welcome to the University Dashboard</h2>
        <p>This area adapts to sidebar state.</p>
      </main>
    </div>
  );
};

export default UniversityDashboard;