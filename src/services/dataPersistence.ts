// Enhanced data persistence service with cloud storage support

import { cloudStorage, type CloudUserData } from '../config/cloudStorage';

export interface UserProgress {
  id: string;
  userId: string;
  testId: string;
  score: number;
  category: string;
  date: string;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  language: 'en' | 'nl';
  isPremium: boolean;
  createdAt: string;
  lastActive: string;
  totalTestsCompleted: number;
  averageScore: number;
}

export interface UserSettings {
  userId: string;
  language: 'en' | 'nl';
  voiceEnabled: boolean;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
}

class DataPersistenceService {
  private userId: string | null = null;
  private cloudData: CloudUserData | null = null;

  setUserId(userId: string | null) {
    this.userId = userId;
    if (userId) {
      this.loadCloudData();
    }
  }

  getUserId(): string | null {
    return this.userId;
  }

  // Load user data from cloud storage
  private async loadCloudData(): Promise<void> {
    if (!this.userId) return;

    try {
      this.cloudData = await cloudStorage.loadUserData(this.userId);
    } catch (error) {
      console.error('DataPersistence: Error loading cloud data:', error);
    }
  }

  // Save data to cloud storage
  private async saveCloudData(): Promise<void> {
    if (!this.userId || !this.cloudData) return;

    try {
      await cloudStorage.saveUserData(this.cloudData);
    } catch (error) {
      console.error('DataPersistence: Error saving cloud data:', error);
    }
  }

  // Save test result
  async saveTestResult(result: Omit<UserProgress, 'id' | 'userId'>): Promise<string> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    const resultId = 'result_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const fullResult: UserProgress = {
      ...result,
      id: resultId,
      userId: this.userId
    };

    // Store locally
    const existingResults = this.getLocalTestResults();
    existingResults.push(fullResult);
    localStorage.setItem(`testResults_${this.userId}`, JSON.stringify(existingResults));

    // Update cloud data
    if (!this.cloudData) {
      this.cloudData = {
        userId: this.userId,
        profile: null,
        settings: null,
        progress: [],
        lastSync: new Date().toISOString()
      };
    }
    this.cloudData.progress = existingResults;
    this.cloudData.lastSync = new Date().toISOString();

    // Save to cloud
    await this.saveCloudData();
    
    return resultId;
  }

  // Get all test results for a user
  async getUserTestResults(): Promise<UserProgress[]> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    return this.getLocalTestResults();
  }

  // Get test results by category
  async getTestResultsByCategory(category: string): Promise<UserProgress[]> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    const allResults = this.getLocalTestResults();
    return allResults.filter(result => result.category === category);
  }

  // Save user profile
  async saveUserProfile(profile: Omit<UserProfile, 'id'>): Promise<void> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    const fullProfile: UserProfile = {
      ...profile,
      id: this.userId
    };

    // Store locally
    localStorage.setItem(`userProfile_${this.userId}`, JSON.stringify(fullProfile));

    // Update cloud data
    if (!this.cloudData) {
      this.cloudData = {
        userId: this.userId,
        profile: null,
        settings: null,
        progress: [],
        lastSync: new Date().toISOString()
      };
    }
    this.cloudData.profile = fullProfile;
    this.cloudData.lastSync = new Date().toISOString();

    // Save to cloud
    await this.saveCloudData();
  }

  // Get user profile
  async getUserProfile(): Promise<UserProfile | null> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    const stored = localStorage.getItem(`userProfile_${this.userId}`);
    return stored ? JSON.parse(stored) : null;
  }

  // Save user settings
  async saveUserSettings(settings: Omit<UserSettings, 'userId'>): Promise<void> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    const fullSettings: UserSettings = {
      ...settings,
      userId: this.userId
    };

    // Store locally
    localStorage.setItem(`userSettings_${this.userId}`, JSON.stringify(fullSettings));

    // Update cloud data
    if (!this.cloudData) {
      this.cloudData = {
        userId: this.userId,
        profile: null,
        settings: null,
        progress: [],
        lastSync: new Date().toISOString()
      };
    }
    this.cloudData.settings = fullSettings;
    this.cloudData.lastSync = new Date().toISOString();

    // Save to cloud
    await this.saveCloudData();
  }

  // Get user settings
  async getUserSettings(): Promise<UserSettings | null> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    const stored = localStorage.getItem(`userSettings_${this.userId}`);
    return stored ? JSON.parse(stored) : null;
  }

  // Update user statistics
  private async updateUserStats(): Promise<void> {
    // This would update the user profile with new stats
    // For now, just log that it's working
  }

  // Mark test as completed (for progress tracking)
  async markTestCompleted(testId: string): Promise<void> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    const completedTests = this.getLocalCompletedTests();
    if (!completedTests.includes(testId)) {
      completedTests.push(testId);
      localStorage.setItem(`completedTests_${this.userId}`, JSON.stringify(completedTests));
    }
  }

  // Get completed tests
  async getCompletedTests(): Promise<string[]> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    return this.getLocalCompletedTests();
  }

  // Real-time listener for user progress (simplified)
  subscribeToUserProgress(callback: (results: UserProgress[]) => void): () => void {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    // For now, just call the callback with current results
    const results = this.getLocalTestResults();
    callback(results);
    
    // Return empty unsubscribe function
    return () => {};
  }

  // Sync local data to cloud (for offline support)
  async syncLocalData(): Promise<void> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    
    // Load all local data
    const profile = await this.getUserProfile();
    const settings = await this.getUserSettings();
    const progress = await this.getUserTestResults();

    // Create cloud data object
    this.cloudData = {
      userId: this.userId,
      profile,
      settings,
      progress,
      lastSync: new Date().toISOString()
    };

    // Save to cloud
    await this.saveCloudData();
  }

  // Delete user data (for GDPR compliance)
  async deleteUserData(): Promise<void> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    localStorage.removeItem(`testResults_${this.userId}`);
    localStorage.removeItem(`userProfile_${this.userId}`);
    localStorage.removeItem(`userSettings_${this.userId}`);
    localStorage.removeItem(`completedTests_${this.userId}`);
  }

  // Helper methods for local storage
  private getLocalTestResults(): UserProgress[] {
    if (!this.userId) return [];
    const stored = localStorage.getItem(`testResults_${this.userId}`);
    return stored ? JSON.parse(stored) : [];
  }

  private getLocalCompletedTests(): string[] {
    if (!this.userId) return [];
    const stored = localStorage.getItem(`completedTests_${this.userId}`);
    return stored ? JSON.parse(stored) : [];
  }
}

// Export singleton instance
export const dataPersistence = new DataPersistenceService(); 