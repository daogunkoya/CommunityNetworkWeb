import { api } from './api';

export interface GameType {
  id: number;
  name: string;
  description: string;
  icon_path: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface GameTypesResponse {
  success: boolean;
  data: GameType[];
}

class GameTypeService {
  /**
   * Get all game types
   */
  async getGameTypes(): Promise<GameTypesResponse> {
    try {
      const response = await api.get('/game-types');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching game types:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch game types');
    }
  }
}

export default new GameTypeService(); 