(function() {
  'use strict';

  function initVoiceSynthesisAddon() {
    console.log('🔊 [Ray Voice] Initializing Voice Synthesis Addon...');

    // Check if required dependencies are loaded
    const checkDependencies = () => {
      const required = ['VoiceSynthesis', 'VoiceSynthesisUI', 'VoiceSettings'];
      const missing = required.filter(dep => !window[dep]);
      
      if (missing.length > 0) {
        console.warn('🔊 [Ray Voice] Missing dependencies:', missing);
        return false;
      }
      return true;
    };

    // Initialize with retry logic
    const attemptInit = (attempts = 0) => {
      if (attempts > 10) {
        console.error('🔊 [Ray Voice] Failed to initialize after 10 attempts');
        return;
      }

      if (!checkDependencies()) {
        setTimeout(() => attemptInit(attempts + 1), 500);
        return;
      }

      // Initialize UI
      window.VoiceSynthesisUI.init();
      
      // Initialize settings
      window.VoiceSettings.init();

      // Check support and show status
      const status = window.VoiceSynthesis.getStatus();
      if (!status.supported) {
        console.warn('🔊 [Ray Voice] Speech synthesis not supported in this browser');
        window.VoiceSynthesisUI.showStatus('🔇 Voice not supported', 5000);
      } else {
        console.log('🔊 [Ray Voice] Voice synthesis ready');
        window.VoiceSynthesisUI.showStatus('🔊 Ray Voice ready', 2000);
      }

      // Set up integration with response system
      setupResponseIntegration();
    };

    // Start initialization
    attemptInit();
  }

  function setupResponseIntegration() {
    console.log('🔊 [Ray Voice] Setting up response integration...');

    // Hook into the response system to auto-speak Ray's responses
    if (window.DOMUtils && window.DOMUtils.waitForResponse) {
      console.log('🔊 [Ray Voice] Integrating with DOMUtils response system');
      
      // Create a response observer for voice synthesis
      const originalWaitForResponse = window.DOMUtils.waitForResponse;
      
      window.DOMUtils.waitForResponse = function(callback) {
        return originalWaitForResponse.call(this, function(response) {
          // Call the original callback first
          const result = callback(response);
          
          // Then handle voice synthesis if enabled
          if (window.VoiceSynthesisUI?.isEnabled() && response) {
            console.log('🔊 [Ray Voice] Auto-speaking response');
            window.VoiceSynthesis.speak(response);
          }
          
          return result;
        });
      };
    }

    // Also hook into MessageLoop if available
    if (window.MessageLoop) {
      console.log('🔊 [Ray Voice] Integrating with MessageLoop');
      
      // Store original response handler
      const originalHandleResponse = window.MessageLoop.handleResponse;
      
      if (originalHandleResponse) {
        window.MessageLoop.handleResponse = function(response) {
          // Call original handler
          const result = originalHandleResponse.call(this, response);
          
          // Add voice synthesis
          if (window.VoiceSynthesisUI?.isEnabled() && response) {
            console.log('🔊 [Ray Voice] Speaking MessageLoop response');
            window.VoiceSynthesis.speak(response);
          }
          
          return result;
        };
      }
    }
  }

  // Manual function to speak any text
  function speakText(text, options = {}) {
    if (!window.VoiceSynthesis) {
      console.error('🔊 [Ray Voice] VoiceSynthesis not loaded');
      return false;
    }

    if (!window.VoiceSynthesisUI?.isEnabled()) {
      console.log('🔊 [Ray Voice] Voice synthesis disabled');
      return false;
    }

    return window.VoiceSynthesis.speak(text, options);
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVoiceSynthesisAddon);
  } else {
    initVoiceSynthesisAddon();
  }

  // Expose module
  window.VoiceSynthesisAddon = {
    init: initVoiceSynthesisAddon,
    speak: speakText
  };

  console.log('✅ VoiceSynthesisAddon loaded');
})();