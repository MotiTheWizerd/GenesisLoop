/**
 * Toggle button component for controlling the message loop
 */
(function() {
  'use strict';
  
  window.ToggleButton = {
  /**
   * Create and append the toggle button to the DOM
   */
  createToggleButton: function() {
    // Check if critical dependencies are loaded
    if (typeof window.Constants === 'undefined' || 
        typeof window.MessageLoop === 'undefined' || 
        typeof window.DOMUtils === 'undefined' || 
        typeof window.MessageSender === 'undefined') {
      console.log("❌ Cannot create toggle button - critical dependencies not loaded");
      // Try again after a delay, but limit retries
      if (!this.retryCount) this.retryCount = 0;
      this.retryCount++;
      
      if (this.retryCount < 10) {
        setTimeout(() => this.createToggleButton(), 1000);
      } else {
        console.error("❌ Max retries reached for toggle button creation");
      }
      return;
    }
    
    // Reset retry count on success
    this.retryCount = 0;
    
    const existing = document.getElementById("genesis-toggle");
    if (existing) return;

    const button = document.createElement("button");
    button.id = "genesis-toggle";
    button.textContent = window.Constants.BUTTON_STYLES.inactive.text;
    
    // Apply styles
    Object.entries({
      ...window.Constants.BUTTON_STYLES,
      backgroundColor: window.Constants.BUTTON_STYLES.inactive.backgroundColor
    }).forEach(([key, value]) => {
      if (typeof value === 'string') {
        button.style[key] = value;
      }
    });

    // Set up click handler - start/stop the message loop
    button.onclick = () => {
      console.log("🔘 Button clicked - Toggling message loop");
      
      // Check if MessageLoop is available
      if (typeof window.MessageLoop === 'undefined') {
        console.error("❌ MessageLoop not available");
        return;
      }
      
      // Toggle the loop
      if (window.MessageLoop.isRunning) {
        console.log("⏹️ Stopping message loop");
        window.MessageLoop.stopLoop();
        this.resetToggleButton();
      } else {
        console.log("▶️ Starting message loop");
        const elements = window.DOMUtils.findRequiredElements();
        if (elements.success) {
          console.log("✅ Elements found - Starting loop");
          
          // Update button to active state
          button.textContent = window.Constants.BUTTON_STYLES.active.text;
          button.style.backgroundColor = window.Constants.BUTTON_STYLES.active.backgroundColor;
          
          // Start the loop
          window.MessageLoop.startLoop();
          
          // Send first message and wait for response
          window.MessageLoop.waitForFirstResponse();
        } else {
          console.log("❌ Elements not found - cannot start loop");
        }
      }
    };

    document.body.appendChild(button);
    console.log("✅ Toggle button created");
  },

  /**
   * Reset the toggle button to inactive state
   */
  resetToggleButton: function() {
    if (typeof window.Constants === 'undefined') {
      console.log("❌ Cannot reset toggle button - Constants not loaded");
      return;
    }
    
    const button = document.getElementById("genesis-toggle");
    if (button) {
      button.textContent = window.Constants.BUTTON_STYLES.inactive.text;
      button.style.backgroundColor = window.Constants.BUTTON_STYLES.inactive.backgroundColor;
    }
  }
};

console.log("✅ ToggleButton loaded");
})();