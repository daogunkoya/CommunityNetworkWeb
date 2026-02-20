import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, MessageCircle, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import gameCommentsService, { GameEventComment } from '@/services/gameComments';

interface GameCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameEventId: number;
  gameEventTitle: string;
  onCommentAdded?: () => void; // Callback to update comment count
}

export function GameCommentModal({
  isOpen,
  onClose,
  gameEventId,
  gameEventTitle,
  onCommentAdded
}: GameCommentModalProps) {
  const [comments, setComments] = useState<GameEventComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Array<{ user_id: number; user_name: string; started_at: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load comments when modal opens
  useEffect(() => {
    if (isOpen && gameEventId) {
      loadComments();
    }
  }, [isOpen, gameEventId]);

  // Poll for typing indicators when modal is open
  useEffect(() => {
    if (!isOpen || !gameEventId) return;

    const pollTypingUsers = async () => {
      try {
        const response = await gameCommentsService.getTypingUsers(gameEventId);
        setTypingUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch typing users:', error);
      }
    };

    // Poll immediately and then every 2 seconds
    pollTypingUsers();
    const interval = setInterval(pollTypingUsers, 2000);

    return () => clearInterval(interval);
  }, [isOpen, gameEventId]);

  // Cleanup typing indicator when modal closes
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping && gameEventId) {
        gameCommentsService.stopTyping(gameEventId).catch(console.error);
      }
    };
  }, [isTyping, gameEventId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const response = await gameCommentsService.getComments(gameEventId);
      setComments(response.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a comment',
        variant: 'destructive',
      });
      return;
    }

    // Stop typing indicator when submitting
    if (isTyping) {
      await gameCommentsService.stopTyping(gameEventId);
      setIsTyping(false);
    }

    setIsSubmitting(true);
    try {
      const response = await gameCommentsService.addComment(gameEventId, { body: newComment });
      setComments(prev => [...prev, response.data]);
      setNewComment('');
      toast({
        title: 'Success',
        description: 'Comment added successfully!',
      });

      // Call the callback to update comment count in parent component
      if (onCommentAdded) {
        onCommentAdded();
      }

      // Close the modal after successful submission
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add comment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Typing indicator handlers
  const handleTypingStart = async () => {
    if (isTyping) return;

    try {
      setIsTyping(true);
      await gameCommentsService.startTyping(gameEventId);
    } catch (error) {
      console.error('Failed to start typing indicator:', error);
    }
  };

  const handleTypingStop = async () => {
    if (!isTyping) return;

    try {
      setIsTyping(false);
      await gameCommentsService.stopTyping(gameEventId);
    } catch (error) {
      console.error('Failed to stop typing indicator:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewComment(value);

    // Start typing indicator if not already typing
    if (value.trim() && !isTyping) {
      handleTypingStart();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Game Discussion: {gameEventTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading comments...</span>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No comments yet. Be the first to start the discussion!</p>
                <p className="text-sm mt-2">Share suggestions for time/location, ask questions, or coordinate with other players.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback className="text-xs">
                        {comment.author?.name?.split(' ').map((n: string) => n[0]).join('') || '??'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.author?.name || 'Unknown'}</span>
                        <Badge variant="secondary" className="text-xs">
                          {comment.created_at_relative}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {comment.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {typingUsers.map(u => u.user_name).join(', ')}
                  {typingUsers.length === 1 ? ' is' : ' are'} typing...
                </span>
              </div>
            )}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSubmit} className="space-y-3 border-t pt-4">
            <div className="space-y-2">
              <Textarea
                value={newComment}
                onChange={handleInputChange}
                placeholder="Share your thoughts about this game... (suggestions for time/location, questions, etc.)"
                className="min-h-[80px] resize-none"
                disabled={isSubmitting}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Share suggestions, ask questions, or coordinate with other players
                </p>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newComment.trim() || isSubmitting}
                  className="ml-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Post Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
