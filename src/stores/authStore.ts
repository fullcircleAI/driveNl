import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  firstName?: string;
  name?: string;
  email: string;
  language: 'en' | 'nl' | 'ar' | null;
  isPremium: boolean;
  progress?: {
    testsCompleted: number;
    topScore: number;
    focusArea: string;
    lastActive: string;
  };
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, email: string, language?: 'en' | 'nl' | 'ar' | null) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => void;
  setLanguage: (language: 'en' | 'nl' | 'ar') => void;
  updateUserProfile: (updates: Partial<User>) => void;
  convertGuestToUser: (email: string, password: string) => Promise<void>;
  updateProgress: (progress: Partial<User['progress']>) => void;
}

// Guest name generator for better UX
const generateGuestName = () => {
  const prefixes = ['Explorer', 'Learner', 'Student', 'Driver', 'Pilot', 'Navigator', 'Captain', 'Rookie', 'Pro', 'Ace'];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  return `${randomPrefix}_${randomNumber}`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      
      init: () => {
        get();
      },

      login: async (username: string, email: string, language: 'en' | 'nl' | 'ar' | null | undefined = null) => {
        set({ loading: true, error: null });
        
        try {
          const user: User = {
            id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            firstName: username,
            name: username,
            email,
            language: language || null,
            isPremium: true,

          };
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ user, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            loading: false 
          });
        }
      },

      loginAsGuest: async () => {
        set({ loading: true, error: null });
        
        try {
          const guestName = generateGuestName();
          const user: User = {
            id: 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            firstName: guestName,
            name: guestName,
            email: `${guestName.toLowerCase()}@guest.drivenl.app`,
            language: null,
            isPremium: false,

            progress: {
              testsCompleted: 0,
              topScore: 0,
              focusArea: 'Road Signs',
              lastActive: new Date().toISOString()
            }
          };
          
          // Save progress to localStorage (simulating cloud storage)
          localStorage.setItem(`user_progress_${user.id}`, JSON.stringify(user.progress));
          
          await new Promise(resolve => setTimeout(resolve, 300));
          set({ user, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Guest login failed', 
            loading: false 
          });
        }
      },

      logout: () => {
        set({ user: null, error: null });
      },

      setLanguage: (language: 'en' | 'nl' | 'ar') => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, language } });
        }
      },

      updateUserProfile: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },

            convertGuestToUser: async (email: string, _password: string) => {
        const { user } = get();
        if (!user) {
          throw new Error('No user to convert');
        }

        set({ loading: true, error: null });
        
        try {
          // Create new registered user
          const newUser: User = {
            id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            firstName: user.firstName,
            name: user.name,
            email,
            language: user.language,
            isPremium: true,
            progress: user.progress // Migrate progress
          };

          // Migrate progress to new user
          if (user.progress) {
            localStorage.setItem(`user_progress_${newUser.id}`, JSON.stringify(user.progress));
            localStorage.removeItem(`user_progress_${user.id}`);
          }

          await new Promise(resolve => setTimeout(resolve, 500));
          set({ user: newUser, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Conversion failed', 
            loading: false 
          });
          console.error('AuthStore: Conversion error:', error);
        }
      },

      updateProgress: (progress: Partial<User['progress']>) => {
        const { user } = get();
        if (user && user.progress) {
          const updatedProgress = { ...user.progress, ...progress };
          set({ 
            user: { 
              ...user, 
              progress: updatedProgress 
            } 
          });
          
          // Update localStorage (simulating cloud storage)
          localStorage.setItem(`user_progress_${user.id}`, JSON.stringify(updatedProgress));
        }
      },
    }),
    {
      name: 'drivenl-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
