import { PostCard } from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare, TrendingUp, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const discussionPosts = [
  {
    id: 1,
    author: 'Sarah Johnson',
    time: '1 hour ago',
    content: 'Has anyone tried the new protein powder from FitNutrition? I\'m looking for something that mixes well and doesn\'t have that chalky taste.',
    type: 'discussion' as const,
    likes: 15,
    comments: 23
  },
  {
    id: 2,
    author: 'Mike Rodriguez',
    time: '3 hours ago',
    content: 'Recovery tips after intense cardio sessions? I\'ve been feeling more tired than usual after my runs and wondering if I\'m missing something in my routine.',
    type: 'discussion' as const,
    likes: 28,
    comments: 17,
    isLiked: true
  },
  {
    id: 3,
    author: 'Emily Zhang',
    time: '5 hours ago',
    content: 'Thoughts on morning vs evening workouts? I\'m trying to establish a consistent routine but can\'t decide which time works better for building habits.',
    type: 'discussion' as const,
    likes: 31,
    comments: 42
  }
];

const trendingTopics = [
  { name: 'Nutrition Tips', count: 45 },
  { name: 'Workout Routines', count: 38 },
  { name: 'Recovery Methods', count: 29 },
  { name: 'Equipment Reviews', count: 24 },
  { name: 'Motivation', count: 19 }
];

export default function Discussion() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Community Discussions</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Trending Topics */}
        <Card className="mb-6 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sport-orange" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic) => (
                <Badge
                  key={topic.name}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {topic.name} ({topic.count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* New Discussion Button */}
        <Button className="w-full mb-6" variant="sport">
          <MessageSquare className="h-4 w-4 mr-2" />
          Start New Discussion
        </Button>

        {/* Discussion Posts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Recent Discussions</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          
          {discussionPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
}