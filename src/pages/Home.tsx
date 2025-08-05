import { PostCard } from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import sportsHero from '@/assets/sports-hero.jpg';

const mockPosts = [
  {
    id: 1,
    author: 'Alex Chen',
    time: '2 hours ago',
    content: 'Looking for tennis partners this weekend! I play at intermediate level and would love to find some regular hitting partners. Court is already booked at Riverside Tennis Club.',
    type: 'game' as const,
    sport: 'Tennis',
    location: 'Riverside Tennis Club',
    date: 'This Saturday',
    likes: 12,
    comments: 5,
    isLiked: true
  },
  {
    id: 2,
    author: 'Maria Santos',
    time: '4 hours ago',
    content: 'What\'s your favorite pre-workout meal? I\'ve been experimenting with different combinations and would love to hear what works for everyone else!',
    type: 'discussion' as const,
    likes: 8,
    comments: 12
  },
  {
    id: 3,
    author: 'Jake Wilson',
    time: '6 hours ago',
    content: 'Weekly cycling group ride tomorrow morning! We\'ll be doing a scenic 25-mile route through the hills. All skill levels welcome - we have different pace groups.',
    type: 'game' as const,
    sport: 'Cycling',
    location: 'Central Park',
    date: 'Tomorrow 7 AM',
    likes: 15,
    comments: 8
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={sportsHero} 
          alt="Sports Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Welcome to SportsCommunity</h2>
            <p className="text-sm opacity-90">Connect with local athletes and join exciting games</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="border-border/50">
            <CardContent className="p-3 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-lg font-bold">2.3k</p>
              <p className="text-xs text-muted-foreground">Members</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardContent className="p-3 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-sport-orange" />
              <p className="text-lg font-bold">156</p>
              <p className="text-xs text-muted-foreground">Events</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardContent className="p-3 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-sport-green" />
              <p className="text-lg font-bold">89%</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
        </div>

        {/* Create Post Button */}
        <Button className="w-full mb-6" variant="sport">
          <Plus className="h-4 w-4 mr-2" />
          Create New Post
        </Button>

        {/* Posts Feed */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          {mockPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
}