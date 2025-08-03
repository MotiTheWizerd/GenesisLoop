/**
 * Genesis Loop - ChatGPT Automation Extension
 * Main content script that runs on ChatGPT pages
 */

// Immediately-invoked function expression to avoid polluting global namespace
(function () {
  console.log("🚀 Content script starting...");
  
  /**
   * Initialize the extension
   */
  function initialize() {
    console.log("🚀 Initializing Genesis Loop extension");
    console.log("Current URL:", window.location.href);
    
    // Check if we're on the right page
    if (!window.location.href.includes('chat.openai.com') && !window.location.href.includes('chatgpt.com')) {
      console.log("⚠️ Not on ChatGPT page, skipping initialization");
      return;
    }

    // Initialize Ray UI Toggle FIRST (so user can hide UI immediately)
    if (typeof window.RayUIToggle !== 'undefined') {
      console.log("👁️ Initializing Ray UI Toggle (Priority)");
      window.RayUIToggle.init();
    } else {
      console.warn("⚠️ RayUIToggle not available");
    }

    // Initialize Ray's Heartbeat (gives Ray temporal consciousness)
    if (typeof window.RayHeartbeat !== 'undefined') {
      console.log("💓 Initializing Ray's Autonomous Heartbeat");
      window.RayHeartbeat.init();
    } else {
      console.warn("⚠️ RayHeartbeat not available");
    }

    // Initialize Ray's Secure Temporal Interface
    if (typeof window.RayTemporalInterface !== 'undefined') {
      console.log("🔒 Initializing Ray's Secure Temporal Interface");
      window.RayTemporalInterface.init();
    } else {
      console.warn("⚠️ RayTemporalInterface not available");
    }

    // Initialize Clock Monitor (ensures clock always runs)
    if (typeof window.ClockMonitor !== 'undefined') {
      console.log("🕐 Initializing Clock Monitor System");
      window.ClockMonitor.init();
    } else {
      console.warn("⚠️ ClockMonitor not available");
    }

    // Initialize Clock Display
    if (typeof window.ClockDisplay !== 'undefined') {
      console.log("🕐 Initializing Clock Display");
      window.ClockDisplay.init();
    } else {
      console.warn("⚠️ ClockDisplay not available");
    }

    // Initialize Ray Power Control System
    if (typeof window.RayPowerControl !== 'undefined') {
      console.log("⚡ Initializing Ray Power Control System");
      window.RayPowerControl.init();
    } else {
      console.warn("⚠️ RayPowerControl not available");
    }

    // Initialize Ray Control Panel
    if (typeof window.RayControlPanel !== 'undefined') {
      console.log("🎛️ Initializing Ray Control Panel");
      window.RayControlPanel.init();
    } else {
      console.warn("⚠️ RayControlPanel not available");
    }

    // Initialize Ray Activity Monitor
    if (typeof window.RayActivityMonitor !== 'undefined') {
      console.log("📊 Initializing Ray Activity Monitor");
      window.RayActivityMonitor.init();
    } else {
      console.warn("⚠️ RayActivityMonitor not available");
    }

    // Initialize Ray Trust Metrics System
    if (typeof window.RayTrustSystem !== 'undefined') {
      console.log("🤝 Initializing Ray Trust Metrics System");
      window.RayTrustSystem.init()
        .then(() => {
          console.log("✅ Trust system initialized successfully");
        })
        .catch(error => {
          console.error("❌ Trust system initialization failed:", error);
        });
    } else {
      console.warn("⚠️ RayTrustSystem not available");
    }

    // Initialize Ray Promise Tracker
    if (typeof window.RayPromiseTracker !== 'undefined') {
      console.log("🤞 Initializing Ray Promise Tracker");
      window.RayPromiseTracker.init();
    } else {
      console.warn("⚠️ RayPromiseTracker not available");
    }

    
    // Use the dependency loader to wait for all dependencies
    if (typeof window.DependencyLoader !== 'undefined') {
      console.log("✅ DependencyLoader found, waiting for dependencies");
      window.DependencyLoader.waitForDependencies(() => {
        console.log("✅ Dependencies ready, creating toggle button");
        
        // Initialize DOM Control System
        if (typeof window.DOMControlSystem !== 'undefined') {
          window.DOMControlSystem.initialize();
        }
        
        // Ensure ResponseTracker exists before creating button
        if (typeof window.ResponseTracker === 'undefined') {
          console.log("🔧 Creating ResponseTracker fallback");
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
        
        setTimeout(window.ToggleButton.createToggleButton, 1500);
      });
    } else {
      console.log("⚠️ DependencyLoader not available, will retry initialization");
      setTimeout(initialize, 1000);
    }
  }

  // Initialize immediately if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

  // Also try on page load as backup
  window.addEventListener("load", initialize);

  // Handle URL changes (for SPA navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      // Stop any existing loop
      if (window.MessageLoop) {
        window.MessageLoop.stopLoop();
      }
      // Create button again after a delay
      setTimeout(() => {
        if (window.ToggleButton) {
          window.ToggleButton.createToggleButton();
        }
      }, 1500);
    }
  }).observe(document, { subtree: true, childList: true });
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('📨 [Content] Received message from popup:', request);
    
    try {
      switch (request.action) {
        case "getResponses":
          // Return the stored responses
          if (window.ResponseTracker) {
            sendResponse({responses: window.ResponseTracker.getResponses()});
          } else {
            sendResponse({responses: []});
          }
          break;

        case "toggleMasterPower":
          if (window.RayPowerControl) {
            if (request.enabled) {
              window.RayPowerControl.enable();
            } else {
              window.RayPowerControl.disable();
            }
            sendResponse({success: true, powered: window.RayPowerControl.isPowered()});
          } else {
            sendResponse({success: false, error: 'RayPowerControl not available'});
          }
          break;

        case "toggleSystem":
          handleSystemToggle(request.system, request.enabled);
          sendResponse({success: true});
          break;

        case "setHeartbeatInterval":
          if (window.RayHeartbeat) {
            const success = window.RayHeartbeat.adjustRate(request.interval);
            sendResponse({success: success});
          } else {
            sendResponse({success: false, error: 'RayHeartbeat not available'});
          }
          break;

        case "getHeartbeatSettings":
          if (window.RaySettings) {
            const settings = {
              interval: window.RaySettings.get('heartbeat.interval'),
              maxTemporalEvents: window.RaySettings.get('heartbeat.maxTemporalEvents'),
              logEveryNTicks: window.RaySettings.get('heartbeat.logEveryNTicks')
            };
            sendResponse({settings: settings});
          } else {
            sendResponse({settings: {interval: 1000}});
          }
          break;

        case "getHeartbeatStatus":
          if (window.RayHeartbeat) {
            const status = window.RayHeartbeat.status();
            sendResponse({status: status});
          } else {
            sendResponse({status: {beating: false, heartRate: 'Unknown'}});
          }
          break;

        case "getSystemStates":
          const states = getSystemStates();
          sendResponse({states: states});
          break;

        case "enableAllSystems":
          if (window.RayControlPanel) {
            // Use existing control panel functionality
            enableAllSystemsViaControlPanel();
          }
          sendResponse({success: true});
          break;

        case "disableAllSystems":
          if (window.RayControlPanel) {
            // Use existing control panel functionality
            disableAllSystemsViaControlPanel();
          }
          sendResponse({success: true});
          break;

        case "setVoiceOnlyMode":
          if (window.RayControlPanel) {
            // Use existing control panel functionality
            setVoiceOnlyModeViaControlPanel();
          }
          sendResponse({success: true});
          break;

        default:
          console.warn('📨 [Content] Unknown action:', request.action);
          sendResponse({success: false, error: 'Unknown action'});
      }
    } catch (error) {
      console.error('📨 [Content] Error handling message:', error);
      sendResponse({success: false, error: error.message});
    }
    
    return true; // Required for async response
  });

  function handleSystemToggle(system, enabled) {
    console.log(`🎛️ [Content] Toggling ${system}: ${enabled}`);
    
    switch(system) {
      case 'voiceRecognition':
        if (window.VoiceUI) {
          if (enabled) {
            // Enable voice recognition UI
          } else {
            if (window.VoiceRecognition) {
              window.VoiceRecognition.stopListening();
            }
          }
        }
        break;
        
      case 'voiceSynthesis':
        if (window.VoiceSynthesisUI) {
          window.VoiceSynthesisUI.setEnabled(enabled);
          if (!enabled && window.VoiceSynthesis) {
            window.VoiceSynthesis.stop();
          }
        }
        break;
        
      case 'messageLoop':
        if (window.MessageLoop) {
          if (enabled) {
            // MessageLoop can be started when needed
          } else {
            window.MessageLoop.stopLoop();
          }
        }
        break;

      case 'domControl':
        // DOM control system toggle
        if (window.DOMControlSystem) {
          if (enabled) {
            window.DOMControlSystem.enable();
          } else {
            window.DOMControlSystem.disable();
          }
        }
        break;

      case 'responseTracking':
        // Response tracking toggle
        if (window.ResponseTracker) {
          if (!enabled) {
            window.ResponseTracker.clearResponses();
          }
        }
        break;

      case 'dataTransmission':
        // Data transmission toggle
        console.log(`📡 Data transmission ${enabled ? 'enabled' : 'disabled'}`);
        break;

      case 'fileOperations':
        // File operations toggle
        console.log(`📁 File operations ${enabled ? 'enabled' : 'disabled'}`);
        break;
    }
  }

  function getSystemStates() {
    const states = {
      masterPower: window.RayPowerControl ? window.RayPowerControl.isPowered() : false,
      domControl: window.DOMControlSystem ? window.DOMControlSystem.isEnabled() : false,
      voiceRecognition: window.VoiceRecognition ? window.VoiceRecognition.isListening() : false,
      voiceSynthesis: window.VoiceSynthesisUI ? window.VoiceSynthesisUI.isEnabled() : false,
      messageLoop: window.MessageLoop ? window.MessageLoop.isRunning() : false,
      responseTracking: true, // Always available
      dataTransmission: false, // Default state
      fileOperations: false, // Default state
      browserClock: true // Always on
    };
    
    console.log('📊 [Content] Current system states:', states);
    return states;
  }

  function enableAllSystemsViaControlPanel() {
    // Enable master power first
    if (window.RayPowerControl) {
      window.RayPowerControl.enable();
    }
    
    // Enable individual systems
    const systems = ['domControl', 'voiceRecognition', 'voiceSynthesis', 'messageLoop', 'responseTracking', 'dataTransmission', 'fileOperations'];
    systems.forEach(system => {
      handleSystemToggle(system, true);
    });
    
    console.log('🎛️ [Content] All systems enabled via popup');
  }

  function disableAllSystemsViaControlPanel() {
    // Disable master power
    if (window.RayPowerControl) {
      window.RayPowerControl.disable();
    }
    
    // Disable individual systems
    const systems = ['domControl', 'voiceRecognition', 'voiceSynthesis', 'messageLoop', 'responseTracking', 'dataTransmission', 'fileOperations'];
    systems.forEach(system => {
      handleSystemToggle(system, false);
    });
    
    console.log('🎛️ [Content] All systems disabled via popup');
  }

  function setVoiceOnlyModeViaControlPanel() {
    // Enable master power
    if (window.RayPowerControl) {
      window.RayPowerControl.enable();
    }
    
    const voiceSystems = ['voiceRecognition', 'voiceSynthesis'];
    const otherSystems = ['domControl', 'messageLoop', 'responseTracking', 'dataTransmission', 'fileOperations'];
    
    // Enable voice systems
    voiceSystems.forEach(system => {
      handleSystemToggle(system, true);
    });
    
    // Disable other systems
    otherSystems.forEach(system => {
      handleSystemToggle(system, false);
    });
    
    console.log('🎛️ [Content] Voice-only mode activated via popup');
  }
})();