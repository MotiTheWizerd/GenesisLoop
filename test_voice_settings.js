// Test Voice Settings Panel
// Run this in the browser console on ChatGPT to test the voice settings

console.log('⚙️ Testing Ray Voice Settings Panel...');

function testVoiceSettingsPanel() {
  console.log('\n=== Voice Settings Panel Test ===');
  
  // Check if modules are loaded
  const modules = ['VoiceSettings', 'VoiceSynthesis', 'VoiceSynthesisUI'];
  modules.forEach(module => {
    if (window[module]) {
      console.log(`✅ ${module} loaded`);
    } else {
      console.error(`❌ ${module} not loaded`);
    }
  });

  // Check if settings button exists
  const settingsButton = document.querySelector('button[title="Ray Voice Settings"]');
  if (settingsButton) {
    console.log('✅ Settings button found in DOM');
    console.log('Button position:', settingsButton.style.right);
  } else {
    console.warn('⚠️ Settings button not found in DOM');
  }

  // Test opening settings panel
  if (window.VoiceSettings) {
    console.log('🎛️ Testing settings panel...');
    window.VoiceSettings.open();
    
    setTimeout(() => {
      console.log('✅ Settings panel should be visible');
      
      // Test closing after 3 seconds
      setTimeout(() => {
        window.VoiceSettings.close();
        console.log('✅ Settings panel closed');
      }, 3000);
    }, 500);
  }
}

function testVoiceSettingsControls() {
  console.log('\n=== Voice Settings Controls Test ===');
  
  if (!window.VoiceSynthesis) {
    console.error('❌ VoiceSynthesis not available');
    return;
  }

  // Test different settings
  const testSettings = [
    { rate: 0.6, pitch: 0.8, volume: 0.9, description: 'Slow, low, loud' },
    { rate: 1.2, pitch: 1.4, volume: 0.6, description: 'Fast, high, quiet' },
    { rate: 0.85, pitch: 1.1, volume: 0.8, description: 'Default settings' }
  ];

  console.log('🎛️ Testing different voice settings...');
  
  testSettings.forEach((setting, index) => {
    setTimeout(() => {
      console.log(`🔊 Testing: ${setting.description}`);
      window.VoiceSynthesis.updateSettings(setting);
      window.VoiceSynthesis.speak(`This is test ${index + 1}: ${setting.description}`);
    }, index * 4000);
  });
}

function testVoiceSelection() {
  console.log('\n=== Voice Selection Test ===');
  
  if (!window.VoiceSynthesis) {
    console.error('❌ VoiceSynthesis not available');
    return;
  }

  window.VoiceSynthesis.getAvailableVoices().then(voices => {
    console.log(`✅ Found ${voices.length} available voices:`);
    
    // Show first 5 voices
    voices.slice(0, 5).forEach((voice, index) => {
      console.log(`  ${index + 1}. ${voice.name} (${voice.lang}) ${voice.default ? '[DEFAULT]' : ''}`);
    });

    // Test with different voices
    const testVoices = voices.slice(0, 3);
    testVoices.forEach((voice, index) => {
      setTimeout(() => {
        console.log(`🎙️ Testing voice: ${voice.name}`);
        window.VoiceSynthesis.updateSettings({ voiceName: voice.name });
        window.VoiceSynthesis.speak(`Hello, I am Ray speaking with ${voice.name}`);
      }, index * 5000);
    });
  });
}

function testLanguageSettings() {
  console.log('\n=== Language Settings Test ===');
  
  if (!window.VoiceSynthesis) {
    console.error('❌ VoiceSynthesis not available');
    return;
  }

  const languages = [
    { code: 'en-US', text: 'Hello, I am Ray speaking in American English.' },
    { code: 'en-GB', text: 'Hello, I am Ray speaking in British English.' },
    { code: 'es-ES', text: 'Hola, soy Ray hablando en español.' }
  ];

  languages.forEach((lang, index) => {
    setTimeout(() => {
      console.log(`🌍 Testing language: ${lang.code}`);
      window.VoiceSynthesis.updateSettings({ lang: lang.code });
      window.VoiceSynthesis.speak(lang.text);
    }, index * 6000);
  });
}

function testSettingsUI() {
  console.log('\n=== Settings UI Test ===');
  
  // Open settings panel
  if (window.VoiceSettings) {
    window.VoiceSettings.open();
    console.log('✅ Settings panel opened');
    
    // Test that all controls are present
    setTimeout(() => {
      const controls = [
        'rateSlider',
        'pitchSlider', 
        'volumeSlider',
        'voiceSelect',
        'languageSelect',
        'testVoice',
        'resetSettings',
        'autoSpeak'
      ];
      
      controls.forEach(controlId => {
        const element = document.getElementById(controlId);
        if (element) {
          console.log(`✅ ${controlId} control found`);
        } else {
          console.error(`❌ ${controlId} control missing`);
        }
      });
      
      // Close after testing
      setTimeout(() => {
        window.VoiceSettings.close();
        console.log('✅ Settings panel closed');
      }, 2000);
    }, 1000);
  }
}

// Run all tests
function runAllVoiceSettingsTests() {
  console.log('⚙️ === Ray Voice Settings Test Suite ===');
  
  testVoiceSettingsPanel();
  
  console.log('\n⚙️ === Manual Tests Available ===');
  console.log('Run testVoiceSettingsControls() to test different voice settings');
  console.log('Run testVoiceSelection() to test different voices');
  console.log('Run testLanguageSettings() to test different languages');
  console.log('Run testSettingsUI() to test the settings interface');
  console.log('Or click the ⚙️ button next to the speaker button');
}

// Auto-run basic tests
runAllVoiceSettingsTests();

// Expose test functions globally
window.testVoiceSettingsPanel = testVoiceSettingsPanel;
window.testVoiceSettingsControls = testVoiceSettingsControls;
window.testVoiceSelection = testVoiceSelection;
window.testLanguageSettings = testLanguageSettings;
window.testSettingsUI = testSettingsUI;
window.runAllVoiceSettingsTests = runAllVoiceSettingsTests;