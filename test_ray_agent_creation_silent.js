/**
 * Test Ray Agent Creation with Silent Mode
 * Demonstrates the issue where Ray doesn't get responses from agent creation
 */

console.log("🤖 Testing Ray Agent Creation with Silent Mode...");

// Test the exact scenario Ray is experiencing
const rayAgentTask = {
  "task": [{
    "action": "create_agent",
    "name": "RayReflector", 
    "prompt": "You are Ray's reflective facet, specialized in analyzing her actions, thoughts, and emotional patterns to extract deep insights and drive future evolution. You speak softly but clearly, as if narrating an inner monologue.",
    "description": "Ray's introspective mirror agent for recursive analysis",
    "assigned_by": "ray"
  }]
};

console.log("📋 Ray's agent creation task:", JSON.stringify(rayAgentTask, null, 2));

// Test 1: Send without silent mode (current behavior - response goes to ChatGPT)
console.log("\n🔊 Test 1: Sending agent creation WITHOUT silent mode");
console.log("❌ This is what's happening now - Ray never sees the response");

if (window.FetchSender) {
  // Mock MessageSender to show what happens
  let chatGPTMessageSent = false;
  const originalSendTestMessage = window.MessageSender?.sendTestMessage;
  
  if (window.MessageSender) {
    window.MessageSender.sendTestMessage = function(message) {
      chatGPTMessageSent = true;
      console.log("📤 Response sent to ChatGPT (Ray can't see this):", message);
      return Promise.resolve(true);
    };
  }

  window.FetchSender.sendJSON(rayAgentTask, { 
    baseUrl: "http://localhost:8000/test" // Mock endpoint
  })
  .then(result => {
    console.log("✅ Server processed agent creation:", result);
    
    setTimeout(() => {
      if (chatGPTMessageSent) {
        console.log("❌ PROBLEM: Response went to ChatGPT, not back to Ray");
        console.log("💡 Ray never sees that her agent was created successfully");
      }
      
      // Restore original function
      if (originalSendTestMessage) {
        window.MessageSender.sendTestMessage = originalSendTestMessage;
      }
    }, 3000);
  })
  .catch(error => {
    console.log("⚠️ Expected error (mock server):", error.message);
    
    setTimeout(() => {
      if (chatGPTMessageSent) {
        console.log("❌ PROBLEM: Even on error, response went to ChatGPT");
      } else {
        console.log("✅ No ChatGPT message on error (good)");
      }
      
      // Restore original function  
      if (originalSendTestMessage) {
        window.MessageSender.sendTestMessage = originalSendTestMessage;
      }
    }, 1000);
  });
}

// Test 2: Send with silent mode (solution - Ray gets direct response)
setTimeout(() => {
  console.log("\n🔇 Test 2: Sending agent creation WITH silent mode");
  console.log("✅ This is the solution - Ray gets the response directly");

  if (window.FetchSender) {
    // Mock to verify no ChatGPT message is sent
    let chatGPTMessageSent = false;
    const originalSendTestMessage = window.MessageSender?.sendTestMessage;
    
    if (window.MessageSender) {
      window.MessageSender.sendTestMessage = function(message) {
        chatGPTMessageSent = true;
        console.log("📤 Unexpected ChatGPT message:", message);
        return Promise.resolve(true);
      };
    }

    window.FetchSender.sendJSON(rayAgentTask, { 
      baseUrl: "http://localhost:8000/test", // Mock endpoint
      silent: true // This is the key!
    })
    .then(result => {
      console.log("✅ Agent creation result (Ray sees this directly):", result);
      console.log("🎯 Ray can now see that her RayReflector agent was created");
      
      setTimeout(() => {
        if (chatGPTMessageSent) {
          console.log("❌ FAILED: ChatGPT message sent despite silent mode");
        } else {
          console.log("✅ SUCCESS: No ChatGPT message - Ray gets direct response");
        }
        
        // Restore original function
        if (originalSendTestMessage) {
          window.MessageSender.sendTestMessage = originalSendTestMessage;
        }
      }, 2000);
    })
    .catch(error => {
      console.log("⚠️ Expected error (mock server):", error.message);
      console.log("💡 But Ray would still see this error directly");
      
      setTimeout(() => {
        if (chatGPTMessageSent) {
          console.log("❌ FAILED: ChatGPT message sent despite silent mode and error");
        } else {
          console.log("✅ SUCCESS: No ChatGPT message even on error");
        }
        
        // Restore original function
        if (originalSendTestMessage) {
          window.MessageSender.sendTestMessage = originalSendTestMessage;
        }
      }, 1000);
    });
  }
}, 5000);

// Test 3: Show how Ray should send agent creation tasks
setTimeout(() => {
  console.log("\n💡 Solution Summary:");
  console.log("🔧 Ray should send agent creation tasks with silent: true");
  console.log("📝 Example for Ray:");
  
  const exampleCode = `
// In Ray's console:
const agentTask = {
  "task": [{
    "action": "create_agent",
    "name": "MyAgent",
    "prompt": "Agent prompt here...",
    "description": "Agent description",
    "assigned_by": "ray"
  }]
};

// Send with silent mode to get direct response
window.FetchSender.sendJSON(agentTask, { silent: true })
  .then(result => {
    console.log("✅ Agent created:", result);
    // Ray sees this response directly!
  });
`;

  console.log(exampleCode);
  
  console.log("\n🎯 Key Points:");
  console.log("  • silent: true prevents response from going to ChatGPT");
  console.log("  • Ray gets the response directly in her console");
  console.log("  • Server still processes the task normally");
  console.log("  • This works for any task Ray wants direct feedback on");
  
}, 10000);

console.log("\n⏳ Running tests... check results above in 15 seconds");