# 🧪 DriveNL User Testing Guide

## Test Scenarios

### **1. First-Time User Experience** 👤

#### **Test Steps:**
1. **Open app** → Should see language selection
2. **Select language** (English/Dutch)
3. **Create account** → Click "Create Account"
4. **Fill registration form:**
   - Username: `TestUser_FirstTime`
   - Email: `firsttime@test.com`
   - Language: English
5. **Submit registration** → Should create account successfully
6. **Check dashboard** → Should see welcome message
7. **Go to Settings** → Check cloud storage status
8. **Take a practice test** → Select any category
9. **Complete test** → Answer questions and submit
10. **Check results** → Verify score is saved
11. **Go back to Settings** → Verify cloud storage test

#### **Expected Results:**
- ✅ Account created successfully
- ✅ Cloud storage status shows "Available" or "Local Only"
- ✅ Test results saved and synced
- ✅ Progress tracked in dashboard
- ✅ Data persists after page refresh

---

### **2. Returning User Experience** 🔄

#### **Test Steps:**
1. **Refresh page** → Should stay logged in
2. **Check dashboard** → Should show previous progress
3. **Go to Settings** → Verify cloud storage status
4. **Take another practice test** → Different category
5. **Complete test** → Submit results
6. **Check progress** → Should show multiple test results
7. **Update settings** → Change language or preferences
8. **Refresh page** → Verify settings persist
9. **Test cloud storage** → Click test button in settings

#### **Expected Results:**
- ✅ User stays logged in
- ✅ Previous progress loaded from cloud/local
- ✅ New test results saved and synced
- ✅ Settings changes persist
- ✅ Cloud storage test passes

---

### **3. Guest User Experience** 👥

#### **Test Steps:**
1. **Clear browser data** → Clear localStorage and cookies
2. **Open app** → Should see language selection
3. **Select language** → Choose English
4. **Click "Continue as Guest"** → Should proceed without account
5. **Check dashboard** → Should show guest user interface
6. **Take a practice test** → Select any category
7. **Complete test** → Submit results
8. **Check results** → Verify score is saved locally
9. **Go to Settings** → Check cloud storage status
10. **Refresh page** → Verify data persists locally

#### **Expected Results:**
- ✅ Guest access works without account
- ✅ Test results saved locally only
- ✅ Cloud storage status shows "Local Only"
- ✅ Data persists in browser storage
- ✅ No cloud sync for guest users

---

## **Detailed Testing Checklist**

### **🔍 Cloud Storage Status Verification**

#### **In Settings → Account Tab:**
- [ ] Cloud storage status indicator visible
- [ ] Provider information displayed
- [ ] "Test Cloud Storage" button functional
- [ ] Test results show in interface
- [ ] Status updates in real-time

#### **Expected Status Messages:**
- **Cloud Available**: "Your data syncs across all devices"
- **Local Only**: "Data stored locally only - set up cloud storage for cross-device sync"

### **📊 Data Persistence Testing**

#### **Test Results:**
- [ ] Practice test results saved
- [ ] Scores calculated correctly
- [ ] Progress tracked in dashboard
- [ ] Results visible in practice history
- [ ] Data persists after page refresh

#### **User Profile:**
- [ ] Username saved and displayed
- [ ] Email address stored
- [ ] Language preference saved
- [ ] Profile updates persist

#### **User Settings:**
- [ ] Language changes saved
- [ ] Theme preferences stored
- [ ] Notification settings persist
- [ ] Study preferences saved

### **🔄 Cross-Device Simulation**

#### **Simulate Device Switch:**
1. **Clear localStorage** (simulate different device)
2. **Login with same credentials**
3. **Verify data loads from cloud**
4. **Check if progress is synced**

#### **Expected Results:**
- ✅ User data loads from cloud
- ✅ Test results appear
- ✅ Settings are restored
- ✅ Progress is accurate

---

## **Console Testing Commands**

### **Check Cloud Storage Status:**
```javascript
// Check if cloud storage is available
console.log('Cloud Available:', window.cloudStorage?.isCloudAvailable());
console.log('Provider:', window.cloudStorage?.getProviderInfo());

// Check current user
console.log('Current User:', window.authService?.getCurrentUser());

// Check stored data
console.log('Local Storage Keys:', Object.keys(localStorage));
```

### **Test Data Operations:**
```javascript
// Test saving data
const testData = {
  userId: 'test_user',
  profile: { name: 'Test User' },
  progress: [{ testId: 'test1', score: 85 }]
};

// Save to cloud
window.cloudStorage?.saveUserData(testData);

// Load from cloud
window.cloudStorage?.loadUserData('test_user');
```

### **Check Data Persistence:**
```javascript
// Check test results
const results = window.dataPersistence?.getUserTestResults();
console.log('Test Results:', results);

// Check user profile
const profile = window.dataPersistence?.getUserProfile();
console.log('User Profile:', profile);
```

---

## **Error Scenarios to Test**

### **1. Network Disconnection:**
- [ ] Disconnect internet
- [ ] Take practice test
- [ ] Verify data saves locally
- [ ] Reconnect internet
- [ ] Check if data syncs

### **2. Invalid Cloud Configuration:**
- [ ] Set invalid API keys
- [ ] Verify fallback to local storage
- [ ] Check error handling
- [ ] Verify app still functions

### **3. Storage Quota Exceeded:**
- [ ] Fill localStorage to capacity
- [ ] Verify graceful handling
- [ ] Check error messages
- [ ] Verify app continues working

---

## **Performance Testing**

### **Load Time:**
- [ ] App loads in < 3 seconds
- [ ] Cloud data loads in < 2 seconds
- [ ] Test results save in < 1 second
- [ ] Settings update in < 500ms

### **Memory Usage:**
- [ ] Check browser memory usage
- [ ] Verify no memory leaks
- [ ] Test with multiple test results
- [ ] Check localStorage size

---

## **Success Criteria**

### **✅ First-Time User:**
- Account creation works
- Data saves to cloud/local
- Progress tracking functional
- Settings persist

### **✅ Returning User:**
- Login persists
- Data loads from cloud
- Progress synced
- Settings restored

### **✅ Guest User:**
- Guest access works
- Local storage functional
- No cloud sync required
- Data persists locally

### **✅ Cloud Storage:**
- Status indicator works
- Test functionality passes
- Error handling graceful
- Fallback to local works

---

## **Test Results Template**

```
## Test Results - [Date]

### First-Time User: ✅/❌
- Account Creation: ✅/❌
- Data Saving: ✅/❌
- Cloud Sync: ✅/❌
- Progress Tracking: ✅/❌

### Returning User: ✅/❌
- Data Loading: ✅/❌
- Progress Sync: ✅/❌
- Settings Persist: ✅/❌
- Cloud Status: ✅/❌

### Guest User: ✅/❌
- Guest Access: ✅/❌
- Local Storage: ✅/❌
- Data Persistence: ✅/❌
- No Cloud Sync: ✅/❌

### Overall Status: ✅/❌
```

---

**Ready to test! Follow the steps above to verify all user experiences work correctly.**
