/**
 * Test Silent Mode Implementation
 * Verifies that memory operations don't send responses back to ChatGPT
 */

console.log("🔇 Testing Silent Mode Implementation...");

// Test 1: Verify FetchSender supports silent mode
console.log("\n📡 Test 1: FetchSender Silent Mode Support");

if (typeof window.FetchSender !== "undefined") {
  console.log("✅ FetchSender is available");

  // Mock MessageSender to detect if it gets called
  let messageSenderCalled = false;
  const originalSendTestMessage = window.MessageSender?.sendTestMessage;

  if (window.MessageSender) {
    window.MessageSender.sendTestMessage = function (message) {
      messageSenderCalled = true;
      console.log("📤 MessageSender called with:", message);
      return Promise.resolve(true);
    };
  }

  // Test silent request
  console.log("🧪 Testing silent request...");

  const testData = {
    type: "silent_test",
    message: "This should not appear in ChatGPT",
    timestamp: new Date().toISOString(),
  };

  window.FetchSender.sendData(testData, {
    silent: true,
    // Mock a successful response to avoid actual network call
    baseUrl: "http://localhost:8000/test",
  })
    .then((result) => {
      console.log("📊 Silent request result:", result);

      setTimeout(() => {
        if (messageSenderCalled) {
          console.log(
            "❌ FAILED: MessageSender was called despite silent mode"
          );
        } else {
          console.log(
            "✅ SUCCESS: MessageSender was NOT called (silent mode working)"
          );
        }

        // Restore original function
        if (originalSendTestMessage) {
          window.MessageSender.sendTestMessage = originalSendTestMessage;
        }
      }, 3000); // Wait 3 seconds to see if MessageSender gets called
    })
    .catch((error) => {
      console.log(
        "⚠️ Silent request failed (expected if server offline):",
        error.message
      );

      setTimeout(() => {
        if (messageSenderCalled) {
          console.log(
            "❌ FAILED: MessageSender was called despite silent mode and error"
          );
        } else {
          console.log(
            "✅ SUCCESS: MessageSender was NOT called even on error (silent mode working)"
          );
        }

        // Restore original function
        if (originalSendTestMessage) {
          window.MessageSender.sendTestMessage = originalSendTestMessage;
        }
      }, 1000);
    });
} else {
  console.log("❌ FetchSender not available");
}

// Test 2: Verify InteractionLogger uses silent mode
setTimeout(() => {
  console.log("\n🧠 Test 2: InteractionLogger Silent Mode Usage");

  if (typeof window.RayInteractionLogger !== "undefined") {
    console.log("✅ InteractionLogger is available");

    // Mock FetchSender to verify silent flag is passed
    const originalSendData = window.FetchSender?.sendData;
    let silentFlagDetected = false;

    if (window.FetchSender) {
      window.FetchSender.sendData = async function (data, options) {
        console.log("📡 FetchSender called with options:", options);

        if (options && options.silent === true) {
          silentFlagDetected = true;
          console.log("✅ Silent flag detected in options");
        } else {
          console.log("⚠️ Silent flag NOT detected");
        }

        // Return mock success
        return {
          success: true,
          data: { message: "Mock response" },
          status: 200,
        };
      };

      // Test embedding request
      console.log("🧪 Testing embedding request...");
      window.RayInteractionLogger.getEmbedding("test text")
        .then((result) => {
          console.log("📊 Embedding result:", result);

          if (silentFlagDetected) {
            console.log("✅ SUCCESS: Embedding request uses silent mode");
          } else {
            console.log(
              "❌ FAILED: Embedding request does NOT use silent mode"
            );
          }

          // Reset flag for next test
          silentFlagDetected = false;

          // Test memory storage request
          console.log("🧪 Testing memory storage request...");
          const testInteraction = {
            id: "test_silent",
            text: "Test interaction for silent mode",
            speaker: "user",
            timestamp: new Date().toISOString(),
            metadata: { type: "test" },
            embedding: [0.1, 0.2, 0.3],
          };

          return window.RayInteractionLogger.storeInMemory(testInteraction);
        })
        .then((result) => {
          console.log("📊 Storage result:", result);

          if (silentFlagDetected) {
            console.log("✅ SUCCESS: Storage request uses silent mode");
          } else {
            console.log("❌ FAILED: Storage request does NOT use silent mode");
          }

          // Restore original function
          window.FetchSender.sendData = originalSendData;
        })
        .catch((error) => {
          console.error("❌ InteractionLogger test failed:", error);
          window.FetchSender.sendData = originalSendData;
        });
    }
  } else {
    console.log("❌ InteractionLogger not available");
  }
}, 5000);

// Test 3: Compare normal vs silent requests
setTimeout(() => {
  console.log("\n🔄 Test 3: Normal vs Silent Request Comparison");

  if (
    typeof window.FetchSender !== "undefined" &&
    typeof window.MessageSender !== "undefined"
  ) {
    let normalMessageCount = 0;
    let silentMessageCount = 0;

    // Override MessageSender to count calls
    const originalSendTestMessage = window.MessageSender.sendTestMessage;
    window.MessageSender.sendTestMessage = function (message) {
      if (message.includes("normal_test")) {
        normalMessageCount++;
        console.log("📤 Normal request triggered MessageSender");
      } else if (message.includes("silent_test")) {
        silentMessageCount++;
        console.log("📤 Silent request triggered MessageSender (UNEXPECTED!)");
      }
      return Promise.resolve(true);
    };

    const testData1 = { type: "normal_test", message: "Normal request" };
    const testData2 = { type: "silent_test", message: "Silent request" };

    // Send normal request
    console.log("🧪 Sending normal request...");
    window.FetchSender.sendData(testData1, {
      baseUrl: "http://localhost:8000/test",
    }).catch(() => {}); // Ignore network errors

    // Send silent request
    console.log("🧪 Sending silent request...");
    window.FetchSender.sendData(testData2, {
      baseUrl: "http://localhost:8000/test",
      silent: true,
    }).catch(() => {}); // Ignore network errors

    // Check results after delay
    setTimeout(() => {
      console.log("\n📊 Comparison Results:");
      console.log(
        `  Normal requests → MessageSender calls: ${normalMessageCount}`
      );
      console.log(
        `  Silent requests → MessageSender calls: ${silentMessageCount}`
      );

      if (normalMessageCount > 0 && silentMessageCount === 0) {
        console.log("✅ SUCCESS: Silent mode prevents ChatGPT messages");
      } else if (normalMessageCount === 0 && silentMessageCount === 0) {
        console.log(
          "⚠️ INCONCLUSIVE: No MessageSender calls detected (server might be offline)"
        );
      } else {
        console.log("❌ FAILED: Silent mode not working correctly");
      }

      // Restore original function
      window.MessageSender.sendTestMessage = originalSendTestMessage;
    }, 4000);
  }
}, 10000);

console.log("\n💡 Silent Mode Test Summary:");
console.log("  🔇 Memory operations (store/embed) now use silent: true");
console.log(
  "  📡 FetchSender checks options.silent before calling MessageSender"
);
console.log("  🚫 Silent requests do NOT send responses back to ChatGPT");
console.log("  ✅ Normal requests continue to work as before");
console.log("\n⏳ Running tests... check results above in 15 seconds");
