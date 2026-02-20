import { api } from './api';
import { 
  AuthType, 
  LoginCredentials, 
  RegisterData, 
  AuthUser, 
  SocialAuthData 
} from '@/types/auth';
import { getBrowserInfo } from '@/utils/mobileSafari';
import { logNetworkDiagnostics } from '@/utils/networkUtils';
import { ERROR_CONFIG } from '@/utils/errorConfig';

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
      // Run network diagnostics first
      const diagnostics = logNetworkDiagnostics();
      
      // Log browser info for debugging
      const browserInfo = getBrowserInfo();
      console.log('🔐 LOGIN ATTEMPT:', {
        credentials: { email: credentials.email, password: '[HIDDEN]' },
        browserInfo,
        diagnostics
      });
      
      const response = await api.post('/login', credentials);
      
      // Log successful response
      console.log('✅ LOGIN SUCCESS:', {
        status: response.status,
        data: response.data,
        browserInfo: getBrowserInfo()
      });
      
      return response.data;
    } catch (error: any) {
      console.group('❌ LOGIN FAILED');
      console.error('Error details:', {
        error: error,
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
        browserInfo: getBrowserInfo(),
        timestamp: new Date().toISOString()
      });
      
      // Run diagnostics again to show current network state
      logNetworkDiagnostics();
      console.groupEnd();
      
      // Enhanced error handling with specific details
      let errorMessage = 'Login failed';
      
      if (ERROR_CONFIG.SHOW_DETAILED_ERRORS) {
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const statusText = error.response.statusText;
          const endpoint = `${error.config?.baseURL}${error.config?.url}`;
          
          switch (status) {
            case 404:
              errorMessage = `404 - Server Not Found: Cannot reach ${endpoint}. Check if your API server is running.`;
              break;
            case 500:
              errorMessage = `500 - Server Error: ${endpoint} is experiencing internal server errors.`;
              break;
            case 401:
              errorMessage = `401 - Unauthorized: Invalid credentials for ${endpoint}`;
              break;
            case 403:
              errorMessage = `403 - Forbidden: Access denied to ${endpoint}`;
              break;
            case 422:
              errorMessage = `422 - Validation Error: ${error.response.data?.message || 'Invalid data sent to'} ${endpoint}`;
              break;
            default:
              errorMessage = `${status} - ${statusText}: ${error.response.data?.message || 'Server error at'} ${endpoint}`;
          }
        } else if (error.request) {
          // Request was made but no response received
          const endpoint = `${error.config?.baseURL}${error.config?.url}`;
          errorMessage = `Network Error - Cannot reach server: ${endpoint}. Check your internet connection and ensure the API server is running.`;
        } else if (error.code === 'ERR_NETWORK') {
          errorMessage = `Network Error - Cannot connect to API server. Check if your backend is running on the correct port.`;
        } else if (error.code === 'ECONNREFUSED') {
          errorMessage = `Connection Refused - API server is not running or not accessible.`;
        } else {
          errorMessage = `Login Error: ${error.message}`;
        }
      }
      
      throw new Error(errorMessage);
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
      
      // Log the response to help debug structure
      console.log('🔐 Social Auth Response:', {
        status: response.status,
        data: response.data,
        dataKeys: Object.keys(response.data || {}),
        hasSuccess: 'success' in (response.data || {}),
        hasData: 'data' in (response.data || {}),
      });
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Social Auth Error:', {
        error,
        message: error.message,
        responseData: error.response?.data,
        status: error.response?.status,
      });
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

  // Helper methods for authentication
  getStoredUser(): AuthUser | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  },

  setStoredUser(user: AuthUser): void {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  },

  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  setStoredToken(token: string): void {
    try {
      localStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Failed to store auth token:', error);
    }
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