import React, { createContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, UserRole, Permission } from "../types";
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from "../constants";
import { AuthService } from "../services/authService";

const authService = new AuthService();

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_ERROR" };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing token and user data on mount
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userData = localStorage.getItem(USER_DATA_KEY);

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: "LOGIN_SUCCESS", payload: { user, token } });
      } catch {
        // Clear invalid data
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await authService.login({ email, password });

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Store token and user data
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token },
        });
      } else {
        throw new Error(response.error || "Login failed");
      }
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error instanceof Error ? error.message : "Login failed",
      });
    }
  };

  const logout = (): void => {
    // Clear stored data
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);

    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (user: User): void => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    dispatch({ type: "UPDATE_USER", payload: user });
  };

  const hasPermission = (permission: string): boolean => {
    return state.user?.permissions.includes(permission as Permission) || false;
  };

  const hasRole = (role: UserRole): boolean => {
    return state.user?.role === role;
  };

  const clearError = (): void => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
    hasPermission,
    hasRole,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
