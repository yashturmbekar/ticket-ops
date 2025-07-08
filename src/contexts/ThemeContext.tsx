import React, { createContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type { ThemeConfig } from "../types";
import { themes, defaultTheme } from "../theme";
import type { ThemeName } from "../theme";
import { THEME_STORAGE_KEY } from "../constants";

interface ThemeState {
  theme: ThemeConfig;
  themeName: ThemeName;
}

type ThemeAction = { type: "SET_THEME"; payload: ThemeName };

const initialState: ThemeState = {
  theme: defaultTheme,
  themeName: "light",
};

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case "SET_THEME":
      return {
        ...state,
        theme: themes[action.payload],
        themeName: action.payload,
      };
    default:
      return state;
  }
};

interface ThemeContextType extends ThemeState {
  setTheme: (themeName: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { ThemeContext };

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      dispatch({ type: "SET_THEME", payload: savedTheme });
    }
  }, []);

  useEffect(() => {
    // Apply theme to document root
    const root = document.documentElement;
    Object.entries(state.theme).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [state.theme]);

  const setTheme = (themeName: ThemeName): void => {
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
    dispatch({ type: "SET_THEME", payload: themeName });
  };

  const toggleTheme = (): void => {
    const newTheme = state.themeName === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    ...state,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
