(function() {
  'use strict';

  let controlPanelButton = null;
  let controlPanel = null;
  let isPanelOpen = false;

  // Individual system states
  let systemStates = {
    masterPower: false,
    domControl: false,
    voiceRecognition: false,
    voiceSynthesis: false,
    messageLoop: false,
    responseTracking: false,
    dataTransmission: false,
    browserClock: true, // Always on
    fileOperations: false
  };

  function createControlPanelButton() {
    if (controlPanelButton) {
      return controlPanelButton;
    }

    // Create control panel button
    controlPanelButton = document.createElement('button');
    controlPanelButton.innerHTML = '🎛️';
    controlPanelButton.title = 'Ray Control Panel';
    controlPanelButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 260px;
      z-index: 10000;
      background: #2d2d2d;
      color: white;
      border: 2px solid #555;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;

    // Add hover effects
    controlPanelButton.addEventListener('mouseenter', () => {
      controlPanelButton.style.background = '#404040';
      controlPanelButton.style.transform = 'scale(1.1)';
    });

    controlPanelButton.addEventListener('mouseleave', () => {
      controlPanelButton.style.background = '#2d2d2d';
      controlPanelButton.style.transform = 'scale(1)';
    });

    // Add click handler
    controlPanelButton.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleControlPanel();
    });

    // Append to body
    document.body.appendChild(controlPanelButton);

    return controlPanelButton;
  }

  function createControlPanel() {
    if (controlPanel) {
      return controlPanel;
    }

    // Create panel container
    controlPanel = document.createElement('div');
    controlPanel.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 10001;
      background: #2d2d2d;
      color: white;
      border: 2px solid #555;
      border-radius: 15px;
      padding: 20px;
      width: 380px;
      max-height: 600px;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: none;
    `;

    // Create panel content
    controlPanel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; color: #fff; font-size: 18px;">🎛️ Ray Control Panel</h3>
        <button id="closeControlPanel" style="background: none; border: none; color: #aaa; font-size: 20px; cursor: pointer;">×</button>
      </div>

      <!-- Master Power Control -->
      <div style="margin-bottom: 20px; padding: 15px; background: #333; border-radius: 10px; border: 2px solid #555;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h4 style="margin: 0; color: #ff6b6b; font-size: 16px;">⚡ Master Power</h4>
          <label class="toggle-switch" style="position: relative; display: inline-block; width: 60px; height: 34px;">
            <input type="checkbox" id="masterPowerToggle" style="opacity: 0; width: 0; height: 0;">
            <span class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #666; transition: .4s; border-radius: 34px;"></span>
          </label>
        </div>
        <p style="margin: 0; font-size: 12px; color: #ccc;">Controls all Ray systems. When OFF, only clock access is available.</p>
      </div>

      <!-- Individual System Controls -->
      <div style="margin-bottom: 15px;">
        <h4 style="margin: 0 0 10px 0; color: #4CAF50; font-size: 14px;">🔧 Individual Systems</h4>
        
        <!-- DOM Control -->
        <div class="system-control" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #444;">
          <div>
            <span style="font-size: 14px;">🖱️ DOM Control</span>
            <div style="font-size: 11px; color: #aaa;">Click, type, scroll, extract</div>
          </div>
          <label class="toggle-switch" style="position: relative; display: inline-block; width: 50px; height: 28px;">
            <input type="checkbox" id="domControlToggle" style="opacity: 0; width: 0; height: 0;">
            <span class="slider small" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #666; transition: .4s; border-radius: 28px;"></span>
          </label>
        </div>

        <!-- Voice Recognition -->
        <div class="system-control" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #444;">
          <div>
            <span style="font-size: 14px;">🎤 Voice Recognition</span>
            <div style="font-size: 11px; color: #aaa;">Speech-to-text input</div>
          </div>
          <label class="toggle-switch" style="position: relative; display: inline-block; width: 50px; height: 28px;">
            <input type="checkbox" id="voiceRecognitionToggle" style="opacity: 0; width: 0; height: 0;">
            <span class="slider small" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #666; transition: .4s; border-radius: 28px;"></span>
          </label>
        </div>

        <!-- Voice Synthesis -->
        <div class="system-control" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #444;">
          <div>
            <span style="font-size: 14px;">🔊 Voice Synthesis</span>
            <div style="font-size: 11px; color: #aaa;">Text-to-speech output</div>
          </div>
          <label class="toggle-switch" style="position: relative; display: inline-block; width: 50px; height: 28px;">
            <input type="checkbox" id="voiceSynthesisToggle" style="opacity: 0; width: 0; height: 0;">
            <span class="slider small" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #666; transition: .4s; border-radius: 28px;"></span>
          </label>
        </div>

        <!-- Message Loop -->
        <div class="system-control" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #444;">
          <div>
            <span style="font-size: 14px;">🔄 Message Loop</span>
            <div style="font-size: 11px; color: #aaa;">Automated conversations</div>
          </div>
          <label class="toggle-switch" style="position: relative; display: inline-block; width: 50px; height: 28px;">
            <input type="checkbox" id="messageLoopToggle" style="opacity: 0; width: 0; height: 0;">
            <span class="slider small" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #666; transition: .4s; border-radius: 28px;"></span>
          </label>
        </div>

        <!-- Response Tracking -->
        <div class="system-control" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #444;">
          <div>
            <span style="font-size: 14px;">📊 Response Tracking</span>
            <div style="font-size: 11px; color: #aaa;">Monitor and log responses</div>
          </div>
          <label class="toggle-switch" style="position: relative; display: inline-block; width: 50px; height: 28px;">
            <input type="checkbox" id="responseTrackingToggle" style="opacity: 0; width: 0; height: 0;">
            <span class="slider small" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #666; transition: .4s; border-radius: 28px;"></span>
          </label>
        </div>

        <!-- Data Transmission -->
        <div class="system-control" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #444;">
          <div>
            <span style="font-size: 14px;">📡 Data Transmission</span>
            <div style="font-size: 11px; color: #aaa;">Send data to backend</div>
          </div>
          <label class="toggle-switch" style="position: relative; display: inline-block; width: 50px; height: 28px;">
            <input type="checkbox" id="dataTransmissionToggle" style="opacity: 0; width: 0; height: 0;">
            <span class="slider small" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #666; transition: .4s; border-radius: 28px;"></span>
          </label>
        </div>

        <!-- File Operations -->
        <div class="system-control" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #444;">
          <div>
            <span style="font-size: 14px;">📁 File Operations</span>
            <div style="font-size: 11px; color: #aaa;">Read/write file access</div>
          </div>
          <label class="toggle-switch" style="position: relative; display: inline-block; width: 50px; height: 28px;">
            <input type="checkbox" id="fileOperationsToggle" style="opacity: 0; width: 0; height: 0;">
            <span class="slider small" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #666; transition: .4s; border-radius: 28px;"></span>
          </label>
        </div>

        <!-- Browser Clock (Always On) -->
        <div class="system-control" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
          <div>
            <span style="font-size: 14px;">🕐 Browser Clock</span>
            <div style="font-size: 11px; color: #4CAF50;">Always available</div>
          </div>
          <span style="color: #4CAF50; font-size: 12px; font-weight: bold;">ALWAYS ON</span>
        </div>
      </div>

      <!-- Heartbeat Configuration -->
      <div style="margin-bottom: 20px; padding: 15px; background: #333; border-radius: 10px; border: 2px solid #555;">
        <h4 style="margin: 0 0 15px 0; color: #e91e63; font-size: 16px;">💓 Heartbeat Configuration</h4>
        
        <div style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <label style="font-size: 14px; color: #fff;">Heartbeat Interval:</label>
            <span id="heartbeatValue" style="font-size: 14px; color: #4CAF50; font-weight: bold;">1000ms</span>
          </div>
          
          <input type="range" 
                 id="heartbeatSlider" 
                 min="100" 
                 max="5000" 
                 value="1000" 
                 step="100"
                 style="width: 100%; height: 6px; border-radius: 5px; background: #666; outline: none; -webkit-appearance: none;">
          
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #aaa; margin-top: 5px;">
            <span>100ms (Fast)</span>
            <span>5000ms (Slow)</span>
          </div>
        </div>
        
        <div style="display: flex; gap: 8px; margin-top: 10px;">
          <button id="heartbeatPreset1000" style="flex: 1; padding: 6px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
            1s (Default)
          </button>
          <button id="heartbeatPreset500" style="flex: 1; padding: 6px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
            0.5s (Fast)
          </button>
          <button id="heartbeatPreset2000" style="flex: 1; padding: 6px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
            2s (Slow)
          </button>
        </div>
        
        <div id="heartbeatStatus" style="font-size: 12px; color: #ccc; margin-top: 10px; padding: 8px; background: #2a2a2a; border-radius: 5px;">
          Status: Loading...
        </div>
      </div>

      <!-- Quick Actions -->
      <div style="margin-bottom: 15px;">
        <h4 style="margin: 0 0 10px 0; color: #ff9800; font-size: 14px;">⚡ Quick Actions</h4>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button id="enableAllSystems" style="flex: 1; padding: 8px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
            Enable All
          </button>
          <button id="disableAllSystems" style="flex: 1; padding: 8px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
            Disable All
          </button>
          <button id="voiceOnlyMode" style="flex: 1; padding: 8px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
            Voice Only
          </button>
        </div>
      </div>

      <!-- System Status -->
      <div style="margin-bottom: 10px;">
        <h4 style="margin: 0 0 10px 0; color: #9C27B0; font-size: 14px;">📊 System Status</h4>
        <div id="systemStatus" style="font-size: 12px; color: #ccc; background: #333; padding: 10px; border-radius: 5px;">
          Loading system status...
        </div>
      </div>

      <div style="font-size: 11px; color: #888; text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #555;">
        Ray Control Panel - Individual system management
      </div>
    `;

    // Add CSS for toggle switches
    const style = document.createElement('style');
    style.textContent = `
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #666;
        transition: .4s;
        border-radius: 34px;
      }
      
      .slider.small {
        border-radius: 28px;
      }
      
      .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
      
      .slider.small:before {
        height: 20px;
        width: 20px;
        left: 4px;
        bottom: 4px;
      }
      
      input:checked + .slider {
        background-color: #4CAF50;
      }
      
      input:checked + .slider:before {
        transform: translateX(26px);
      }
      
      input:checked + .slider.small:before {
        transform: translateX(22px);
      }
      
      /* Heartbeat Slider Styles */
      #heartbeatSlider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #e91e63;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(233, 30, 99, 0.3);
      }
      
      #heartbeatSlider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #e91e63;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 6px rgba(233, 30, 99, 0.3);
      }
      
      #heartbeatSlider::-webkit-slider-track {
        background: #666;
        height: 6px;
        border-radius: 5px;
      }
      
      #heartbeatSlider::-moz-range-track {
        background: #666;
        height: 6px;
        border-radius: 5px;
        border: none;
      }
    `;
    document.head.appendChild(style);

    // Append to body
    document.body.appendChild(controlPanel);

    // Set up event listeners
    setupPanelEventListeners();

    return controlPanel;
  }

  function setupPanelEventListeners() {
    // Close button
    document.getElementById('closeControlPanel').addEventListener('click', () => {
      closeControlPanel();
    });

    // Master power toggle
    document.getElementById('masterPowerToggle').addEventListener('change', (e) => {
      handleMasterPowerToggle(e.target.checked);
    });

    // Individual system toggles
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

    // Quick action buttons
    document.getElementById('enableAllSystems').addEventListener('click', () => {
      enableAllSystems();
    });

    document.getElementById('disableAllSystems').addEventListener('click', () => {
      disableAllSystems();
    });

    document.getElementById('voiceOnlyMode').addEventListener('click', () => {
      setVoiceOnlyMode();
    });

    // Heartbeat controls
    const heartbeatSlider = document.getElementById('heartbeatSlider');
    const heartbeatValue = document.getElementById('heartbeatValue');
    
    if (heartbeatSlider && heartbeatValue) {
      // Update display when slider moves
      heartbeatSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        heartbeatValue.textContent = `${value}ms`;
        updateHeartbeatStatus();
      });
      
      // Apply changes when slider is released
      heartbeatSlider.addEventListener('change', (e) => {
        const value = parseInt(e.target.value);
        setHeartbeatInterval(value);
      });
    }

    // Heartbeat preset buttons
    document.getElementById('heartbeatPreset1000').addEventListener('click', () => {
      setHeartbeatPreset(1000);
    });
    
    document.getElementById('heartbeatPreset500').addEventListener('click', () => {
      setHeartbeatPreset(500);
    });
    
    document.getElementById('heartbeatPreset2000').addEventListener('click', () => {
      setHeartbeatPreset(2000);
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (isPanelOpen && !controlPanel.contains(e.target) && e.target !== controlPanelButton) {
        closeControlPanel();
      }
    });
  }

  function handleMasterPowerToggle(enabled) {
    systemStates.masterPower = enabled;
    
    if (window.RayPowerControl) {
      if (enabled) {
        window.RayPowerControl.enable();
      } else {
        window.RayPowerControl.disable();
      }
    }
    
    updateSystemStatus();
    console.log(`🎛️ [Control Panel] Master power ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  function handleSystemToggle(system, enabled) {
    systemStates[system] = enabled;
    
    // Apply the system change
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
    }
    
    updateSystemStatus();
    console.log(`🎛️ [Control Panel] ${system} ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  function enableAllSystems() {
    // Enable master power first
    document.getElementById('masterPowerToggle').checked = true;
    handleMasterPowerToggle(true);
    
    // Enable all individual systems
    const systems = ['domControl', 'voiceRecognition', 'voiceSynthesis', 'messageLoop', 'responseTracking', 'dataTransmission', 'fileOperations'];
    
    systems.forEach(system => {
      const toggle = document.getElementById(system + 'Toggle');
      if (toggle) {
        toggle.checked = true;
        handleSystemToggle(system, true);
      }
    });
    
    console.log('🎛️ [Control Panel] All systems ENABLED');
  }

  function disableAllSystems() {
    // Disable master power
    document.getElementById('masterPowerToggle').checked = false;
    handleMasterPowerToggle(false);
    
    // Disable all individual systems
    const systems = ['domControl', 'voiceRecognition', 'voiceSynthesis', 'messageLoop', 'responseTracking', 'dataTransmission', 'fileOperations'];
    
    systems.forEach(system => {
      const toggle = document.getElementById(system + 'Toggle');
      if (toggle) {
        toggle.checked = false;
        handleSystemToggle(system, false);
      }
    });
    
    console.log('🎛️ [Control Panel] All systems DISABLED');
  }

  function setVoiceOnlyMode() {
    // Disable all except voice systems
    document.getElementById('masterPowerToggle').checked = true;
    handleMasterPowerToggle(true);
    
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
    
    console.log('🎛️ [Control Panel] Voice-only mode ACTIVATED');
  }

  function setHeartbeatInterval(intervalMs) {
    if (window.RayHeartbeat && window.RaySettings) {
      const success = window.RayHeartbeat.adjustRate(intervalMs);
      if (success) {
        console.log(`💓 [Control Panel] Heartbeat interval set to ${intervalMs}ms`);
        updateHeartbeatStatus();
      } else {
        console.warn(`💓 [Control Panel] Failed to set heartbeat interval to ${intervalMs}ms`);
        // Reset slider to current value
        loadHeartbeatSettings();
      }
    } else {
      console.warn('💓 [Control Panel] RayHeartbeat or RaySettings not available');
    }
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

  function updateHeartbeatStatus() {
    const statusElement = document.getElementById('heartbeatStatus');
    if (!statusElement) return;
    
    if (window.RayHeartbeat) {
      const status = window.RayHeartbeat.status();
      const currentInterval = window.RaySettings?.get('heartbeat.interval') || 'Unknown';
      
      let statusText = `Status: ${status.beating ? '🟢 Beating' : '🔴 Stopped'}\n`;
      statusText += `Current Rate: ${currentInterval}ms\n`;
      statusText += `Uptime: ${status.uptimeFormatted || 'N/A'}\n`;
      statusText += `Tick Count: ${status.tickCount || 0}`;
      
      statusElement.textContent = statusText;
    } else {
      statusElement.textContent = 'Status: ⚠️ RayHeartbeat not available';
    }
  }

  function loadHeartbeatSettings() {
    const slider = document.getElementById('heartbeatSlider');
    const valueDisplay = document.getElementById('heartbeatValue');
    
    if (slider && valueDisplay && window.RaySettings) {
      const currentInterval = window.RaySettings.get('heartbeat.interval') || 1000;
      slider.value = currentInterval;
      valueDisplay.textContent = `${currentInterval}ms`;
    }
    
    updateHeartbeatStatus();
  }

  function updateSystemStatus() {
    const statusElement = document.getElementById('systemStatus');
    if (!statusElement) return;
    
    const enabledSystems = Object.keys(systemStates).filter(key => systemStates[key]);
    const totalSystems = Object.keys(systemStates).length - 1; // Exclude browserClock
    const enabledCount = enabledSystems.length - (systemStates.browserClock ? 1 : 0); // Exclude browserClock from count
    
    let statusText = `Master Power: ${systemStates.masterPower ? '🟢 ON' : '🔴 OFF'}\n`;
    statusText += `Active Systems: ${enabledCount}/${totalSystems - 1}\n`; // -1 to exclude browserClock
    statusText += `Clock: 🟢 Always Available\n`;
    
    if (enabledSystems.length > 1) { // More than just browserClock
      statusText += `Enabled: ${enabledSystems.filter(s => s !== 'browserClock').join(', ')}`;
    } else {
      statusText += 'Only clock access available';
    }
    
    statusElement.textContent = statusText;
  }

  function loadCurrentStates() {
    // Load current system states
    if (window.RayPowerControl) {
      const powered = window.RayPowerControl.isPowered();
      document.getElementById('masterPowerToggle').checked = powered;
      systemStates.masterPower = powered;
    }
    
    if (window.VoiceSynthesisUI) {
      const voiceEnabled = window.VoiceSynthesisUI.isEnabled();
      document.getElementById('voiceSynthesisToggle').checked = voiceEnabled;
      systemStates.voiceSynthesis = voiceEnabled;
    }
    
    // Load heartbeat settings
    loadHeartbeatSettings();
    
    // Update status display
    updateSystemStatus();
  }

  function toggleControlPanel() {
    if (!controlPanel) {
      createControlPanel();
    }

    if (isPanelOpen) {
      closeControlPanel();
    } else {
      openControlPanel();
    }
  }

  function openControlPanel() {
    controlPanel.style.display = 'block';
    isPanelOpen = true;
    
    // Load current states
    setTimeout(() => {
      loadCurrentStates();
    }, 100);

    // Start periodic updates for heartbeat status
    if (window.heartbeatStatusInterval) {
      clearInterval(window.heartbeatStatusInterval);
    }
    
    window.heartbeatStatusInterval = setInterval(() => {
      if (isPanelOpen) {
        updateHeartbeatStatus();
      }
    }, 2000); // Update every 2 seconds

    console.log('🎛️ [Control Panel] Panel opened');
  }

  function closeControlPanel() {
    if (controlPanel) {
      controlPanel.style.display = 'none';
    }
    isPanelOpen = false;
    
    // Stop periodic updates
    if (window.heartbeatStatusInterval) {
      clearInterval(window.heartbeatStatusInterval);
      window.heartbeatStatusInterval = null;
    }
    
    console.log('🎛️ [Control Panel] Panel closed');
  }

  function initControlPanel() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createControlPanelButton);
    } else {
      createControlPanelButton();
    }
  }

  function removeControlPanel() {
    if (controlPanelButton) {
      controlPanelButton.remove();
      controlPanelButton = null;
    }
    if (controlPanel) {
      controlPanel.remove();
      controlPanel = null;
    }
    isPanelOpen = false;
  }

  // Expose module
  window.RayControlPanel = {
    init: initControlPanel,
    toggle: toggleControlPanel,
    open: openControlPanel,
    close: closeControlPanel,
    remove: removeControlPanel,
    getStates: () => ({ ...systemStates })
  };

  console.log('✅ RayControlPanel loaded');
})();