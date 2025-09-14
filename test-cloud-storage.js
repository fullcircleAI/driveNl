// Simple Cloud Storage Test Script
// Run this in the browser console to test cloud storage

console.log('🧪 DriveNL Cloud Storage Test Starting...');

// Test 1: Check if cloud storage service is available
console.log('🔍 Testing Cloud Storage Service...');

// Test 2: Check environment variables
console.log('📋 Environment Variables:');
console.log('  VITE_JSONBIN_API_KEY:', import.meta?.env?.VITE_JSONBIN_API_KEY ? 'Set' : 'Not Set');
console.log('  VITE_JSONBIN_BIN_ID:', import.meta?.env?.VITE_JSONBIN_BIN_ID ? 'Set' : 'Not Set');
console.log('  VITE_FIREBASE_API_KEY:', import.meta?.env?.VITE_FIREBASE_API_KEY ? 'Set' : 'Not Set');

// Test 3: Check if services are loaded
console.log('🔧 Service Availability:');
console.log('  Cloud Storage:', typeof window.cloudStorage !== 'undefined' ? 'Available' : 'Not Available');
console.log('  Data Persistence:', typeof window.dataPersistence !== 'undefined' ? 'Available' : 'Not Available');
console.log('  Auth Service:', typeof window.authService !== 'undefined' ? 'Available' : 'Not Available');

// Test 4: Check localStorage for existing data
console.log('💾 Local Storage Check:');
const currentUser = localStorage.getItem('currentUser');
console.log('  Current User:', currentUser ? 'Found' : 'Not Found');

// Test 5: Check for cloud data
const cloudDataKeys = Object.keys(localStorage).filter(key => key.startsWith('cloudData_'));
console.log('  Cloud Data Entries:', cloudDataKeys.length);

// Test 6: Check for test results
const testResultKeys = Object.keys(localStorage).filter(key => key.startsWith('testResults_'));
console.log('  Test Result Entries:', testResultKeys.length);

console.log('✅ Cloud Storage Test Complete!');
console.log('💡 To test cloud storage functionality:');
console.log('  1. Go to Settings > Account');
console.log('  2. Click "Test Cloud Storage" button');
console.log('  3. Check the test results');
console.log('  4. Create a user account to test full functionality');
