/**
 * Data Sender Module
 * Centralized data transmission handler for all ChatGPT responses
 * Works alongside existing FetchSender without breaking current functionality
 */
(function () {
  "use strict";

  console.log("📡 DataSender module starting to load...");

  const DataSender = {
    // Configuration
    config: {
      enableLogging: true,
      validateResponses: true,
      retryFailedSends: true,
      maxRetries: 3,
    },

    /**
     * Main entry point for sending extracted responses
     * @param {string} response - Raw response text from ChatGPT
     * @param {Object} metadata - Optional metadata about the response
     * @returns {Promise<Object>} Send result
     */
    async sendExtractedResponse(response, metadata = {}) {
      try {
        if (this.config.enableLogging) {
          console.log("📡 DataSender: Processing extracted response");
          console.log(
            "📄 Response preview:",
            response?.substring(0, 100) + "..."
          );
          console.log("📊 Response length:", response?.length || 0);
          console.log("🏷️ Metadata:", metadata);
        }

        // Validate response
        if (!response || typeof response !== "string") {
          throw new Error("Invalid response: must be a non-empty string");
        }

        // Process the response
        const processedData = await this.processResponse(response, metadata);

        // Route and send the data
        const result = await this.routeAndSend(processedData);

        if (this.config.enableLogging) {
          console.log("✅ DataSender: Response sent successfully");
        }

        return result;
      } catch (error) {
        console.error("❌ DataSender: Error sending response:", error);
        return {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        };
      }
    },

    /**
     * Process and validate the response
     * @param {string} response - Raw response text
     * @param {Object} metadata - Response metadata
     * @returns {Object} Processed data ready for sending
     */
    async processResponse(response, metadata) {
      const processedData = {
        originalResponse: response,
        processedAt: new Date().toISOString(),
        metadata: metadata,
        type: "unknown",
        data: null,
      };

      // Try to parse as JSON first
      try {
        const jsonData = JSON.parse(response);
        processedData.type = "json";
        processedData.data = jsonData;

        if (this.config.enableLogging) {
          console.log("📋 DataSender: Response parsed as JSON");
          console.log("🎯 Action detected:", jsonData.action || "none");
        }
      } catch (parseError) {
        // Not JSON, treat as text
        processedData.type = "text";
        processedData.data = response;

        if (this.config.enableLogging) {
          console.log("📝 DataSender: Response treated as text");
        }
      }

      return processedData;
    },

    /**
     * Route the processed data to appropriate endpoint
     * @param {Object} processedData - Processed response data
     * @returns {Promise<Object>} Send result
     */
    async routeAndSend(processedData) {
      // Check if FetchSender is available
      if (typeof window.FetchSender === "undefined") {
        throw new Error("FetchSender not available");
      }

      let result;

      if (processedData.type === "json") {
        // Use FetchSender's JSON method with action routing
        result = await window.FetchSender.sendJSON(processedData.data);
      } else {
        // Use FetchSender's response method for text
        result = await window.FetchSender.sendResponse(
          processedData.originalResponse,
          processedData.metadata
        );
      }

      // Add our own metadata to the result
      return {
        ...result,
        dataSenderProcessed: true,
        responseType: processedData.type,
        processedAt: processedData.processedAt,
      };
    },

    /**
     * Update DataSender configuration
     * @param {Object} newConfig - Configuration updates
     */
    updateConfig(newConfig) {
      this.config = { ...this.config, ...newConfig };
      if (this.config.enableLogging) {
        console.log("⚙️ DataSender: Configuration updated", this.config);
      }
    },

    /**
     * Get current configuration
     * @returns {Object} Current configuration
     */
    getConfig() {
      return { ...this.config };
    },

    /**
     * Test the DataSender functionality
     * @returns {Promise<Object>} Test result
     */
    async test() {
      console.log("🧪 DataSender: Running test...");

      const testResponse = JSON.stringify({
        action: "test",
        message: "DataSender test message",
        timestamp: new Date().toISOString(),
      });

      try {
        const result = await this.sendExtractedResponse(testResponse, {
          source: "dataSender_test",
          testRun: true,
        });

        console.log("🧪 DataSender test result:", result);
        return result;
      } catch (error) {
        console.error("🧪 DataSender test failed:", error);
        return {
          success: false,
          error: error.message,
        };
      }
    },
  };

  // Expose the module
  window.DataSender = DataSender;

  console.log("✅ DataSender loaded successfully");
})();


