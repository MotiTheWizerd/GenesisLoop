/**
 * Constants used throughout the extension
 */
(function() {
  'use strict';
  
  window.Constants = {
    // Loop settings
    MAX_ATTEMPTS: 10,
    INTERVAL_TIME: 8000, // 8 seconds - increased to allow time for responses

    // Button styles
    BUTTON_STYLES: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: "99999",
      padding: "8px 16px",
      fontSize: "14px",
      borderRadius: "6px",
      border: "2px solid #333",
      cursor: "pointer",
      fontWeight: "bold",
      active: {
        backgroundColor: "#ef4444",
        text: "⏹️ Stop Auto-Test"
      },
      inactive: {
        backgroundColor: "#10a37f",
        text: "▶️ Start Auto-Test"
      }
    },

    // Default message to send
    DEFAULT_MESSAGE: "<test>"
  };
  
  console.log("✅ Constants loaded");
})();