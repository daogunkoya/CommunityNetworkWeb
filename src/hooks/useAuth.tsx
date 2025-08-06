import { useState, useEffect, createContext, useContext } from 'react';
import { authService, AuthUser, LoginCredentials, RegisterData } from '@/services/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on app load
    const checkAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        if (storedUser && authService.isAuthenticated()) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const registerData = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        email,
        password,
        password_confirmation: password,
        location: userData.location,
        gender: userData.gender,
        date_of_birth: userData.date_of_birth,
        phone: userData.phone,
        bio: userData.bio,
        interests: userData.interests,
        skill_level: userData.skill_level,
      };

      const response = await authService.register(registerData);
      
      // Only set user if no verification is required (user is immediately logged in)
      if (!response.requires_verification) {
        setUser(response.user);
      }
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const credentials: LoginCredentials = { email, password };
      const response = await authService.login(credentials);
      setUser(response.user);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
      setUser(null);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}