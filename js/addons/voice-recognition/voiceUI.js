(function() {
  'use strict';

  let voiceButton = null;
  let statusIndicator = null;

  function createVoiceButton() {
    if (voiceButton) {
      return voiceButton;
    }

    // Create voice button
    voiceButton = document.createElement('button');
    voiceButton.innerHTML = '🎤';
    voiceButton.title = 'Toggle Voice Recognition (Ray Voice)';
    voiceButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 80px;
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

    // Create status indicator
    statusIndicator = document.createElement('div');
    statusIndicator.style.cssText = `
      position: fixed;
      top: 75px;
      right: 85px;
      z-index: 10000;
      background: #333;
      color: white;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
      display: none;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    statusIndicator.textContent = 'Voice Ready';

    // Add hover effects
    voiceButton.addEventListener('mouseenter', () => {
      voiceButton.style.background = '#404040';
      voiceButton.style.transform = 'scale(1.1)';
    });

    voiceButton.addEventListener('mouseleave', () => {
      const status = window.VoiceRecognition?.getStatus();
      voiceButton.style.background = status?.listening ? '#ff4444' : '#2d2d2d';
      voiceButton.style.transform = 'scale(1)';
    });

    // Add click handler
    voiceButton.addEventListener('click', () => {
      if (!window.VoiceRecognition) {
        console.error('🎤 [Ray Voice UI] VoiceRecognition module not loaded');
        return;
      }

      const isListening = window.VoiceRecognition.toggleListening(async (transcript) => {
        if (window.MessageSender) {
          console.log('🎤 [Ray Voice UI] Sending transcript via MessageSender:', transcript);
          try {
            await window.MessageSender.sendTestMessage(transcript);
            console.log('🎤 [Ray Voice UI] Message sent successfully');
          } catch (error) {
            console.warn('🎤 [Ray Voice UI] MessageSender failed, but voice recognition still works:', error.message);
            // Voice recognition still works even if backend fails
            showStatus('🎤 Voice sent (backend offline)', 3000);
          }
        } else {
          console.warn('🎤 [Ray Voice UI] MessageSender not available, transcript:', transcript);
          showStatus('🎤 Voice received: ' + transcript.substring(0, 30) + '...', 3000);
        }
      });

      updateButtonState(isListening);
    });

    // Append to body
    document.body.appendChild(voiceButton);
    document.body.appendChild(statusIndicator);

    return voiceButton;
  }

  function updateButtonState(isListening) {
    if (!voiceButton) return;

    if (isListening) {
      voiceButton.style.background = '#ff4444';
      voiceButton.style.borderColor = '#ff6666';
      voiceButton.innerHTML = '🔴';
      voiceButton.title = 'Stop Voice Recognition';
      statusIndicator.textContent = 'Listening...';
      statusIndicator.style.display = 'block';
    } else {
      voiceButton.style.background = '#2d2d2d';
      voiceButton.style.borderColor = '#555';
      voiceButton.innerHTML = '🎤';
      voiceButton.title = 'Start Voice Recognition';
      statusIndicator.style.display = 'none';
    }
  }

  function showStatus(message, duration = 3000) {
    if (!statusIndicator) return;

    statusIndicator.textContent = message;
    statusIndicator.style.display = 'block';
    
    // Color coding for different message types
    if (message.includes('🚫') || message.includes('error')) {
      statusIndicator.style.background = '#ff4444';
      statusIndicator.style.color = 'white';
    } else if (message.includes('🌐') || message.includes('retrying')) {
      statusIndicator.style.background = '#ff8800';
      statusIndicator.style.color = 'white';
    } else if (message.includes('✅') || message.includes('ready')) {
      statusIndicator.style.background = '#44ff44';
      statusIndicator.style.color = 'black';
    } else {
      statusIndicator.style.background = '#333';
      statusIndicator.style.color = 'white';
    }

    if (duration > 0) {
      setTimeout(() => {
        const voiceStatus = window.VoiceRecognition?.getStatus();
        if (!voiceStatus?.listening) {
          statusIndicator.style.display = 'none';
          // Reset to default colors
          statusIndicator.style.background = '#333';
          statusIndicator.style.color = 'white';
        }
      }, duration);
    }
  }

  function showPermissionHelp() {
    // Create a more detailed permission help overlay
    const helpOverlay = document.createElement('div');
    helpOverlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10001;
      background: #2d2d2d;
      color: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      max-width: 400px;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    helpOverlay.innerHTML = `
      <h3 style="margin-top: 0; color: #ff6666;">🎤 Microphone Access Required</h3>
      <p>To use voice recognition, please enable microphone permissions:</p>
      <ol style="text-align: left; margin: 15px 0;">
        <li>Click the 🔒 or 🎤 icon in your address bar</li>
        <li>Select "Allow" for microphone access</li>
        <li>Refresh the page if needed</li>
      </ol>
      <p style="font-size: 12px; color: #aaa;">
        Your voice is processed locally and never stored.
      </p>
      <button id="closePermissionHelp" style="
        background: #4CAF50;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
      ">Got it</button>
    `;

    document.body.appendChild(helpOverlay);

    // Close button handler
    document.getElementById('closePermissionHelp').addEventListener('click', () => {
      helpOverlay.remove();
    });

    // Auto-close after 10 seconds
    setTimeout(() => {
      if (helpOverlay.parentNode) {
        helpOverlay.remove();
      }
    }, 10000);
  }

  function removeVoiceUI() {
    if (voiceButton) {
      voiceButton.remove();
      voiceButton = null;
    }
    if (statusIndicator) {
      statusIndicator.remove();
      statusIndicator = null;
    }
  }

  function initVoiceUI() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createVoiceButton);
    } else {
      createVoiceButton();
    }

    // Check if voice recognition is supported
    if (!window.VoiceRecognition?.isSupported()) {
      setTimeout(() => {
        showStatus('Voice not supported', 5000);
      }, 1000);
    }
  }

  // Expose module
  window.VoiceUI = {
    init: initVoiceUI,
    updateButtonState: updateButtonState,
    showStatus: showStatus,
    showPermissionHelp: showPermissionHelp,
    remove: removeVoiceUI
  };

  console.log('✅ VoiceUI loaded');
})();