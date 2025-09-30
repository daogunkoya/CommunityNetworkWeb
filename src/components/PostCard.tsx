import { Heart, MessageCircle, Share2, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { discussionsService } from '@/services/discussions';
import { toast } from 'sonner';
import { CommentModal } from './CommentModal';

import { Discussion } from '@/services/discussions';
import { Link } from 'react-router-dom';

interface PostCardProps {
  id?: number;
  author: string;
  avatar?: string;
  time: string;
  content: string;
  type: 'discussion' | 'game';
  sport?: string;
  location?: string;
  date?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  discussion?: Discussion;
}

export function PostCard({
  id,
  author,
  avatar,
  time,
  content,
  type,
  sport,
  location,
  date,
  likes,
  comments,
  isLiked = false,
  discussion
}: PostCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [liked, setLiked] = useState(isLiked);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const handleLike = async () => {
    if (!id || type !== 'discussion') {
      console.log('Cannot like: missing id or not a discussion', { id, type });
      return;
    }
    
    console.log('Attempting to like discussion:', id, 'currently liked:', liked);
    setIsLiking(true);
    try {
      if (liked) {
        console.log('Unliking discussion:', id);
        await discussionService.unlikeDiscussion(id);
        setLikeCount(prev => prev - 1);
        setLiked(false);
        toast.success('Discussion unliked');
      } else {
        console.log('Liking discussion:', id);
        await discussionService.likeDiscussion(id);
        setLikeCount(prev => prev + 1);
        setLiked(true);
        toast.success('Discussion liked');
      }
    } catch (error: any) {
      console.error('Like error:', error);
      toast.error(error.message || 'Failed to update like');
    } finally {
      setIsLiking(false);
    }
  };
  const getSportColor = (sport?: string) => {
    switch (sport?.toLowerCase()) {
      case 'tennis': return 'bg-sport-green';
      case 'football': return 'bg-sport-orange';
      case 'basketball': return 'bg-sport-blue';
      case 'cycling': return 'bg-sport-red';
      case 'swimming': return 'bg-primary';
      default: return 'bg-accent';
    }
  };

  return (
    <>
      <Card 
        className={`mb-4 border-border/50 shadow-soft hover:shadow-medium transition-all duration-200 ${
          (type === 'discussion' && id) || type === 'game' ? 'cursor-pointer hover:bg-gray-50 hover:scale-[1.02]' : ''
        }`}
        onClick={() => {
          if (type === 'discussion' && id) {
            window.location.href = `/discussion/${id}`;
          } else if (type === 'game') {
            // Navigate to games page with search for this specific game
            window.location.href = `/games?search=${encodeURIComponent(content.split('!')[0])}`;
          }
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {author.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{author}</h3>
                  <p className="text-xs text-muted-foreground">{time}</p>
                </div>
                              {type === 'game' && sport && (
                <Badge className={`${getSportColor(sport)} text-white`}>
                  {sport}
                </Badge>
              )}
              {type === 'discussion' && discussion?.game_type && (
                <Badge 
                  className="text-white"
                  style={{ backgroundColor: discussion.game_type.color }}
                >
                  {discussion.game_type.name}
                </Badge>
              )}
              </div>
              
              <p className={`text-sm leading-relaxed ${
                (type === 'discussion' && id) || type === 'game' ? 'hover:text-blue-600 transition-colors' : ''
              }`}>
                {type === 'discussion' && id ? (
                  <Link to={`/discussion/${id}`} className="hover:underline">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </p>
              
              {type === 'game' && (location || date) && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {location}
                    </div>
                  )}
                  {date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {date}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 ${liked ? 'text-sport-red' : 'text-muted-foreground'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike();
                    }}
                    disabled={isLiking || type !== 'discussion'}
                  >
                    <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                    {likeCount}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Opening comment modal for discussion:', id);
                      setIsCommentModalOpen(true);
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {comments}
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement share functionality
                    toast.success('Share functionality coming soon!');
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comment Modal */}
      {type === 'discussion' && id && (
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          discussionId={id}
          discussionTitle={content}
        />
      )}
    </>
  );
}