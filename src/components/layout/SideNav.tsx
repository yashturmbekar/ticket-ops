import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdHub,
  MdSupportAgent,
  MdAnalytics,
  MdSecurity,
  MdInventory2,
  MdAdminPanelSettings,
  MdSchedule,
} from "react-icons/md";
import {
  HiOutlineCog6Tooth,
  HiOutlineUserGroup,
  HiOutlineTicket,
  HiOutlineComputerDesktop,
  HiOutlineBookOpen,
  HiOutlinePresentationChartLine,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";
import { useNavigation } from "../../hooks/useNavigation";
import "./SideNav.css";

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

  // Professional icon mapping for navigation items
  const getIcon = (iconName: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      // Primary Navigation
      dashboard: <MdDashboard className="nav-icon" />,
      ticket: <HiOutlineTicket className="nav-icon" />,
      tickets: <HiOutlineTicket className="nav-icon" />,
      assets: <HiOutlineComputerDesktop className="nav-icon" />,
      users: <HiOutlineUserGroup className="nav-icon" />,
      people: <HiOutlineUserGroup className="nav-icon" />,
      departments: <HiOutlineBuildingOffice2 className="nav-icon" />,
      business: <HiOutlineBuildingOffice2 className="nav-icon" />,
      knowledge: <HiOutlineBookOpen className="nav-icon" />,
      reports: <HiOutlinePresentationChartLine className="nav-icon" />,
      assessment: <HiOutlinePresentationChartLine className="nav-icon" />,
      network: <MdHub className="nav-icon" />,
      settings: <HiOutlineCog6Tooth className="nav-icon" />,
      schedule: <MdSchedule className="nav-icon" />,

      // Alternative professional icons
      analytics: <MdAnalytics className="nav-icon" />,
      support: <MdSupportAgent className="nav-icon" />,
      security: <MdSecurity className="nav-icon" />,
      inventory: <MdInventory2 className="nav-icon" />,
      admin: <MdAdminPanelSettings className="nav-icon" />,
    };
    return iconMap[iconName] || <HiOutlineCog6Tooth className="nav-icon" />;
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
                  data-tooltip={isCollapsed ? item.label : undefined}
                >
                  <div className="modern-nav-icon">
                    {getIcon(item.icon || "settings")}
                  </div>

                  {!isCollapsed && (
                    <>
                      <span className="modern-nav-label">{item.label}</span>
                    </>
                  )}

                  {/* Collapsed state tooltip indicator - removed badge */}
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
