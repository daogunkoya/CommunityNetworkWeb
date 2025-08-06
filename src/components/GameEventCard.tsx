import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, MapPin, Calendar, Users, Trophy, Edit, Trash2, Loader2 } from 'lucide-react';
import { GameEvent } from '@/services/games';
import { format } from 'date-fns';

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

  const handleJoin = () => {
    onJoin?.(event.id);
  };

  const handleLeave = () => {
    onLeave?.(event.id);
  };

  const handleEdit = () => {
    onEdit?.(event);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this event?')) {
      onDelete?.(event.id);
    }
  };

  const isOrganizer = event.organiser.id === 1; // Assuming current user ID is 1
  const canJoin = event.user_participation.can_join;
  const isParticipating = event.user_participation.is_participating;

  return (
    <Card className="border-border/50 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
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
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-sm text-muted-foreground">
                Organized by {event.organiser.name}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
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
          </div>

          <div className="flex gap-2">
            {canJoin && !isParticipating && (
              <Button 
                onClick={handleJoin} 
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
                onClick={handleLeave} 
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

        {event.participants.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground mb-2">Participants:</p>
            <div className="flex flex-wrap gap-1">
              {event.participants.slice(0, 5).map((participant) => (
                <Avatar key={participant.id} className="h-6 w-6">
                  <AvatarImage 
                    src={participant.avatar ? 
                      (participant.avatar.startsWith('http') ? 
                        participant.avatar : 
                        `http://localhost:8001/storage/${participant.avatar}`
                      ) : undefined
                    } 
                  />
                  <AvatarFallback className="text-xs">
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {event.participants.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{event.participants.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 