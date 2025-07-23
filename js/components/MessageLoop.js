/**
 * Message loop component for repeatedly sending messages (response-driven only)
 */
(function() {
  'use strict';
  
  window.MessageLoop = {
  // Module state - NO INTERVALS USED
  isRunning: false,
  attemptCount: 0,
  responseObserver: null,
  waitingForResponse: false,

  /**
   * Stop the message sending loop
   */
  stopLoop: function() {
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
  startLoop: function() {
    // Check if dependencies are loaded
    if (typeof window.DOMUtils === 'undefined' || 
        typeof window.Constants === 'undefined' || 
        typeof window.ResponseTracker === 'undefined' || 
        typeof window.MessageSender === 'undefined') {
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
   * Wait for the first response after button click
   */
  waitForFirstResponse: function() {
    // Check if dependencies are loaded
    if (typeof window.DOMUtils === 'undefined') {
      console.error("❌ Cannot wait for response - DOMUtils not loaded");
      return false;
    }
    
    // ResponseTracker is optional - create a fallback if missing
    if (typeof window.ResponseTracker === 'undefined') {
      console.warn("⚠️ ResponseTracker not loaded, creating fallback");
      window.ResponseTracker = {
        responses: [],
        addResponse: function(response) {
          this.responses.unshift({
            text: response,
            timestamp: new Date().toISOString()
          });
          console.log("📝 Fallback: Stored response");
        },
        getResponses: function() { return this.responses; },
        clearResponses: function() { this.responses = []; }
      };
    }
    
    if (this.waitingForResponse || !this.isRunning) {
      console.log("⚠️ Cannot wait for first response - already waiting or not running");
      return;
    }
    
    console.log("🎯 Setting up first response observer");
    const self = this;
    this.waitingForResponse = true;
    
    // Set up observer to wait for response
    this.responseObserver = window.DOMUtils.waitForResponse((response) => {
      console.log("🎉 CALLBACK RECEIVED! First response received, continuing response-driven loop");
      console.log("📥 Response received in callback:", response?.substring(0, 100) + "...");
      console.log("📊 Response length:", response?.length);
      
      self.waitingForResponse = false;
      self.responseObserver = null;
      
      // Store the response for later analysis
      if (typeof window.ResponseTracker !== 'undefined') {
        window.ResponseTracker.addResponse(response);
        console.log("💾 Response stored in tracker");
      } else {
        console.log("⚠️ ResponseTracker not available");
      }
      
      // Send the next message after a short delay (ONLY after response)
      if (self.isRunning) {
        console.log("⏳ Scheduling next message in 1 second...");
        setTimeout(() => {
          console.log("🔄 Sending next message after response");
          self.sendMessageAndWaitForResponse();
        }, 1000); // Small delay before sending next message
      } else {
        console.log("⚠️ Loop is not running, not sending next message");
      }
    });
  },

  /**
   * Send a message and wait for response, then send another message
   */
  sendMessageAndWaitForResponse: function() {
    // Check if critical dependencies are loaded
    if (typeof window.DOMUtils === 'undefined' || 
        typeof window.Constants === 'undefined' || 
        typeof window.MessageSender === 'undefined' || 
        typeof window.ToggleButton === 'undefined') {
      console.error("❌ Cannot send message - critical dependencies not loaded");
      return false;
    }
    
    // Create ResponseTracker fallback if missing
    if (typeof window.ResponseTracker === 'undefined') {
      console.warn("⚠️ ResponseTracker not loaded, creating fallback");
      window.ResponseTracker = {
        responses: [],
        addResponse: function(response) {
          this.responses.unshift({
            text: response,
            timestamp: new Date().toISOString()
          });
          console.log("📝 Fallback: Stored response");
        },
        getResponses: function() { return this.responses; },
        clearResponses: function() { this.responses = []; }
      };
    }
    
    // If we're already waiting for a response or not running, don't send another message
    if (this.waitingForResponse || !this.isRunning) {
      console.log("⏳ Still waiting for ChatGPT response or loop is stopped...");
      return;
    }
    
    const self = this;
    const success = window.MessageSender.sendTestMessage(() => {
      self.attemptCount++;
      console.log(`❌ Elements not ready. Attempt ${self.attemptCount}/${window.Constants.MAX_ATTEMPTS}`);

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
    });

    // If message was sent successfully, start waiting for response
    if (success) {
      this.attemptCount = 0;
      this.waitingForResponse = true;
      
      // Set up observer to wait for response
      this.responseObserver = window.DOMUtils.waitForResponse((response) => {
        console.log("🎉 CONTINUING LOOP CALLBACK! Response received, sending next message");
        console.log("📥 Continuing response received:", response?.substring(0, 100) + "...");
        console.log("📊 Continuing response length:", response?.length);
        
        self.waitingForResponse = false;
        self.responseObserver = null;
        
        // Store the response for later analysis
        if (typeof window.ResponseTracker !== 'undefined') {
          window.ResponseTracker.addResponse(response);
          console.log("💾 Continuing response stored in tracker");
        } else {
          console.log("⚠️ ResponseTracker not available for continuing response");
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
    }
  }
};

console.log("✅ MessageLoop loaded");
})();