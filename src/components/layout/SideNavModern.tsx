import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTicketAlt,
  FaLaptop,
  FaUsers,
  FaBook,
  FaChartBar,
  FaNetworkWired,
  FaCog,
  FaBuilding,
} from "react-icons/fa";
import { useNavigation } from "../../hooks/useNavigation";
import "./SideNavModern.css";

interface SideNavProps {
  isMobileMenuOpen?: boolean;
  isCollapsed?: boolean;
  onMobileMenuToggle?: () => void;
}

const SideNavModern: React.FC<SideNavProps> = ({
  isMobileMenuOpen = false,
  isCollapsed = false,
  onMobileMenuToggle,
}) => {
  const { navigationItems, isLoading } = useNavigation();
  const location = useLocation();

  // Icon mapping for navigation items
  const getIcon = (iconName: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      dashboard: <FaTachometerAlt />,
      tickets: <FaTicketAlt />,
      assets: <FaLaptop />,
      users: <FaUsers />,
      departments: <FaBuilding />,
      knowledge: <FaBook />,
      reports: <FaChartBar />,
      network: <FaNetworkWired />,
      settings: <FaCog />,
    };
    return iconMap[iconName] || <FaCog />;
  };

  const isActive = (path: string): boolean => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Filter for main navigation items (not admin tools)
  const filteredItems = navigationItems;

  // Temporary fallback for testing when no items are loaded
  const fallbackItems = [
    { path: "/", label: "Dashboard", icon: "dashboard" },
    { path: "/tickets", label: "Tickets", icon: "tickets" },
    { path: "/assets", label: "Assets", icon: "assets" },
  ];

  const itemsToRender =
    filteredItems.length > 0 ? filteredItems : fallbackItems;

  if (isLoading) {
    return (
      <nav className="modern-sidebar">
        <div className="modern-sidebar-content">
          <div className="loading-state">Loading navigation...</div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="modern-sidebar-overlay" onClick={onMobileMenuToggle} />
      )}

      {/* Sidebar */}
      <nav
        className={`modern-sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileMenuOpen ? "mobile-open" : ""
        }`}
      >
        {/* Navigation List */}
        <div className="modern-sidebar-content">
          {/* Debug info */}
          {!isLoading && (
            <div style={{ color: "white", padding: "10px", fontSize: "12px" }}>
              Debug: {filteredItems.length} items, using {itemsToRender.length}{" "}
              items
            </div>
          )}

          <ul className="modern-nav-list">
            {itemsToRender.map((item) => (
              <li key={item.path} className="modern-nav-item">
                <Link
                  to={item.path}
                  className={`modern-nav-link ${
                    isActive(item.path) ? "active" : ""
                  }`}
                  onClick={() => {
                    if (isMobileMenuOpen && onMobileMenuToggle) {
                      onMobileMenuToggle();
                    }
                  }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="modern-nav-icon">
                    {getIcon(item.icon || "settings")}
                  </div>

                  {!isCollapsed && (
                    <>
                      <span className="modern-nav-label">{item.label}</span>
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar Footer */}
        <div className="modern-sidebar-footer">
          <div className="modern-brand-footer">
            <img
              src="/redfish-logo.svg"
              alt="Redfish"
              className="modern-footer-logo"
            />
            {!isCollapsed && (
              <span className="modern-footer-text">Ticket-Ops</span>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default SideNavModern;
