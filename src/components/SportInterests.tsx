import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { profileService } from '@/services/profile';
import gameTypesService, { GameType } from '@/services/gameTypes';
import { registrationService } from '@/services/registration';
import { Loader2, Plus, Trash2, Edit3 } from 'lucide-react';

interface UserInterest {
  game_type_id: number;
  name: string;
  skill_level: number;
  color: string;
  icon_path: string;
}

interface SportInterestsProps {
  onInterestsChange?: (interests: UserInterest[]) => void;
}

const skillLevels = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Intermediate' },
  { value: 3, label: 'Advanced' },
  { value: 4, label: 'Expert' },
];

export default function SportInterests({ onInterestsChange }: SportInterestsProps) {
  const [userInterests, setUserInterests] = useState<UserInterest[]>([]);
  const [availableGameTypes, setAvailableGameTypes] = useState<GameType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingInterest, setIsAddingInterest] = useState(false);
  const [selectedGameType, setSelectedGameType] = useState<string>('');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load user interests
      const interests = await profileService.getInterests();
      setUserInterests(Array.isArray(interests) ? interests : []);
      
      // Try to load available game types using multiple methods
      let gameTypes: GameType[] = [];
      
      // First, try using registration service (same endpoint as registration page)
      try {
        const registrationSports = await registrationService.getSports();
        if (Array.isArray(registrationSports) && registrationSports.length > 0) {
          // Map registration sports to GameType format
          gameTypes = registrationSports.map((sport: any) => ({
            id: sport.id,
            name: sport.name,
            description: sport.description || '',
            icon_path: sport.icon_path || sport.icon || '',
            color: sport.color || '#3b82f6',
            created_at: sport.created_at || '',
            updated_at: sport.updated_at || ''
          }));
        }
      } catch (regError) {
        console.warn('Registration sports endpoint failed, trying game-types:', regError);
      }
      
      // If registration endpoint didn't work, try game-types endpoint as fallback
      if (gameTypes.length === 0) {
        try {
          const gameTypesResponse = await gameTypesService.getGameTypes();
          gameTypes = gameTypesResponse?.data || [];
        } catch (gameTypesError) {
          console.warn('Game types endpoint also failed:', gameTypesError);
        }
      }
      
      setAvailableGameTypes(Array.isArray(gameTypes) ? gameTypes : []);
      
      // Notify parent component
      onInterestsChange?.(interests);
      
      // Show warning if no sports are available
      if (gameTypes.length === 0) {
        toast({
          title: 'Warning',
          description: 'Unable to load available sports. Please refresh the page or try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to load interests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your sport interests',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddInterest = async () => {
    if (!selectedGameType || !selectedSkillLevel) {
      toast({
        title: 'Missing Information',
        description: 'Please select both a sport and skill level',
        variant: 'destructive',
      });
      return;
    }

    // Check if interest already exists
    const gameTypeId = parseInt(selectedGameType);
    if (Array.isArray(userInterests) && userInterests.some(interest => interest?.game_type_id === gameTypeId)) {
      toast({
        title: 'Already Added',
        description: 'You already have this sport in your interests',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUpdating(true);
      const newInterest = {
        game_type_id: gameTypeId,
        skill_level: parseInt(selectedSkillLevel)
      };

      const updatedInterests = [...userInterests, newInterest];
      const response = await profileService.updateInterests(
        updatedInterests.map(interest => ({
          game_type_id: interest.game_type_id,
          skill_level: interest.skill_level
        }))
      );

      // Update local state with the response data - ensure it's always an array
      const updatedData = Array.isArray(response?.data?.data) 
        ? response.data.data 
        : Array.isArray(response?.data) 
        ? response.data 
        : [];
      setUserInterests(updatedData);
      onInterestsChange?.(updatedData);

      // Reset form
      setSelectedGameType('');
      setSelectedSkillLevel('');
      setIsAddingInterest(false);

      toast({
        title: 'Success',
        description: 'Sport interest added successfully',
      });
    } catch (error) {
      console.error('Failed to add interest:', error);
      toast({
        title: 'Error',
        description: 'Failed to add sport interest',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveInterest = async (gameTypeId: number) => {
    try {
      setIsUpdating(true);
      const updatedInterests = Array.isArray(userInterests) 
        ? userInterests.filter(interest => interest?.game_type_id !== gameTypeId)
        : [];
      
      const response = await profileService.updateInterests(
        updatedInterests.map(interest => ({
          game_type_id: interest.game_type_id,
          skill_level: interest.skill_level
        }))
      );

      // Ensure response data is always an array
      const responseData = Array.isArray(response?.data?.data) 
        ? response.data.data 
        : Array.isArray(response?.data) 
        ? response.data 
        : Array.isArray(response) 
        ? response 
        : [];
      setUserInterests(responseData);
      onInterestsChange?.(responseData);

      toast({
        title: 'Success',
        description: 'Sport interest removed successfully',
      });
    } catch (error) {
      console.error('Failed to remove interest:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove sport interest',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSkillLevelChange = async (gameTypeId: number, newSkillLevel: number) => {
    try {
      setIsUpdating(true);
      const updatedInterests = Array.isArray(userInterests)
        ? userInterests.map(interest =>
            interest?.game_type_id === gameTypeId
              ? { ...interest, skill_level: newSkillLevel }
              : interest
          )
        : [];

      const response = await profileService.updateInterests(
        updatedInterests.map(interest => ({
          game_type_id: interest.game_type_id,
          skill_level: interest.skill_level
        }))
      );

      // Ensure response data is always an array
      const responseData = Array.isArray(response?.data?.data) 
        ? response.data.data 
        : Array.isArray(response?.data) 
        ? response.data 
        : Array.isArray(response) 
        ? response 
        : [];
      setUserInterests(responseData);
      onInterestsChange?.(responseData);

      toast({
        title: 'Success',
        description: 'Skill level updated successfully',
      });
    } catch (error) {
      console.error('Failed to update skill level:', error);
      toast({
        title: 'Error',
        description: 'Failed to update skill level',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getSkillLevelLabel = (level: number) => {
    return skillLevels.find(sl => sl.value === level)?.label || 'Unknown';
  };

  const getSkillLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-orange-100 text-orange-800';
      case 4: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Sport Interests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading your interests...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="h-5 w-5" />
          Sport Interests
          <Badge variant="secondary">{Array.isArray(userInterests) ? userInterests.length : 0}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Interests */}
        {Array.isArray(userInterests) && userInterests.length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700">Your Sports</h4>
            {userInterests.map((interest) => (
              <div
                key={interest.game_type_id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: interest.color }}
                  >
                    {interest.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{interest.name}</p>
                    <div className="flex items-center gap-2">
                      <Select
                        value={interest.skill_level.toString()}
                        onValueChange={(value) => handleSkillLevelChange(interest.game_type_id, parseInt(value))}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {skillLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value.toString()}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveInterest(interest.game_type_id)}
                  disabled={isUpdating}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No sport interests set yet.</p>
            <p className="text-sm">Add your favorite sports to get personalized recommendations!</p>
          </div>
        )}

        {/* Add New Interest */}
        {!isAddingInterest ? (
          <Button
            onClick={() => setIsAddingInterest(true)}
            variant="outline"
            className="w-full"
            disabled={isUpdating}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Sport Interest
          </Button>
        ) : (
          <div className="p-4 bg-blue-50 rounded-lg space-y-3">
            <h4 className="font-medium text-sm">Add New Sport Interest</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Select
                value={selectedGameType}
                onValueChange={setSelectedGameType}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a sport" />
                </SelectTrigger>
                <SelectContent>
                  {(Array.isArray(availableGameTypes) ? availableGameTypes : [])
                    .filter(gameType => Array.isArray(userInterests) && gameType?.id && !userInterests.some(interest => interest?.game_type_id === gameType.id))
                    .map((gameType) => (
                      <SelectItem key={gameType.id} value={gameType.id.toString()}>
                        {gameType.name || 'Unknown Sport'}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedSkillLevel}
                onValueChange={setSelectedSkillLevel}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value.toString()}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddInterest}
                disabled={isUpdating || !selectedGameType || !selectedSkillLevel}
                className="flex-1"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Interest
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingInterest(false);
                  setSelectedGameType('');
                  setSelectedSkillLevel('');
                }}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {Array.isArray(userInterests) && userInterests.length > 0 && (
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <p><strong>Tip:</strong> Your sport interests help us show you personalized content on your dashboard, including relevant games, tournaments, and activity updates.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
