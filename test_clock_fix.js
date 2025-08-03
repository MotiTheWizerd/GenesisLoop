// Quick Clock Fix Test
// Test that the clock monitor error is resolved

console.log('🕐 Testing Clock Fix...');

function testBrowserClockMethods() {
  console.log('\n=== BrowserClock Methods Test ===');
  
  if (window.BrowserClock) {
    console.log('✅ BrowserClock is available');
    
    // Test available methods
    const methods = [
      'getCurrentTime',
      'getCurrentUnixTime', 
      'getCurrentTimeDetailed',
      'getTimestamp', // This one doesn't exist
      'isRunning',
      'init',
      'startClock',
      'stopClock'
    ];
    
    methods.forEach(method => {
      if (typeof window.BrowserClock[method] === 'function') {
        console.log(`✅ ${method}() is available`);
        
        // Test the method if it's safe to call
        if (['getCurrentTime', 'getCurrentUnixTime', 'getCurrentTimeDetailed'].includes(method)) {
          try {
            const result = window.BrowserClock[method]();
            console.log(`  → ${method}() = ${result}`);
          } catch (error) {
            console.error(`  → ${method}() error:`, error.message);
          }
        }
      } else {
        console.warn(`❌ ${method}() is NOT available`);
      }
    });
    
  } else {
    console.error('❌ BrowserClock is not available');
  }
}

function testRayClockInterface() {
  console.log('\n=== RayClock Interface Test ===');
  
  if (window.RayClock) {
    console.log('✅ RayClock interface is available');
    
    const methods = ['getCurrentTime', 'getISOTime', 'getTimestamp', 'checkAccess', 'isRunning'];
    
    methods.forEach(method => {
      try {
        const result = window.RayClock[method]();
        console.log(`✅ RayClock.${method}() = ${result}`);
      } catch (error) {
        console.error(`❌ RayClock.${method}() error:`, error.message);
      }
    });
    
  } else {
    console.error('❌ RayClock interface is not available');
  }
}

function testClockMonitorHealth() {
  console.log('\n=== Clock Monitor Health Test ===');
  
  if (window.ClockMonitor) {
    console.log('✅ ClockMonitor is available');
    
    try {
      const status = window.ClockMonitor.status();
      console.log('📊 Monitor Status:', status);
      
      if (status.monitoring) {
        console.log('✅ Clock monitoring is active');
      } else {
        console.warn('⚠️ Clock monitoring is not active');
      }
      
      if (status.failures > 0) {
        console.warn(`⚠️ Clock has ${status.failures} recent failures`);
      } else {
        console.log('✅ No recent clock failures');
      }
      
    } catch (error) {
      console.error('❌ Clock monitor status error:', error);
    }
    
  } else {
    console.error('❌ ClockMonitor is not available');
  }
}

function testClockContinuity() {
  console.log('\n=== Clock Continuity Test ===');
  
  console.log('🕐 Testing clock over 3 seconds...');
  
  const startTime = Date.now();
  let rayTime1, rayTime2;
  
  // Test RayClock continuity
  if (window.RayClock) {
    try {
      rayTime1 = window.RayClock.getTimestamp();
      console.log(`🕐 Initial RayClock time: ${rayTime1}`);
      
      setTimeout(() => {
        try {
          rayTime2 = window.RayClock.getTimestamp();
          console.log(`🕐 Final RayClock time: ${rayTime2}`);
          
          if (rayTime2 > rayTime1) {
            const diff = rayTime2 - rayTime1;
            console.log(`✅ RayClock is ticking (advanced ${diff}ms)`);
          } else {
            console.error('❌ RayClock appears frozen');
          }
          
        } catch (error) {
          console.error('❌ RayClock final test error:', error);
        }
      }, 3000);
      
    } catch (error) {
      console.error('❌ RayClock initial test error:', error);
    }
  }
  
  // Test BrowserClock continuity
  if (window.BrowserClock) {
    try {
      const browserTime1 = window.BrowserClock.getCurrentTime();
      console.log(`🕐 Initial BrowserClock time: ${browserTime1}`);
      
      setTimeout(() => {
        try {
          const browserTime2 = window.BrowserClock.getCurrentTime();
          console.log(`🕐 Final BrowserClock time: ${browserTime2}`);
          
          if (browserTime2 !== browserTime1) {
            console.log('✅ BrowserClock is ticking');
          } else {
            console.error('❌ BrowserClock appears frozen');
          }
          
        } catch (error) {
          console.error('❌ BrowserClock final test error:', error);
        }
      }, 3000);
      
    } catch (error) {
      console.error('❌ BrowserClock initial test error:', error);
    }
  }
}

// Run all tests
function runClockFixTests() {
  console.log('🕐 === Clock Fix Test Suite ===');
  
  testBrowserClockMethods();
  testRayClockInterface();
  testClockMonitorHealth();
  testClockContinuity();
  
  console.log('\n🕐 Clock fix tests completed');
  console.log('Check console for any remaining errors');
}

// Auto-run tests
runClockFixTests();

// Expose functions
window.testBrowserClockMethods = testBrowserClockMethods;
window.testRayClockInterface = testRayClockInterface;
window.testClockMonitorHealth = testClockMonitorHealth;
window.testClockContinuity = testClockContinuity;
window.runClockFixTests = runClockFixTests;