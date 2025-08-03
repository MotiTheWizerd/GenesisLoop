// Test Clock Security - Verify clock works while file operations are blocked
// Run this in the browser console on ChatGPT

console.log('🕐 Testing Clock Security System...');

function testClockWithPowerOff() {
  console.log('\n=== Clock Security Test (Power OFF) ===');
  
  // Ensure Ray is powered off
  if (window.RayPowerControl?.isPowered()) {
    console.log('🔒 Disabling Ray for security test...');
    window.RayPowerControl.disable();
  }
  
  setTimeout(() => {
    // Test that clock is still running
    if (window.BrowserClock) {
      console.log('🕐 Testing Browser Clock while Ray is OFF...');
      
      // Test clock functions
      try {
        const time = window.BrowserClock.getCurrentTime();
        console.log('✅ Clock getCurrentTime() works:', time);
      } catch (error) {
        console.error('❌ Clock getCurrentTime() failed:', error);
      }
      
      try {
        const iso = window.BrowserClock.getISOTime();
        console.log('✅ Clock getISOTime() works:', iso);
      } catch (error) {
        console.error('❌ Clock getISOTime() failed:', error);
      }
      
      try {
        const timestamp = window.BrowserClock.getTimestamp();
        console.log('✅ Clock getTimestamp() works:', timestamp);
      } catch (error) {
        console.error('❌ Clock getTimestamp() failed:', error);
      }
      
      // Check if clock is running
      if (window.BrowserClock.isRunning && window.BrowserClock.isRunning()) {
        console.log('✅ Clock is actively running while Ray is OFF');
      } else {
        console.warn('⚠️ Clock may not be running');
      }
      
    } else {
      console.error('❌ BrowserClock not available');
    }
  }, 1000);
}

function testFileOperationsBlocked() {
  console.log('\n=== File Operations Security Test ===');
  
  // Ensure Ray is powered off
  if (window.RayPowerControl?.isPowered()) {
    console.log('🔒 Disabling Ray for file security test...');
    window.RayPowerControl.disable();
  }
  
  setTimeout(() => {
    console.log('🚫 Testing that file operations are BLOCKED...');
    
    // Test common file operations that should be blocked
    const fileOps = [
      'writeFile', 'readFile', 'createFile', 'deleteFile', 
      'saveAs', 'download', 'upload'
    ];
    
    fileOps.forEach(operation => {
      if (window[operation] && typeof window[operation] === 'function') {
        try {
          console.log(`🧪 Testing ${operation}...`);
          window[operation]('test');
          console.warn(`⚠️ ${operation} was NOT blocked - security risk!`);
        } catch (error) {
          if (error.message.includes('Security') || error.message.includes('blocked')) {
            console.log(`✅ ${operation} correctly blocked:`, error.message);
          } else {
            console.log(`❓ ${operation} failed for other reason:`, error.message);
          }
        }
      }
    });
    
    // Test Chrome file system APIs if available
    if (window.chrome && window.chrome.fileSystem) {
      console.log('🧪 Testing Chrome file system APIs...');
      
      try {
        window.chrome.fileSystem.chooseEntry({}, () => {});
        console.warn('⚠️ Chrome fileSystem.chooseEntry was NOT blocked');
      } catch (error) {
        console.log('✅ Chrome fileSystem.chooseEntry blocked:', error.message);
      }
    }
    
  }, 1000);
}

function testClockWithPowerOn() {
  console.log('\n=== Clock Test (Power ON) ===');
  
  // Enable Ray
  if (!window.RayPowerControl?.isPowered()) {
    console.log('⚡ Enabling Ray for comparison test...');
    window.RayPowerControl.enable();
  }
  
  setTimeout(() => {
    // Test that clock still works when powered on
    if (window.BrowserClock) {
      console.log('🕐 Testing Browser Clock while Ray is ON...');
      
      try {
        const time = window.BrowserClock.getCurrentTime();
        console.log('✅ Clock works when Ray is ON:', time);
      } catch (error) {
        console.error('❌ Clock failed when Ray is ON:', error);
      }
    }
    
    // Test that file operations are now allowed (if any exist)
    console.log('📁 File operations should now be enabled...');
    
  }, 1000);
}

function testPowerSettings() {
  console.log('\n=== Power Settings Test ===');
  
  if (window.RayPowerControl) {
    const settings = window.RayPowerControl.getSettings();
    console.log('⚙️ Current power settings:', settings);
    
    // Check that clock is always enabled
    if (settings.browserClock === true) {
      console.log('✅ Browser Clock correctly set to always enabled');
    } else {
      console.warn('⚠️ Browser Clock not set to always enabled');
    }
    
    // Check that file operations are controlled
    if (settings.fileOperations !== undefined) {
      console.log(`📁 File Operations setting: ${settings.fileOperations}`);
    } else {
      console.warn('⚠️ File Operations setting not found');
    }
  }
}

function testClockVisibility() {
  console.log('\n=== Clock Visibility Test ===');
  
  // Check if clock element exists in DOM
  const clockElement = document.getElementById('ray-browser-clock');
  if (clockElement) {
    console.log('✅ Clock element found in DOM');
    console.log('Clock visibility:', clockElement.style.display);
    console.log('Clock content:', clockElement.textContent);
  } else {
    console.log('ℹ️ Clock element not visible (may be hidden by design)');
  }
  
  // Test clock functions directly
  if (window.BrowserClock) {
    console.log('🕐 Clock module available');
    console.log('Clock running:', window.BrowserClock.isRunning ? window.BrowserClock.isRunning() : 'unknown');
  }
}

function testSecurityBoundary() {
  console.log('\n=== Security Boundary Test ===');
  
  console.log('🔒 Testing security boundary between clock and file operations...');
  
  // Ensure Ray is off
  if (window.RayPowerControl?.isPowered()) {
    window.RayPowerControl.disable();
  }
  
  setTimeout(() => {
    let clockWorks = false;
    let filesBlocked = true;
    
    // Test clock
    try {
      if (window.BrowserClock) {
        window.BrowserClock.getCurrentTime();
        clockWorks = true;
      }
    } catch (error) {
      clockWorks = false;
    }
    
    // Test file operations
    try {
      if (window.writeFile) {
        window.writeFile('test');
        filesBlocked = false; // Should not reach here
      }
    } catch (error) {
      if (error.message.includes('Security') || error.message.includes('blocked')) {
        filesBlocked = true;
      }
    }
    
    console.log('📊 Security Boundary Results:');
    console.log(`  🕐 Clock works while Ray is OFF: ${clockWorks ? '✅ YES' : '❌ NO'}`);
    console.log(`  🚫 File operations blocked while Ray is OFF: ${filesBlocked ? '✅ YES' : '❌ NO'}`);
    
    if (clockWorks && filesBlocked) {
      console.log('🎉 PERFECT SECURITY: Clock runs, files blocked!');
    } else {
      console.warn('⚠️ Security boundary needs attention');
    }
    
  }, 1000);
}

// Run all tests
function runAllClockSecurityTests() {
  console.log('🕐 === Clock Security Test Suite ===');
  console.log('Testing that clock works while file operations are blocked...');
  
  testPowerSettings();
  testClockVisibility();
  testClockWithPowerOff();
  
  console.log('\n🕐 === Manual Tests Available ===');
  console.log('Run testFileOperationsBlocked() to test file security');
  console.log('Run testClockWithPowerOn() to test clock when Ray is enabled');
  console.log('Run testSecurityBoundary() to test the complete security boundary');
}

// Auto-run basic tests
runAllClockSecurityTests();

// Expose test functions globally
window.testClockWithPowerOff = testClockWithPowerOff;
window.testFileOperationsBlocked = testFileOperationsBlocked;
window.testClockWithPowerOn = testClockWithPowerOn;
window.testPowerSettings = testPowerSettings;
window.testClockVisibility = testClockVisibility;
window.testSecurityBoundary = testSecurityBoundary;
window.runAllClockSecurityTests = runAllClockSecurityTests;