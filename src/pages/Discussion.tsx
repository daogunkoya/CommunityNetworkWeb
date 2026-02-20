import { PostCard } from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare, TrendingUp, Filter, Plus, ChevronLeft, ChevronRight, Calendar, Trophy, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import discussionsService, { Discussion, DiscussionFilters } from '@/services/discussions';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { CreateDiscussionModal } from '@/components/CreateDiscussionModal';

export default function Discussion() {
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<DiscussionFilters>({
    sort: 'latest',
    per_page: 15
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameType, setSelectedGameType] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  const [showMyDiscussionsOnly, setShowMyDiscussionsOnly] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showAllSports, setShowAllSports] = useState(false);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [isFilteredByInterests, setIsFilteredByInterests] = useState(false);
  const [availableGameTypes, setAvailableGameTypes] = useState<any[]>([]);
  const topicsScrollerRef = useRef<HTMLDivElement | null>(null);



  const scrollTopics = (direction: 'left' | 'right') => {
    const el = topicsScrollerRef.current;
    if (!el) return;
    const amount = Math.min(400, el.clientWidth); // scroll by viewport width-ish
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  // Fetch discussions
  const {
    data: discussionsResponse,
    isLoading: isLoadingDiscussions,
    error: discussionsError,
    refetch: refetchDiscussions
  } = useQuery({
    queryKey: ['discussions', filters, selectedGameType, selectedDateRange, showMyDiscussionsOnly, showAllSports],
    queryFn: () => {
      // Calculate proper date ranges
      let dateFrom: string | undefined;
      let dateTo: string | undefined;
      
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      switch (selectedDateRange) {
        case 'today':
          dateFrom = today.toISOString().split('T')[0];
          dateTo = today.toISOString().split('T')[0];
          break;
        case 'tomorrow':
          dateFrom = tomorrow.toISOString().split('T')[0];
          dateTo = tomorrow.toISOString().split('T')[0];
          break;
        case 'this-week':
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)
          dateFrom = startOfWeek.toISOString().split('T')[0];
          dateTo = endOfWeek.toISOString().split('T')[0];
          break;
        case 'this-month':
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          dateFrom = startOfMonth.toISOString().split('T')[0];
          dateTo = endOfMonth.toISOString().split('T')[0];
          break;
        default:
          dateFrom = undefined;
          dateTo = undefined;
      }

      const params = {
        ...filters,
        game_type: selectedGameType === 'all' ? undefined : selectedGameType,
        my_discussions_only: showMyDiscussionsOnly ? 'true' : undefined,
        date_from: dateFrom,
        date_to: dateTo,
        filter_by_interests: showAllSports ? 'false' : 'true', // Filter by interests unless "Show All Sports" is enabled
      };

      console.log('Fetching discussions with params:', params);

      return discussionsService.getDiscussions(params);
    },
    enabled: isLoggedIn,
  });

  // Fetch trending topics
  const {
    data: trendingTopicsResponse,
    isLoading: isLoadingTopics,
    error: topicsError
  } = useQuery({
    queryKey: ['trending-topics'],
    queryFn: () => discussionsService.getTrendingTopics(),
    enabled: isLoggedIn,
  });

  // Fetch available game types (user's interests only)
  const {
    data: availableGameTypesResponse,
    isLoading: isLoadingGameTypes
  } = useQuery({
    queryKey: ['available-game-types'],
    queryFn: () => discussionsService.getAvailableGameTypes(),
    enabled: isLoggedIn,
  });

  const discussions = discussionsResponse?.data || [];
  const trendingTopics = trendingTopicsResponse?.data || [];

  // Update user interests and filtering state when data changes
  useEffect(() => {
    if (discussionsResponse?.meta) {
      setUserInterests(discussionsResponse.meta.user_interests?.names || []);
      setIsFilteredByInterests(discussionsResponse.meta.filtered_by_interests || false);
    }
  }, [discussionsResponse]);

  // Update available game types when data changes
  useEffect(() => {
    if (availableGameTypesResponse?.data) {
      setAvailableGameTypes(availableGameTypesResponse.data);
    }
  }, [availableGameTypesResponse]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({
      ...prev,
      search: query || undefined
    }));
  };

  // Handle game type filter
  const handleGameTypeChange = (gameType: string) => {
    setSelectedGameType(gameType);
  };

  // Handle date range filter
  const handleDateRangeChange = (dateRange: string) => {
    setSelectedDateRange(dateRange);
  };

  // Handle my discussions filter
  const handleMyDiscussionsToggle = () => {
    setShowMyDiscussionsOnly(!showMyDiscussionsOnly);
  };

  // Handle sort change
  const handleSortChange = (sort: 'latest' | 'popular' | 'trending') => {
    setFilters(prev => ({
      ...prev,
      sort
    }));
  };

  // Handle topic filter
  const handleTopicClick = (topic: string) => {
    setFilters(prev => ({
      ...prev,
      topic
    }));
  };

  // Handle errors
  useEffect(() => {
    if (discussionsError) {
      console.error('Discussions error:', discussionsError);
      const errorMessage = discussionsError instanceof Error 
        ? discussionsError.message 
        : 'Failed to load discussions';
      toast.error(errorMessage);
    }
    if (topicsError) {
      console.error('Trending topics error:', topicsError);
      const errorMessage = topicsError instanceof Error 
        ? topicsError.message 
        : 'Failed to load trending topics';
      toast.error(errorMessage);
    }
  }, [discussionsError, topicsError]);

  // Handle successful discussion creation
  const handleDiscussionCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['discussions'] });
    queryClient.invalidateQueries({ queryKey: ['trending-topics'] });
  };



  // Show login prompt if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to view discussions.
          </p>
          <Button 
            onClick={() => window.location.href = '/auth'}
            className="w-full"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-border/50 px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">Discussions</h1>
            <p className="text-muted-foreground">Join community conversations</p>
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-full px-6 py-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Start Discussion
          </Button>
        </div>

        {/* User Interest Filtering Status */}
        {isFilteredByInterests && userInterests.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-800 font-medium">
                  Showing discussions for your interests: <span className="font-semibold">{userInterests.join(', ')}</span>
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
        {!isFilteredByInterests && userInterests.length === 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-yellow-800">
                  Showing all discussions. <span className="font-medium">Set your sport interests for personalized content.</span>
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

        {/* Filters and Search */}
        <div className="space-y-3">
          {/* Main Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Select
              value={selectedGameType}
              onValueChange={handleGameTypeChange}
              disabled={isLoadingDiscussions}
            >
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="All Game Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Game Types</SelectItem>
                {isLoadingGameTypes ? (
                  <SelectItem value="loading" disabled>Loading your sports...</SelectItem>
                ) : availableGameTypes.length > 0 ? (
                  availableGameTypes.map((gameType) => (
                    <SelectItem key={gameType.id} value={gameType.name.toLowerCase()}>
                      {gameType.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-interests" disabled>Set your interests to see sports</SelectItem>
                )}
              </SelectContent>
            </Select>
            
            <Select
              value={selectedDateRange}
              onValueChange={handleDateRangeChange}
              disabled={isLoadingDiscussions}
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
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-8"
                disabled={isLoadingDiscussions}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <Button
              variant={showMyDiscussionsOnly ? "default" : "outline"}
              onClick={handleMyDiscussionsToggle}
              disabled={isLoadingDiscussions}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              <Trophy className="h-4 w-4 mr-2" />
              My Discussions
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Trending Topics */}
        <Card className="mb-6 border-border/50 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sport-orange" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoadingTopics ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="relative">
                {/* Left control */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200"
                  onClick={() => scrollTopics('left')}
                  aria-label="Scroll topics left"
                >
                  <ChevronLeft className="h-5 w-5 text-blue-600" />
                </Button>

                {/* Scroll container */}
                <div
                  ref={topicsScrollerRef}
                  className="overflow-x-auto scrollbar-neutral"
                >
                  <div className="flex gap-3 pr-2">
                    {trendingTopics.map((topic) => (
                      <div
                        key={topic.name}
                        onClick={() => handleTopicClick(topic.name)}
                        className="min-w-[180px] rounded-lg border border-border bg-white hover:bg-gray-50 cursor-pointer transition-colors p-3 flex-shrink-0"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold">{topic.name}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">{topic.count}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Tap to filter by this topic</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right control */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200"
                  onClick={() => scrollTopics('right')}
                  aria-label="Scroll topics right"
                >
                  <ChevronRight className="h-5 w-5 text-blue-600" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>



        {/* Discussion Posts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Recent Discussions</h3>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleSortChange('latest')}
                className={filters.sort === 'latest' ? 'bg-primary text-primary-foreground' : ''}
              >
                Latest
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleSortChange('popular')}
                className={filters.sort === 'popular' ? 'bg-primary text-primary-foreground' : ''}
              >
                Popular
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleSortChange('trending')}
                className={filters.sort === 'trending' ? 'bg-primary text-primary-foreground' : ''}
              >
                Trending
              </Button>
            </div>
          </div>
          
          {isLoadingDiscussions ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : discussions.length > 0 ? (
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <PostCard
                  key={discussion.id}
                  id={discussion.id}
                  author={discussion.author.name}
                  avatar={discussion.author.avatar}
                  time={discussion.created_at_relative}
                  content={discussion.excerpt}
                  type="discussion"
                  likes={discussion.stats.likes_count}
                  comments={discussion.stats.comments_count}
                  isLiked={discussion.user_interaction.is_liked}
                  discussion={discussion}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No discussions yet</h3>
              <p className="text-sm text-muted-foreground">Be the first to start a discussion!</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Discussion Modal */}
      <CreateDiscussionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleDiscussionCreated}
      />
    </div>
  );
}