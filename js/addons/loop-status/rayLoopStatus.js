(function () {
  "use strict";

  let statusDisplay = null;
  let updateInterval = null;
  let loopState = {
    isRunning: false,
    lastRun: null,
    nextRun: null,
    interval: 30000, // 30 seconds default - will be updated from MessageLoop
    responseCount: 0,
    errors: 0,
    status: "Initializing",
    visible: true,
    position: { top: 10, right: 10 },
  };

  const STORAGE_KEY = "ray_loop_status_state";

  // Get real-time interval from MessageLoop or RaySettings
  function getRealTimeInterval() {
    // Try to get from MessageLoop first (most accurate)
    if (
      typeof window.MessageLoop !== "undefined" &&
      window.MessageLoop.getInterval
    ) {
      return window.MessageLoop.getInterval();
    }

    // Fallback to RaySettings
    if (typeof window.RaySettings !== "undefined") {
      const intervalSeconds =
        window.RaySettings.get("messageLoop.interval") || 30;
      return intervalSeconds * 1000; // Convert to milliseconds
    }

    // Final fallback to stored state
    return loopState.interval;
  }

  // Load saved interval from localStorage and apply to RaySettings
  function loadSavedInterval() {
    try {
      // Check localStorage first
      const savedData = localStorage.getItem('ray_settings');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const timeSinceSave = Date.now() - (parsedData.timestamp || 0);
        
        // Load if saved within last 7 days
        if (timeSinceSave < 7 * 24 * 60 * 60 * 1000 && parsedData.settings) {
          const savedInterval = parsedData.settings?.messageLoop?.interval;
          if (savedInterval && savedInterval !== 30 && typeof window.RaySettings !== 'undefined') {
            console.log(`📂 [RayLoopStatus] Loading saved interval: ${savedInterval}s`);
            window.RaySettings.set('messageLoop.interval', savedInterval);
            loopState.interval = savedInterval * 1000; // Update local state
            return true;
          }
        }
      }

      // Check Chrome storage as fallback
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['ray_heartbeat_interval'], (result) => {
          if (result.ray_heartbeat_interval && result.ray_heartbeat_interval !== 30) {
            console.log(`📂 [RayLoopStatus] Loading Chrome storage interval: ${result.ray_heartbeat_interval}s`);
            
            if (typeof window.RaySettings !== 'undefined') {
              window.RaySettings.set('messageLoop.interval', result.ray_heartbeat_interval);
            }
            
            loopState.interval = result.ray_heartbeat_interval * 1000;
            
            // Update display if it exists
            if (statusDisplay) {
              updateDisplay();
            }
          }
        });
      }
    } catch (error) {
      console.warn('⚠️ [RayLoopStatus] Error loading saved interval:', error);
    }
    
    return false;
  }

  // Create a Proxy to automatically save on any state change
  const createAutoSaveProxy = (target, changeType) => {
    return new Proxy(target, {
      set(obj, prop, value) {
        const oldValue = obj[prop];
        const changed = oldValue !== value;

        obj[prop] = value;

        if (changed) {
          console.log(
            `🔄 State change detected: ${prop} = ${value} (was: ${oldValue})`
          );
          triggerAutoSave(`${changeType}.${prop}`);
        }

        return true;
      },
    });
  };

  // Wrap loopState with auto-save proxy
  loopState = createAutoSaveProxy(loopState, "loopState");

  let saveTimeout = null;
  let saveQueue = false;

  function saveState(immediate = false, changeType = "unknown") {
    try {
      const stateToSave = {
        ...loopState,
        lastSaved: Date.now(),
      };

      if (immediate) {
        // Save immediately
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        console.log("💾 Ray Loop Status state saved (immediate)");
        saveQueue = false;
      } else {
        // Debounced save to prevent too many writes
        saveQueue = true;
        if (saveTimeout) {
          clearTimeout(saveTimeout);
        }

        saveTimeout = setTimeout(() => {
          if (saveQueue) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
            // Only log saves for non-display updates to reduce spam
            if (changeType !== "display_update") {
              console.log("💾 Ray Loop Status state saved (debounced)");
            }
            saveQueue = false;
          }
        }, 100); // Save after 100ms of no changes
      }
    } catch (error) {
      console.error("❌ Failed to save Ray Loop Status state:", error);
    }
  }

  // Auto-save wrapper that triggers on any state change
  function triggerAutoSave(changeType = "unknown") {
    // Only log auto-save for important changes, not frequent display updates
    if (changeType !== "display_update") {
      console.log(`🔄 Auto-save triggered by: ${changeType}`);
    }
    saveState(false, changeType); // Use debounced save for frequent changes
  }

  function loadState() {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);

        // Merge saved state with current state
        Object.assign(loopState, parsedState);

        // Reset running state on page load (loop doesn't persist across refreshes)
        loopState.isRunning = false;
        loopState.status = "Loaded from Storage";

        // Adjust timing if needed
        const timeSinceLastSave = Date.now() - (parsedState.lastSaved || 0);
        if (loopState.nextRun && timeSinceLastSave > 0) {
          loopState.nextRun = Math.max(
            loopState.nextRun - timeSinceLastSave,
            Date.now()
          );
        }

        console.log("📂 Ray Loop Status state loaded:", loopState);
        return true;
      }
    } catch (error) {
      console.error("❌ Failed to load Ray Loop Status state:", error);
    }
    return false;
  }

  function createStatusDisplay() {
    // Remove existing display
    if (statusDisplay) {
      statusDisplay.remove();
    }

    statusDisplay = document.createElement("div");
    statusDisplay.id = "ray-loop-status";
    statusDisplay.style.cssText = `
            position: fixed;
            top: ${loopState.position.top}px;
            right: ${loopState.position.right}px;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            color: #00ff88;
            padding: 15px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            z-index: 10000;
            border: 1px solid #00ff88;
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
            min-width: 250px;
            backdrop-filter: blur(10px);
            display: ${loopState.visible ? "block" : "none"};
            cursor: move;
        `;

    // Make it draggable
    makeDraggable(statusDisplay);

    document.body.appendChild(statusDisplay);
    console.log("🔄 Ray Loop Status display created");
  }

  function makeDraggable(element) {
    let isDragging = false;
    let startX, startY, startTop, startRight;

    element.addEventListener("mousedown", function (e) {
      if (e.target === element || e.target.parentElement === element) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startTop = parseInt(element.style.top);
        startRight = parseInt(element.style.right);
        element.style.cursor = "grabbing";
        e.preventDefault();
      }
    });

    document.addEventListener("mousemove", function (e) {
      if (isDragging) {
        const deltaX = startX - e.clientX; // Reversed for right positioning
        const deltaY = e.clientY - startY;

        const newTop = Math.max(0, startTop + deltaY);
        const newRight = Math.max(0, startRight + deltaX);

        element.style.top = newTop + "px";
        element.style.right = newRight + "px";

        // Update state
        loopState.position.top = newTop;
        loopState.position.right = newRight;
      }
    });

    document.addEventListener("mouseup", function () {
      if (isDragging) {
        isDragging = false;
        element.style.cursor = "move";
        saveState(); // Save position when dragging ends
      }
    });
  }

  function updateDisplay() {
    if (!statusDisplay) return;

    // Define formatTime function first (before it's used)
    const formatTime = (ms) => {
      if (ms < 0) return "0s";
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
      }
      return `${seconds}s`;
    };

    // Get real-time interval from MessageLoop if available
    const realTimeInterval = getRealTimeInterval();
    if (realTimeInterval !== loopState.interval) {
      loopState.interval = realTimeInterval;
    }

    const now = Date.now();
    const timeSinceLastRun = loopState.lastRun ? now - loopState.lastRun : 0;
    
    // Calculate next run time more intelligently
    let timeUntilNextRun = 0;
    let nextRunText = 'Not Scheduled';
    
    if (loopState.nextRun && loopState.nextRun > now) {
      // We have a valid future next run time
      timeUntilNextRun = loopState.nextRun - now;
      nextRunText = formatTime(timeUntilNextRun);
    } else if (loopState.isRunning && loopState.lastRun) {
      // Loop is running but no explicit next run time - calculate based on last run + interval
      const expectedNextRun = loopState.lastRun + loopState.interval;
      if (expectedNextRun > now) {
        timeUntilNextRun = expectedNextRun - now;
        nextRunText = formatTime(timeUntilNextRun);
      } else {
        nextRunText = 'Now';
        timeUntilNextRun = 0;
      }
    } else if (loopState.isRunning) {
      // Loop is running but no last run time - should run now
      nextRunText = 'Now';
      timeUntilNextRun = 0;
    } else {
      // Loop is not running
      nextRunText = 'Stopped';
      timeUntilNextRun = -1; // Use -1 to indicate stopped state
    }

    const getStatusColor = () => {
      if (loopState.errors > 0) return "#ff4444";
      if (loopState.isRunning) return "#00ff88";
      if (timeUntilNextRun > 0 && timeUntilNextRun < 5000) return "#ffaa00";
      return "#00ff88";
    };

    // Get countdown color based on time remaining
    const getCountdownColor = () => {
      if (timeUntilNextRun < 0) return "#888888"; // Gray for stopped
      if (timeUntilNextRun === 0) return "#ffaa00"; // Orange for "Now"
      if (timeUntilNextRun < 5000) return "#ff6666"; // Red for < 5s
      if (timeUntilNextRun < 10000) return "#ffaa00"; // Orange for < 10s
      return "#00ff88"; // Green for normal
    };

    statusDisplay.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <div style="display: flex; align-items: center;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: ${getStatusColor()}; margin-right: 8px; animation: ${
      loopState.isRunning ? "pulse 1s infinite" : "none"
    };"></div>
                    <strong>RAY LOOP STATUS</strong>
                </div>
                <div style="display: flex; gap: 5px;">
                    <button onclick="window.RayLoopStatus.toggleVisibility()" style="background: none; border: 1px solid #00ff88; color: #00ff88; padding: 2px 6px; border-radius: 3px; font-size: 10px; cursor: pointer;" title="Toggle Visibility">👁️</button>
                    <button onclick="window.RayLoopStatus.resetPosition()" style="background: none; border: 1px solid #00ff88; color: #00ff88; padding: 2px 6px; border-radius: 3px; font-size: 10px; cursor: pointer;" title="Reset Position">📍</button>
                    <button onclick="window.RayLoopStatus.exportState()" style="background: none; border: 1px solid #00ff88; color: #00ff88; padding: 2px 6px; border-radius: 3px; font-size: 10px; cursor: pointer;" title="Export State">💾</button>
                </div>
            </div>
            
            <div style="margin-bottom: 8px;">
                <strong>State:</strong> ${loopState.status}
            </div>
            
            <div style="margin-bottom: 8px;">
                <strong>Running:</strong> ${
                  loopState.isRunning ? "🟢 YES" : "🔴 NO"
                }
            </div>
            
            <div style="margin-bottom: 8px;">
                <strong>Last Run:</strong> ${
                  loopState.lastRun
                    ? formatTime(timeSinceLastRun) + " ago"
                    : "Never"
                }
            </div>
            
            <div style="margin-bottom: 8px;">
                <strong>Next Run:</strong> <span style="color: ${getCountdownColor()}; font-weight: bold;">${nextRunText}</span>
            </div>
            
            <div style="margin-bottom: 8px;">
                <strong>Interval:</strong> ${formatTime(loopState.interval)}
            </div>
            
            <div style="margin-bottom: 8px;">
                <strong>Responses:</strong> ${loopState.responseCount}
            </div>
            
            <div style="margin-bottom: 8px;">
                <strong>Errors:</strong> ${
                  loopState.errors > 0 ? "🔴 " + loopState.errors : "🟢 0"
                }
            </div>
            
            <div style="font-size: 10px; opacity: 0.7; margin-top: 10px; display: flex; justify-content: space-between;">
                <span>Updated: ${new Date().toLocaleTimeString()}</span>
                <span>Drag to move</span>
            </div>
        `;

    // Add pulse animation for active state
    if (!document.getElementById("ray-status-styles")) {
      const style = document.createElement("style");
      style.id = "ray-status-styles";
      style.textContent = `
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                #ray-loop-status button:hover {
                    background: rgba(0, 255, 136, 0.1) !important;
                }
            `;
      document.head.appendChild(style);
    }

    // Trigger auto-save on display update (captures timing changes)
    triggerAutoSave("display_update");
  }

  function startStatusUpdates() {
    if (updateInterval) {
      clearInterval(updateInterval);
    }

    updateInterval = setInterval(updateDisplay, 1000); // Update every second
    updateDisplay(); // Initial update

    // Listen for settings changes to update interval in real-time
    document.addEventListener("raySettingsChanged", (event) => {
      if (event.detail && event.detail.path === "messageLoop.interval") {
        console.log(
          "🔄 Ray Loop Status: Interval changed to",
          event.detail.newValue + "s"
        );
        loopState.interval = event.detail.newValue * 1000; // Convert to milliseconds
        updateDisplay(); // Immediate update
      }
    });

    console.log("🔄 Ray Loop Status updates started");
  }

  function stopStatusUpdates() {
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
    console.log("🔄 Ray Loop Status updates stopped");
  }

  // Public API
  window.RayLoopStatus = {
    init: function () {
      // Load saved state first
      loadState();

      // Load saved interval from storage and apply to RaySettings
      loadSavedInterval();

      // Get real-time interval on initialization (after loading saved settings)
      loopState.interval = getRealTimeInterval();

      createStatusDisplay();
      startStatusUpdates();
      console.log("✅ RayLoopStatus initialized with persistent state");
    },

    updateState: function (newState) {
      // Use Object.assign to trigger proxy setters for each property
      Object.keys(newState).forEach((key) => {
        loopState[key] = newState[key]; // This will trigger auto-save via proxy
      });
      updateDisplay();
      triggerAutoSave("updateState");
    },

    setRunning: function (isRunning) {
      loopState.isRunning = isRunning; // Auto-save via proxy
      if (isRunning) {
        loopState.lastRun = Date.now(); // Auto-save via proxy
        loopState.status = "Running"; // Auto-save via proxy
      } else {
        loopState.status = "Waiting"; // Auto-save via proxy
      }
      updateDisplay();
      triggerAutoSave("setRunning");
    },

    setNextRun: function (timestamp) {
      loopState.nextRun = timestamp; // Auto-save via proxy
      updateDisplay();
      triggerAutoSave("setNextRun");
    },

    incrementResponses: function () {
      loopState.responseCount++; // Auto-save via proxy
      updateDisplay();
      triggerAutoSave("incrementResponses");
    },

    incrementErrors: function () {
      loopState.errors++; // Auto-save via proxy
      updateDisplay();
      triggerAutoSave("incrementErrors");
    },

    setStatus: function (status) {
      loopState.status = status; // Auto-save via proxy
      updateDisplay();
      triggerAutoSave("setStatus");
    },

    setInterval: function (interval) {
      loopState.interval = interval; // Auto-save via proxy
      updateDisplay();
      triggerAutoSave("setInterval");
    },

    syncInterval: function () {
      // Force sync with real-time interval from MessageLoop/RaySettings
      const realInterval = getRealTimeInterval();
      if (realInterval !== loopState.interval) {
        loopState.interval = realInterval;
        updateDisplay();
        triggerAutoSave("syncInterval");
        console.log(
          "🔄 Ray Loop Status: Synced interval to",
          realInterval / 1000 + "s"
        );
      }
    },

    show: function () {
      loopState.visible = true; // Auto-save via proxy
      if (statusDisplay) {
        statusDisplay.style.display = "block";
      }
      triggerAutoSave("show");
    },

    hide: function () {
      loopState.visible = false; // Auto-save via proxy
      if (statusDisplay) {
        statusDisplay.style.display = "none";
      }
      triggerAutoSave("hide");
    },

    toggleVisibility: function () {
      if (loopState.visible) {
        this.hide();
      } else {
        this.show();
      }
      triggerAutoSave("toggleVisibility");
    },

    resetPosition: function () {
      loopState.position = { top: 10, right: 10 }; // Auto-save via proxy
      if (statusDisplay) {
        statusDisplay.style.top = "10px";
        statusDisplay.style.right = "10px";
      }
      triggerAutoSave("resetPosition");
      console.log("📍 Ray Loop Status position reset");
    },

    exportState: function () {
      try {
        const exportData = {
          ...loopState,
          exportedAt: new Date().toISOString(),
          version: "1.0",
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `ray_loop_status_${new Date()
          .toISOString()
          .slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log("💾 Ray Loop Status state exported");
      } catch (error) {
        console.error("❌ Failed to export state:", error);
      }
    },

    importState: function (jsonData) {
      try {
        const importedState =
          typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;

        // Validate imported data
        if (importedState && typeof importedState === "object") {
          // Merge with current state, preserving critical runtime values
          const preserveRuntime = {
            isRunning: loopState.isRunning,
            lastRun: loopState.lastRun,
            nextRun: loopState.nextRun,
          };

          Object.assign(loopState, importedState, preserveRuntime);

          // Recreate display with new state
          createStatusDisplay();
          updateDisplay();
          saveState();

          console.log("📂 Ray Loop Status state imported successfully");
          return true;
        }
      } catch (error) {
        console.error("❌ Failed to import state:", error);
      }
      return false;
    },

    getState: function () {
      return { ...loopState };
    },

    clearState: function () {
      try {
        localStorage.removeItem(STORAGE_KEY);
        console.log("🗑️ Ray Loop Status state cleared");
      } catch (error) {
        console.error("❌ Failed to clear state:", error);
      }
    },

    destroy: function () {
      stopStatusUpdates();
      if (statusDisplay) {
        statusDisplay.remove();
        statusDisplay = null;
      }
      saveState();
    },
  };

  console.log("✅ RayLoopStatus loaded");
})();
