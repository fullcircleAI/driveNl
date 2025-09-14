// DriveNL Settings & Mock Exam Testing Script
// Run this in browser console to test settings and mock exam functionality in all languages

console.log('⚙️ DriveNL Settings & Mock Exam Testing Starting...');
console.log('='.repeat(60));

// Test Results Storage
const settingsMockExamResults = {
  settingsEnglish: { passed: 0, failed: 0, tests: [] },
  settingsDutch: { passed: 0, failed: 0, tests: [] },
  settingsArabic: { passed: 0, failed: 0, tests: [] },
  mockExamEnglish: { passed: 0, failed: 0, tests: [] },
  mockExamDutch: { passed: 0, failed: 0, tests: [] },
  mockExamArabic: { passed: 0, failed: 0, tests: [] },
  functionality: { passed: 0, failed: 0, tests: [] }
};

function addSettingsMockExamResult(category, testName, passed, message) {
  const result = { testName, passed, message, timestamp: new Date().toLocaleTimeString() };
  settingsMockExamResults[category].tests.push(result);
  if (passed) {
    settingsMockExamResults[category].passed++;
  } else {
    settingsMockExamResults[category].failed++;
  }
  
  const emoji = passed ? '✅' : '❌';
  console.log(`${emoji} [${category.toUpperCase()}] ${testName}: ${message}`);
}

// Helper function to wait for async operations
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test 1: Settings Tab - English
async function testSettingsEnglish() {
  console.log('\n🇬🇧 Testing Settings Tab - English...');
  console.log('-'.repeat(40));
  
  try {
    // Set language to English
    console.log('🔤 Setting language to English...');
    window.authStore.getState().setLanguage('en');
    await wait(1000);
    
    // Navigate to settings (simulate)
    console.log('⚙️ Testing Settings Tab Elements...');
    
    // Test Account Tab
    const accountTab = document.querySelector('[data-tab="account"]') || 
                      document.querySelector('.settings-tab[data-tab="account"]');
    if (accountTab) {
      addSettingsMockExamResult('settingsEnglish', 'Account Tab', true, 'Account tab found');
    } else {
      addSettingsMockExamResult('settingsEnglish', 'Account Tab', false, 'Account tab not found');
    }
    
    // Test Study Schedule Tab
    const studyTab = document.querySelector('[data-tab="study"]') || 
                     document.querySelector('.settings-tab[data-tab="study"]');
    if (studyTab) {
      addSettingsMockExamResult('settingsEnglish', 'Study Schedule Tab', true, 'Study schedule tab found');
    } else {
      addSettingsMockExamResult('settingsEnglish', 'Study Schedule Tab', false, 'Study schedule tab not found');
    }
    
    // Test Privacy Policy Tab
    const privacyTab = document.querySelector('[data-tab="privacy"]') || 
                       document.querySelector('.settings-tab[data-tab="privacy"]');
    if (privacyTab) {
      addSettingsMockExamResult('settingsEnglish', 'Privacy Policy Tab', true, 'Privacy policy tab found');
    } else {
      addSettingsMockExamResult('settingsEnglish', 'Privacy Policy Tab', false, 'Privacy policy tab not found');
    }
    
    // Test Terms & Conditions Tab
    const termsTab = document.querySelector('[data-tab="terms"]') || 
                     document.querySelector('.settings-tab[data-tab="terms"]');
    if (termsTab) {
      addSettingsMockExamResult('settingsEnglish', 'Terms & Conditions Tab', true, 'Terms & conditions tab found');
    } else {
      addSettingsMockExamResult('settingsEnglish', 'Terms & Conditions Tab', false, 'Terms & conditions tab not found');
    }
    
    // Test FAQ Tab
    const faqTab = document.querySelector('[data-tab="faq"]') || 
                   document.querySelector('.settings-tab[data-tab="faq"]');
    if (faqTab) {
      addSettingsMockExamResult('settingsEnglish', 'FAQ Tab', true, 'FAQ tab found');
    } else {
      addSettingsMockExamResult('settingsEnglish', 'FAQ Tab', false, 'FAQ tab not found');
    }
    
    // Test Support Tab
    const supportTab = document.querySelector('[data-tab="support"]') || 
                       document.querySelector('.settings-tab[data-tab="support"]');
    if (supportTab) {
      addSettingsMockExamResult('settingsEnglish', 'Support Tab', true, 'Support tab found');
    } else {
      addSettingsMockExamResult('settingsEnglish', 'Support Tab', false, 'Support tab not found');
    }
    
    // Test English text content
    const hasEnglishText = document.body.textContent.includes('Account') || 
                          document.body.textContent.includes('Settings') ||
                          document.body.textContent.includes('Profile');
    
    if (hasEnglishText) {
      addSettingsMockExamResult('settingsEnglish', 'English Text Content', true, 'English text content found');
    } else {
      addSettingsMockExamResult('settingsEnglish', 'English Text Content', false, 'English text content not found');
    }
    
  } catch (error) {
    addSettingsMockExamResult('settingsEnglish', 'Error Handling', false, `Error: ${error.message}`);
  }
}

// Test 2: Settings Tab - Dutch
async function testSettingsDutch() {
  console.log('\n🇳🇱 Testing Settings Tab - Dutch...');
  console.log('-'.repeat(40));
  
  try {
    // Set language to Dutch
    console.log('🔤 Setting language to Dutch...');
    window.authStore.getState().setLanguage('nl');
    await wait(1000);
    
    // Test Dutch text content
    const hasDutchText = document.body.textContent.includes('Account') || 
                        document.body.textContent.includes('Instellingen') ||
                        document.body.textContent.includes('Profiel');
    
    if (hasDutchText) {
      addSettingsMockExamResult('settingsDutch', 'Dutch Text Content', true, 'Dutch text content found');
    } else {
      addSettingsMockExamResult('settingsDutch', 'Dutch Text Content', false, 'Dutch text content not found');
    }
    
    // Test all tabs exist
    const tabs = ['account', 'study', 'privacy', 'terms', 'faq', 'support'];
    let tabsFound = 0;
    
    tabs.forEach(tab => {
      const tabElement = document.querySelector(`[data-tab="${tab}"]`) || 
                        document.querySelector(`.settings-tab[data-tab="${tab}"]`);
      if (tabElement) {
        tabsFound++;
      }
    });
    
    if (tabsFound === tabs.length) {
      addSettingsMockExamResult('settingsDutch', 'All Tabs Present', true, `All ${tabs.length} tabs found`);
    } else {
      addSettingsMockExamResult('settingsDutch', 'All Tabs Present', false, `Only ${tabsFound}/${tabs.length} tabs found`);
    }
    
  } catch (error) {
    addSettingsMockExamResult('settingsDutch', 'Error Handling', false, `Error: ${error.message}`);
  }
}

// Test 3: Settings Tab - Arabic
async function testSettingsArabic() {
  console.log('\n🇸🇦 Testing Settings Tab - Arabic...');
  console.log('-'.repeat(40));
  
  try {
    // Set language to Arabic
    console.log('🔤 Setting language to Arabic...');
    window.authStore.getState().setLanguage('ar');
    await wait(1000);
    
    // Test Arabic text content
    const hasArabicText = document.body.textContent.includes('الحساب') || 
                         document.body.textContent.includes('الإعدادات') ||
                         document.body.textContent.includes('الملف الشخصي');
    
    if (hasArabicText) {
      addSettingsMockExamResult('settingsArabic', 'Arabic Text Content', true, 'Arabic text content found');
    } else {
      addSettingsMockExamResult('settingsArabic', 'Arabic Text Content', false, 'Arabic text content not found');
    }
    
    // Test RTL layout
    const bodyDir = document.body.getAttribute('dir');
    const htmlDir = document.documentElement.getAttribute('dir');
    const hasRTL = bodyDir === 'rtl' || htmlDir === 'rtl';
    
    if (hasRTL) {
      addSettingsMockExamResult('settingsArabic', 'RTL Layout', true, 'RTL layout applied');
    } else {
      addSettingsMockExamResult('settingsArabic', 'RTL Layout', false, 'RTL layout not applied');
    }
    
    // Test all tabs exist
    const tabs = ['account', 'study', 'privacy', 'terms', 'faq', 'support'];
    let tabsFound = 0;
    
    tabs.forEach(tab => {
      const tabElement = document.querySelector(`[data-tab="${tab}"]`) || 
                        document.querySelector(`.settings-tab[data-tab="${tab}"]`);
      if (tabElement) {
        tabsFound++;
      }
    });
    
    if (tabsFound === tabs.length) {
      addSettingsMockExamResult('settingsArabic', 'All Tabs Present', true, `All ${tabs.length} tabs found`);
    } else {
      addSettingsMockExamResult('settingsArabic', 'All Tabs Present', false, `Only ${tabsFound}/${tabs.length} tabs found`);
    }
    
  } catch (error) {
    addSettingsMockExamResult('settingsArabic', 'Error Handling', false, `Error: ${error.message}`);
  }
}

// Test 4: Mock Exam - English
async function testMockExamEnglish() {
  console.log('\n🇬🇧 Testing Mock Exam - English...');
  console.log('-'.repeat(40));
  
  try {
    // Set language to English
    console.log('🔤 Setting language to English...');
    window.authStore.getState().setLanguage('en');
    await wait(1000);
    
    // Test Quiz Selection Page
    const quizSelection = document.querySelector('.quiz-selection') || 
                         document.querySelector('[data-testid="quiz-selection"]');
    if (quizSelection) {
      addSettingsMockExamResult('mockExamEnglish', 'Quiz Selection Page', true, 'Quiz selection page found');
    } else {
      addSettingsMockExamResult('mockExamEnglish', 'Quiz Selection Page', false, 'Quiz selection page not found');
    }
    
    // Test Mock Exam Interface
    const mockExam = document.querySelector('.mock-exam') || 
                     document.querySelector('[data-testid="mock-exam"]');
    if (mockExam) {
      addSettingsMockExamResult('mockExamEnglish', 'Mock Exam Interface', true, 'Mock exam interface found');
    } else {
      addSettingsMockExamResult('mockExamEnglish', 'Mock Exam Interface', false, 'Mock exam interface not found');
    }
    
    // Test English quiz text content
    const hasEnglishQuizText = document.body.textContent.includes('Quiz') || 
                              document.body.textContent.includes('Beginner') ||
                              document.body.textContent.includes('Advanced');
    
    if (hasEnglishQuizText) {
      addSettingsMockExamResult('mockExamEnglish', 'English Quiz Text', true, 'English quiz text content found');
    } else {
      addSettingsMockExamResult('mockExamEnglish', 'English Quiz Text', false, 'English quiz text content not found');
    }
    
  } catch (error) {
    addSettingsMockExamResult('mockExamEnglish', 'Error Handling', false, `Error: ${error.message}`);
  }
}

// Test 5: Mock Exam - Dutch
async function testMockExamDutch() {
  console.log('\n🇳🇱 Testing Mock Exam - Dutch...');
  console.log('-'.repeat(40));
  
  try {
    // Set language to Dutch
    console.log('🔤 Setting language to Dutch...');
    window.authStore.getState().setLanguage('nl');
    await wait(1000);
    
    // Test Dutch quiz text content
    const hasDutchQuizText = document.body.textContent.includes('Quiz') || 
                            document.body.textContent.includes('Beginners') ||
                            document.body.textContent.includes('Gevorderde');
    
    if (hasDutchQuizText) {
      addSettingsMockExamResult('mockExamDutch', 'Dutch Quiz Text', true, 'Dutch quiz text content found');
    } else {
      addSettingsMockExamResult('mockExamDutch', 'Dutch Quiz Text', false, 'Dutch quiz text content not found');
    }
    
    // Test quiz levels
    const quizLevels = ['beginner', 'intermediate', 'advanced'];
    let levelsFound = 0;
    
    quizLevels.forEach(level => {
      const levelElement = document.querySelector(`[data-level="${level}"]`) || 
                          document.querySelector(`.quiz-level[data-level="${level}"]`);
      if (levelElement) {
        levelsFound++;
      }
    });
    
    if (levelsFound > 0) {
      addSettingsMockExamResult('mockExamDutch', 'Quiz Levels', true, `${levelsFound} quiz levels found`);
    } else {
      addSettingsMockExamResult('mockExamDutch', 'Quiz Levels', false, 'No quiz levels found');
    }
    
  } catch (error) {
    addSettingsMockExamResult('mockExamDutch', 'Error Handling', false, `Error: ${error.message}`);
  }
}

// Test 6: Mock Exam - Arabic
async function testMockExamArabic() {
  console.log('\n🇸🇦 Testing Mock Exam - Arabic...');
  console.log('-'.repeat(40));
  
  try {
    // Set language to Arabic
    console.log('🔤 Setting language to Arabic...');
    window.authStore.getState().setLanguage('ar');
    await wait(1000);
    
    // Test Arabic quiz text content
    const hasArabicQuizText = document.body.textContent.includes('اختبار') || 
                             document.body.textContent.includes('مبتدئ') ||
                             document.body.textContent.includes('متقدم');
    
    if (hasArabicQuizText) {
      addSettingsMockExamResult('mockExamArabic', 'Arabic Quiz Text', true, 'Arabic quiz text content found');
    } else {
      addSettingsMockExamResult('mockExamArabic', 'Arabic Quiz Text', false, 'Arabic quiz text content not found');
    }
    
    // Test RTL layout for quiz
    const bodyDir = document.body.getAttribute('dir');
    const htmlDir = document.documentElement.getAttribute('dir');
    const hasRTL = bodyDir === 'rtl' || htmlDir === 'rtl';
    
    if (hasRTL) {
      addSettingsMockExamResult('mockExamArabic', 'Quiz RTL Layout', true, 'RTL layout applied to quiz');
    } else {
      addSettingsMockExamResult('mockExamArabic', 'Quiz RTL Layout', false, 'RTL layout not applied to quiz');
    }
    
    // Test quiz levels
    const quizLevels = ['beginner', 'intermediate', 'advanced'];
    let levelsFound = 0;
    
    quizLevels.forEach(level => {
      const levelElement = document.querySelector(`[data-level="${level}"]`) || 
                          document.querySelector(`.quiz-level[data-level="${level}"]`);
      if (levelElement) {
        levelsFound++;
      }
    });
    
    if (levelsFound > 0) {
      addSettingsMockExamResult('mockExamArabic', 'Quiz Levels', true, `${levelsFound} quiz levels found`);
    } else {
      addSettingsMockExamResult('mockExamArabic', 'Quiz Levels', false, 'No quiz levels found');
    }
    
  } catch (error) {
    addSettingsMockExamResult('mockExamArabic', 'Error Handling', false, `Error: ${error.message}`);
  }
}

// Test 7: Functionality Testing
async function testFunctionality() {
  console.log('\n🔧 Testing Functionality...');
  console.log('-'.repeat(40));
  
  try {
    // Test settings functionality
    const settingsContainer = document.querySelector('.settings-container') || 
                             document.querySelector('[data-testid="settings"]');
    if (settingsContainer) {
      addSettingsMockExamResult('functionality', 'Settings Container', true, 'Settings container found');
    } else {
      addSettingsMockExamResult('functionality', 'Settings Container', false, 'Settings container not found');
    }
    
    // Test mock exam functionality
    const mockExamContainer = document.querySelector('.mock-exam-container') || 
                             document.querySelector('[data-testid="mock-exam"]');
    if (mockExamContainer) {
      addSettingsMockExamResult('functionality', 'Mock Exam Container', true, 'Mock exam container found');
    } else {
      addSettingsMockExamResult('functionality', 'Mock Exam Container', false, 'Mock exam container not found');
    }
    
    // Test form elements
    const formElements = document.querySelectorAll('input, select, textarea, button');
    if (formElements.length > 0) {
      addSettingsMockExamResult('functionality', 'Form Elements', true, `${formElements.length} form elements found`);
    } else {
      addSettingsMockExamResult('functionality', 'Form Elements', false, 'No form elements found');
    }
    
    // Test navigation elements
    const navElements = document.querySelectorAll('nav, .navigation, .nav');
    if (navElements.length > 0) {
      addSettingsMockExamResult('functionality', 'Navigation Elements', true, `${navElements.length} navigation elements found`);
    } else {
      addSettingsMockExamResult('functionality', 'Navigation Elements', false, 'No navigation elements found');
    }
    
    // Test voice features
    if ('speechSynthesis' in window) {
      addSettingsMockExamResult('functionality', 'Voice Features', true, 'Speech synthesis available');
    } else {
      addSettingsMockExamResult('functionality', 'Voice Features', false, 'Speech synthesis not available');
    }
    
  } catch (error) {
    addSettingsMockExamResult('functionality', 'Error Handling', false, `Error: ${error.message}`);
  }
}

// Run all settings and mock exam tests
async function runAllSettingsMockExamTests() {
  console.log('🚀 Starting comprehensive settings and mock exam testing...');
  console.log('='.repeat(60));
  
  await testSettingsEnglish();
  await wait(1000);
  
  await testSettingsDutch();
  await wait(1000);
  
  await testSettingsArabic();
  await wait(1000);
  
  await testMockExamEnglish();
  await wait(1000);
  
  await testMockExamDutch();
  await wait(1000);
  
  await testMockExamArabic();
  await wait(1000);
  
  await testFunctionality();
  
  // Display summary
  console.log('\n📊 SETTINGS & MOCK EXAM TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  
  Object.entries(settingsMockExamResults).forEach(([category, results]) => {
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
  const totalPassed = Object.values(settingsMockExamResults).reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = Object.values(settingsMockExamResults).reduce((sum, r) => sum + r.failed, 0);
  const totalTests = totalPassed + totalFailed;
  const overallPercentage = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
  
  console.log(`\n🎯 OVERALL SETTINGS & MOCK EXAM RESULT: ${totalPassed}/${totalTests} (${overallPercentage}%)`);
  
  if (overallPercentage === 100) {
    console.log('🎉 ALL SETTINGS & MOCK EXAM TESTS PASSED! Perfect multilingual support!');
  } else if (overallPercentage >= 80) {
    console.log('⚠️ Most settings and mock exam tests passed. Minor issues to address.');
  } else {
    console.log('❌ Multiple settings and mock exam test failures. Needs attention before launch.');
  }
  
  return settingsMockExamResults;
}

// Auto-run tests
console.log('💡 To run all settings and mock exam tests, execute: runAllSettingsMockExamTests()');
console.log('💡 To run individual tests: testSettingsEnglish(), testSettingsDutch(), testSettingsArabic(), testMockExamEnglish(), testMockExamDutch(), testMockExamArabic(), testFunctionality()');

// Uncomment to auto-run
// runAllSettingsMockExamTests();
