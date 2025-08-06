import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  location: string;
  gender?: string;
  date_of_birth?: string;
  phone?: string;
  bio?: string;
  interests?: string[];
  skill_level?: string;
}

export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at?: string;
}

export interface AuthToken {
  accessTokenId: string;
  tokenType: string;
  expiresIn: number;
  accessToken: string;
}

export interface AuthResponse {
  user: AuthUser;
  token?: AuthToken;
  message: string;
  requires_verification?: boolean;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/login', credentials);
      const { user, token } = response.data;
      
      // Store auth data in localStorage
      localStorage.setItem('auth_token', token.accessToken);
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/register', data);
      const { user, token, requires_verification } = response.data;
      
      // Only store auth data if no verification is required (user is immediately logged in)
      if (!requires_verification && token) {
        localStorage.setItem('auth_token', token.accessToken);
        localStorage.setItem('auth_user', JSON.stringify(user));
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        throw new Error(errorMessages.join(', '));
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Registration failed. Please try again.');
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/logout');
    } catch (error) {
      // Even if logout fails on server, we should clear local auth
      console.warn('Logout request failed:', error);
    } finally {
      // Clear local auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await api.get('/user');
      return response.data.user;
    } catch (error) {
      return null;
    }
  },

  getStoredUser(): AuthUser | null {
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
};

export default authService; 