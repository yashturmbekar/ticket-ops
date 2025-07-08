import React, { useState } from "react";
import type { ReactNode } from "react";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";
import "./PageLayout.css";

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="page-layout">
      <Header onMenuToggle={handleMenuToggle} isMenuOpen={isSidebarOpen} />

      <div className="page-content">
        <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />

        <main className="page-main">
          <div className="page-main-content">{children}</div>
        </main>
      </div>
    </div>
  );
};
