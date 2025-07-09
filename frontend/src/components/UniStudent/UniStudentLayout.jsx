import { useState, useEffect } from "react";
import UniStudentSidebar from "./UniStudentSidebar";
import TopNavigation from "./TopNavigation";

export default function Layout({ children }) {
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
      <UniStudentSidebar isOpen={isDesktop || sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-neutral-silver to-neutral-silver/50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

