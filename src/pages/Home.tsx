import { PostCard } from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, Calendar, MapPin, Clock, Star, Zap, Target, Trophy, Gamepad2, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import sportsHero from '@/assets/sports-hero.jpg';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { dashboardService } from '@/services/dashboard';
import { getAppName, getAppDescription } from '@/config/app';

const mockPosts = [
  {
    id: 1,
    author: 'Tennis Player',
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
    author: 'Fitness Enthusiast',
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

const quickActions = [
  { icon: Plus, label: 'Create Event', color: 'bg-gradient-to-br from-teal-500 to-blue-600', href: '/games?create=true', description: 'Start a new game or event' },
  { icon: MapPin, label: 'Find Games', color: 'bg-gradient-to-br from-emerald-500 to-teal-600', href: '/games', description: 'Discover nearby games' },
  { icon: Users, label: 'Join Community', color: 'bg-gradient-to-br from-blue-500 to-indigo-600', href: '/discussion', description: 'Connect with players' },
  { icon: Trophy, label: 'Tournaments', color: 'bg-gradient-to-br from-purple-500 to-violet-600', href: '/tournament', description: 'Compete in tournaments' }
];

const recentGames = [
  {
    id: 1,
    title: 'Weekend Tennis Championship',
    sport: 'Tennis',
    location: 'Central Tennis Club',
    date: 'This Saturday, 2:00 PM',
    participants: 12,
    maxParticipants: 16,
    skillLevel: 'Intermediate',
    organizer: 'Sarah Johnson',
    status: 'Open'
  },
  {
    id: 2,
    title: 'Basketball Pickup Game',
    sport: 'Basketball',
    location: 'Downtown Courts',
    date: 'Tomorrow, 6:00 PM',
    participants: 8,
    maxParticipants: 10,
    skillLevel: 'All Levels',
    organizer: 'Mike Chen',
    status: 'Almost Full'
  },
  {
    id: 3,
    title: 'Cycling Group Ride',
    sport: 'Cycling',
    location: 'Riverside Trail',
    date: 'Sunday, 8:00 AM',
    participants: 15,
    maxParticipants: 20,
    skillLevel: 'Beginner',
    organizer: 'Alex Rodriguez',
    status: 'Open'
  }
];

const recentTournaments = [
  {
    id: 1,
    title: 'Summer Tennis Open',
    sport: 'Tennis',
    location: 'Elite Tennis Center',
    date: 'Next Week',
    participants: 32,
    maxParticipants: 64,
    prize: '£500',
    status: 'Registration Open'
  },
  {
    id: 2,
    title: 'Basketball 3v3 Tournament',
    sport: 'Basketball',
    location: 'Community Center',
    date: 'In 2 weeks',
    participants: 24,
    maxParticipants: 32,
    prize: '£300',
    status: 'Filling Fast'
  }
];

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const { stats, isLoading: isLoadingStats, error: statsError } = useDashboardStats();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  const handleActionClick = (href: string) => {
    navigate(href);
  };

  const handleGameClick = (gameId: number) => {
    navigate(`/games/${gameId}`);
  };

  const handleTournamentClick = (tournamentId: number) => {
    navigate(`/tournament/${tournamentId}`);
  };

  // Create stats array with real data
  const statsData = [
    { 
      icon: Users, 
      value: stats ? dashboardService.formatNumber(stats.total_users) : '...', 
      label: 'Active Members', 
      color: 'text-white', 
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600', 
      description: 'Players in your area' 
    },
    { 
      icon: Calendar, 
      value: stats ? stats.events_this_week.toString() : '...', 
      label: 'Events This Week', 
      color: 'text-white', 
      bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600', 
      description: 'Games and tournaments' 
    },
    { 
      icon: TrendingUp, 
      value: stats ? dashboardService.formatPercentage(stats.success_rate) : '...', 
      label: 'Success Rate', 
      color: 'text-white', 
      bgColor: 'bg-gradient-to-br from-teal-500 to-teal-600', 
      description: 'Events completed successfully' 
    },
    { 
      icon: Star, 
      value: stats ? dashboardService.formatRating(stats.community_rating) : '...', 
      label: 'Community Rating', 
      color: 'text-white', 
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600', 
      description: 'Average player rating' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90 animate-gradient-x"></div>
        <div className="absolute inset-0 opacity-30 bg-white/10"></div>
        
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white px-6">
            <div className="mb-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{timeString}</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Welcome to {getAppName()}
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              {getAppDescription()}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8 py-3 font-semibold shadow-lg"
                onClick={() => navigate('/games')}
              >
                <Zap className="h-5 w-5 mr-2" />
                Get Started
              </Button>
              <Button 
                size="lg" 
                className="bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/30 hover:border-white/60 rounded-full px-8 py-3 font-semibold shadow-lg"
                onClick={() => navigate('/games')}
              >
                <Target className="h-5 w-5 mr-2" />
                Explore Sports
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg cursor-pointer bg-white/90 backdrop-blur-sm"
              onClick={() => handleActionClick(action.href)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.label}</h3>
                <p className="text-xs text-gray-500">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-xs text-gray-400">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Games */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Games</h2>
          <Button variant="outline" onClick={() => navigate('/games')} className="rounded-full">
            <Gamepad2 className="h-4 w-4 mr-2" />
            View All Games
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentGames.map((game) => (
            <Card 
              key={game.id} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleGameClick(game.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{game.sport}</p>
                  </div>
                  <Badge 
                    variant={game.status === 'Open' ? 'default' : 'secondary'}
                    className={game.status === 'Open' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'}
                  >
                    {game.status}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {game.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {game.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {game.participants}/{game.maxParticipants} participants
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">by {game.organizer}</span>
                  <span className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-full">
                    {game.skillLevel}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Tournaments */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Active Tournaments</h2>
          <Button variant="outline" onClick={() => navigate('/tournament')} className="rounded-full">
            <Trophy className="h-4 w-4 mr-2" />
            View All Tournaments
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentTournaments.map((tournament) => (
            <Card 
              key={tournament.id} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/90 backdrop-blur-sm"
              onClick={() => handleTournamentClick(tournament.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                      {tournament.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{tournament.sport}</p>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={tournament.status === 'Registration Open' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'}
                  >
                    {tournament.status}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {tournament.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {tournament.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {tournament.participants}/{tournament.maxParticipants} registered
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-600">
                    Prize: {tournament.prize}
                  </span>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Register Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="rounded-full hover:bg-blue-500/10 hover:border-blue-400 transition-colors"
              onClick={() => navigate('/discussion')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Create Post
            </Button>
            <Button 
              variant="ghost" 
              className="rounded-full hover:bg-gray-500/10 transition-colors"
              onClick={() => navigate('/discussion')}
            >
              View All Posts
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {mockPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </div>
  );
}