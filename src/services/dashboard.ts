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

export const dashboardService = {
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
