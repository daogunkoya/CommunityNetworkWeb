import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Trophy, MapPin, Calendar, Users, Plus, Filter, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GameEventCard } from '@/components/GameEventCard';
import { CreateGameEventModal } from '@/components/CreateGameEventModal';
import { Pagination } from '@/components/Pagination';
import { useGames } from '@/hooks/useGames';
import { GameEvent } from '@/services/games';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { GamesLoader } from '@/components/GamesLoader';

export default function Games() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user, signIn } = useAuth();

  const {
    events,
    pagination,
    stats,
    isLoading,
    joinEvent,
    leaveEvent,
    isJoining,
    isLeaving,
  } = useGames({
    sport: selectedSport || undefined,
    location: searchTerm || undefined,
    per_page: 12, // Show 12 games per page for better UX
    page: currentPage,
  });

  const handleJoinEvent = (eventId: number) => {
    joinEvent(eventId);
  };

  const handleLeaveEvent = (eventId: number) => {
    leaveEvent(eventId);
  };

  const handleGameCreated = () => {
    // Refresh the games list
    window.location.reload();
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSport]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signIn('john@example.com', 'password');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Dynamically generate sports categories from actual events
  const getSportCount = (sportName: string) => {
    return events?.filter(event => event.sport === sportName).length || 0;
  };

  // Get unique sports from events and create categories
  const getSportsCategories = () => {
    if (!events) return [];
    
    const sportCounts = events.reduce((acc, event) => {
      acc[event.sport] = (acc[event.sport] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sportCounts)
      .map(([sport, count]) => ({ name: sport, count }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  };

  const sportsCategories = getSportsCategories();

  // If not logged in, show login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Login Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-center">
              You need to be logged in to view games.
            </p>
            <Button 
              onClick={handleLogin} 
              className="w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login with Test Account'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show full loader while initial loading
  if (isLoading && !events) {
    return <GamesLoader />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">


      {/* Header */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Games</h1>
            <p className="text-muted-foreground">Find and join sports events</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Game
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mt-4 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          <Button variant="outline" disabled={isLoading}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              {isLoading ? (
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
              ) : (
                <p className="text-2xl font-bold">
                  {stats?.events_today || 0}
                </p>
              )}
              <p className="text-sm text-muted-foreground">Games Today</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-sport-green" />
              {isLoading ? (
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
              ) : (
                <p className="text-2xl font-bold">
                  {stats?.players_online || 0}
                </p>
              )}
              <p className="text-sm text-muted-foreground">Players Online</p>
            </CardContent>
          </Card>
        </div>

        {/* Sports Categories */}
        <Card className="mb-6 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Sports Categories ({sportsCategories.length} sports)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="grid grid-cols-3 gap-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-16 border rounded-lg p-3 flex flex-col gap-1">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={selectedSport === '' ? 'default' : 'outline'}
                  className="h-auto p-3 flex flex-col gap-1 hover:bg-muted/50"
                  onClick={() => setSelectedSport('')}
                  disabled={isLoading}
                >
                  <div className="w-3 h-3 rounded-full bg-gray-500 mb-1" />
                  <span className="text-sm font-medium">All Sports</span>
                  <span className="text-xs text-muted-foreground">
                    {events?.length || 0} games
                  </span>
                </Button>
                {sportsCategories.map((sport) => (
                  <Button
                    key={sport.name}
                    variant={selectedSport === sport.name ? 'default' : 'outline'}
                    className="h-auto p-3 flex flex-col gap-1 hover:bg-muted/50"
                    onClick={() => setSelectedSport(sport.name)}
                    disabled={isLoading}
                  >
                    <div className={`w-3 h-3 rounded-full bg-${sport.name.toLowerCase().replace(/\s/g, '-')}-500 mb-1`} />
                    <span className="text-sm font-medium">{sport.name}</span>
                    <span className="text-xs text-muted-foreground">{sport.count} games</span>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Game Button */}
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="w-full mb-6" 
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          {isLoading ? 'Loading...' : 'Create New Game'}
        </Button>

        {/* Games Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">
              Upcoming Games {!isLoading && pagination && `(${pagination.total})`}
            </h3>
            {!isLoading && events && events.length > 0 && (
              <Button variant="ghost" size="sm">
                View All
              </Button>
            )}
          </div>
          
          {isLoading && currentPage === 1 ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-9 flex-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : isLoading && currentPage > 1 ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-9 flex-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : events && events.length > 0 ? (
            <>
              <div className="space-y-4">
                {events.map((event) => (
                  <GameEventCard
                    key={event.id}
                    event={event}
                    onJoin={handleJoinEvent}
                    onLeave={handleLeaveEvent}
                    isJoining={isJoining}
                    isLeaving={isLeaving}
                  />
                ))}
              </div>

              {/* Pagination */}
              {!isLoading && pagination && pagination.last_page > 1 && (
                <Pagination
                  currentPage={pagination.current_page}
                  lastPage={pagination.last_page}
                  total={pagination.total}
                  perPage={pagination.per_page}
                  onPageChange={setCurrentPage}
                  isLoading={isLoading}
                />
              )}
            </>
          ) : (
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No games found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedSport 
                    ? 'Try adjusting your search or filters'
                    : 'Be the first to create a game event!'
                  }
                </p>
                {!searchTerm && !selectedSport && !isLoading && (
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Game
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Game Modal */}
      <CreateGameEventModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onGameCreated={handleGameCreated}
      />
    </div>
  );
}