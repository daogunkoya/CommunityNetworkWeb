import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, MapPin, Calendar, Users, Trophy, Edit, Trash2, Loader2, Navigation, MessageCircle } from 'lucide-react';
import { GameEvent } from '@/services/games';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { getStorageUrlSafe } from '@/utils/storage';

interface GameEventCardProps {
  event: GameEvent;
  onJoin?: (id: number) => void;
  onLeave?: (id: number) => void;
  onEdit?: (event: GameEvent) => void;
  onDelete?: (id: number) => void;
  isJoining?: boolean;
  isLeaving?: boolean;
  isDeleting?: boolean;
}

export function GameEventCard({
  event,
  onJoin,
  onLeave,
  onEdit,
  onDelete,
  isJoining,
  isLeaving,
  isDeleting,
}: GameEventCardProps) {
  const [showActions, setShowActions] = useState(false);
  const navigate = useNavigate();

  const handleJoin = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onJoin?.(event.id);
  };

  const handleLeave = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onLeave?.(event.id);
  };

  const handleEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onEdit?.(event);
  };

  const handleDelete = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm('Are you sure you want to delete this event?')) {
      onDelete?.(event.id);
    }
  };

  const handleComment = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigate(`/games/${event.id}`);
  };

  const isOrganizer = event.organiser.id === 1; // Assuming current user ID is 1
  const canJoin = event.user_participation.can_join;
  const isParticipating = event.user_participation.is_participating;

  return (
    <Card 
      className="border-border/50 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/games/${event.id}`)}
    >
      <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
          <Link to={`/games/${event.id}`} className="flex items-center gap-3 group" onClick={(e) => e.stopPropagation()}>
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={event.organiser.avatar ? 
                  (event.organiser.avatar.startsWith('http') ? 
                    event.organiser.avatar : 
                    getStorageUrlSafe(event.organiser.avatar)
                  ) : undefined
                } 
              />
              <AvatarFallback>
                {event.organiser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg group-hover:underline">
                  {event.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                Organized by {event.organiser.name}
              </p>
            </div>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOrganizer && (
                <>
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            <span>{event.sport}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
            {event.community && (
              <span className="text-xs text-muted-foreground">({event.community.name})</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{event.starts_at_relative}</span>
          </div>

        </div>

        {event.notes && (
          <p className="text-sm text-muted-foreground">{event.notes}</p>
        )}

          <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{event.current_participants}</span>
              {event.max_participants && (
                <span className="text-muted-foreground">/ {event.max_participants}</span>
              )}
            </div>
            <Badge variant={event.skill_level === 1 ? "secondary" : event.skill_level === 2 ? "default" : "destructive"}>
              {event.skill_level_label}
            </Badge>
            {event.venue_booked && (
              <Badge variant="outline">Venue Booked</Badge>
            )}
            {event.distance_formatted && (
              <Badge variant="outline" className="text-primary border-primary">
                📍 {event.distance_formatted}
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
              <Link to={`/games/${event.id}`}>View details</Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleComment}
              className="flex items-center gap-1"
            >
              <MessageCircle className="h-4 w-4" />
              Discuss
            </Button>
            {canJoin && !isParticipating && (
              <Button 
                onClick={(e) => handleJoin(e)} 
                disabled={isJoining}
                size="sm"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  'Join'
                )}
              </Button>
            )}
            {isParticipating && (
              <Button 
                onClick={(e) => handleLeave(e)} 
                disabled={isLeaving}
                variant="outline"
                size="sm"
              >
                {isLeaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Leaving...
                  </>
                ) : (
                  'Leave'
                )}
              </Button>
            )}
          </div>
        </div>

        {(event.participants?.length ?? 0) > 0 && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground mb-2">Participants:</p>
            <div className="flex flex-wrap gap-1">
              {(event.participants ?? []).slice(0, 5).map((participant) => (
                <Avatar key={participant.id} className="h-6 w-6">
                  <AvatarImage 
                    src={participant.avatar ? 
                      (participant.avatar.startsWith('http') ? 
                        participant.avatar : 
                        getStorageUrlSafe(participant.avatar)
                      ) : undefined
                    } 
                  />
                  <AvatarFallback className="text-xs">
                    {participant.name?.split(' ').map(n => n[0]).join('') || '??'}
                  </AvatarFallback>
                </Avatar>
              ))}
              {(event.participants?.length ?? 0) > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{(event.participants?.length ?? 0) - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 