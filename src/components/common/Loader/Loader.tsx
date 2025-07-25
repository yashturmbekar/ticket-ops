import React from "react";
import { FaTicketAlt } from "react-icons/fa";
import "./Loader.css";

export interface LoaderProps {
  /** Size variant of the loader */
  size?: "small" | "medium" | "large";
  /** Color variant of the loader */
  variant?: "primary" | "secondary" | "white";
  /** Optional loading text to display */
  text?: string;
  /** Whether to center the loader vertically and horizontally */
  centered?: boolean;
  /** Custom className for additional styling */
  className?: string;
  /** Minimum height for the loader container when centered */
  minHeight?: string;
  /** Use the moving ticket animation instead of dots */
  useTicketAnimation?: boolean;
  /** Custom message for ticket animation */
  ticketMessage?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = "medium",
  variant = "primary",
  text,
  centered = false,
  className = "",
  minHeight = "200px",
  useTicketAnimation = false,
  ticketMessage,
}) => {
  const loaderClasses = [
    "professional-loader",
    `professional-loader--${size}`,
    `professional-loader--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const containerClasses = [
    "professional-loader-container",
    centered ? "professional-loader-container--centered" : "",
    useTicketAnimation ? "professional-loader-container--ticket" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const containerStyle = centered ? { minHeight } : {};

  // Render ticket animation loader
  if (useTicketAnimation) {
    return (
      <div className={containerClasses} style={containerStyle}>
        <div className="professional-ticket-loader">
          <div className="ticket-animation-container">
            <div className="ticket-moving-group">
              <div className="ticket-icon">
                <FaTicketAlt />
              </div>
              {text && <h3 className="ticket-title">{text}</h3>}
            </div>
          </div>
          {ticketMessage && <p className="ticket-message">{ticketMessage}</p>}
          <div className="ticket-progress"></div>
        </div>
      </div>
    );
  }

  // Render default dot loader
  return (
    <div className={containerClasses} style={containerStyle}>
      <div className={loaderClasses}>
        <div className="professional-loader__spinner">
          <div className="professional-loader__dot professional-loader__dot--1"></div>
          <div className="professional-loader__dot professional-loader__dot--2"></div>
          <div className="professional-loader__dot professional-loader__dot--3"></div>
        </div>
      </div>
      {text && <p className="professional-loader__text">{text}</p>}
    </div>
  );
};

export default Loader;
