import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { authService } from '@/services/auth';
import { useAuth } from '@/hooks/useAuth';

interface GoogleAuthButtonProps {
  onSuccess?: (user: any) => void;
  onError?: (error: any) => void;
  className?: string;
}

export function GoogleAuthButton({ onSuccess, onError, className }: GoogleAuthButtonProps) {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [googleInitialized, setGoogleInitialized] = useState(false);

  // Initialize Google Identity Services
  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        setGoogleInitialized(true);
      } else {
        // Fallback: load Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.google && window.google.accounts) {
            window.google.accounts.id.initialize({
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
              callback: handleGoogleResponse,
            });
            setGoogleInitialized(true);
          }
        };
        document.head.appendChild(script);
      }
    };

    initializeGoogle();
  }, []);

  const handleGoogleResponse = async (response: any) => {
    setIsLoading(true);
    
    try {
      console.log('Google response:', response);
      
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      console.log('Google user payload:', payload);
      
      const googleUserData = {
        email: payload.email,
        first_name: payload.given_name,
        last_name: payload.family_name,
        profile_picture: payload.picture,
        auth_provider: 'google',
        auth_provider_id: payload.sub,
        access_token: response.credential,
      };
      
            // Call the backend authentication API with Google credentials
      const authResult = await authService.socialAuth({
        provider: 'google',
        token: googleUserData.access_token,
        userData: {
          id: googleUserData.auth_provider_id,
          email: googleUserData.email,
          name: `${googleUserData.first_name} ${googleUserData.last_name}`,
          picture: googleUserData.profile_picture,
        }
      });
      
      // Check if response is successful and has the expected data structure
      if (!authResult.success || !authResult.data || !authResult.data.user) {
        throw new Error(authResult.message || 'Google authentication failed - invalid response structure');
      }
      
      // Check if user is new or existing
      const isNewUser = !authResult.data.user.date_of_birth || !authResult.data.user.gender || !authResult.data.user.location;
        
        if (isNewUser) {
          // User exists but needs to complete registration
          const token = typeof authResult.data.token === 'string' 
            ? authResult.data.token 
            : (authResult.data.token as any).accessToken;
          sessionStorage.setItem('google_user_data', JSON.stringify({
            ...googleUserData,
            token: token,
            user: authResult.data.user
          }));
          
          toast.success('Google authentication successful! Please complete your registration.');
          navigate('/register?source=google');
        } else {
          // User is fully registered, log them in directly
          const token = typeof authResult.data.token === 'string' 
            ? authResult.data.token 
            : (authResult.data.token as any).accessToken;
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user', JSON.stringify(authResult.data.user));
        
        // Update the auth context
        setUser(authResult.data.user);
        
        console.log('User logged in successfully, redirecting to dashboard...');
        toast.success('Welcome back! You have been logged in successfully.');
        
        // Navigate to dashboard
        navigate('/dashboard');
      }
      
      if (onSuccess) {
        onSuccess(authResult.data.user);
      }
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast.error(error.message || 'Google authentication failed');
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    // For development/testing, use mock data if Google is not configured
    if (!googleInitialized || !window.google?.accounts) {
      console.log('Google not initialized, using mock data for development');
      await handleMockGoogleAuth();
      return;
    }
    
    try {
      // Trigger Google One Tap or Sign-In
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to manual sign-in
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button') || document.body,
            { theme: 'outline', size: 'large', text: 'signin_with' }
          );
        }
      });
    } catch (error: any) {
      console.error('Google auth error:', error);
      console.log('Falling back to mock authentication for development');
      await handleMockGoogleAuth();
    }
  };

  const handleMockGoogleAuth = async () => {
    setIsLoading(true);
    
    try {
      // Mock Google user data for development
      const mockGoogleUserData = {
        email: 'da.ogunkoyaa@gmail.com', // Use your actual email
        first_name: 'Da',
        last_name: 'Ogunkoya',
        profile_picture: 'https://via.placeholder.com/150/4285F4/FFFFFF?text=D',
        auth_provider: 'google',
        auth_provider_id: 'mock_google_id_' + Date.now(),
        access_token: 'mock_google_token_' + Date.now(),
      };
      
      // Call the backend authentication API with Google credentials
      const authResult = await authService.socialAuth({
        provider: 'google',
        token: mockGoogleUserData.access_token,
        userData: {
          id: mockGoogleUserData.auth_provider_id,
          email: mockGoogleUserData.email,
          name: `${mockGoogleUserData.first_name} ${mockGoogleUserData.last_name}`,
          picture: mockGoogleUserData.profile_picture,
        }
      });
      
      // Check if response is successful and has the expected data structure
      if (!authResult.success || !authResult.data || !authResult.data.user) {
        throw new Error(authResult.message || 'Google authentication failed - invalid response structure');
      }
      
      // Check if user is new or existing
      const isNewUser = !authResult.data.user.date_of_birth || !authResult.data.user.gender || !authResult.data.user.location;
        
        if (isNewUser) {
          // User exists but needs to complete registration
          const token = typeof authResult.data.token === 'string' 
            ? authResult.data.token 
            : (authResult.data.token as any).accessToken;
          sessionStorage.setItem('google_user_data', JSON.stringify({
            ...mockGoogleUserData,
            token: token,
            user: authResult.data.user
          }));
          
          toast.success('Google authentication successful! Please complete your registration.');
          navigate('/register?source=google');
        } else {
          // User is fully registered, log them in directly
          const token = typeof authResult.data.token === 'string' 
            ? authResult.data.token 
            : (authResult.data.token as any).accessToken;
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user', JSON.stringify(authResult.data.user));
        
        // Update the auth context
        setUser(authResult.data.user);
        
        console.log('User logged in successfully, redirecting to dashboard...');
        toast.success('Welcome back! You have been logged in successfully.');
        
        // Navigate to dashboard
        navigate('/dashboard');
      }
      
      if (onSuccess) {
        onSuccess(authResult.data.user);
      }
    } catch (error: any) {
      console.error('Mock Google auth error:', error);
      toast.error(error.message || 'Google authentication failed');
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button
        onClick={handleGoogleAuth}
        disabled={isLoading}
        className="w-full bg-[#4285F4] hover:bg-[#357ABD] text-white"
        variant="outline"
      >
        {isLoading ? (
          'Loading...'
        ) : (
          <>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </>
        )}
      </Button>
    </div>
  );
}
