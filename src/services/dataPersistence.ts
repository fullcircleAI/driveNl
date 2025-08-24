// Simple local storage data persistence service

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

  setUserId(userId: string) {
    this.userId = userId;
  }

  getUserId(): string | null {
    return this.userId;
  }

  // Save test result
  async saveTestResult(result: Omit<UserProgress, 'id' | 'userId'>): Promise<string> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    console.log('DataPersistence: Saving test result locally');
    const resultId = 'result_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const fullResult: UserProgress = {
      ...result,
      id: resultId,
      userId: this.userId
    };

    // Store in localStorage
    const existingResults = this.getLocalTestResults();
    existingResults.push(fullResult);
    localStorage.setItem(`testResults_${this.userId}`, JSON.stringify(existingResults));
    
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

    console.log('DataPersistence: Saving user profile locally');
    const fullProfile: UserProfile = {
      ...profile,
      id: this.userId
    };

    localStorage.setItem(`userProfile_${this.userId}`, JSON.stringify(fullProfile));
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

    console.log('DataPersistence: Saving user settings locally');
    const fullSettings: UserSettings = {
      ...settings,
      userId: this.userId
    };

    localStorage.setItem(`userSettings_${this.userId}`, JSON.stringify(fullSettings));
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
    console.log('DataPersistence: Updating user stats locally');
    // This would update the user profile with new stats
    // For now, just log that it's working
  }

  // Mark test as completed (for progress tracking)
  async markTestCompleted(testId: string): Promise<void> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    console.log('DataPersistence: Marking test as completed locally');
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

    console.log('DataPersistence: Setting up local progress subscription');
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

    console.log('DataPersistence: Local data sync (no-op for now)');
    // This would sync local data to cloud when cloud storage is re-enabled
  }

  // Delete user data (for GDPR compliance)
  async deleteUserData(): Promise<void> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    console.log('DataPersistence: Deleting user data locally');
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