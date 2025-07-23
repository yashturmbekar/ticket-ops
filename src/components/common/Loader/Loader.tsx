import React from "react";
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
}

export const Loader: React.FC<LoaderProps> = ({
  size = "medium",
  variant = "primary",
  text,
  centered = false,
  className = "",
  minHeight = "200px",
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
  ]
    .filter(Boolean)
    .join(" ");

  const containerStyle = centered ? { minHeight } : {};

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
