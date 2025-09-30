import { api } from './api';

export type ConversationType = 'direct' | 'group' | 'tournament' | 'community';

export interface Conversation {
  id: number;
  type: ConversationType;
  name: string;
  avatar?: string;
  last_message?: {
    content: string;
    time: string;
  };
  unread_count: number;
  participants_count?: number;
  participant_online_status?: boolean;
  participant_last_seen?: string;
}

export interface MessageSender {
  id: number;
  name: string;
  avatar?: string;
}

export interface MessageItem {
  id: number;
  sender: MessageSender;
  content: string;
  created_at: string;
  created_at_relative?: string;
  is_own?: boolean;
}

export interface ConversationsResponse {
  data: Conversation[];
}

export interface MessagesResponse {
  data: MessageItem[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface CreateConversationPayload {
  type: ConversationType;
  name?: string; // for group chats
  participant_ids?: number[]; // for direct/group chats
  context_id?: number; // for tournament/community chats
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  profile_picture?: string;
  location?: string;
  is_online?: boolean;
  last_seen_at?: string;
  last_seen_formatted?: string;
}

function isNotImplemented(error: any): boolean {
  const status = error?.response?.status;
  return status === 404 || status === 501 || status === 405;
}

// Cache for real user data
let cachedUsers: User[] = [];
let usersCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getRealUsers(): Promise<User[]> {
  const now = Date.now();
  if (cachedUsers.length > 0 && (now - usersCacheTime) < CACHE_DURATION) {
    console.log('Using cached users:', cachedUsers.map(u => u.full_name));
    return cachedUsers;
  }

  console.log('Fetching real users...');

  // Try the /users endpoint first (most reliable)
  try {
    const response = await api.get('/users');
    console.log('Users endpoint response:', response.data);
    if (response.data.success && response.data.data && response.data.data.length > 0) {
      cachedUsers = response.data.data;
      usersCacheTime = now;
      console.log('Successfully fetched users from /users:', cachedUsers.map(u => u.full_name));
      return cachedUsers;
    }
  } catch (error) {
    console.log('Could not fetch users from /users endpoint:', error);
  }

  // Try to get nearby users as fallback
  try {
    const response = await api.get('/location/nearby-users?radius=50');
    console.log('Nearby users response:', response.data);
    if (response.data.success && response.data.data && response.data.data.length > 0) {
      cachedUsers = response.data.data;
      usersCacheTime = now;
      console.log('Using nearby users:', cachedUsers.map(u => u.full_name));
      return cachedUsers;
    }
  } catch (error) {
    console.log('Could not fetch nearby users:', error);
  }

  // Try community users as another fallback
  try {
    const response = await api.get('/location/community-users?limit=20');
    console.log('Community users response:', response.data);
    if (response.data.success && response.data.data && response.data.data.length > 0) {
      cachedUsers = response.data.data;
      usersCacheTime = now;
      console.log('Using community users:', cachedUsers.map(u => u.full_name));
      return cachedUsers;
    }
  } catch (error) {
    console.log('Could not fetch community users:', error);
  }

  console.log('No users found from any endpoint, returning empty array');
  return [];
}

// Get current user to exclude from conversation list
async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get('/user');
    if (response.data && response.data.user) {
      const currentUser = response.data.user;
      return {
        id: currentUser.id,
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        full_name: `${currentUser.first_name} ${currentUser.last_name}`,
        profile_picture: currentUser.profile_picture,
        location: currentUser.location
      };
    }
  } catch (error) {
    console.log('Could not fetch current user');
  }
  return null;
}

// Create some game events with existing users to generate real conversations
async function createGameEventsWithUsers(users: User[]): Promise<void> {
  if (users.length === 0) return;

  try {
    // Get game types first
    const gameTypesResponse = await api.get('/game-types');
    const gameTypes = gameTypesResponse.data || [];
    
    if (gameTypes.length === 0) return;

    // Create a tennis game event with some users
    const tennisGameType = gameTypes.find((gt: any) => gt.name.toLowerCase().includes('tennis')) || gameTypes[0];
    
    const eventData = {
      game_type_id: tennisGameType.id,
      location: 'Central Tennis Court',
      address: '123 Sports Avenue, London',
      city: 'London',
      state: 'England',
      country: 'UK',
      starts_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      skill_level: 2,
      max_participants: 8,
      waiting_list_enabled: true,
      notes: 'Looking for intermediate players for a friendly match!',
      venue_booked: true
    };

    const eventResponse = await api.post('/events', eventData);
    
    if (eventResponse.data.success) {
      console.log('Created game event for conversations');
      
      // Join some users to the event
      const eventId = eventResponse.data.data.id;
      const usersToJoin = users.slice(0, Math.min(3, users.length));
      
      for (const user of usersToJoin) {
        try {
          await api.post(`/events/${eventId}/join`);
        } catch (error) {
          // User might already be joined or event might be full
          console.log(`Could not join user ${user.full_name} to event`);
        }
      }
    }
  } catch (error) {
    console.log('Could not create game events:', error);
  }
}

function generateMockConversations(users: User[], currentUser: User | null): Conversation[] {
  console.log('=== Generating Mock Conversations ===');
  console.log('Available users:', users.map(u => `${u.id}: ${u.full_name} (${u.is_online ? 'online' : 'offline'})`));
  console.log('Current user:', currentUser ? `${currentUser.id}: ${currentUser.full_name}` : 'None');
  
  if (users.length === 0) {
    console.log('No users available, using fallback data');
    // Fallback to basic mock data if no users found
    return [
      { id: 1, type: 'group', name: 'Tennis Group', unread_count: 3, last_message: { content: 'Great game today everyone!', time: '2m ago' }, participants_count: 8 },
      { id: 2, type: 'direct', name: 'Maria Garcia', unread_count: 0, last_message: { content: 'See you at the court tomorrow', time: '1h ago' } },
      { id: 3, type: 'group', name: 'Basketball Squad', unread_count: 1, last_message: { content: "Who's bringing the ball?", time: '3h ago' }, participants_count: 12 },
      { id: 4, type: 'direct', name: 'Alex White', unread_count: 0, last_message: { content: 'Thanks for the workout tips!', time: '1d ago' } },
    ];
  }

  const conversations: Conversation[] = [];
  
  // Filter out the current user from the conversation list
  const otherUsers = currentUser 
    ? users.filter(user => user.id !== currentUser.id)
    : users;
  
  console.log('Other users for conversations (excluding current user):', otherUsers.map(u => `${u.id}: ${u.full_name} (${u.is_online ? 'online' : 'offline'})`));
  
  // Create direct conversations with real users (excluding current user)
  otherUsers.slice(0, Math.min(3, otherUsers.length)).forEach((user, index) => {
    console.log(`Creating conversation for user: ${user.full_name} (ID: ${user.id})`);
    conversations.push({
      id: index + 1,
      type: 'direct',
      name: user.full_name,
      avatar: user.profile_picture,
      unread_count: index === 0 ? 2 : 0,
      last_message: {
        content: index === 0 ? 'See you at the court tomorrow' : 
                index === 1 ? 'Thanks for the workout tips!' : 
                'Great game today!',
        time: index === 0 ? '1h ago' : index === 1 ? '1d ago' : '2d ago'
      },
      // Add online status for direct conversations
      participant_online_status: user.is_online,
      participant_last_seen: user.last_seen_formatted,
    });
  });

  // Create group conversations based on real users
  if (otherUsers.length >= 2) {
    conversations.push({
      id: conversations.length + 1,
      type: 'group',
      name: 'Tennis Group',
      unread_count: 3,
      last_message: { content: 'Great game today everyone!', time: '2m ago' },
      participants_count: Math.min(otherUsers.length, 8)
    });

    conversations.push({
      id: conversations.length + 1,
      type: 'group',
      name: 'Basketball Squad',
      unread_count: 1,
      last_message: { content: "Who's bringing the ball?", time: '3h ago' },
      participants_count: Math.min(otherUsers.length, 12)
    });
  }

  console.log('Generated conversations:', conversations.map(c => ({ id: c.id, name: c.name, type: c.type })));
  console.log('=== End Generating Mock Conversations ===');
  return conversations;
}

function generateMockMessages(conversationId: number, users: User[], currentUser: User | null): MessageItem[] {
  if (users.length === 0) {
    // Fallback messages with generic names
    return [
      { id: 1, sender: { id: 10, name: 'Maria Garcia' }, content: 'Great game today everyone! Really enjoyed the matches.', created_at: new Date().toISOString(), created_at_relative: '10:30 AM' },
      { id: 2, sender: { id: -1, name: 'You' }, content: 'Same here! My backhand is finally improving 😊', created_at: new Date().toISOString(), created_at_relative: '10:32 AM', is_own: true },
      { id: 3, sender: { id: 11, name: 'Alex White' }, content: 'We should definitely do this again next week. Same time?', created_at: new Date().toISOString(), created_at_relative: '10:35 AM' },
    ];
  }

  const messages: MessageItem[] = [];
  const conversation = conversationId === 1 ? 'group' : 'direct';
  
  // Filter out current user from message senders
  const otherUsers = currentUser 
    ? users.filter(user => user.id !== currentUser.id)
    : users;
  
  if (conversation === 'group') {
    // Group conversation messages using real users (excluding current user)
    otherUsers.slice(0, Math.min(3, otherUsers.length)).forEach((user, index) => {
      messages.push({
        id: index + 1,
        sender: { id: user.id, name: user.full_name, avatar: user.profile_picture },
        content: index === 0 ? 'Great game today everyone! Really enjoyed the matches.' :
                index === 1 ? 'Same here! My backhand is finally improving 😊' :
                'We should definitely do this again next week. Same time?',
        created_at: new Date(Date.now() - (index * 5 * 60 * 1000)).toISOString(),
        created_at_relative: index === 0 ? '10:30 AM' : index === 1 ? '10:32 AM' : '10:35 AM',
        is_own: false // These are other users' messages
      });
    });
  } else {
    // Direct conversation messages using real user (excluding current user)
    const otherUser = otherUsers[conversationId - 1] || otherUsers[0];
    if (otherUser) {
      messages.push(
        {
          id: 1,
          sender: { id: otherUser.id, name: otherUser.full_name, avatar: otherUser.profile_picture },
          content: 'Hey! How are you doing?',
          created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          created_at_relative: '1h ago',
          is_own: false
        },
        {
          id: 2,
          sender: { id: -1, name: 'You' },
          content: 'I\'m good! Ready for our next game?',
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          created_at_relative: '30m ago',
          is_own: true
        }
      );
    }
  }

  return messages;
}

class MessagesService {
  async getConversations(type?: ConversationType): Promise<ConversationsResponse> {
    try {
      console.log('🔍 Fetching conversations from real API...');
      // Add cache busting parameter to force fresh data
      const response = await api.get('/conversations', {
        params: { 
          _t: Date.now(),
          _cache: Math.random().toString(36).substring(7)
        }
      });
      console.log('📡 Real API response:', response.data);
      if (response.data.success) {
        // Filter by type if specified
        let conversations = response.data.data;
        if (type && type !== 'all') {
          conversations = conversations.filter((conv: any) => conv.type === type);
        }
        console.log('✅ Using real conversations:', conversations);
        return { data: conversations };
      }
      throw new Error('Failed to fetch conversations');
    } catch (error: any) {
      console.log('❌ Real API failed:', error);
      if (isNotImplemented(error)) {
        // Fallback to mock data if API not implemented
        console.log('🔄 Using mock conversations as fallback');
        const users = await getRealUsers();
        const currentUser = await getCurrentUser();
        const conversations = generateMockConversations(users, currentUser);
        return { data: conversations };
      }
      throw error;
    }
  }

  async getMessages(conversationId: number, page = 1, perPage = 50): Promise<MessagesResponse> {
    try {
      console.log('🔍 Fetching messages from real API for conversation:', conversationId);
      const response = await api.get(`/conversations/${conversationId}/messages?page=${page}&per_page=${perPage}`);
      console.log('📡 Real messages API response:', response.data);
      if (response.data.success) {
        return {
          data: response.data.data,
          pagination: response.data.pagination
        };
      }
      throw new Error('Failed to fetch messages');
    } catch (error: any) {
      console.log('❌ Real messages API failed:', error);
      if (isNotImplemented(error)) {
        // Fallback to mock data if API not implemented
        console.log('🔄 Using mock messages as fallback');
        const users = await getRealUsers();
        const currentUser = await getCurrentUser();
        const messages = generateMockMessages(conversationId, users, currentUser);
        return { data: messages };
      }
      throw error;
    }
  }

  async sendMessage(conversationId: number, content: string): Promise<{ success: boolean; data: MessageItem }> {
    try {
      const response = await api.post(`/conversations/${conversationId}/messages`, { content });
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      throw new Error('Failed to send message');
    } catch (error: any) {
      if (isNotImplemented(error)) {
        // Fallback to mock response if API not implemented
        console.log('Using mock message response as fallback');
        const mockMessage: MessageItem = {
          id: Date.now(),
          sender: { id: -1, name: 'You' },
          content,
          created_at: new Date().toISOString(),
          created_at_relative: 'just now',
          is_own: true,
        };
        return { success: true, data: mockMessage };
      }
      throw error;
    }
  }

  async createConversation(payload: CreateConversationPayload): Promise<{ success: boolean; data: Conversation }> {
    try {
      const response = await api.post('/conversations', payload);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      throw new Error('Failed to create conversation');
    } catch (error: any) {
      if (isNotImplemented(error)) {
        // Fallback to mock response if API not implemented
        console.log('Using mock conversation response as fallback');
        const mockConversation: Conversation = {
          id: Date.now(),
          type: payload.type,
          name: payload.type === 'direct' ? 'New Chat' : payload.name || 'Group Chat',
          unread_count: 0,
          participants_count: (payload.participant_ids?.length || 0) + 1
        };
        return { success: true, data: mockConversation };
      }
      throw error;
    }
  }

  async startTyping(conversationId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/conversations/${conversationId}/typing/start`);
      return response.data;
    } catch (error) {
      console.error('Error starting typing indicator:', error);
      throw error;
    }
  }

  async stopTyping(conversationId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/conversations/${conversationId}/typing/stop`);
      return response.data;
    } catch (error) {
      console.error('Error stopping typing indicator:', error);
      throw error;
    }
  }

  async getTypingUsers(conversationId: number): Promise<{ success: boolean; data: Array<{ user_id: number; user_name: string; started_at: string }> }> {
    try {
      const response = await api.get(`/conversations/${conversationId}/typing`);
      return response.data;
    } catch (error) {
      console.error('Error getting typing users:', error);
      throw error;
    }
  }
}

export default new MessagesService();


