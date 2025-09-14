// Cloud Storage Test Utility
// This file can be used to test cloud storage functionality

import { cloudStorage } from '../config/cloudStorage';

export const testCloudStorage = async () => {
  console.log('🧪 Testing Cloud Storage...');
  
  const testData = {
    userId: 'test_user_123',
    profile: { name: 'Test User', email: 'test@example.com' },
    settings: { language: 'en', theme: 'light' },
    progress: [
      { testId: 'test1', score: 85, date: new Date().toISOString() }
    ],
    lastSync: new Date().toISOString()
  };

  try {
    // Test saving data
    console.log('📤 Saving test data...');
    const saveResult = await cloudStorage.saveUserData(testData);
    console.log('✅ Save result:', saveResult);

    // Test loading data
    console.log('📥 Loading test data...');
    const loadedData = await cloudStorage.loadUserData('test_user_123');
    console.log('✅ Loaded data:', loadedData);

    // Test provider info
    console.log('ℹ️ Provider info:', cloudStorage.getProviderInfo());
    console.log('🌐 Cloud available:', cloudStorage.isCloudAvailable());

    return {
      success: true,
      saveResult,
      loadedData,
      providerInfo: cloudStorage.getProviderInfo(),
      cloudAvailable: cloudStorage.isCloudAvailable()
    };
  } catch (error) {
    console.error('❌ Cloud storage test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Auto-run test in development
if (import.meta.env.DEV) {
  // Uncomment the line below to auto-run the test
  // testCloudStorage();
}
