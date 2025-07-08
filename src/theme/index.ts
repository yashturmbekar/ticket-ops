import type { ThemeConfig } from "../types";

export const lightTheme: ThemeConfig = {
  primary: "#0066CC",
  secondary: "#6c757d",
  success: "#28a745",
  warning: "#ffc107",
  error: "#dc3545",
  info: "#17a2b8",
  background: "#ffffff",
  surface: "#f8f9fa",
  text: "#212529",
  textSecondary: "#6c757d",
  border: "#dee2e6",
  shadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
};

export const darkTheme: ThemeConfig = {
  primary: "#0d6efd",
  secondary: "#6c757d",
  success: "#198754",
  warning: "#ffc107",
  error: "#dc3545",
  info: "#0dcaf0",
  background: "#212529",
  surface: "#343a40",
  text: "#ffffff",
  textSecondary: "#adb5bd",
  border: "#495057",
  shadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.3)",
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export type ThemeName = keyof typeof themes;

export const defaultTheme = lightTheme;
