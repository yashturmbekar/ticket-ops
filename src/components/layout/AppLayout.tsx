import React, { useState } from "react";
import SideNav from "./SideNav";
import { Breadcrumb } from "../common/Breadcrumb";
import "./AppLayout.css";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="app-layout">
      <SideNav
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={toggleMobileMenu}
      />
      <div className="app-content">
        <div className="mobile-header">
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
          <div className="mobile-brand">
            <img src="/redfish-logo.svg" alt="Redfish" width="24" height="24" />
            <span>IT Ticket System</span>
          </div>
        </div>
        <Breadcrumb />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
