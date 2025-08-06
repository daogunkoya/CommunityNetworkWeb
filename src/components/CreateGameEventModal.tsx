import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Calendar, MapPin, Users, Trophy } from 'lucide-react';
import { gameService, CreateGameEventData } from '@/services/games';

interface CreateGameEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGameCreated: () => void;
}

interface GameType {
  id: number;
  name: string;
}

export function CreateGameEventModal({ open, onOpenChange, onGameCreated }: CreateGameEventModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameTypes, setGameTypes] = useState<GameType[]>([]);
  const [isLoadingGameTypes, setIsLoadingGameTypes] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateGameEventData>({
    game_type_id: '',
    skill_level: 1,
    location: '',
    starts_at: '',
    venue_booked: false,
    max_participants: 10,
    waiting_list_enabled: false,
    notes: '',
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        game_type_id: '',
        skill_level: 1,
        location: '',
        starts_at: '',
        venue_booked: false,
        max_participants: 10,
        waiting_list_enabled: false,
        notes: '',
      });
      loadGameTypes();
    }
  }, [open]);

  const loadGameTypes = async () => {
    setIsLoadingGameTypes(true);
    try {
      const response = await fetch('http://localhost:8001/api/game-types');
      if (response.ok) {
        const data = await response.json();
        setGameTypes(data);
      }
    } catch (error) {
      console.error('Failed to load game types:', error);
      toast({
        title: 'Error',
        description: 'Failed to load game types',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingGameTypes(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await gameService.createEvent(formData);
      toast({
        title: 'Success',
        description: 'Game event created successfully!',
      });
      onGameCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create game event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create game event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateGameEventData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Create New Game Event
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sport Type */}
          <div className="space-y-2">
            <Label htmlFor="game_type_id">Sport Type *</Label>
            <Select
              value={formData.game_type_id.toString()}
              onValueChange={(value) => handleInputChange('game_type_id', parseInt(value))}
              disabled={isLoadingGameTypes}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingGameTypes ? "Loading sports..." : "Select a sport"} />
              </SelectTrigger>
              <SelectContent>
                {gameTypes.map((gameType) => (
                  <SelectItem key={gameType.id} value={gameType.id.toString()}>
                    {gameType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skill Level */}
          <div className="space-y-2">
            <Label htmlFor="skill_level">Skill Level *</Label>
            <Select
              value={formData.skill_level.toString()}
              onValueChange={(value) => handleInputChange('skill_level', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Beginner</SelectItem>
                <SelectItem value="2">Intermediate</SelectItem>
                <SelectItem value="3">Advanced</SelectItem>
                <SelectItem value="4">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="location"
                placeholder="Enter venue or location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-2">
            <Label htmlFor="starts_at">Date & Time *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="starts_at"
                type="datetime-local"
                value={formData.starts_at}
                onChange={(e) => handleInputChange('starts_at', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Max Participants */}
          <div className="space-y-2">
            <Label htmlFor="max_participants">Max Participants *</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="max_participants"
                type="number"
                min="1"
                max="100"
                value={formData.max_participants}
                onChange={(e) => handleInputChange('max_participants', parseInt(e.target.value))}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Venue Booked */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="venue_booked"
              checked={formData.venue_booked}
              onChange={(e) => handleInputChange('venue_booked', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="venue_booked">Venue is booked</Label>
          </div>

          {/* Waiting List */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="waiting_list_enabled"
              checked={formData.waiting_list_enabled}
              onChange={(e) => handleInputChange('waiting_list_enabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="waiting_list_enabled">Enable waiting list</Label>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information about the game..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.game_type_id || !formData.location || !formData.starts_at}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Game'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 