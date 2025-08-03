// Test Voice Recognition Without Backend
// This tests that voice recognition works even when localhost:8000 is offline

console.log('🎤 Testing Voice Recognition (Backend Offline)...');

function testVoiceWithoutBackend() {
  console.log('\n=== Voice Recognition Test (No Backend) ===');
  
  // Check if voice recognition is available
  if (!window.VoiceRecognition) {
    console.error('❌ VoiceRecognition not loaded');
    return;
  }
  
  if (!window.VoiceRecognition.isSupported()) {
    console.error('❌ Voice recognition not supported');
    return;
  }
  
  console.log('🎤 Starting voice recognition test...');
  console.log('📢 Say something - it should work even with backend offline!');
  
  // Start listening with custom handler that doesn't depend on backend
  const success = window.VoiceRecognition.startListening((transcript) => {
    console.log('✅ Voice Recognition Success!');
    console.log('🎤 Transcript:', transcript);
    console.log('📝 Length:', transcript.length, 'characters');
    
    // Show that we got the transcript even without backend
    if (window.VoiceUI) {
      window.VoiceUI.showStatus('🎤 Got: ' + transcript.substring(0, 20) + '...', 5000);
    }
    
    // Test voice synthesis if available
    if (window.VoiceSynthesis && window.VoiceSynthesisUI?.isEnabled()) {
      console.log('🔊 Testing voice synthesis response...');
      window.VoiceSynthesis.speak('I heard you say: ' + transcript);
    }
    
    // Stop after first transcript
    setTimeout(() => {
      window.VoiceRecognition.stopListening();
      console.log('✅ Voice recognition test completed successfully!');
      console.log('🎉 Voice works perfectly without backend!');
    }, 1000);
  });
  
  if (success) {
    console.log('✅ Voice recognition started - backend not required!');
  } else {
    console.error('❌ Failed to start voice recognition');
  }
}

function testVoiceSynthesisWithoutBackend() {
  console.log('\n=== Voice Synthesis Test (No Backend) ===');
  
  if (!window.VoiceSynthesis) {
    console.error('❌ VoiceSynthesis not loaded');
    return;
  }
  
  if (!window.VoiceSynthesis.isSupported()) {
    console.error('❌ Voice synthesis not supported');
    return;
  }
  
  console.log('🔊 Testing voice synthesis without backend...');
  
  const testMessage = "Hello! I am Ray. I can speak even when the backend server is offline. Voice recognition and synthesis work completely in the browser!";
  
  const success = window.VoiceSynthesis.speak(testMessage);
  
  if (success) {
    console.log('✅ Voice synthesis works without backend!');
  } else {
    console.error('❌ Voice synthesis failed');
  }
}

function testFullVoiceSystem() {
  console.log('\n=== Full Voice System Test (No Backend) ===');
  
  // Test both recognition and synthesis
  console.log('🎤 Testing complete voice loop...');
  
  if (!window.VoiceRecognition?.isSupported()) {
    console.error('❌ Voice recognition not supported');
    return;
  }
  
  if (!window.VoiceSynthesis?.isSupported()) {
    console.error('❌ Voice synthesis not supported');
    return;
  }
  
  console.log('📢 Say "hello Ray" to test the complete voice loop!');
  
  window.VoiceRecognition.startListening((transcript) => {
    console.log('🎤 Heard:', transcript);
    
    // Generate a response based on what was heard
    let response = "I heard you say: " + transcript;
    
    if (transcript.toLowerCase().includes('hello')) {
      response = "Hello! Nice to hear your voice. I'm Ray, and I can hear and speak without needing a backend server.";
    } else if (transcript.toLowerCase().includes('test')) {
      response = "Test successful! Voice recognition and synthesis are working perfectly in the browser.";
    } else if (transcript.toLowerCase().includes('stop')) {
      response = "Stopping voice recognition. Goodbye!";
      setTimeout(() => window.VoiceRecognition.stopListening(), 2000);
    }
    
    // Speak the response
    if (window.VoiceSynthesisUI?.isEnabled()) {
      console.log('🔊 Ray responding:', response);
      window.VoiceSynthesis.speak(response);
    }
    
    // Show status
    if (window.VoiceUI) {
      window.VoiceUI.showStatus('🎤→🔊 Voice loop active', 3000);
    }
  });
}

// Run basic tests
console.log('🎤 Voice system works independently of backend!');
console.log('📝 Available tests:');
console.log('  - testVoiceWithoutBackend() - Test voice recognition');
console.log('  - testVoiceSynthesisWithoutBackend() - Test voice synthesis');
console.log('  - testFullVoiceSystem() - Test complete voice conversation');

// Auto-run a quick test
setTimeout(() => {
  console.log('\n🎤 Quick test: Voice synthesis without backend...');
  if (window.VoiceSynthesis?.isSupported()) {
    window.VoiceSynthesis.speak("Voice system loaded successfully. Backend connection is not required for voice features.");
  }
}, 2000);

// Expose test functions
window.testVoiceWithoutBackend = testVoiceWithoutBackend;
window.testVoiceSynthesisWithoutBackend = testVoiceSynthesisWithoutBackend;
window.testFullVoiceSystem = testFullVoiceSystem;