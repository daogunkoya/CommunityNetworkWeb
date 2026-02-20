import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import discussionsService, { CreateDiscussionData } from '@/services/discussions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GameType {
  id: number;
  name: string;
  color: string;
  icon_path: string;
}

interface CreateDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  gameEventId?: number; // Optional game event ID for game-specific discussions
}

export function CreateDiscussionModal({ isOpen, onClose, onSuccess, gameEventId }: CreateDiscussionModalProps) {
  const [formData, setFormData] = useState<CreateDiscussionData>({
    title: '',
    body: '',
    game_type_id: undefined,
    game_event_id: gameEventId
  });
  const [gameTypes, setGameTypes] = useState<GameType[]>([]);
  const [isLoadingGameTypes, setIsLoadingGameTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load game types when modal opens
  useEffect(() => {
    if (isOpen) {
      loadGameTypes();
    }
  }, [isOpen]);

  // Update gameEventId when prop changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      game_event_id: gameEventId
    }));
  }, [gameEventId]);

  const loadGameTypes = async () => {
    setIsLoadingGameTypes(true);
    try {
      const response = await discussionsService.getAvailableGameTypes();
      setGameTypes(response.data);
    } catch (error) {
      console.error('Failed to load available game types:', error);
      toast.error('Failed to load available game types');
    } finally {
      setIsLoadingGameTypes(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.body.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await discussionsService.createDiscussion(formData);
      toast.success('Discussion created successfully!');
      setFormData({ title: '', body: '', game_type_id: undefined, game_event_id: gameEventId });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create discussion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ title: '', body: '' });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{gameEventId ? 'Start Game Discussion' : 'Start New Discussion'}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter discussion title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              maxLength={255}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="game_type">Sport/Game Type</Label>
            <Select
              value={formData.game_type_id?.toString() || ''}
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                game_type_id: value ? parseInt(value) : undefined 
              }))}
              disabled={isSubmitting || isLoadingGameTypes}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingGameTypes ? "Loading your sports..." : "Select a sport from your interests (optional)"} />
              </SelectTrigger>
              <SelectContent>
                {isLoadingGameTypes ? (
                  <SelectItem value="loading" disabled>
                    Loading your sports...
                  </SelectItem>
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
                  <SelectItem value="no-interests" disabled>
                    Set your interests to see sports
                  </SelectItem>
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

          <div className="space-y-2">
            <Label htmlFor="body">Content *</Label>
            <Textarea
              id="body"
              placeholder="Share your thoughts, questions, or tips..."
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              rows={6}
              maxLength={5000}
              disabled={isSubmitting}
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.body.length}/5000 characters
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.body.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Discussion'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 