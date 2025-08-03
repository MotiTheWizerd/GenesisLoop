/**
 * Test script to verify extension scripts are loading
 * Run this in console to check which scripts have loaded
 */

console.log("🔍 Extension Script Loading Test");

// Check for various extension modules
const modules = [
  'Constants',
  'BrowserClock', 
  'ResponseTracker',
  'FetchSender',
  'DataSender',
  'DOMUtils',
  'MessageSender',
  'ToggleButton',
  'MessageLoop'
];

console.log("\n📋 Module Availability Check:");
modules.forEach(module => {
  const exists = typeof window[module] !== 'undefined';
  console.log(`${exists ? '✅' : '❌'} window.${module}: ${typeof window[module]}`);
});

// Check for specific BrowserClock methods if it exists
if (window.BrowserClock) {
  console.log("\n🕐 BrowserClock Methods:");
  const methods = Object.keys(window.BrowserClock);
  methods.forEach(method => {
    console.log(`  - ${method}: ${typeof window.BrowserClock[method]}`);
  });
}

// Check console for loading messages
console.log("\n💡 Check console above for loading messages like:");
console.log("  - '🕐 BrowserClock module starting to load...'");
console.log("  - '✅ BrowserClock loaded and initialized successfully'");
console.log("  - '❌ BrowserClock initialization failed:'");

// Check manifest loading order
console.log("\n📋 Expected loading order from manifest:");
console.log("1. constants.js");
console.log("2. browserClock.js ← Should load here");
console.log("3. responseTracker.js");
console.log("4. fetchSender.js");
console.log("5. dataSender.js");
console.log("...");

console.log("\n🔧 If BrowserClock is missing:");
console.log("1. Check chrome://extensions for errors");
console.log("2. Reload the extension");
console.log("3. Refresh this page");
console.log("4. Check browser console for error messages");