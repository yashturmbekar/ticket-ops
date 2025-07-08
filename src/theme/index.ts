import type { ThemeConfig } from "../types";

export const lightTheme: ThemeConfig = {
  primary: "#ff5d5d",
  secondary: "#6c7293",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
  background: "#ffffff",
  surface: "#fafbfc",
  text: "#1e293b",
  textSecondary: "#64748b",
  border: "#e2e8f0",
  shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
};

export const darkTheme: ThemeConfig = {
  primary: "#ff5d5d",
  secondary: "#6c7293",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
  background: "#0f172a",
  surface: "#1e293b",
  text: "#f1f5f9",
  textSecondary: "#94a3b8",
  border: "#334155",
  shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)",
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export type ThemeName = keyof typeof themes;

export const defaultTheme = lightTheme;
