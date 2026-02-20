import { useState, useEffect } from 'react';
import { dashboardService, ActivityItem, RecommendedGame, UserInterest } from '@/services/dashboard';
import { useAuth } from '@/hooks/useAuth';

export function useDashboardContent() {
  const { user, isLoggedIn } = useAuth();
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [recommendedGames, setRecommendedGames] = useState<RecommendedGame[]>([]);
  const [relevantTournaments, setRelevantTournaments] = useState<any[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<any[]>([]);
  const [userInterests, setUserInterests] = useState<UserInterest[]>([]);
  const [interestNames, setInterestNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityMeta, setActivityMeta] = useState<any>(null);

  const loadDashboardContent = async () => {
    if (!user || !isLoggedIn) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 Loading dashboard content for user:', user.id);

      // OPTION 1: Use unified endpoint (single request - RECOMMENDED)
      try {
        const dashboardData = await dashboardService.getDashboard();
        
        console.log('✅ Complete Dashboard Data (unified):', dashboardData);

        setRecentActivity(dashboardData.activity || []);
        setRecommendedGames(dashboardData.recommended_games || []);
        setRelevantTournaments(dashboardData.tournaments || []);
        setUpcomingGames([]);
        setUserInterests([]);
        setInterestNames(dashboardData.user_interests?.names || []);
        setActivityMeta({
          user_interests: dashboardData.user_interests?.names || [],
          filtered: dashboardData.user_interests?.has_interests || false,
          message: 'Showing personalized content',
        });

        console.log('✅ Dashboard loaded successfully via unified endpoint');
        
      } catch (unifiedError) {
        // OPTION 2: Fallback to individual endpoints (multiple requests)
        console.warn('⚠️ Unified endpoint failed, using individual endpoints:', unifiedError);
        
        const [activityResponse, games, tournaments, upcoming, interests] = await Promise.all([
          dashboardService.getActivity(10, 1),
          dashboardService.getRecommendedGames(3),
          dashboardService.getRelevantTournaments(2),
          dashboardService.getUpcomingGames(5),
          dashboardService.getUserInterests(),
        ]);

        console.log('✅ Dashboard Activity Response:', activityResponse);
        console.log('✅ Recommended Games:', games);
        console.log('✅ User Interests:', interests);

        setRecentActivity(activityResponse.data);
        setActivityMeta(activityResponse.meta);
        setRecommendedGames(games || []);
        setRelevantTournaments(tournaments || []);
        setUpcomingGames(upcoming || []);
        setUserInterests(interests || []);
        setInterestNames((interests || []).map(i => i?.name).filter(Boolean));

        console.log('✅ Dashboard loaded successfully via individual endpoints');
      }

    } catch (err: any) {
      console.error('❌ Failed to load dashboard content:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardContent();
  }, [user, isLoggedIn]);

  const refreshActivity = async () => {
    if (!user || !isLoggedIn) return;
    
    try {
      const activityResponse = await dashboardService.getActivity(10, 1);
      setRecentActivity(activityResponse.data);
      setActivityMeta(activityResponse.meta);
    } catch (err: any) {
      console.error('Failed to refresh activity:', err);
    }
  };

  const refreshRecommendedGames = async () => {
    if (!user || !isLoggedIn) return;
    
    try {
      const games = await dashboardService.getRecommendedGames(3);
      setRecommendedGames(games);
    } catch (err: any) {
      console.error('Failed to refresh games:', err);
    }
  };

  return {
    // Data
    recentActivity,
    recommendedGames,
    relevantTournaments,
    upcomingGames,
    userInterests,
    interestNames,
    activityMeta,
    
    // State
    isLoading,
    error,
    
    // Actions
    refreshActivity,
    refreshRecommendedGames,
    loadDashboardContent,
  };
}

