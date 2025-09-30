import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageCircle } from 'lucide-react';
import { discussionsService, Discussion as DiscussionDetailType } from '@/services/discussions';
import { CommentModal } from '@/components/CommentModal';
import { useAuth } from '@/hooks/useAuth';

export default function DiscussionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery<{ success: boolean; data: DiscussionDetailType }>({
    queryKey: ['discussion', id],
    queryFn: () => discussionService.getDiscussion(parseInt(id!, 10)),
    enabled: !!id && isLoggedIn,
  });

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view discussion</h1>
          <Button onClick={() => navigate('/auth')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading discussion...</p>
        </div>
      </div>
    );
  }

  const discussion = data?.data;
  if (error || !discussion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Discussion not found</h1>
          <Button onClick={() => navigate('/discussion')}>Back to Discussions</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate('/discussion')}>{'<'} Back to Discussions</Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={discussion.author.avatar} />
              <AvatarFallback>
                {discussion.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl font-bold">{discussion.title}</CardTitle>
              <p className="text-sm text-muted-foreground">By {discussion.author.name} • {discussion.created_at_relative}</p>
            </div>
            {discussion.game_type && (
              <Badge className="ml-auto text-white" style={{ backgroundColor: discussion.game_type.color }}>
                {discussion.game_type.name}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>{discussion.body}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsCommentModalOpen(true)}>
              <MessageCircle className="h-4 w-4 mr-2" /> View/Add Comments ({discussion.stats.comments_count})
            </Button>
          </div>

          {discussion.comments && discussion.comments.length > 0 && (
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Recent Comments</h3>
              <div className="space-y-3">
                {discussion.comments.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={c.author.avatar} />
                      <AvatarFallback className="text-xs">{c.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm">
                        <span className="font-medium">{c.author.name}</span>
                        <span className="text-muted-foreground ml-2">{c.created_at_relative}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        discussionId={discussion.id}
        discussionTitle={discussion.title}
      />
    </div>
  );
}









