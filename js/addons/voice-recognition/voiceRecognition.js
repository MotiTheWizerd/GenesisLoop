(function() {
  'use strict';

  let recognition = null;
  let isListening = false;
  let onTranscriptCallback = null;

  function initVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('🎤 [Ray Voice] Speech recognition not supported in this browser.');
      return false;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log('🎤 [Ray Voice] Transcript:', transcript);
      
      if (onTranscriptCallback) {
        onTranscriptCallback(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('🎤 [Ray Voice Error]', event.error);
      
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        isListening = false;
        if (window.VoiceUI) {
          window.VoiceUI.showStatus('🚫 Microphone access denied', 5000);
          window.VoiceUI.updateButtonState(false);
          // Show detailed permission help after a brief delay
          setTimeout(() => {
            window.VoiceUI.showPermissionHelp();
          }, 1000);
        }
        console.error('🎤 [Ray Voice] Microphone access denied. Please enable microphone permissions in browser settings.');
      }
      
      if (event.error === 'network') {
        console.warn('🎤 [Ray Voice] Network error, attempting restart...');
        if (window.VoiceUI) {
          window.VoiceUI.showStatus('🌐 Network error, retrying...', 3000);
        }
        setTimeout(() => {
          if (isListening) {
            startListening();
          }
        }, 1000);
      }
      
      if (event.error === 'no-speech') {
        console.warn('🎤 [Ray Voice] No speech detected');
        if (window.VoiceUI) {
          window.VoiceUI.showStatus('🔇 No speech detected', 2000);
        }
      }
      
      if (event.error === 'audio-capture') {
        isListening = false;
        if (window.VoiceUI) {
          window.VoiceUI.showStatus('🎤 Audio capture error', 3000);
          window.VoiceUI.updateButtonState(false);
        }
        console.error('🎤 [Ray Voice] Audio capture error. Check microphone connection.');
      }
    };

    recognition.onend = () => {
      console.warn('🎤 [Ray Voice] Recognition stopped.');
      
      if (isListening) {
        console.log('🎤 [Ray Voice] Auto-restarting...');
        setTimeout(() => {
          if (isListening) {
            recognition.start();
          }
        }, 100);
      }
    };

    recognition.onstart = () => {
      console.log('🎤 [Ray Voice] Listening started');
    };

    return true;
  }

  function startListening(callback) {
    if (!recognition) {
      if (!initVoiceRecognition()) {
        return false;
      }
    }

    if (callback) {
      onTranscriptCallback = callback;
    }

    if (isListening) {
      console.warn('🎤 [Ray Voice] Already listening');
      return true;
    }

    try {
      isListening = true;
      recognition.start();
      return true;
    } catch (error) {
      console.error('🎤 [Ray Voice] Failed to start:', error);
      isListening = false;
      return false;
    }
  }

  function stopListening() {
    if (!recognition || !isListening) {
      return;
    }

    isListening = false;
    recognition.stop();
    console.log('🎤 [Ray Voice] Listening stopped');
  }

  function toggleListening(callback) {
    if (isListening) {
      stopListening();
      return false;
    } else {
      return startListening(callback);
    }
  }

  function isSupported() {
    return 'webkitSpeechRecognition' in window;
  }

  function getStatus() {
    return {
      supported: isSupported(),
      listening: isListening,
      initialized: recognition !== null
    };
  }

  // Expose module
  window.VoiceRecognition = {
    startListening: startListening,
    stopListening: stopListening,
    toggleListening: toggleListening,
    isSupported: isSupported,
    getStatus: getStatus
  };

  console.log('✅ VoiceRecognition loaded');
})();