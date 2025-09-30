import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  DollarSign, 
  Clock, 
  Edit, 
  CheckCircle, 
  XCircle,
  Eye,
  EyeOff,
  User,
  Award,
  Target,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { tournamentsService } from '@/services/tournaments';
import { EditTournamentModal } from '@/components/EditTournamentModal';

interface TournamentDetailProps {}

export default function TournamentDetail({}: TournamentDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const queryClient = useQueryClient();
  const [showParticipants, setShowParticipants] = useState(false);

  // Fetch tournament details
  const {
    data: tournament,
    isLoading,
    error
  } = useQuery({
    queryKey: ['tournament', id],
    queryFn: () => tournamentService.getTournament(parseInt(id!)),
    enabled: !!id && isLoggedIn,
  });

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: () => tournamentService.registerForTournament(parseInt(id!)),
    onSuccess: () => {
      toast.success('Successfully registered for tournament!');
      queryClient.invalidateQueries({ queryKey: ['tournament', id] });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to register for tournament');
    },
  });

  // Unregister mutation
  const unregisterMutation = useMutation({
    mutationFn: () => tournamentService.unregisterFromTournament(parseInt(id!)),
    onSuccess: () => {
      toast.success('Successfully unregistered from tournament');
      queryClient.invalidateQueries({ queryKey: ['tournament', id] });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to unregister from tournament');
    },
  });

  // Admin approval mutation
  const approveMutation = useMutation({
    mutationFn: () => tournamentService.approveTournament(parseInt(id!)),
    onSuccess: () => {
      toast.success('Tournament approved successfully!');
      queryClient.invalidateQueries({ queryKey: ['tournament', id] });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve tournament');
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: (reason: string) => tournamentService.rejectTournament(parseInt(id!), reason),
    onSuccess: () => {
      toast.success('Tournament rejected');
      queryClient.invalidateQueries({ queryKey: ['tournament', id] });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reject tournament');
    },
  });

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view tournament details</h1>
          <Button onClick={() => navigate('/auth')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sport-orange mx-auto"></div>
          <p className="mt-4">Loading tournament details...</p>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tournament not found</h1>
          <Button onClick={() => navigate('/tournament')}>Back to Tournaments</Button>
        </div>
      </div>
    );
  }

  const isOrganiser = user?.id === tournament.organiser.id;
  const isAdmin = user?.role === 'admin';
  const canEdit = isOrganiser && tournament.status === 'draft';
  const canApprove = isAdmin && tournament.status === 'pending_approval';
  const isRegistered = tournament.user_participation?.is_registered;
  const canRegister = tournament.registration_enabled && !isRegistered && !tournament.is_full;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending_approval': return <Clock className="h-5 w-5 text-blue-500" />;
      default: return <Settings className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/tournament')}
          className="mb-4"
        >
          ← Back to Tournaments
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{tournament.name}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{tournament.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(tournament.starts_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusIcon(tournament.status)}
            <Badge variant={tournament.status === 'approved' ? 'default' : 'secondary'}>
              {tournament.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      {canApprove && (
        <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              Admin Approval Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                onClick={() => approveMutation.mutate()}
                disabled={approveMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Tournament
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" disabled={rejectMutation.isPending}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Tournament
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Tournament</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>Please provide a reason for rejecting this tournament:</p>
                    <textarea 
                      className="w-full p-2 border rounded"
                      rows={3}
                      placeholder="Reason for rejection..."
                      id="rejection-reason"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          const reason = (document.getElementById('rejection-reason') as HTMLTextAreaElement).value;
                          if (reason.trim()) {
                            rejectMutation.mutate(reason);
                          } else {
                            toast.error('Please provide a reason for rejection');
                          }
                        }}
                      >
                        Reject Tournament
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tournament Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-sport-orange" />
                Tournament Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{tournament.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Sport:</span>
                  <Badge variant="outline">{tournament.sport.name}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Skill Level:</span>
                  <Badge variant="outline">{tournament.skill_level_label}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Entry Fee:</span>
                  <span className="font-medium">£{tournament.entry_fee}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Prize Pool:</span>
                  <span className="font-medium">£{tournament.prize_pool}</span>
                </div>
              </div>

              {tournament.prize_description && (
                <div>
                  <h4 className="font-medium mb-2">Prize Description:</h4>
                  <p className="text-sm text-gray-600">{tournament.prize_description}</p>
                </div>
              )}

              {tournament.rules && (
                <div>
                  <h4 className="font-medium mb-2">Tournament Rules:</h4>
                  <p className="text-sm text-gray-600">{tournament.rules}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-sport-orange" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">{new Date(tournament.starts_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date:</span>
                  <span className="font-medium">{new Date(tournament.ends_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration Deadline:</span>
                  <span className="font-medium">{new Date(tournament.registration_deadline).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-sport-orange" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{tournament.location}</p>
                <p className="text-gray-600">{tournament.address}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-sport-orange" />
                Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Participants:</span>
                <span className="font-medium">{tournament.current_participants} / {tournament.max_participants}</span>
              </div>
              
              <Progress 
                value={(tournament.max_participants ? (tournament.current_participants / tournament.max_participants) * 100 : 0)} 
                className="h-2"
              />
              
              <div className="text-center">
                {isRegistered ? (
                  <div className="space-y-2">
                    <Badge className="bg-green-100 text-green-800">Registered</Badge>
                    <Button 
                      variant="outline" 
                      onClick={() => unregisterMutation.mutate()}
                      disabled={unregisterMutation.isPending}
                      className="w-full"
                    >
                      Unregister
                    </Button>
                  </div>
                ) : canRegister ? (
                  <Button 
                    onClick={() => registerMutation.mutate()}
                    disabled={registerMutation.isPending}
                    className="w-full"
                  >
                    Register for Tournament
                  </Button>
                ) : (
                  <Badge variant="secondary" className="w-full justify-center">
                    {tournament.is_full ? 'Tournament Full' : 'Registration Closed'}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Organiser Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-sport-orange" />
                Organiser
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {tournament.organiser.avatar ? (
                    <img 
                      src={tournament.organiser.avatar} 
                      alt={tournament.organiser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{tournament.organiser.name}</p>
                  <p className="text-sm text-gray-600">Tournament Organiser</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {canEdit && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-sport-orange" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EditTournamentModal tournament={tournament} />
              </CardContent>
            </Card>
          )}

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-sport-orange" />
                Participants
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowParticipants(!showParticipants)}
                >
                  {showParticipants ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showParticipants ? (
                <div className="space-y-2">
                  {tournament.participants?.length > 0 ? (
                    tournament.participants.map((participant: any) => (
                      <div key={participant.id} className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-gray-500" />
                        </div>
                        <span className="text-sm">{participant.name}</span>
                        {participant.is_waiting && (
                          <Badge variant="secondary" className="text-xs">Waiting</Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No participants yet</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  {tournament.current_participants} participants
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 