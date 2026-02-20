import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, MessageCircle, Users, Search, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import messagesService, { ConversationType } from '@/services/messages';
import { useAuth } from '@/hooks/useAuth';
import TypingIndicator from '@/components/TypingIndicator';

import { api } from '@/services/api';

// Online status component
const OnlineStatus = ({ isOnline, lastSeen }: { isOnline?: boolean; lastSeen?: string }) => {
  if (isOnline) {
    return (
      <div className="flex items-center space-x-1">
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
        <span className="text-xs text-green-600 font-medium">Online</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
      <span className="text-xs text-gray-500">
        {lastSeen ? `Last seen ${lastSeen}` : 'Offline'}
      </span>
    </div>
  );
};

interface User {
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

// Component for creating new conversations
const CreateConversationModal = ({
  isOpen,
  onClose,
  onConversationCreated
}: {
  isOpen: boolean;
  onClose: () => void;
  onConversationCreated: (conversation: any) => void;
}) => {
  const [conversationType, setConversationType] = useState<ConversationType>('direct');
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  // Reset group name when conversation type changes
  useEffect(() => {
    if (conversationType !== 'group') {
      setGroupName('');
    }
  }, [conversationType]);

  // Fetch available users for selection
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      try {
        console.log('Fetching users for conversation modal...');
        // Use the /users endpoint that we know works
        const response = await api.get('/users');
        console.log('Users API response:', response.data);
        if (response.data.success && response.data.data) {
          // Filter out the current user from the list - ensure data is an array
          const usersData = Array.isArray(response.data.data) ? response.data.data : [];
          const currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
          const filteredUsers = usersData.filter((user: User) => user?.id !== currentUser?.id);
          console.log('Filtered users for modal:', filteredUsers.map(u => u?.full_name).filter(Boolean));
          return filteredUsers;
        }
        console.log('No users found in API response');
        return [];
      } catch (error) {
        console.log('Could not fetch users:', error);
        // Fallback to some basic users if API fails
        return [
          { id: 1, first_name: 'John', last_name: 'Doe', full_name: 'John Doe' },
          { id: 2, first_name: 'Sarah', last_name: 'Johnson', full_name: 'Sarah Johnson' },
          { id: 3, first_name: 'Mike', last_name: 'Rodriguez', full_name: 'Mike Rodriguez' },
        ];
      }
    },
    enabled: isOpen,
  });

  const createConversationMutation = useMutation({
    mutationFn: messagesService.createConversation,
    onSuccess: (data) => {
      toast.success('Conversation created successfully!');
      onConversationCreated(data.data);
      onClose();
      setSelectedUsers([]);
      setSearchTerm('');
      setGroupName('');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create conversation');
    },
  });

  const filteredUsers = users.filter((user: User) =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserToggle = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = () => {
    if (conversationType === 'direct' && selectedUsers.length !== 1) {
      toast.error('Please select exactly one user for direct messages');
      return;
    }
    if (conversationType === 'group' && selectedUsers.length < 2) {
      toast.error('Please select at least 2 users for group messages');
      return;
    }
    if (conversationType === 'group' && !groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }
    if (conversationType === 'community' || conversationType === 'tournament') {
      toast.error('Community and Tournament conversations are automatically created when you create or join events.');
      return;
    }

    createConversationMutation.mutate({
      type: conversationType,
      name: conversationType === 'group' ? groupName.trim() : undefined,
      participant_ids: selectedUsers,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto bg-white shadow-2xl border-2 border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Start New Conversation</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-800">Conversation Type</label>
            <Select value={conversationType} onValueChange={(value: ConversationType) => setConversationType(value)}>
              <SelectTrigger className="w-full border-2 border-gray-300 bg-white hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <SelectValue placeholder="Select conversation type" className="text-gray-900 font-medium" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
                <SelectItem value="direct" className="text-gray-900 hover:bg-blue-50 focus:bg-blue-50">Direct Message</SelectItem>
                <SelectItem value="group" className="text-gray-900 hover:bg-blue-50 focus:bg-blue-50">Group Chat</SelectItem>
                <SelectItem value="community" disabled className="text-gray-400 bg-gray-100">Community (Auto-created)</SelectItem>
                <SelectItem value="tournament" disabled className="text-gray-400 bg-gray-100">Tournament (Auto-created)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded-md border border-blue-200">
              💡 Community and Tournament conversations are automatically created when you create or join events.
            </p>
          </div>

          {conversationType === 'group' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">Group Name</label>
              <Input
                placeholder="Enter group name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          {(conversationType === 'direct' || conversationType === 'group') && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Search Users</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Select Users</label>
                <div className="max-h-48 overflow-y-auto space-y-2 border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
                  {loadingUsers ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">Loading users...</p>
                    </div>
                  ) : (
                    <>
                      {filteredUsers.map((user: User) => (
                        <div
                          key={user.id}
                          className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedUsers.includes(user.id) ? 'bg-primary/10 border border-primary' : 'hover:bg-gray-50'
                            }`}
                          onClick={() => handleUserToggle(user.id)}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.profile_picture} />
                            <AvatarFallback>{user.full_name?.split(' ').map(n => n[0]).join('') || '??'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.full_name}</p>
                            <div className="flex items-center justify-between">
                              {user.location && <p className="text-xs text-muted-foreground truncate">{user.location}</p>}
                              <OnlineStatus
                                isOnline={user.is_online}
                                lastSeen={user.last_seen_formatted}
                              />
                            </div>
                          </div>
                          {selectedUsers.includes(user.id) && (
                            <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                      {filteredUsers.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No users found</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map(userId => {
                    const user = users.find(u => u.id === userId);
                    return user ? (
                      <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                        {user.full_name}
                        <button
                          onClick={() => handleUserToggle(userId)}
                          className="ml-1 hover:bg-gray-100 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 py-2 font-medium border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createConversationMutation.isPending ||
                (conversationType === 'direct' && selectedUsers.length !== 1) ||
                (conversationType === 'group' && selectedUsers.length < 2) ||
                (conversationType === 'group' && !groupName.trim())}
              className="px-6 py-2 font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              {createConversationMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [conversationType, setConversationType] = useState<ConversationType | 'all'>('all');
  const [newMessage, setNewMessage] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showGroupMembers, setShowGroupMembers] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Array<{ user_id: number; user_name: string; started_at: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  const queryClient = useQueryClient();

  // Track online status
  useEffect(() => {
    const markOnline = async () => {
      try {
        await api.post('/user/online');
      } catch (error) {
        console.log('Could not mark as online:', error);
      }
    };

    const markOffline = async () => {
      try {
        await api.post('/user/offline');
      } catch (error) {
        console.log('Could not mark as offline:', error);
      }
    };

    // Mark as online when component mounts
    markOnline();

    // Set up ping interval to keep user active
    const pingInterval = setInterval(async () => {
      try {
        await api.post('/user/ping');
      } catch (error) {
        console.log('Could not ping:', error);
      }
    }, 30000); // Ping every 30 seconds

    // Mark as offline when user leaves
    const handleBeforeUnload = () => {
      markOffline();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(pingInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      markOffline();
    };
  }, []);

  // Fetch conversations
  const { data: conversationsData, isLoading: loadingConversations } = useQuery({
    queryKey: ['conversations', conversationType],
    queryFn: async () => {
      console.log('Fetching conversations for type:', conversationType);
      const result = await messagesService.getConversations(conversationType === 'all' ? undefined : conversationType);
      console.log('Conversations API response:', result);
      // Debug: Check Sarah's status specifically
      if (result.data) {
        const sarahConversation = result.data.find((conv: any) =>
          conv.name === 'Sarah Johnson' || conv.participant_online_status !== undefined
        );
        if (sarahConversation) {
          console.log('Sarah conversation found:', {
            name: sarahConversation.name,
            online: sarahConversation.participant_online_status,
            lastSeen: sarahConversation.participant_last_seen
          });
        }
      }
      return result;
    },
    refetchInterval: false, // Disable automatic polling completely
    // refetchInterval: 30000, // Uncomment to enable polling every 30 seconds
  });

  const conversations = conversationsData?.data || [];

  // Fetch messages for selected conversation
  const { data: messagesData, isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', selectedChat],
    queryFn: () => messagesService.getMessages(selectedChat!),
    enabled: !!selectedChat && selectedChat > 0,
    refetchInterval: false, // Disable automatic polling completely
    // refetchInterval: 60000, // Uncomment to enable polling every 60 seconds
  });

  const messages = messagesData?.data || [];

  // Define selectedConversation before using it in useEffect
  const selectedConversation = conversations.find(c => c.id === selectedChat);

  // Fetch conversation participants for group conversations
  const { data: participantsData } = useQuery({
    queryKey: ['conversation-participants', selectedChat],
    queryFn: async () => {
      if (!selectedChat) return { data: [] };
      try {
        const response = await api.get(`/conversations/${selectedChat}/participants`);
        return response.data.success ? response.data : { data: [] };
      } catch (error) {
        console.error('Failed to fetch participants:', error);
        return { data: [] };
      }
    },
    enabled: !!selectedChat && selectedConversation?.type === 'group',
  });

  const participants = participantsData?.data || [];

  // Fetch typing indicators for selected conversation
  const { data: typingData } = useQuery({
    queryKey: ['typing-users', selectedChat],
    queryFn: async () => {
      if (!selectedChat) return { data: [] };
      try {
        const response = await messagesService.getTypingUsers(selectedChat);
        return response;
      } catch (error) {
        console.error('Failed to fetch typing users:', error);
        return { data: [] };
      }
    },
    enabled: !!selectedChat,
    refetchInterval: 2000, // Poll every 2 seconds for typing indicators
  });

  // Update typing users state when data changes
  useEffect(() => {
    if (typingData?.data) {
      setTypingUsers(typingData.data);
    }
  }, [typingData]);

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (selectedChat === null && conversations.length > 0) {
      setSelectedChat(conversations[0].id);
    }
  }, [conversations, selectedChat]);

  // Focus input when conversation changes or component mounts
  useEffect(() => {
    if (selectedChat && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);
    }
  }, [selectedChat]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesListRef.current) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (messagesListRef.current) {
          messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
          // Also try smooth scrolling as fallback
          messagesListRef.current.scrollTo({
            top: messagesListRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [messages, typingUsers]);

  const sendMessageMutation = useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: number; content: string }) =>
      messagesService.sendMessage(conversationId, content),
    onSuccess: (data) => {
      // Add the new message to the local state immediately
      const newMessageItem = data.data;
      queryClient.setQueryData(['messages', selectedChat], (oldData: any) => {
        if (!oldData) return { data: [newMessageItem] };
        return {
          ...oldData,
          data: [...oldData.data, newMessageItem]
        };
      });

      // Update conversation list with new last message
      queryClient.setQueryData(['conversations', conversationType], (oldData: any) => {
        if (!oldData || !Array.isArray(oldData.data)) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((conv: any) =>
            conv.id === selectedChat
              ? {
                ...conv,
                last_message: {
                  content: newMessageItem.content,
                  time: 'just now'
                }
              }
              : conv
          )
        };
      });

      setNewMessage('');

      // Focus input after successful message send
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    },
    onError: (error: any) => {
      // Even if API fails, add message to local state for demo purposes
      const newMessageItem = {
        id: Date.now(),
        sender: { id: -1, name: 'You' },
        content: newMessage,
        created_at: new Date().toISOString(),
        created_at_relative: 'just now',
        is_own: true,
      };

      queryClient.setQueryData(['messages', selectedChat], (oldData: any) => {
        if (!oldData) return { data: [newMessageItem] };
        return {
          ...oldData,
          data: [...oldData.data, newMessageItem]
        };
      });

      // Update conversation list
      queryClient.setQueryData(['conversations', conversationType], (oldData: any) => {
        if (!oldData || !Array.isArray(oldData.data)) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((conv: any) =>
            conv.id === selectedChat
              ? {
                ...conv,
                last_message: {
                  content: newMessageItem.content,
                  time: 'just now'
                }
              }
              : conv
          )
        };
      });

      setNewMessage('');
      toast.error(error.message || 'Failed to send message');
    },
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    // Stop typing indicator when sending message
    if (isTyping) {
      handleTypingStop();
    }

    sendMessageMutation.mutate({ conversationId: selectedChat, content: newMessage.trim() });

    // Focus the input after sending
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleConversationSelect = async (conversationId: number) => {
    setSelectedChat(conversationId);
    setShowGroupMembers(false); // Reset group members display when switching conversations

    // Mark conversation as read
    try {
      await api.post(`/conversations/${conversationId}/read`);
      // Invalidate conversations query to refresh the unread count
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    } catch (error) {
      console.error('Failed to mark conversation as read:', error);
    }

    // Focus input when conversation is selected
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 200);
  };

  const toggleGroupMembers = () => {
    setShowGroupMembers(!showGroupMembers);
  };

  // Typing indicator handlers
  const handleTypingStart = async () => {
    if (!selectedChat || isTyping) return;

    try {
      setIsTyping(true);
      await messagesService.startTyping(selectedChat);
    } catch (error) {
      console.error('Failed to start typing indicator:', error);
    }
  };

  const handleTypingStop = async () => {
    if (!selectedChat || !isTyping) return;

    try {
      setIsTyping(false);
      await messagesService.stopTyping(selectedChat);
    } catch (error) {
      console.error('Failed to stop typing indicator:', error);
    }
  };

  const handleInputChange = (value: string) => {
    setNewMessage(value);

    // Start typing indicator when user starts typing
    if (value.length === 1 && !isTyping) {
      handleTypingStart();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        handleTypingStop();
      }
    }, 2000);
  };

  // Cleanup typing indicator when component unmounts or conversation changes
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping && selectedChat) {
        handleTypingStop();
      }
    };
  }, [selectedChat, isTyping]);



  return (
    <div className="flex h-screen bg-white w-full max-w-full overflow-hidden" style={{ maxWidth: '100vw' }}>
      {/* Sidebar */}
      <div className="w-80 border-r bg-white relative z-10 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Messages</h2>
              {/* Debug: Show current user */}
              {user && (
                <p className="text-xs text-muted-foreground mt-1">
                  Logged in as: <span className="font-medium">{user.first_name} {user.last_name}</span>
                </p>
              )}
            </div>
            <div className="flex space-x-1">
              {/* Refresh button */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Clear all caches aggressively
                  queryClient.clear();
                  queryClient.invalidateQueries({ queryKey: ['conversations'] });
                  queryClient.invalidateQueries({ queryKey: ['users'] });
                  // Force immediate refetch
                  queryClient.refetchQueries({ queryKey: ['conversations'] });
                  queryClient.refetchQueries({ queryKey: ['users'] });
                  console.log('Forcing refresh of conversations and users data...');
                  // Also clear localStorage cache
                  localStorage.removeItem('react-query');
                  console.log('Cleared all caches and localStorage');
                }}
                className="h-8 px-2"
                title="Force refresh conversations"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </Button>
              <Button
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Modern Filter Dropdown */}
          <div className="relative">
            <Select value={conversationType} onValueChange={(value: any) => setConversationType(value)}>
              <SelectTrigger className="w-full bg-white border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="font-medium">
                      {conversationType === 'all' ? 'All Conversations' :
                        conversationType === 'direct' ? 'Direct Messages' :
                          conversationType === 'group' ? 'Group Chats' :
                            conversationType === 'tournament' ? 'Tournament Chats' :
                              'Community Chats'}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
                <SelectItem value="all" className="flex items-center space-x-2 hover:bg-blue-50 focus:bg-blue-50">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>All Conversations</span>
                </SelectItem>
                <SelectItem value="direct" className="flex items-center space-x-2 hover:bg-green-50 focus:bg-green-50">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Direct Messages</span>
                </SelectItem>
                <SelectItem value="group" className="flex items-center space-x-2 hover:bg-purple-50 focus:bg-purple-50">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>Group Chats</span>
                </SelectItem>
                <SelectItem value="tournament" className="flex items-center space-x-2 hover:bg-orange-50 focus:bg-orange-50">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span>Tournament Chats</span>
                </SelectItem>
                <SelectItem value="community" className="flex items-center space-x-2 hover:bg-indigo-50 focus:bg-indigo-50">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span>Community Chats</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto">
          {loadingConversations ? (
            <div className="p-4 text-sm text-muted-foreground">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              <p>No conversations found</p>
              <p className="text-xs mt-2">Start a conversation to begin messaging</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer transition-colors ${selectedChat === conversation.id ? 'bg-primary/5 border-primary' : 'hover:bg-gray-50'
                  }`}
                onClick={() => handleConversationSelect(conversation.id)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>
                      {conversation.type === 'group' ? (
                        <Users className="h-5 w-5" />
                      ) : (
                        conversation.name?.split(' ').map(n => n[0]).join('') || '??'
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{conversation.name}</p>
                      {conversation.unread_count > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                    {conversation.last_message && (
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.last_message.content}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">
                        {conversation.last_message?.time}
                      </p>
                      <div className="flex items-center space-x-2">
                        {conversation.type === 'direct' && (
                          <OnlineStatus
                            isOnline={conversation.participant_online_status}
                            lastSeen={conversation.participant_last_seen}
                          />
                        )}
                        {conversation.participants_count && (
                          <p className="text-xs text-muted-foreground">
                            {conversation.participants_count} members
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col relative z-0 min-w-0 overflow-hidden">
        {/* Header */}
        {selectedConversation ? (
          <div className="p-4 border-b bg-white">
            <div
              className={`flex items-center space-x-3 ${selectedConversation.type === 'group' ? 'cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors' : ''}`}
              onClick={selectedConversation.type === 'group' ? toggleGroupMembers : undefined}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedConversation.avatar} />
                <AvatarFallback>
                  {selectedConversation.type === 'group' ? (
                    <Users className="h-4 w-4" />
                  ) : (
                    selectedConversation.name?.split(' ').map(n => n[0]).join('') || '??'
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium">
                  {selectedConversation.name}
                  {selectedConversation.type === 'group' && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      {showGroupMembers ? '▼' : '▶'}
                    </span>
                  )}
                </h3>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.type === 'direct' ? 'Direct message' :
                      selectedConversation.type === 'group' ? `${selectedConversation.participants_count} members` :
                        selectedConversation.type}
                  </p>
                  {selectedConversation.type === 'direct' && (
                    <OnlineStatus
                      isOnline={selectedConversation.participant_online_status}
                      lastSeen={selectedConversation.participant_last_seen}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Group Members Display */}
            {selectedConversation.type === 'group' && showGroupMembers && participants.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-600">Group Members</p>
                  <span className="text-xs text-gray-500">{participants.length} members</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {participants.map((participant: any) => (
                    <div key={participant.id} className="flex items-center space-x-2 bg-gray-50 rounded-full px-3 py-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="text-xs">
                          {participant.name?.split(' ').map((n: string) => n[0]).join('') || '??'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-gray-700">{participant.name}</span>
                      <OnlineStatus
                        isOnline={participant.is_online}
                        lastSeen={participant.last_seen_formatted}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 border-b bg-white">
            <h3 className="font-medium text-muted-foreground">Select a conversation</h3>
          </div>
        )}

        {/* Messages */}
        <div ref={messagesListRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-white relative z-0 min-w-0">
          {loadingMessages && selectedChat ? (
            <div className="text-sm text-muted-foreground">Loading messages...</div>
          ) : selectedChat === null ? (
            <div className="text-sm text-muted-foreground">Select a conversation</div>
          ) : messages.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p>No messages yet</p>
              <p className="text-xs">Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const isOwn = (message as any).is_own ?? (message.sender?.id === user?.id);
                const isGroup = ((selectedConversation as any)?.type === 'group');
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} relative z-0 group`}
                  >
                    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[75%] md:max-w-[65%]`}>
                      {/* Sender name for group chats */}
                      {!isOwn && isGroup && (
                        <div className="flex items-center space-x-2 mb-1 px-1">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={message.sender?.avatar} />
                            <AvatarFallback className="text-xs">
                              {message.sender?.name?.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-xs font-semibold text-gray-600">{message.sender?.name}</p>
                        </div>
                      )}

                      {/* Message bubble */}
                      <div
                        className={`relative px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 group-hover:shadow-md ${isOwn
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md'
                            : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
                          }`}
                      >
                        {/* Message content */}
                        <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${isOwn ? 'text-white' : 'text-gray-800'
                          }`}>
                          {message.content}
                        </p>

                        {/* Timestamp */}
                        <div className={`flex items-center justify-end mt-2 space-x-1 ${isOwn ? 'text-blue-100' : 'text-gray-400'
                          }`}>
                          <span className="text-xs">
                            {message.created_at_relative || ''}
                          </span>
                          {isOwn && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Typing indicator */}
        {selectedChat && typingUsers.length > 0 && (
          <TypingIndicator users={typingUsers} />
        )}

        {/* Message input */}
        <div className="p-4 border-t bg-white">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                autoFocus
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
              size="icon"
              className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Create conversation modal */}
      <CreateConversationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConversationCreated={(conversation) => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
          setSelectedChat(conversation.id);
        }}
      />
    </div>
  );
}