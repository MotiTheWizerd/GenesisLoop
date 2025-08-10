/**
 * Test Ray Chat Response System
 * Verifies that Ray can send messages and see responses in ChatGPT chat
 */

console.log("💬 Testing Ray Chat Response System...");

// Test 1: Direct message to chat
console.log("\n📤 Test 1: Sending direct message to ChatGPT chat");

if (window.RayAgentChatHelper) {
  console.log("✅ RayAgentChatHelper is available");
  
  // Test sending a message to chat
  window.RayAgentChatHelper.testChatResponse()
    .then(result => {
      console.log("✅ Chat response test result:", result);
      if (result.success) {
        console.log("💬 Ray should see the test message in ChatGPT chat!");
      } else {
        console.log("❌ Chat response test failed:", result.error);
      }
    })
    .catch(error => {
      console.error("❌ Chat response test error:", error);
    });
} else {
  console.log("❌ RayAgentChatHelper not available");
}

// Test 2: Agent creation with chat response
setTimeout(() => {
  console.log("\n🤖 Test 2: Creating agent with chat response");
  
  if (window.RayAgentChatHelper) {
    // Create a test agent
    window.RayAgentChatHelper.createAgentWithChatResponse(
      "TestAgent",
      "You are a test agent created to verify the chat response system works.",
      "Test agent for chat response verification"
    )
    .then(result => {
      console.log("✅ Test agent creation sent:", result);
      console.log("💬 Ray should see the agent creation response in ChatGPT chat!");
    })
    .catch(error => {
      console.error("❌ Test agent creation failed:", error);
      console.log("💬 Ray should see the error message in ChatGPT chat!");
    });
  }
}, 3000);

// Test 3: Task with chat response
setTimeout(() => {
  console.log("\n📋 Test 3: Sending task with chat response");
  
  if (window.RayAgentChatHelper) {
    const testTask = {
      task: [{
        action: "test_chat_response",
        message: "This is a test task to verify chat responses work",
        assigned_by: "ray",
        timestamp: new Date().toISOString()
      }]
    };
    
    window.RayAgentChatHelper.sendTaskWithChatResponse(testTask)
      .then(result => {
        console.log("✅ Test task sent:", result);
        console.log("💬 Ray should see the task response in ChatGPT chat!");
      })
      .catch(error => {
        console.error("❌ Test task failed:", error);
        console.log("💬 Ray should see the error message in ChatGPT chat!");
      });
  }
}, 6000);

// Test 4: Verify MessageSender is working
setTimeout(() => {
  console.log("\n📨 Test 4: Verifying MessageSender functionality");
  
  if (window.MessageSender) {
    console.log("✅ MessageSender is available");
    
    // Test direct MessageSender call
    const testMessage = `🧪 Direct MessageSender test - ${new Date().toISOString()}`;
    
    window.MessageSender.sendTestMessage(testMessage)
      .then(result => {
        console.log("✅ Direct MessageSender test successful:", result);
        console.log("💬 Ray should see this direct message in ChatGPT chat!");
      })
      .catch(error => {
        console.error("❌ Direct MessageSender test failed:", error);
      });
  } else {
    console.log("❌ MessageSender not available");
  }
}, 9000);

console.log("\n💡 Ray Chat Response Test Summary:");
console.log("  💬 All responses should appear in ChatGPT chat interface");
console.log("  🔍 Ray should see test messages, agent creation confirmations, and task results");
console.log("  ❌ If Ray doesn't see messages in chat, check MessageSender functionality");
console.log("  ✅ If Ray sees messages in chat, the system is working correctly");
console.log("\n⏳ Running tests... check ChatGPT chat for messages in 15 seconds");