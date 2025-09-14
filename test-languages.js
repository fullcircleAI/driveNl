// DriveNL Language Testing Script
// Run this in browser console to test all language experiences

console.log('🌍 DriveNL Language Testing Starting...');
console.log('='.repeat(50));

// Test Results Storage
const languageTestResults = {
  english: { passed: 0, failed: 0, tests: [] },
  dutch: { passed: 0, failed: 0, tests: [] },
  arabic: { passed: 0, failed: 0, tests: [] },
  languageSwitching: { passed: 0, failed: 0, tests: [] }
};

function addLanguageTestResult(category, testName, passed, message) {
  const result = { testName, passed, message, timestamp: new Date().toLocaleTimeString() };
  languageTestResults[category].tests.push(result);
  if (passed) {
    languageTestResults[category].passed++;
  } else {
    languageTestResults[category].failed++;
  }
  
  const emoji = passed ? '✅' : '❌';
  console.log(`${emoji} [${category.toUpperCase()}] ${testName}: ${message}`);
}

// Helper function to wait for async operations
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test 1: English Language Experience
async function testEnglishLanguage() {
  console.log('\n🇬🇧 Testing English Language Experience...');
  console.log('-'.repeat(40));
  
  try {
    // Check if language context is available
    if (typeof window.authStore === 'undefined') {
      addLanguageTestResult('english', 'Service Availability', false, 'Auth store not found');
      return;
    }
    
    addLanguageTestResult('english', 'Service Availability', true, 'Auth store available');
    
    // Set language to English
    console.log('🔤 Setting language to English...');
    window.authStore.getState().setLanguage('en');
    await wait(1000); // Wait for language change
    
    // Check if language was set correctly
    const currentLanguage = window.authStore.getState().language;
    if (currentLanguage === 'en') {
      addLanguageTestResult('english', 'Language Setting', true, 'English language set successfully');
    } else {
      addLanguageTestResult('english', 'Language Setting', false, `Language not set correctly: ${currentLanguage}`);
      return;
    }
    
    // Check localStorage persistence
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage === 'en') {
      addLanguageTestResult('english', 'Language Persistence', true, 'English language saved to localStorage');
    } else {
      addLanguageTestResult('english', 'Language Persistence', false, `Language not saved correctly: ${savedLanguage}`);
    }
    
    // Test UI elements (simulate checking common elements)
    const hasEnglishElements = document.body.textContent.includes('Dashboard') || 
                              document.body.textContent.includes('Practice') ||
                              document.body.textContent.includes('Settings');
    
    if (hasEnglishElements) {
      addLanguageTestResult('english', 'UI Translation', true, 'English UI elements found');
    } else {
      addLanguageTestResult('english', 'UI Translation', false, 'English UI elements not found');
    }
    
    // Test voice features availability
    if ('speechSynthesis' in window) {
      addLanguageTestResult('english', 'Voice Features', true, 'Speech synthesis available');
    } else {
      addLanguageTestResult('english', 'Voice Features', false, 'Speech synthesis not available');
    }
    
  } catch (error) {
    addLanguageTestResult('english', 'Error Handling', false, `Error: ${error.message}`);
  }
}

// Test 2: Dutch Language Experience
async function testDutchLanguage() {
  console.log('\n🇳🇱 Testing Dutch Language Experience...');
  console.log('-'.repeat(40));
  
  try {
    // Set language to Dutch
    console.log('🔤 Setting language to Dutch...');
    window.authStore.getState().setLanguage('nl');
    await wait(1000); // Wait for language change
    
    // Check if language was set correctly
    const currentLanguage = window.authStore.getState().language;
    if (currentLanguage === 'nl') {
      addLanguageTestResult('dutch', 'Language Setting', true, 'Dutch language set successfully');
    } else {
      addLanguageTestResult('dutch', 'Language Setting', false, `Language not set correctly: ${currentLanguage}`);
      return;
    }
    
    // Check localStorage persistence
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage === 'nl') {
      addLanguageTestResult('dutch', 'Language Persistence', true, 'Dutch language saved to localStorage');
    } else {
      addLanguageTestResult('dutch', 'Language Persistence', false, `Language not saved correctly: ${savedLanguage}`);
    }
    
    // Test UI elements (simulate checking common elements)
    const hasDutchElements = document.body.textContent.includes('Dashboard') || 
                            document.body.textContent.includes('Oefenen') ||
                            document.body.textContent.includes('Instellingen');
    
    if (hasDutchElements) {
      addLanguageTestResult('dutch', 'UI Translation', true, 'Dutch UI elements found');
    } else {
      addLanguageTestResult('dutch', 'UI Translation', false, 'Dutch UI elements not found');
    }
    
    // Test voice features availability
    if ('speechSynthesis' in window) {
      addLanguageTestResult('dutch', 'Voice Features', true, 'Speech synthesis available');
    } else {
      addLanguageTestResult('dutch', 'Voice Features', false, 'Speech synthesis not available');
    }
    
  } catch (error) {
    addLanguageTestResult('dutch', 'Error Handling', false, `Error: ${error.message}`);
  }
}

// Test 3: Arabic Language Experience
async function testArabicLanguage() {
  console.log('\n🇸🇦 Testing Arabic Language Experience...');
  console.log('-'.repeat(40));
  
  try {
    // Set language to Arabic
    console.log('🔤 Setting language to Arabic...');
    window.authStore.getState().setLanguage('ar');
    await wait(1000); // Wait for language change
    
    // Check if language was set correctly
    const currentLanguage = window.authStore.getState().language;
    if (currentLanguage === 'ar') {
      addLanguageTestResult('arabic', 'Language Setting', true, 'Arabic language set successfully');
    } else {
      addLanguageTestResult('arabic', 'Language Setting', false, `Language not set correctly: ${currentLanguage}`);
      return;
    }
    
    // Check localStorage persistence
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage === 'ar') {
      addLanguageTestResult('arabic', 'Language Persistence', true, 'Arabic language saved to localStorage');
    } else {
      addLanguageTestResult('arabic', 'Language Persistence', false, `Language not saved correctly: ${savedLanguage}`);
    }
    
    // Test UI elements (simulate checking common elements)
    const hasArabicElements = document.body.textContent.includes('لوحة التحكم') || 
                             document.body.textContent.includes('التدريب') ||
                             document.body.textContent.includes('الإعدادات');
    
    if (hasArabicElements) {
      addLanguageTestResult('arabic', 'UI Translation', true, 'Arabic UI elements found');
    } else {
      addLanguageTestResult('arabic', 'UI Translation', false, 'Arabic UI elements not found');
    }
    
    // Test RTL layout
    const bodyDir = document.body.getAttribute('dir');
    const htmlDir = document.documentElement.getAttribute('dir');
    const hasRTL = bodyDir === 'rtl' || htmlDir === 'rtl';
    
    if (hasRTL) {
      addLanguageTestResult('arabic', 'RTL Layout', true, 'RTL layout applied');
    } else {
      addLanguageTestResult('arabic', 'RTL Layout', false, 'RTL layout not applied');
    }
    
    // Test voice features availability
    if ('speechSynthesis' in window) {
      addLanguageTestResult('arabic', 'Voice Features', true, 'Speech synthesis available');
    } else {
      addLanguageTestResult('arabic', 'Voice Features', false, 'Speech synthesis not available');
    }
    
  } catch (error) {
    addLanguageTestResult('arabic', 'Error Handling', false, `Error: ${error.message}`);
  }
}

// Test 4: Language Switching
async function testLanguageSwitching() {
  console.log('\n🔄 Testing Language Switching...');
  console.log('-'.repeat(40));
  
  try {
    // Test switching from English to Dutch
    console.log('🔄 Switching from English to Dutch...');
    window.authStore.getState().setLanguage('en');
    await wait(500);
    window.authStore.getState().setLanguage('nl');
    await wait(1000);
    
    const currentLanguage = window.authStore.getState().language;
    if (currentLanguage === 'nl') {
      addLanguageTestResult('languageSwitching', 'EN to NL Switch', true, 'Successfully switched from English to Dutch');
    } else {
      addLanguageTestResult('languageSwitching', 'EN to NL Switch', false, `Switch failed: ${currentLanguage}`);
    }
    
    // Test switching from Dutch to Arabic
    console.log('🔄 Switching from Dutch to Arabic...');
    window.authStore.getState().setLanguage('nl');
    await wait(500);
    window.authStore.getState().setLanguage('ar');
    await wait(1000);
    
    const currentLanguage2 = window.authStore.getState().language;
    if (currentLanguage2 === 'ar') {
      addLanguageTestResult('languageSwitching', 'NL to AR Switch', true, 'Successfully switched from Dutch to Arabic');
    } else {
      addLanguageTestResult('languageSwitching', 'NL to AR Switch', false, `Switch failed: ${currentLanguage2}`);
    }
    
    // Test switching from Arabic to English
    console.log('🔄 Switching from Arabic to English...');
    window.authStore.getState().setLanguage('ar');
    await wait(500);
    window.authStore.getState().setLanguage('en');
    await wait(1000);
    
    const currentLanguage3 = window.authStore.getState().language;
    if (currentLanguage3 === 'en') {
      addLanguageTestResult('languageSwitching', 'AR to EN Switch', true, 'Successfully switched from Arabic to English');
    } else {
      addLanguageTestResult('languageSwitching', 'AR to EN Switch', false, `Switch failed: ${currentLanguage3}`);
    }
    
    // Test data persistence during language switching
    const finalSavedLanguage = localStorage.getItem('preferredLanguage');
    if (finalSavedLanguage === 'en') {
      addLanguageTestResult('languageSwitching', 'Data Persistence', true, 'Language preference persisted correctly');
    } else {
      addLanguageTestResult('languageSwitching', 'Data Persistence', false, `Language preference not persisted: ${finalSavedLanguage}`);
    }
    
  } catch (error) {
    addLanguageTestResult('languageSwitching', 'Error Handling', false, `Error: ${error.message}`);
  }
}

// Test 5: Translation Coverage
async function testTranslationCoverage() {
  console.log('\n📚 Testing Translation Coverage...');
  console.log('-'.repeat(40));
  
  try {
    // Check if strings object is available
    if (typeof window.strings === 'undefined') {
      addLanguageTestResult('english', 'Translation Coverage', false, 'Strings object not found');
      return;
    }
    
    const languages = ['en', 'nl', 'ar'];
    const requiredKeys = ['welcome', 'loading', 'error', 'success', 'navigation', 'dashboard', 'practice'];
    
    languages.forEach(lang => {
      const langStrings = window.strings[lang];
      if (langStrings) {
        const availableKeys = Object.keys(langStrings);
        const missingKeys = requiredKeys.filter(key => !availableKeys.includes(key));
        
        if (missingKeys.length === 0) {
          addLanguageTestResult('english', `${lang.toUpperCase()} Translation Coverage`, true, `All required keys present (${availableKeys.length} total)`);
        } else {
          addLanguageTestResult('english', `${lang.toUpperCase()} Translation Coverage`, false, `Missing keys: ${missingKeys.join(', ')}`);
        }
      } else {
        addLanguageTestResult('english', `${lang.toUpperCase()} Translation Coverage`, false, 'No translations found');
      }
    });
    
  } catch (error) {
    addLanguageTestResult('english', 'Translation Coverage', false, `Error: ${error.message}`);
  }
}

// Run all language tests
async function runAllLanguageTests() {
  console.log('🚀 Starting comprehensive language testing...');
  console.log('='.repeat(50));
  
  await testEnglishLanguage();
  await wait(1000);
  
  await testDutchLanguage();
  await wait(1000);
  
  await testArabicLanguage();
  await wait(1000);
  
  await testLanguageSwitching();
  await wait(1000);
  
  await testTranslationCoverage();
  
  // Display summary
  console.log('\n📊 LANGUAGE TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  
  Object.entries(languageTestResults).forEach(([category, results]) => {
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
  const totalPassed = Object.values(languageTestResults).reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = Object.values(languageTestResults).reduce((sum, r) => sum + r.failed, 0);
  const totalTests = totalPassed + totalFailed;
  const overallPercentage = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
  
  console.log(`\n🎯 OVERALL LANGUAGE RESULT: ${totalPassed}/${totalTests} (${overallPercentage}%)`);
  
  if (overallPercentage === 100) {
    console.log('🎉 ALL LANGUAGE TESTS PASSED! Multilingual support is perfect!');
  } else if (overallPercentage >= 80) {
    console.log('⚠️ Most language tests passed. Minor issues to address.');
  } else {
    console.log('❌ Multiple language test failures. Needs attention before launch.');
  }
  
  return languageTestResults;
}

// Auto-run tests
console.log('💡 To run all language tests, execute: runAllLanguageTests()');
console.log('💡 To run individual tests: testEnglishLanguage(), testDutchLanguage(), testArabicLanguage(), testLanguageSwitching()');

// Uncomment to auto-run
// runAllLanguageTests();
