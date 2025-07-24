/**
 * Fetch Sender Utility
 * Handles sending data to external endpoints via fetch API
 */
(function () {
  "use strict";

  const FetchSender = {
    // Default configuration
    config: {
      baseUrl: "http://localhost:8000/",
      timeout: 10000, // 10 seconds
      retries: 3,
      retryDelay: 1000, // 1 second
    },

    /**
     * Send data to the configured endpoint
     * @param {Object|string} data - Data to send (will be JSON stringified if object)
     * @param {Object} options - Optional configuration overrides
     * @returns {Promise<Object>} Response data or error
     */
    async sendData(data, options = {}) {
      const config = { ...this.config, ...options };

      console.log("📡 FetchSender: Preparing to send data to", config.baseUrl);
      console.log("📦 Data to send:", data);

      // Prepare the request payload
      const payload = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        },
        body: typeof data === "string" ? data : JSON.stringify(data),
      };

      // Add timeout using AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      payload.signal = controller.signal;

      let lastError = null;

      // Retry logic
      for (let attempt = 1; attempt <= config.retries; attempt++) {
        try {
          console.log(`🚀 FetchSender: Attempt ${attempt}/${config.retries}`);

          const response = await fetch(config.baseUrl, payload);
          clearTimeout(timeoutId);

          console.log("📨 FetchSender: Response status:", response.status);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          // Try to parse response as JSON, fallback to text
          let responseData;
          const contentType = response.headers.get("content-type");

          if (contentType && contentType.includes("application/json")) {
            responseData = await response.json();
          } else {
            responseData = await response.text();
          }

          console.log("✅ FetchSender: Success!", responseData);
          const finalObject = {
            success: true,
            data: responseData,
            status: response.status,
            attempt: attempt,
          };

          // Send signal with finalObject as string
          if (window.MessageSender) {
            setTimeout(() => {
              window.MessageSender.sendTestMessage(JSON.stringify(finalObject));
            }, 2000); // 2 second delay to avoid conflicts
          }

          return finalObject;
        } catch (error) {
          clearTimeout(timeoutId);
          lastError = error;

          console.log(
            `❌ FetchSender: Attempt ${attempt} failed:`,
            error.message
          );

          // Don't retry on certain errors
          if (error.name === "AbortError") {
            console.log("⏰ FetchSender: Request timed out");
            break;
          }

          if (attempt < config.retries) {
            console.log(
              `⏳ FetchSender: Retrying in ${config.retryDelay}ms...`
            );
            await this.delay(config.retryDelay);
          }
        }
      }

      // All attempts failed
      console.error(
        "💥 FetchSender: All attempts failed. Last error:",
        lastError
      );

      return {
        success: false,
        error: lastError.message,
        attempt: config.retries,
      };
    },

    /**
     * Send response data specifically (convenience method)
     * @param {string} response - ChatGPT response text
     * @param {Object} metadata - Optional metadata to include
     * @param {Object} options - Optional configuration overrides
     * @returns {Promise<Object>} Response data or error
     */
    async sendResponse(response, metadata = {}, options = {}) {
      const payload = {
        type: "chatgpt_response",
        response: response,
        timestamp: new Date().toISOString(),
        ...metadata,
      };

      console.log("🤖 FetchSender: Sending ChatGPT response");
      return this.sendData(payload, options);
    },

    /**
     * Send JSON data specifically (convenience method)
     * @param {Object} jsonData - JSON object to send
     * @param {Object} options - Optional configuration overrides
     * @returns {Promise<Object>} Response data or error
     */
    async sendJSON(jsonData, options = {}) {
      console.log("📋 FetchSender: Sending JSON data");
      return this.sendData(jsonData, options);
    },

    /**
     * Send raw text data (convenience method)
     * @param {string} text - Text to send
     * @param {Object} options - Optional configuration overrides
     * @returns {Promise<Object>} Response data or error
     */
    async sendText(text, options = {}) {
      const payload = {
        type: "text_data",
        content: text,
        timestamp: new Date().toISOString(),
      };

      console.log("📝 FetchSender: Sending text data");
      return this.sendData(payload, options);
    },

    /**
     * Update configuration
     * @param {Object} newConfig - Configuration updates
     */
    updateConfig(newConfig) {
      this.config = { ...this.config, ...newConfig };
      console.log("⚙️ FetchSender: Configuration updated", this.config);
    },

    /**
     * Test connection to the endpoint
     * @param {Object} options - Optional configuration overrides
     * @returns {Promise<Object>} Connection test result
     */
    async testConnection(options = {}) {
      console.log("🔍 FetchSender: Testing connection...");

      const testData = {
        type: "connection_test",
        timestamp: new Date().toISOString(),
        message: "Connection test from ChatGPT extension",
      };

      return this.sendData(testData, options);
    },

    /**
     * Utility function for delays
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Promise that resolves after delay
     */
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  };

  // Expose the module
  window.FetchSender = FetchSender;

  console.log("✅ FetchSender loaded");
})();
