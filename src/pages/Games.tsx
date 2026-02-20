import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Trophy, MapPin, Calendar, Users, Plus, Loader2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GameEventCard } from '@/components/GameEventCard';
import { CreateGameEventModal } from '@/components/CreateGameEventModal';
import { Pagination } from '@/components/Pagination';
import { useGames } from '@/hooks/useGames';
import { GameEvent, gameService } from '@/services/games';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { GamesLoader } from '@/components/GamesLoader';
import { useSearchParams } from 'react-router-dom';

export default function Games() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  const [showMyGamesOnly, setShowMyGamesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [availableGameTypes, setAvailableGameTypes] = useState<Array<{ id: number; name: string; color: string; icon_path: string }>>([]);
  const [isLoadingGameTypes, setIsLoadingGameTypes] = useState(false);
  const [showAllSports, setShowAllSports] = useState(false);
  const { user, signIn } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Check if we should automatically open the create modal
  useEffect(() => {
    const shouldCreate = searchParams.get('create');
    if (shouldCreate === 'true') {
      setShowCreateModal(true);
      // Remove the parameter from URL
      searchParams.delete('create');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  // Load available game types (user's interests) when user is logged in
  useEffect(() => {
    if (user) {
      loadAvailableGameTypes();
    }
  }, [user]);

  const loadAvailableGameTypes = async () => {
    setIsLoadingGameTypes(true);
    try {
      const response = await gameService.getAvailableGameTypes();
      // Safely handle the response - ensure data is an array
      setAvailableGameTypes(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to load available game types:', error);
      // Set empty array on error to prevent crashes
      setAvailableGameTypes([]);
    } finally {
      setIsLoadingGameTypes(false);
    }
  };

  // Determine if we should use user interests for sport stats
  const shouldUseUserInterests = user && !showAllSports && availableGameTypes.length > 0;

  const {
    events: allEvents,
    pagination: allPagination,
    sportStats,
    isLoading,
    joinEvent,
    leaveEvent,
    isJoining,
    isLeaving,
  } = useGames({
    sport: selectedSport === 'all' ? undefined : selectedSport,
    location: searchTerm || undefined,
    skill_level: selectedSkillLevel === 'all' ? undefined : parseInt(selectedSkillLevel),
    my_games_only: showMyGamesOnly,
    date_from: selectedDateRange === 'today' ? new Date().toISOString().split('T')[0] : 
               selectedDateRange === 'tomorrow' ? new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0] :
               selectedDateRange === 'this-week' ? new Date().toISOString().split('T')[0] :
               selectedDateRange === 'this-month' ? new Date().toISOString().split('T')[0] : undefined,
    date_to: selectedDateRange === 'today' ? new Date().toISOString().split('T')[0] :
             selectedDateRange === 'tomorrow' ? new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0] :
             selectedDateRange === 'this-week' ? new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0] :
             selectedDateRange === 'this-month' ? new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0] : undefined,
    per_page: 12, // Show 12 games per page for better UX
    page: currentPage,
  }, shouldUseUserInterests);

  // Filter events by user interests if filtering is enabled
  const events = React.useMemo(() => {
    if (!user || showAllSports || availableGameTypes.length === 0 || !allEvents) {
      return allEvents || [];
    }
    
    // Filter events to only include user's interests
    const userInterestNames = (availableGameTypes || []).map(gt => gt?.name).filter(Boolean);
    return allEvents.filter(event => userInterestNames.includes(event.sport));
  }, [allEvents, user, showAllSports, availableGameTypes]);

  // Calculate filtered pagination
  const pagination = React.useMemo(() => {
    if (!user || showAllSports || availableGameTypes.length === 0 || !allEvents) {
      return allPagination;
    }
    
    // Calculate total filtered count
    const userInterestNames = (availableGameTypes || []).map(gt => gt?.name).filter(Boolean);
    const filteredCount = allEvents.filter(event => userInterestNames.includes(event.sport)).length;
    
    return {
      ...allPagination,
      total: filteredCount
    };
  }, [allPagination, allEvents, user, showAllSports, availableGameTypes]);

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
  }, [searchTerm, selectedSport, selectedSkillLevel, selectedDateRange, showMyGamesOnly, showAllSports]);

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

  // Get sports categories from API (already filtered by user interests if applicable)
  const getSportsCategories = () => {
    // Ensure sportStats is an array before mapping
    if (!sportStats || !Array.isArray(sportStats)) return [];
    
    // The API now provides the correct counts based on user interests
    // No need for frontend filtering or calculation
    return sportStats.map(sport => ({
      name: sport?.name || '',
      count: sport?.count || 0,
      color: sport?.color || 'bg-accent'
    }));
  };

  // Helper function to get date range based on selection
  const getDateRange = (dateRange: string) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() + 7);
    
    const thisMonth = new Date(today);
    thisMonth.setMonth(thisMonth.getMonth() + 1);
    
    switch (dateRange) {
      case 'today':
        const todayStr = today.toISOString().split('T')[0];
        return { date_from: todayStr, date_to: todayStr };
      case 'tomorrow':
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        return { date_from: tomorrowStr, date_to: tomorrowStr };
      case 'this-week':
        return { 
          date_from: today.toISOString().split('T')[0], 
          date_to: thisWeek.toISOString().split('T')[0] 
        };
      case 'this-month':
        return { 
          date_from: today.toISOString().split('T')[0], 
          date_to: thisMonth.toISOString().split('T')[0] 
        };
      default:
        return { date_from: undefined, date_to: undefined };
    }
  };

  const dateRange = getDateRange(selectedDateRange);
  const sportsCategories = getSportsCategories();
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md bg-white">
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
    <div className="min-h-screen bg-white pb-20">


      {/* Header */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-border/50 px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Games</h1>
            <p className="text-muted-foreground">Find and join sports events</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            disabled={isLoading}
            className="flex items-center gap-2 w-full sm:w-auto rounded-full"
          >
            <Plus className="h-4 w-4" />
            Create Game
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="mt-4 space-y-3">
          {/* Main Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Select
              value={selectedSport}
              onValueChange={(value) => setSelectedSport(value)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500" />
                    <span>All Sports</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {pagination?.total || 0} games
                    </span>
                  </div>
                </SelectItem>
                {isLoadingGameTypes ? (
                  <SelectItem value="loading" disabled>
                    Loading your sports...
                  </SelectItem>
                ) : sportsCategories.length > 0 ? (
                  sportsCategories.map((sport) => (
                    <SelectItem key={sport.name} value={sport.name}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${sport.color}`} />
                        <span>{sport.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {sport.count} games
                        </span>
                      </div>
                    </SelectItem>
                  ))
                ) : user ? (
                  <SelectItem value="no-interests" disabled>
                    Set your interests to see sports
                  </SelectItem>
                ) : null}
              </SelectContent>
            </Select>
            
            <Select
              value={selectedSkillLevel}
              onValueChange={(value) => setSelectedSkillLevel(value)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skill Levels</SelectItem>
                <SelectItem value="1">Beginner</SelectItem>
                <SelectItem value="2">Intermediate</SelectItem>
                <SelectItem value="3">Advanced</SelectItem>
                <SelectItem value="4">Expert</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedDateRange}
              onValueChange={(value) => setSelectedDateRange(value)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <div className="w-full sm:flex-1 relative sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-8"
                disabled={isLoading}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <Button
              variant={showMyGamesOnly ? "default" : "outline"}
              onClick={() => setShowMyGamesOnly(!showMyGamesOnly)}
              disabled={isLoading}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              <Trophy className="h-4 w-4 mr-2" />
              My Games Only
            </Button>
          </div>

          {/* User Interest Filtering Status */}
          {user && availableGameTypes.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-blue-800 font-medium">
                    Showing sports for your interests: <span className="font-semibold">{(availableGameTypes || []).map(gt => gt?.name).filter(Boolean).join(', ')}</span>
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllSports(!showAllSports)}
                  className="text-blue-700 border-blue-300 hover:bg-blue-100"
                >
                  {showAllSports ? 'Filter by Interests' : 'Show All Sports'}
                </Button>
              </div>
            </div>
          )}

          {/* No Interests Warning */}
          {user && availableGameTypes.length === 0 && !isLoadingGameTypes && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-800">
                    Showing all sports. <span className="font-medium">Set your sport interests for personalized content.</span>
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/profile'}
                  className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                >
                  Set Interests
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6">




        {/* Create Game Button */}
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto mb-6" 
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
                <Card key={i} className="border-border/50 bg-white">
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
                <Card key={i} className="border-border/50 bg-white">
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
            <Card className="border-border/50 bg-white">
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