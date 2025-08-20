import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';

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

    try {
      const docRef = await addDoc(collection(db, 'users', this.userId, 'practiceResults'), {
        ...result,
        userId: this.userId,
        date: new Date().toISOString()
      });

      // Update user profile stats
      await this.updateUserStats();
      
      return docRef.id;
    } catch (error) {
      console.error('Error saving test result:', error);
      throw error;
    }
  }

  // Get all test results for a user
  async getUserTestResults(): Promise<UserProgress[]> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      const q = query(
        collection(db, 'users', this.userId, 'practiceResults'),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProgress[];
    } catch (error) {
      console.error('Error getting test results:', error);
      throw error;
    }
  }

  // Get test results by category
  async getTestResultsByCategory(category: string): Promise<UserProgress[]> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      const q = query(
        collection(db, 'users', this.userId, 'practiceResults'),
        where('category', '==', category),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProgress[];
    } catch (error) {
      console.error('Error getting test results by category:', error);
      throw error;
    }
  }

  // Save user profile
  async saveUserProfile(profile: Omit<UserProfile, 'id'>): Promise<void> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      await setDoc(doc(db, 'users', this.userId), {
        ...profile,
        id: this.userId,
        lastActive: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(): Promise<UserProfile | null> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      const docRef = doc(db, 'users', this.userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Save user settings
  async saveUserSettings(settings: Omit<UserSettings, 'userId'>): Promise<void> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      await setDoc(doc(db, 'users', this.userId, 'settings', 'preferences'), {
        ...settings,
        userId: this.userId
      });
    } catch (error) {
      console.error('Error saving user settings:', error);
      throw error;
    }
  }

  // Get user settings
  async getUserSettings(): Promise<UserSettings | null> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      const docRef = doc(db, 'users', this.userId, 'settings', 'preferences');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserSettings;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user settings:', error);
      throw error;
    }
  }

  // Update user statistics
  private async updateUserStats(): Promise<void> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      const results = await this.getUserTestResults();
      
      const totalTests = results.length;
      const averageScore = totalTests > 0 
        ? results.reduce((sum, result) => sum + result.score, 0) / totalTests 
        : 0;

      await updateDoc(doc(db, 'users', this.userId), {
        totalTestsCompleted: totalTests,
        averageScore: Math.round(averageScore),
        lastActive: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }

  // Mark test as completed (for progress tracking)
  async markTestCompleted(testId: string): Promise<void> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      await setDoc(doc(db, 'users', this.userId, 'completedTests', testId), {
        testId,
        completedAt: new Date().toISOString(),
        userId: this.userId
      });
    } catch (error) {
      console.error('Error marking test as completed:', error);
      throw error;
    }
  }

  // Get completed tests
  async getCompletedTests(): Promise<string[]> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'users', this.userId, 'completedTests'));
      return querySnapshot.docs.map(doc => doc.data().testId);
    } catch (error) {
      console.error('Error getting completed tests:', error);
      throw error;
    }
  }

  // Real-time listener for user progress
  subscribeToUserProgress(callback: (results: UserProgress[]) => void): () => void {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    const q = query(
      collection(db, 'users', this.userId, 'practiceResults'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProgress[];
      
      callback(results);
    });

    return unsubscribe;
  }

  // Sync local data to cloud (for offline support)
  async syncLocalData(): Promise<void> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      // Get local data
      const localResults = localStorage.getItem('practiceResults');
      const localCompletedTests = localStorage.getItem('completedTests');
      
      if (localResults) {
        const results = JSON.parse(localResults);
        for (const result of results) {
          await this.saveTestResult(result);
        }
        localStorage.removeItem('practiceResults');
      }

      if (localCompletedTests) {
        const completedTests = JSON.parse(localCompletedTests);
        for (const testId of completedTests) {
          await this.markTestCompleted(testId);
        }
        localStorage.removeItem('completedTests');
      }
    } catch (error) {
      console.error('Error syncing local data:', error);
    }
  }

  // Delete user data (for GDPR compliance)
  async deleteUserData(): Promise<void> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      // Delete practice results
      const resultsSnapshot = await getDocs(collection(db, 'users', this.userId, 'practiceResults'));
      for (const doc of resultsSnapshot.docs) {
        await deleteDoc(doc.ref);
      }

      // Delete completed tests
      const completedSnapshot = await getDocs(collection(db, 'users', this.userId, 'completedTests'));
      for (const doc of completedSnapshot.docs) {
        await deleteDoc(doc.ref);
      }

      // Delete settings
      const settingsRef = doc(db, 'users', this.userId, 'settings', 'preferences');
      await deleteDoc(settingsRef);

      // Delete user profile
      const userRef = doc(db, 'users', this.userId);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const dataPersistence = new DataPersistenceService(); 