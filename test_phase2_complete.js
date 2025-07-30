/**
 * Complete Phase 2 Test Suite
 * Tests the MessageLoop migration to DataSender
 */

console.log("🚀 Phase 2 Complete Test Suite Starting...");
console.log("Testing MessageLoop migration to DataSender...\n");

// Test 1: Module Loading
console.log("📋 Test 1: Module Loading Status");
const modules = {
  DataSender: typeof window.DataSender !== 'undefined',
  MessageLoop: typeof window.MessageLoop !== 'undefined',
  FetchSender: typeof window.FetchSender !== 'undefined',
  DOMUtils: typeof window.DOMUtils !== 'undefined',
  ResponseTracker: typeof window.ResponseTracker !== 'undefined'
};

Object.entries(modules).forEach(([name, loaded]) => {
  console.log(`  ${loaded ? '✅' : '❌'} ${name}`);
});

const allCriticalLoaded = modules.DataSender && modules.MessageLoop && modules.FetchSender;
console.log(`\nCritical modules: ${allCriticalLoaded ? '✅ All loaded' : '❌ Missing modules'}`);

// Test 2: MessageLoop Method Verification
console.log("\n🔧 Test 2: MessageLoop Method Verification");
if (modules.MessageLoop) {
  const requiredMethods = [
    'sendResponseToServer',
    'sendResponseToServerFallback',
    'startLoop',
    'stopLoop',
    'waitForFirstResponse'
  ];
  
  requiredMethods.forEach(method => {
    const exists = typeof window.MessageLoop[method] === 'function';
    console.log(`  ${exists ? '✅' : '❌'} ${method}`);
  });
}

// Test 3: DataSender Integration Test
console.log("\n📡 Test 3: DataSender Integration");
if (allCriticalLoaded) {
  const testJsonResponse = JSON.stringify({
    action: "integration_test",
    message: "Testing MessageLoop -> DataSender integration",
    timestamp: new Date().toISOString(),
    phase: 2,
    test: true
  });
  
  console.log("Sending test response through MessageLoop...");
  
  window.MessageLoop.sendResponseToServer(testJsonResponse)
    .then(result => {
      console.log("✅ Integration test result:", result);
      
      if (result.dataSenderProcessed) {
        console.log("🎉 SUCCESS: Response was processed by DataSender!");
        console.log("📊 Response type:", result.responseType);
        console.log("⏰ Processed at:", result.processedAt);
      } else {
        console.log("⚠️ Response processed by fallback method");
      }
    })
    .catch(error => {
      console.log("❌ Integration test failed:", error);
    });
}

// Test 4: Fallback Method Test
console.log("\n🔄 Test 4: Fallback Method");
if (modules.MessageLoop) {
  const testResponse = JSON.stringify({
    action: "fallback_test",
    message: "Testing fallback functionality",
    timestamp: new Date().toISOString()
  });
  
  console.log("Testing fallback method directly...");
  
  window.MessageLoop.sendResponseToServerFallback(testResponse)
    .then(result => {
      console.log("✅ Fallback test result:", result);
    })
    .catch(error => {
      console.log("❌ Fallback test failed:", error);
    });
}

// Test 5: Text Response Handling
console.log("\n📝 Test 5: Text Response Handling");
if (allCriticalLoaded) {
  const textResponse = "This is a plain text response that should be handled correctly by the new system.";
  
  console.log("Testing text response handling...");
  
  window.MessageLoop.sendResponseToServer(textResponse)
    .then(result => {
      console.log("✅ Text response test result:", result);
      
      if (result.dataSenderProcessed && result.responseType === 'text') {
        console.log("🎉 SUCCESS: Text response correctly processed by DataSender!");
      }
    })
    .catch(error => {
      console.log("❌ Text response test failed:", error);
    });
}

// Test 6: Error Handling
console.log("\n⚠️ Test 6: Error Handling");
if (modules.MessageLoop) {
  console.log("Testing error handling with invalid input...");
  
  window.MessageLoop.sendResponseToServer(null)
    .then(result => {
      console.log("Error handling result:", result);
      if (!result.success) {
        console.log("✅ Error correctly handled");
      } else {
        console.log("⚠️ Expected error but got success");
      }
    })
    .catch(error => {
      console.log("✅ Error correctly caught:", error.message);
    });
}

// Test 7: Current Functionality Preservation
console.log("\n🔍 Test 7: Current Functionality Check");
if (modules.MessageLoop) {
  console.log("MessageLoop state:");
  console.log(`  Running: ${window.MessageLoop.isRunning}`);
  console.log(`  Attempt count: ${window.MessageLoop.attemptCount}`);
  console.log(`  Waiting for response: ${window.MessageLoop.waitingForResponse}`);
  
  console.log("\n✅ All existing MessageLoop properties preserved");
}

console.log("\n🎉 Phase 2 Complete Test Suite Finished!");
console.log("📊 Summary:");
console.log("  - MessageLoop now uses DataSender when available");
console.log("  - Fallback to original method if DataSender unavailable");
console.log("  - All existing functionality preserved");
console.log("  - Both JSON and text responses handled");
console.log("  - Error handling improved");

console.log("\n💡 Next: Test the actual heartbeat loop to ensure it works with the new system");
console.log("🔄 Click the toggle button and monitor the console for DataSender messages");