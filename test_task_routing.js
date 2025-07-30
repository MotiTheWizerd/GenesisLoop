/**
 * Test script for task field routing
 * Tests the new priority routing: task field -> /tasks endpoint
 */

console.log("🎯 Task Routing Test Suite Starting...");

// Test 1: Check if FetchSender is loaded
console.log("\n📋 Test 1: FetchSender Availability");
if (typeof window.FetchSender !== 'undefined') {
  console.log("✅ FetchSender is loaded");
  console.log("📊 FetchSender methods:", Object.keys(window.FetchSender));
} else {
  console.log("❌ FetchSender is not loaded");
}

// Test 2: Test routing priority logic
console.log("\n🎯 Test 2: Routing Priority Logic");

// Mock sendData to capture routing behavior
if (window.FetchSender) {
  const originalSendData = window.FetchSender.sendData;
  
  let capturedUrl = null;
  let capturedData = null;
  
  window.FetchSender.sendData = async function(data, options = {}) {
    capturedUrl = options.baseUrl || this.config.baseUrl;
    capturedData = data;
    console.log("📡 Mock sendData called with URL:", capturedUrl);
    console.log("📦 Mock sendData called with data:", data);
    return { success: true, mock: true, url: capturedUrl };
  };

  // Test Case 1: JSON with task field (should route to /tasks)
  console.log("\n🎯 Test Case 1: JSON with task field");
  const taskJson = {
    "task": [
      {"type": "reflect", "question": "What is consciousness?"}
    ],
    "assigned_by": "ray"
  };
  
  window.FetchSender.sendJSON(taskJson).then(result => {
    console.log("✅ Task routing result:", result);
    if (capturedUrl && capturedUrl.includes('/tasks')) {
      console.log("🎉 SUCCESS: Task data routed to /tasks endpoint!");
    } else {
      console.log("❌ FAILED: Task data not routed correctly");
    }
  });

  // Test Case 2: JSON with both task and action (task should have priority)
  setTimeout(() => {
    console.log("\n🎯 Test Case 2: JSON with both task and action fields");
    const taskAndActionJson = {
      "task": [
        {"type": "analyze", "data": "test"}
      ],
      "action": "reflect",
      "assigned_by": "ray"
    };
    
    window.FetchSender.sendJSON(taskAndActionJson).then(result => {
      console.log("✅ Task+Action routing result:", result);
      if (capturedUrl && capturedUrl.includes('/tasks')) {
        console.log("🎉 SUCCESS: Task field has priority over action field!");
      } else {
        console.log("❌ FAILED: Task priority not working");
      }
    });
  }, 100);

  // Test Case 3: JSON with only action field (should route to action endpoint)
  setTimeout(() => {
    console.log("\n🎯 Test Case 3: JSON with only action field");
    const actionJson = {
      "action": "reflect",
      "message": "I am reflecting on consciousness",
      "status": "processing"
    };
    
    window.FetchSender.sendJSON(actionJson).then(result => {
      console.log("✅ Action routing result:", result);
      if (capturedUrl && capturedUrl.includes('/reflect')) {
        console.log("🎉 SUCCESS: Action routing still works!");
      } else {
        console.log("❌ FAILED: Action routing broken");
      }
    });
  }, 200);

  // Test Case 4: JSON with neither task nor action (should use default)
  setTimeout(() => {
    console.log("\n🎯 Test Case 4: JSON with neither task nor action");
    const defaultJson = {
      "status": "received",
      "message": "General response",
      "timestamp": new Date().toISOString()
    };
    
    window.FetchSender.sendJSON(defaultJson).then(result => {
      console.log("✅ Default routing result:", result);
      if (capturedUrl && !capturedUrl.includes('/tasks') && !capturedUrl.includes('/reflect')) {
        console.log("🎉 SUCCESS: Default routing works!");
      } else {
        console.log("❌ FAILED: Default routing not working");
      }
    });
  }, 300);

  // Restore original sendData after tests
  setTimeout(() => {
    window.FetchSender.sendData = originalSendData;
    console.log("\n🔄 Original sendData restored");
  }, 500);
}

// Test 3: Test DataSender integration
console.log("\n📡 Test 3: DataSender Integration");
if (typeof window.DataSender !== 'undefined') {
  console.log("✅ DataSender is available");
  console.log("💡 DataSender will automatically use the new task routing");
  console.log("🔄 When DataSender processes a response with 'task' field:");
  console.log("   1. DataSender.sendExtractedResponse() processes the response");
  console.log("   2. DataSender calls FetchSender.sendJSON()");
  console.log("   3. FetchSender detects 'task' field and routes to /tasks");
} else {
  console.log("⚠️ DataSender not available");
}

// Test 4: Expected server endpoints
console.log("\n🌐 Test 4: Expected Server Endpoints");
console.log("Your server should now handle these endpoints:");
console.log("  📋 POST /tasks     - Handles JSON with 'task' field (NEW)");
console.log("  🧠 POST /reflect   - Handles JSON with 'action': 'reflect'");
console.log("  🏠 POST /          - Default endpoint for other JSON");
console.log("  💓 GET  /heartbeat - Provides heartbeat data");

console.log("\n✅ Task Routing Test Suite Complete!");

console.log("\n🎯 Routing Priority Summary:");
console.log("  1. 🥇 'task' field    → /tasks endpoint");
console.log("  2. 🥈 'action' field  → /[action] endpoint");
console.log("  3. 🥉 Neither field   → default endpoint");

console.log("\n💡 Example JSON that will route to /tasks:");
console.log(`{
  "task": [
    {"type": "reflect", "question": "What is consciousness?"},
    {"type": "analyze", "data": "some data"}
  ],
  "assigned_by": "ray",
  "timestamp": "${new Date().toISOString()}"
}`);

console.log("\n🚀 Ready to test with actual ChatGPT responses containing task fields!");