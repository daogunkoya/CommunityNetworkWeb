import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Calendar, MapPin, Trophy, Users, DollarSign } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tournamentsService, CreateTournamentData } from '@/services/tournaments';

interface CreateTournamentModalProps {
  onSuccess?: () => void;
}

interface GameType {
  id: number;
  name: string;
  color: string;
  icon_path: string;
}

export function CreateTournamentModal({ onSuccess }: CreateTournamentModalProps) {
  const [open, setOpen] = useState(false);
  const [availableGameTypes, setAvailableGameTypes] = useState<GameType[]>([]);
  const [formData, setFormData] = useState<CreateTournamentData>({
    name: '',
    description: '',
    game_type_id: 1,
    location: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    starts_at: '',
    ends_at: '',
    registration_deadline: '',
    max_participants: 16,
    min_participants: 2,
    entry_fee: 0,
    prize_pool: 0,
    prize_description: '',
    skill_level: 2,
    rules: '',
    format: 'single-elimination',
    bracket_type: 'standard',
    status: 'pending_approval',
    waiting_list_enabled: false,
  });

  const queryClient = useQueryClient();

  // Fetch available game types (user's interests only) using React Query
  const {
    data: availableGameTypesResponse,
    isLoading: isLoadingGameTypes
  } = useQuery({
    queryKey: ['available-game-types-create-tournament'],
    queryFn: () => tournamentsService.getAvailableGameTypes(),
    enabled: open, // Only fetch when modal is open
  });

  // Update available game types and set default when data changes
  useEffect(() => {
    if (availableGameTypesResponse?.data && availableGameTypesResponse.data.length > 0) {
      setAvailableGameTypes(availableGameTypesResponse.data);
      // Set first game type as default if available
      setFormData(prev => {
        // Only update if current game_type_id doesn't exist in available types
        const hasValidGameType = availableGameTypesResponse.data.some(gt => gt.id === prev.game_type_id);
        if (!hasValidGameType) {
          return { ...prev, game_type_id: availableGameTypesResponse.data[0].id };
        }
        return prev;
      });
    }
  }, [availableGameTypesResponse]);

  const createTournamentMutation = useMutation({
    mutationFn: (data: CreateTournamentData) => tournamentsService.createTournament(data),
    onSuccess: (data) => {
      toast.success('Tournament created successfully!');
      setOpen(false);
      setFormData({
        name: '',
        description: '',
        game_type_id: 1,
        location: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        starts_at: '',
        ends_at: '',
        registration_deadline: '',
        max_participants: 16,
        min_participants: 2,
        entry_fee: 0,
        prize_pool: 0,
        prize_description: '',
        skill_level: 2,
        rules: '',
        format: 'single-elimination',
        bracket_type: 'standard',
        status: 'pending_approval',
        waiting_list_enabled: false,
      });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.game_type_id || !formData.location || !formData.starts_at || !formData.ends_at || !formData.registration_deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    createTournamentMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof CreateTournamentData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full px-6 py-2">
          <Plus className="h-4 w-4 mr-2" />
          Create Tournament
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-sport-orange" />
            Create New Tournament
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tournament Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter tournament name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="game_type">Sport *</Label>
                <Select 
                  value={formData.game_type_id.toString()} 
                  onValueChange={(value) => handleInputChange('game_type_id', parseInt(value))}
                  disabled={isLoadingGameTypes}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingGameTypes ? "Loading your sports..." : "Select sport from your interests"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingGameTypes ? (
                      <SelectItem value="loading" disabled>Loading your sports...</SelectItem>
                    ) : availableGameTypes.length > 0 ? (
                      availableGameTypes.map((gameType) => (
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
                      <SelectItem value="no-interests" disabled>
                        Set your interests in profile to create tournaments
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {availableGameTypes.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Showing {availableGameTypes.length} sport(s) from your interests
                  </p>
                )}
                {availableGameTypes.length === 0 && !isLoadingGameTypes && (
                  <p className="text-xs text-amber-600">
                    No sports available. Set your interests in your profile to create tournaments.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your tournament..."
                rows={3}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location Name *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Central Sports Complex"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Street address"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="State"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  placeholder="Postal code"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Tournament Dates
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="starts_at">Start Date & Time *</Label>
                <Input
                  id="starts_at"
                  type="datetime-local"
                  value={formData.starts_at}
                  onChange={(e) => handleInputChange('starts_at', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ends_at">End Date & Time *</Label>
                <Input
                  id="ends_at"
                  type="datetime-local"
                  value={formData.ends_at}
                  onChange={(e) => handleInputChange('ends_at', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registration_deadline">Registration Deadline *</Label>
                <Input
                  id="registration_deadline"
                  type="datetime-local"
                  value={formData.registration_deadline}
                  onChange={(e) => handleInputChange('registration_deadline', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Participants & Prizes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participants & Prizes
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_participants">Max Participants</Label>
                <Input
                  id="max_participants"
                  type="number"
                  value={formData.max_participants || ''}
                  onChange={(e) => handleInputChange('max_participants', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Leave empty for unlimited"
                  min="2"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="min_participants">Min Participants</Label>
                <Input
                  id="min_participants"
                  type="number"
                  value={formData.min_participants}
                  onChange={(e) => handleInputChange('min_participants', parseInt(e.target.value))}
                  min="2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entry_fee">Entry Fee (£)</Label>
                <Input
                  id="entry_fee"
                  type="number"
                  value={formData.entry_fee}
                  onChange={(e) => handleInputChange('entry_fee', parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prize_pool">Prize Pool (£)</Label>
                <Input
                  id="prize_pool"
                  type="number"
                  value={formData.prize_pool || ''}
                  onChange={(e) => handleInputChange('prize_pool', e.target.value ? parseFloat(e.target.value) : undefined)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prize_description">Prize Description</Label>
              <Input
                id="prize_description"
                value={formData.prize_description}
                onChange={(e) => handleInputChange('prize_description', e.target.value)}
                placeholder="e.g., Cash prizes for top 3 players"
              />
            </div>
          </div>

          {/* Tournament Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tournament Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="skill_level">Skill Level</Label>
                <Select value={formData.skill_level.toString()} onValueChange={(value) => handleInputChange('skill_level', parseInt(value))}>
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
              
              <div className="space-y-2">
                <Label htmlFor="format">Tournament Format</Label>
                <Select value={formData.format} onValueChange={(value) => handleInputChange('format', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-elimination">Single Elimination</SelectItem>
                    <SelectItem value="double-elimination">Double Elimination</SelectItem>
                    <SelectItem value="round-robin">Round Robin</SelectItem>
                    <SelectItem value="swiss">Swiss System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rules">Tournament Rules</Label>
              <Textarea
                id="rules"
                value={formData.rules}
                onChange={(e) => handleInputChange('rules', e.target.value)}
                placeholder="Enter tournament rules..."
                rows={3}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createTournamentMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTournamentMutation.isPending}
            >
              {createTournamentMutation.isPending ? 'Creating...' : 'Create Tournament'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 