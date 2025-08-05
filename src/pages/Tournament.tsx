import { Button } from '@/components/ui/button';
import { Calendar, Trophy, Users, MapPin, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const tournaments = [
  {
    id: 1,
    name: 'Summer Tennis Championship',
    sport: 'Tennis',
    date: 'July 15-17, 2024',
    location: 'Central Sports Complex',
    participants: 32,
    maxParticipants: 64,
    prize: '$500',
    status: 'open',
    deadline: '3 days left',
    difficulty: 'Intermediate'
  },
  {
    id: 2,
    name: 'Basketball 3v3 Street Tournament',
    sport: 'Basketball',
    date: 'July 22, 2024',
    location: 'Downtown Courts',
    participants: 28,
    maxParticipants: 32,
    prize: 'Trophies',
    status: 'filling-fast',
    deadline: '1 week left',
    difficulty: 'All Levels'
  },
  {
    id: 3,
    name: 'Cycling Hill Challenge',
    sport: 'Cycling',
    date: 'August 5, 2024',
    location: 'Mountain Trails',
    participants: 45,
    maxParticipants: 50,
    prize: '$1,200',
    status: 'almost-full',
    deadline: '2 weeks left',
    difficulty: 'Advanced'
  }
];

const upcomingMatches = [
  {
    id: 1,
    tournament: 'Tennis Championship',
    match: 'Quarter Finals',
    players: 'Alex vs Maria',
    time: 'Today 3:00 PM',
    court: 'Court 1'
  },
  {
    id: 2,
    tournament: 'Basketball Tournament',
    match: 'Group Stage',
    players: 'Team Alpha vs Team Beta',
    time: 'Tomorrow 10:00 AM',
    court: 'Court A'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return 'bg-sport-green text-white';
    case 'filling-fast': return 'bg-sport-orange text-white';
    case 'almost-full': return 'bg-sport-red text-white';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-sport-green text-white';
    case 'Intermediate': return 'bg-sport-orange text-white';
    case 'Advanced': return 'bg-sport-red text-white';
    default: return 'bg-primary text-primary-foreground';
  }
};

export default function Tournament() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-sport-orange" />
          <h1 className="text-xl font-bold">Tournaments</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Featured Tournament */}
        <Card className="mb-6 border-border/50 bg-gradient-to-r from-primary/5 to-sport-blue/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-sport-orange fill-current" />
              <CardTitle className="text-lg">Featured Tournament</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-bold text-xl mb-2">Summer Tennis Championship</h3>
            <p className="text-muted-foreground mb-4">Join the biggest tennis event of the season!</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">July 15-17</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Central Sports</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">32/64 players</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">$500 Prize</span>
              </div>
            </div>
            
            <Progress value={50} className="mb-4" />
            <Button className="w-full" variant="sport">
              Register Now - $25
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Matches */}
        <Card className="mb-6 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Live & Upcoming Matches
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingMatches.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{match.players}</p>
                  <p className="text-xs text-muted-foreground">{match.tournament} - {match.match}</p>
                  <p className="text-xs text-muted-foreground">{match.court}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{match.time}</p>
                  <Button size="sm" variant="outline" className="mt-1">
                    Watch
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* All Tournaments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">All Tournaments</h3>
            <Button variant="ghost" size="sm">
              Filter
            </Button>
          </div>
          
          {tournaments.map((tournament) => (
            <Card key={tournament.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{tournament.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getDifficultyColor(tournament.difficulty)}>
                        {tournament.difficulty}
                      </Badge>
                      <Badge className={getStatusColor(tournament.status)}>
                        {tournament.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sport-orange">{tournament.prize}</p>
                    <p className="text-xs text-muted-foreground">{tournament.deadline}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{tournament.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{tournament.location}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Participants</span>
                    <span>{tournament.participants}/{tournament.maxParticipants}</span>
                  </div>
                  <Progress value={(tournament.participants / tournament.maxParticipants) * 100} />
                </div>
                
                <Button className="w-full" variant="outline">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}