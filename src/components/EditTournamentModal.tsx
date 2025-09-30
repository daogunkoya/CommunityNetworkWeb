import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Edit, Calendar, MapPin, Trophy, Users, DollarSign, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { tournamentsService } from '@/services/tournaments';

interface Tournament {
  id: number;
  name: string;
  description: string;
  game_type_id: number;
  location: string;
  address: string;
  starts_at: string;
  ends_at: string;
  registration_deadline: string;
  max_participants: number;
  entry_fee: string;
  prize_pool: string;
  prize_description: string;
  skill_level: string;
  rules: string;
  format: string;
  status: string;
}

interface EditTournamentModalProps {
  tournament: Tournament;
}

export function EditTournamentModal({ tournament }: EditTournamentModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: tournament.name,
    description: tournament.description,
    game_type_id: tournament.game_type_id.toString(),
    location: tournament.location,
    address: tournament.address,
    starts_at: tournament.starts_at.split(' ')[0], // Extract date only
    ends_at: tournament.ends_at.split(' ')[0],
    registration_deadline: tournament.registration_deadline.split(' ')[0],
    max_participants: tournament.max_participants,
    entry_fee: tournament.entry_fee,
    prize_pool: tournament.prize_pool,
    prize_description: tournament.prize_description,
    skill_level: tournament.skill_level,
    rules: tournament.rules || '',
    format: tournament.format || '',
  });

  const queryClient = useQueryClient();

  const updateTournamentMutation = useMutation({
    mutationFn: (data: any) => tournamentService.updateTournament(tournament.id, data),
    onSuccess: () => {
      toast.success('Tournament updated successfully!');
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['tournament', tournament.id] });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update tournament');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      game_type_id: parseInt(formData.game_type_id),
      max_participants: parseInt(formData.max_participants),
      entry_fee: parseFloat(formData.entry_fee),
      prize_pool: parseFloat(formData.prize_pool),
      skill_level: parseInt(formData.skill_level),
    };

    updateTournamentMutation.mutate(submitData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Edit className="h-4 w-4 mr-2" />
          Edit Tournament
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-sport-orange" />
            Edit Tournament
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tournament Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter tournament name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="game_type_id">Sport</Label>
                <Select value={formData.game_type_id} onValueChange={(value) => handleInputChange('game_type_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Basketball</SelectItem>
                    <SelectItem value="2">Football</SelectItem>
                    <SelectItem value="3">Tennis</SelectItem>
                    <SelectItem value="4">Swimming</SelectItem>
                    <SelectItem value="5">Cycling</SelectItem>
                    <SelectItem value="6">Running</SelectItem>
                    <SelectItem value="7">Golf</SelectItem>
                    <SelectItem value="8">Cricket</SelectItem>
                    <SelectItem value="9">Rugby</SelectItem>
                    <SelectItem value="10">Badminton</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your tournament"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location Name</Label>
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
                  placeholder="Full address"
                  required
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="starts_at">Start Date</Label>
                <Input
                  id="starts_at"
                  type="date"
                  value={formData.starts_at}
                  onChange={(e) => handleInputChange('starts_at', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ends_at">End Date</Label>
                <Input
                  id="ends_at"
                  type="date"
                  value={formData.ends_at}
                  onChange={(e) => handleInputChange('ends_at', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registration_deadline">Registration Deadline</Label>
                <Input
                  id="registration_deadline"
                  type="date"
                  value={formData.registration_deadline}
                  onChange={(e) => handleInputChange('registration_deadline', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Participants & Fees */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participants & Fees
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_participants">Max Participants</Label>
                <Input
                  id="max_participants"
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => handleInputChange('max_participants', e.target.value)}
                  min="1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skill_level">Skill Level</Label>
                <Select value={formData.skill_level} onValueChange={(value) => handleInputChange('skill_level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Beginner</SelectItem>
                    <SelectItem value="2">All Levels</SelectItem>
                    <SelectItem value="3">Intermediate</SelectItem>
                    <SelectItem value="4">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entry_fee">Entry Fee (£)</Label>
                <Input
                  id="entry_fee"
                  type="number"
                  step="0.01"
                  value={formData.entry_fee}
                  onChange={(e) => handleInputChange('entry_fee', e.target.value)}
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prize_pool">Prize Pool (£)</Label>
                <Input
                  id="prize_pool"
                  type="number"
                  step="0.01"
                  value={formData.prize_pool}
                  onChange={(e) => handleInputChange('prize_pool', e.target.value)}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prize_description">Prize Description</Label>
              <Textarea
                id="prize_description"
                value={formData.prize_description}
                onChange={(e) => handleInputChange('prize_description', e.target.value)}
                placeholder="Describe the prizes"
                rows={2}
              />
            </div>
          </div>

          {/* Tournament Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Tournament Details
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="format">Tournament Format</Label>
              <Input
                id="format"
                value={formData.format}
                onChange={(e) => handleInputChange('format', e.target.value)}
                placeholder="e.g., Single elimination, Round robin"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rules">Tournament Rules</Label>
              <Textarea
                id="rules"
                value={formData.rules}
                onChange={(e) => handleInputChange('rules', e.target.value)}
                placeholder="Enter tournament rules and regulations"
                rows={4}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={updateTournamentMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateTournamentMutation.isPending}
            >
              {updateTournamentMutation.isPending ? 'Updating...' : 'Update Tournament'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 