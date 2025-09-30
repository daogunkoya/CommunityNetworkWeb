import { api } from './api';

export interface AddressSuggestion {
  place_id: string;
  name: string;
  formatted_address: string;
  latitude: number;
  longitude: number;
}

export interface AddressComponents {
  formatted_address: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude: number;
  longitude: number;
  community_name: string;
  borough: string;
}

export interface PostcodeResult {
  place_id: string;
  name: string;
  formatted_address: string;
  latitude: number;
  longitude: number;
  postcode: string;
}

class AddressService {
  /**
   * Get address autocomplete suggestions
   */
  async getAutocompleteSuggestions(query: string, type: 'address' | 'postcode' | 'place' = 'address', country: string = 'UK'): Promise<AddressSuggestion[]> {
    try {
      const response = await api.get('/address/autocomplete', {
        params: { query, type, country }
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Failed to get address suggestions');
    } catch (error: any) {
      console.error('Address autocomplete error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get address suggestions');
    }
  }

  /**
   * Get place details from place ID
   */
  async getPlaceDetails(placeId: string): Promise<AddressComponents | null> {
    try {
      const response = await api.get('/address/place-details', {
        params: { place_id: placeId }
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      
      return null;
    } catch (error: any) {
      console.error('Place details error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get place details');
    }
  }

  /**
   * Search by postcode
   */
  async searchByPostcode(postcode: string, country: string = 'UK'): Promise<PostcodeResult[]> {
    try {
      const response = await api.get('/address/search-postcode', {
        params: { postcode, country }
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      
      return [];
    } catch (error: any) {
      console.error('Postcode search error:', error);
      throw new Error(error.response?.data?.message || 'Failed to search postcode');
    }
  }

  /**
   * Validate an address
   */
  async validateAddress(address: string): Promise<{ valid: boolean; message: string; data?: AddressComponents }> {
    try {
      const response = await api.post('/address/validate', { address });
      
      return {
        valid: response.data.success,
        message: response.data.message,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Address validation error:', error);
      return {
        valid: false,
        message: error.response?.data?.message || 'Failed to validate address'
      };
    }
  }

  /**
   * Get address components for form filling
   */
  async getAddressComponents(placeId: string): Promise<AddressComponents | null> {
    try {
      const response = await api.get('/address/components', {
        params: { place_id: placeId }
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      
      return null;
    } catch (error: any) {
      console.error('Address components error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get address components');
    }
  }

  /**
   * Get nearby places
   */
  async getNearbyPlaces(latitude: number, longitude: number, radius: number = 5000, type?: string): Promise<any[]> {
    try {
      const response = await api.get('/address/nearby-places', {
        params: { latitude, longitude, radius, type }
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      
      return [];
    } catch (error: any) {
      console.error('Nearby places error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get nearby places');
    }
  }
}

export const addressService = new AddressService(); 