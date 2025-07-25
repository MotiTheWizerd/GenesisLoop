/**
 * Message loop component for repeatedly sending messages (response-driven only)
 */
(function () {
  "use strict";

  window.MessageLoop = {
    // Module state - NO INTERVALS USED
    isRunning: false,
    attemptCount: 0,
    responseObserver: null,
    waitingForResponse: false,

    /**
     * Stop the message sending loop
     */
    stopLoop: function () {
      // Disconnect any active response observer
      if (this.responseObserver) {
        this.responseObserver.disconnect();
        this.responseObserver = null;
      }

      this.isRunning = false;
      this.waitingForResponse = false;
      this.attemptCount = 0;
      console.log("⏹️ Response-driven loop stopped.");
    },

    /**
     * Start the message sending loop (response-driven only)
     */
    startLoop: function () {
      // Check if dependencies are loaded
      if (
        typeof window.DOMUtils === "undefined" ||
        typeof window.Constants === "undefined" ||
        typeof window.ResponseTracker === "undefined" ||
        typeof window.MessageSender === "undefined"
      ) {
        console.error("❌ Cannot start loop - dependencies not loaded");
        return false;
      }

      if (this.isRunning) return;

      this.isRunning = true;
      this.attemptCount = 0;
      this.waitingForResponse = false;

      // Disconnect any existing observer
      if (this.responseObserver) {
        this.responseObserver.disconnect();
        this.responseObserver = null;
      }

      console.log("⏳ Starting response-driven loop (NO TIMERS/INTERVALS)...");
      // Note: First message is sent from button click, then everything is response-driven
    },

    /**
     * Send the first message and wait for response
     */
    waitForFirstResponse: function () {
      console.log("🎯 Sending first message and setting up response observer");
      
      // Check if dependencies are loaded
      if (typeof window.DOMUtils === "undefined") {
        console.error("❌ Cannot wait for response - DOMUtils not loaded");
        return false;
      }

      // ResponseTracker is optional - create a fallback if missing
      if (typeof window.ResponseTracker === "undefined") {
        console.warn("⚠️ ResponseTracker not loaded, creating fallback");
        window.ResponseTracker = {
          responses: [],
          addResponse: function (response) {
            this.responses.unshift({
              text: response,
              timestamp: new Date().toISOString(),
            });
            console.log("📝 Fallback: Stored response");
          },
          getResponses: function () {
            return this.responses;
          },
          clearResponses: function () {
            this.responses = [];
          },
        };
      }

      if (this.waitingForResponse || !this.isRunning) {
        console.log(
          "⚠️ Cannot send first message - already waiting or not running"
        );
        return;
      }

      const self = this;
      this.waitingForResponse = true;

      // First, send the initial message
      console.log("🚀 Sending first heartbeat message...");
      
      // Get heartbeat data and send first message
      if (typeof window.FetchSender !== "undefined") {
        window.FetchSender.getHeartbeat()
          .then((heartbeatResult) => {
            if (heartbeatResult.success) {
              const heartbeatJson = JSON.stringify(heartbeatResult.data);
              console.log("💓 First heartbeat received, sending to ChatGPT:", heartbeatJson);

              // Send the message using MessageSender but without its observer
              const success = window.MessageSender.sendTestMessage(
                heartbeatJson,
                () => {
                  console.log("❌ First message send failed");
                  self.waitingForResponse = false;
                  self.stopLoop();
                }
              );

              if (success) {
                console.log("✅ First message sent, setting up response observer");
                // Set up our own observer to wait for response
                self.responseObserver = window.DOMUtils.waitForResponse((response) => {
                  console.log("🎉 FIRST RESPONSE RECEIVED! Continuing loop...");
                  console.log("📥 Response:", response?.substring(0, 100) + "...");

                  self.waitingForResponse = false;
                  self.responseObserver = null;

                  // Store the response
                  if (typeof window.ResponseTracker !== "undefined") {
                    window.ResponseTracker.addResponse(response);
                    console.log("💾 First response stored");
                  }

                  // Send JSON response to server
                  self.sendResponseToServer(response);

                  // Continue the loop
                  if (self.isRunning) {
                    console.log("🔄 Scheduling next message...");
                    setTimeout(() => {
                      self.sendMessageAndWaitForResponse();
                    }, 1000);
                  }
                });
              } else {
                console.log("❌ First message send failed");
                self.waitingForResponse = false;
                self.stopLoop();
              }
            } else {
              console.error("❌ First heartbeat failed:", heartbeatResult.error);
              self.waitingForResponse = false;
              self.stopLoop();
            }
          })
          .catch((error) => {
            console.error("❌ First heartbeat error:", error);
            self.waitingForResponse = false;
            self.stopLoop();
          });
      } else {
        console.error("❌ FetchSender not available for first message");
        self.waitingForResponse = false;
        self.stopLoop();
      }
    },

    /**
     * Set up response observer for continuing the loop
     */
    setupResponseObserver: function () {
      console.log("🔧 Setting up response observer...");
      const self = this;

      // Check if DOMUtils is available
      if (typeof window.DOMUtils === 'undefined') {
        console.error("❌ DOMUtils not available for response observer");
        return;
      }

      console.log("🔧 DOMUtils available, calling waitForResponse...");
      console.log("🔧 DOMUtils.waitForResponse type:", typeof window.DOMUtils.waitForResponse);
      
      // Set up observer to wait for response
      this.responseObserver = window.DOMUtils.waitForResponse((response) => {
        console.log(
          "🎉 CONTINUING LOOP CALLBACK! Response received, sending next message"
        );
        console.log(
          "📥 Continuing response received:",
          response?.substring(0, 100) + "..."
        );
        console.log("📊 Continuing response length:", response?.length);

        self.waitingForResponse = false;
        self.responseObserver = null;

        // Store the response for later analysis
        if (typeof window.ResponseTracker !== "undefined") {
          window.ResponseTracker.addResponse(response);
          console.log("💾 Continuing response stored in tracker");
        } else {
          console.log(
            "⚠️ ResponseTracker not available for continuing response"
          );
        }

        // Send JSON response to server
        self.sendResponseToServer(response);

        // Send the next message after a short delay (ONLY after response)
        if (self.isRunning) {
          console.log("⏳ Scheduling next message in continuing loop...");
          setTimeout(() => {
            console.log("🔄 Sending next message in continuing loop");
            self.sendMessageAndWaitForResponse();
          }, 1000); // Small delay before sending next message
        } else {
          console.log("⚠️ Continuing loop is not running");
        }
      });
    },

    /**
     * Send a message and wait for response, then send another message
     */
    sendMessageAndWaitForResponse: function () {
      // Check if critical dependencies are loaded
      if (
        typeof window.DOMUtils === "undefined" ||
        typeof window.Constants === "undefined" ||
        typeof window.MessageSender === "undefined" ||
        typeof window.ToggleButton === "undefined"
      ) {
        console.error(
          "❌ Cannot send message - critical dependencies not loaded"
        );
        return false;
      }

      // Create ResponseTracker fallback if missing
      if (typeof window.ResponseTracker === "undefined") {
        console.warn("⚠️ ResponseTracker not loaded, creating fallback");
        window.ResponseTracker = {
          responses: [],
          addResponse: function (response) {
            this.responses.unshift({
              text: response,
              timestamp: new Date().toISOString(),
            });
            console.log("📝 Fallback: Stored response");
          },
          getResponses: function () {
            return this.responses;
          },
          clearResponses: function () {
            this.responses = [];
          },
        };
      }

      // If we're already waiting for a response or not running, don't send another message
      if (this.waitingForResponse || !this.isRunning) {
        console.log(
          "⏳ Still waiting for ChatGPT response or loop is stopped..."
        );
        return;
      }

      const self = this;

      // Get heartbeat data first
      if (typeof window.FetchSender !== "undefined") {
        console.log("💓 Getting heartbeat data...");

        window.FetchSender.getHeartbeat()
          .then((heartbeatResult) => {
            if (heartbeatResult.success) {
              const heartbeatJson = JSON.stringify(heartbeatResult.data);
              console.log(
                "💓 Heartbeat received, sending to ChatGPT:",
                heartbeatJson
              );

              console.log("🚀 About to call MessageSender.sendTestMessage...");
              const success = window.MessageSender.sendTestMessage(
                heartbeatJson,
                () => {
                  console.log("❌ MessageSender failure callback called");
                  self.attemptCount++;
                  console.log(
                    `❌ Elements not ready. Attempt ${self.attemptCount}/${window.Constants.MAX_ATTEMPTS}`
                  );

                  // If we've tried too many times, stop the loop
                  if (self.attemptCount >= window.Constants.MAX_ATTEMPTS) {
                    console.log("⚠️ Max attempts reached. Stopping loop.");
                    self.stopLoop();
                    window.ToggleButton.resetToggleButton();
                    window.DOMUtils.debugElements();
                  } else {
                    // Try again after a short delay
                    setTimeout(() => {
                      if (self.isRunning) {
                        self.sendMessageAndWaitForResponse();
                      }
                    }, 1000);
                  }
                }
              );

              // Handle success case
              console.log("🔍 MessageSender.sendTestMessage returned:", success);
              if (success) {
                console.log("✅ MessageSender success - setting up response observer");
                self.attemptCount = 0;
                self.waitingForResponse = true;
                self.setupResponseObserver();
              } else {
                console.log("❌ MessageSender returned false - message not sent");
              }
            } else {
              console.error("❌ Heartbeat failed:", heartbeatResult.error);
              // Fallback to default message
              const success = window.MessageSender.sendTestMessage(null, () => {
                self.attemptCount++;
                console.log(
                  `❌ Elements not ready. Attempt ${self.attemptCount}/${window.Constants.MAX_ATTEMPTS}`
                );

                if (self.attemptCount >= window.Constants.MAX_ATTEMPTS) {
                  console.log("⚠️ Max attempts reached. Stopping loop.");
                  self.stopLoop();
                  window.ToggleButton.resetToggleButton();
                  window.DOMUtils.debugElements();
                } else {
                  setTimeout(() => {
                    if (self.isRunning) {
                      self.sendMessageAndWaitForResponse();
                    }
                  }, 1000);
                }
              });

              if (success) {
                self.attemptCount = 0;
                self.waitingForResponse = true;
                self.setupResponseObserver();
              }
            }
          })
          .catch((error) => {
            console.error("❌ Heartbeat error:", error);
            // Fallback to default message
            const success = window.MessageSender.sendTestMessage(null, () => {
              self.attemptCount++;
              console.log(
                `❌ Elements not ready. Attempt ${self.attemptCount}/${window.Constants.MAX_ATTEMPTS}`
              );

              if (self.attemptCount >= window.Constants.MAX_ATTEMPTS) {
                console.log("⚠️ Max attempts reached. Stopping loop.");
                self.stopLoop();
                window.ToggleButton.resetToggleButton();
                window.DOMUtils.debugElements();
              } else {
                setTimeout(() => {
                  if (self.isRunning) {
                    self.sendMessageAndWaitForResponse();
                  }
                }, 1000);
              }
            });

            if (success) {
              self.attemptCount = 0;
              self.waitingForResponse = true;
              self.setupResponseObserver();
            }
          });
      } else {
        console.warn("⚠️ FetchSender not available, using default message");
        const success = window.MessageSender.sendTestMessage(null, () => {
          self.attemptCount++;
          console.log(
            `❌ Elements not ready. Attempt ${self.attemptCount}/${window.Constants.MAX_ATTEMPTS}`
          );

          if (self.attemptCount >= window.Constants.MAX_ATTEMPTS) {
            console.log("⚠️ Max attempts reached. Stopping loop.");
            self.stopLoop();
            window.ToggleButton.resetToggleButton();
            window.DOMUtils.debugElements();
          } else {
            setTimeout(() => {
              if (self.isRunning) {
                self.sendMessageAndWaitForResponse();
              }
            }, 1000);
          }
        });

        if (success) {
          self.attemptCount = 0;
          self.waitingForResponse = true;
          self.setupResponseObserver();
        }
      }
    },

    /**
     * Send extracted JSON response to server
     * @param {string} response - The JSON response text from ChatGPT
     */
    sendResponseToServer: async function(response) {
      try {
        console.log("📡 Attempting to send response to server...");
        console.log("📄 Response to send:", response?.substring(0, 100) + "...");

        // Check if FetchSender is available
        if (typeof window.FetchSender === "undefined") {
          console.warn("⚠️ FetchSender not available - cannot send response to server");
          return;
        }

        // Try to parse the response as JSON
        let jsonData;
        try {
          jsonData = JSON.parse(response);
          console.log("✅ Response parsed as JSON:", jsonData);
        } catch (parseError) {
          console.warn("⚠️ Response is not valid JSON, sending as text:", parseError.message);
          // Send as text response instead
          const result = await window.FetchSender.sendResponse(response);
          if (result.success) {
            console.log("📡 Text response sent to server successfully");
          } else {
            console.error("❌ Failed to send text response to server:", result.error);
          }
          return;
        }

        // Send JSON data to server
        const result = await window.FetchSender.sendJSON(jsonData);
        if (result.success) {
          console.log("📡 JSON response sent to server successfully");
          console.log("🔍 Server response:", result);
        } else {
          console.error("❌ Failed to send JSON response to server:", result.error);
        }

      } catch (error) {
        console.error("❌ Error sending response to server:", error);
      }
    },
  };

  console.log("✅ MessageLoop loaded");
})();
("");
