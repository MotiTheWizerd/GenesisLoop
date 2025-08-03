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
    const heartbeatSlider = document.getElementById('heartbeatSlider');
    const heartbeatValue = document.getElementById('heartbeatValue');
    
    if (heartbeatSlider && heartbeatValue) {
      // Update display when slider moves
      heartbeatSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        heartbeatValue.textContent = `${value}ms`;
      });
      
      // Apply changes when slider is released
      heartbeatSlider.addEventListener('change', (e) => {
        const value = parseInt(e.target.value);
        setHeartbeatInterval(value);
      });
    }

    // Heartbeat preset buttons
    const preset500 = document.getElementById('heartbeatPreset500');
    const preset1000 = document.getElementById('heartbeatPreset1000');
    const preset2000 = document.getElementById('heartbeatPreset2000');

    if (preset500) preset500.addEventListener('click', () => setHeartbeatPreset(500));
    if (preset1000) preset1000.addEventListener('click', () => setHeartbeatPreset(1000));
    if (preset2000) preset2000.addEventListener('click', () => setHeartbeatPreset(2000));
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

  function setHeartbeatInterval(intervalMs) {
    sendMessageToContentScript({
      action: 'setHeartbeatInterval',
      interval: intervalMs
    }, (response) => {
      if (response && response.success) {
        console.log(`💓 [Popup] Heartbeat interval set to ${intervalMs}ms`);
        updateHeartbeatStatus();
      } else {
        console.warn(`💓 [Popup] Failed to set heartbeat interval to ${intervalMs}ms`);
        loadHeartbeatSettings(); // Reset to current value
      }
    });
  }

  function setHeartbeatPreset(intervalMs) {
    const slider = document.getElementById('heartbeatSlider');
    const valueDisplay = document.getElementById('heartbeatValue');
    
    if (slider && valueDisplay) {
      slider.value = intervalMs;
      valueDisplay.textContent = `${intervalMs}ms`;
      setHeartbeatInterval(intervalMs);
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
    sendMessageToContentScript({
      action: 'getHeartbeatSettings'
    }, (response) => {
      if (response && response.settings) {
        const slider = document.getElementById('heartbeatSlider');
        const valueDisplay = document.getElementById('heartbeatValue');
        
        if (slider && valueDisplay) {
          const interval = response.settings.interval || 1000;
          slider.value = interval;
          valueDisplay.textContent = `${interval}ms`;
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
        let statusText = `Status: ${status.beating ? '🟢 Beating' : '🔴 Stopped'}\n`;
        statusText += `Current Rate: ${status.heartRate || 'Unknown'}ms\n`;
        statusText += `Uptime: ${status.uptimeFormatted || 'N/A'}\n`;
        statusText += `Tick Count: ${status.tickCount || 0}`;
        
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