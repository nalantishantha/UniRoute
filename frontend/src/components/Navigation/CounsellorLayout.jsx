import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./CounsellorSidebar";
import TopNavigation from "./CounsellorNavbar";

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

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavigation onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-neutral-silver to-neutral-silver/50">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

