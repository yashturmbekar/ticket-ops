import React, { useState } from "react";
import { Header } from "./Header.tsx";
import { Sidebar } from "./Sidebar.tsx";
import "./MainLayout.css";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="main-layout">
      <Header onMenuToggle={handleMenuToggle} isMenuOpen={isSidebarOpen} />
      <div className="layout-content">
        <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};
