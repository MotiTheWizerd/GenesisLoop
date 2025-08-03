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
     * Add a new response to the tracker with temporal awareness
     * @param {string} response The response text
     * @param {Object} metadata Optional metadata about the response
     */
    addResponse: function (response, metadata = {}) {
      try {
        // Get temporal context from BrowserClock if available
        const temporalContext = this.getTemporalContext();
        
        // Create response object with rich temporal data
        const responseObj = {
          text: response,
          timestamp: temporalContext.timestamp,
          browser_time: temporalContext.detailed,
          metadata: metadata,
          response_id: this.generateResponseId(),
          stored_at: temporalContext.timestamp
        };

        // Add to beginning of array
        this.responses.unshift(responseObj);

        // Keep array at max size
        if (this.responses.length > this.maxResponses) {
          this.responses.pop();
        }

        // Log for debugging with temporal context
        console.log(
          `📝 Stored response (${this.responses.length}/${this.maxResponses}) at ${temporalContext.timestamp}`
        );
        
        // Dispatch event for other modules to listen to
        this.dispatchResponseEvent(responseObj);
        
      } catch (error) {
        console.error("❌ Error adding response:", error);
      }
    },

    /**
     * Get temporal context from BrowserClock or fallback
     * @returns {Object} Temporal context object
     */
    getTemporalContext: function() {
      try {
        // Try to use BrowserClock first
        if (window.BrowserClock && typeof window.BrowserClock.getCurrentTime === 'function') {
          return {
            timestamp: window.BrowserClock.getCurrentTime(),
            detailed: window.BrowserClock.getCurrentTimeDetailed(),
            source: 'BrowserClock'
          };
        }
        
        // Fallback to DOM element if BrowserClock not available
        const clockEl = document.getElementById("ray-browser-clock");
        if (clockEl && clockEl.textContent) {
          return {
            timestamp: clockEl.textContent,
            detailed: { iso: clockEl.textContent, source: 'DOM' },
            source: 'DOM'
          };
        }
        
        // Final fallback to Date
        const now = new Date();
        return {
          timestamp: now.toISOString(),
          detailed: { iso: now.toISOString(), source: 'Date' },
          source: 'Date'
        };
      } catch (error) {
        console.error("❌ Error getting temporal context:", error);
        const now = new Date();
        return {
          timestamp: now.toISOString(),
          detailed: { iso: now.toISOString(), source: 'Error' },
          source: 'Error'
        };
      }
    },

    /**
     * Generate unique response ID
     * @returns {string} Unique response identifier
     */
    generateResponseId: function() {
      return `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Dispatch response event for other modules
     * @param {Object} responseObj The response object
     */
    dispatchResponseEvent: function(responseObj) {
      try {
        const event = new CustomEvent('rayResponseTracked', {
          detail: {
            response: responseObj,
            total_responses: this.responses.length,
            timestamp: responseObj.timestamp
          }
        });
        document.dispatchEvent(event);
      } catch (error) {
        console.error("❌ Error dispatching response event:", error);
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
    },

    /**
     * Utility function to attach timestamp to any message
     * @param {string} message The message to timestamp
     * @param {Object} metadata Optional metadata
     * @returns {Object} Message with temporal context
     */
    attachTimestamp: function(message, metadata = {}) {
      const temporalContext = this.getTemporalContext();
      return {
        message: message,
        timestamp: temporalContext.timestamp,
        browser_time: temporalContext.detailed,
        metadata: metadata,
        temporal_source: temporalContext.source
      };
    },

    /**
     * Get responses within a time range
     * @param {string} startTime ISO timestamp
     * @param {string} endTime ISO timestamp
     * @returns {Array} Filtered responses
     */
    getResponsesByTimeRange: function(startTime, endTime) {
      return this.responses.filter(response => {
        const responseTime = new Date(response.timestamp);
        const start = new Date(startTime);
        const end = new Date(endTime);
        return responseTime >= start && responseTime <= end;
      });
    },

    /**
     * Get the most recent response
     * @returns {Object|null} Most recent response or null
     */
    getLatestResponse: function() {
      return this.responses.length > 0 ? this.responses[0] : null;
    },

    /**
     * Get response statistics
     * @returns {Object} Statistics about stored responses
     */
    getStats: function() {
      if (this.responses.length === 0) {
        return {
          total: 0,
          oldest: null,
          newest: null,
          timespan: null
        };
      }

      const timestamps = this.responses.map(r => new Date(r.timestamp));
      const oldest = new Date(Math.min(...timestamps));
      const newest = new Date(Math.max(...timestamps));
      
      return {
        total: this.responses.length,
        oldest: oldest.toISOString(),
        newest: newest.toISOString(),
        timespan: newest - oldest,
        temporal_sources: [...new Set(this.responses.map(r => r.browser_time?.source || 'unknown'))]
      };
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