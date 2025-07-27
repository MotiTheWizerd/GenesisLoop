/**
 * Test script for action-based routing system
 * Run this in the browser console on ChatGPT page after extension is loaded
 */

console.log("🧪 Testing Action-Based Routing System");

// Test 1: Check if FetchSender is loaded with new methods
console.log("\n📋 Test 1: FetchSender Module Check");
console.log("FetchSender loaded:", typeof window.FetchSender !== 'undefined');
console.log("sendJSONWithAction method:", typeof window.FetchSender?.sendJSONWithAction);
console.log("addActionRoute method:", typeof window.FetchSender?.addActionRoute);
console.log("getActionRoutes method:", typeof window.FetchSender?.getActionRoutes);

// Test 2: Check default action routes
console.log("\n🗺️ Test 2: Default Action Routes");
if (window.FetchSender) {
  const routes = window.FetchSender.getActionRoutes();
  console.log("Default routes:", routes);
  console.log("Reflect route configured:", routes.reflect === 'reflect');
}

// Test 3: Test action route management
console.log("\n⚙️ Test 3: Route Management");
if (window.FetchSender) {
  // Add a test route
  window.FetchSender.addActionRoute("test", "test-endpoint");
  console.log("After adding test route:", window.FetchSender.getActionRoutes());
  
  // Remove the test route
  window.FetchSender.removeActionRoute("test");
  console.log("After removing test route:", window.FetchSender.getActionRoutes());
}

// Test 4: Test JSON routing logic
console.log("\n🎯 Test 4: JSON Routing Logic");

// Mock sendData to capture routing behavior
if (window.FetchSender) {
  const originalSendData = window.FetchSender.sendData;
  let capturedUrl = null;
  
  window.FetchSender.sendData = async function(data, options = {}) {
    capturedUrl = options.baseUrl || this.config.baseUrl;
    console.log("📡 Mock sendData called with URL:", capturedUrl);
    console.log("📦 Mock sendData called with data:", data);
    return { success: true, mock: true };
  };
  
  // Test reflect action routing
  console.log("\n🧠 Testing reflect action:");
  window.FetchSender.sendJSON({
    action: "reflect",
    message: "Test reflection",
    status: "success"
  }).then(() => {
    console.log("✅ Reflect action routed to:", capturedUrl);
    console.log("Expected: http://localhost:8000/reflect");
    console.log("Correct routing:", capturedUrl === "http://localhost:8000/reflect");
  });
  
  // Test unknown action routing
  setTimeout(() => {
    console.log("\n❓ Testing unknown action:");
    window.FetchSender.sendJSON({
      action: "unknown",
      message: "Test unknown action"
    }).then(() => {
      console.log("✅ Unknown action routed to:", capturedUrl);
      console.log("Expected: http://localhost:8000/ (default)");
      console.log("Correct fallback:", capturedUrl === "http://localhost:8000/");
    });
  }, 100);
  
  // Test no action routing
  setTimeout(() => {
    console.log("\n📝 Testing no action field:");
    window.FetchSender.sendJSON({
      message: "Test no action",
      type: "general"
    }).then(() => {
      console.log("✅ No action routed to:", capturedUrl);
      console.log("Expected: http://localhost:8000/ (default)");
      console.log("Correct default:", capturedUrl === "http://localhost:8000/");
      
      // Restore original sendData
      window.FetchSender.sendData = originalSendData;
      console.log("\n🔄 Original sendData restored");
    });
  }, 200);
}

// Test 5: Test heartbeat URL construction
console.log("\n💓 Test 5: Heartbeat URL Construction");
if (window.FetchSender) {
  console.log("Base URL:", window.FetchSender.config.baseUrl);
  console.log("Expected heartbeat URL: http://localhost:8000/heartbeat");
  
  // Test heartbeat (will fail if server not running, but we can see the URL)
  window.FetchSender.getHeartbeat().then(result => {
    console.log("✅ Heartbeat test result:", result);
  }).catch(error => {
    console.log("⚠️ Heartbeat failed (expected if server not running):", error.message);
  });
}

console.log("\n🎉 Action Routing Tests Complete!");
console.log("Check the console output above for test results.");