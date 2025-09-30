import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { tournamentsService } from '@/services/tournaments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, MapPin, Calendar, Users, DollarSign, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Tournament = () => {
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    search: '',
    game_type: 'all',
    status: 'all',
    location: '',
    page: 1,
    limit: 12
  });

  const { data: tournamentsData, isLoading, error, refetch } = useQuery({
    queryKey: ['tournaments', filters],
    queryFn: () => tournamentsService.getTournaments(getApiFilters()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Convert filter values for API calls
  const getApiFilters = () => {
    const apiFilters = { ...filters };
    if (apiFilters.game_type === 'all') apiFilters.game_type = '';
    if (apiFilters.status === 'all') apiFilters.status = '';
    return apiFilters;
  };

  const handleRegister = async (tournamentId: number) => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to register for tournaments.",
        variant: "destructive",
      });
      return;
    }

    try {
      await tournamentsService.registerForTournament(tournamentId);
      toast({
        title: "Success",
        description: "Successfully registered for tournament!",
      });
      refetch(); // Refresh the data
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register for tournament.",
        variant: "destructive",
      });
    }
  };

  const handleUnregister = async (tournamentId: number) => {
    try {
      await tournamentsService.unregisterFromTournament(tournamentId);
      toast({
        title: "Success",
        description: "Successfully unregistered from tournament!",
      });
      refetch(); // Refresh the data
    } catch (error: any) {
      toast({
        title: "Unregistration Failed",
        description: error.message || "Failed to unregister from tournament.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Tournaments</h2>
          <p className="text-gray-600 mb-4">Failed to load tournaments. Please try again.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  const tournaments = tournamentsData?.data || [];
  const pagination = tournamentsData?.pagination;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tournaments</h1>
        <p className="text-gray-600">Find and join exciting tournaments in your area</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tournaments..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filters.game_type} onValueChange={(value) => handleFilterChange('game_type', value)}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              <SelectItem value="tennis">Tennis</SelectItem>
              <SelectItem value="basketball">Basketball</SelectItem>
              <SelectItem value="football">Football</SelectItem>
              <SelectItem value="badminton">Badminton</SelectItem>
              <SelectItem value="table-tennis">Table Tennis</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Location..."
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full md:w-48"
          />
        </div>
      </div>

      {/* Featured Tournament */}
      {tournaments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Tournament</h2>
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{tournaments[0].name}</CardTitle>
                  <CardDescription className="text-lg">{tournaments[0].description}</CardDescription>
                </div>
                <Badge className="bg-blue-600 text-white px-3 py-1">
                  <Trophy className="h-4 w-4 mr-1" />
                  Featured
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">{tournaments[0].location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">{new Date(tournaments[0].starts_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">{tournaments[0].current_participants}/{tournaments[0].max_participants}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">${tournaments[0].entry_fee}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {tournaments[0].is_registered ? (
                  <Button 
                    variant="outline" 
                    onClick={() => handleUnregister(tournaments[0].id)}
                  >
                    Unregister
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleRegister(tournaments[0].id)}
                    disabled={tournaments[0].current_participants >= tournaments[0].max_participants}
                  >
                    Register Now
                  </Button>
                )}
                <Button variant="outline">View Details</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* All Tournaments */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">All Tournaments</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tournaments found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later for new tournaments.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{tournament.name}</CardTitle>
                    <Badge 
                      className={`px-2 py-1 text-xs ${
                        tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        tournament.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {tournament.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{tournament.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {tournament.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(tournament.starts_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {tournament.current_participants}/{tournament.max_participants} participants
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Entry: ${tournament.entry_fee}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {tournament.is_registered ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUnregister(tournament.id)}
                        className="flex-1"
                      >
                        Unregister
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => handleRegister(tournament.id)}
                        disabled={tournament.current_participants >= tournament.max_participants}
                        className="flex-1"
                      >
                        {tournament.current_participants >= tournament.max_participants ? 'Full' : 'Register'}
                      </Button>
                    )}
                    <Button variant="outline" size="sm">Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={filters.page <= 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm text-gray-600">
              Page {filters.page} of {pagination.last_page}
            </span>
            <Button
              variant="outline"
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={filters.page >= pagination.last_page}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tournament;