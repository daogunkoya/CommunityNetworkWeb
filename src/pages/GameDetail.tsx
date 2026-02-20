import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MapPin, Calendar, Users, Trophy, MessageSquare, Plus } from 'lucide-react';
import { gameService, GameEvent } from '@/services/games';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { getStorageUrlSafe } from '@/utils/storage';
import discussionsService, { Discussion } from '@/services/discussions';
import { PostCard } from '@/components/PostCard';
import { CreateDiscussionModal } from '@/components/CreateDiscussionModal';
import { useState } from 'react';

export default function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    data: event,
    isLoading,
    error,
  } = useQuery<GameEvent>({
    queryKey: ['game', id],
    queryFn: () => gameService.getEvent(parseInt(id!, 10)),
    enabled: !!id && isLoggedIn,
  });

  // Fetch discussions related to this specific game event
  const {
    data: discussionsResponse,
    isLoading: isLoadingDiscussions,
  } = useQuery({
    queryKey: ['game-discussions', id],
    queryFn: () => {
      const params = {
        game_event_id: parseInt(id!, 10), // Filter by specific game event
        per_page: 20, // Show more discussions
        sort: 'latest' as const,
      };
      return discussionsService.getDiscussions(params);
    },
    enabled: !!id && isLoggedIn,
  });

  const joinMutation = useMutation({
    mutationFn: () => gameService.joinEvent(parseInt(id!, 10)),
    onSuccess: () => {
      toast.success('Joined game');
      queryClient.invalidateQueries({ queryKey: ['game', id] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (e: any) => toast.error(e.message || 'Failed to join game'),
  });

  const leaveMutation = useMutation({
    mutationFn: () => gameService.leaveEvent(parseInt(id!, 10)),
    onSuccess: () => {
      toast.success('Left game');
      queryClient.invalidateQueries({ queryKey: ['game', id] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (e: any) => toast.error(e.message || 'Failed to leave game'),
  });

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view game details</h1>
          <Button onClick={() => navigate('/auth')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading game...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Game not found</h1>
          <Button onClick={() => navigate('/games')}>Back to Games</Button>
        </div>
      </div>
    );
  }

  const userParticipation = event.user_participation ?? {
    is_participating: false,
    is_waiting: false,
    can_join: false,
  };
  const isParticipating = !!userParticipation.is_participating;
  const canJoin = !!userParticipation.can_join;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate('/games')}>{'<'} Back to Games</Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={event.organiser?.avatar ?
                    (event.organiser.avatar.startsWith('http') ?
                      event.organiser.avatar :
                      getStorageUrlSafe(event.organiser.avatar)
                    ) : undefined
                  }
                />
                <AvatarFallback>
                  {event.organiser?.name?.split(' ').map(n => n[0]).join('') || '??'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
                <p className="text-sm text-muted-foreground">Organized by {event.organiser?.name || 'Unknown'}</p>
              </div>
            </div>
            <Badge className="text-white" variant="default">{event.sport}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}{event.community ? ` (${event.community.name})` : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{event.starts_at_relative}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {event.current_participants}
                {event.max_participants ? ` / ${event.max_participants}` : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <Badge variant={event.skill_level === 1 ? 'secondary' : event.skill_level === 2 ? 'default' : 'destructive'}>
                {event.skill_level_label}
              </Badge>
            </div>
          </div>

          {event.notes && (
            <div>
              <h3 className="font-semibold mb-1">Notes</h3>
              <p className="text-sm text-muted-foreground">{event.notes}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {canJoin && !isParticipating && (
              <Button onClick={() => joinMutation.mutate()} disabled={joinMutation.isPending}>
                {joinMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Joining...
                  </>
                ) : 'Join Game'}
              </Button>
            )}
            {isParticipating && (
              <Button variant="outline" onClick={() => leaveMutation.mutate()} disabled={leaveMutation.isPending}>
                {leaveMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Leaving...
                  </>
                ) : 'Leave Game'}
              </Button>
            )}
          </div>

          {(event.participants?.length ?? 0) > 0 && (
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Participants</h3>
              <div className="flex flex-wrap gap-2">
                {(event.participants ?? []).map((p) => (
                  <div key={p.id} className="flex items-center gap-2 px-2 py-1 rounded border">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={p.avatar ? (p.avatar.startsWith('http') ? p.avatar : getStorageUrlSafe(p.avatar)) : undefined}
                      />
                      <AvatarFallback className="text-xs">{p.name?.split(' ').map(n => n[0]).join('') || '??'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{p.name || 'Unknown'}</span>
                    {p.is_waiting && <Badge variant="secondary">Waiting</Badge>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Discussions Section */}
      <Card className="border-border/50 mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Game Discussions</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/discussion')}
              >
                Browse All Discussions
              </Button>
              <Button
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Start Discussion
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingDiscussions ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : Array.isArray(discussionsResponse?.data) && discussionsResponse.data.length > 0 ? (
            <div className="space-y-4">
              {/* Show info about filtering */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-blue-800">
                    Showing {discussionsResponse.data.length} discussion{discussionsResponse.data.length !== 1 ? 's' : ''} for this game event
                  </span>
                </div>
              </div>

              {discussionsResponse.data.slice(0, 5).map((discussion: any) => (
                <PostCard
                  key={discussion.id}
                  id={discussion.id}
                  author={discussion.author?.name || 'Unknown'}
                  avatar={discussion.author?.avatar}
                  time={discussion.created_at_relative}
                  content={discussion.excerpt}
                  type="discussion"
                  likes={discussion.stats.likes_count}
                  comments={discussion.stats.comments_count}
                  isLiked={discussion.user_interaction.is_liked}
                  discussion={discussion}
                />
              ))}
              {Array.isArray(discussionsResponse?.data) && discussionsResponse.data.length > 5 && (
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/discussion')}
                  >
                    View {discussionsResponse.data.length - 5} more discussions
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
              <p className="text-sm mb-4">
                Be the first to start a discussion about this game event!
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Start Discussion
                </Button>
                <Button variant="outline" onClick={() => navigate('/discussion')}>
                  Browse All Discussions
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Discussion Modal */}
      <CreateDiscussionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['game-discussions'] });
        }}
        gameEventId={parseInt(id!, 10)}
      />
    </div>
  );
}


