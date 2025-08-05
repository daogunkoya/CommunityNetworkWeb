import { Heart, MessageCircle, Share2, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PostCardProps {
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
}

export function PostCard({
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
  isLiked = false
}: PostCardProps) {
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
    <Card className="mb-4 border-border/50 shadow-soft hover:shadow-medium transition-all duration-200">
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
            </div>
            
            <p className="text-sm leading-relaxed">{content}</p>
            
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
                  className={`gap-2 ${isLiked ? 'text-sport-red' : 'text-muted-foreground'}`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  {likes}
                </Button>
                
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  {comments}
                </Button>
              </div>
              
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}