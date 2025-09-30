import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardStats } from '@/services/dashboard';

export const useDashboardStats = () => {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
};


