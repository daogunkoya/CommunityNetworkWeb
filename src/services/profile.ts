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
      return response.data.data;
    } catch (error: any) {
      throw new Error('Failed to fetch profile');
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
  }
}; 