(function() {
  'use strict';

  function initVoiceRecognitionAddon() {
    console.log('🎤 [Ray Voice] Initializing Voice Recognition Addon...');

    // Check if required dependencies are loaded
    const checkDependencies = () => {
      const required = ['VoiceRecognition', 'VoiceUI'];
      const missing = required.filter(dep => !window[dep]);
      
      if (missing.length > 0) {
        console.warn('🎤 [Ray Voice] Missing dependencies:', missing);
        return false;
      }
      return true;
    };

    // Initialize with retry logic
    const attemptInit = (attempts = 0) => {
      if (attempts > 10) {
        console.error('🎤 [Ray Voice] Failed to initialize after 10 attempts');
        return;
      }

      if (!checkDependencies()) {
        setTimeout(() => attemptInit(attempts + 1), 500);
        return;
      }

      // Initialize UI
      window.VoiceUI.init();

      // Check support and show status
      const status = window.VoiceRecognition.getStatus();
      if (!status.supported) {
        console.warn('🎤 [Ray Voice] Speech recognition not supported in this browser');
        window.VoiceUI.showStatus('Voice not supported', 5000);
      } else {
        console.log('🎤 [Ray Voice] Voice recognition ready');
        window.VoiceUI.showStatus('Voice ready', 2000);
      }
    };

    // Start initialization
    attemptInit();
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVoiceRecognitionAddon);
  } else {
    initVoiceRecognitionAddon();
  }

  // Expose module
  window.VoiceRecognitionAddon = {
    init: initVoiceRecognitionAddon
  };

  console.log('✅ VoiceRecognitionAddon loaded');
})();