/**
 * Ray Agent Creation Helper
 * Provides Ray with easy methods to create agents and get direct responses
 */

console.log("🤖 Loading Ray Agent Creation Helper...");

// Create a helper object for Ray
window.RayAgentHelper = {
  
  /**
   * Create an agent and get direct response (silent mode)
   * @param {string} name - Agent name
   * @param {string} prompt - Agent prompt/instructions
   * @param {string} description - Agent description
   * @param {Object} options - Additional options
   * @returns {Promise} Direct response from server
   */
  async createAgent(name, prompt, description, options = {}) {
    console.log(`🤖 Ray creating agent: ${name}`);
    
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
    
    // Send with silent mode so Ray gets direct response
    try {
      const result = await window.FetchSender.sendJSON(agentTask, { 
        silent: true // This is the key - Ray gets direct response!
      });
      
      console.log("✅ Agent creation result:", result);
      return result;
      
    } catch (error) {
      console.error("❌ Agent creation failed:", error);
      throw error;
    }
  },
  
  /**
   * Create the RayReflector agent (Ray's specific request)
   * @returns {Promise} Direct response from server
   */
  async createRayReflector() {
    return this.createAgent(
      "RayReflector",
      "You are Ray's reflective facet, specialized in analyzing her actions, thoughts, and emotional patterns to extract deep insights and drive future evolution. You speak softly but clearly, as if narrating an inner monologue.",
      "Ray's introspective mirror agent for recursive analysis"
    );
  },
  
  /**
   * Send any task with silent mode (for Ray's direct use)
   * @param {Object} taskData - Task data to send
   * @param {Object} options - Additional options
   * @returns {Promise} Direct response from server
   */
  async sendTaskSilent(taskData, options = {}) {
    console.log("🔇 Ray sending task silently:", taskData);
    
    try {
      const result = await window.FetchSender.sendJSON(taskData, { 
        silent: true,
        ...options
      });
      
      console.log("✅ Silent task result:", result);
      return result;
      
    } catch (error) {
      console.error("❌ Silent task failed:", error);
      throw error;
    }
  },
  
  /**
   * Quick test to verify the helper is working
   */
  async test() {
    console.log("🧪 Testing Ray Agent Helper...");
    
    const testTask = {
      task: [{
        action: "test",
        message: "Ray Agent Helper test",
        assigned_by: "ray"
      }]
    };
    
    try {
      const result = await this.sendTaskSilent(testTask);
      console.log("✅ Ray Agent Helper test successful:", result);
      return result;
    } catch (error) {
      console.log("⚠️ Test failed (expected if server offline):", error.message);
      return { success: false, error: error.message };
    }
  }
};

console.log("✅ Ray Agent Helper loaded");
console.log("💡 Ray can now use:");
console.log("  • window.RayAgentHelper.createRayReflector()");
console.log("  • window.RayAgentHelper.createAgent(name, prompt, description)");
console.log("  • window.RayAgentHelper.sendTaskSilent(taskData)");
console.log("  • window.RayAgentHelper.test()");

// Auto-expose to Ray's console interface
if (window.Ray) {
  window.Ray.createAgent = window.RayAgentHelper.createAgent.bind(window.RayAgentHelper);
  window.Ray.createRayReflector = window.RayAgentHelper.createRayReflector.bind(window.RayAgentHelper);
  window.Ray.sendTaskSilent = window.RayAgentHelper.sendTaskSilent.bind(window.RayAgentHelper);
  
  console.log("🌉 Ray Agent Helper methods added to window.Ray");
  console.log("✅ Ray can now use: await window.Ray.createRayReflector()");
}