import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./UniversityStudentSidebar";
import TopNavigation from "./UniversityStudentNavbar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-neutral-silver to-neutral-light-grey">
      <Sidebar isOpen={isDesktop || sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-neutral-silver to-neutral-silver/50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// import React from 'react';
// import UniversityStudentNavbar from './UniversityStudentNavbar';

// const UniversityStudentLayout = ({ children }) => {
//   return (
//     <div className="min-h-screen bg-primary-50">
//       <UniversityStudentNavbar />
//       <main className="pt-4">
//         {children}
//       </main>
//     </div>
//   );
// };

// export default UniversityStudentLayout;
