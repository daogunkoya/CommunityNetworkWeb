import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2, X, Send } from 'lucide-react';
import { toast } from 'sonner';
import { discussionsService, Comment, CreateCommentData } from '@/services/discussions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TypingIndicator from '@/components/TypingIndicator';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  discussionId: number;
  discussionTitle: string;
}

export function CommentModal({ isOpen, onClose, discussionId, discussionTitle }: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Array<{ user_id: number; user_name: string; started_at: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load comments when modal opens
  useEffect(() => {
    if (isOpen && discussionId) {
      loadComments();
    }
  }, [isOpen, discussionId]);

  // Poll for typing indicators when modal is open
  useEffect(() => {
    if (!isOpen || !discussionId) return;

    const pollTypingUsers = async () => {
      try {
        const response = await discussionService.getTypingUsers(discussionId);
        console.log('🔄 Polling typing users for discussion', discussionId, ':', response.data);
        setTypingUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch typing users:', error);
      }
    };

    // Poll immediately and then every 2 seconds
    pollTypingUsers();
    const interval = setInterval(pollTypingUsers, 2000);

    return () => clearInterval(interval);
  }, [isOpen, discussionId]);

  // Cleanup typing indicator when modal closes
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping && discussionId) {
        discussionService.stopTyping(discussionId).catch(console.error);
      }
    };
  }, [isTyping, discussionId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const response = await discussionService.getComments(discussionId);
      setComments(response.data);
    } catch (error: any) {
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    // Stop typing indicator when submitting
    if (isTyping) {
      await discussionService.stopTyping(discussionId);
      setIsTyping(false);
    }

    setIsSubmitting(true);
    try {
      const response = await discussionService.addComment(discussionId, { body: newComment });
      setComments(prev => [...prev, response.data]);
      setNewComment('');
      toast.success('Comment added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Typing indicator handlers
  const handleTypingStart = async () => {
    if (isTyping) return;
    
    try {
      console.log('🚀 Starting typing indicator for discussion', discussionId);
      console.log('🔑 Current auth token:', localStorage.getItem('auth_token') ? 'Present' : 'Missing');
      setIsTyping(true);
      const result = await discussionService.startTyping(discussionId);
      console.log('✅ Typing indicator started successfully:', result);
    } catch (error) {
      console.error('❌ Failed to start typing indicator:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  const handleTypingStop = async () => {
    if (!isTyping) return;
    
    try {
      console.log('🛑 Stopping typing indicator for discussion', discussionId);
      setIsTyping(false);
      await discussionService.stopTyping(discussionId);
      console.log('✅ Typing indicator stopped successfully');
    } catch (error) {
      console.error('❌ Failed to stop typing indicator:', error);
    }
  };

  const handleCommentChange = (value: string) => {
    setNewComment(value);
    
    // Start typing indicator when user starts typing
    if (value.length === 1 && !isTyping) {
      handleTypingStart();
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        handleTypingStop();
      }
    }, 2000);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setNewComment('');
      setComments([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col bg-white shadow-2xl border-2 border-gray-200">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-xl font-bold text-gray-900">
            <div className="flex items-center space-x-2">
              <span>Comments - {discussionTitle}</span>
              {typingUsers.length > 0 && (
                <div className="flex items-center space-x-1 text-sm text-blue-600">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs">Someone typing</span>
                </div>
              )}
            </div>
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

        {/* Debug panel - remove this after testing */}
        <div className="bg-gray-100 p-2 rounded text-xs text-gray-600 mb-2">
          <div>Debug: Discussion ID: {discussionId}</div>
          <div>Debug: Is Typing: {isTyping ? 'Yes' : 'No'}</div>
          <div>Debug: Typing Users: {typingUsers.length}</div>
          <div>Debug: Typing Users: {JSON.stringify(typingUsers.map(u => u.user_name))}</div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback className="text-xs">
                      {comment.author.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.author.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {comment.created_at_relative}
                      </span>
                    </div>
                    <p className="text-sm">{comment.body}</p>
                  </div>
                </div>
              ))}
            </div>
                        ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
              
              {/* Typing indicator */}
              {typingUsers.length > 0 && (
                <TypingIndicator users={typingUsers} />
              )}
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t pt-4">
          <div className="space-y-2">
            <Label htmlFor="comment" className="font-semibold text-gray-800">Add a comment</Label>
            <div className="flex gap-2">
              <Textarea
                id="comment"
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => handleCommentChange(e.target.value)}
                rows={2}
                maxLength={1000}
                disabled={isSubmitting}
                className="flex-1 border-2 border-gray-300 bg-white hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isSubmitting || !newComment.trim()}
                className="h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="text-xs text-gray-600 text-right font-medium">
              {newComment.length}/1000 characters
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 