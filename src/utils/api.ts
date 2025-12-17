import axios, { AxiosInstance, AxiosError } from 'axios';
import type { Person, PeopleApiResponse, PersonApiResponse, AuthUser } from '@/types';

// ============================================
// Configuration
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ============================================
// Axios Instance
// ============================================

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// ============================================
// Token Management
// ============================================

let authToken: string | null = null;

/**
 * Set or clear the authorization token
 */
export function setAuthToken(token: string | null): void {
  authToken = token;
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

/**
 * Get current auth token
 */
export function getAuthToken(): string | null {
  return authToken;
}

// ============================================
// Error Handling
// ============================================

/**
 * Extract error message from API error
 */
function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
    return (
      axiosError.response?.data?.error ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      'An unexpected error occurred'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

// ============================================
// API Error Class
// ============================================

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================
// Auth API
// ============================================

export const authApi = {
  /**
   * Get current authenticated user
   */
  async getMe(): Promise<{ user: AuthUser }> {
    try {
      const response = await api.get<{ user: AuthUser }>('/auth/me');
      return response.data;
    } catch (error) {
      throw new ApiError(getErrorMessage(error), (error as AxiosError)?.response?.status);
    }
  },
};

// ============================================
// People API
// ============================================

export interface GetPeopleParams {
  house?: string;
  status?: string;
  sort?: 'name' | 'roll';
}

export const peopleApi = {
  /**
   * Get all people with optional filters
   */
  async getAll(params?: GetPeopleParams): Promise<PeopleApiResponse> {
    try {
      const response = await api.get<PeopleApiResponse>('/people', { params });
      return response.data;
    } catch (error) {
      throw new ApiError(getErrorMessage(error), (error as AxiosError)?.response?.status);
    }
  },

  /**
   * Get a single person by roll number
   */
  async getByRoll(roll: string): Promise<PersonApiResponse> {
    try {
      const response = await api.get<PersonApiResponse>(`/people/${roll}`);
      return response.data;
    } catch (error) {
      throw new ApiError(getErrorMessage(error), (error as AxiosError)?.response?.status);
    }
  },

  /**
   * Update the current user's profile
   */
  async updateMyProfile(data: Partial<Person>): Promise<PersonApiResponse> {
    try {
      const response = await api.put<PersonApiResponse>('/people/me', data);
      return response.data;
    } catch (error) {
      throw new ApiError(getErrorMessage(error), (error as AxiosError)?.response?.status);
    }
  },

  /**
   * Update a person by roll (admin only)
   */
  async updateByRoll(roll: string, data: Partial<Person>): Promise<PersonApiResponse> {
    try {
      const response = await api.put<PersonApiResponse>(`/people/${roll}`, data);
      return response.data;
    } catch (error) {
      throw new ApiError(getErrorMessage(error), (error as AxiosError)?.response?.status);
    }
  },
};

export default api;
