import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Language } from '../types';
import { authService, type AuthUser } from '../services/authService';

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


  useEffect(() => {
    // Check for existing user on app start
    const initializeUser = async () => {
      try {
        setLoading(true);
        
        // Simple synchronous check for existing user
        const currentUser = authService.getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
        } else {
        }
        
        // Don't block on cloud sync - do it in background
        setTimeout(async () => {
          try {
            if (currentUser) {
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
        const authLanguage = language === 'ar' ? 'en' : language as 'en' | 'nl';
        await authService.updateUserProfile({ language: authLanguage });
        await authService.updateUserSettings({ language: authLanguage });
        setUser({ ...user, language: authLanguage });
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