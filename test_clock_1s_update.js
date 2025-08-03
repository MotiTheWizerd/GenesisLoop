// Test Clock 1 Second Update
// Verify the clock display updates every second

console.log('🕐 Testing Clock 1 Second Update...');

function testClockUpdateRate() {
  console.log('\n=== Clock Update Rate Test ===');
  
  const clockElement = document.getElementById('ray-clock-display');
  if (!clockElement) {
    console.error('❌ Clock display element not found');
    return;
  }
  
  console.log('🕐 Monitoring clock updates for 5 seconds...');
  
  let updateCount = 0;
  let lastContent = clockElement.textContent;
  
  const monitor = setInterval(() => {
    const currentContent = clockElement.textContent;
    
    if (currentContent !== lastContent) {
      updateCount++;
      console.log(`✅ Update ${updateCount}: ${currentContent.split('\n')[0]}`);
      lastContent = currentContent;
    }
  }, 100); // Check every 100ms for changes
  
  // Stop monitoring after 5 seconds
  setTimeout(() => {
    clearInterval(monitor);
    
    console.log(`📊 Results: ${updateCount} updates in 5 seconds`);
    
    if (updateCount >= 4 && updateCount <= 6) {
      console.log('✅ Clock is updating approximately every second (perfect!)');
    } else if (updateCount > 0) {
      console.log('⚠️ Clock is updating but not exactly every second');
    } else {
      console.error('❌ Clock is not updating');
    }
  }, 5000);
}

function testClockFormats() {
  console.log('\n=== Clock Format Update Test ===');
  
  const clockElement = document.getElementById('ray-clock-display');
  if (!clockElement) {
    console.error('❌ Clock display element not found');
    return;
  }
  
  console.log('🔄 Testing that all formats update every second...');
  
  const formats = ['time', 'iso', 'unix', 'detailed'];
  let formatIndex = 0;
  
  const formatTest = setInterval(() => {
    if (formatIndex >= formats.length) {
      clearInterval(formatTest);
      console.log('✅ All format update tests completed');
      return;
    }
    
    console.log(`🕐 Testing ${formats[formatIndex]} format updates...`);
    
    // Click to change format
    clockElement.click();
    
    // Monitor this format for 3 seconds
    let updates = 0;
    let lastTime = clockElement.textContent;
    
    const formatMonitor = setInterval(() => {
      const currentTime = clockElement.textContent;
      if (currentTime !== lastTime) {
        updates++;
        lastTime = currentTime;
      }
    }, 100);
    
    setTimeout(() => {
      clearInterval(formatMonitor);
      console.log(`  ${formats[formatIndex]} format: ${updates} updates in 3 seconds`);
      
      if (updates >= 2) {
        console.log(`  ✅ ${formats[formatIndex]} format updates properly`);
      } else {
        console.warn(`  ⚠️ ${formats[formatIndex]} format may not be updating`);
      }
      
      formatIndex++;
    }, 3000);
    
  }, 4000); // Test each format for 4 seconds
}

function testHeartbeatSync() {
  console.log('\n=== Heartbeat Sync Test ===');
  
  if (!window.RayTemporal) {
    console.warn('⚠️ RayTemporal not available for sync test');
    return;
  }
  
  console.log('💓 Testing if clock display syncs with Ray\'s heartbeat...');
  
  const initialTick = window.RayTemporal.tick;
  const clockElement = document.getElementById('ray-clock-display');
  
  if (!clockElement) {
    console.error('❌ Clock display element not found');
    return;
  }
  
  let clockUpdates = 0;
  let lastClockContent = clockElement.textContent;
  
  const syncMonitor = setInterval(() => {
    const currentClockContent = clockElement.textContent;
    if (currentClockContent !== lastClockContent) {
      clockUpdates++;
      lastClockContent = currentClockContent;
    }
  }, 100);
  
  setTimeout(() => {
    clearInterval(syncMonitor);
    
    const finalTick = window.RayTemporal.tick;
    const heartbeats = finalTick - initialTick;
    
    console.log(`💓 Ray's heartbeats in 5 seconds: ${heartbeats}`);
    console.log(`🕐 Clock updates in 5 seconds: ${clockUpdates}`);
    
    if (Math.abs(heartbeats - clockUpdates) <= 1) {
      console.log('✅ Clock display is perfectly synced with Ray\'s heartbeat');
    } else {
      console.log('⚠️ Clock display and heartbeat are not perfectly synced (but both are working)');
    }
  }, 5000);
}

function testVisualTicking() {
  console.log('\n=== Visual Ticking Test ===');
  
  const clockElement = document.getElementById('ray-clock-display');
  if (!clockElement) {
    console.error('❌ Clock display element not found');
    return;
  }
  
  console.log('👁️ Watch the clock for subtle tick animations...');
  console.log('🔍 The clock should have a slight scale animation every second');
  
  // Monitor transform changes
  let animationCount = 0;
  const originalTransform = clockElement.style.transform;
  
  const animationMonitor = setInterval(() => {
    const currentTransform = clockElement.style.transform;
    if (currentTransform !== originalTransform && currentTransform.includes('scale(1.01)')) {
      animationCount++;
      console.log(`✨ Tick animation ${animationCount} detected`);
    }
  }, 50);
  
  setTimeout(() => {
    clearInterval(animationMonitor);
    
    if (animationCount >= 3) {
      console.log('✅ Visual tick animations are working');
    } else {
      console.log('⚠️ Visual tick animations may not be visible');
    }
  }, 5000);
}

// Run all tests
function runAllClockUpdateTests() {
  console.log('🕐 === Clock 1 Second Update Test Suite ===');
  
  testClockUpdateRate();
  
  setTimeout(() => {
    testHeartbeatSync();
  }, 6000);
  
  setTimeout(() => {
    testVisualTicking();
  }, 12000);
  
  console.log('\n🕐 === Manual Tests Available ===');
  console.log('Run testClockFormats() to test all format updates');
  console.log('Watch the clock display - it should update every second');
  console.log('Look for subtle scale animation on each tick');
}

// Auto-run tests
runAllClockUpdateTests();

// Expose test functions
window.testClockUpdateRate = testClockUpdateRate;
window.testClockFormats = testClockFormats;
window.testHeartbeatSync = testHeartbeatSync;
window.testVisualTicking = testVisualTicking;
window.runAllClockUpdateTests = runAllClockUpdateTests;