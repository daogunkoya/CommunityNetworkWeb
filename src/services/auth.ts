import { api } from './api';
import { 
  AuthType, 
  LoginCredentials, 
  RegisterData, 
  AuthUser, 
  SocialAuthData 
} from '@/types/auth';

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string | {
      accessToken: string;
      tokenType: string;
      expiresIn: number;
    };
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string | {
      accessToken: string;
      tokenType: string;
      expiresIn: number;
    };
  };
  requires_verification?: boolean;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post('/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await api.post('/registration/register', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  async socialAuth(data: SocialAuthData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth', {
        auth_type: data.provider === 'google' ? 2 : 1,
        credentials: {
          access_token: data.token,
          provider_id: data.userData.id,
          profile: {
            email: data.userData.email,
            first_name: data.userData.name.split(' ')[0],
            last_name: data.userData.name.split(' ').slice(1).join(' '),
          }
        }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Social authentication failed');
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/logout');
    } catch (error: any) {
      // Even if logout fails, clear local storage
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  async refreshToken(): Promise<{ token: string }> {
    try {
      const response = await api.post('/auth/refresh');
      return response.data;
    } catch (error: any) {
      throw new Error('Token refresh failed');
    }
  },

  // Helper methods
  getStoredUser(): AuthUser | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  setStoredUser(user: AuthUser): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  setStoredToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    return !!token;
  },

  clearStoredAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
}; 