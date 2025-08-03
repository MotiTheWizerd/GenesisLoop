(function() {
  'use strict';

  const synth = window.speechSynthesis;
  let speaking = false;
  let currentUtterance = null;
  let voiceSettings = {
    rate: 0.85,
    pitch: 1.1,
    volume: 0.8,
    lang: 'en-US',
    voiceName: null // Will auto-select best voice
  };

  function initVoices() {
    return new Promise((resolve) => {
      if (synth.getVoices().length > 0) {
        resolve(synth.getVoices());
        return;
      }

      // Wait for voices to load
      synth.addEventListener('voiceschanged', () => {
        resolve(synth.getVoices());
      }, { once: true });
    });
  }

  async function selectBestVoice() {
    const voices = await initVoices();
    
    // Priority order for voice selection
    const preferences = [
      'Google US English',
      'Samantha',
      'Alex',
      'Microsoft David',
      'Microsoft Zira'
    ];

    // Try to find preferred voice
    for (const pref of preferences) {
      const voice = voices.find(v => v.name.includes(pref));
      if (voice) {
        console.log('🎙️ [Ray Voice] Selected voice:', voice.name);
        return voice;
      }
    }

    // Fallback to default English voice
    const englishVoice = voices.find(v => 
      v.lang.startsWith('en') && v.default
    );
    
    if (englishVoice) {
      console.log('🎙️ [Ray Voice] Using default English voice:', englishVoice.name);
      return englishVoice;
    }

    // Last resort - first available voice
    const firstVoice = voices[0];
    console.log('🎙️ [Ray Voice] Using first available voice:', firstVoice?.name);
    return firstVoice;
  }

  async function speak(text, options = {}) {
    if (!synth) {
      console.warn('🎙️ [Ray Voice] Speech synthesis not supported');
      return false;
    }

    if (!text || text.trim() === '') {
      console.warn('🎙️ [Ray Voice] No text to speak');
      return false;
    }

    // Stop any current speech
    stop();

    try {
      // Clean text for better speech
      const cleanText = cleanTextForSpeech(text);
      console.log('🎙️ [Ray Voice] Speaking:', cleanText.substring(0, 100) + '...');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Apply settings
      utterance.rate = options.rate || voiceSettings.rate;
      utterance.pitch = options.pitch || voiceSettings.pitch;
      utterance.volume = options.volume || voiceSettings.volume;
      utterance.lang = options.lang || voiceSettings.lang;

      // Select voice
      const voice = await selectBestVoice();
      if (voice) {
        utterance.voice = voice;
      }

      // Set up event handlers
      utterance.onstart = () => {
        speaking = true;
        console.log('🎙️ [Ray Voice] Started speaking');
        if (window.VoiceSynthesisUI) {
          window.VoiceSynthesisUI.updateSpeakingState(true);
        }
      };

      utterance.onend = () => {
        speaking = false;
        currentUtterance = null;
        console.log('🎙️ [Ray Voice] Finished speaking');
        if (window.VoiceSynthesisUI) {
          window.VoiceSynthesisUI.updateSpeakingState(false);
        }
      };

      utterance.onerror = (event) => {
        speaking = false;
        currentUtterance = null;
        console.error('🎙️ [Ray Voice] Speech error:', event.error);
        if (window.VoiceSynthesisUI) {
          window.VoiceSynthesisUI.updateSpeakingState(false);
        }
      };

      utterance.onpause = () => {
        console.log('🎙️ [Ray Voice] Speech paused');
      };

      utterance.onresume = () => {
        console.log('🎙️ [Ray Voice] Speech resumed');
      };

      // Store current utterance
      currentUtterance = utterance;

      // Speak
      synth.speak(utterance);
      return true;

    } catch (error) {
      console.error('🎙️ [Ray Voice] Error in speak function:', error);
      speaking = false;
      currentUtterance = null;
      return false;
    }
  }

  function cleanTextForSpeech(text) {
    return text
      // Remove markdown formatting
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/#{1,6}\s/g, '')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '[code block]')
      // Remove URLs
      .replace(/https?:\/\/[^\s]+/g, '[link]')
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  function stop() {
    if (synth && synth.speaking) {
      synth.cancel();
    }
    speaking = false;
    currentUtterance = null;
    console.log('🎙️ [Ray Voice] Speech stopped');
    
    if (window.VoiceSynthesisUI) {
      window.VoiceSynthesisUI.updateSpeakingState(false);
    }
  }

  function pause() {
    if (synth && synth.speaking) {
      synth.pause();
      console.log('🎙️ [Ray Voice] Speech paused');
    }
  }

  function resume() {
    if (synth && synth.paused) {
      synth.resume();
      console.log('🎙️ [Ray Voice] Speech resumed');
    }
  }

  function isSpeaking() {
    return speaking || synth.speaking;
  }

  function isPaused() {
    return synth.paused;
  }

  function isSupported() {
    return 'speechSynthesis' in window;
  }

  function updateSettings(newSettings) {
    voiceSettings = { ...voiceSettings, ...newSettings };
    console.log('🎙️ [Ray Voice] Settings updated:', voiceSettings);
  }

  function getSettings() {
    return { ...voiceSettings };
  }

  async function getAvailableVoices() {
    return await initVoices();
  }

  function getStatus() {
    return {
      supported: isSupported(),
      speaking: isSpeaking(),
      paused: isPaused(),
      settings: getSettings()
    };
  }

  // Expose module
  window.VoiceSynthesis = {
    speak: speak,
    stop: stop,
    pause: pause,
    resume: resume,
    isSpeaking: isSpeaking,
    isPaused: isPaused,
    isSupported: isSupported,
    updateSettings: updateSettings,
    getSettings: getSettings,
    getAvailableVoices: getAvailableVoices,
    getStatus: getStatus
  };

  console.log('✅ VoiceSynthesis loaded');
})();