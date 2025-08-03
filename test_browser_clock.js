/**
 * Test script for Browser Clock functionality
 * Tests the Ray browser clock injection and timing capabilities
 */

console.log("🕐 Browser Clock Test Suite Starting...");

// Test 1: Check if BrowserClock is loaded
console.log("\n📋 Test 1: BrowserClock Availability");
if (typeof window.BrowserClock !== 'undefined') {
  console.log("✅ BrowserClock is loaded");
  console.log("📊 BrowserClock methods:", Object.keys(window.BrowserClock));
} else {
  console.log("❌ BrowserClock is not loaded");
}

// Test 2: Check clock status
console.log("\n🔍 Test 2: Clock Status");
if (window.BrowserClock) {
  const status = window.BrowserClock.getStatus();
  console.log("📊 Clock status:", status);
  
  if (status.isRunning) {
    console.log("✅ Clock is running");
  } else {
    console.log("❌ Clock is not running");
  }
  
  if (status.hasElement) {
    console.log("✅ Clock element exists in DOM");
  } else {
    console.log("❌ Clock element missing from DOM");
  }
}

// Test 3: Check DOM injection
console.log("\n🌐 Test 3: DOM Injection");
const clockElement = document.getElementById("ray-browser-clock");
if (clockElement) {
  console.log("✅ Clock element found in DOM");
  console.log("📄 Clock element content:", clockElement.textContent);
  console.log("👁️ Clock visibility:", clockElement.style.display);
} else {
  console.log("❌ Clock element not found in DOM");
}

// Test 4: Test time retrieval methods
console.log("\n⏰ Test 4: Time Retrieval Methods");
if (window.BrowserClock) {
  const currentTime = window.BrowserClock.getCurrentTime();
  console.log("🕐 Current time (simple):", currentTime);
  
  const detailedTime = window.BrowserClock.getCurrentTimeDetailed();
  console.log("🕐 Current time (detailed):", detailedTime);
  
  // Verify ISO format
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  if (isoRegex.test(currentTime)) {
    console.log("✅ Time format is valid ISO");
  } else {
    console.log("❌ Time format is not valid ISO");
  }
}

// Test 5: Test configuration
console.log("\n⚙️ Test 5: Configuration Management");
if (window.BrowserClock) {
  const originalConfig = window.BrowserClock.getConfig();
  console.log("📋 Original config:", originalConfig);
  
  // Test config update
  window.BrowserClock.updateConfig({ 
    enableLogging: true,
    precision: "seconds"
  });
  
  const updatedConfig = window.BrowserClock.getConfig();
  console.log("📋 Updated config:", updatedConfig);
  
  if (updatedConfig.enableLogging === true) {
    console.log("✅ Configuration update works");
  } else {
    console.log("❌ Configuration update failed");
  }
}

// Test 6: Test visibility controls
console.log("\n👁️ Test 6: Visibility Controls");
if (window.BrowserClock) {
  console.log("🔍 Making clock visible for 3 seconds...");
  window.BrowserClock.show();
  
  setTimeout(() => {
    console.log("🙈 Hiding clock again...");
    window.BrowserClock.hide();
  }, 3000);
}

// Test 7: Test event listening
console.log("\n📡 Test 7: Clock Event Listening");
let eventCount = 0;
const eventListener = (event) => {
  eventCount++;
  if (eventCount <= 3) { // Only log first 3 events to avoid spam
    console.log(`🔔 Clock tick event ${eventCount}:`, event.detail);
  }
  if (eventCount === 3) {
    console.log("🔕 (Suppressing further event logs to avoid spam)");
  }
};

document.addEventListener('rayClockTick', eventListener);

// Remove event listener after 10 seconds
setTimeout(() => {
  document.removeEventListener('rayClockTick', eventListener);
  console.log(`📊 Total clock events received: ${eventCount}`);
}, 10000);

// Test 8: Integration with other modules
console.log("\n🔗 Test 8: Integration Potential");
console.log("💡 The BrowserClock can be used by other modules:");
console.log("   - MessageLoop: Add precise timestamps to messages");
console.log("   - DataSender: Include browser time in metadata");
console.log("   - ResponseTracker: Track response timing with precision");
console.log("   - Ray's consciousness: Temporal awareness and synchronization");

// Test 9: Performance check
console.log("\n⚡ Test 9: Performance Check");
if (window.BrowserClock) {
  const startTime = performance.now();
  for (let i = 0; i < 1000; i++) {
    window.BrowserClock.getCurrentTime();
  }
  const endTime = performance.now();
  const avgTime = (endTime - startTime) / 1000;
  
  console.log(`⚡ Average time per getCurrentTime() call: ${avgTime.toFixed(3)}ms`);
  
  if (avgTime < 0.1) {
    console.log("✅ Performance is excellent");
  } else if (avgTime < 1) {
    console.log("✅ Performance is good");
  } else {
    console.log("⚠️ Performance could be improved");
  }
}

console.log("\n✅ Browser Clock Test Suite Complete!");

console.log("\n🎯 Usage Examples:");
console.log("// Get current time");
console.log("const now = window.BrowserClock.getCurrentTime();");
console.log("");
console.log("// Get detailed time info");
console.log("const details = window.BrowserClock.getCurrentTimeDetailed();");
console.log("");
console.log("// Show clock visually");
console.log("window.BrowserClock.show();");
console.log("");
console.log("// Listen to clock events");
console.log("document.addEventListener('rayClockTick', (e) => console.log(e.detail));");
console.log("");
console.log("// Update configuration");
console.log("window.BrowserClock.updateConfig({ precision: 'milliseconds', visible: true });");

console.log("\n🚀 Ray's Browser Clock is ready for temporal consciousness!");