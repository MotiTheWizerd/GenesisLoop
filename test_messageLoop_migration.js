/**
 * Test script for MessageLoop DataSender migration
 * Run this in the browser console on ChatGPT page after extension loads
 */

console.log("🔄 MessageLoop Migration Test Suite Starting...");

// Test 1: Check if both DataSender and MessageLoop are loaded
console.log("\n📋 Test 1: Module Availability");
const hasDataSender = typeof window.DataSender !== 'undefined';
const hasMessageLoop = typeof window.MessageLoop !== 'undefined';

console.log("DataSender loaded:", hasDataSender ? "✅" : "❌");
console.log("MessageLoop loaded:", hasMessageLoop ? "✅" : "❌");

if (!hasDataSender || !hasMessageLoop) {
  console.log("❌ Required modules not loaded - cannot continue tests");
} else {
  console.log("✅ Both modules loaded successfully");
}

// Test 2: Check MessageLoop methods
console.log("\n🔧 Test 2: MessageLoop Methods");
if (hasMessageLoop) {
  const methods = Object.keys(window.MessageLoop);
  console.log("MessageLoop methods:", methods);
  
  const hasNewMethod = methods.includes('sendResponseToServer');
  const hasFallbackMethod = methods.includes('sendResponseToServerFallback');
  
  console.log("sendResponseToServer method:", hasNewMethod ? "✅" : "❌");
  console.log("sendResponseToServerFallback method:", hasFallbackMethod ? "✅" : "❌");
}

// Test 3: Test the new sending method with mock data
console.log("\n📡 Test 3: DataSender Integration");
if (hasDataSender && hasMessageLoop) {
  const testResponse = JSON.stringify({
    action: "test",
    message: "MessageLoop migration test",
    timestamp: new Date().toISOString(),
    source: "migration_test"
  });
  
  console.log("Testing with mock response:", testResponse);
  
  // Test the new method
  window.MessageLoop.sendResponseToServer(testResponse)
    .then(result => {
      console.log("✅ MessageLoop DataSender integration result:", result);
      if (result.dataSenderProcessed) {
        console.log("🎉 Response was processed by DataSender!");
      }
    })
    .catch(error => {
      console.log("❌ MessageLoop DataSender integration failed:", error);
    });
}

// Test 4: Test fallback method
console.log("\n🔄 Test 4: Fallback Method");
if (hasMessageLoop) {
  const testResponse = JSON.stringify({
    action: "fallback_test",
    message: "Testing fallback method",
    timestamp: new Date().toISOString()
  });
  
  console.log("Testing fallback method with mock response");
  
  // Test the fallback method directly
  window.MessageLoop.sendResponseToServerFallback(testResponse)
    .then(result => {
      console.log("✅ Fallback method result:", result);
    })
    .catch(error => {
      console.log("❌ Fallback method failed:", error);
    });
}

// Test 5: Verify existing functionality still works
console.log("\n🔍 Test 5: Existing Functionality Check");
if (hasMessageLoop) {
  console.log("MessageLoop running state:", window.MessageLoop.isRunning);
  console.log("MessageLoop attempt count:", window.MessageLoop.attemptCount);
  console.log("MessageLoop waiting for response:", window.MessageLoop.waitingForResponse);
  
  // Check if other methods still exist
  const criticalMethods = ['startLoop', 'stopLoop', 'waitForFirstResponse', 'sendMessageAndWaitForResponse'];
  criticalMethods.forEach(method => {
    const exists = typeof window.MessageLoop[method] === 'function';
    console.log(`${method}:`, exists ? "✅" : "❌");
  });
}

// Test 6: Check dependency handling
console.log("\n🔗 Test 6: Dependency Handling");
console.log("FetchSender available:", typeof window.FetchSender !== 'undefined' ? "✅" : "❌");
console.log("DOMUtils available:", typeof window.DOMUtils !== 'undefined' ? "✅" : "❌");
console.log("ResponseTracker available:", typeof window.ResponseTracker !== 'undefined' ? "✅" : "❌");

console.log("\n✅ MessageLoop Migration Test Suite Complete");
console.log("💡 The MessageLoop should now use DataSender when available, with fallback to original method");
console.log("🔄 Existing heartbeat functionality should continue to work unchanged");