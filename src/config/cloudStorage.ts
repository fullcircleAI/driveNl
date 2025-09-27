// Cloud Storage Configuration and Service
// Provides multiple cloud storage options for user data

export interface CloudStorageConfig {
  provider: 'jsonbin' | 'firebase' | 'local';
  apiKey?: string;
  binId?: string;
  projectId?: string;
}

export interface CloudUserData {
  userId: string;
  profile: any;
  settings: any;
  progress: any[];
  lastSync: string;
}

class CloudStorageService {
  private config: CloudStorageConfig;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.config = this.loadConfig();
    this.setupOnlineListener();
  }

  private loadConfig(): CloudStorageConfig {
    // Try to load from environment variables
    const jsonbinApiKey = import.meta.env.VITE_JSONBIN_API_KEY;
    const jsonbinBinId = import.meta.env.VITE_JSONBIN_BIN_ID;
    const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;

    if (jsonbinApiKey && jsonbinBinId) {
      return {
        provider: 'jsonbin',
        apiKey: jsonbinApiKey,
        binId: jsonbinBinId
      };
    } else if (firebaseApiKey) {
      return {
        provider: 'firebase',
        apiKey: firebaseApiKey,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
      };
    } else {
      return { provider: 'local' };
    }
  }

  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('CloudStorage: Gone offline, using local storage');
    });
  }

  // Save user data to cloud
  async saveUserData(userData: CloudUserData): Promise<boolean> {
    if (!this.isOnline || this.config.provider === 'local') {
      console.log('CloudStorage: Saving to local storage only');
      return this.saveToLocal(userData);
    }

    try {
      switch (this.config.provider) {
        case 'jsonbin':
          return await this.saveToJsonBin(userData);
        case 'firebase':
          return await this.saveToFirebase(userData);
        default:
          return this.saveToLocal(userData);
      }
    } catch (error) {
      console.error('CloudStorage: Error saving to cloud:', error);
      // Fallback to local storage
      return this.saveToLocal(userData);
    }
  }

  // Load user data from cloud
  async loadUserData(userId: string): Promise<CloudUserData | null> {
    if (!this.isOnline || this.config.provider === 'local') {
      console.log('CloudStorage: Loading from local storage only');
      return this.loadFromLocal(userId);
    }

    try {
      switch (this.config.provider) {
        case 'jsonbin':
          return await this.loadFromJsonBin(userId);
        case 'firebase':
          return await this.loadFromFirebase(userId);
        default:
          return this.loadFromLocal(userId);
      }
    } catch (error) {
      console.error('CloudStorage: Error loading from cloud:', error);
      // Fallback to local storage
      return this.loadFromLocal(userId);
    }
  }

  // JSONBin.io implementation (Free tier: 10,000 requests/month)
  private async saveToJsonBin(userData: CloudUserData): Promise<boolean> {
    if (!this.config.apiKey || !this.config.binId) {
      throw new Error('JSONBin configuration missing');
    }

    const response = await fetch(`https://api.jsonbin.io/v3/b/${this.config.binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': this.config.apiKey,
        'X-Bin-Name': `drivenl-user-${userData.userId}`
      },
      body: JSON.stringify({
        ...userData,
        lastSync: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`JSONBin save failed: ${response.statusText}`);
    }

    console.log('CloudStorage: Data saved to JSONBin successfully');
    return true;
  }

  private async loadFromJsonBin(userId: string): Promise<CloudUserData | null> {
    if (!this.config.apiKey || !this.config.binId) {
      throw new Error('JSONBin configuration missing');
    }

    const response = await fetch(`https://api.jsonbin.io/v3/b/${this.config.binId}`, {
      headers: {
        'X-Master-Key': this.config.apiKey
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No data found
      }
      throw new Error(`JSONBin load failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('CloudStorage: Data loaded from JSONBin successfully');
    return data.record;
  }

  // Firebase implementation (placeholder - would need Firebase SDK)
  private async saveToFirebase(userData: CloudUserData): Promise<boolean> {
    // This would require Firebase SDK setup
    console.log('CloudStorage: Firebase save not implemented yet');
    return this.saveToLocal(userData);
  }

  private async loadFromFirebase(userId: string): Promise<CloudUserData | null> {
    // This would require Firebase SDK setup
    console.log('CloudStorage: Firebase load not implemented yet');
    return this.loadFromLocal(userId);
  }

  // Local storage implementation
  private saveToLocal(userData: CloudUserData): boolean {
    try {
      localStorage.setItem(`cloudData_${userData.userId}`, JSON.stringify(userData));
      console.log('CloudStorage: Data saved to local storage');
      return true;
    } catch (error) {
      console.error('CloudStorage: Error saving to local storage:', error);
      return false;
    }
  }

  private loadFromLocal(userId: string): CloudUserData | null {
    try {
      const data = localStorage.getItem(`cloudData_${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('CloudStorage: Error loading from local storage:', error);
      return null;
    }
  }

  // Sync pending data when back online
  private async syncPendingData(): Promise<void> {
    try {
      const pendingData = this.getPendingData();
      for (const data of pendingData) {
        await this.saveUserData(data);
        this.removePendingData(data.userId);
      }
    } catch (error) {
      console.error('CloudStorage: Error syncing pending data:', error);
    }
  }

  private getPendingData(): CloudUserData[] {
    const pending = localStorage.getItem('pendingCloudSync');
    return pending ? JSON.parse(pending) : [];
  }

  private removePendingData(userId: string): void {
    const pending = this.getPendingData();
    const filtered = pending.filter(data => data.userId !== userId);
    localStorage.setItem('pendingCloudSync', JSON.stringify(filtered));
  }

  // Check if cloud storage is available
  isCloudAvailable(): boolean {
    return this.isOnline && this.config.provider !== 'local';
  }

  // Get storage provider info
  getProviderInfo(): string {
    if (!this.isOnline) return 'Offline (Local Only)';
    return this.config.provider === 'local' ? 'Local Storage Only' : `Cloud (${this.config.provider})`;
  }
}

// Export singleton instance
export const cloudStorage = new CloudStorageService();
