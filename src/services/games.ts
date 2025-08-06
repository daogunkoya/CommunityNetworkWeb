import api from './api';

export interface GameEvent {
  id: number;
  title: string;
  sport: string;
  location: string;
  starts_at: string;
  starts_at_relative: string;
  skill_level: number;
  skill_level_label: string;
  venue_booked: boolean;
  notes?: string;
  max_participants?: number;
  current_participants: number;
  waiting_list_enabled: boolean;
  is_full: boolean;
  organiser: {
    id: number;
    name: string;
    avatar?: string;
  };
  participants: Array<{
    id: number;
    name: string;
    avatar?: string;
    is_waiting: boolean;
  }>;
  user_participation: {
    is_participating: boolean;
    is_waiting: boolean;
    can_join: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateGameEventData {
  game_type_id: number;
  location: string;
  starts_at: string;
  skill_level: number;
  max_participants?: number;
  waiting_list_enabled?: boolean;
  notes?: string;
  venue_booked?: boolean;
}

export interface UpdateGameEventData extends Partial<CreateGameEventData> {}

export interface GameEventFilters {
  sport?: string;
  location?: string;
  date_from?: string;
  date_to?: string;
  skill_level?: number;
  per_page?: number;
}

export interface GameEventStats {
  total_events: number;
  events_today: number;
  players_online: number;
  upcoming_events: number;
}

export const gameService = {
  // Get all game events with optional filters
  async getEvents(filters?: GameEventFilters): Promise<{ data: GameEvent[]; meta: any }> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await api.get(`/events?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch game events');
    }
  },

  // Get a specific game event
  async getEvent(id: number): Promise<GameEvent> {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch game event');
    }
  },

  // Create a new game event
  async createEvent(data: CreateGameEventData): Promise<GameEvent> {
    try {
      const response = await api.post('/events', data);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create game event');
    }
  },

  // Update a game event
  async updateEvent(id: number, data: UpdateGameEventData): Promise<GameEvent> {
    try {
      const response = await api.put(`/events/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update game event');
    }
  },

  // Delete a game event
  async deleteEvent(id: number): Promise<void> {
    try {
      await api.delete(`/events/${id}`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to delete game event');
    }
  },

  // Join a game event
  async joinEvent(id: number): Promise<void> {
    try {
      await api.post(`/events/${id}/join`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to join game event');
    }
  },

  // Leave a game event
  async leaveEvent(id: number): Promise<void> {
    try {
      await api.delete(`/events/${id}/leave`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to leave game event');
    }
  },

  // Get game statistics
  async getStats(): Promise<GameEventStats> {
    try {
      const response = await api.get('/events/stats');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch game statistics');
    }
  },
}; 