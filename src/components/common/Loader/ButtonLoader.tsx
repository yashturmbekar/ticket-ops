import React from "react";

export interface ButtonLoaderProps {
  /** Color variant of the button loader */
  variant?: "primary" | "secondary" | "white";
  /** Custom className for additional styling */
  className?: string;
}

export const ButtonLoader: React.FC<ButtonLoaderProps> = ({
  variant = "white",
  className = "",
}) => {
  const loaderClasses = [
    "professional-loader",
    "professional-loader--button",
    `professional-loader--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={loaderClasses}>
      <div className="professional-loader__spinner">
        <div className="professional-loader__dot"></div>
      </div>
    </div>
  );
};

export default ButtonLoader;
