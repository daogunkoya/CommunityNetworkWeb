import api from './api';

export interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  location?: string; // This serves as address/location
  phone?: string;
  profile_picture?: string;
  full_name: string;
  email_verified_at?: string;
}

export interface UpdateProfileData {
  email?: string;
  location?: string;
  phone?: string;
  profile_picture?: File;
}

export class ProfileService {
  /**
   * Get the current user's profile
   */
  async getProfile(): Promise<Profile> {
    try {
      const response = await api.get('/profile');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch profile');
    }
  }

  /**
   * Update the current user's profile
   */
  async updateProfile(data: UpdateProfileData): Promise<Profile> {
    try {
      // Prepare request data
      const requestData: any = {};
      
      // Add text fields
      if (data.email) {
        requestData.email = data.email;
      }
      if (data.location) {
        requestData.location = data.location;
      }
      if (data.phone) {
        requestData.phone = data.phone;
      }
      
      // Handle file upload separately if needed
      if (data.profile_picture) {
        console.log('Starting file upload...');
        const formData = new FormData();
        formData.append('profile_picture', data.profile_picture);
        
        // Add text fields to FormData
        if (data.email) formData.append('email', data.email);
        if (data.location) formData.append('location', data.location);
        if (data.phone) formData.append('phone', data.phone);

        console.log('Making API call to /profile...');
        const response = await api.post('/profile', formData, {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        console.log('API response received:', response.data);
        return response.data.data;
      } else {
        // Send as JSON for text-only updates
        const response = await api.post('/profile', requestData);
        
        return response.data.data;
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update profile');
    }
  }


}

export const profileService = new ProfileService(); 