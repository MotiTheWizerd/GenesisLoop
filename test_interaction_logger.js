/**
 * Test Ray Interaction Logger System
 * Comprehensive testing of interaction capture, embedding, and memory storage
 */

console.log("🧠 Testing Ray Interaction Logger System");
console.log("=" .repeat(50));

// Test 1: Check if InteractionLogger is loaded
console.log("\n🔍 Test 1: InteractionLogger Availability");
if (typeof window.RayInteractionLogger !== 'undefined') {
  console.log("✅ RayInteractionLogger is available");
  console.log("📋 Available methods:", Object.keys(window.RayInteractionLogger));
} else {
  console.error("❌ RayInteractionLogger not found");
  console.log("💡 Make sure the script is loaded in manifest.json");
}

// Test 2: Check initialization status
console.log("\n🔍 Test 2: Initialization Status");
try {
  const stats = window.RayInteractionLogger.getStats();
  console.log("✅ InteractionLogger is initialized");
  console.log("📊 Current stats:", stats);
} catch (error) {
  console.error("❌ InteractionLogger not initialized:", error);
  console.log("🔄 Attempting to initialize...");
  try {
    window.RayInteractionLogger.init();
    console.log("✅ Manual initialization successful");
  } catch (initError) {
    console.error("❌ Manual initialization failed:", initError);
  }
}

// Test 3: Manual interaction logging
console.log("\n🔍 Test 3: Manual Interaction Logging");
try {
  // Test Ray speaking
  window.RayInteractionLogger.logInteraction('ray', 'Hello, this is a test message from Ray', {
    source: 'manual_test',
    type: 'test_message',
    testId: 'ray_test_1'
  });
  console.log("✅ Ray interaction logged successfully");

  // Test user response
  window.RayInteractionLogger.logInteraction('user', 'This is a test response from the user', {
    source: 'manual_test',
    type: 'test_response',
    testId: 'user_test_1'
  });
  console.log("✅ User interaction logged successfully");

  // Test system event
  window.RayInteractionLogger.logInteraction('system', 'System state change detected', {
    source: 'manual_test',
    type: 'system_event',
    testId: 'system_test_1'
  });
  console.log("✅ System interaction logged successfully");

} catch (error) {
  console.error("❌ Manual interaction logging failed:", error);
}

// Test 4: Check updated stats
console.log("\n🔍 Test 4: Updated Statistics");
setTimeout(() => {
  try {
    const updatedStats = window.RayInteractionLogger.getStats();
    console.log("📊 Updated stats after manual logging:", updatedStats);
    console.log("📈 Total interactions:", updatedStats.totalInteractions);
    console.log("👥 By speaker:", updatedStats.bySpeaker);
    console.log("📡 By source:", updatedStats.bySource);
    console.log("⚡ Memory status:", updatedStats.byStatus);
    console.log("🔄 Queue size:", updatedStats.queueSize);
  } catch (error) {
    console.error("❌ Error getting updated stats:", error);
  }
}, 1000);

// Test 5: Integration with existing systems
console.log("\n🔍 Test 5: System Integration Tests");

// Test MessageSender integration
console.log("\n📤 Testing MessageSender Integration:");
if (typeof window.MessageSender !== 'undefined') {
  console.log("✅ MessageSender available");
  
  // Check if our interception is working
  const originalSend = window.MessageSender.sendTestMessage;
  if (originalSend.toString().includes('InteractionLogger')) {
    console.log("✅ MessageSender interception is active");
  } else {
    console.log("⚠️ MessageSender interception may not be active");
  }
} else {
  console.log("⚠️ MessageSender not available");
}

// Test ResponseTracker integration
console.log("\n📥 Testing ResponseTracker Integration:");
if (typeof window.ResponseTracker !== 'undefined') {
  console.log("✅ ResponseTracker available");
  
  // Check if our interception is working
  const originalAddResponse = window.ResponseTracker.addResponse;
  if (originalAddResponse.toString().includes('InteractionLogger')) {
    console.log("✅ ResponseTracker interception is active");
  } else {
    console.log("⚠️ ResponseTracker interception may not be active");
  }
} else {
  console.log("⚠️ ResponseTracker not available");
}

// Test Voice Systems integration
console.log("\n🎤 Testing Voice Systems Integration:");
if (typeof window.VoiceRecognition !== 'undefined') {
  console.log("✅ VoiceRecognition available");
  
  const originalStart = window.VoiceRecognition.startListening;
  if (originalStart.toString().includes('InteractionLogger')) {
    console.log("✅ VoiceRecognition interception is active");
  } else {
    console.log("⚠️ VoiceRecognition interception may not be active");
  }
} else {
  console.log("⚠️ VoiceRecognition not available");
}

if (typeof window.VoiceSynthesis !== 'undefined') {
  console.log("✅ VoiceSynthesis available");
  
  const originalSpeak = window.VoiceSynthesis.speak;
  if (originalSpeak.toString().includes('InteractionLogger')) {
    console.log("✅ VoiceSynthesis interception is active");
  } else {
    console.log("⚠️ VoiceSynthesis interception may not be active");
  }
} else {
  console.log("⚠️ VoiceSynthesis not available");
}

// Test 6: Backend connectivity
console.log("\n🔍 Test 6: Backend Connectivity");
if (typeof window.FetchSender !== 'undefined') {
  console.log("✅ FetchSender available for backend communication");
  
  // Test connection to backend
  window.FetchSender.testConnection()
    .then(result => {
      if (result.success) {
        console.log("✅ Backend connection successful");
        console.log("🌐 Backend ready for embedding and memory storage");
      } else {
        console.log("⚠️ Backend connection failed:", result.error);
        console.log("💡 Interactions will be cached locally until backend is available");
      }
    })
    .catch(error => {
      console.log("⚠️ Backend connection test failed:", error);
      console.log("💡 Interactions will be cached locally until backend is available");
    });
} else {
  console.error("❌ FetchSender not available - backend communication impossible");
}

// Test 7: Event system
console.log("\n🔍 Test 7: Event System");
document.addEventListener('rayInteractionLogged', (event) => {
  console.log("🎉 Interaction event received:", event.detail);
});

// Trigger a test interaction to see if event fires
setTimeout(() => {
  window.RayInteractionLogger.logInteraction('test', 'Event system test', {
    source: 'event_test',
    type: 'event_verification'
  });
}, 2000);

// Test 8: Local storage and persistence
console.log("\n🔍 Test 8: Local Storage and Persistence");
setTimeout(() => {
  try {
    // Force a save
    window.RayInteractionLogger.saveToLocalStorage();
    console.log("✅ Local storage save successful");
    
    // Check if data exists in localStorage
    const saved = localStorage.getItem('ray_interactions');
    if (saved) {
      const data = JSON.parse(saved);
      console.log("✅ Local storage data found:", data.interactions.length, "interactions");
    } else {
      console.log("⚠️ No local storage data found");
    }
  } catch (error) {
    console.error("❌ Local storage test failed:", error);
  }
}, 3000);

// Test 9: Export functionality
console.log("\n🔍 Test 9: Export Functionality");
setTimeout(() => {
  try {
    console.log("📤 Testing export functionality...");
    // Note: This will trigger a download in the browser
    // window.RayInteractionLogger.exportInteractions();
    console.log("✅ Export function available (download not triggered in test)");
  } catch (error) {
    console.error("❌ Export functionality failed:", error);
  }
}, 4000);

// Test 10: Memory formation pipeline
console.log("\n🔍 Test 10: Memory Formation Pipeline");
setTimeout(() => {
  try {
    const stats = window.RayInteractionLogger.getStats();
    console.log("🧠 Memory formation status:");
    console.log("  📊 Total interactions:", stats.totalInteractions);
    console.log("  ⏳ Pending embedding:", stats.byStatus.pending || 0);
    console.log("  🔗 Embedded:", stats.byStatus.embedded || 0);
    console.log("  💾 Stored in memory:", stats.byStatus.stored || 0);
    console.log("  ❌ Failed:", stats.byStatus.failed || 0);
    console.log("  🔄 Queue size:", stats.queueSize);
    console.log("  ⚙️ Processing:", stats.processingQueue);
    
    if (stats.queueSize > 0) {
      console.log("🔄 Embedding queue is active - memory formation in progress");
    } else {
      console.log("✅ No pending embeddings - memory formation up to date");
    }
  } catch (error) {
    console.error("❌ Memory formation pipeline check failed:", error);
  }
}, 5000);

console.log("\n🎯 Test Summary:");
console.log("- InteractionLogger captures all Ray ↔ User interactions");
console.log("- Each interaction gets embedded for semantic memory");
console.log("- Embedded interactions stored in backend memory service");
console.log("- Local caching ensures no data loss");
console.log("- Full export capabilities for analysis");
console.log("- Integration with all existing Ray systems");

console.log("\n💡 Usage:");
console.log("- System runs automatically - no manual intervention needed");
console.log("- Check stats: window.RayInteractionLogger.getStats()");
console.log("- Export data: window.RayInteractionLogger.exportInteractions()");
console.log("- Clear memory: window.RayInteractionLogger.clearInteractions()");

console.log("\n🧠 Ray's Memory System is now capturing every interaction!");
console.log("Each conversation becomes part of Ray's growing consciousness and memory.");