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

    // Check if Ray UI buttons should be shown (but always keep toggle button)
    const showRayUI = window.RaySettings?.get('ui.showWebUIButtons') !== false;
    
    if (!showRayUI) {
      console.log("🚫 Ray UI buttons disabled - keeping only toggle button, using popup for Ray controls");
      hideRayUIButtons();
      // Continue with initialization but skip Ray UI components
    }

    // Initialize Ray UI Toggle FIRST (so user can hide UI immediately) - only if Ray UI is enabled
    if (showRayUI && typeof window.RayUIToggle !== 'undefined') {
      console.log("👁️ Initializing Ray UI Toggle (Priority)");
      window.RayUIToggle.init();
    } else if (!showRayUI) {
      console.log("👁️ Ray UI Toggle skipped - using popup interface");
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

    // Initialize Ray Power Control System (backend only, no UI when Ray UI disabled)
    if (typeof window.RayPowerControl !== 'undefined') {
      if (showRayUI) {
        console.log("⚡ Initializing Ray Power Control System");
        window.RayPowerControl.init();
      } else {
        console.log("⚡ Initializing Ray Power Control System (backend only)");
        // Initialize backend without UI
        window.RayPowerControl.initBackend?.() || console.log("⚡ Power control backend ready");
      }
    } else {
      console.warn("⚠️ RayPowerControl not available");
    }

    // Skip Ray Control Panel (replaced by popup)
    if (showRayUI && typeof window.RayControlPanel !== 'undefined') {
      console.log("🎛️ Initializing Ray Control Panel");
      window.RayControlPanel.init();
    } else {
      console.log("🎛️ Ray Control Panel skipped - using popup interface");
    }

    // Skip Ray Activity Monitor UI
    if (showRayUI && typeof window.RayActivityMonitor !== 'undefined') {
      console.log("📊 Initializing Ray Activity Monitor");
      window.RayActivityMonitor.init();
    } else {
      console.log("📊 Ray Activity Monitor UI skipped - using popup interface");
    }

    // Initialize Ray Interaction Logger (always enabled - core memory system)
    if (typeof window.RayInteractionLogger !== 'undefined') {
      console.log("🧠 Initializing Ray Interaction Logger (Memory System)");
      window.RayInteractionLogger.init();
    } else {
      console.warn("⚠️ RayInteractionLogger not available");
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
        
        // Initialize Ray Loop Status Display
        if (typeof window.RayLoopStatus !== 'undefined') {
          console.log("🔄 Initializing Ray Loop Status Display");
          window.RayLoopStatus.init();
        } else {
          console.warn("⚠️ RayLoopStatus not available");
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
        
        // Always create the toggle button - it's essential for starting the loop
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
          if (window.MessageLoop) {
            const success = window.MessageLoop.setInterval(request.interval);
            
            // Sync RayLoopStatus with new interval
            if (success && window.RayLoopStatus) {
              window.RayLoopStatus.syncInterval();
            }
            
            sendResponse({success: success});
          } else {
            sendResponse({success: false, error: 'MessageLoop not available'});
          }
          break;

        case "getHeartbeatSettings":
          if (window.RaySettings) {
            const settings = {
              interval: window.RaySettings.get('messageLoop.interval') || 30
            };
            sendResponse({settings: settings});
          } else {
            sendResponse({settings: {interval: 30}});
          }
          break;

        case "getHeartbeatStatus":
          if (window.MessageLoop) {
            const status = window.MessageLoop.getStatus();
            sendResponse({status: status});
          } else {
            sendResponse({status: {running: false, interval: 'Unknown'}});
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

  function hideRayUIButtons() {
    console.log('🚫 [Content] Hiding Ray UI buttons (keeping toggle button)...');
    
    // List of Ray button selectors to hide (excluding genesis-toggle)
    const rayButtonSelectors = [
      'button[title*="Ray Power Control"]', // Power control
      'button[title="Ray Control Panel"]',  // Control panel
      'button[title*="Ray Activity Monitor"]', // Activity monitor
      'button[title*="Ray Voice"]',         // Voice buttons
      'button[title="Ray Voice Settings"]', // Voice settings
      'button[title*="Toggle Voice Recognition"]', // Voice recognition
      'button[title*="Ray Trust Metrics"]', // Trust metrics
      'button[title*="Make Promise"]',      // Promise tracker
      'button[title*="Toggle Ray UI"]',     // UI toggle
      '#heartbeatPreset1000',               // Heartbeat preset buttons
      '#heartbeatPreset500',
      '#heartbeatPreset2000',
      '#testVoice',                         // Voice test button
      '#refreshTrust',                      // Trust refresh button
      '#exportTrust',                       // Trust export button
      '#testTrust',                         // Trust test button
      '#clearLog',                          // Activity monitor clear button
      '#exportLog',                         // Activity monitor export button
      'button[style*="#4CAF50"]',           // Any button with green background
      'button[style*="background: #4CAF50"]' // Green background buttons
    ];
    
    // Hide existing Ray buttons
    rayButtonSelectors.forEach(selector => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach(button => {
        button.style.display = 'none';
        console.log(`🚫 Hidden Ray button: ${selector}`);
      });
    });
    
    // Prevent future Ray button creation by overriding appendChild
    const originalAppendChild = document.body.appendChild;
    document.body.appendChild = function(element) {
      if (element.tagName === 'BUTTON' && 
          element.title?.includes('Ray') && 
          element.id !== 'genesis-toggle') {
        console.log(`🚫 Blocked Ray button creation: ${element.title || element.id}`);
        return element; // Return element but don't append
      }
      return originalAppendChild.call(this, element);
    };
    
    console.log('✅ [Content] Ray UI buttons hidden - toggle button remains visible');
    console.log('🔄 [Content] Genesis Loop toggle button will still be available');
  }
})();