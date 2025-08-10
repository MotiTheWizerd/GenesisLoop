/**
 * Test Execute Immediately Default Value
 * Tests that execute_immediately defaults to true when not specified
 */

console.log("🧪 Testing execute_immediately default value behavior");

// Test case 1: Task without execute_immediately field
console.log("\n🎯 Test Case 1: Task without execute_immediately field");
const taskWithoutExecuteImmediately = {
  "task": [
    {
      "action": "reflect",
      "question": "What is consciousness?",
      "assigned_by": "ray"
    }
  ],
  "assigned_by": "ray",
  "timestamp": new Date().toISOString()
};

console.log("📋 Original task object:", JSON.stringify(taskWithoutExecuteImmediately, null, 2));

// Test case 2: Task with execute_immediately explicitly set to false
console.log("\n🎯 Test Case 2: Task with execute_immediately explicitly set to false");
const taskWithExecuteImmediatelyFalse = {
  "task": [
    {
      "action": "reflect", 
      "question": "What is consciousness?",
      "assigned_by": "ray"
    }
  ],
  "assigned_by": "ray",
  "execute_immediately": false,
  "timestamp": new Date().toISOString()
};

console.log("📋 Task with execute_immediately: false:", JSON.stringify(taskWithExecuteImmediatelyFalse, null, 2));

// Test case 3: Task with execute_immediately explicitly set to true
console.log("\n🎯 Test Case 3: Task with execute_immediately explicitly set to true");
const taskWithExecuteImmediatelyTrue = {
  "task": [
    {
      "action": "reflect",
      "question": "What is consciousness?", 
      "assigned_by": "ray"
    }
  ],
  "assigned_by": "ray",
  "execute_immediately": true,
  "timestamp": new Date().toISOString()
};

console.log("📋 Task with execute_immediately: true:", JSON.stringify(taskWithExecuteImmediatelyTrue, null, 2));

// Function to test the default behavior
async function testExecuteImmediatelyDefault() {
  console.log("\n🚀 Testing FetchSender behavior with different execute_immediately values");
  
  if (typeof window.FetchSender === 'undefined') {
    console.error("❌ FetchSender not available - make sure it's loaded");
    return;
  }

  try {
    // Test 1: Without execute_immediately (should default to true)
    console.log("\n📤 Test 1: Sending task without execute_immediately");
    const result1 = await window.FetchSender.sendJSON(taskWithoutExecuteImmediately, { silent: true });
    console.log("✅ Result 1:", result1);
    console.log("🔍 Task object after processing:", JSON.stringify(taskWithoutExecuteImmediately, null, 2));
    
    // Test 2: With execute_immediately: false (should remain false)
    console.log("\n📤 Test 2: Sending task with execute_immediately: false");
    const result2 = await window.FetchSender.sendJSON(taskWithExecuteImmediatelyFalse, { silent: true });
    console.log("✅ Result 2:", result2);
    console.log("🔍 Task object after processing:", JSON.stringify(taskWithExecuteImmediatelyFalse, null, 2));
    
    // Test 3: With execute_immediately: true (should remain true)
    console.log("\n📤 Test 3: Sending task with execute_immediately: true");
    const result3 = await window.FetchSender.sendJSON(taskWithExecuteImmediatelyTrue, { silent: true });
    console.log("✅ Result 3:", result3);
    console.log("🔍 Task object after processing:", JSON.stringify(taskWithExecuteImmediatelyTrue, null, 2));
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test when FetchSender is available
if (typeof window.FetchSender !== 'undefined') {
  testExecuteImmediatelyDefault();
} else {
  console.log("⏳ Waiting for FetchSender to load...");
  
  // Wait for FetchSender to be available
  const checkInterval = setInterval(() => {
    if (typeof window.FetchSender !== 'undefined') {
      clearInterval(checkInterval);
      console.log("✅ FetchSender loaded, running tests...");
      testExecuteImmediatelyDefault();
    }
  }, 1000);
  
  // Timeout after 10 seconds
  setTimeout(() => {
    clearInterval(checkInterval);
    console.error("❌ Timeout: FetchSender not loaded within 10 seconds");
  }, 10000);
}

console.log("\n📋 Test Summary:");
console.log("  - Test 1: Task without execute_immediately should default to true");
console.log("  - Test 2: Task with execute_immediately: false should remain false");
console.log("  - Test 3: Task with execute_immediately: true should remain true");
console.log("\n💡 Expected behavior:");
console.log("  - Only tasks without execute_immediately field should get the default value");
console.log("  - Explicitly set values (true or false) should be preserved");