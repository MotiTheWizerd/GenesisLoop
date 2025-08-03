(function() {
  'use strict';

  let powerState = true; // ENABLED BY DEFAULT
  let powerButton = null;
  let powerIndicator = null;
  let powerSettings = {
    domControl: false,
    voiceRecognition: false,
    voiceSynthesis: false,
    messageLoop: false,
    responseTracking: false,
    dataTransmission: false,
    browserClock: true, // ALWAYS ENABLED - Clock runs by default
    fileOperations: false // CRITICAL: File operations always disabled when off
  };

  // Store original functions to restore when powered on
  let originalFunctions = {};

  function createPowerButton() {
    if (powerButton) {
      return powerButton;
    }

    // Create power button
    powerButton = document.createElement('button');
    powerButton.innerHTML = '⚡';
    powerButton.title = 'Ray Power Control (ONLINE)';
    powerButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      background: #44ff44;
      color: black;
      border: 2px solid #66ff66;
      border-radius: 50%;
      width: 70px;
      height: 70px;
      font-size: 28px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(68,255,68,0.6);
      animation: rayPowerPulse 2s infinite;
    `;

    // Create power indicator
    powerIndicator = document.createElement('div');
    powerIndicator.style.cssText = `
      position: fixed;
      top: 95px;
      right: 25px;
      z-index: 10000;
      background: #44ff44;
      color: black;
      padding: 8px 15px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 4px 15px rgba(68,255,68,0.4);
      border: 1px solid #66ff66;
    `;
    powerIndicator.textContent = 'RAY ONLINE';

    // Add hover effects
    powerButton.addEventListener('mouseenter', () => {
      powerButton.style.transform = 'scale(1.1)';
      if (powerState) {
        powerButton.style.background = '#66ff66';
      } else {
        powerButton.style.background = '#888';
      }
    });

    powerButton.addEventListener('mouseleave', () => {
      powerButton.style.transform = 'scale(1)';
      updatePowerButtonState();
    });

    // Add click handler
    powerButton.addEventListener('click', () => {
      toggleRayPower();
    });

    // Add CSS animation immediately
    if (!document.getElementById('rayPowerStyles')) {
      const style = document.createElement('style');
      style.id = 'rayPowerStyles';
      style.textContent = `
        @keyframes rayPowerPulse {
          0% { box-shadow: 0 4px 20px rgba(68,255,68,0.6); }
          50% { box-shadow: 0 4px 30px rgba(68,255,68,0.9); }
          100% { box-shadow: 0 4px 20px rgba(68,255,68,0.6); }
        }
      `;
      document.head.appendChild(style);
    }

    // Append to body
    document.body.appendChild(powerButton);
    document.body.appendChild(powerIndicator);

    return powerButton;
  }

  function updatePowerButtonState() {
    if (!powerButton || !powerIndicator) return;

    if (powerState) {
      // POWERED ON
      powerButton.style.background = '#44ff44';
      powerButton.style.borderColor = '#66ff66';
      powerButton.style.color = 'black';
      powerButton.innerHTML = '⚡';
      powerButton.title = 'Ray Power Control (ONLINE) - Click to disable';
      
      powerIndicator.style.background = '#44ff44';
      powerIndicator.style.color = 'black';
      powerIndicator.textContent = 'RAY ONLINE';
      
      // Add pulsing animation
      powerButton.style.animation = 'rayPowerPulse 2s infinite';
      
    } else {
      // POWERED OFF
      powerButton.style.background = '#666';
      powerButton.style.borderColor = '#888';
      powerButton.style.color = '#999';
      powerButton.innerHTML = '⚡';
      powerButton.title = 'Ray Power Control (OFFLINE) - Click to enable';
      
      powerIndicator.style.background = '#666';
      powerIndicator.style.color = 'white';
      powerIndicator.textContent = 'RAY OFFLINE';
      
      powerButton.style.animation = '';
    }

    // Add CSS animation if not exists
    if (!document.getElementById('rayPowerStyles')) {
      const style = document.createElement('style');
      style.id = 'rayPowerStyles';
      style.textContent = `
        @keyframes rayPowerPulse {
          0% { box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 2px 20px rgba(68,255,68,0.6); }
          100% { box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  function toggleRayPower() {
    powerState = !powerState;
    
    if (powerState) {
      enableRayPower();
    } else {
      disableRayPower();
    }
    
    updatePowerButtonState();
    console.log(`⚡ [Ray Power] Ray is now ${powerState ? 'ONLINE' : 'OFFLINE'}`);
  }

  function enableRayPower() {
    console.log('⚡ [Ray Power] ENABLING Ray systems...');
    
    // Browser Clock is ALWAYS enabled (runs by default)
    if (window.BrowserClock) {
      // Clock continues running - no changes needed
      powerSettings.browserClock = true;
      console.log('🕐 [Ray Power] Browser Clock remains active (always on)');
    }
    
    // Enable DOM Control (but protect file operations)
    if (window.DOMAPI && originalFunctions.domClick) {
      window.DOMAPI.click = originalFunctions.domClick;
      window.DOMAPI.type = originalFunctions.domType;
      window.DOMAPI.scroll = originalFunctions.domScroll;
      window.DOMAPI.extract = originalFunctions.domExtract;
      powerSettings.domControl = true;
      console.log('✅ [Ray Power] DOM Control enabled');
    }
    
    // Enable File Operations (CRITICAL SECURITY)
    enableFileOperations();
    powerSettings.fileOperations = true;
    console.log('📁 [Ray Power] File Operations enabled');

    // Enable Voice Recognition
    if (window.VoiceRecognition && window.VoiceUI) {
      // Voice recognition is controlled by its own UI button
      powerSettings.voiceRecognition = true;
      console.log('✅ [Ray Power] Voice Recognition enabled');
    }

    // Enable Voice Synthesis
    if (window.VoiceSynthesis && window.VoiceSynthesisUI) {
      // Voice synthesis is controlled by its own UI button
      powerSettings.voiceSynthesis = true;
      console.log('✅ [Ray Power] Voice Synthesis enabled');
    }

    // Enable Message Loop
    if (window.MessageLoop && originalFunctions.messageLoopStart) {
      window.MessageLoop.startLoop = originalFunctions.messageLoopStart;
      window.MessageLoop.stopLoop = originalFunctions.messageLoopStop;
      powerSettings.messageLoop = true;
      console.log('✅ [Ray Power] Message Loop enabled');
    }

    // Enable Response Tracking
    if (window.ResponseTracker && originalFunctions.responseTracker) {
      window.ResponseTracker.trackResponse = originalFunctions.responseTracker;
      powerSettings.responseTracking = true;
      console.log('✅ [Ray Power] Response Tracking enabled');
    }

    // Enable Data Transmission
    if (window.DataSender && originalFunctions.dataSender) {
      window.DataSender.sendExtractedResponse = originalFunctions.dataSender;
      powerSettings.dataTransmission = true;
      console.log('✅ [Ray Power] Data Transmission enabled');
    }

    // Show power-on message
    showPowerStatus('⚡ RAY SYSTEMS ONLINE', 3000);
  }

  function disableRayPower() {
    console.log('⚡ [Ray Power] DISABLING Ray systems...');
    
    // Store original functions before disabling
    storeOriginalFunctions();

    // Browser Clock STAYS ENABLED (always runs)
    if (window.BrowserClock) {
      // Clock continues running - no interruption
      powerSettings.browserClock = true;
      
      // Force clock to keep running
      if (window.BrowserClock.startClock && typeof window.BrowserClock.startClock === 'function') {
        window.BrowserClock.startClock();
      }
      
      console.log('🕐 [Ray Power] Browser Clock remains active (ALWAYS ON)');
      
      // Ensure Ray can always access clock functions
      ensureClockAccess();
    } else {
      console.warn('⚠️ [Ray Power] BrowserClock not available during disable');
    }

    // Disable DOM Control
    if (window.DOMAPI) {
      window.DOMAPI.click = createDisabledFunction('DOM Click');
      window.DOMAPI.type = createDisabledFunction('DOM Type');
      window.DOMAPI.scroll = createDisabledFunction('DOM Scroll');
      window.DOMAPI.extract = createDisabledFunction('DOM Extract');
      powerSettings.domControl = false;
      console.log('🔒 [Ray Power] DOM Control disabled');
    }

    // CRITICAL: Disable ALL File Operations
    disableFileOperations();
    powerSettings.fileOperations = false;
    console.log('🔒 [Ray Power] File Operations BLOCKED (SECURITY)');

    // Disable Voice Recognition (stop if active)
    if (window.VoiceRecognition) {
      window.VoiceRecognition.stopListening();
      powerSettings.voiceRecognition = false;
      console.log('🔒 [Ray Power] Voice Recognition disabled');
    }

    // Disable Voice Synthesis (stop if active)
    if (window.VoiceSynthesis) {
      window.VoiceSynthesis.stop();
      powerSettings.voiceSynthesis = false;
      console.log('🔒 [Ray Power] Voice Synthesis disabled');
    }

    // Disable Message Loop
    if (window.MessageLoop) {
      if (window.MessageLoop.stopLoop) {
        window.MessageLoop.stopLoop();
      }
      window.MessageLoop.startLoop = createDisabledFunction('Message Loop Start');
      window.MessageLoop.stopLoop = createDisabledFunction('Message Loop Stop');
      powerSettings.messageLoop = false;
      console.log('🔒 [Ray Power] Message Loop disabled');
    }

    // Disable Response Tracking
    if (window.ResponseTracker) {
      window.ResponseTracker.trackResponse = createDisabledFunction('Response Tracking');
      powerSettings.responseTracking = false;
      console.log('🔒 [Ray Power] Response Tracking disabled');
    }

    // Disable Data Transmission
    if (window.DataSender) {
      window.DataSender.sendExtractedResponse = createDisabledFunction('Data Transmission');
      powerSettings.dataTransmission = false;
      console.log('🔒 [Ray Power] Data Transmission disabled');
    }

    // Show power-off message
    showPowerStatus('🔒 RAY SYSTEMS OFFLINE', 3000);
  }

  function storeOriginalFunctions() {
    // Store DOM API functions
    if (window.DOMAPI && !originalFunctions.domClick) {
      originalFunctions.domClick = window.DOMAPI.click;
      originalFunctions.domType = window.DOMAPI.type;
      originalFunctions.domScroll = window.DOMAPI.scroll;
      originalFunctions.domExtract = window.DOMAPI.extract;
    }

    // Store Message Loop functions
    if (window.MessageLoop && !originalFunctions.messageLoopStart) {
      originalFunctions.messageLoopStart = window.MessageLoop.startLoop;
      originalFunctions.messageLoopStop = window.MessageLoop.stopLoop;
    }

    // Store Response Tracker functions
    if (window.ResponseTracker && !originalFunctions.responseTracker) {
      originalFunctions.responseTracker = window.ResponseTracker.trackResponse;
    }

    // Store Data Sender functions
    if (window.DataSender && !originalFunctions.dataSender) {
      originalFunctions.dataSender = window.DataSender.sendExtractedResponse;
    }
  }

  function createDisabledFunction(functionName) {
    return function() {
      console.warn(`🔒 [Ray Power] ${functionName} is disabled. Enable Ray power to use this function.`);
      showPowerStatus(`🔒 ${functionName} disabled`, 2000);
      return false;
    };
  }

  function disableFileOperations() {
    console.log('🔒 [Ray Power] Disabling ALL file operations for security...');
    
    // Block any potential file system access
    const fileOperations = [
      'writeFile', 'readFile', 'createFile', 'deleteFile', 'moveFile', 'copyFile',
      'mkdir', 'rmdir', 'appendFile', 'truncateFile', 'chmod', 'chown',
      'saveAs', 'download', 'upload', 'import', 'export'
    ];

    // Store and disable file operations on various objects
    fileOperations.forEach(operation => {
      // Check window object
      if (window[operation] && typeof window[operation] === 'function') {
        if (!originalFunctions[`window_${operation}`]) {
          originalFunctions[`window_${operation}`] = window[operation];
        }
        window[operation] = createFileBlockedFunction(operation);
      }

      // Check common file system objects
      const fsObjects = ['fs', 'FileSystem', 'FileAPI', 'File', 'Blob'];
      fsObjects.forEach(fsObj => {
        if (window[fsObj] && window[fsObj][operation] && typeof window[fsObj][operation] === 'function') {
          if (!originalFunctions[`${fsObj}_${operation}`]) {
            originalFunctions[`${fsObj}_${operation}`] = window[fsObj][operation];
          }
          window[fsObj][operation] = createFileBlockedFunction(`${fsObj}.${operation}`);
        }
      });
    });

    // Block Chrome extension file APIs if they exist
    if (window.chrome && window.chrome.fileSystem) {
      const chromeFileOps = ['chooseEntry', 'restoreEntry', 'isRestorable', 'retainEntry'];
      chromeFileOps.forEach(op => {
        if (window.chrome.fileSystem[op]) {
          if (!originalFunctions[`chrome_fileSystem_${op}`]) {
            originalFunctions[`chrome_fileSystem_${op}`] = window.chrome.fileSystem[op];
          }
          window.chrome.fileSystem[op] = createFileBlockedFunction(`chrome.fileSystem.${op}`);
        }
      });
    }

    console.log('🔒 [Ray Power] File operations blocked');
  }

  function enableFileOperations() {
    console.log('📁 [Ray Power] Enabling file operations...');
    
    // Restore all stored file operations
    Object.keys(originalFunctions).forEach(key => {
      if (key.includes('_')) {
        const parts = key.split('_');
        if (parts.length === 2) {
          // window level function
          const [obj, func] = parts;
          if (obj === 'window' && window[func] !== originalFunctions[key]) {
            window[func] = originalFunctions[key];
          }
        } else if (parts.length === 3) {
          // nested object function
          const [obj, subObj, func] = parts;
          if (window[obj] && window[obj][subObj] && window[obj][subObj][func] !== originalFunctions[key]) {
            window[obj][subObj][func] = originalFunctions[key];
          }
        }
      }
    });

    console.log('📁 [Ray Power] File operations restored');
  }

  function createFileBlockedFunction(functionName) {
    return function() {
      console.error(`🚫 [Ray Power] FILE OPERATION BLOCKED: ${functionName} - Ray cannot access files when powered off!`);
      showPowerStatus(`🚫 File access blocked`, 3000);
      throw new Error(`Security: File operation '${functionName}' blocked - Ray is powered off`);
    };
  }

  function ensureClockAccess() {
    console.log('🕐 [Ray Power] Ensuring Ray has clock access...');
    
    // Create a global clock interface that Ray can always access
    if (window.BrowserClock) {
      // Create RayClock interface that's always available
      window.RayClock = {
        getCurrentTime: function() {
          if (window.BrowserClock && window.BrowserClock.getCurrentTime) {
            return window.BrowserClock.getCurrentTime();
          }
          return new Date().toLocaleTimeString();
        },
        
        getISOTime: function() {
          if (window.BrowserClock && window.BrowserClock.getISOTime) {
            return window.BrowserClock.getISOTime();
          }
          return new Date().toISOString();
        },
        
        getTimestamp: function() {
          if (window.BrowserClock && window.BrowserClock.getCurrentUnixTime) {
            return window.BrowserClock.getCurrentUnixTime();
          }
          return Date.now();
        },
        
        getFormattedTime: function(format) {
          if (window.BrowserClock && window.BrowserClock.getFormattedTime) {
            return window.BrowserClock.getFormattedTime(format);
          }
          const now = new Date();
          return format === 'iso' ? now.toISOString() : now.toLocaleString();
        },
        
        isRunning: function() {
          if (window.BrowserClock && window.BrowserClock.isRunning) {
            return window.BrowserClock.isRunning();
          }
          return true; // Clock is always conceptually running
        },
        
        // Special function for Ray to check time access
        checkAccess: function() {
          return {
            available: true,
            powered: window.RayPowerControl ? window.RayPowerControl.isPowered() : false,
            message: "Clock access is always available, even when Ray is powered off"
          };
        }
      };
      
      console.log('✅ [Ray Power] RayClock interface created - Ray can always access time');
    }
  }

  function showPowerStatus(message, duration = 3000) {
    if (!powerIndicator) return;

    const originalText = powerIndicator.textContent;
    const originalBackground = powerIndicator.style.background;
    const originalColor = powerIndicator.style.color;

    powerIndicator.textContent = message;
    
    // Color coding for different message types
    if (message.includes('🔒') || message.includes('OFFLINE')) {
      powerIndicator.style.background = '#ff4444';
      powerIndicator.style.color = 'white';
    } else if (message.includes('⚡') || message.includes('ONLINE')) {
      powerIndicator.style.background = '#44ff44';
      powerIndicator.style.color = 'black';
    }

    if (duration > 0) {
      setTimeout(() => {
        powerIndicator.textContent = originalText;
        powerIndicator.style.background = originalBackground;
        powerIndicator.style.color = originalColor;
      }, duration);
    }
  }

  function isPowered() {
    return powerState;
  }

  function getPowerSettings() {
    return { ...powerSettings };
  }

  function setPowerState(enabled) {
    if (enabled !== powerState) {
      toggleRayPower();
    }
  }

  function initRayPowerControl() {
    console.log('⚡ [Ray Power] Initializing Ray Power Control System...');
    console.log('✅ [Ray Power] Ray is ENABLED by default');
    console.log('🕐 [Ray Power] Browser Clock will remain ACTIVE (always on)');
    
    // Initialize Browser Clock FIRST (always enabled)
    console.log('🕐 [Ray Power] Initializing Browser Clock (ALWAYS ON)...');
    
    // Force clock initialization immediately
    const initializeClock = () => {
      if (window.BrowserClock && typeof window.BrowserClock.init === 'function') {
        console.log('🕐 [Ray Power] Starting Browser Clock...');
        window.BrowserClock.init();
        
        // Force start the clock if it's not running
        if (window.BrowserClock.startClock && typeof window.BrowserClock.startClock === 'function') {
          window.BrowserClock.startClock();
        }
        
        powerSettings.browserClock = true;
        console.log('✅ [Ray Power] Browser Clock is RUNNING');
        
        // Ensure Ray can access clock immediately
        ensureClockAccess();
      } else {
        console.warn('⚠️ [Ray Power] BrowserClock not available yet, retrying...');
        // Retry every 500ms until clock is available
        setTimeout(initializeClock, 500);
      }
    };
    
    // Start clock initialization immediately
    initializeClock();
    
    // Also create basic clock access as fallback
    setTimeout(() => {
      ensureClockAccess();
    }, 1000);
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        createPowerButton();
        // Enable all systems by default (Ray starts ON)
        setTimeout(() => {
          enableRayPower();
          updatePowerButtonState();
        }, 1000);
      });
    } else {
      createPowerButton();
      // Enable all systems by default (Ray starts ON)
      setTimeout(() => {
        enableRayPower();
        updatePowerButtonState();
      }, 1000);
    }
  }

  function removePowerControl() {
    if (powerButton) {
      powerButton.remove();
      powerButton = null;
    }
    if (powerIndicator) {
      powerIndicator.remove();
      powerIndicator = null;
    }
    
    // Remove styles
    const styles = document.getElementById('rayPowerStyles');
    if (styles) {
      styles.remove();
    }
  }

  // Expose module
  window.RayPowerControl = {
    init: initRayPowerControl,
    toggle: toggleRayPower,
    enable: () => setPowerState(true),
    disable: () => setPowerState(false),
    isPowered: isPowered,
    getSettings: getPowerSettings,
    remove: removePowerControl
  };

  console.log('✅ RayPowerControl loaded');
})();