import { PostCard } from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Trophy, MapPin, Calendar, Users, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const gamesPosts = [
  {
    id: 1,
    author: 'David Kim',
    time: '30 minutes ago',
    content: 'Basketball pickup game tonight! We need 2 more players for a full court game. Intermediate level preferred but all skill levels welcome.',
    type: 'game' as const,
    sport: 'Basketball',
    location: 'Community Center',
    date: 'Tonight 7 PM',
    likes: 8,
    comments: 12
  },
  {
    id: 2,
    author: 'Lisa Brown',
    time: '2 hours ago',
    content: 'Swimming training group forming! Looking for committed swimmers to train together 3x per week. We\'ll focus on technique and endurance.',
    type: 'game' as const,
    sport: 'Swimming',
    location: 'Aquatic Center',
    date: 'Mon, Wed, Fri',
    likes: 24,
    comments: 6,
    isLiked: true
  },
  {
    id: 3,
    author: 'Carlos Martinez',
    time: '4 hours ago',
    content: 'Football scrimmage this weekend! Casual 11v11 game, everyone welcome. Bring water and shin guards. We play rain or shine!',
    type: 'game' as const,
    sport: 'Football',
    location: 'Sunset Park',
    date: 'Saturday 10 AM',
    likes: 19,
    comments: 15
  }
];

const sportsCategories = [
  { name: 'Tennis', count: 12, color: 'bg-sport-green' },
  { name: 'Basketball', count: 18, color: 'bg-sport-blue' },
  { name: 'Football', count: 15, color: 'bg-sport-orange' },
  { name: 'Cycling', count: 9, color: 'bg-sport-red' },
  { name: 'Swimming', count: 7, color: 'bg-primary' },
  { name: 'Running', count: 14, color: 'bg-accent' }
];

export default function Games() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="h-6 w-6 text-sport-orange" />
          <h1 className="text-xl font-bold">Find Games</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by sport or location..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">32</p>
              <p className="text-sm text-muted-foreground">Games Today</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-sport-green" />
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">Players Online</p>
            </CardContent>
          </Card>
        </div>

        {/* Sports Categories */}
        <Card className="mb-6 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Sports Categories</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-2">
              {sportsCategories.map((sport) => (
                <Button
                  key={sport.name}
                  variant="outline"
                  className="h-auto p-3 flex flex-col gap-1 hover:bg-muted/50"
                >
                  <div className={`w-3 h-3 rounded-full ${sport.color} mb-1`} />
                  <span className="text-sm font-medium">{sport.name}</span>
                  <span className="text-xs text-muted-foreground">{sport.count} games</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create Game Button */}
        <Button className="w-full mb-6" variant="sport">
          <Plus className="h-4 w-4 mr-2" />
          Create New Game
        </Button>

        {/* Games Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Upcoming Games</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          
          {gamesPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
}