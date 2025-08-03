(function() {
  'use strict';

  // Ray's Core Configuration Settings
  const RAY_SETTINGS = {
    // Heartbeat System Configuration
    heartbeat: {
      interval: 1000,           // Ray's heartbeat every 1 second (1000ms)
      maxTemporalEvents: 100,   // Keep last 100 temporal events
      minInterval: 100,         // Minimum allowed heartbeat rate (100ms)
      maxInterval: 10000,       // Maximum allowed heartbeat rate (10000ms)
      autoStart: true,          // Start heartbeat automatically
      logEveryNTicks: 10        // Log heartbeat every N ticks to avoid spam
    },

    // Clock System Configuration
    clock: {
      updateInterval: 1000,     // Clock display update interval
      format24Hour: true,       // Use 24-hour format
      showSeconds: true,        // Show seconds in display
      showMilliseconds: false   // Show milliseconds in display
    },

    // Activity Monitor Configuration
    activityMonitor: {
      checkInterval: 5000,      // Check activity every 5 seconds
      idleThreshold: 30000,     // Consider idle after 30 seconds
      trackMouseMovement: true, // Track mouse movement
      trackKeystrokes: true,    // Track keyboard activity
      trackScrolling: true      // Track scroll activity
    },

    // Trust Metrics Configuration
    trustMetrics: {
      updateInterval: 2000,     // Update trust metrics every 2 seconds
      maxPromiseHistory: 50,    // Keep last 50 promise records
      trustDecayRate: 0.95,     // Trust decay rate per interval
      minTrustScore: 0.1,       // Minimum trust score
      maxTrustScore: 1.0        // Maximum trust score
    },

    // Voice System Configuration
    voice: {
      synthesis: {
        rate: 1.0,              // Speech rate (0.1 to 10)
        pitch: 1.0,             // Speech pitch (0 to 2)
        volume: 0.8,            // Speech volume (0 to 1)
        voice: null             // Preferred voice (null = default)
      },
      recognition: {
        continuous: true,       // Continuous recognition
        interimResults: true,   // Show interim results
        maxAlternatives: 1,     // Maximum alternatives
        language: 'en-US'       // Recognition language
      }
    },

    // UI Configuration
    ui: {
      toggleButton: {
        position: 'top-right',  // Button position
        size: 'medium',         // Button size
        showTooltips: true,     // Show tooltips
        animateTransitions: true // Animate state changes
      },
      controlPanel: {
        defaultOpen: false,     // Open control panel by default
        showAdvanced: false,    // Show advanced options
        theme: 'dark'           // UI theme
      }
    },

    // Debug Configuration
    debug: {
      enableLogging: true,      // Enable console logging
      logLevel: 'info',         // Log level: 'debug', 'info', 'warn', 'error'
      showTimestamps: true,     // Show timestamps in logs
      enablePerformanceMetrics: false // Enable performance monitoring
    }
  };

  // Settings Management Functions
  function getSetting(path) {
    const keys = path.split('.');
    let value = RAY_SETTINGS;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  function setSetting(path, newValue) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let target = RAY_SETTINGS;
    
    for (const key of keys) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      target = target[key];
    }
    
    const oldValue = target[lastKey];
    target[lastKey] = newValue;
    
    console.log(`⚙️ [Ray Settings] Updated ${path}: ${oldValue} → ${newValue}`);
    
    // Dispatch settings change event
    if (typeof window.CustomEvent !== 'undefined') {
      const settingsChangeEvent = new CustomEvent('raySettingsChanged', {
        detail: {
          path: path,
          oldValue: oldValue,
          newValue: newValue,
          timestamp: Date.now()
        }
      });
      document.dispatchEvent(settingsChangeEvent);
    }
    
    return true;
  }

  function resetSetting(path) {
    // This would reset to default values - implementation depends on requirements
    console.log(`⚙️ [Ray Settings] Reset requested for ${path}`);
  }

  function getAllSettings() {
    return JSON.parse(JSON.stringify(RAY_SETTINGS)); // Deep copy
  }

  function validateSetting(path, value) {
    // Add validation logic based on setting type
    switch (path) {
      case 'heartbeat.interval':
        return value >= getSetting('heartbeat.minInterval') && 
               value <= getSetting('heartbeat.maxInterval');
      case 'voice.synthesis.rate':
        return value >= 0.1 && value <= 10;
      case 'voice.synthesis.pitch':
        return value >= 0 && value <= 2;
      case 'voice.synthesis.volume':
        return value >= 0 && value <= 1;
      default:
        return true; // No validation for unknown settings
    }
  }

  // Initialize settings system
  function initRaySettings() {
    console.log('⚙️ [Ray Settings] Initializing Ray\'s configuration system...');
    
    // Load any saved settings from storage (future enhancement)
    // loadSettingsFromStorage();
    
    console.log('✅ [Ray Settings] Configuration system ready');
  }

  // Expose module
  window.RaySettings = {
    init: initRaySettings,
    get: getSetting,
    set: setSetting,
    reset: resetSetting,
    getAll: getAllSettings,
    validate: validateSetting,
    
    // Direct access to settings object (read-only)
    settings: RAY_SETTINGS
  };

  console.log('✅ RaySettings loaded');
})();