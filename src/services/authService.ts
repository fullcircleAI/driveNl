import { dataPersistence } from './dataPersistence';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  language: 'en' | 'nl';
  isPremium: boolean;
}

class AuthService {
  private currentUser: AuthUser | null = null;

  // Generate a unique user ID
  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Create a new anonymous user
  async createAnonymousUser(username: string, email: string, language: 'en' | 'nl' = 'en'): Promise<AuthUser> {
    console.log('AuthService: createAnonymousUser started');
    const userId = this.generateUserId();
    console.log('AuthService: Generated userId:', userId);
    
    const user: AuthUser = {
      id: userId,
      username,
      email: email,
      language,
      isPremium: true // Free premium for now
    };

    console.log('AuthService: Created user object:', user);

    // Set user ID in data persistence service
    console.log('AuthService: Setting user ID in data persistence');
    dataPersistence.setUserId(userId);

    // Save user profile to database
    console.log('AuthService: Saving user profile to database...');
    try {
      await dataPersistence.saveUserProfile({
        username,
        email: user.email,
        language,
        isPremium: true,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        totalTestsCompleted: 0,
        averageScore: 0
      });
      console.log('AuthService: User profile saved successfully');
    } catch (error) {
      console.error('AuthService: Error saving user profile:', error);
      // Don't throw error - continue with local storage
    }

    // Save default settings
    console.log('AuthService: Saving user settings...');
    try {
      await dataPersistence.saveUserSettings({
        language,
        voiceEnabled: true,
        notificationsEnabled: true,
        theme: 'light'
      });
      console.log('AuthService: User settings saved successfully');
    } catch (error) {
      console.error('AuthService: Error saving user settings:', error);
      // Don't throw error - continue with local storage
    }

    this.currentUser = user;
    console.log('AuthService: Set current user');
    
    // Store in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log('AuthService: Saved user to localStorage');
    
    console.log('AuthService: createAnonymousUser completed successfully');
    return user;
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to get from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        dataPersistence.setUserId(this.currentUser.id);
        return this.currentUser;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }

    return null;
  }

  // Login with existing user ID
  async loginWithUserId(userId: string): Promise<AuthUser | null> {
    try {
      dataPersistence.setUserId(userId);
      
      const profile = await dataPersistence.getUserProfile();
      if (profile) {
        const user: AuthUser = {
          id: profile.id,
          username: profile.username,
          email: profile.email,
          language: profile.language,
          isPremium: profile.isPremium
        };

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        return user;
      }
    } catch (error) {
      console.error('Error logging in with user ID:', error);
    }

    return null;
  }

  // Update user profile
  async updateUserProfile(updates: Partial<AuthUser>): Promise<void> {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }

    const updatedUser = { ...this.currentUser, ...updates };
    
    await dataPersistence.saveUserProfile({
      username: updatedUser.username,
      email: updatedUser.email,
      language: updatedUser.language,
      isPremium: updatedUser.isPremium,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      totalTestsCompleted: 0,
      averageScore: 0
    });

    this.currentUser = updatedUser;
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }

  // Update user settings
  async updateUserSettings(settings: Partial<{ language: 'en' | 'nl'; voiceEnabled: boolean; notificationsEnabled: boolean; theme: 'light' | 'dark' | 'auto' }>): Promise<void> {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }

    const currentSettings = await dataPersistence.getUserSettings();
    const updatedSettings = {
      userId: this.currentUser.id,
      language: this.currentUser.language,
      voiceEnabled: true,
      notificationsEnabled: true,
      theme: 'light' as const,
      ...currentSettings,
      ...settings
    };

    await dataPersistence.saveUserSettings(updatedSettings);
  }

  // Logout
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    dataPersistence.setUserId(null);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Get user ID
  getUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  // Sync local data to cloud
  async syncData(): Promise<void> {
    if (this.isLoggedIn()) {
      await dataPersistence.syncLocalData();
    }
  }

  // Delete user account
  async deleteAccount(): Promise<void> {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }

    await dataPersistence.deleteUserData();
    this.logout();
  }
}

// Export singleton instance
export const authService = new AuthService(); 