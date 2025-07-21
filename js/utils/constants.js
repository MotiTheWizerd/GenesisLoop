/**
 * Constants used throughout the extension
 */
const Constants = {
  // Loop settings
  MAX_ATTEMPTS: 10,
  INTERVAL_TIME: 5000, // 5 seconds

  // Button styles
  BUTTON_STYLES: {
    position: "fixed",
    top: "10px",
    right: "10px",
    zIndex: "9999",
    padding: "6px 12px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    active: {
      backgroundColor: "#ef4444",
      text: "⏸️ Stop Loop"
    },
    inactive: {
      backgroundColor: "#10a37f",
      text: "▶️ Start Loop"
    }
  },

  // Default message to send
  DEFAULT_MESSAGE: "<test>"
};