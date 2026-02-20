import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gameService, GameEvent, CreateGameEventData, UpdateGameEventData, GameEventFilters, GameEventStats } from '@/services/games';
import { useToast } from '@/hooks/use-toast';

export const useGames = (filters?: GameEventFilters, useUserInterests: boolean = false) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for game events
  const {
    data: eventsData,
    isLoading: isLoadingEvents,
    error: eventsError,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: ['games', filters],
    queryFn: () => gameService.getEvents(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });

  // Extract pagination data
  const events = eventsData?.data || [];
  const pagination = eventsData?.pagination || {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  };

  // Query for sport stats (public or user-specific endpoint)
  const {
    data: sportStats,
    isLoading: isLoadingSportStats,
    error: sportStatsError,
  } = useQuery({
    queryKey: ['sport-stats', useUserInterests ? 'user-interests' : 'all'],
    queryFn: () => useUserInterests ? gameService.getUserSportStats() : gameService.getSportStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    retryDelay: 1000,
    enabled: true, // Always enabled, but different endpoint based on useUserInterests
  });

  // Create game event mutation
  const createEventMutation = useMutation({
    mutationFn: (data: CreateGameEventData) => gameService.createEvent(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Game event created successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['game-stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update game event mutation
  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGameEventData }) =>
      gameService.updateEvent(id, data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Game event updated successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete game event mutation
  const deleteEventMutation = useMutation({
    mutationFn: (id: number) => gameService.deleteEvent(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Game event deleted successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['game-stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Join game event mutation
  const joinEventMutation = useMutation({
    mutationFn: (id: number) => gameService.joinEvent(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'You have joined the game event!',
      });
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['game-stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Leave game event mutation
  const leaveEventMutation = useMutation({
    mutationFn: (id: number) => gameService.leaveEvent(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'You have left the game event!',
      });
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['game-stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    // Data
    events,
    pagination,
    sportStats,
    
    // Loading states
    isLoading: isLoadingEvents || isLoadingSportStats,
    isLoadingEvents,
    isLoadingSportStats,
    
    // Error states
    eventsError,
    sportStatsError,
    
    // Mutations
    createEvent: createEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    joinEvent: joinEventMutation.mutate,
    leaveEvent: leaveEventMutation.mutate,
    
    // Mutation states
    isCreating: createEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
    isJoining: joinEventMutation.isPending,
    isLeaving: leaveEventMutation.isPending,
    
    // Utils
    refetchEvents,
  };
};

export const useGame = (id: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['game', id],
    queryFn: () => gameService.getEvent(id),
    enabled: !!id,
  });

  // Update game event mutation
  const updateEventMutation = useMutation({
    mutationFn: (data: UpdateGameEventData) => gameService.updateEvent(id, data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Game event updated successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['game', id] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete game event mutation
  const deleteEventMutation = useMutation({
    mutationFn: () => gameService.deleteEvent(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Game event deleted successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Join game event mutation
  const joinEventMutation = useMutation({
    mutationFn: () => gameService.joinEvent(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'You have joined the game event!',
      });
      queryClient.invalidateQueries({ queryKey: ['game', id] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Leave game event mutation
  const leaveEventMutation = useMutation({
    mutationFn: () => gameService.leaveEvent(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'You have left the game event!',
      });
      queryClient.invalidateQueries({ queryKey: ['game', id] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    // Data
    event,
    
    // Loading states
    isLoading,
    
    // Error states
    error,
    
    // Mutations
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    joinEvent: joinEventMutation.mutate,
    leaveEvent: leaveEventMutation.mutate,
    
    // Mutation states
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
    isJoining: joinEventMutation.isPending,
    isLeaving: leaveEventMutation.isPending,
  };
}; 