/**
 * Production Debugging Script for /games page
 * 
 * Usage:
 * 1. Open https://matchgrinder.com/games in your browser
 * 2. Open Developer Console (F12 or Cmd+Option+I)
 * 3. Copy and paste this entire script
 * 4. Press Enter
 * 
 * This will help identify what's causing the blank page.
 */

console.log('🔍 Starting Production Debug for /games page...\n');

// 1. Check React Root
const reactRoot = document.getElementById('root');
console.log('1️⃣ React Root Element:', reactRoot ? '✅ Found' : '❌ Missing');
if (reactRoot) {
  console.log('   - Has content:', reactRoot.innerHTML.length > 0 ? '✅ Yes' : '❌ No (blank)');
  console.log('   - Content preview:', reactRoot.innerHTML.substring(0, 100));
}

// 2. Check Auth Status
const authToken = localStorage.getItem('auth_token');
const user = localStorage.getItem('user');
console.log('\n2️⃣ Authentication:');
console.log('   - Token:', authToken ? '✅ Present' : '❌ Missing');
console.log('   - User data:', user ? '✅ Present' : '❌ Missing');
if (user) {
  try {
    const userData = JSON.parse(user);
    console.log('   - User ID:', userData.id);
    console.log('   - User name:', userData.name);
  } catch (e) {
    console.error('   - ❌ User data parse error:', e);
  }
}

// 3. Check API Configuration
console.log('\n3️⃣ API Configuration:');
console.log('   - Current URL:', window.location.href);
console.log('   - Protocol:', window.location.protocol);
console.log('   - Hostname:', window.location.hostname);

// 4. Test API Endpoint
console.log('\n4️⃣ Testing API Endpoint...');
fetch('https://matchgrinder.com/api/events?my_games_only=0&per_page=12&page=1', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': authToken ? `Bearer ${authToken}` : ''
  }
})
  .then(response => {
    console.log('   - Response status:', response.status, response.statusText);
    return response.json();
  })
  .then(data => {
    console.log('   - Response data:', data);
    console.log('   - Events count:', data?.data?.length || 0);
    if (data?.data) {
      console.log('   - ✅ API is working correctly');
    } else {
      console.log('   - ⚠️ API response structure unexpected');
    }
  })
  .catch(error => {
    console.error('   - ❌ API Error:', error);
  });

// 5. Check for JavaScript Errors
console.log('\n5️⃣ Setting up error listeners...');
let errorCount = 0;
window.addEventListener('error', (event) => {
  errorCount++;
  console.error(`\n❌ JavaScript Error #${errorCount}:`, {
    message: event.error?.message,
    stack: event.error?.stack,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('\n❌ Unhandled Promise Rejection:', {
    reason: event.reason,
    promise: event.promise
  });
});

// 6. Check React Query State (if available)
console.log('\n6️⃣ Checking React Query State...');
setTimeout(() => {
  const queryClient = window.__REACT_QUERY_CLIENT__;
  if (queryClient) {
    console.log('   - React Query Client:', '✅ Found');
    try {
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();
      console.log('   - Active queries:', queries.length);
      queries.forEach((query, index) => {
        console.log(`   - Query ${index + 1}:`, {
          key: query.queryKey,
          state: query.state.status,
          error: query.state.error?.message
        });
      });
    } catch (e) {
      console.log('   - ⚠️ Could not access query cache:', e.message);
    }
  } else {
    console.log('   - React Query Client:', '❌ Not found');
  }
}, 2000);

// 7. Check for specific components
console.log('\n7️⃣ Checking for Games Page Elements...');
setTimeout(() => {
  const gamesTitle = document.querySelector('h1');
  const createButton = document.querySelector('button:has-text("Create")');
  const sportSelect = document.querySelector('select, [role="combobox"]');
  
  console.log('   - Games title:', gamesTitle?.textContent || '❌ Not found');
  console.log('   - Create button:', createButton ? '✅ Found' : '❌ Not found');
  console.log('   - Sport filter:', sportSelect ? '✅ Found' : '❌ Not found');
  
  // Check for error boundaries
  const errorText = document.body.innerText.toLowerCase();
  if (errorText.includes('error') || errorText.includes('something went wrong')) {
    console.log('   - ⚠️ Error boundary may have caught an error');
  }
  
  console.log('\n✅ Debug Complete!');
  console.log('\n📋 Summary:');
  console.log('   - If API is working but page is blank: Check browser console for React errors');
  console.log('   - If you see "Cannot read properties of undefined": The fix needs to be deployed');
  console.log('   - If authentication is missing: Log in first');
  console.log('\n💡 Next Steps:');
  console.log('   1. Look for any ❌ markers above');
  console.log('   2. Check if there are JavaScript errors logged');
  console.log('   3. Verify the production build has the latest fixes');
}, 3000);

console.log('\n⏳ Waiting for components to load...');



