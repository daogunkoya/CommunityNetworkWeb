import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MatchGrinderLogo } from '@/components/MatchGrinderLogo';
import { 
  Users, 
  Trophy, 
  MessageSquare, 
  MapPin, 
  Calendar, 
  Target, 
  Zap, 
  Star,
  ArrowRight,
  Play,
  Shield,
  Heart
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Find Local Players",
      description: "Connect with sports enthusiasts in your area. Find players of all skill levels for your favorite games."
    },
    {
      icon: <Trophy className="h-8 w-8 text-amber-500" />,
      title: "Join Tournaments",
      description: "Compete in local tournaments and leagues. Track your progress and climb the leaderboards."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-green-500" />,
      title: "Community Discussions",
      description: "Share strategies, tips, and experiences with fellow players. Build lasting friendships."
    },
    {
      icon: <MapPin className="h-8 w-8 text-red-500" />,
      title: "Discover Venues",
      description: "Find the best courts, fields, and facilities near you. Get directions and venue information."
    }
  ];

  const howToPlay = [
    {
      step: "1",
      title: "Create Your Profile",
      description: "Set up your profile with your favorite sports, skill level, and location preferences."
    },
    {
      step: "2",
      title: "Find Players & Games",
      description: "Browse available games or create your own. Filter by sport, location, and skill level."
    },
    {
      step: "3",
      title: "Join & Play",
      description: "Request to join games, confirm your attendance, and enjoy playing with new friends."
    },
    {
      step: "4",
      title: "Build Community",
      description: "Rate players, share photos, and participate in discussions to grow your sports network."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Players" },
    { number: "500+", label: "Games Weekly" },
    { number: "50+", label: "Cities" },
    { number: "15+", label: "Sports" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <MatchGrinderLogo size="md" variant="full" />
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/signin')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/register')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200">
              <Zap className="h-4 w-4 mr-2" />
              The Ultimate Sports Community Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
              Find Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Perfect Match</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Connect with local players, join tournaments, and build lasting friendships through your favorite sports. 
              Whether you're a beginner or pro, there's a game waiting for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Playing Today
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/signin')}
                className="text-lg px-8 py-6 border-2"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="bg-white/50 backdrop-blur-sm border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{stat.number}</div>
                  <div className="text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Play
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From finding players to joining tournaments, we've got everything covered to make your sports experience amazing.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-slate-100 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-slate-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How to Get Started
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Getting started with MatchGrinder is simple. Follow these steps and you'll be playing in no time.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howToPlay.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {step.step}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Sports We Support
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From tennis to basketball, we support a wide variety of sports. Find your passion and connect with players.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {['Tennis', 'Basketball', 'Football', 'Badminton', 'Table Tennis', 'Volleyball'].map((sport, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{sport}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Playing?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of players who are already enjoying MatchGrinder. 
            Create your profile and find your next game today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/register')}
              className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-slate-100"
            >
              <Heart className="h-5 w-5 mr-2" />
              Join MatchGrinder
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/signin')}
              className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <MatchGrinderLogo size="md" variant="full" />
              </div>
              <p className="text-slate-400">
                Connecting sports enthusiasts and building communities through the love of the game.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Find Players</li>
                <li>Join Tournaments</li>
                <li>Community Chat</li>
                <li>Venue Discovery</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Twitter</li>
                <li>Instagram</li>
                <li>Facebook</li>
                <li>LinkedIn</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 MatchGrinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
