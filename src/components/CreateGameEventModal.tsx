import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Calendar, MapPin, Users, Trophy, X } from 'lucide-react';
import { gameService, CreateGameEventData } from '@/services/games';
import discussionsService from '@/services/discussions';
import AddressInput from '@/components/ui/AddressInput';

interface CreateGameEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGameCreated: () => void;
}

interface GameType {
  id: number;
  name: string;
  color?: string;
  icon_path?: string;
}

export function CreateGameEventModal({ open, onOpenChange, onGameCreated }: CreateGameEventModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameTypes, setGameTypes] = useState<GameType[]>([]);
  const [isLoadingGameTypes, setIsLoadingGameTypes] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateGameEventData>({
    game_type_id: 0,
    skill_level: 1,
    location: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    latitude: null,
    longitude: null,
    community_name: '',
    borough: '',
    starts_at: '',
    venue_booked: false,
    max_participants: 10,
    waiting_list_enabled: false,
    notes: '',
  });

  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        game_type_id: 0,
        skill_level: 1,
        location: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        latitude: null,
        longitude: null,
        community_name: '',
        borough: '',
        starts_at: '',
        venue_booked: false,
        max_participants: 10,
        waiting_list_enabled: false,
        notes: '',
      });
      setSelectedAddress(null);
      loadGameTypes();
    }
  }, [open]);

  const loadGameTypes = async () => {
    setIsLoadingGameTypes(true);
    try {
      const response = await discussionsService.getAvailableGameTypes();
      setGameTypes(response.data);
    } catch (error) {
      console.error('Failed to load available game types:', error);
      toast({
        title: 'Error',
        description: 'Failed to load available game types',
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

  const handleAddressSelect = (address: any) => {
    setSelectedAddress(address);
    setFormData(prev => ({
      ...prev,
      location: address.formatted_address,
      address: address.address || '',
      city: address.city || '',
      state: address.state || '',
      postal_code: address.postal_code || '',
      country: address.country || '',
      latitude: address.latitude || null,
      longitude: address.longitude || null,
      community_name: address.community_name || '',
      borough: address.borough || '',
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
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
              value={formData.game_type_id > 0 ? formData.game_type_id.toString() : undefined}
              onValueChange={(value) => {
                handleInputChange('game_type_id', parseInt(value));
              }}
              disabled={isLoadingGameTypes}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingGameTypes ? "Loading your sports..." : "Select a sport from your interests"} />
              </SelectTrigger>
              <SelectContent>
                {isLoadingGameTypes ? (
                  <SelectItem value="loading" disabled>Loading your sports...</SelectItem>
                ) : gameTypes.length > 0 ? (
                  gameTypes.map((gameType) => (
                    <SelectItem key={gameType.id} value={gameType.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: gameType.color }}
                        />
                        {gameType.name}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-interests" disabled>Set your interests to see sports</SelectItem>
                )}
              </SelectContent>
            </Select>
            {gameTypes.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Showing {gameTypes.length} sport(s) from your interests
              </p>
            )}
            {gameTypes.length === 0 && !isLoadingGameTypes && (
              <p className="text-xs text-amber-600">
                No sports available. Set your interests in your profile to see relevant sports.
              </p>
            )}
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
            <AddressInput
              value={formData.location}
              onChange={(value) => handleInputChange('location', value)}
              onAddressSelect={handleAddressSelect}
              placeholder="Enter game venue or location"
              label="Game Location *"
              showPostcodeSearch={true}
            />
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
                className="pl-10 pr-20"
                required
              />
              {formData.starts_at && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInputChange('starts_at', '')}
                    className="absolute right-2 top-2 h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => {
                      // Blur the input to close the date picker
                      const input = document.getElementById('starts_at') as HTMLInputElement;
                      if (input) input.blur();
                    }}
                    className="absolute right-9 top-2 h-6 px-2 text-xs"
                  >
                    Done
                  </Button>
                </>
              )}
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