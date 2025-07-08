import React, { createContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, UserRole, Permission } from "../types";
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from "../constants";

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
      // Mock login - in production, this would be an actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      if (email === "admin@example.com" && password === "password123") {
        // Mock user data
        const mockUser: User = {
          id: "1",
          username: "admin",
          email: "admin@example.com",
          firstName: "Admin",
          lastName: "User",
          role: "admin" as UserRole,
          department: "IT",
          location: "Head Office",
          isActive: true,
          permissions: [
            "ticket_create",
            "ticket_view",
            "ticket_update",
            "ticket_delete",
            "asset_create",
            "asset_view",
            "asset_update",
            "asset_delete",
            "user_create",
            "user_view",
            "user_update",
            "user_delete",
            "admin_settings",
            "admin_users",
            "admin_system",
          ] as Permission[],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const mockToken = "mock-jwt-token";

        // Store token and user data
        localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(mockUser));

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: mockUser,
            token: mockToken,
          },
        });
      } else {
        throw new Error("Invalid credentials");
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
