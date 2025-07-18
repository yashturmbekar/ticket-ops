import apiClient from "./apiClient";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

const endpoint = "/auth";

export async function login(data: LoginRequest) {
  return apiClient.post(`${endpoint}/login`, data);
}

export async function register(data: RegisterRequest) {
  return apiClient.post(`${endpoint}/register`, data);
}

export async function forgotPassword(data: ForgotPasswordRequest) {
  return apiClient.post(`${endpoint}/forgot-password`, data);
}

export async function resetPassword(data: ResetPasswordRequest) {
  return apiClient.post(`${endpoint}/reset-password`, data);
}

export async function logout() {
  return apiClient.post(`${endpoint}/logout`);
}

export async function getProfile() {
  return apiClient.get(`${endpoint}/profile`);
}

export async function updateProfile(profileData: Record<string, unknown>) {
  return apiClient.put(`${endpoint}/profile`, profileData);
}
