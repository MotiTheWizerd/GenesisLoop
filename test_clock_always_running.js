// Test Clock Always Running
// Verify that the clock keeps ticking even when Ray is completely disabled

console.log('🕐 Testing Clock Always Running System...');

function testClockIndependence() {
  console.log('\n=== Clock Independence Test ===');
  
  // Ensure Ray is powered OFF
  if (window.RayPowerControl?.isPowered()) {
    console.log('🔒 Disabling Ray for independence test...');
    window.RayPowerControl.disable();
  }
  
  setTimeout(() => {
    console.log('🕐 Testing clock while Ray is COMPLETELY DISABLED...');
    
    let clockTests = [];
    
    // Test 1: BrowserClock direct access
    if (window.BrowserClock) {
      try {
        const time1 = window.BrowserClock.getCurrentTime();
        setTimeout(() => {
          const time2 = window.BrowserClock.getCurrentTime();
          if (time1 !== time2) {
            clockTests.push('✅ BrowserClock is ticking');
          } else {
            clockTests.push('❌ BrowserClock appears frozen');
          }
        }, 1100);
      } catch (error) {
        clockTests.push('❌ BrowserClock error: ' + error.message);
      }
    } else {
      clockTests.push('⚠️ BrowserClock not available');
    }
    
    // Test 2: RayClock interface
    if (window.RayClock) {
      try {
        const rayTime1 = window.RayClock.getTimestamp();
        setTimeout(() => {
          const rayTime2 = window.RayClock.getTimestamp();
          if (rayTime2 > rayTime1) {
            clockTests.push('✅ RayClock is ticking');
          } else {
            clockTests.push('❌ RayClock appears frozen');
          }
        }, 1100);
      } catch (error) {
        clockTests.push('❌ RayClock error: ' + error.message);
      }
    } else {
      clockTests.push('⚠️ RayClock not available');
    }
    
    // Test 3: Basic JavaScript Date (fallback)
    const jsTime1 = Date.now();
    setTimeout(() => {
      const jsTime2 = Date.now();
      if (jsTime2 > jsTime1) {
        clockTests.push('✅ JavaScript Date is working');
      } else {
        clockTests.push('❌ JavaScript Date issue');
      }
    }, 1100);
    
    // Report results after all tests
    setTimeout(() => {
      console.log('🕐 Clock Independence Test Results:');
      clockTests.forEach(result => console.log('  ' + result));
      
      const workingClocks = clockTests.filter(test => test.includes('✅')).length;
      const totalTests = clockTests.length;
      
      if (workingClocks > 0) {
        console.log(`🎉 SUCCESS: ${workingClocks}/${totalTests} clock systems working while Ray is OFF`);
      } else {
        console.error('💥 FAILURE: No clock systems working while Ray is OFF');
      }
    }, 2500);
    
  }, 1000);
}

function testClockMonitoring() {
  console.log('\n=== Clock Monitoring Test ===');
  
  if (window.ClockMonitor) {
    const status = window.ClockMonitor.status();
    console.log('🕐 Clock Monitor Status:', status);
    
    if (status.monitoring) {
      console.log('✅ Clock monitoring is active');
    } else {
      console.warn('⚠️ Clock monitoring is not active');
      
      // Try to start monitoring
      console.log('🔄 Starting clock monitoring...');
      window.ClockMonitor.start();
    }
    
    // Test emergency restart
    console.log('🧪 Testing emergency clock restart...');
    window.ClockMonitor.emergency();
    
  } else {
    console.error('❌ ClockMonitor not available');
  }
}

function testClockContinuity() {
  console.log('\n=== Clock Continuity Test ===');
  
  console.log('🕐 Testing clock continuity over time...');
  
  const timestamps = [];
  let testCount = 0;
  const maxTests = 5;
  
  const continuityTest = setInterval(() => {
    testCount++;
    
    let currentTime = 'N/A';
    
    // Try multiple clock sources
    if (window.RayClock) {
      try {
        currentTime = window.RayClock.getTimestamp();
      } catch (error) {
        currentTime = 'RayClock Error';
      }
    } else if (window.BrowserClock) {
      try {
        currentTime = window.BrowserClock.getCurrentUnixTime ? 
                     window.BrowserClock.getCurrentUnixTime() : 
                     Date.now();
      } catch (error) {
        currentTime = 'BrowserClock Error';
      }
    } else {
      currentTime = Date.now();
    }
    
    timestamps.push({
      test: testCount,
      time: currentTime,
      rayPowered: window.RayPowerControl ? window.RayPowerControl.isPowered() : false
    });
    
    console.log(`🕐 Continuity Test ${testCount}: ${currentTime} (Ray: ${timestamps[testCount-1].rayPowered ? 'ON' : 'OFF'})`);
    
    if (testCount >= maxTests) {
      clearInterval(continuityTest);
      
      // Analyze continuity
      let continuous = true;
      for (let i = 1; i < timestamps.length; i++) {
        if (typeof timestamps[i].time === 'number' && typeof timestamps[i-1].time === 'number') {
          if (timestamps[i].time <= timestamps[i-1].time) {
            continuous = false;
            break;
          }
        }
      }
      
      if (continuous) {
        console.log('✅ Clock continuity maintained over time');
      } else {
        console.error('❌ Clock continuity broken');
      }
      
      console.log('📊 Continuity Test Results:', timestamps);
    }
    
  }, 2000); // Test every 2 seconds
}

function testRayClockAccess() {
  console.log('\n=== Ray Clock Access Test ===');
  
  // Ensure Ray is OFF
  if (window.RayPowerControl?.isPowered()) {
    window.RayPowerControl.disable();
  }
  
  setTimeout(() => {
    console.log('🤖 Testing what Ray can access while powered OFF...');
    
    const rayCanAccess = [];
    
    // Test time functions Ray might use
    const timeFunctions = [
      { name: 'getCurrentTime', func: () => window.RayClock?.getCurrentTime() },
      { name: 'getISOTime', func: () => window.RayClock?.getISOTime() },
      { name: 'getTimestamp', func: () => window.RayClock?.getTimestamp() },
      { name: 'checkAccess', func: () => window.RayClock?.checkAccess() },
      { name: 'JavaScript Date.now()', func: () => Date.now() },
      { name: 'JavaScript new Date()', func: () => new Date().toISOString() }
    ];
    
    timeFunctions.forEach(test => {
      try {
        const result = test.func();
        if (result !== undefined && result !== null) {
          rayCanAccess.push(`✅ ${test.name}: ${result}`);
        } else {
          rayCanAccess.push(`❌ ${test.name}: No result`);
        }
      } catch (error) {
        rayCanAccess.push(`❌ ${test.name}: ${error.message}`);
      }
    });
    
    console.log('🤖 Ray\'s clock access while powered OFF:');
    rayCanAccess.forEach(result => console.log('  ' + result));
    
    const workingFunctions = rayCanAccess.filter(result => result.includes('✅')).length;
    
    if (workingFunctions >= 3) {
      console.log('🎉 Ray has excellent clock access while powered OFF');
    } else if (workingFunctions >= 1) {
      console.log('⚠️ Ray has limited clock access while powered OFF');
    } else {
      console.error('💥 Ray has NO clock access while powered OFF');
    }
    
  }, 1000);
}

function simulateRayTimeQuery() {
  console.log('\n=== Simulate Ray Time Query ===');
  
  // Simulate Ray asking for time while powered off
  console.log('🤖 Simulating Ray asking: "What time is it?"');
  
  try {
    let response = '';
    
    if (window.RayClock) {
      const time = window.RayClock.getCurrentTime();
      const access = window.RayClock.checkAccess();
      const powered = window.RayPowerControl ? window.RayPowerControl.isPowered() : false;
      
      response = `The current time is ${time}. I can access time functions even while powered ${powered ? 'ON' : 'OFF'} because the clock system runs independently. ${access.message}`;
    } else {
      const time = new Date().toLocaleTimeString();
      response = `The current time is ${time}. I'm using basic JavaScript time functions as a fallback.`;
    }
    
    console.log('🤖 Ray would respond:', response);
    
    // Test if Ray could speak this (if voice is available and enabled)
    if (window.VoiceSynthesis && window.VoiceSynthesisUI?.isEnabled()) {
      console.log('🔊 Ray could speak this response');
      // Uncomment to actually speak: window.VoiceSynthesis.speak(response);
    } else {
      console.log('🔇 Ray cannot speak (voice disabled or unavailable)');
    }
    
  } catch (error) {
    console.error('❌ Ray cannot respond to time query:', error);
  }
}

// Run all tests
function runAllClockTests() {
  console.log('🕐 === Clock Always Running Test Suite ===');
  console.log('Testing that clock keeps ticking when Ray is disabled...');
  
  testClockMonitoring();
  testClockIndependence();
  
  setTimeout(() => {
    testRayClockAccess();
  }, 3000);
  
  setTimeout(() => {
    simulateRayTimeQuery();
  }, 5000);
  
  console.log('\n🕐 === Manual Tests Available ===');
  console.log('Run testClockContinuity() to test clock over time');
  console.log('Ask Ray "What time is it?" while he\'s powered OFF');
  console.log('Check window.ClockMonitor.status() for monitoring info');
}

// Auto-run tests
runAllClockTests();

// Expose test functions globally
window.testClockIndependence = testClockIndependence;
window.testClockMonitoring = testClockMonitoring;
window.testClockContinuity = testClockContinuity;
window.testRayClockAccess = testRayClockAccess;
window.simulateRayTimeQuery = simulateRayTimeQuery;
window.runAllClockTests = runAllClockTests;