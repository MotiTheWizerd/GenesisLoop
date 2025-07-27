/**
 * Test script for DataSender functionality
 * Run this in the browser console on ChatGPT page after extension loads
 */

console.log("🧪 DataSender Test Suite Starting...");

// Test 1: Check if DataSender is loaded
console.log("\n📋 Test 1: DataSender Availability");
if (typeof window.DataSender !== 'undefined') {
  console.log("✅ DataSender is loaded");
  console.log("📊 DataSender methods:", Object.keys(window.DataSender));
} else {
  console.log("❌ DataSender is not loaded");
}

// Test 2: Check configuration
console.log("\n⚙️ Test 2: Configuration");
if (window.DataSender) {
  const config = window.DataSender.getConfig();
  console.log("Current config:", config);
  
  // Test config update
  window.DataSender.updateConfig({ testMode: true });
  console.log("After update:", window.DataSender.getConfig());
}

// Test 3: Test JSON response processing
console.log("\n📋 Test 3: JSON Response Processing");
if (window.DataSender) {
  const testJsonResponse = JSON.stringify({
    action: "test",
    message: "This is a test message from DataSender",
    timestamp: new Date().toISOString(),
    data: {
      test: true,
      value: 42
    }
  });
  
  console.log("Test JSON response:", testJsonResponse);
  
  // Test the processing (without actually sending)
  window.DataSender.processResponse(testJsonResponse, { source: 'test' })
    .then(processed => {
      console.log("✅ JSON processing result:", processed);
    })
    .catch(error => {
      console.log("❌ JSON processing failed:", error);
    });
}

// Test 4: Test text response processing
console.log("\n📝 Test 4: Text Response Processing");
if (window.DataSender) {
  const testTextResponse = "This is a plain text response from ChatGPT that is not JSON.";
  
  console.log("Test text response:", testTextResponse);
  
  window.DataSender.processResponse(testTextResponse, { source: 'test' })
    .then(processed => {
      console.log("✅ Text processing result:", processed);
    })
    .catch(error => {
      console.log("❌ Text processing failed:", error);
    });
}

// Test 5: Check FetchSender dependency
console.log("\n🔗 Test 5: FetchSender Dependency");
if (typeof window.FetchSender !== 'undefined') {
  console.log("✅ FetchSender is available");
  console.log("📊 FetchSender methods:", Object.keys(window.FetchSender));
} else {
  console.log("❌ FetchSender is not available - DataSender will fail");
}

// Test 6: Full integration test (commented out to avoid actual server calls)
console.log("\n🚀 Test 6: Full Integration Test");
console.log("ℹ️ Uncomment the following code to test actual sending:");
console.log("// window.DataSender.test();");

console.log("\n✅ DataSender Test Suite Complete");
console.log("💡 To run the full integration test, execute: window.DataSender.test()");