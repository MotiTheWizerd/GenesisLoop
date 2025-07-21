/**
 * Message loop component for repeatedly sending messages
 */
const MessageLoop = {
  // Module state
  intervalId: null,
  isRunning: false,
  attemptCount: 0,

  /**
   * Stop the message sending loop
   */
  stopLoop: function() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    this.attemptCount = 0;
    console.log("⏹️ Loop stopped.");
  },

  /**
   * Start the message sending loop
   */
  startLoop: function() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.attemptCount = 0;
    console.log("⏳ Starting loop...");

    // Try to find elements immediately
    const elements = DOMUtils.findRequiredElements();
    if (elements.success) {
      console.log("✅ Elements found immediately. Starting interval.");
      this.intervalId = setInterval(() => this.handleIntervalTick(), Constants.INTERVAL_TIME);
    } else {
      // If not found, set up an observer and a safety timeout
      console.log("👁️ Watching for ChatGPT UI to render...");
      this.setupObserver();

      // Safety timeout to prevent getting stuck in "Starting loop..." state
      setTimeout(() => {
        if (this.isRunning && !this.intervalId) {
          console.log("⚠️ Timeout reached. Elements not found. Stopping loop.");
          this.stopLoop();
          ToggleButton.resetToggleButton();
          DOMUtils.debugElements();
        }
      }, 10000); // 10 second timeout
    }
  },

  /**
   * Handle each interval tick for the message loop
   */
  handleIntervalTick: function() {
    const self = this;
    const success = MessageSender.sendTestMessage(() => {
      self.attemptCount++;
      console.log(`❌ Elements not ready. Attempt ${self.attemptCount}/${Constants.MAX_ATTEMPTS}`);

      // If we've tried too many times, stop the loop
      if (self.attemptCount >= Constants.MAX_ATTEMPTS) {
        console.log("⚠️ Max attempts reached. Stopping loop.");
        self.stopLoop();
        ToggleButton.resetToggleButton();
        DOMUtils.debugElements();
      }
    });

    // Reset attempt count if successful
    if (success) {
      this.attemptCount = 0;
    }
  },

  /**
   * Set up a mutation observer to watch for ChatGPT UI elements
   */
  setupObserver: function() {
    const self = this;
    const observer = new MutationObserver(() => {
      const elements = DOMUtils.findRequiredElements();

      if (elements.success && self.isRunning && !self.intervalId) {
        observer.disconnect();
        console.log("✅ Elements appeared. Starting interval.");
        self.intervalId = setInterval(() => self.handleIntervalTick(), Constants.INTERVAL_TIME);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
};