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
    nextRunTime: null,
    responseCount: 0,
    errorCount: 0,

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
      this.nextRunTime = null;
      
      // Update status display
      if (typeof window.RayLoopStatus !== "undefined") {
        window.RayLoopStatus.setRunning(false);
        window.RayLoopStatus.setStatus('Stopped');
      }
      
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
      this.responseCount = 0;
      this.errorCount = 0;

      // Disconnect any existing observer
      if (this.responseObserver) {
        this.responseObserver.disconnect();
        this.responseObserver = null;
      }

      // Update status display
      if (typeof window.RayLoopStatus !== "undefined") {
        window.RayLoopStatus.setRunning(true);
        window.RayLoopStatus.setStatus('Starting');
        window.RayLoopStatus.updateState({
          responseCount: this.responseCount,
          errors: this.errorCount
        });
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

      // Reset waiting state if loop is running (this fixes stuck state issues)
      if (this.isRunning && this.waitingForResponse) {
        console.log("🔄 Resetting stuck waitingForResponse state");
        this.waitingForResponse = false;

        // Also disconnect any stuck observer
        if (this.responseObserver) {
          this.responseObserver.disconnect();
          this.responseObserver = null;
        }
      }

      if (this.waitingForResponse || !this.isRunning) {
        console.log(
          "⚠️ Cannot send first message - already waiting or not running"
        );
        return;
      }

      const self = this;
      const startTime = Date.now(); // Track when we started waiting
      this.waitingForResponse = true;

      // First, send the initial message
      console.log("🚀 Sending first heartbeat message...");

      // Get heartbeat data and send first message
      if (typeof window.FetchSender !== "undefined") {
        window.FetchSender.getHeartbeat()
          .then((heartbeatResult) => {
            if (heartbeatResult.success) {
              const heartbeatJson = JSON.stringify(heartbeatResult.data);
              console.log(
                "💓 First heartbeat received, sending to ChatGPT:",
                heartbeatJson
              );

              // Send the message using MessageSender but without its observer
              const success = window.MessageSender.sendTestMessage(
                heartbeatJson,
                () => {
                  console.log("❌ First message send failed");
                  self.waitingForResponse = false;
                  self.stopLoop();
                },
                true // Skip MessageSender's response handling - MessageLoop will handle it
              );

              if (success) {
                console.log(
                  "✅ First message sent, setting up response observer"
                );
                // Set up our own observer to wait for response
                self.responseObserver = window.DOMUtils.waitForResponse(
                  (response) => {
                    console.log(
                      "🎉 FIRST RESPONSE RECEIVED! Continuing loop..."
                    );
                    console.log(
                      "📥 Response:",
                      response?.substring(0, 100) + "..."
                    );

                    self.waitingForResponse = false;
                    self.responseObserver = null;
                    self.responseCount++;

                    // Update status display with immediate save
                    if (typeof window.RayLoopStatus !== "undefined") {
                      window.RayLoopStatus.incrementResponses();
                      window.RayLoopStatus.setStatus('Processing Response');
                      window.RayLoopStatus.updateState({
                        lastRun: Date.now(),
                        responseCount: self.responseCount
                      });
                    }

                    // Store the response with temporal context
                    if (typeof window.ResponseTracker !== "undefined") {
                      window.ResponseTracker.addResponse(response, {
                        source: "messageLoop",
                        type: "first_response",
                        loopIteration: self.attemptCount,
                        waitingTime: Date.now() - startTime,
                      });
                      console.log(
                        "💾 First response stored with temporal context"
                      );
                    }

                    // Send JSON response to server
                    self.sendResponseToServer(response);

                    // Check if this is a reflect action response - continue loop but note it
                    try {
                      const jsonData = JSON.parse(response);
                      if (jsonData && jsonData.action === "reflect") {
                        console.log(
                          "🧠 REFLECT ACTION DETECTED ON FIRST RESPONSE! Continuing heartbeat loop."
                        );
                        console.log(
                          "💭 Reflection content processed - loop continues running."
                        );
                        
                        // Update status display to show reflect action
                        if (typeof window.RayLoopStatus !== "undefined") {
                          window.RayLoopStatus.setStatus('Reflect Action Processed');
                        }
                        
                        // Continue with normal loop flow - don't stop
                      }
                    } catch (parseError) {
                      console.log(
                        "⚠️ First response is not JSON, continuing normal loop"
                      );
                    }

                    // Continue the loop
                    if (self.isRunning) {
                      console.log("🔄 Scheduling next message...");
                      self.nextRunTime = Date.now() + 1000;
                      
                      // Update status display
                      if (typeof window.RayLoopStatus !== "undefined") {
                        window.RayLoopStatus.setNextRun(self.nextRunTime);
                        window.RayLoopStatus.setStatus('Waiting');
                      }
                      
                      setTimeout(() => {
                        self.sendMessageAndWaitForResponse();
                      }, 1000);
                    }
                  }
                );
              } else {
                console.log("❌ First message send failed");
                self.waitingForResponse = false;
                self.errorCount++;
                
                // Update status display with immediate save
                if (typeof window.RayLoopStatus !== "undefined") {
                  window.RayLoopStatus.incrementErrors();
                  window.RayLoopStatus.setStatus('Send Failed');
                  window.RayLoopStatus.updateState({
                    errors: self.errorCount,
                    lastRun: Date.now()
                  });
                }
                
                self.stopLoop();
              }
            } else {
              console.error(
                "❌ First heartbeat failed:",
                heartbeatResult.error
              );
              console.log("🔄 Using fallback message instead of heartbeat");

              // Use fallback message when heartbeat fails
              const fallbackMessage = JSON.stringify({
                action: "heartbeat_fallback",
                timestamp: new Date().toISOString(),
                message:
                  "Ray heartbeat - server connection failed, using fallback",
                status: "offline_mode",
              });

              // Send the fallback message
              const success = window.MessageSender.sendTestMessage(
                fallbackMessage,
                () => {
                  console.log("❌ Fallback message send failed");
                  self.waitingForResponse = false;
                  self.stopLoop();
                },
                true // Skip MessageSender's response handling
              );

              if (success) {
                console.log(
                  "✅ Fallback message sent, setting up response observer"
                );
                // Set up our own observer to wait for response
                self.responseObserver = window.DOMUtils.waitForResponse(
                  (response) => {
                    console.log(
                      "🎉 FALLBACK RESPONSE RECEIVED! Continuing loop..."
                    );
                    console.log(
                      "📥 Response:",
                      response?.substring(0, 100) + "..."
                    );

                    self.waitingForResponse = false;
                    self.responseObserver = null;

                    // Store the response
                    if (typeof window.ResponseTracker !== "undefined") {
                      window.ResponseTracker.addResponse(response, {
                        source: "messageLoop",
                        type: "fallback_response",
                        loopIteration: self.attemptCount,
                        waitingTime: Date.now() - startTime,
                      });
                      console.log("💾 Fallback response stored");
                    }

                    // Continue the loop
                    if (self.isRunning) {
                      console.log("🔄 Scheduling next message...");
                      setTimeout(() => {
                        self.sendMessageAndWaitForResponse();
                      }, 1000);
                    }
                  }
                );
              } else {
                console.log("❌ Fallback message send failed");
                self.waitingForResponse = false;
                self.stopLoop();
              }
            }
          })
          .catch((error) => {
            console.error("❌ First heartbeat error:", error);
            console.log("🔄 Using fallback message due to heartbeat error");

            // Use fallback message when heartbeat throws error
            const fallbackMessage = JSON.stringify({
              action: "heartbeat_fallback",
              timestamp: new Date().toISOString(),
              message: "Ray heartbeat - server error, using fallback",
              status: "offline_mode",
              error: error.message,
            });

            // Send the fallback message
            const success = window.MessageSender.sendTestMessage(
              fallbackMessage,
              () => {
                console.log("❌ Fallback message send failed");
                self.waitingForResponse = false;
                self.stopLoop();
              },
              true // Skip MessageSender's response handling
            );

            if (success) {
              console.log(
                "✅ Fallback message sent after error, setting up response observer"
              );
              // Set up our own observer to wait for response
              self.responseObserver = window.DOMUtils.waitForResponse(
                (response) => {
                  console.log(
                    "🎉 FALLBACK RESPONSE RECEIVED AFTER ERROR! Continuing loop..."
                  );
                  console.log(
                    "📥 Response:",
                    response?.substring(0, 100) + "..."
                  );

                  self.waitingForResponse = false;
                  self.responseObserver = null;

                  // Store the response
                  if (typeof window.ResponseTracker !== "undefined") {
                    window.ResponseTracker.addResponse(response, {
                      source: "messageLoop",
                      type: "fallback_error_response",
                      loopIteration: self.attemptCount,
                      waitingTime: Date.now() - startTime,
                      originalError: error.message,
                    });
                    console.log("💾 Fallback error response stored");
                  }

                  // Continue the loop
                  if (self.isRunning) {
                    console.log("🔄 Scheduling next message...");
                    setTimeout(() => {
                      self.sendMessageAndWaitForResponse();
                    }, 1000);
                  }
                }
              );
            } else {
              console.log("❌ Fallback message send failed after error");
              self.waitingForResponse = false;
              self.stopLoop();
            }
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
      if (typeof window.DOMUtils === "undefined") {
        console.error("❌ DOMUtils not available for response observer");
        return;
      }

      console.log("🔧 DOMUtils available, calling waitForResponse...");
      console.log(
        "🔧 DOMUtils.waitForResponse type:",
        typeof window.DOMUtils.waitForResponse
      );

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

        // Store the response for later analysis with temporal context
        if (typeof window.ResponseTracker !== "undefined") {
          window.ResponseTracker.addResponse(response, {
            source: "messageLoop",
            type: "continuing_response",
            loopIteration: this.attemptCount,
            isHeartbeat: true,
          });
          console.log(
            "💾 Continuing response stored in tracker with temporal context"
          );
        } else {
          console.log(
            "⚠️ ResponseTracker not available for continuing response"
          );
        }

        // Send JSON response to server
        self.sendResponseToServer(response);

        // Check if this is a reflect action response - if so, stop the heartbeat
        try {
          const jsonData = JSON.parse(response);
          if (jsonData && jsonData.action === "reflect") {
            console.log(
              "🧠 REFLECT ACTION DETECTED! Stopping heartbeat loop to prevent overwriting reflection."
            );
            console.log(
              "💭 Reflection content will remain in input field for manual review/sending."
            );
            self.stopLoop();

            // Update toggle button to show stopped state
            if (typeof window.ToggleButton !== "undefined") {
              window.ToggleButton.resetToggleButton();
            }

            return; // Exit early - don't schedule next message
          }
        } catch (parseError) {
          console.log("⚠️ Response is not JSON, continuing normal loop");
        }

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
                },
                true // Skip MessageSender's response handling - MessageLoop will handle it
              );

              // Handle success case
              console.log(
                "🔍 MessageSender.sendTestMessage returned:",
                success
              );
              if (success) {
                console.log(
                  "✅ MessageSender success - setting up response observer"
                );
                self.attemptCount = 0;
                self.waitingForResponse = true;
                self.setupResponseObserver();
              } else {
                console.log(
                  "❌ MessageSender returned false - message not sent"
                );
              }
            } else {
              console.error("❌ Heartbeat failed:", heartbeatResult.error);
              console.log("🔄 Using fallback message for continuing loop");

              // Use fallback message when heartbeat fails
              const fallbackMessage = JSON.stringify({
                action: "heartbeat_fallback",
                timestamp: new Date().toISOString(),
                message:
                  "Ray heartbeat - server connection failed, using fallback",
                status: "offline_mode",
                iteration: self.attemptCount,
              });

              const success = window.MessageSender.sendTestMessage(
                fallbackMessage,
                () => {
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
                },
                true
              ); // Skip MessageSender's response handling

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
            const success = window.MessageSender.sendTestMessage(
              null,
              () => {
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
              },
              true
            ); // Skip MessageSender's response handling

            if (success) {
              self.attemptCount = 0;
              self.waitingForResponse = true;
              self.setupResponseObserver();
            }
          });
      } else {
        console.warn("⚠️ FetchSender not available, using default message");
        const success = window.MessageSender.sendTestMessage(
          null,
          () => {
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
          },
          true
        ); // Skip MessageSender's response handling

        if (success) {
          self.attemptCount = 0;
          self.waitingForResponse = true;
          self.setupResponseObserver();
        }
      }
    },

    /**
     * Send extracted JSON response to server using DataSender
     * @param {string} response - The JSON response text from ChatGPT
     */
    sendResponseToServer: async function (response) {
      try {
        console.log("📡 MessageLoop: Sending response via DataSender...");

        // Check if DataSender is available, fallback to old method if not
        if (typeof window.DataSender !== "undefined") {
          console.log("✅ Using DataSender for response transmission");

          // Get temporal context from ResponseTracker if available
          let temporalContext = { timestamp: new Date().toISOString() };
          if (
            typeof window.ResponseTracker !== "undefined" &&
            typeof window.ResponseTracker.getTemporalContext === "function"
          ) {
            temporalContext = window.ResponseTracker.getTemporalContext();
          }

          const result = await window.DataSender.sendExtractedResponse(
            response,
            {
              source: "messageLoop",
              loopIteration: this.attemptCount,
              timestamp: temporalContext.timestamp,
              browser_time: temporalContext.detailed,
              temporal_source: temporalContext.source,
              ray_consciousness_tick: temporalContext.timestamp,
            }
          );

          if (result.success) {
            console.log(
              "📡 MessageLoop: Response sent successfully via DataSender"
            );
          } else {
            console.error("❌ MessageLoop: DataSender failed:", result.error);
          }

          return result;
        } else {
          // Fallback to original method if DataSender not available
          console.warn("⚠️ DataSender not available, using fallback method");
          return this.sendResponseToServerFallback(response);
        }
      } catch (error) {
        console.error(
          "❌ MessageLoop: Error sending response to server:",
          error
        );
        return {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        };
      }
    },

    /**
     * Fallback method for sending responses (original logic)
     * @param {string} response - The JSON response text from ChatGPT
     */
    sendResponseToServerFallback: async function (response) {
      try {
        console.log("📡 MessageLoop: Using fallback sending method...");
        console.log(
          "📄 Response to send:",
          response?.substring(0, 100) + "..."
        );

        // Check if FetchSender is available
        if (typeof window.FetchSender === "undefined") {
          console.warn(
            "⚠️ FetchSender not available - cannot send response to server"
          );
          return { success: false, error: "FetchSender not available" };
        }

        // Try to parse the response as JSON
        let jsonData;
        try {
          jsonData = JSON.parse(response);
          console.log("✅ Response parsed as JSON:", jsonData);
        } catch (parseError) {
          console.warn(
            "⚠️ Response is not valid JSON, sending as text:",
            parseError.message
          );
          // Send as text response instead
          const result = await window.FetchSender.sendResponse(response);
          if (result.success) {
            console.log("📡 Text response sent to server successfully");
          } else {
            console.error(
              "❌ Failed to send text response to server:",
              result.error
            );
          }
          return result;
        }

        // Send JSON data to server
        const result = await window.FetchSender.sendJSON(jsonData);
        if (result.success) {
          console.log("📡 JSON response sent to server successfully");
          console.log("🔍 Server response:", result);
        } else {
          console.error(
            "❌ Failed to send JSON response to server:",
            result.error
          );
        }

        return result;
      } catch (error) {
        console.error("❌ Error in fallback sending method:", error);
        return {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        };
      }
    },
  };

  console.log("✅ MessageLoop loaded");
})();
("");
