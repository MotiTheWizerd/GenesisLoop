// Test Ray Power Control System
// Run this in the browser console on ChatGPT to test the power control

console.log('⚡ Testing Ray Power Control System...');

function testPowerControlSystem() {
  console.log('\n=== Power Control System Test ===');
  
  // Check if power control is loaded
  if (window.RayPowerControl) {
    console.log('✅ RayPowerControl loaded');
  } else {
    console.error('❌ RayPowerControl not loaded');
    return;
  }

  // Check if power button exists
  const powerButton = document.querySelector('button[title*="Ray Power Control"]');
  if (powerButton) {
    console.log('✅ Power button found in DOM');
    console.log('Button position:', powerButton.style.right);
    console.log('Button state:', powerButton.style.background);
  } else {
    console.warn('⚠️ Power button not found in DOM');
  }

  // Check initial power state
  const isPowered = window.RayPowerControl.isPowered();
  console.log('🔋 Initial power state:', isPowered ? 'ONLINE' : 'OFFLINE');
  
  // Check power settings
  const settings = window.RayPowerControl.getSettings();
  console.log('⚙️ Power settings:', settings);
}

function testPowerToggle() {
  console.log('\n=== Power Toggle Test ===');
  
  if (!window.RayPowerControl) {
    console.error('❌ RayPowerControl not available');
    return;
  }

  const initialState = window.RayPowerControl.isPowered();
  console.log('🔋 Current state:', initialState ? 'ONLINE' : 'OFFLINE');
  
  // Toggle power
  console.log('⚡ Toggling power...');
  window.RayPowerControl.toggle();
  
  setTimeout(() => {
    const newState = window.RayPowerControl.isPowered();
    console.log('🔋 New state:', newState ? 'ONLINE' : 'OFFLINE');
    
    if (newState !== initialState) {
      console.log('✅ Power toggle successful');
    } else {
      console.error('❌ Power toggle failed');
    }
    
    // Toggle back after 3 seconds
    setTimeout(() => {
      console.log('⚡ Toggling back...');
      window.RayPowerControl.toggle();
      
      setTimeout(() => {
        const finalState = window.RayPowerControl.isPowered();
        console.log('🔋 Final state:', finalState ? 'ONLINE' : 'OFFLINE');
      }, 500);
    }, 3000);
  }, 500);
}

function testDisabledFunctions() {
  console.log('\n=== Disabled Functions Test ===');
  
  // Ensure Ray is powered off
  if (window.RayPowerControl?.isPowered()) {
    console.log('🔒 Disabling Ray for test...');
    window.RayPowerControl.disable();
  }
  
  setTimeout(() => {
    // Test DOM API functions
    if (window.DOMAPI) {
      console.log('🧪 Testing disabled DOM functions...');
      
      try {
        const result = window.DOMAPI.click('button');
        console.log('DOM Click result:', result);
      } catch (error) {
        console.log('DOM Click blocked:', error.message);
      }
      
      try {
        const result = window.DOMAPI.type('input', 'test');
        console.log('DOM Type result:', result);
      } catch (error) {
        console.log('DOM Type blocked:', error.message);
      }
    }
    
    // Test Message Loop
    if (window.MessageLoop) {
      console.log('🧪 Testing disabled Message Loop...');
      
      try {
        const result = window.MessageLoop.startLoop();
        console.log('Message Loop result:', result);
      } catch (error) {
        console.log('Message Loop blocked:', error.message);
      }
    }
    
    // Test Data Sender
    if (window.DataSender) {
      console.log('🧪 Testing disabled Data Sender...');
      
      try {
        const result = window.DataSender.sendExtractedResponse('test');
        console.log('Data Sender result:', result);
      } catch (error) {
        console.log('Data Sender blocked:', error.message);
      }
    }
  }, 1000);
}

function testEnabledFunctions() {
  console.log('\n=== Enabled Functions Test ===');
  
  // Ensure Ray is powered on
  if (!window.RayPowerControl?.isPowered()) {
    console.log('⚡ Enabling Ray for test...');
    window.RayPowerControl.enable();
  }
  
  setTimeout(() => {
    // Test DOM API functions
    if (window.DOMAPI) {
      console.log('🧪 Testing enabled DOM functions...');
      console.log('DOM API available:', typeof window.DOMAPI.click === 'function');
    }
    
    // Test Message Loop
    if (window.MessageLoop) {
      console.log('🧪 Testing enabled Message Loop...');
      console.log('Message Loop available:', typeof window.MessageLoop.startLoop === 'function');
    }
    
    // Test Data Sender
    if (window.DataSender) {
      console.log('🧪 Testing enabled Data Sender...');
      console.log('Data Sender available:', typeof window.DataSender.sendExtractedResponse === 'function');
    }
  }, 1000);
}

function testPowerSecurity() {
  console.log('\n=== Power Security Test ===');
  
  // Test that Ray starts disabled
  console.log('🔒 Testing default disabled state...');
  
  // Simulate fresh load
  if (window.RayPowerControl) {
    const isPowered = window.RayPowerControl.isPowered();
    if (!isPowered) {
      console.log('✅ Ray correctly starts DISABLED by default');
    } else {
      console.warn('⚠️ Ray is ENABLED by default - security risk!');
    }
    
    // Test power settings
    const settings = window.RayPowerControl.getSettings();
    const disabledSystems = Object.values(settings).filter(enabled => !enabled).length;
    const totalSystems = Object.keys(settings).length;
    
    console.log(`🔒 ${disabledSystems}/${totalSystems} systems disabled by default`);
    
    if (disabledSystems === totalSystems) {
      console.log('✅ All systems correctly disabled by default');
    } else {
      console.warn('⚠️ Some systems enabled by default - check security');
    }
  }
}

function testPowerUI() {
  console.log('\n=== Power UI Test ===');
  
  // Test button visibility and styling
  const powerButton = document.querySelector('button[title*="Ray Power Control"]');
  if (powerButton) {
    console.log('✅ Power button visible');
    console.log('Button size:', powerButton.style.width, 'x', powerButton.style.height);
    console.log('Button position:', powerButton.style.top, powerButton.style.right);
  }
  
  // Test power indicator
  const powerIndicator = document.querySelector('div');
  const indicators = Array.from(document.querySelectorAll('div')).filter(div => 
    div.textContent.includes('RAY OFFLINE') || div.textContent.includes('RAY ONLINE')
  );
  
  if (indicators.length > 0) {
    console.log('✅ Power indicator found');
    console.log('Indicator text:', indicators[0].textContent);
  } else {
    console.warn('⚠️ Power indicator not found');
  }
}

// Run all tests
function runAllPowerTests() {
  console.log('⚡ === Ray Power Control Test Suite ===');
  
  testPowerControlSystem();
  testPowerSecurity();
  testPowerUI();
  
  console.log('\n⚡ === Manual Tests Available ===');
  console.log('Run testPowerToggle() to test power on/off');
  console.log('Run testDisabledFunctions() to test disabled state');
  console.log('Run testEnabledFunctions() to test enabled state');
  console.log('Or click the ⚡ button in the top-right corner');
}

// Auto-run basic tests
runAllPowerTests();

// Expose test functions globally
window.testPowerControlSystem = testPowerControlSystem;
window.testPowerToggle = testPowerToggle;
window.testDisabledFunctions = testDisabledFunctions;
window.testEnabledFunctions = testEnabledFunctions;
window.testPowerSecurity = testPowerSecurity;
window.testPowerUI = testPowerUI;
window.runAllPowerTests = runAllPowerTests;