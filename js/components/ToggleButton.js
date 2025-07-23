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

    // Set up click handler - just send test message
    button.onclick = () => {
      console.log("🔘 Button clicked - Sending single test message");
      
      // Just send one test message
      const elements = window.DOMUtils.findRequiredElements();
      if (elements.success) {
        console.log("✅ Elements found - Sending test message");
        window.MessageSender.sendTestMessage();
      } else {
        console.log("❌ Elements not found");
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