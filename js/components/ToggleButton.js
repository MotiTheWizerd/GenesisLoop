/**
 * Toggle button component for controlling the message loop
 */
const ToggleButton = {
  /**
   * Create and append the toggle button to the DOM
   */
  createToggleButton: function() {
    const existing = document.getElementById("genesis-toggle");
    if (existing) return;

    const button = document.createElement("button");
    button.id = "genesis-toggle";
    button.textContent = Constants.BUTTON_STYLES.inactive.text;
    
    // Apply styles
    Object.entries({
      ...Constants.BUTTON_STYLES,
      backgroundColor: Constants.BUTTON_STYLES.inactive.backgroundColor
    }).forEach(([key, value]) => {
      if (typeof value === 'string') {
        button.style[key] = value;
      }
    });

    // Set up click handler
    let isRunning = false;
    button.onclick = () => {
      if (isRunning) {
        MessageLoop.stopLoop();
        button.textContent = Constants.BUTTON_STYLES.inactive.text;
        button.style.backgroundColor = Constants.BUTTON_STYLES.inactive.backgroundColor;
        isRunning = false;
      } else {
        MessageLoop.startLoop();
        button.textContent = Constants.BUTTON_STYLES.active.text;
        button.style.backgroundColor = Constants.BUTTON_STYLES.active.backgroundColor;
        isRunning = true;
      }
    };

    document.body.appendChild(button);
    console.log("✅ Toggle button created");
  },

  /**
   * Reset the toggle button to inactive state
   */
  resetToggleButton: function() {
    const button = document.getElementById("genesis-toggle");
    if (button) {
      button.textContent = Constants.BUTTON_STYLES.inactive.text;
      button.style.backgroundColor = Constants.BUTTON_STYLES.inactive.backgroundColor;
    }
  }
};