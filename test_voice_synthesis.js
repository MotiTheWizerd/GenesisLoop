// Test Voice Synthesis Integration
// Run this in the browser console on ChatGPT to test Ray's voice

console.log('🔊 Testing Ray Voice Synthesis...');

// Test 1: Check if modules are loaded
function testModuleLoading() {
  console.log('\n=== Test 1: Module Loading ===');
  
  const modules = ['VoiceSynthesis', 'VoiceSynthesisUI', 'VoiceSynthesisAddon'];
  modules.forEach(module => {
    if (window[module]) {
      console.log(`✅ ${module} loaded`);
    } else {
      console.error(`❌ ${module} not loaded`);
    }
  });
}

// Test 2: Check browser support
function testBrowserSupport() {
  console.log('\n=== Test 2: Browser Support ===');
  
  if ('speechSynthesis' in window) {
    console.log('✅ Speech synthesis supported');
  } else {
    console.error('❌ Speech synthesis not supported');
  }
  
  if (window.VoiceSynthesis) {
    const status = window.VoiceSynthesis.getStatus();
    console.log('Voice Synthesis Status:', status);
  }
}

// Test 3: Test available voices
async function testAvailableVoices() {
  console.log('\n=== Test 3: Available Voices ===');
  
  if (!window.VoiceSynthesis) {
    console.error('❌ VoiceSynthesis module not available');
    return;
  }
  
  try {
    const voices = await window.VoiceSynthesis.getAvailableVoices();
    console.log(`✅ Found ${voices.length} voices:`);
    
    voices.slice(0, 5).forEach((voice, index) => {
      console.log(`  ${index + 1}. ${voice.name} (${voice.lang}) ${voice.default ? '[DEFAULT]' : ''}`);
    });
    
    if (voices.length > 5) {
      console.log(`  ... and ${voices.length - 5} more voices`);
    }
  } catch (error) {
    console.error('❌ Error getting voices:', error);
  }
}

// Test 4: Test basic speech
function testBasicSpeech() {
  console.log('\n=== Test 4: Basic Speech Test ===');
  
  if (!window.VoiceSynthesis) {
    console.error('❌ VoiceSynthesis module not available');
    return;
  }
  
  if (!window.VoiceSynthesis.isSupported()) {
    console.error('❌ Speech synthesis not supported in this browser');
    return;
  }
  
  const testText = "Hello! I am Ray. I can now speak to you directly.";
  console.log('🔊 Testing basic speech:', testText);
  
  const success = window.VoiceSynthesis.speak(testText);
  
  if (success) {
    console.log('✅ Speech test started successfully');
  } else {
    console.error('❌ Failed to start speech test');
  }
}

// Test 5: Test voice settings
function testVoiceSettings() {
  console.log('\n=== Test 5: Voice Settings Test ===');
  
  if (!window.VoiceSynthesis) {
    console.error('❌ VoiceSynthesis module not available');
    return;
  }
  
  // Test different settings
  const testSettings = [
    { rate: 0.8, pitch: 0.9, text: "This is slow and low pitch." },
    { rate: 1.2, pitch: 1.3, text: "This is fast and high pitch." },
    { rate: 1.0, pitch: 1.0, text: "This is normal speed and pitch." }
  ];
  
  testSettings.forEach((setting, index) => {
    setTimeout(() => {
      console.log(`🔊 Testing setting ${index + 1}:`, setting);
      window.VoiceSynthesis.speak(setting.text, {
        rate: setting.rate,
        pitch: setting.pitch
      });
    }, index * 4000); // 4 second delay between tests
  });
}

// Test 6: Test UI components
function testVoiceSynthesisUI() {
  console.log('\n=== Test 6: Voice Synthesis UI ===');
  
  if (!window.VoiceSynthesisUI) {
    console.error('❌ VoiceSynthesisUI module not available');
    return;
  }
  
  // Check if speaker button exists
  const speakerButton = document.querySelector('button[title*="Ray Voice"]');
  if (speakerButton) {
    console.log('✅ Speaker button found in DOM');
    console.log('Button position:', speakerButton.style.position);
    console.log('Button visibility:', speakerButton.style.display);
  } else {
    console.warn('⚠️ Speaker button not found in DOM');
  }
  
  // Test status display
  window.VoiceSynthesisUI.showStatus('🔊 Voice test message', 2000);
  console.log('✅ Status message test triggered');
}

// Test 7: Test integration with response system
function testResponseIntegration() {
  console.log('\n=== Test 7: Response Integration ===');
  
  const requiredModules = ['VoiceSynthesis', 'DOMUtils', 'MessageLoop'];
  const available = requiredModules.filter(module => window[module]);
  const missing = requiredModules.filter(module => !window[module]);
  
  console.log('Available modules:', available);
  if (missing.length > 0) {
    console.warn('Missing modules:', missing);
  }
  
  if (window.VoiceSynthesisAddon) {
    console.log('✅ VoiceSynthesisAddon can integrate with response system');
    
    // Test manual speak function
    const testResponse = "This is a test response from Ray. I am speaking through the browser's voice synthesis system.";
    console.log('🔊 Testing manual speak function');
    window.VoiceSynthesisAddon.speak(testResponse);
  } else {
    console.warn('⚠️ VoiceSynthesisAddon not available');
  }
}

// Test 8: Test voice controls
function testVoiceControls() {
  console.log('\n=== Test 8: Voice Controls ===');
  
  if (!window.VoiceSynthesis) {
    console.error('❌ VoiceSynthesis module not available');
    return;
  }
  
  const longText = "This is a longer text to test voice controls. I will speak this text and then demonstrate pause, resume, and stop functionality. This gives us time to test the various control functions.";
  
  console.log('🔊 Starting long speech for control testing...');
  window.VoiceSynthesis.speak(longText);
  
  // Test pause after 3 seconds
  setTimeout(() => {
    console.log('⏸️ Testing pause...');
    window.VoiceSynthesis.pause();
  }, 3000);
  
  // Test resume after 5 seconds
  setTimeout(() => {
    console.log('▶️ Testing resume...');
    window.VoiceSynthesis.resume();
  }, 5000);
  
  // Test stop after 8 seconds
  setTimeout(() => {
    console.log('⏹️ Testing stop...');
    window.VoiceSynthesis.stop();
  }, 8000);
}

// Run all tests
function runAllTests() {
  console.log('🔊 === Ray Voice Synthesis Test Suite ===');
  
  testModuleLoading();
  testBrowserSupport();
  testAvailableVoices();
  testVoiceSynthesisUI();
  testResponseIntegration();
  
  console.log('\n🔊 === Manual Tests Available ===');
  console.log('Run testBasicSpeech() to test Ray speaking');
  console.log('Run testVoiceSettings() to test different voice settings');
  console.log('Run testVoiceControls() to test pause/resume/stop');
  console.log('Or click the speaker button (🔊) in the top-right corner');
}

// Auto-run tests
runAllTests();

// Expose test functions globally for manual testing
window.testBasicSpeech = testBasicSpeech;
window.testVoiceSettings = testVoiceSettings;
window.testVoiceControls = testVoiceControls;
window.runVoiceSynthesisTests = runAllTests;