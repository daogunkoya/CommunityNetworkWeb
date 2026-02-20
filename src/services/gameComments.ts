import { api } from './api';

export interface GameEventComment {
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

export interface CreateGameCommentData {
  body: string;
}

export interface GameCommentsResponse {
  success: boolean;
  data: GameEventComment[];
}

export interface GameCommentResponse {
  success: boolean;
  data: GameEventComment;
}

class GameCommentsService {
  /**
   * Get comments for a game event
   */
  async getComments(gameEventId: number): Promise<GameCommentsResponse> {
    try {
      const response = await api.get(`/events/${gameEventId}/comments`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching game event comments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch comments');
    }
  }

  /**
   * Add a comment to a game event
   */
  async addComment(gameEventId: number, data: CreateGameCommentData): Promise<GameCommentResponse> {
    try {
      const response = await api.post(`/events/${gameEventId}/comments`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error adding game event comment:', error);
      throw new Error(error.response?.data?.message || 'Failed to add comment');
    }
  }

  /**
   * Delete a comment from a game event
   */
  async deleteComment(gameEventId: number, commentId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/events/${gameEventId}/comments/${commentId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting game event comment:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete comment');
    }
  }

  /**
   * Start typing indicator for game event comments
   */
  async startTyping(gameEventId: number): Promise<{ success: boolean }> {
    try {
      const response = await api.post(`/events/${gameEventId}/comments/typing/start`);
      return response.data;
    } catch (error: any) {
      console.error('Error starting typing indicator:', error);
      throw new Error(error.response?.data?.message || 'Failed to start typing indicator');
    }
  }

  /**
   * Stop typing indicator for game event comments
   */
  async stopTyping(gameEventId: number): Promise<{ success: boolean }> {
    try {
      const response = await api.post(`/events/${gameEventId}/comments/typing/stop`);
      return response.data;
    } catch (error: any) {
      console.error('Error stopping typing indicator:', error);
      throw new Error(error.response?.data?.message || 'Failed to stop typing indicator');
    }
  }

  /**
   * Get typing users for game event comments
   */
  async getTypingUsers(gameEventId: number): Promise<{ success: boolean; data: Array<{ user_id: number; user_name: string; started_at: string }> }> {
    try {
      const response = await api.get(`/events/${gameEventId}/comments/typing/users`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching typing users:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch typing users');
    }
  }
}

export default new GameCommentsService();
