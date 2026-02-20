import { api } from './api';

export interface GameEvent {
  id: number;
  title: string;
  sport: string;
  location: string;
  address?: string;
  city?: string;
  borough?: string;
  community?: {
    id: number;
    name: string;
    type: string;
    full_location: string;
  };
  distance_km?: number;
  distance_formatted?: string;
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
  participants?: Array<{
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
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  latitude?: number | null;
  longitude?: number | null;
  community_name?: string;
  borough?: string;
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
  my_games_only?: boolean;
  filter_by_interests?: string; // 'true' or 'false'
  per_page?: number;
  page?: number;
}

export interface GameEventStats {
  total_events: number;
  events_today: number;
  players_online: number;
  upcoming_events: number;
  sports?: Array<{
    name: string;
    count: number;
    color: string;
  }>;
}

export const gameService = {
  // Normalize game event data from API
  normalizeGameEvent(event: any): GameEvent {
    return {
      ...event,
      // Convert numeric boolean fields to actual booleans
      venue_booked: Boolean(event.venue_booked),
      waiting_list_enabled: Boolean(event.waiting_list_enabled),
      is_full: Boolean(event.is_full),
      // Ensure participants is always an array, handle null/undefined gracefully
      participants: Array.isArray(event?.participants) ? event.participants : [],
      // Ensure user_participation exists
      user_participation: event.user_participation || {
        is_participating: false,
        is_waiting: false,
        can_join: true
      }
    };
  },

  // Get all game events with optional filters
  async getEvents(filters?: GameEventFilters): Promise<{ data: GameEvent[]; pagination: any }> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            // Handle boolean values properly
            if (typeof value === 'boolean') {
              params.append(key, value ? '1' : '0');
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }

      const response = await api.get(`/events?${params.toString()}`);
      
      // Normalize all events data - ensure data is always an array
      const eventsData = Array.isArray(response?.data?.data) ? response.data.data : [];
      const normalizedData = eventsData.map((event: any) => this.normalizeGameEvent(event));
      
      return {
        data: normalizedData,
        pagination: response?.data?.pagination || {}
      };
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
      // Normalize single event data
      return this.normalizeGameEvent(response.data.data);
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
      // Normalize created event data
      return this.normalizeGameEvent(response.data.data);
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
      // Normalize updated event data
      return this.normalizeGameEvent(response.data.data);
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
      const data = response.data.data;
      
      // Transform the API response to match our interface
      return {
        total_events: data.total_events,
        events_today: data.events_today || 0,
        players_online: data.total_participants || 0,
        upcoming_events: data.upcoming_events,
        sports: data.sports || [],
      };
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch game statistics');
    }
  },

  // Get sport statistics (public endpoint)
  async getSportStats(): Promise<Array<{ name: string; count: number; color: string }>> {
    try {
      const response = await api.get('/sport-stats');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch sport statistics');
    }
  },

  // Get user-specific sport statistics (filtered by interests)
  async getUserSportStats(): Promise<Array<{ name: string; count: number; color: string }>> {
    try {
      const response = await api.get('/sport-stats/user-interests');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch user sport statistics');
    }
  },

  // Get available game types for games (user's interests only)
  async getAvailableGameTypes(): Promise<{ success: boolean; data: Array<{ id: number; name: string; color: string; icon_path: string }>; message: string }> {
    try {
      const response = await api.get('/discussions/available-game-types');
      // Ensure data is always an array
      const responseData = response?.data || {};
      return {
        ...responseData,
        data: Array.isArray(responseData.data) ? responseData.data : [],
        success: responseData.success !== undefined ? responseData.success : true
      };
    } catch (error: any) {
      console.error('Error fetching available game types:', error);
      // Return safe default instead of throwing
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch available game types'
      };
    }
  },
}; 