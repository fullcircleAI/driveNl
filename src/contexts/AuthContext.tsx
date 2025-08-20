import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Language } from '../types';
import { authService, type AuthUser } from '../services/authService';
import { dataPersistence } from '../services/dataPersistence';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (username: string, email: string, language?: Language) => Promise<void>;
  logout: () => void;
  setLanguage: (language: Language) => void;
  updateUserProfile: (updates: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('AuthProvider: Initial state - user:', user, 'loading:', loading);

  useEffect(() => {
    // Check for existing user on app start
    const initializeUser = async () => {
      try {
        console.log('AuthProvider: Starting user initialization');
        setLoading(true);
        
        // Try to get current user from auth service
        const currentUser = authService.getCurrentUser();
        console.log('AuthProvider: Current user from auth service:', currentUser);
        
        if (currentUser) {
          console.log('AuthProvider: Setting user from auth service');
          setUser(currentUser);
          
          // Try to sync data to cloud in background (don't block on this)
          try {
            console.log('AuthProvider: Syncing data to cloud');
            await authService.syncData();
          } catch (syncError) {
            console.warn('AuthProvider: Data sync failed, but continuing:', syncError);
          }
        } else {
          console.log('AuthProvider: No current user found');
        }
      } catch (err) {
        console.error('AuthProvider: Error initializing user:', err);
        setError('Failed to initialize user session');
      } finally {
        console.log('AuthProvider: Finished initialization, setting loading to false');
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  console.log('AuthProvider: Current state - user:', user, 'loading:', loading, 'error:', error);

  const login = async (username: string, email: string, language: Language = 'en') => {
    try {
      console.log('AuthProvider: Login started with username:', username, 'email:', email);
      setLoading(true);
      setError(null);
      
      console.log('AuthProvider: Creating anonymous user...');
      // Use 'en' as default since auth service doesn't support Arabic yet
      const authLanguage: 'en' | 'nl' = language === 'ar' ? 'en' : language;
      const newUser = await authService.createAnonymousUser(username, email, authLanguage);
      console.log('AuthProvider: User created successfully:', newUser);
      setUser(newUser);
      console.log('AuthProvider: User state updated');
    } catch (err) {
      console.error('AuthProvider: Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      console.log('AuthProvider: Login finished, setting loading to false');
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const setLanguage = async (language: Language) => {
    if (user) {
      try {
        // Use 'en' as default since auth service doesn't support Arabic yet
        const authLanguage = language === 'ar' ? 'en' : language;
        await authService.updateUserProfile({ language: authLanguage });
        await authService.updateUserSettings({ language: authLanguage });
        setUser({ ...user, language });
      } catch (err) {
        console.error('Error updating language:', err);
      }
    }
  };

  const updateUserProfile = async (updates: Partial<AuthUser>) => {
    if (user) {
      try {
        await authService.updateUserProfile(updates);
        setUser({ ...user, ...updates });
      } catch (err) {
        console.error('Error updating user profile:', err);
        throw err;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout, 
      setLanguage,
      updateUserProfile 
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