import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import "./FloatingActionButton.css";

interface FloatingActionButtonProps {
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  className = "",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide FAB on create ticket page
  if (location.pathname === "/tickets/create") {
    return null;
  }

  const handleCreateTicket = () => {
    navigate("/tickets/create");
  };

  return (
    <button
      className={`floating-action-button ${className}`}
      onClick={handleCreateTicket}
      title="Create Ticket"
      aria-label="Create Ticket"
    >
      <FaPlus className="fab-icon" />
      <span className="fab-tooltip">Create Ticket</span>
    </button>
  );
};

export default FloatingActionButton;
