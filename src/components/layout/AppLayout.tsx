import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import SideNavModern from "./SideNav";
import { Breadcrumb } from "../common/Breadcrumb";
import { FloatingActionButton } from "../common/FloatingActionButton";
import "./AppLayout.css";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Close mobile menu when clicking outside or on navigation
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        !(event.target as Element).closest(".modern-sidebar")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="modern-app-layout">
      <Header
        onMenuToggle={toggleMobileMenu}
        onSidebarToggle={toggleSidebar}
        isMenuOpen={isMobileMenuOpen}
        isCollapsed={isCollapsed}
      />

      <div className="modern-app-body">
        <SideNavModern
          isMobileMenuOpen={isMobileMenuOpen}
          isCollapsed={isCollapsed}
          onMobileMenuToggle={toggleMobileMenu}
        />

        <main
          className={`modern-main-content ${
            isCollapsed ? "sidebar-collapsed" : ""
          }`}
        >
          <div className="modern-content-header">
            <Breadcrumb />
          </div>

          <div className="modern-content-body">{children}</div>
        </main>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={toggleMobileMenu} />
      )}

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};

export default AppLayout;
