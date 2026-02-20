import { api } from './api';

export interface DashboardStats {
  total_users: number;
  online_users: number;
  total_events: number;
  upcoming_events: number;
  events_this_week: number;
  total_participants: number;
  total_tournaments: number;
  active_tournaments: number;
  total_discussions: number;
  discussions_this_week: number;
  success_rate: number;
  community_rating: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}

export interface ActivityItem {
  id: number;
  type: 'game' | 'discussion' | 'tournament';
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  content: string;
  sport?: string;
  location?: string;
  date?: string;
  created_at: string;
  timestamp: number;
  likes: number;
  comments: number;
  is_liked: boolean;
}

export interface ActivityFeedResponse {
  success: boolean;
  data: ActivityItem[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  meta: {
    user_interests: string[];
    filtered: boolean;
    message: string;
  };
}

export interface RecommendedGame {
  id: number;
  title: string;
  sport: string;
  location: string;
  date: string;
  starts_at: string;
  participants: number;
  maxParticipants: number;
  skillLevel: string;
  organizer: string;
  organizer_id: number;
  status: string;
  distance?: string;
}

export interface UserInterest {
  game_type_id: number;
  name: string;
  skill_level: number;
  color: string;
  icon_path: string;
}

export const dashboardService = {
  /**
   * Get complete dashboard data in one request (RECOMMENDED)
   * Use this for initial page load - more efficient than multiple calls
   */
  async getDashboard(): Promise<any> {
    try {
      const response = await api.get('/dashboard');
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to fetch dashboard:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard');
    }
  },

  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<DashboardStatsResponse>('/dashboard/stats');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch dashboard statistics');
    }
  },

  /**
   * Get personalized activity feed based on user's interests
   */
  async getActivity(limit: number = 10, page: number = 1): Promise<ActivityFeedResponse> {
    try {
      const response = await api.get<ActivityFeedResponse>('/dashboard/activity', {
        params: { limit, page }
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch activity:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch activity feed');
    }
  },

  /**
   * Get recommended games based on user's interests
   */
  async getRecommendedGames(limit: number = 3): Promise<RecommendedGame[]> {
    try {
      const response = await api.get('/dashboard/recommended-games', {
        params: { limit }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to fetch recommended games:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch recommended games');
    }
  },

  /**
   * Get relevant tournaments based on user's interests
   */
  async getRelevantTournaments(limit: number = 2): Promise<any[]> {
    try {
      const response = await api.get('/dashboard/tournaments', {
        params: { limit }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to fetch tournaments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch tournaments');
    }
  },

  /**
   * Get upcoming games that user has joined
   */
  async getUpcomingGames(limit: number = 5): Promise<any[]> {
    try {
      const response = await api.get('/dashboard/upcoming-games', {
        params: { limit }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to fetch upcoming games:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch upcoming games');
    }
  },

  /**
   * Get user's sport interests
   */
  async getUserInterests(): Promise<UserInterest[]> {
    try {
      const response = await api.get('/dashboard/interests');
      return response.data.data.interests;
    } catch (error: any) {
      console.error('Failed to fetch user interests:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch interests');
    }
  },

  /**
   * Format number for display
   */
  formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  },

  /**
   * Format percentage
   */
  formatPercentage(num: number): string {
    return num + '%';
  },

  /**
   * Format rating
   */
  formatRating(num: number): string {
    return num.toFixed(1);
  }
};
