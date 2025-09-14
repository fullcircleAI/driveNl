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
        
        // Simple synchronous check for existing user
        const currentUser = authService.getCurrentUser();
        console.log('AuthProvider: Current user from auth service:', currentUser);
        
        if (currentUser) {
          console.log('AuthProvider: Setting user from auth service');
          setUser(currentUser);
        } else {
          console.log('AuthProvider: No current user found - user can login later');
        }
        
        // Don't block on cloud sync - do it in background
        setTimeout(async () => {
          try {
            if (currentUser) {
              console.log('AuthProvider: Syncing data to cloud in background');
              await authService.syncData();
            }
          } catch (syncError) {
            console.warn('AuthProvider: Background data sync failed:', syncError);
          }
        }, 100);
        
      } catch (err) {
        console.error('AuthProvider: Error initializing user:', err);
        setError('Failed to initialize user session');
      } finally {
        console.log('AuthProvider: Finished initialization, setting loading to false');
        setLoading(false);
      }
    };

    // Add a small delay to prevent race conditions
    const timer = setTimeout(initializeUser, 100);
    return () => clearTimeout(timer);
  }, []);


  const login = async (username: string, email: string, language: Language = 'en') => {
    try {
      setLoading(true);
      setError(null);
      
      // Use 'en' as default since auth service doesn't support Arabic yet
      const authLanguage: 'en' | 'nl' = language === 'ar' ? 'en' : language;
      const newUser = await authService.createAnonymousUser(username, email, authLanguage);
      setUser(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
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
        // Error updating language
      }
    }
  };

  const updateUserProfile = async (updates: Partial<AuthUser>) => {
    if (user) {
      try {
        await authService.updateUserProfile(updates);
        setUser({ ...user, ...updates });
      } catch (err) {
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