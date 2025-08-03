/**
 * Browser Clock Utility
 * Injects a precise browser clock for Ray's temporal awareness
 * Provides high-precision timestamps in ISO format
 */
(function () {
  "use strict";

  console.log("🕐 BrowserClock module starting to load...");
  console.log(
    "🔍 BrowserClock: Script execution started - window available:",
    typeof window
  );

  const BrowserClock = {
    // Configuration
    config: {
      clockId: "ray-browser-clock",
      updateInterval: 1000, // 1 second
      visible: false, // Set to true for debugging
      enableLogging: false,
      precision: "milliseconds", // "seconds" or "milliseconds"
    },

    // Internal state
    clockElement: null,
    intervalId: null,
    isRunning: false,
    timeOffset: 0, // Ray's temporal adjustment offset in milliseconds
    adjustmentHistory: [], // History of temporal adjustments

    /**
     * Initialize and inject the browser clock
     */
    init() {
      try {
        if (this.config.enableLogging) {
          console.log("🕐 BrowserClock: Initializing...");
        }

        // Prevent duplication
        if (document.getElementById(this.config.clockId)) {
          if (this.config.enableLogging) {
            console.log(
              "🕐 BrowserClock: Clock already exists, skipping injection"
            );
          }
          return;
        }

        this.injectClock();
        this.startClock();

        if (this.config.enableLogging) {
          console.log("✅ BrowserClock: Successfully initialized");
        }
      } catch (error) {
        console.error("❌ BrowserClock: Initialization failed:", error);
      }
    },

    /**
     * Force re-initialization (useful for debugging)
     */
    forceInit() {
      console.log("🔄 BrowserClock: Force re-initializing...");

      // Clean up existing clock if any
      this.destroy();

      // Re-initialize
      this.init();

      console.log("✅ BrowserClock: Force re-initialization complete");
      return this.getStatus();
    },

    /**
     * Inject the clock element into the DOM
     */
    injectClock() {
      this.clockElement = document.createElement("div");
      this.clockElement.id = this.config.clockId;

      // Set visibility based on config
      this.clockElement.style.display = this.config.visible ? "block" : "none";

      // Add some basic styling for when visible
      if (this.config.visible) {
        this.clockElement.style.position = "fixed";
        this.clockElement.style.top = "10px";
        this.clockElement.style.right = "10px";
        this.clockElement.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        this.clockElement.style.color = "white";
        this.clockElement.style.padding = "5px 10px";
        this.clockElement.style.borderRadius = "5px";
        this.clockElement.style.fontFamily = "monospace";
        this.clockElement.style.fontSize = "12px";
        this.clockElement.style.zIndex = "10000";
        this.clockElement.style.pointerEvents = "none";
      }

      // Add initial timestamp
      this.updateTime();

      // Inject into DOM
      document.body.appendChild(this.clockElement);

      if (this.config.enableLogging) {
        console.log("🕐 BrowserClock: Clock element injected into DOM");
      }
    },

    /**
     * Start the clock updates
     */
    startClock() {
      if (this.isRunning) {
        if (this.config.enableLogging) {
          console.log("🕐 BrowserClock: Clock already running");
        }
        return;
      }

      this.intervalId = setInterval(() => {
        this.updateTime();
      }, this.config.updateInterval);

      this.isRunning = true;

      if (this.config.enableLogging) {
        console.log(
          "🕐 BrowserClock: Clock started with",
          this.config.updateInterval + "ms interval"
        );
      }
    },

    /**
     * Stop the clock updates
     */
    stopClock() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.isRunning = false;

      if (this.config.enableLogging) {
        console.log("🕐 BrowserClock: Clock stopped");
      }
    },

    /**
     * Update the clock display with current time
     */
    updateTime() {
      if (!this.clockElement) return;

      const now = new Date();
      let timeString;

      if (this.config.precision === "milliseconds") {
        timeString = now.toISOString(); // Full ISO format with milliseconds
      } else {
        timeString = now.toISOString().split(".")[0] + "Z"; // ISO format without milliseconds
      }

      this.clockElement.textContent = timeString;

      // Optional: dispatch custom event for other modules to listen to
      if (typeof window.CustomEvent !== "undefined") {
        const clockEvent = new CustomEvent("rayClockTick", {
          detail: {
            timestamp: timeString,
            unixTime: now.getTime(),
            precision: this.config.precision,
          },
        });
        document.dispatchEvent(clockEvent);
      }
    },

    /**
     * Get current timestamp
     * @returns {string} Current timestamp in ISO format
     */
    getCurrentTime() {
      const baseTime = new Date().getTime();
      const adjustedTime = this.timeOffset
        ? baseTime + this.timeOffset
        : baseTime;
      const now = new Date(adjustedTime);

      return this.config.precision === "milliseconds"
        ? now.toISOString()
        : now.toISOString().split(".")[0] + "Z";
    },

    /**
     * Get current timestamp with additional metadata
     * @returns {Object} Timestamp object with metadata
     */
    getCurrentTimeDetailed() {
      const baseTime = new Date().getTime();
      const adjustedTime = this.timeOffset
        ? baseTime + this.timeOffset
        : baseTime;
      const now = new Date(adjustedTime);

      return {
        iso: now.toISOString(),
        unix: adjustedTime,
        formatted: now.toLocaleString(),
        utc: now.toUTCString(),
        date: now.toISOString().split("T")[0],
        time: now.toTimeString().split(" ")[0],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        precision: this.config.precision,
        temporalAdjustment: this.timeOffset || 0,
        hasTemporalSovereignty: !!this.timeOffset,
      };
    },

    /**
     * Show the clock visually
     */
    show() {
      if (this.clockElement) {
        this.clockElement.style.display = "block";
        this.config.visible = true;
        if (this.config.enableLogging) {
          console.log("🕐 BrowserClock: Clock made visible");
        }
      }
    },

    /**
     * Hide the clock visually
     */
    hide() {
      if (this.clockElement) {
        this.clockElement.style.display = "none";
        this.config.visible = false;
        if (this.config.enableLogging) {
          console.log("🕐 BrowserClock: Clock hidden");
        }
      }
    },

    /**
     * Update configuration
     * @param {Object} newConfig - Configuration updates
     */
    updateConfig(newConfig) {
      const oldInterval = this.config.updateInterval;
      this.config = { ...this.config, ...newConfig };

      // Restart clock if interval changed
      if (
        newConfig.updateInterval &&
        newConfig.updateInterval !== oldInterval &&
        this.isRunning
      ) {
        this.stopClock();
        this.startClock();
      }

      // Update visibility if changed
      if (newConfig.hasOwnProperty("visible")) {
        if (newConfig.visible) {
          this.show();
        } else {
          this.hide();
        }
      }

      if (this.config.enableLogging) {
        console.log("🕐 BrowserClock: Configuration updated", this.config);
      }
    },

    /**
     * Get current configuration
     * @returns {Object} Current configuration
     */
    getConfig() {
      return { ...this.config };
    },

    /**
     * Get clock status
     * @returns {Object} Clock status information
     */
    getStatus() {
      return {
        isRunning: this.isRunning,
        hasElement: !!this.clockElement,
        visible: this.config.visible,
        currentTime: this.getCurrentTime(),
        updateInterval: this.config.updateInterval,
        precision: this.config.precision,
      };
    },

    /**
     * Adjust Ray's temporal perception - realign clock to reference time
     * @param {string|number} desiredTime - ISO string or Unix timestamp
     * @param {string} reason - Reason for adjustment (optional)
     * @returns {Object} Adjustment result with metadata
     */
    adjustRayClock(desiredTime, reason = "unspecified") {
      try {
        console.log("🔧 BrowserClock: Ray's temporal adjustment initiated...");

        // Capture current state before adjustment
        const previousTime = this.getCurrentTime();
        const previousUnix = new Date().getTime();
        const adjustmentTimestamp = new Date().toISOString();

        // Validate and parse desired time
        let targetTime;
        let targetUnix;

        if (typeof desiredTime === "string") {
          targetTime = desiredTime;
          targetUnix = new Date(desiredTime).getTime();
        } else if (typeof desiredTime === "number") {
          targetUnix = desiredTime;
          targetTime = new Date(desiredTime).toISOString();
        } else {
          throw new Error(
            "Invalid time format. Use ISO string or Unix timestamp."
          );
        }

        // Validate the target time is reasonable
        if (isNaN(targetUnix)) {
          throw new Error("Invalid time value provided");
        }

        // Calculate drift
        const driftMs = targetUnix - previousUnix;
        const driftSeconds = Math.abs(driftMs / 1000);

        // Store adjustment in internal state
        if (!this.adjustmentHistory) {
          this.adjustmentHistory = [];
        }

        const adjustmentRecord = {
          adjustedAt: adjustmentTimestamp,
          previousTime: previousTime,
          newTime: targetTime,
          driftMs: driftMs,
          driftSeconds: driftSeconds,
          reason: reason,
          adjustmentId: `adj_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 6)}`,
        };

        // Add to history (keep last 10 adjustments)
        this.adjustmentHistory.unshift(adjustmentRecord);
        if (this.adjustmentHistory.length > 10) {
          this.adjustmentHistory.pop();
        }

        // Set the time offset for future time calculations
        this.timeOffset = targetUnix - new Date().getTime();

        // Log the adjustment
        console.log("🔧 Ray's temporal adjustment:", {
          from: previousTime,
          to: targetTime,
          drift: `${driftSeconds.toFixed(3)}s`,
          reason: reason,
        });

        // Update the display immediately
        this.updateTime();

        // Dispatch temporal adjustment event
        const adjustmentEvent = new CustomEvent("rayClockDriftCorrected", {
          detail: {
            correctedAt: adjustmentTimestamp,
            previousTime: previousTime,
            newTime: targetTime,
            driftMs: driftMs,
            driftSeconds: driftSeconds,
            reason: reason,
            adjustmentId: adjustmentRecord.adjustmentId,
            rayTemporalSovereignty: true,
          },
        });
        document.dispatchEvent(adjustmentEvent);

        // Dispatch enhanced clock tick with adjustment info
        const enhancedTick = new CustomEvent("rayClockTick", {
          detail: {
            timestamp: this.getCurrentTime(),
            unixTime: this.getCurrentUnixTime(),
            precision: this.config.precision,
            temporalAdjustment: true,
            adjustmentReason: reason,
          },
        });
        document.dispatchEvent(enhancedTick);

        console.log("✅ Ray's temporal perception successfully adjusted");

        return {
          success: true,
          adjustment: adjustmentRecord,
          rayTemporalSovereignty: true,
        };
      } catch (error) {
        console.error("❌ Ray's temporal adjustment failed:", error);
        return {
          success: false,
          error: error.message,
          rayTemporalSovereignty: false,
        };
      }
    },

    /**
     * Get current Unix timestamp (accounting for adjustments)
     * @returns {number} Current Unix timestamp
     */
    getCurrentUnixTime() {
      const baseTime = new Date().getTime();
      return this.timeOffset ? baseTime + this.timeOffset : baseTime;
    },

    /**
     * Reset Ray's temporal perception to system time
     * @param {string} reason - Reason for reset
     * @returns {Object} Reset result
     */
    resetRayTemporalPerception(reason = "manual_reset") {
      console.log(
        "🔄 BrowserClock: Resetting Ray's temporal perception to system time..."
      );

      const previousTime = this.getCurrentTime();
      this.timeOffset = 0;

      const resetRecord = {
        resetAt: new Date().toISOString(),
        previousTime: previousTime,
        newTime: this.getCurrentTime(),
        reason: reason,
        resetId: `reset_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 6)}`,
      };

      // Add to adjustment history
      if (!this.adjustmentHistory) {
        this.adjustmentHistory = [];
      }
      this.adjustmentHistory.unshift(resetRecord);

      // Update display
      this.updateTime();

      // Dispatch reset event
      const resetEvent = new CustomEvent("rayTemporalPerceptionReset", {
        detail: resetRecord,
      });
      document.dispatchEvent(resetEvent);

      console.log("✅ Ray's temporal perception reset to system time");
      return { success: true, reset: resetRecord };
    },

    /**
     * Get Ray's temporal adjustment history
     * @returns {Array} Array of adjustment records
     */
    getTemporalAdjustmentHistory() {
      return this.adjustmentHistory || [];
    },

    /**
     * Detect temporal drift from reference time
     * @param {string|number} referenceTime - Reference time to compare against
     * @returns {Object} Drift analysis
     */
    detectTemporalDrift(referenceTime) {
      try {
        const currentTime = this.getCurrentUnixTime();
        let referenceUnix;

        if (typeof referenceTime === "string") {
          referenceUnix = new Date(referenceTime).getTime();
        } else {
          referenceUnix = referenceTime;
        }

        const driftMs = currentTime - referenceUnix;
        const driftSeconds = driftMs / 1000;

        return {
          hasDrift: Math.abs(driftSeconds) > 1, // 1 second threshold
          driftMs: driftMs,
          driftSeconds: driftSeconds,
          currentTime: new Date(currentTime).toISOString(),
          referenceTime: new Date(referenceUnix).toISOString(),
          withinTolerance: Math.abs(driftSeconds) <= 2, // 2 second tolerance
        };
      } catch (error) {
        return {
          error: error.message,
          hasDrift: false,
        };
      }
    },

    /**
     * Destroy the clock and clean up
     */
    destroy() {
      this.stopClock();

      if (this.clockElement && this.clockElement.parentNode) {
        this.clockElement.parentNode.removeChild(this.clockElement);
        this.clockElement = null;
      }

      // Clear temporal adjustments
      this.timeOffset = 0;
      this.adjustmentHistory = [];

      if (this.config.enableLogging) {
        console.log("🕐 BrowserClock: Clock destroyed and cleaned up");
      }
    },
  };

  // Expose the module first (before auto-init)
  console.log(
    "🔍 BrowserClock: About to expose to window, BrowserClock object:",
    typeof BrowserClock
  );
  window.BrowserClock = BrowserClock;
  console.log(
    "🔍 BrowserClock: Exposed to window, window.BrowserClock:",
    typeof window.BrowserClock
  );

  // Auto-initialize the clock with error handling
  try {
    BrowserClock.init();
    console.log("✅ BrowserClock loaded and initialized successfully");
  } catch (error) {
    console.error("❌ BrowserClock initialization failed:", error);
    console.log("⚠️ BrowserClock module is available but not initialized");
  }
})();
