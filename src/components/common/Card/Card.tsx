import React from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";
import "./Card.css";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "outline" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  header?: ReactNode;
  footer?: ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  padding = "md",
  header,
  footer,
  className,
  ...props
}) => {
  const cardClasses = clsx(
    "card",
    `card-${variant}`,
    `card-padding-${padding}`,
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};
