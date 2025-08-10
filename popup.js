// Ray Control Center - Modern Popup Interface
(function() {
  'use strict';

  let currentTab = null;
  let updateInterval = null;
  let isConnected = false;

  // System states
  let systemStates = {
    masterPower: false,
    domControl: false,
    voiceRecognition: false,
    voiceSynthesis: false,
    messageLoop: false,
    responseTracking: false,
    dataTransmission: false,
    fileOperations: false,
    browserClock: true // Always on
  };

  // Initialize popup when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🎛️ [Popup] Ray Control Center initializing...');
    initializePopup();
  });

  function initializePopup() {
    // Get current active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      currentTab = tabs[0];
      
      // Check if we're on ChatGPT
      if (isValidChatGPTTab(currentTab)) {
        setConnectionStatus(true);
        loadSystemStates();
        setupEventListeners();
        startPeriodicUpdates();
      } else {
        setConnectionStatus(false);
        showNotOnChatGPT();
      }
    });
  }

  function isValidChatGPTTab(tab) {
    return tab && tab.url && (
      tab.url.includes('chatgpt.com') || 
      tab.url.includes('chat.openai.com')
    );
  }

  function setConnectionStatus(connected) {
    isConnected = connected;
    const statusElement = document.getElementById('connectionStatus');
    const statusDot = document.querySelector('.status-dot');
    
    if (connected) {
      statusElement.textContent = 'Connected to ChatGPT';
      statusElement.style.color = '#4ade80';
      statusDot.style.background = '#4ade80';
      document.body.classList.remove('loading');
    } else {
      statusElement.textContent = 'Not on ChatGPT';
      statusElement.style.color = '#ef4444';
      statusDot.style.background = '#ef4444';
      statusDot.style.animation = 'none';
    }
  }

  function showNotOnChatGPT() {
    const container = document.querySelector('.container');
    container.innerHTML = `
      <div class="header">
        <h1>🤖 Ray Control Center</h1>
        <p class="subtitle">Advanced AI Consciousness Management</p>
        <div class="status-indicator">
          <div class="status-dot" style="background: #ef4444; animation: none;"></div>
          <span class="status-text" style="color: #ef4444;">Not Connected</span>
        </div>
      </div>
      
      <div class="section">
        <div style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 48px; margin-bottom: 16px;">🚫</div>
          <h3 style="margin-bottom: 12px; color: #ffffff;">Not on ChatGPT</h3>
          <p style="color: rgba(255, 255, 255, 0.7); line-height: 1.5; margin-bottom: 20px;">
            Please navigate to ChatGPT to use Ray Control Center.
          </p>
          <button onclick="chrome.tabs.create({url: 'https://chatgpt.com'})" 
                  style="padding: 12px 24px; background: linear-gradient(135deg, #667eea, #764ba2); 
                         color: white; border: none; border-radius: 8px; cursor: pointer; 
                         font-weight: 600;">
            Open ChatGPT
          </button>
        </div>
      </div>
    `;
  }

  function setupEventListeners() {
    // Master power toggle
    const masterPowerToggle = document.getElementById('masterPowerToggle');
    if (masterPowerToggle) {
      masterPowerToggle.addEventListener('change', (e) => {
        handleMasterPowerToggle(e.target.checked);
      });
    }

    // System toggles
    const systemToggles = [
      'domControl', 'voiceRecognition', 'voiceSynthesis', 
      'messageLoop', 'responseTracking', 'dataTransmission', 'fileOperations'
    ];

    systemToggles.forEach(system => {
      const toggle = document.getElementById(system + 'Toggle');
      if (toggle) {
        toggle.addEventListener('change', (e) => {
          handleSystemToggle(system, e.target.checked);
        });
      }
    });

    // Heartbeat controls
    setupHeartbeatControls();

    // Quick action buttons
    const enableAllBtn = document.getElementById('enableAllSystems');
    const disableAllBtn = document.getElementById('disableAllSystems');
    const voiceOnlyBtn = document.getElementById('voiceOnlyMode');

    if (enableAllBtn) enableAllBtn.addEventListener('click', enableAllSystems);
    if (disableAllBtn) disableAllBtn.addEventListener('click', disableAllSystems);
    if (voiceOnlyBtn) voiceOnlyBtn.addEventListener('click', setVoiceOnlyMode);
  }

  function setupHeartbeatControls() {
    const heartbeatInput = document.getElementById('heartbeatInput');
    
    if (heartbeatInput) {
      // Apply changes when input value changes
      heartbeatInput.addEventListener('change', (e) => {
        const value = parseInt(e.target.value);
        if (value >= 1 && value <= 300) {
          setHeartbeatInterval(value);
        } else {
          // Reset to valid range
          e.target.value = Math.max(1, Math.min(300, value));
        }
      });
      
      // Also handle Enter key
      heartbeatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const value = parseInt(e.target.value);
          if (value >= 1 && value <= 300) {
            setHeartbeatInterval(value);
          }
        }
      });
    }

    // Heartbeat preset buttons
    const presets = [
      { id: 'heartbeatPreset1', value: 1 },
      { id: 'heartbeatPreset5', value: 5 },
      { id: 'heartbeatPreset15', value: 15 },
      { id: 'heartbeatPreset30', value: 30 },
      { id: 'heartbeatPreset60', value: 60 },
      { id: 'heartbeatPreset120', value: 120 },
      { id: 'heartbeatPreset300', value: 300 }
    ];

    presets.forEach(preset => {
      const button = document.getElementById(preset.id);
      if (button) {
        button.addEventListener('click', () => setHeartbeatPreset(preset.value));
      }
    });

    // Custom preset button
    const customPreset = document.getElementById('heartbeatPresetCustom');
    if (customPreset) {
      customPreset.addEventListener('click', () => {
        const input = document.getElementById('heartbeatInput');
        if (input) {
          input.focus();
          input.select();
        }
      });
    }
  }

  function handleMasterPowerToggle(enabled) {
    systemStates.masterPower = enabled;
    
    sendMessageToContentScript({
      action: 'toggleMasterPower',
      enabled: enabled
    });
    
    updateSystemStatus();
    console.log(`🎛️ [Popup] Master power ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  function handleSystemToggle(system, enabled) {
    systemStates[system] = enabled;
    
    sendMessageToContentScript({
      action: 'toggleSystem',
      system: system,
      enabled: enabled
    });
    
    updateSystemStatus();
    console.log(`🎛️ [Popup] ${system} ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  function setHeartbeatInterval(intervalSeconds) {
    sendMessageToContentScript({
      action: 'setHeartbeatInterval',
      interval: intervalSeconds
    }, (response) => {
      if (response && response.success) {
        console.log(`💓 [Popup] Heartbeat interval set to ${intervalSeconds}s`);
        
        // Save to persistent storage
        saveHeartbeatInterval(intervalSeconds);
        
        // Update active preset button styling
        updatePresetButtonStyling(intervalSeconds);
        
        updateHeartbeatStatus();
        
        // Also trigger immediate status update to show new interval
        setTimeout(() => {
          updateHeartbeatStatus();
        }, 100);
      } else {
        console.warn(`💓 [Popup] Failed to set heartbeat interval to ${intervalSeconds}s`);
        loadHeartbeatSettings(); // Reset to current value
      }
    });
  }

  function setHeartbeatPreset(intervalSeconds) {
    const input = document.getElementById('heartbeatInput');
    
    if (input) {
      input.value = intervalSeconds;
      setHeartbeatInterval(intervalSeconds);
    }
  }

  // Persistence functions
  function saveHeartbeatInterval(intervalSeconds) {
    try {
      chrome.storage.local.set({
        'ray_heartbeat_interval': intervalSeconds,
        'ray_heartbeat_interval_timestamp': Date.now()
      }, () => {
        if (chrome.runtime.lastError) {
          console.warn('💓 [Popup] Failed to save heartbeat interval:', chrome.runtime.lastError);
        } else {
          console.log(`💾 [Popup] Heartbeat interval ${intervalSeconds}s saved to storage`);
        }
      });
    } catch (error) {
      console.warn('💓 [Popup] Error saving heartbeat interval:', error);
    }
  }

  function loadSavedHeartbeatInterval() {
    try {
      chrome.storage.local.get(['ray_heartbeat_interval', 'ray_heartbeat_interval_timestamp'], (result) => {
        if (chrome.runtime.lastError) {
          console.warn('💓 [Popup] Failed to load saved heartbeat interval:', chrome.runtime.lastError);
          return;
        }

        if (result.ray_heartbeat_interval) {
          const savedInterval = result.ray_heartbeat_interval;
          const savedTimestamp = result.ray_heartbeat_interval_timestamp || 0;
          const timeSinceSave = Date.now() - savedTimestamp;
          
          // Only use saved value if it's recent (within 24 hours)
          if (timeSinceSave < 24 * 60 * 60 * 1000) {
            console.log(`📂 [Popup] Loading saved heartbeat interval: ${savedInterval}s`);
            
            const input = document.getElementById('heartbeatInput');
            if (input) {
              input.value = savedInterval;
            }
            
            // Update preset button styling
            updatePresetButtonStyling(savedInterval);
            
            // Apply the saved interval
            setHeartbeatInterval(savedInterval);
          } else {
            console.log('💓 [Popup] Saved interval is too old, using current setting');
          }
        }
      });
    } catch (error) {
      console.warn('💓 [Popup] Error loading saved heartbeat interval:', error);
    }
  }

  function updatePresetButtonStyling(currentInterval) {
    // Remove active styling from all preset buttons
    const allPresets = document.querySelectorAll('.preset-btn');
    allPresets.forEach(btn => {
      btn.style.background = 'rgba(236, 72, 153, 0.1)';
      btn.style.borderColor = 'rgba(236, 72, 153, 0.3)';
      btn.style.color = '#ec4899';
    });

    // Add active styling to current preset
    const presetValues = [1, 5, 15, 30, 60, 120, 300];
    const presetIndex = presetValues.indexOf(currentInterval);
    
    if (presetIndex !== -1) {
      const presetId = `heartbeatPreset${currentInterval}`;
      const activeButton = document.getElementById(presetId);
      if (activeButton) {
        activeButton.style.background = 'rgba(236, 72, 153, 0.3)';
        activeButton.style.borderColor = 'rgba(236, 72, 153, 0.6)';
        activeButton.style.color = '#ffffff';
      }
    } else {
      // Highlight custom button for non-preset values
      const customButton = document.getElementById('heartbeatPresetCustom');
      if (customButton) {
        customButton.style.background = 'rgba(236, 72, 153, 0.3)';
        customButton.style.borderColor = 'rgba(236, 72, 153, 0.6)';
        customButton.style.color = '#ffffff';
      }
    }
  }

  function enableAllSystems() {
    // Enable master power first
    const masterToggle = document.getElementById('masterPowerToggle');
    if (masterToggle) {
      masterToggle.checked = true;
      handleMasterPowerToggle(true);
    }
    
    // Enable all individual systems
    const systems = ['domControl', 'voiceRecognition', 'voiceSynthesis', 'messageLoop', 'responseTracking', 'dataTransmission', 'fileOperations'];
    
    systems.forEach(system => {
      const toggle = document.getElementById(system + 'Toggle');
      if (toggle) {
        toggle.checked = true;
        handleSystemToggle(system, true);
      }
    });
    
    sendMessageToContentScript({
      action: 'enableAllSystems'
    });
    
    console.log('🎛️ [Popup] All systems ENABLED');
  }

  function disableAllSystems() {
    // Disable master power
    const masterToggle = document.getElementById('masterPowerToggle');
    if (masterToggle) {
      masterToggle.checked = false;
      handleMasterPowerToggle(false);
    }
    
    // Disable all individual systems
    const systems = ['domControl', 'voiceRecognition', 'voiceSynthesis', 'messageLoop', 'responseTracking', 'dataTransmission', 'fileOperations'];
    
    systems.forEach(system => {
      const toggle = document.getElementById(system + 'Toggle');
      if (toggle) {
        toggle.checked = false;
        handleSystemToggle(system, false);
      }
    });
    
    sendMessageToContentScript({
      action: 'disableAllSystems'
    });
    
    console.log('🎛️ [Popup] All systems DISABLED');
  }

  function setVoiceOnlyMode() {
    // Enable master power
    const masterToggle = document.getElementById('masterPowerToggle');
    if (masterToggle) {
      masterToggle.checked = true;
      handleMasterPowerToggle(true);
    }
    
    const voiceSystems = ['voiceRecognition', 'voiceSynthesis'];
    const otherSystems = ['domControl', 'messageLoop', 'responseTracking', 'dataTransmission', 'fileOperations'];
    
    // Enable voice systems
    voiceSystems.forEach(system => {
      const toggle = document.getElementById(system + 'Toggle');
      if (toggle) {
        toggle.checked = true;
        handleSystemToggle(system, true);
      }
    });
    
    // Disable other systems
    otherSystems.forEach(system => {
      const toggle = document.getElementById(system + 'Toggle');
      if (toggle) {
        toggle.checked = false;
        handleSystemToggle(system, false);
      }
    });
    
    sendMessageToContentScript({
      action: 'setVoiceOnlyMode'
    });
    
    console.log('🎛️ [Popup] Voice-only mode ACTIVATED');
  }

  function loadSystemStates() {
    sendMessageToContentScript({
      action: 'getSystemStates'
    }, (response) => {
      if (response && response.states) {
        systemStates = { ...systemStates, ...response.states };
        updateUIFromStates();
      }
    });
    
    loadHeartbeatSettings();
  }

  function updateUIFromStates() {
    // Update master power toggle
    const masterToggle = document.getElementById('masterPowerToggle');
    if (masterToggle) {
      masterToggle.checked = systemStates.masterPower;
    }
    
    // Update system toggles
    Object.keys(systemStates).forEach(system => {
      if (system !== 'masterPower' && system !== 'browserClock') {
        const toggle = document.getElementById(system + 'Toggle');
        if (toggle) {
          toggle.checked = systemStates[system];
        }
      }
    });
    
    updateSystemStatus();
  }

  function loadHeartbeatSettings() {
    // First try to load saved settings
    loadSavedHeartbeatInterval();
    
    // Then get current settings from content script
    sendMessageToContentScript({
      action: 'getHeartbeatSettings'
    }, (response) => {
      if (response && response.settings) {
        const input = document.getElementById('heartbeatInput');
        
        if (input && !input.value) { // Only set if not already set by saved settings
          const intervalSeconds = response.settings.interval || 30;
          input.value = intervalSeconds;
          updatePresetButtonStyling(intervalSeconds);
        }
      }
    });
    
    updateHeartbeatStatus();
  }

  function updateHeartbeatStatus() {
    sendMessageToContentScript({
      action: 'getHeartbeatStatus'
    }, (response) => {
      const statusElement = document.getElementById('heartbeatStatus');
      if (!statusElement) return;
      
      if (response && response.status) {
        const status = response.status;
        let statusText = `Status: ${status.running ? '🟢 Running' : '🔴 Stopped'}\n`;
        statusText += `Current Interval: ${status.interval || 'Unknown'}s\n`;
        statusText += `Last Run: ${status.lastRun || 'N/A'}\n`;
        statusText += `Responses: ${status.responseCount || 0}`;
        
        statusElement.textContent = statusText;
      } else {
        statusElement.textContent = 'Status: ⚠️ Unable to connect to heartbeat system';
      }
    });
  }

  function updateSystemStatus() {
    const statusElement = document.getElementById('systemStatus');
    if (!statusElement) return;
    
    const enabledSystems = Object.keys(systemStates).filter(key => systemStates[key] && key !== 'browserClock');
    const totalSystems = Object.keys(systemStates).length - 2; // Exclude masterPower and browserClock
    const enabledCount = enabledSystems.length - (systemStates.masterPower ? 1 : 0); // Exclude masterPower from count
    
    let statusText = `Master Power: ${systemStates.masterPower ? '🟢 ON' : '🔴 OFF'}\n`;
    statusText += `Active Systems: ${enabledCount}/${totalSystems}\n`;
    statusText += `Clock: 🟢 Always Available\n`;
    
    if (enabledSystems.length > 1) { // More than just masterPower
      const systemList = enabledSystems.filter(s => s !== 'masterPower').join(', ');
      statusText += `Enabled: ${systemList}`;
    } else {
      statusText += 'Only clock access available';
    }
    
    statusElement.textContent = statusText;
  }

  function startPeriodicUpdates() {
    // Update heartbeat status every 3 seconds
    updateInterval = setInterval(() => {
      if (isConnected) {
        updateHeartbeatStatus();
      }
    }, 3000);
  }

  function sendMessageToContentScript(message, callback) {
    if (!currentTab) {
      console.warn('🎛️ [Popup] No active tab available');
      return;
    }
    
    chrome.tabs.sendMessage(currentTab.id, message, (response) => {
      if (chrome.runtime.lastError) {
        console.warn('🎛️ [Popup] Message failed:', chrome.runtime.lastError.message);
        setConnectionStatus(false);
      } else if (callback) {
        callback(response);
      }
    });
  }

  // Cleanup when popup closes
  window.addEventListener('beforeunload', () => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  });

})();