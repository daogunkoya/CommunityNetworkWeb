import { api } from './api';

export interface Tournament {
  id: number;
  name: string;
  description: string;
  game_type_id: number;
  game_type: {
    id: number;
    name: string;
    color: string;
  };
  starts_at: string;
  ends_at: string;
  location: string;
  max_participants: number;
  current_participants: number;
  entry_fee: number;
  prize_pool: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  is_registered: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface TournamentFilters {
  search?: string;
  game_type?: string;
  status?: string;
  location?: string;
  date_from?: string;
  date_to?: string;
  filter_by_interests?: string; // 'true' or 'false'
  page?: number;
  limit?: number;
}

export interface CreateTournamentData {
  name: string;
  description?: string;
  game_type_id: number;
  location: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  starts_at: string;
  ends_at: string;
  registration_deadline?: string;
  max_participants?: number;
  min_participants?: number;
  entry_fee: number;
  prize_pool?: number;
  prize_description?: string;
  skill_level?: number;
  rules?: string;
  format?: string;
  bracket_type?: string;
  status?: string;
  waiting_list_enabled?: boolean;
}

export const tournamentsService = {
  async getTournaments(filters?: TournamentFilters): Promise<{ data: Tournament[]; pagination: any; meta?: any }> {
    try {
      const response = await api.get('/tournaments', { params: filters });
      console.log('Tournaments API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Tournaments API error:', error);
      throw new Error('Failed to fetch tournaments');
    }
  },

  async getTournament(id: number): Promise<Tournament> {
    try {
      const response = await api.get(`/tournaments/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error('Failed to fetch tournament');
    }
  },

  async createTournament(data: CreateTournamentData): Promise<Tournament> {
    try {
      const response = await api.post('/tournaments', data);
      return response.data.data;
    } catch (error: any) {
      throw new Error('Failed to create tournament');
    }
  },

  async registerForTournament(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/tournaments/${id}/register`);
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to register for tournament');
    }
  },

  async unregisterFromTournament(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/tournaments/${id}/register`);
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to unregister from tournament');
    }
  },

  async getUpcomingMatches(tournamentId: number): Promise<any[]> {
    try {
      const response = await api.get(`/tournaments/${tournamentId}/matches`);
      return response.data.data;
    } catch (error: any) {
      throw new Error('Failed to fetch upcoming matches');
    }
  },

  async updateTournament(id: number, data: Partial<CreateTournamentData>): Promise<Tournament> {
    try {
      const response = await api.put(`/tournaments/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      throw new Error('Failed to update tournament');
    }
  },

  async approveTournament(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/tournaments/${id}/approve`);
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to approve tournament');
    }
  },

  async rejectTournament(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/tournaments/${id}/reject`);
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to reject tournament');
    }
  },

  // Get available game types for tournaments (user's interests only)
  async getAvailableGameTypes(): Promise<{ success: boolean; data: Array<{ id: number; name: string; color: string; icon_path: string }>; message: string }> {
    try {
      const response = await api.get('/tournaments/available-game-types');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching available game types for tournaments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch available game types');
    }
  }
}; 