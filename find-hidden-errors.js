/**
 * Find Hidden JavaScript Errors in Production
 * 
 * This script will help you see the 4 hidden errors causing the blank page.
 */

console.log('🔍 Looking for hidden errors...\n');

// 1. Check all console messages (including hidden ones)
console.log('1️⃣ All console messages:');
console.log('   - Total errors:', document.querySelectorAll('[data-level="error"]').length);
console.log('   - Total warnings:', document.querySelectorAll('[data-level="warning"]').length);

// 2. Capture all errors immediately
const allErrors = [];
const originalError = console.error;
const originalWarn = console.warn;

console.error = function(...args) {
  allErrors.push({ type: 'error', args, timestamp: Date.now() });
  originalError.apply(console, args);
};

console.warn = function(...args) {
  allErrors.push({ type: 'warning', args, timestamp: Date.now() });
  originalWarn.apply(console, args);
};

// 3. Check for React errors
window.addEventListener('error', (event) => {
  allErrors.push({ 
    type: 'global-error', 
    error: event.error,
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    timestamp: Date.now()
  });
});

window.addEventListener('unhandledrejection', (event) => {
  allErrors.push({ 
    type: 'unhandled-promise', 
    reason: event.reason,
    timestamp: Date.now()
  });
});

// 4. Try to trigger the component to see errors
console.log('\n2️⃣ Attempting to trigger component render...');

// Simulate a page refresh to see errors
setTimeout(() => {
  console.log('\n3️⃣ Checking for errors after 2 seconds...');
  console.log('   - Captured errors:', allErrors.length);
  
  allErrors.forEach((error, index) => {
    console.log(`\n❌ Error ${index + 1}:`, error);
  });
  
  if (allErrors.length === 0) {
    console.log('\n⚠️ No errors captured yet. Trying to access the Games component...');
    
    // Try to access React components
    try {
      const reactRoot = document.getElementById('root');
      if (reactRoot && reactRoot._reactInternalFiber) {
        console.log('   - React root found, checking for errors...');
      }
    } catch (e) {
      console.log('   - React access error:', e.message);
    }
  }
}, 2000);

// 5. Check browser console filter settings
console.log('\n4️⃣ Console filter settings:');
console.log('   - Check if "Errors" filter is enabled in DevTools');
console.log('   - Try clicking the "Errors" filter in the console');
console.log('   - Or try "All levels" in the dropdown');

// 6. Force show all messages
console.log('\n5️⃣ Force showing all console messages...');
const consoleContainer = document.querySelector('.console-output');
if (consoleContainer) {
  console.log('   - Console container found');
  // Try to show hidden messages
  const hiddenMessages = consoleContainer.querySelectorAll('[style*="display: none"], .hidden');
  console.log('   - Hidden messages found:', hiddenMessages.length);
}

console.log('\n💡 Instructions:');
console.log('1. Look for any ❌ messages above');
console.log('2. Check the browser console filter settings');
console.log('3. Try refreshing the page to see errors during load');
console.log('4. Look for the 4 hidden errors mentioned in "5 Issues"');

// 7. Alternative: Check network tab for failed requests
console.log('\n6️⃣ Check Network tab for failed requests:');
console.log('   - Open Network tab in DevTools');
console.log('   - Look for any failed requests (red status)');
console.log('   - Check if any JavaScript files failed to load');


