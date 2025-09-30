import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MapPin, Calendar, Users, Trophy } from 'lucide-react';
import { gameService, GameEvent } from '@/services/games';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: event,
    isLoading,
    error,
  } = useQuery<GameEvent>({
    queryKey: ['game', id],
    queryFn: () => gameService.getEvent(parseInt(id!, 10)),
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
                  src={event.organiser.avatar ? 
                    (event.organiser.avatar.startsWith('http') ? 
                      event.organiser.avatar : 
                      `http://localhost:8001/storage/${event.organiser.avatar}`
                    ) : undefined
                  } 
                />
                <AvatarFallback>
                  {event.organiser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
                <p className="text-sm text-muted-foreground">Organized by {event.organiser.name}</p>
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
                        src={p.avatar ? (p.avatar.startsWith('http') ? p.avatar : `http://localhost:8001/storage/${p.avatar}`) : undefined}
                      />
                      <AvatarFallback className="text-xs">{p.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{p.name}</span>
                    {p.is_waiting && <Badge variant="secondary">Waiting</Badge>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


