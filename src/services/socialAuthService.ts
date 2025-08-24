// Social Authentication Service - CLOUD AUTH DISABLED
// This service provides mock social authentication for development

interface MockUser {
  displayName?: string;
  email?: string;
  uid: string;
}

interface MockAuthResult {
  user: MockUser;
}

class SocialAuthService {
  static async signInWithGoogle(): Promise<MockAuthResult> {
    // Mock implementation
    console.log('Mock Google sign in');
    return {
      user: {
        displayName: 'Mock Google User',
        email: 'mockuser@gmail.com',
        uid: 'google_' + Math.random().toString(36).substr(2, 9)
      }
    };
  }

  static async signInWithFacebook(): Promise<MockAuthResult> {
    // Mock implementation
    console.log('Mock Facebook sign in');
    return {
      user: {
        displayName: 'Mock Facebook User',
        email: 'mockuser@facebook.com',
        uid: 'facebook_' + Math.random().toString(36).substr(2, 9)
      }
    };
  }

  static async signInWithApple(): Promise<MockAuthResult> {
    // Mock implementation
    console.log('Mock Apple sign in');
    return {
      user: {
        displayName: 'Mock Apple User',
        email: 'mockuser@apple.com',
        uid: 'apple_' + Math.random().toString(36).substr(2, 9)
      }
    };
  }

  static async signOut(): Promise<void> {
    // Mock implementation
    console.log('Mock sign out');
  }

  static getCurrentUser(): MockUser | null {
    // Mock implementation
    return null;
  }
}

export default SocialAuthService;
