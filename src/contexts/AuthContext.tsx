/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, Permission } from "../types";
import { UserRole } from "../types";
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from "../constants";
import { login as loginApi } from "../services/authService";
import { jwtDecode } from "jwt-decode";

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
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

// Helper function to map token roles to our UserRole enum
const mapRoleFromToken = (tokenRole: string): UserRole => {
  const roleMap: Record<string, UserRole> = {
    // Legacy IT roles mapped to organizational roles
    admin: UserRole.ORG_ADMIN,
    it_staff: UserRole.ORG_ADMIN,
    helpdesk_admin: UserRole.ORG_ADMIN,
    user: UserRole.EMPLOYEE,

    // Organizational roles
    cxo: UserRole.CXO,
    hr: UserRole.HR,
    employee: UserRole.EMPLOYEE,
    manager: UserRole.MANAGER,
    org_admin: UserRole.ORG_ADMIN,
    "org-admin": UserRole.ORG_ADMIN,

    // Variations and fallbacks
    executive: UserRole.CXO,
    human_resources: UserRole.HR,
    staff: UserRole.EMPLOYEE,
    supervisor: UserRole.MANAGER,
    administrator: UserRole.ORG_ADMIN,
  };

  const normalizedRole = tokenRole.toLowerCase().trim();
  return roleMap[normalizedRole] || UserRole.EMPLOYEE;
};

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

  const login = async (username: string, password: string): Promise<void> => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await loginApi({ username, password });
      // Handle response with id_token
      if (response && response.id_token) {
        const token = response.id_token;
        // Decode user info from JWT
        const decoded: any = jwtDecode(token);
        // You may need to map the decoded fields to your User type
        const user = {
          id: decoded.employeeId || decoded.sub || "",
          username: decoded.sub || "",
          email: decoded.sub || "",
          firstName: decoded.firstName || "",
          lastName: decoded.lastName || "",
          role: mapRoleFromToken(decoded.auth || decoded.role || "employee"),
          department: decoded.department || "",
          manager: decoded.manager || "",
          phone: decoded.phone || "",
          location: decoded.location || "",
          isActive: decoded.isActive !== undefined ? decoded.isActive : true,
          lastLogin: undefined,
          permissions: [],
          avatar: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token },
        });
      } else {
        throw new Error("Login failed");
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
