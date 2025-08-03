(function() {
  'use strict';

  let settingsButton = null;
  let settingsPopup = null;
  let isPopupOpen = false;

  function createSettingsButton() {
    if (settingsButton) {
      return settingsButton;
    }

    // Create settings button
    settingsButton = document.createElement('button');
    settingsButton.innerHTML = '⚙️';
    settingsButton.title = 'Ray Voice Settings';
    settingsButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 200px;
      z-index: 10000;
      background: #2d2d2d;
      color: white;
      border: 2px solid #555;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;

    // Add hover effects
    settingsButton.addEventListener('mouseenter', () => {
      settingsButton.style.background = '#404040';
      settingsButton.style.transform = 'scale(1.1)';
    });

    settingsButton.addEventListener('mouseleave', () => {
      settingsButton.style.background = '#2d2d2d';
      settingsButton.style.transform = 'scale(1)';
    });

    // Add click handler
    settingsButton.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSettingsPopup();
    });

    // Append to body
    document.body.appendChild(settingsButton);

    return settingsButton;
  }

  function createSettingsPopup() {
    if (settingsPopup) {
      return settingsPopup;
    }

    // Create popup container
    settingsPopup = document.createElement('div');
    settingsPopup.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 10001;
      background: #2d2d2d;
      color: white;
      border: 2px solid #555;
      border-radius: 15px;
      padding: 20px;
      width: 320px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: none;
    `;

    // Create popup content
    settingsPopup.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0; color: #fff; font-size: 18px;">🎙️ Ray Voice Settings</h3>
        <button id="closeSettings" style="background: none; border: none; color: #aaa; font-size: 20px; cursor: pointer;">×</button>
      </div>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #ccc;">Speech Rate</label>
        <input type="range" id="rateSlider" min="0.1" max="2.0" step="0.1" value="0.85" style="width: 100%; margin-bottom: 5px;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #aaa;">
          <span>Slow</span>
          <span id="rateValue">0.85x</span>
          <span>Fast</span>
        </div>
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #ccc;">Pitch</label>
        <input type="range" id="pitchSlider" min="0.5" max="2.0" step="0.1" value="1.1" style="width: 100%; margin-bottom: 5px;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #aaa;">
          <span>Low</span>
          <span id="pitchValue">1.1x</span>
          <span>High</span>
        </div>
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #ccc;">Volume</label>
        <input type="range" id="volumeSlider" min="0.1" max="1.0" step="0.1" value="0.8" style="width: 100%; margin-bottom: 5px;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #aaa;">
          <span>Quiet</span>
          <span id="volumeValue">80%</span>
          <span>Loud</span>
        </div>
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #ccc;">Voice</label>
        <select id="voiceSelect" style="width: 100%; padding: 8px; background: #404040; color: white; border: 1px solid #666; border-radius: 5px;">
          <option value="">Auto-select best voice</option>
        </select>
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #ccc;">Language</label>
        <select id="languageSelect" style="width: 100%; padding: 8px; background: #404040; color: white; border: 1px solid #666; border-radius: 5px;">
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
          <option value="en-AU">English (Australia)</option>
          <option value="es-ES">Spanish (Spain)</option>
          <option value="es-MX">Spanish (Mexico)</option>
          <option value="fr-FR">French</option>
          <option value="de-DE">German</option>
          <option value="it-IT">Italian</option>
          <option value="pt-BR">Portuguese (Brazil)</option>
          <option value="ja-JP">Japanese</option>
          <option value="ko-KR">Korean</option>
          <option value="zh-CN">Chinese (Simplified)</option>
        </select>
      </div>

      <div style="display: flex; gap: 10px; margin-bottom: 15px;">
        <button id="testVoice" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
          🔊 Test Voice
        </button>
        <button id="resetSettings" style="flex: 1; padding: 10px; background: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
          🔄 Reset
        </button>
      </div>

      <div style="margin-bottom: 10px;">
        <label style="display: flex; align-items: center; font-size: 14px; color: #ccc; cursor: pointer;">
          <input type="checkbox" id="autoSpeak" checked style="margin-right: 8px;">
          Auto-speak Ray's responses
        </label>
      </div>

      <div style="font-size: 12px; color: #888; text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #555;">
        Ray's voice settings are saved automatically
      </div>
    `;

    // Append to body
    document.body.appendChild(settingsPopup);

    // Set up event listeners
    setupPopupEventListeners();

    // Load available voices
    loadAvailableVoices();

    return settingsPopup;
  }

  function setupPopupEventListeners() {
    // Close button
    document.getElementById('closeSettings').addEventListener('click', () => {
      closeSettingsPopup();
    });

    // Rate slider
    const rateSlider = document.getElementById('rateSlider');
    const rateValue = document.getElementById('rateValue');
    rateSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      rateValue.textContent = value + 'x';
      updateVoiceSetting('rate', value);
    });

    // Pitch slider
    const pitchSlider = document.getElementById('pitchSlider');
    const pitchValue = document.getElementById('pitchValue');
    pitchSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      pitchValue.textContent = value + 'x';
      updateVoiceSetting('pitch', value);
    });

    // Volume slider
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    volumeSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      volumeValue.textContent = Math.round(value * 100) + '%';
      updateVoiceSetting('volume', value);
    });

    // Voice select
    document.getElementById('voiceSelect').addEventListener('change', (e) => {
      updateVoiceSetting('voiceName', e.target.value);
    });

    // Language select
    document.getElementById('languageSelect').addEventListener('change', (e) => {
      updateVoiceSetting('lang', e.target.value);
    });

    // Test voice button
    document.getElementById('testVoice').addEventListener('click', () => {
      testCurrentVoice();
    });

    // Reset button
    document.getElementById('resetSettings').addEventListener('click', () => {
      resetToDefaults();
    });

    // Auto-speak checkbox
    document.getElementById('autoSpeak').addEventListener('change', (e) => {
      if (window.VoiceSynthesisUI) {
        window.VoiceSynthesisUI.setEnabled(e.target.checked);
      }
    });

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
      if (isPopupOpen && !settingsPopup.contains(e.target) && e.target !== settingsButton) {
        closeSettingsPopup();
      }
    });
  }

  async function loadAvailableVoices() {
    if (!window.VoiceSynthesis) return;

    try {
      const voices = await window.VoiceSynthesis.getAvailableVoices();
      const voiceSelect = document.getElementById('voiceSelect');
      
      // Clear existing options (except first one)
      while (voiceSelect.children.length > 1) {
        voiceSelect.removeChild(voiceSelect.lastChild);
      }

      // Add voice options
      voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        if (voice.default) {
          option.textContent += ' [Default]';
        }
        voiceSelect.appendChild(option);
      });

    } catch (error) {
      console.error('🎙️ [Voice Settings] Error loading voices:', error);
    }
  }

  function updateVoiceSetting(setting, value) {
    if (!window.VoiceSynthesis) return;

    const settings = {};
    settings[setting] = value;
    window.VoiceSynthesis.updateSettings(settings);
    
    console.log(`🎙️ [Voice Settings] Updated ${setting}:`, value);
  }

  function testCurrentVoice() {
    if (!window.VoiceSynthesis) return;

    const testMessages = [
      "Hello! This is Ray testing my voice settings.",
      "How do I sound with these settings?",
      "I can adjust my speech rate, pitch, and volume.",
      "Let me know if you'd like me to speak differently."
    ];

    const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)];
    window.VoiceSynthesis.speak(randomMessage);
  }

  function resetToDefaults() {
    const defaults = {
      rate: 0.85,
      pitch: 1.1,
      volume: 0.8,
      lang: 'en-US',
      voiceName: null
    };

    // Update sliders and displays
    document.getElementById('rateSlider').value = defaults.rate;
    document.getElementById('rateValue').textContent = defaults.rate + 'x';
    
    document.getElementById('pitchSlider').value = defaults.pitch;
    document.getElementById('pitchValue').textContent = defaults.pitch + 'x';
    
    document.getElementById('volumeSlider').value = defaults.volume;
    document.getElementById('volumeValue').textContent = Math.round(defaults.volume * 100) + '%';
    
    document.getElementById('languageSelect').value = defaults.lang;
    document.getElementById('voiceSelect').value = '';

    // Update voice synthesis settings
    if (window.VoiceSynthesis) {
      window.VoiceSynthesis.updateSettings(defaults);
    }

    console.log('🎙️ [Voice Settings] Reset to defaults');
  }

  function loadCurrentSettings() {
    if (!window.VoiceSynthesis) return;

    const settings = window.VoiceSynthesis.getSettings();
    
    // Update UI with current settings
    document.getElementById('rateSlider').value = settings.rate;
    document.getElementById('rateValue').textContent = settings.rate + 'x';
    
    document.getElementById('pitchSlider').value = settings.pitch;
    document.getElementById('pitchValue').textContent = settings.pitch + 'x';
    
    document.getElementById('volumeSlider').value = settings.volume;
    document.getElementById('volumeValue').textContent = Math.round(settings.volume * 100) + '%';
    
    document.getElementById('languageSelect').value = settings.lang;
    document.getElementById('voiceSelect').value = settings.voiceName || '';

    // Update auto-speak checkbox
    if (window.VoiceSynthesisUI) {
      document.getElementById('autoSpeak').checked = window.VoiceSynthesisUI.isEnabled();
    }
  }

  function toggleSettingsPopup() {
    if (!settingsPopup) {
      createSettingsPopup();
    }

    if (isPopupOpen) {
      closeSettingsPopup();
    } else {
      openSettingsPopup();
    }
  }

  function openSettingsPopup() {
    settingsPopup.style.display = 'block';
    isPopupOpen = true;
    
    // Load current settings
    setTimeout(() => {
      loadCurrentSettings();
    }, 100);

    console.log('🎙️ [Voice Settings] Popup opened');
  }

  function closeSettingsPopup() {
    if (settingsPopup) {
      settingsPopup.style.display = 'none';
    }
    isPopupOpen = false;
    console.log('🎙️ [Voice Settings] Popup closed');
  }

  function initVoiceSettings() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createSettingsButton);
    } else {
      createSettingsButton();
    }
  }

  function removeVoiceSettings() {
    if (settingsButton) {
      settingsButton.remove();
      settingsButton = null;
    }
    if (settingsPopup) {
      settingsPopup.remove();
      settingsPopup = null;
    }
    isPopupOpen = false;
  }

  // Expose module
  window.VoiceSettings = {
    init: initVoiceSettings,
    toggle: toggleSettingsPopup,
    open: openSettingsPopup,
    close: closeSettingsPopup,
    remove: removeVoiceSettings
  };

  console.log('✅ VoiceSettings loaded');
})();