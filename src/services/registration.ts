import { api } from './api';

export interface RegistrationData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  date_of_birth: string;
  gender: string;
  location: string;
  radius: number;
  main_goal: string;
  auth_provider?: string;
  auth_provider_id?: string;
  skill_levels?: Array<{
    game_type_id: number;
    skill_level: string;
  }>;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data: {
    user: any;
    token: string;
  };
}

export const registrationService = {
  async register(data: RegistrationData): Promise<{ user: any; token: string; }> {
    try {
      const response = await api.post('/registration/register', data);
      
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data && response.data.success === false) {
        const errorMessage = response.data.message || 'Registration failed';
        if (response.data.errors) {
          const errorDetails = Object.entries(response.data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          throw new Error(`${errorMessage} - ${errorDetails}`);
        }
        throw new Error(errorMessage);
      } else {
        throw new Error('Unexpected API response structure during registration.');
      }
    } catch (error: any) {
      throw error;
    }
  },

  async getSports(): Promise<any[]> {
    try {
      const response = await api.get('/registration/sports');
      return response.data.data || [];
    } catch (error: any) {
      throw new Error('Failed to fetch sports');
    }
  },

  async searchFacilities(query: string, location?: string): Promise<any[]> {
    try {
      const params = new URLSearchParams({ query });
      if (location) {
        params.append('location', location);
      }
      
      const response = await api.get(`/facilities/search?${params.toString()}`);
      return response.data.data || [];
    } catch (error: any) {
      throw new Error('Failed to search facilities');
    }
  }
};

