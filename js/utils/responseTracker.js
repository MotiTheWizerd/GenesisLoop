/**
 * Response tracker utility for storing and analyzing ChatGPT responses
 */

// Ensure we don't overwrite if already exists
if (typeof window.ResponseTracker === 'undefined') {
  console.log("🔄 Creating ResponseTracker...");
  
  window.ResponseTracker = {
    // Store the last few responses
    responses: [],
    maxResponses: 10,

    /**
     * Add a new response to the tracker
     * @param {string} response The response text
     */
    addResponse: function (response) {
      try {
        // Add to beginning of array
        this.responses.unshift({
          text: response,
          timestamp: new Date().toISOString(),
        });

        // Keep array at max size
        if (this.responses.length > this.maxResponses) {
          this.responses.pop();
        }

        // Log for debugging
        console.log(
          `📝 Stored response (${this.responses.length}/${this.maxResponses})`
        );
      } catch (error) {
        console.error("❌ Error adding response:", error);
      }
    },

    /**
     * Get all stored responses
     * @returns {Array} Array of response objects
     */
    getResponses: function () {
      return this.responses || [];
    },

    /**
     * Clear all stored responses
     */
    clearResponses: function () {
      this.responses = [];
      console.log("🧹 Cleared all stored responses");
    }
  };
  
  console.log("✅ ResponseTracker created successfully");
} else {
  console.log("⚠️ ResponseTracker already exists");
}

// Double-check it's available
setTimeout(() => {
  if (typeof window.ResponseTracker !== 'undefined') {
    console.log("✅ ResponseTracker confirmed available");
  } else {
    console.error("❌ ResponseTracker still not available after creation");
  }
}, 100);