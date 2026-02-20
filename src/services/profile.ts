import { api } from './api';

export interface ProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  date_of_birth?: string;
  gender?: string;
  location?: string;
  radius?: number;
  main_goal?: string;
  interests?: string[];
  skill_levels?: Array<{
    game_type_id: number;
    skill_level: string;
  }>;
  profile_picture?: File;
}

export interface ProfileResponse {
  success: boolean;
  data: {
    user: any;
    message?: string;
  };
}

export const profileService = {
  async getProfile(): Promise<any> {
    try {
      const response = await api.get('/profile');
      
      // Check if response is successful
      if (response.data?.success === false) {
        throw new Error(response.data?.message || 'Failed to fetch profile');
      }
      
      return response.data.data || response.data;
    } catch (error: any) {
      // Re-throw with more context if it's an auth error
      if (error.response?.status === 401) {
        const authError = new Error('Unauthorized: Please log in again');
        (authError as any).response = error.response;
        throw authError;
      }
      
      // Re-throw with original message if available
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error(error.message || 'Failed to fetch profile');
    }
  },

  async updateProfile(data: ProfileData): Promise<ProfileResponse> {
    try {
      const formData = new FormData();
      
      // Add all text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && key !== 'profile_picture') {
          if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Add profile picture if provided
      if (data.profile_picture) {
        formData.append('profile_picture', data.profile_picture);
      }

      const response = await api.post('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      throw new Error('Failed to update profile');
    }
  },

  async changePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/profile/change-password', data);
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to change password');
    }
  },

  async deleteAccount(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete('/profile');
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to delete account');
    }
  },

  // Interest Management Methods
  async getInterests(): Promise<any[]> {
    try {
      const response = await api.get('/profile/interests');
      // Ensure we always return an array
      const interests = response?.data?.data || response?.data || [];
      return Array.isArray(interests) ? interests : [];
    } catch (error: any) {
      // Return empty array instead of throwing to prevent crashes
      console.error('Failed to fetch interests:', error);
      return [];
    }
  },

  async updateInterests(interests: Array<{game_type_id: number, skill_level: number}>): Promise<any> {
    try {
      const response = await api.post('/profile/interests', { interests });
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to update interests');
    }
  }
}; 