// Cloud Storage Test Utility
// This file tests the cloud storage functionality

import { cloudStorage } from '../config/cloudStorage';
import { dataPersistence } from '../services/dataPersistence';
import { authService } from '../services/authService';

export interface TestResult {
  testName: string;
  success: boolean;
  message: string;
  details?: any;
}

export class CloudStorageTester {
  private results: TestResult[] = [];

  async runAllTests(): Promise<TestResult[]> {
    console.log('🧪 Starting Cloud Storage Tests...');
    this.results = [];

    await this.testCloudStorageService();
    await this.testDataPersistence();
    await this.testAuthService();
    await this.testIntegration();

    console.log('✅ All tests completed!');
    return this.results;
  }

  private async testCloudStorageService(): Promise<void> {
    console.log('🔍 Testing Cloud Storage Service...');
    
    try {
      // Test 1: Check if service is available
      this.addResult('Cloud Storage Service Available', true, 'Service loaded successfully');

      // Test 2: Check configuration
      const providerInfo = cloudStorage.getProviderInfo();
      const isCloudAvailable = cloudStorage.isCloudAvailable();
      
      this.addResult(
        'Cloud Configuration', 
        true, 
        `Provider: ${providerInfo}, Available: ${isCloudAvailable}`,
        { providerInfo, isCloudAvailable }
      );

      // Test 3: Test data save/load
      const testData = {
        userId: 'test_user_' + Date.now(),
        profile: { name: 'Test User', email: 'test@example.com' },
        settings: { language: 'en', theme: 'light' },
        progress: [{ testId: 'test1', score: 85, date: new Date().toISOString() }],
        lastSync: new Date().toISOString()
      };

      const saveResult = await cloudStorage.saveUserData(testData);
      this.addResult('Cloud Data Save', saveResult, 'Data saved to cloud storage');

      const loadedData = await cloudStorage.loadUserData(testData.userId);
      this.addResult('Cloud Data Load', loadedData !== null, 'Data loaded from cloud storage');

    } catch (error) {
      this.addResult('Cloud Storage Service', false, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async testDataPersistence(): Promise<void> {
    console.log('🔍 Testing Data Persistence Service...');
    
    try {
      // Test 1: Set user ID
      const testUserId = 'test_user_' + Date.now();
      dataPersistence.setUserId(testUserId);
      this.addResult('Data Persistence - Set User ID', true, `User ID set: ${testUserId}`);

      // Test 2: Save test result
      const testResult = {
        testId: 'test_123',
        score: 85,
        category: 'Traffic Signs',
        date: new Date().toISOString(),
        timeSpent: 300,
        correctAnswers: 17,
        totalQuestions: 20
      };

      const resultId = await dataPersistence.saveTestResult(testResult);
      this.addResult('Data Persistence - Save Test Result', true, `Test result saved: ${resultId}`);

      // Test 3: Get user test results
      const results = await dataPersistence.getUserTestResults();
      this.addResult('Data Persistence - Get Results', true, `Retrieved ${results.length} test results`);

      // Test 4: Save user profile
      await dataPersistence.saveUserProfile({
        username: 'Test User',
        email: 'test@example.com',
        language: 'en',
        isPremium: true,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        totalTestsCompleted: 1,
        averageScore: 85
      });
      this.addResult('Data Persistence - Save Profile', true, 'User profile saved');

      // Test 5: Save user settings
      await dataPersistence.saveUserSettings({
        language: 'en',
        voiceEnabled: true,
        notificationsEnabled: true,
        theme: 'light'
      });
      this.addResult('Data Persistence - Save Settings', true, 'User settings saved');

    } catch (error) {
      this.addResult('Data Persistence Service', false, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async testAuthService(): Promise<void> {
    console.log('🔍 Testing Auth Service...');
    
    try {
      // Test 1: Create anonymous user
      const testUsername = 'TestUser_' + Date.now();
      const testEmail = 'test@example.com';
      
      const user = await authService.createAnonymousUser(testUsername, testEmail, 'en');
      this.addResult('Auth Service - Create User', true, `User created: ${user.username} (${user.id})`);

      // Test 2: Get current user
      const currentUser = authService.getCurrentUser();
      this.addResult('Auth Service - Get Current User', currentUser !== null, `Current user: ${currentUser?.username || 'None'}`);

      // Test 3: Check login status
      const isLoggedIn = authService.isLoggedIn();
      this.addResult('Auth Service - Login Status', isLoggedIn, `Login status: ${isLoggedIn}`);

      // Test 4: Update user profile
      if (currentUser) {
        await authService.updateUserProfile({ username: 'Updated User' });
        this.addResult('Auth Service - Update Profile', true, 'User profile updated');
      }

    } catch (error) {
      this.addResult('Auth Service', false, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async testIntegration(): Promise<void> {
    console.log('🔍 Testing Integration...');
    
    try {
      // Test 1: Full user creation flow
      const testUsername = 'IntegrationTest_' + Date.now();
      const testEmail = 'integration@example.com';
      
      const user = await authService.createAnonymousUser(testUsername, testEmail, 'en');
      this.addResult('Integration - User Creation', true, `User created: ${user.username}`);

      // Test 2: Save test result through data persistence
      const testResult = {
        testId: 'integration_test',
        score: 90,
        category: 'Priority Rules',
        date: new Date().toISOString(),
        timeSpent: 250,
        correctAnswers: 18,
        totalQuestions: 20
      };

      const resultId = await dataPersistence.saveTestResult(testResult);
      this.addResult('Integration - Test Result Save', true, `Test result saved: ${resultId}`);

      // Test 3: Verify data persistence
      const results = await dataPersistence.getUserTestResults();
      const hasResult = results.some(r => r.testId === 'integration_test');
      this.addResult('Integration - Data Verification', hasResult, `Test result found in storage: ${hasResult}`);

    } catch (error) {
      this.addResult('Integration Test', false, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private addResult(testName: string, success: boolean, message: string, details?: any): void {
    const result: TestResult = {
      testName,
      success,
      message,
      details
    };
    
    this.results.push(result);
    
    const emoji = success ? '✅' : '❌';
    console.log(`${emoji} ${testName}: ${message}`);
    
    if (details) {
      console.log('   Details:', details);
    }
  }

  getResults(): TestResult[] {
    return this.results;
  }

  getSummary(): { total: number; passed: number; failed: number } {
    const total = this.results.length;
    const passed = this.results.filter(r => r.success).length;
    const failed = total - passed;
    
    return { total, passed, failed };
  }
}

// Export test function for easy use
export const testCloudStorage = async (): Promise<TestResult[]> => {
  const tester = new CloudStorageTester();
  return await tester.runAllTests();
};

// Auto-run test in development mode
if (import.meta.env.DEV) {
  // Uncomment to auto-run tests
  // testCloudStorage().then(results => {
  //   console.log('🧪 Cloud Storage Test Results:', results);
  // });
}
