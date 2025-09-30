import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Facebook, 
  Apple, 
  Mail, 
  MapPin, 
  Users, 
  Bell, 
  Activity,
  ArrowLeft,
  ArrowRight,
  Check
} from 'lucide-react';
import { getAppName, getAppDescription } from '@/config/app';
import { registrationService } from '@/services/registration';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface RegistrationData {
  // Step 1: Personal Info
  fullName: string;
  dateOfBirth: string;
  gender: string;
  profilePicture?: string;
  
  // Step 2: Location
  location: string;
  radius: number;
  
  // Step 3: Sports
  selectedSports: string[];
  
  // Step 4: Skill Levels
  skillLevels: Record<string, string>;
  
  // Step 5: Goals
  mainGoal: string;
  
  // Account fields
  email: string;
  password: string;
  authProvider: string;
}

const sports = [
  { id: 3, name: 'Tennis', icon: '🎾' },
  { id: 8, name: 'Badminton', icon: '🏸' },
  { id: 9, name: 'Table Tennis', icon: '🏓' },
  { id: 1, name: 'Basketball', icon: '🏀' },
  { id: 2, name: 'Football', icon: '⚽' },
  { id: 4, name: 'Swimming', icon: '🏊' },
  { id: 5, name: 'Cycling', icon: '🚴' },
  { id: 6, name: 'Running', icon: '🏃' },
  { id: 7, name: 'Volleyball', icon: '🏐' },
  { id: 10, name: 'Cricket', icon: '🏏' },
  { id: 11, name: 'Hockey', icon: '🏒' },
  { id: 12, name: 'Rugby', icon: '🏉' },
  { id: 13, name: 'Golf', icon: '⛳' },
  { id: 14, name: 'Boxing', icon: '🥊' },
  { id: 15, name: 'Martial Arts', icon: '🥋' },
];

const skillLevels = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
  { id: 'expert', name: 'Expert' },
];

const goals = [
  { id: 'play-more', name: 'To play more tennis, table tennis, squash, pickleball and beach tennis' },
  { id: 'find-partner', name: 'To find someone to practice with' },
  { id: 'improve', name: 'To improve my game' },
];

const facilities = [
  { id: 'gladstone-park', name: 'Gladstone Park Tennis Courts', address: 'Dollis Hill Ln, London NW2 6HU, UK' },
  { id: 'regents-park', name: 'Park Sports Regent\'s Park', address: 'York Bridge Inner Circle The Regent\'s Park London' },
  { id: 'paddington', name: 'Paddington Recreation Ground', address: 'Randolph Ave, London W9 1PD' },
  { id: 'hyde-park', name: 'Park Sports Hyde Park', address: 'Hyde Park, London' },
  { id: 'queens-park', name: 'Queens Park', address: 'Queens Park, London' },
];

export function RegistrationFlow() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<RegistrationData>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    location: '',
    radius: 5,
    selectedSports: [],
    skillLevels: {},
    mainGoal: '',
    email: '',
    password: '',
    authProvider: 'email',
  });

  // Check for Google user data on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    
    if (source === 'google') {
      const googleUserData = sessionStorage.getItem('google_user_data');
      if (googleUserData) {
        try {
          const googleData = JSON.parse(googleUserData);
          
          // Pre-fill data from Google
          setData(prev => ({
            ...prev,
            fullName: `${googleData.first_name} ${googleData.last_name}`,
            email: googleData.email,
            authProvider: 'google',
          }));
          
          // Store the authentication token if available
          if (googleData.token) {
            localStorage.setItem('auth_token', googleData.token);
            console.log('Google auth token stored:', googleData.token);
          }
          
          // Clear the stored data
          sessionStorage.removeItem('google_user_data');
          
          // Skip Welcome and Account steps, go directly to Personal Info (step 2)
          setCurrentStep(2);
          
          toast.success('Google data loaded! Please complete your registration.');
        } catch (error) {
          console.error('Error parsing Google user data:', error);
        }
      }
    }
  }, []);

  const steps = [
    { title: 'Welcome', description: 'Get started with MatchGrinder' },
    { title: 'Account', description: 'Create your account' },
    { title: 'Personal Info', description: 'Tell us about yourself' },
    { title: 'Location', description: 'Where do you want to play?' },
    { title: 'Sports', description: 'What sports do you play?' },
    { title: 'Skill Level', description: 'What\'s your skill level?' },
    { title: 'Goals', description: 'What\'s your main goal?' },
  ];

  const updateData = (updates: Partial<RegistrationData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete registration
      try {
        // Prepare registration data
        const registrationData = { ...data };
        
        // For social authentication users, don't send password
        if (data.authProvider !== 'email') {
          delete registrationData.password;
        }
        
        console.log('Registration data being sent:', registrationData);
        const result = await registrationService.register(registrationData);
        console.log('Registration result received:', result);
        console.log('Registration result type:', typeof result);
        console.log('Registration result keys:', Object.keys(result || {}));
        console.log('Full registration response:', JSON.stringify(result, null, 2));
        
        // Store authentication data and update auth context
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('auth_user', JSON.stringify(result.user));
        setUser(result.user);
        toast.success('Registration successful! Welcome to MatchGrinder!');
        navigate('/dashboard');
      } catch (error: any) {
        console.error('Registration error:', error);
        
        // Handle validation errors specifically
        if (error.response?.status === 422 && error.response?.data?.errors) {
          const errors = error.response.data.errors;
          let errorMessage = 'Please fix the following errors:\n';
          
          Object.keys(errors).forEach(field => {
            errorMessage += `• ${field}: ${errors[field].join(', ')}\n`;
          });
          
          toast.error(errorMessage);
        } else {
          toast.error(error.response?.data?.message || 'Registration failed');
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      case 1:
        return <AccountStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      case 2:
        return <PersonalInfoStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <LocationStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <SportsStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      case 5:
        return <SkillLevelStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      case 6:
        return <GoalsStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            {currentStep > 0 && (
              <Button variant="ghost" size="sm" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex-1">
              <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
              <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
            </div>
            {currentStep > 0 && <div className="w-10" />}
          </div>
          
          <Progress value={(currentStep / (steps.length - 1)) * 100} className="w-full" />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
        </CardHeader>
        
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
}

// Step Components
function AccountStep({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}: { 
  data: RegistrationData; 
  updateData: (updates: Partial<RegistrationData>) => void; 
  onNext: () => void; 
  onBack: () => void; 
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Create your account</h2>
        <p className="text-gray-600">Enter your email and create a password</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => updateData({ password: e.target.value })}
            placeholder="Create a password (min 8 characters)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 8 characters long
          </p>
        </div>
      </div>

      <Button 
        className="w-full" 
        onClick={onNext} 
        disabled={!data.email || !data.password || data.password.length < 8}
      >
        Continue
      </Button>
    </div>
  );
}
function WelcomeStep({ onNext }: { onNext: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialAuth = async (provider: 'facebook' | 'google' | 'apple') => {
    setIsLoading(true);
    try {
      // For now, we'll simulate social auth
      // In a real implementation, you'd integrate with the actual social providers
      const mockUserData = {
        id: `mock_${provider}_id_${Date.now()}`,
        name: `User ${provider}`,
        email: `user_${provider}@example.com`,
      };

      const result = await registrationService.socialAuth({
        provider,
        token: 'mock_token',
        userData: mockUserData,
      });

      if (result.isNewUser) {
        // If new user, continue with registration flow
        onNext();
      } else {
        // If existing user, log them in
        toast.success('Login successful!');
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      toast.error('Social authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignup = () => {
    // Set auth provider to email and continue
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{getAppName()}</h1>
        <p className="text-gray-600 mb-6">{getAppDescription()}</p>
      </div>

      <div className="space-y-3">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700" 
          onClick={() => handleSocialAuth('facebook')}
          disabled={isLoading}
        >
          <Facebook className="h-4 w-4 mr-2" />
          Continue with Facebook
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => handleSocialAuth('google')}
          disabled={isLoading}
        >
          <Mail className="h-4 w-4 mr-2" />
          Continue with Google
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => handleSocialAuth('apple')}
          disabled={isLoading}
        >
          <Apple className="h-4 w-4 mr-2" />
          Continue with Apple
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full" 
        onClick={handleEmailSignup}
        disabled={isLoading}
      >
        <Mail className="h-4 w-4 mr-2" />
        Sign up with email
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button 
          className="text-blue-600 hover:underline"
          onClick={() => window.location.href = '/signin'}
        >
          Sign in
        </button>
      </p>
    </div>
  );
}

function PersonalInfoStep({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}: { 
  data: RegistrationData; 
  updateData: (updates: Partial<RegistrationData>) => void; 
  onNext: () => void; 
  onBack: () => void; 
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">One last thing... your personal info</h2>
        <p className="text-gray-600">Please provide some personal information</p>
      </div>

      <div className="flex justify-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src={data.profilePicture} />
          <AvatarFallback className="bg-orange-500 text-white text-xl">
            {data.fullName.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => updateData({ fullName: e.target.value })}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={data.dateOfBirth || ''}
            onChange={(e) => {
              updateData({ 
                dateOfBirth: e.target.value
              });
            }}
            max={new Date().toISOString().split('T')[0]}
            min={new Date(new Date().getFullYear() - 120, 0, 1).toISOString().split('T')[0]}
            className="mt-2"
          />
          {data.dateOfBirth && (
            <p className="text-sm text-gray-600 mt-1">
              Age: {Math.floor((new Date().getTime() - new Date(data.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years old
            </p>
          )}
        </div>

        <div>
          <Label>Gender *</Label>
          <RadioGroup value={data.gender} onValueChange={(value) => updateData({ gender: value })}>
            <div className="flex gap-2 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                <Label htmlFor="prefer-not-to-say">Prefer not to say</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Button 
        className="w-full" 
        onClick={onNext} 
        disabled={!data.fullName || !data.dateOfBirth || !data.gender || (data.dateOfBirth && new Date(data.dateOfBirth) > new Date())}
      >
        Let's play
      </Button>
    </div>
  );
}

function LocationStep({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}: { 
  data: RegistrationData; 
  updateData: (updates: Partial<RegistrationData>) => void; 
  onNext: () => void; 
  onBack: () => void; 
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationChange = async (value: string) => {
    updateData({ location: value });
    
    if (value.length > 2) {
      setIsLoading(true);
      try {
        // This would integrate with Google Places Autocomplete API
        // For now, we'll simulate suggestions
        const mockSuggestions = [
          `${value}, London, UK`,
          `${value}, Manchester, UK`,
          `${value}, Birmingham, UK`,
        ];
        setSuggestions(mockSuggestions);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Where would you like to play?</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="location">LOCATION</Label>
          <div className="relative">
            <Input
              id="location"
              value={data.location}
              onChange={(e) => handleLocationChange(e.target.value)}
              placeholder="Enter postcode or city"
              className="mt-2"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          
          {suggestions.length > 0 && (
            <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    updateData({ location: suggestion });
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>PLEASE NOTE:</strong> The location you set will be displayed in your {getAppName()} profile. 
            Be careful not to make your home address identifiable.
          </p>
        </div>

        <div>
          <Label>RADIUS IN MILES</Label>
          <div className="mt-2">
            <div className="text-center mb-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {data.radius} miles
              </span>
            </div>
            <Slider
              value={[data.radius]}
              onValueChange={([value]) => updateData({ radius: value })}
              max={30}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>30</span>
            </div>
          </div>
        </div>
      </div>

      <Button className="w-full" onClick={onNext} disabled={!data.location}>
        Next
      </Button>
    </div>
  );
}

function SportsStep({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}: { 
  data: RegistrationData; 
  updateData: (updates: Partial<RegistrationData>) => void; 
  onNext: () => void; 
  onBack: () => void; 
}) {
  const [availableSports, setAvailableSports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const sportsData = await registrationService.getSports();
        setAvailableSports(sportsData);
      } catch (error) {
        console.error('Error fetching sports:', error);
        // Fallback to hardcoded sports if API fails
        setAvailableSports(sports);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSports();
  }, []);

  const toggleSport = (sportId: string) => {
    const newSports = data.selectedSports.includes(sportId)
      ? data.selectedSports.filter(id => id !== sportId)
      : [...data.selectedSports, sportId];
    updateData({ selectedSports: newSports });
  };

  const getSportIcon = (sportName: string) => {
    const sport = sports.find(s => s.name.toLowerCase() === sportName.toLowerCase());
    return sport?.icon || '⚽';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">What additional sport(s) would you like to play?</h2>
          <p className="text-gray-600">Choose all the sports you want to play</p>
        </div>
        
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">What additional sport(s) would you like to play?</h2>
        <p className="text-gray-600">Choose all the sports you want to play</p>
      </div>

      <div className="space-y-3">
        {availableSports.map((sport) => (
          <div
            key={sport.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              data.selectedSports.includes(sport.id.toString())
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => toggleSport(sport.id.toString())}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getSportIcon(sport.name)}</span>
                <span className="font-medium">{sport.name}</span>
              </div>
              {data.selectedSports.includes(sport.id.toString()) && (
                <Check className="h-5 w-5 text-blue-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      <Button className="w-full" onClick={onNext} disabled={data.selectedSports.length === 0}>
        Next
      </Button>
    </div>
  );
}

function SkillLevelStep({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}: { 
  data: RegistrationData; 
  updateData: (updates: Partial<RegistrationData>) => void; 
  onNext: () => void; 
  onBack: () => void; 
}) {
  const [availableSports, setAvailableSports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const sportsData = await registrationService.getSports();
        setAvailableSports(sportsData);
      } catch (error) {
        console.error('Error fetching sports:', error);
        // Fallback to hardcoded sports if API fails
        setAvailableSports(sports);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSports();
  }, []);

  const getSportIcon = (sportName: string) => {
    const sport = sports.find(s => s.name.toLowerCase() === sportName.toLowerCase());
    return sport?.icon || '⚽';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">What level do you consider yourself?</h2>
          <p className="text-gray-600">Choose the level for each sport</p>
        </div>
        
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">What level do you consider yourself?</h2>
        <p className="text-gray-600">Choose the level for each sport</p>
      </div>

      <div className="space-y-6">
        {data.selectedSports.map((sportId) => {
          const sport = availableSports.find(s => s.id.toString() === sportId);
          if (!sport) return null;

          return (
            <div key={sportId} className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getSportIcon(sport.name)}</span>
                <span className="font-medium">{sport.name}</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {skillLevels.map((level) => (
                  <Button
                    key={level.id}
                    variant={data.skillLevels[sportId] === level.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateData({ 
                      skillLevels: { ...data.skillLevels, [sportId]: level.id } 
                    })}
                  >
                    {level.name}
                  </Button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Button 
        className="w-full" 
        onClick={onNext}
        disabled={data.selectedSports.length === 0 || 
                 data.selectedSports.some(sportId => !data.skillLevels[sportId])}
      >
        Next
      </Button>
    </div>
  );
}

function GoalsStep({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}: { 
  data: RegistrationData; 
  updateData: (updates: Partial<RegistrationData>) => void; 
  onNext: () => void; 
  onBack: () => void; 
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">What is your main goal?</h2>
      </div>

      <RadioGroup value={data.mainGoal} onValueChange={(value) => updateData({ mainGoal: value })}>
        <div className="space-y-3">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                data.mainGoal === goal.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => updateData({ mainGoal: goal.id })}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value={goal.id} id={goal.id} />
                <Label htmlFor={goal.id} className="cursor-pointer">{goal.name}</Label>
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>

      <Button className="w-full" onClick={onNext} disabled={!data.mainGoal}>
        Next
      </Button>
    </div>
  );
}






