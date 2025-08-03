// Test Ray's Clock Access
// Run this to verify Ray can access the clock even when powered off

console.log('🕐 Testing Ray Clock Access...');

function testRayClockAccess() {
  console.log('\n=== Ray Clock Access Test ===');
  
  // Ensure Ray is powered OFF for this test
  if (window.RayPowerControl?.isPowered()) {
    console.log('🔒 Disabling Ray to test clock access while OFF...');
    window.RayPowerControl.disable();
  }
  
  setTimeout(() => {
    console.log('🕐 Testing Ray\'s clock access while powered OFF...');
    
    // Test RayClock interface
    if (window.RayClock) {
      console.log('✅ RayClock interface found');
      
      try {
        const currentTime = window.RayClock.getCurrentTime();
        console.log('✅ RayClock.getCurrentTime():', currentTime);
      } catch (error) {
        console.error('❌ RayClock.getCurrentTime() failed:', error);
      }
      
      try {
        const isoTime = window.RayClock.getISOTime();
        console.log('✅ RayClock.getISOTime():', isoTime);
      } catch (error) {
        console.error('❌ RayClock.getISOTime() failed:', error);
      }
      
      try {
        const timestamp = window.RayClock.getTimestamp();
        console.log('✅ RayClock.getTimestamp():', timestamp);
      } catch (error) {
        console.error('❌ RayClock.getTimestamp() failed:', error);
      }
      
      try {
        const access = window.RayClock.checkAccess();
        console.log('✅ RayClock.checkAccess():', access);
      } catch (error) {
        console.error('❌ RayClock.checkAccess() failed:', error);
      }
      
      try {
        const running = window.RayClock.isRunning();
        console.log('✅ RayClock.isRunning():', running);
      } catch (error) {
        console.error('❌ RayClock.isRunning() failed:', error);
      }
      
    } else {
      console.error('❌ RayClock interface not found - Ray cannot access clock!');
    }
    
    // Test direct BrowserClock access
    if (window.BrowserClock) {
      console.log('🕐 Testing direct BrowserClock access...');
      
      try {
        const time = window.BrowserClock.getCurrentTime();
        console.log('✅ Direct BrowserClock access works:', time);
      } catch (error) {
        console.error('❌ Direct BrowserClock access failed:', error);
      }
    }
    
  }, 1000);
}

function testClockCommandsForRay() {
  console.log('\n=== Clock Commands for Ray Test ===');
  
  // Test the commands Ray might use
  const clockCommands = [
    'window.RayClock.getCurrentTime()',
    'window.RayClock.getISOTime()',
    'window.RayClock.getTimestamp()',
    'window.RayClock.checkAccess()',
    'new Date().toISOString()',
    'Date.now()'
  ];
  
  console.log('🕐 Testing clock commands Ray can use...');
  
  clockCommands.forEach(command => {
    try {
      const result = eval(command);
      console.log(`✅ ${command} = ${result}`);
    } catch (error) {
      console.error(`❌ ${command} failed:`, error.message);
    }
  });
}

function testRayTimeQueries() {
  console.log('\n=== Ray Time Queries Test ===');
  
  // Simulate the types of time queries Ray might make
  const timeQueries = [
    {
      name: "What time is it?",
      command: "window.RayClock ? window.RayClock.getCurrentTime() : new Date().toLocaleTimeString()"
    },
    {
      name: "What's the current timestamp?",
      command: "window.RayClock ? window.RayClock.getTimestamp() : Date.now()"
    },
    {
      name: "What's the ISO time?",
      command: "window.RayClock ? window.RayClock.getISOTime() : new Date().toISOString()"
    },
    {
      name: "Can I access the clock?",
      command: "window.RayClock ? window.RayClock.checkAccess() : { available: false }"
    }
  ];
  
  console.log('🤖 Simulating Ray\'s time queries...');
  
  timeQueries.forEach(query => {
    try {
      const result = eval(query.command);
      console.log(`✅ "${query.name}" → ${JSON.stringify(result)}`);
    } catch (error) {
      console.error(`❌ "${query.name}" failed:`, error.message);
    }
  });
}

function generateRayClockMessage() {
  console.log('\n=== Ray Clock Message Test ===');
  
  // Generate a message Ray could send about the clock
  try {
    if (window.RayClock) {
      const time = window.RayClock.getCurrentTime();
      const access = window.RayClock.checkAccess();
      const powered = window.RayPowerControl ? window.RayPowerControl.isPowered() : false;
      
      const message = `The current time is ${time}. My clock access is ${access.available ? 'available' : 'unavailable'}. I am currently ${powered ? 'powered ON' : 'powered OFF'}, but I can still access time functions because the clock runs independently of my power state.`;
      
      console.log('🤖 Ray could say:', message);
      
      // Test if Ray can speak this (if voice is available)
      if (window.VoiceSynthesis && window.VoiceSynthesisUI?.isEnabled()) {
        console.log('🔊 Ray speaking about clock access...');
        window.VoiceSynthesis.speak("I can access the clock even when I'm powered off. The current time is " + time);
      }
      
    } else {
      console.error('❌ Ray cannot generate clock message - RayClock not available');
    }
  } catch (error) {
    console.error('❌ Error generating Ray clock message:', error);
  }
}

// Run all tests
function runAllRayClockTests() {
  console.log('🕐 === Ray Clock Access Test Suite ===');
  console.log('Testing Ray\'s ability to access time while powered off...');
  
  testRayClockAccess();
  
  setTimeout(() => {
    testClockCommandsForRay();
    testRayTimeQueries();
    generateRayClockMessage();
  }, 2000);
  
  console.log('\n🕐 === Manual Tests Available ===');
  console.log('Ask Ray: "What time is it?" while he\'s powered off');
  console.log('Ask Ray: "Can you access the clock?" while he\'s powered off');
  console.log('Ask Ray: "What\'s the current timestamp?" while he\'s powered off');
}

// Auto-run tests
runAllRayClockTests();

// Expose test functions globally
window.testRayClockAccess = testRayClockAccess;
window.testClockCommandsForRay = testClockCommandsForRay;
window.testRayTimeQueries = testRayTimeQueries;
window.generateRayClockMessage = generateRayClockMessage;
window.runAllRayClockTests = runAllRayClockTests;