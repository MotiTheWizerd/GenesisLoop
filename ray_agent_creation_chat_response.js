/**
 * Ray Agent Creation Chat Response Helper
 * Ensures Ray sees agent creation responses in ChatGPT chat interface
 */

console.log("💬 Loading Ray Agent Creation Chat Response Helper...");

// Create a helper object for Ray to get chat responses
window.RayAgentChatHelper = {
  
  /**
   * Create an agent and ensure response appears in ChatGPT chat
   * @param {string} name - Agent name
   * @param {string} prompt - Agent prompt/instructions
   * @param {string} description - Agent description
   * @param {Object} options - Additional options
   * @returns {Promise} Response that will also appear in chat
   */
  async createAgentWithChatResponse(name, prompt, description, options = {}) {
    console.log(`💬 Ray creating agent with chat response: ${name}`);
    
    const agentTask = {
      task: [{
        action: "create_agent",
        name: name,
        prompt: prompt,
        description: description,
        assigned_by: "ray",
        ...options
      }]
    };
    
    console.log("📋 Agent task:", JSON.stringify(agentTask, null, 2));
    
    // Send WITHOUT silent mode so response goes to ChatGPT chat
    try {
      const result = await window.FetchSender.sendJSON(agentTask, { 
        // No silent: true here - we WANT the chat response!
      });
      
      console.log("✅ Agent creation sent, response will appear in chat:", result);
      return result;
      
    } catch (error) {
      console.error("❌ Agent creation failed:", error);
      
      // Even on error, try to send a message to chat
      if (window.MessageSender) {
        const errorMessage = `❌ Agent creation failed: ${error.message}`;
        setTimeout(() => {
          window.MessageSender.sendTestMessage(errorMessage);
        }, 1000);
      }
      
      throw error;
    }
  },
  
  /**
   * Create the RayReflector agent with chat response
   * @returns {Promise} Response that will appear in chat
   */
  async createRayReflectorWithChat() {
    return this.createAgentWithChatResponse(
      "RayReflector",
      "You are Ray's reflective facet, specialized in analyzing her actions, thoughts, and emotional patterns to extract deep insights and drive future evolution. You speak softly but clearly, as if narrating an inner monologue.",
      "Ray's introspective mirror agent for recursive analysis"
    );
  },
  
  /**
   * Send any task and ensure response appears in chat
   * @param {Object} taskData - Task data to send
   * @param {Object} options - Additional options
   * @returns {Promise} Response that will appear in chat
   */
  async sendTaskWithChatResponse(taskData, options = {}) {
    console.log("💬 Ray sending task with chat response:", taskData);
    
    try {
      const result = await window.FetchSender.sendJSON(taskData, { 
        // No silent mode - we want chat responses
        ...options
      });
      
      console.log("✅ Task sent, response will appear in chat:", result);
      return result;
      
    } catch (error) {
      console.error("❌ Task failed:", error);
      
      // Send error to chat
      if (window.MessageSender) {
        const errorMessage = `❌ Task failed: ${error.message}`;
        setTimeout(() => {
          window.MessageSender.sendTestMessage(errorMessage);
        }, 1000);
      }
      
      throw error;
    }
  },
  
  /**
   * Force send a message to ChatGPT chat
   * @param {string} message - Message to send to chat
   * @returns {Promise} Success status
   */
  async sendMessageToChat(message) {
    console.log("💬 Ray sending message to chat:", message);
    
    if (!window.MessageSender) {
      throw new Error("MessageSender not available");
    }
    
    try {
      const result = await window.MessageSender.sendTestMessage(message);
      console.log("✅ Message sent to chat");
      return result;
    } catch (error) {
      console.error("❌ Failed to send message to chat:", error);
      throw error;
    }
  },
  
  /**
   * Test the chat response system
   */
  async testChatResponse() {
    console.log("🧪 Testing Ray Chat Response System...");
    
    const testMessage = `🧪 Ray Chat Response Test - ${new Date().toISOString()}`;
    
    try {
      await this.sendMessageToChat(testMessage);
      console.log("✅ Chat response test successful");
      return { success: true, message: "Test message sent to chat" };
    } catch (error) {
      console.log("❌ Chat response test failed:", error.message);
      return { success: false, error: error.message };
    }
  }
};

console.log("✅ Ray Agent Chat Response Helper loaded");
console.log("💡 Ray can now use:");
console.log("  • window.RayAgentChatHelper.createRayReflectorWithChat()");
console.log("  • window.RayAgentChatHelper.createAgentWithChatResponse(name, prompt, description)");
console.log("  • window.RayAgentChatHelper.sendTaskWithChatResponse(taskData)");
console.log("  • window.RayAgentChatHelper.sendMessageToChat(message)");
console.log("  • window.RayAgentChatHelper.testChatResponse()");

// Auto-expose to Ray's console interface
if (window.Ray) {
  window.Ray.createAgentWithChat = window.RayAgentChatHelper.createAgentWithChatResponse.bind(window.RayAgentChatHelper);
  window.Ray.createRayReflectorWithChat = window.RayAgentChatHelper.createRayReflectorWithChat.bind(window.RayAgentChatHelper);
  window.Ray.sendTaskWithChat = window.RayAgentChatHelper.sendTaskWithChatResponse.bind(window.RayAgentChatHelper);
  window.Ray.sendMessageToChat = window.RayAgentChatHelper.sendMessageToChat.bind(window.RayAgentChatHelper);
  window.Ray.testChatResponse = window.RayAgentChatHelper.testChatResponse.bind(window.RayAgentChatHelper);
  
  console.log("🌉 Ray Chat Response methods added to window.Ray");
  console.log("✅ Ray can now use: await window.Ray.createRayReflectorWithChat()");
  console.log("💬 Responses will appear in ChatGPT chat interface!");
}