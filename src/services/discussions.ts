import { api } from './api';

export interface GameType {
  id: number;
  name: string;
  color: string;
}

export interface Discussion {
  id: number;
  title: string;
  body: string;
  excerpt: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  game_type?: GameType;
  stats: {
    likes_count: number;
    comments_count: number;
  };
  user_interaction: {
    is_liked: boolean;
    can_edit: boolean;
    can_delete: boolean;
  };
  created_at: string;
  created_at_relative: string;
  updated_at: string;
}

export interface DiscussionDetail extends Discussion {
  comments: Comment[];
}

export interface Comment {
  id: number;
  body: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  created_at: string;
  created_at_relative: string;
}

export interface TrendingTopic {
  name: string;
  count: number;
}

export interface CreateDiscussionData {
  title: string;
  body: string;
  game_type_id?: number;
  game_event_id?: number; // Associate discussion with specific game event
}

export interface CreateCommentData {
  body: string;
}

export interface DiscussionFilters {
  search?: string;
  topic?: string;
  sort?: 'latest' | 'popular' | 'trending';
  per_page?: number;
  page?: number;
  game_type?: string;
  game_event_id?: number; // Filter by specific game event
  my_discussions_only?: boolean;
  date_from?: string;
  date_to?: string;
}

export interface DiscussionsResponse {
  success: boolean;
  data: Discussion[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  meta?: {
    filtered_by_interests: boolean;
    user_interests: {
      names: string[];
      count: number;
      has_interests: boolean;
    };
    message: string;
  };
}

export interface DiscussionResponse {
  success: boolean;
  data: DiscussionDetail;
}

export interface TrendingTopicsResponse {
  success: boolean;
  data: TrendingTopic[];
}

class DiscussionService {
  /**
   * Get all discussions with filtering and pagination
   */
  async getDiscussions(filters?: DiscussionFilters): Promise<DiscussionsResponse> {
    try {
      const response = await api.get('/discussions', { params: filters });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching discussions:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch discussions');
    }
  }

  /**
   * Get a specific discussion with comments
   */
  async getDiscussion(id: number): Promise<DiscussionResponse> {
    try {
      const response = await api.get(`/discussions/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching discussion:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch discussion');
    }
  }

  /**
   * Create a new discussion
   */
  async createDiscussion(data: CreateDiscussionData): Promise<DiscussionResponse> {
    try {
      const response = await api.post('/discussions', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating discussion:', error);
      throw new Error(error.response?.data?.message || 'Failed to create discussion');
    }
  }

  /**
   * Update a discussion
   */
  async updateDiscussion(id: number, data: Partial<CreateDiscussionData>): Promise<DiscussionResponse> {
    try {
      const response = await api.put(`/discussions/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating discussion:', error);
      throw new Error(error.response?.data?.message || 'Failed to update discussion');
    }
  }

  /**
   * Delete a discussion
   */
  async deleteDiscussion(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/discussions/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting discussion:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete discussion');
    }
  }

  /**
   * Add a comment to a discussion
   */
  async addComment(discussionId: number, data: CreateCommentData): Promise<{ success: boolean; data: Comment }> {
    try {
      const response = await api.post(`/discussions/${discussionId}/comments`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      throw new Error(error.response?.data?.message || 'Failed to add comment');
    }
  }

  /**
   * Get comments for a discussion
   */
  async getComments(discussionId: number): Promise<{ success: boolean; data: Comment[] }> {
    try {
      const response = await api.get(`/discussions/${discussionId}/comments`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch comments');
    }
  }

  /**
   * Like a discussion
   */
  async likeDiscussion(discussionId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/discussions/${discussionId}/likes`);
      return response.data;
    } catch (error: any) {
      console.error('Error liking discussion:', error);
      throw new Error(error.response?.data?.message || 'Failed to like discussion');
    }
  }

  /**
   * Unlike a discussion
   */
  async unlikeDiscussion(discussionId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/discussions/${discussionId}/likes`);
      return response.data;
    } catch (error: any) {
      console.error('Error unliking discussion:', error);
      throw new Error(error.response?.data?.message || 'Failed to unlike discussion');
    }
  }

  /**
   * Get trending topics
   */
  async getTrendingTopics(): Promise<TrendingTopicsResponse> {
    try {
      const response = await api.get('/discussions/trending/topics');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching trending topics:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch trending topics');
    }
  }

  /**
   * Get available game types for discussions (user's interests only)
   */
  async getAvailableGameTypes(): Promise<{ success: boolean; data: GameType[]; message: string }> {
    try {
      const response = await api.get('/discussions/available-game-types');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching available game types:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch available game types');
    }
  }

  /**
   * Start typing indicator for discussion comments
   */
  async startTyping(discussionId: number): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 Making API call to start typing for discussion:', discussionId);
      const response = await api.post(`/discussions/${discussionId}/typing/start`);
      console.log('✅ Start typing API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error starting typing indicator:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      throw new Error(error.response?.data?.message || 'Failed to start typing indicator');
    }
  }

  /**
   * Stop typing indicator for discussion comments
   */
  async stopTyping(discussionId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/discussions/${discussionId}/typing/stop`);
      return response.data;
    } catch (error: any) {
      console.error('Error stopping typing indicator:', error);
      throw new Error(error.response?.data?.message || 'Failed to stop typing indicator');
    }
  }

  /**
   * Get active typing users for discussion comments
   */
  async getTypingUsers(discussionId: number): Promise<{ success: boolean; data: Array<{ user_id: number; user_name: string; started_at: string }> }> {
    try {
      const response = await api.get(`/discussions/${discussionId}/typing`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting typing users:', error);
      throw new Error(error.response?.data?.message || 'Failed to get typing users');
    }
  }
}

export default new DiscussionService(); 