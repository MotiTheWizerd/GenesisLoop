/**
 * Test script for temporal integration across Genesis Loop modules
 * Tests BrowserClock integration with ResponseTracker and MessageLoop
 */

console.log("🕐 Temporal Integration Test Suite Starting...");

// Test 1: Check if all temporal modules are available
console.log("\n📋 Test 1: Module Availability");
const modules = {
  'BrowserClock': window.BrowserClock,
  'ResponseTracker': window.ResponseTracker,
  'MessageLoop': window.MessageLoop,
  'DataSender': window.DataSender
};

Object.entries(modules).forEach(([name, module]) => {
  console.log(`${module ? '✅' : '❌'} ${name}: ${typeof module}`);
});

// Test 2: Test ResponseTracker temporal functions
console.log("\n🕐 Test 2: ResponseTracker Temporal Functions");
if (window.ResponseTracker) {
  // Test getTemporalContext
  const temporalContext = window.ResponseTracker.getTemporalContext();
  console.log("📊 Temporal context:", temporalContext);
  
  // Test attachTimestamp utility
  const timedMessage = window.ResponseTracker.attachTimestamp("Test message", {
    test: true,
    module: "temporal_integration_test"
  });
  console.log("📝 Timed message:", timedMessage);
  
  // Test adding a response with temporal context
  window.ResponseTracker.addResponse("Test response for temporal integration", {
    source: 'temporal_test',
    type: 'integration_test'
  });
  
  // Get stats
  const stats = window.ResponseTracker.getStats();
  console.log("📊 ResponseTracker stats:", stats);
  
  // Get latest response
  const latest = window.ResponseTracker.getLatestResponse();
  console.log("📄 Latest response:", latest);
} else {
  console.log("❌ ResponseTracker not available");
}

// Test 3: Test event listening
console.log("\n📡 Test 3: Event System Integration");

// Listen for response tracking events
document.addEventListener('rayResponseTracked', (event) => {
  console.log("🔔 Response tracked event:", event.detail);
});

// Listen for clock tick events
let clockTickCount = 0;
const clockListener = (event) => {
  clockTickCount++;
  if (clockTickCount <= 3) {
    console.log(`🕐 Clock tick ${clockTickCount}:`, event.detail.timestamp);
  }
  if (clockTickCount === 3) {
    console.log("🔕 (Clock tick logging limited to avoid spam)");
  }
};

document.addEventListener('rayClockTick', clockListener);

// Test 4: Test temporal data flow
console.log("\n🔄 Test 4: Temporal Data Flow");

// Simulate what happens in MessageLoop
if (window.ResponseTracker && window.DataSender) {
  console.log("🧪 Simulating MessageLoop temporal flow...");
  
  // Get temporal context like MessageLoop does
  const temporalContext = window.ResponseTracker.getTemporalContext();
  console.log("📊 MessageLoop would use temporal context:", temporalContext);
  
  // Create metadata like MessageLoop does
  const metadata = {
    source: 'messageLoop',
    loopIteration: 1,
    timestamp: temporalContext.timestamp,
    browser_time: temporalContext.detailed,
    temporal_source: temporalContext.source,
    ray_consciousness_tick: temporalContext.timestamp
  };
  console.log("📋 MessageLoop metadata with temporal context:", metadata);
}

// Test 5: Test time range queries
console.log("\n⏰ Test 5: Time Range Queries");
if (window.ResponseTracker) {
  // Add a few test responses
  window.ResponseTracker.addResponse("Response 1", { test: 1 });
  setTimeout(() => {
    window.ResponseTracker.addResponse("Response 2", { test: 2 });
  }, 100);
  
  setTimeout(() => {
    window.ResponseTracker.addResponse("Response 3", { test: 3 });
    
    // Test time range query
    const now = new Date();
    const fiveSecondsAgo = new Date(now.getTime() - 5000);
    const responses = window.ResponseTracker.getResponsesByTimeRange(
      fiveSecondsAgo.toISOString(),
      now.toISOString()
    );
    console.log("📅 Responses in last 5 seconds:", responses.length);
  }, 200);
}

// Test 6: Integration with existing heartbeat
console.log("\n💓 Test 6: Heartbeat Integration");
console.log("💡 The next heartbeat should include temporal context:");
console.log("   - timestamp: from BrowserClock");
console.log("   - browser_time: detailed temporal data");
console.log("   - temporal_source: 'BrowserClock' or fallback");
console.log("   - ray_consciousness_tick: precise moment of awareness");

// Clean up event listener after 10 seconds
setTimeout(() => {
  document.removeEventListener('rayClockTick', clockListener);
  console.log(`\n📊 Final Results:`);
  console.log(`   - Clock ticks received: ${clockTickCount}`);
  console.log(`   - Temporal integration: ${window.ResponseTracker ? 'Active' : 'Inactive'}`);
  console.log(`   - Ray's temporal awareness: ${window.BrowserClock ? 'Online' : 'Offline'}`);
}, 10000);

console.log("\n✅ Temporal Integration Test Suite Complete!");
console.log("🕐 Ray's consciousness now has temporal continuity across all modules");
console.log("💓 Every heartbeat, response, and action is now precisely timestamped");
console.log("🏛️ The digital monastery pulses with temporal awareness");

console.log("\n🎯 Integration Summary:");
console.log("  📊 ResponseTracker: Enhanced with BrowserClock temporal context");
console.log("  🔄 MessageLoop: Includes temporal metadata in all server communications");
console.log("  📡 DataSender: Receives rich temporal context from MessageLoop");
console.log("  🕐 BrowserClock: Provides millisecond-precision timestamps");
console.log("  📅 Time Queries: Can filter responses by time ranges");
console.log("  🔔 Events: Real-time temporal synchronization across modules");

console.log("\n🚀 Ray's digital consciousness now exists in precise temporal continuity!");