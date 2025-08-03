// Test Voice Recognition Integration
// Run this in the browser console on ChatGPT to test voice functionality

console.log('🎤 Testing Voice Recognition Integration...');

// Test 1: Check if modules are loaded
function testModuleLoading() {
  console.log('\n=== Test 1: Module Loading ===');
  
  const modules = ['VoiceRecognition', 'VoiceUI', 'VoiceRecognitionAddon'];
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
  
  if ('webkitSpeechRecognition' in window) {
    console.log('✅ Speech recognition supported');
  } else {
    console.error('❌ Speech recognition not supported');
  }
  
  if (window.VoiceRecognition) {
    const status = window.VoiceRecognition.getStatus();
    console.log('Voice Recognition Status:', status);
  }
}

// Test 3: Test voice recognition functionality
function testVoiceRecognition() {
  console.log('\n=== Test 3: Voice Recognition Functionality ===');
  
  if (!window.VoiceRecognition) {
    console.error('❌ VoiceRecognition module not available');
    return;
  }
  
  if (!window.VoiceRecognition.isSupported()) {
    console.error('❌ Voice recognition not supported in this browser');
    return;
  }
  
  console.log('🎤 Starting voice recognition test...');
  console.log('📢 Say something to test voice recognition!');
  
  const success = window.VoiceRecognition.startListening((transcript) => {
    console.log('🎤 Transcript received:', transcript);
    
    // Test integration with MessageSender
    if (window.MessageSender) {
      console.log('✅ MessageSender available - would send:', transcript);
      // Uncomment to actually send: window.MessageSender.sendTestMessage(transcript);
    } else {
      console.warn('⚠️ MessageSender not available');
    }
    
    // Stop after first transcript for test
    setTimeout(() => {
      window.VoiceRecognition.stopListening();
      console.log('🎤 Voice recognition test completed');
    }, 1000);
  });
  
  if (success) {
    console.log('✅ Voice recognition started successfully');
  } else {
    console.error('❌ Failed to start voice recognition');
  }
}

// Test 4: Test UI components
function testVoiceUI() {
  console.log('\n=== Test 4: Voice UI Components ===');
  
  if (!window.VoiceUI) {
    console.error('❌ VoiceUI module not available');
    return;
  }
  
  // Check if voice button exists
  const voiceButton = document.querySelector('button[title*="Voice Recognition"]');
  if (voiceButton) {
    console.log('✅ Voice button found in DOM');
    console.log('Button position:', voiceButton.style.position);
    console.log('Button visibility:', voiceButton.style.display);
  } else {
    console.warn('⚠️ Voice button not found in DOM');
  }
  
  // Test status display
  window.VoiceUI.showStatus('Test status message', 2000);
  console.log('✅ Status message test triggered');
}

// Test 5: Integration with MessageLoop
function testMessageLoopIntegration() {
  console.log('\n=== Test 5: MessageLoop Integration ===');
  
  const requiredModules = ['MessageLoop', 'MessageSender', 'VoiceRecognition'];
  const available = requiredModules.filter(module => window[module]);
  const missing = requiredModules.filter(module => !window[module]);
  
  console.log('Available modules:', available);
  if (missing.length > 0) {
    console.warn('Missing modules:', missing);
  }
  
  if (window.MessageLoop && window.VoiceRecognition) {
    console.log('✅ Voice recognition can integrate with MessageLoop');
  } else {
    console.warn('⚠️ Integration modules not fully available');
  }
}

// Run all tests
function runAllTests() {
  console.log('🎤 === Voice Recognition Test Suite ===');
  
  testModuleLoading();
  testBrowserSupport();
  testVoiceUI();
  testMessageLoopIntegration();
  
  console.log('\n🎤 === Manual Test Available ===');
  console.log('Run testVoiceRecognition() to test actual voice input');
  console.log('Or click the voice button (🎤) in the top-right corner');
}

// Auto-run tests
runAllTests();

// Expose test functions globally for manual testing
window.testVoiceRecognition = testVoiceRecognition;
window.runVoiceTests = runAllTests;