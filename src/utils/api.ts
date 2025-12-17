// API configuration
export const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

// API endpoints
export const ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    ME: `${API_BASE_URL}/auth/me`
  },
  PEOPLE: {
    LIST: `${API_BASE_URL}/people`,
    GET: (roll: string) => `${API_BASE_URL}/people/${roll}`,
    CREATE: `${API_BASE_URL}/people`,
    UPDATE: (roll: string) => `${API_BASE_URL}/people/${roll}`
  }
};

// Get stored auth token
export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

// Store auth token
export function setAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}

// Clear auth token
export function clearAuthToken(): void {
  localStorage.removeItem('authToken');
}

// Get authorization headers
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
}

// Fetch with auth
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  });
}

// Auth API calls
export const authApi = {
  async signup(email: string, password: string, name?: string) {
    const response = await fetch(ENDPOINTS.AUTH.SIGNUP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    return response.json();
  },

  async login(email: string, password: string) {
    const response = await fetch(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  async getMe() {
    const response = await authenticatedFetch(ENDPOINTS.AUTH.ME);

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  }
};

// People API calls
export const peopleApi = {
  async getAll(filters?: { house?: string; status?: string; sort?: string }) {
    const params = new URLSearchParams();
    if (filters?.house) params.append('house', filters.house);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.sort) params.append('sort', filters.sort);

    const url = `${ENDPOINTS.PEOPLE.LIST}${params.size ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch people');
    }

    return response.json();
  },

  async getByRoll(roll: string) {
    const response = await fetch(ENDPOINTS.PEOPLE.GET(roll));

    if (!response.ok) {
      throw new Error('Person not found');
    }

    return response.json();
  },

  async create(data: unknown) {
    const response = await authenticatedFetch(ENDPOINTS.PEOPLE.CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create person');
    }

    return response.json();
  },

  async update(roll: string, data: unknown) {
    const response = await authenticatedFetch(ENDPOINTS.PEOPLE.UPDATE(roll), {
      method: 'PUT',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update person');
    }

    return response.json();
  }
};
