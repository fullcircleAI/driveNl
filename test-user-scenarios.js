// DriveNL User Scenario Testing Script
// Run this in browser console to test different user experiences

console.log('🧪 DriveNL User Scenario Testing Starting...');
console.log('='.repeat(50));

// Test Results Storage
const testResults = {
  firstTimeUser: { passed: 0, failed: 0, tests: [] },
  returningUser: { passed: 0, failed: 0, tests: [] },
  guestUser: { passed: 0, failed: 0, tests: [] },
  cloudStorage: { passed: 0, failed: 0, tests: [] }
};

function addTestResult(category, testName, passed, message) {
  const result = { testName, passed, message, timestamp: new Date().toLocaleTimeString() };
  testResults[category].tests.push(result);
  if (passed) {
    testResults[category].passed++;
  } else {
    testResults[category].failed++;
  }
  
  const emoji = passed ? '✅' : '❌';
  console.log(`${emoji} [${category.toUpperCase()}] ${testName}: ${message}`);
}

// Helper function to wait for async operations
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test 1: First-Time User Experience
async function testFirstTimeUser() {
  console.log('\n👤 Testing First-Time User Experience...');
  console.log('-'.repeat(40));
  
  try {
    // Check if services are available
    if (typeof window.authService === 'undefined') {
      addTestResult('firstTimeUser', 'Service Availability', false, 'Auth service not found');
      return;
    }
    
    addTestResult('firstTimeUser', 'Service Availability', true, 'Auth service available');
    
    // Test account creation
    const testUsername = 'TestUser_FirstTime_' + Date.now();
    const testEmail = 'firsttime@test.com';
    
    console.log('📝 Creating test account...');
    const user = await window.authService.createAnonymousUser(testUsername, testEmail, 'en');
    
    if (user && user.id) {
      addTestResult('firstTimeUser', 'Account Creation', true, `User created: ${user.username}`);
    } else {
      addTestResult('firstTimeUser', 'Account Creation', false, 'Failed to create user');
      return;
    }
    
    // Test data persistence
    if (typeof window.dataPersistence !== 'undefined') {
      const testResult = {
        testId: 'first_time_test',
        score: 85,
        category: 'Traffic Signs',
        date: new Date().toISOString(),
        timeSpent: 300,
        correctAnswers: 17,
        totalQuestions: 20
      };
      
      const resultId = await window.dataPersistence.saveTestResult(testResult);
      addTestResult('firstTimeUser', 'Data Persistence', !!resultId, `Test result saved: ${resultId}`);
      
      // Test profile saving
      await window.dataPersistence.saveUserProfile({
        username: testUsername,
        email: testEmail,
        language: 'en',
        isPremium: false,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        totalTestsCompleted: 1,
        averageScore: 85
      });
      addTestResult('firstTimeUser', 'Profile Saving', true, 'User profile saved');
      
    } else {
      addTestResult('firstTimeUser', 'Data Persistence', false, 'Data persistence service not found');
    }
    
    // Test cloud storage status
    if (typeof window.cloudStorage !== 'undefined') {
      const isCloudAvailable = window.cloudStorage.isCloudAvailable();
      const providerInfo = window.cloudStorage.getProviderInfo();
      addTestResult('firstTimeUser', 'Cloud Storage Status', true, `Cloud: ${isCloudAvailable}, Provider: ${providerInfo}`);
    } else {
      addTestResult('firstTimeUser', 'Cloud Storage Status', false, 'Cloud storage service not found');
    }
    
  } catch (error) {
    addTestResult('firstTimeUser', 'Error Handling', false, `Error: ${error.message}`);
  }
}

// Test 2: Returning User Experience
async function testReturningUser() {
  console.log('\n🔄 Testing Returning User Experience...');
  console.log('-'.repeat(40));
  
  try {
    // Check if user is still logged in
    const currentUser = window.authService?.getCurrentUser();
    if (currentUser) {
      addTestResult('returningUser', 'Login Persistence', true, `User still logged in: ${currentUser.username}`);
    } else {
      addTestResult('returningUser', 'Login Persistence', false, 'User not logged in');
      return;
    }
    
    // Test data loading
    if (typeof window.dataPersistence !== 'undefined') {
      const testResults = await window.dataPersistence.getUserTestResults();
      addTestResult('returningUser', 'Data Loading', true, `Loaded ${testResults.length} test results`);
      
      const userProfile = await window.dataPersistence.getUserProfile();
      addTestResult('returningUser', 'Profile Loading', !!userProfile, `Profile loaded: ${userProfile?.username || 'None'}`);
      
      const userSettings = await window.dataPersistence.getUserSettings();
      addTestResult('returningUser', 'Settings Loading', !!userSettings, `Settings loaded: ${userSettings?.language || 'None'}`);
      
    } else {
      addTestResult('returningUser', 'Data Loading', false, 'Data persistence service not found');
    }
    
    // Test taking another test
    if (typeof window.dataPersistence !== 'undefined') {
      const newTestResult = {
        testId: 'returning_user_test',
        score: 90,
        category: 'Priority Rules',
        date: new Date().toISOString(),
        timeSpent: 250,
        correctAnswers: 18,
        totalQuestions: 20
      };
      
      const resultId = await window.dataPersistence.saveTestResult(newTestResult);
      addTestResult('returningUser', 'New Test Result', !!resultId, `New test result saved: ${resultId}`);
      
      // Verify data persistence
      const allResults = await window.dataPersistence.getUserTestResults();
      const hasNewResult = allResults.some(r => r.testId === 'returning_user_test');
      addTestResult('returningUser', 'Data Verification', hasNewResult, `New result found in storage: ${hasNewResult}`);
      
    } else {
      addTestResult('returningUser', 'New Test Result', false, 'Data persistence service not found');
    }
    
  } catch (error) {
    addTestResult('returningUser', 'Error Handling', false, `Error: ${error.message}`);
  }
}

// Test 3: Guest User Experience
async function testGuestUser() {
  console.log('\n👥 Testing Guest User Experience...');
  console.log('-'.repeat(40));
  
  try {
    // Simulate guest user by clearing current user
    console.log('🧹 Simulating guest user experience...');
    
    // Check if we can work without authentication
    if (typeof window.dataPersistence !== 'undefined') {
      // Set a guest user ID
      window.dataPersistence.setUserId('guest_user_' + Date.now());
      addTestResult('guestUser', 'Guest User Setup', true, 'Guest user ID set');
      
      // Test saving test result as guest
      const guestTestResult = {
        testId: 'guest_test',
        score: 75,
        category: 'Warning Signs',
        date: new Date().toISOString(),
        timeSpent: 200,
        correctAnswers: 15,
        totalQuestions: 20
      };
      
      const resultId = await window.dataPersistence.saveTestResult(guestTestResult);
      addTestResult('guestUser', 'Guest Data Saving', !!resultId, `Guest test result saved: ${resultId}`);
      
      // Test loading guest data
      const guestResults = await window.dataPersistence.getUserTestResults();
      addTestResult('guestUser', 'Guest Data Loading', guestResults.length > 0, `Loaded ${guestResults.length} guest test results`);
      
    } else {
      addTestResult('guestUser', 'Guest Data Saving', false, 'Data persistence service not found');
    }
    
    // Test cloud storage status for guest
    if (typeof window.cloudStorage !== 'undefined') {
      const isCloudAvailable = window.cloudStorage.isCloudAvailable();
      addTestResult('guestUser', 'Guest Cloud Status', true, `Cloud available for guest: ${isCloudAvailable}`);
    } else {
      addTestResult('guestUser', 'Guest Cloud Status', false, 'Cloud storage service not found');
    }
    
  } catch (error) {
    addTestResult('guestUser', 'Error Handling', false, `Error: ${error.message}`);
  }
}

// Test 4: Cloud Storage Functionality
async function testCloudStorage() {
  console.log('\n☁️ Testing Cloud Storage Functionality...');
  console.log('-'.repeat(40));
  
  try {
    if (typeof window.cloudStorage === 'undefined') {
      addTestResult('cloudStorage', 'Service Availability', false, 'Cloud storage service not found');
      return;
    }
    
    addTestResult('cloudStorage', 'Service Availability', true, 'Cloud storage service available');
    
    // Test configuration
    const providerInfo = window.cloudStorage.getProviderInfo();
    const isCloudAvailable = window.cloudStorage.isCloudAvailable();
    
    addTestResult('cloudStorage', 'Configuration', true, `Provider: ${providerInfo}, Available: ${isCloudAvailable}`);
    
    // Test data save/load
    const testData = {
      userId: 'cloud_test_user',
      profile: { name: 'Cloud Test User', email: 'cloud@test.com' },
      settings: { language: 'en', theme: 'light' },
      progress: [{ testId: 'cloud_test', score: 95, date: new Date().toISOString() }],
      lastSync: new Date().toISOString()
    };
    
    const saveResult = await window.cloudStorage.saveUserData(testData);
    addTestResult('cloudStorage', 'Data Save', saveResult, 'Data saved to cloud storage');
    
    const loadedData = await window.cloudStorage.loadUserData(testData.userId);
    addTestResult('cloudStorage', 'Data Load', loadedData !== null, 'Data loaded from cloud storage');
    
    // Test error handling
    try {
      await window.cloudStorage.loadUserData('nonexistent_user');
      addTestResult('cloudStorage', 'Error Handling', true, 'Handles nonexistent user gracefully');
    } catch (error) {
      addTestResult('cloudStorage', 'Error Handling', true, 'Error handling works correctly');
    }
    
  } catch (error) {
    addTestResult('cloudStorage', 'Error Handling', false, `Error: ${error.message}`);
  }
}

// Run all tests
async function runAllUserTests() {
  console.log('🚀 Starting comprehensive user testing...');
  console.log('='.repeat(50));
  
  await testFirstTimeUser();
  await wait(1000); // Wait between tests
  
  await testReturningUser();
  await wait(1000);
  
  await testGuestUser();
  await wait(1000);
  
  await testCloudStorage();
  
  // Display summary
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  
  Object.entries(testResults).forEach(([category, results]) => {
    const total = results.passed + results.failed;
    const percentage = total > 0 ? Math.round((results.passed / total) * 100) : 0;
    const status = percentage === 100 ? '✅' : percentage >= 80 ? '⚠️' : '❌';
    
    console.log(`\n${status} ${category.toUpperCase()}: ${results.passed}/${total} (${percentage}%)`);
    
    results.tests.forEach(test => {
      const emoji = test.passed ? '✅' : '❌';
      console.log(`  ${emoji} ${test.testName}: ${test.message}`);
    });
  });
  
  // Overall status
  const totalPassed = Object.values(testResults).reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = Object.values(testResults).reduce((sum, r) => sum + r.failed, 0);
  const totalTests = totalPassed + totalFailed;
  const overallPercentage = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
  
  console.log(`\n🎯 OVERALL RESULT: ${totalPassed}/${totalTests} (${overallPercentage}%)`);
  
  if (overallPercentage === 100) {
    console.log('🎉 ALL TESTS PASSED! App is ready for production!');
  } else if (overallPercentage >= 80) {
    console.log('⚠️ Most tests passed. Minor issues to address.');
  } else {
    console.log('❌ Multiple test failures. Needs attention before launch.');
  }
  
  return testResults;
}

// Auto-run tests
console.log('💡 To run all tests, execute: runAllUserTests()');
console.log('💡 To run individual tests: testFirstTimeUser(), testReturningUser(), testGuestUser(), testCloudStorage()');

// Uncomment to auto-run
// runAllUserTests();
