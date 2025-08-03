(function() {
  'use strict';

  let speakerButton = null;
  let speakingIndicator = null;
  let isEnabled = true;

  function createSpeakerButton() {
    if (speakerButton) {
      return speakerButton;
    }

    // Create speaker button
    speakerButton = document.createElement('button');
    speakerButton.innerHTML = '🔊';
    speakerButton.title = 'Toggle Ray Voice (Text-to-Speech)';
    speakerButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 140px;
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

    // Create speaking indicator
    speakingIndicator = document.createElement('div');
    speakingIndicator.style.cssText = `
      position: fixed;
      top: 75px;
      right: 145px;
      z-index: 10000;
      background: #333;
      color: white;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
      display: none;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    speakingIndicator.textContent = 'Ray Speaking...';

    // Add hover effects
    speakerButton.addEventListener('mouseenter', () => {
      if (isEnabled) {
        speakerButton.style.background = '#404040';
      }
      speakerButton.style.transform = 'scale(1.1)';
    });

    speakerButton.addEventListener('mouseleave', () => {
      speakerButton.style.background = isEnabled ? '#2d2d2d' : '#666';
      speakerButton.style.transform = 'scale(1)';
    });

    // Add click handler
    speakerButton.addEventListener('click', () => {
      if (!window.VoiceSynthesis) {
        console.error('🔊 [Ray Voice UI] VoiceSynthesis module not loaded');
        return;
      }

      if (window.VoiceSynthesis.isSpeaking()) {
        // Stop current speech
        window.VoiceSynthesis.stop();
        updateSpeakingState(false);
      } else {
        // Toggle enabled state
        isEnabled = !isEnabled;
        updateButtonState();
        
        if (isEnabled) {
          showStatus('🔊 Ray Voice enabled', 2000);
        } else {
          showStatus('🔇 Ray Voice disabled', 2000);
        }
      }
    });

    // Append to body
    document.body.appendChild(speakerButton);
    document.body.appendChild(speakingIndicator);

    return speakerButton;
  }

  function updateButtonState() {
    if (!speakerButton) return;

    if (isEnabled) {
      speakerButton.style.background = '#2d2d2d';
      speakerButton.style.borderColor = '#555';
      speakerButton.innerHTML = '🔊';
      speakerButton.title = 'Ray Voice Enabled - Click to disable';
    } else {
      speakerButton.style.background = '#666';
      speakerButton.style.borderColor = '#888';
      speakerButton.innerHTML = '🔇';
      speakerButton.title = 'Ray Voice Disabled - Click to enable';
    }
  }

  function updateSpeakingState(speaking) {
    if (!speakerButton || !speakingIndicator) return;

    if (speaking && isEnabled) {
      speakerButton.style.background = '#44ff44';
      speakerButton.style.borderColor = '#66ff66';
      speakerButton.innerHTML = '🎙️';
      speakerButton.title = 'Ray is speaking - Click to stop';
      
      speakingIndicator.style.display = 'block';
      speakingIndicator.style.background = '#44ff44';
      speakingIndicator.style.color = 'black';
      
      // Add pulsing animation
      speakerButton.style.animation = 'pulse 1.5s infinite';
      
      // Add CSS animation if not exists
      if (!document.getElementById('rayVoiceStyles')) {
        const style = document.createElement('style');
        style.id = 'rayVoiceStyles';
        style.textContent = `
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      speakerButton.style.animation = '';
      speakingIndicator.style.display = 'none';
      updateButtonState();
    }
  }

  function showStatus(message, duration = 3000) {
    if (!speakingIndicator) return;

    const originalDisplay = speakingIndicator.style.display;
    const originalBackground = speakingIndicator.style.background;
    const originalColor = speakingIndicator.style.color;

    speakingIndicator.textContent = message;
    speakingIndicator.style.display = 'block';
    
    // Color coding for different message types
    if (message.includes('🔇') || message.includes('disabled')) {
      speakingIndicator.style.background = '#ff4444';
      speakingIndicator.style.color = 'white';
    } else if (message.includes('🔊') || message.includes('enabled')) {
      speakingIndicator.style.background = '#44ff44';
      speakingIndicator.style.color = 'black';
    } else {
      speakingIndicator.style.background = '#333';
      speakingIndicator.style.color = 'white';
    }

    if (duration > 0) {
      setTimeout(() => {
        if (!window.VoiceSynthesis?.isSpeaking()) {
          speakingIndicator.style.display = originalDisplay;
          speakingIndicator.style.background = originalBackground;
          speakingIndicator.style.color = originalColor;
          speakingIndicator.textContent = 'Ray Speaking...';
        }
      }, duration);
    }
  }

  function removeSpeakerUI() {
    if (speakerButton) {
      speakerButton.remove();
      speakerButton = null;
    }
    if (speakingIndicator) {
      speakingIndicator.remove();
      speakingIndicator = null;
    }
    
    // Remove styles
    const styles = document.getElementById('rayVoiceStyles');
    if (styles) {
      styles.remove();
    }
  }

  function initSpeakerUI() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createSpeakerButton);
    } else {
      createSpeakerButton();
    }

    // Check if voice synthesis is supported
    if (!window.VoiceSynthesis?.isSupported()) {
      setTimeout(() => {
        showStatus('🔇 Voice not supported', 5000);
        isEnabled = false;
        updateButtonState();
      }, 1000);
    }
  }

  function isVoiceEnabled() {
    return isEnabled;
  }

  function setVoiceEnabled(enabled) {
    isEnabled = enabled;
    updateButtonState();
    
    if (!enabled && window.VoiceSynthesis?.isSpeaking()) {
      window.VoiceSynthesis.stop();
    }
  }

  // Expose module
  window.VoiceSynthesisUI = {
    init: initSpeakerUI,
    updateButtonState: updateButtonState,
    updateSpeakingState: updateSpeakingState,
    showStatus: showStatus,
    remove: removeSpeakerUI,
    isEnabled: isVoiceEnabled,
    setEnabled: setVoiceEnabled
  };

  console.log('✅ VoiceSynthesisUI loaded');
})();