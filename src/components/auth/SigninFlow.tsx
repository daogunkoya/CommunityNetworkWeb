import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Mail, 
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { getAppName } from '@/config/app';
import { authService } from '@/services/auth';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { GoogleAuthButton } from './GoogleAuthButton';

interface SigninData {
  email: string;
  password: string;
}

const steps = [
  { title: 'Welcome Back', description: 'Sign in to your account' },
  { title: 'Sign In', description: 'Enter your credentials' },
];

export function SigninFlow() {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<SigninData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateData = (updates: Partial<SigninData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignin = async () => {
    if (!data.email || !data.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn(data.email, data.password);

      // Check for errors
      if (result.error) {
        throw result.error;
      }

      // If no error, the login was successful
      // The user state will be updated by the useAuth hook
      toast.success('Welcome back!');
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Signin error:', error);
      toast.error(error?.message || 'Signin failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (userData: any) => {
    // Google auth will redirect to registration flow
    console.log('Google auth successful:', userData);
  };

  const handleGoogleError = (error: any) => {
    console.error('Google auth error:', error);
    toast.error('Google authentication failed');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to your {getAppName()} account</p>
            </div>
            
            <div className="space-y-4">
              <GoogleAuthButton 
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                className="w-full"
              />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={nextStep}
                className="w-full"
                variant="outline"
              >
                <Mail className="mr-2 h-4 w-4" />
                Continue with Email
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto"
                  onClick={() => navigate('/register')}
                >
                  Sign up
                </Button>
              </p>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={prevStep}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              <h1 className="text-2xl font-bold">Sign In</h1>
              <p className="text-muted-foreground">Enter your credentials to continue</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={data.email}
                  onChange={(e) => updateData({ email: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={data.password}
                    onChange={(e) => updateData({ password: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={handleSignin}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto"
                  onClick={() => navigate('/register')}
                >
                  Sign up
                </Button>
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">{getAppName()}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
}
