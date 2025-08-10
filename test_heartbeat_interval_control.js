// Test script for heartbeat interval control
console.log('🧪 Testing heartbeat interval control...');

// Test 1: Check if MessageLoop has the new methods
if (typeof window.MessageLoop !== 'undefined') {
  console.log('✅ MessageLoop is available');
  
  // Test getInterval method
  if (typeof window.MessageLoop.getInterval === 'function') {
    const currentInterval = window.MessageLoop.getInterval();
    console.log(`✅ Current interval: ${currentInterval}ms (${currentInterval/1000}s)`);
  } else {
    console.log('❌ MessageLoop.getInterval method not found');
  }
  
  // Test setInterval method
  if (typeof window.MessageLoop.setInterval === 'function') {
    console.log('✅ MessageLoop.setInterval method available');
    
    // Test setting a new interval
    const testInterval = 45; // 45 seconds
    const success = window.MessageLoop.setInterval(testInterval);
    console.log(`${success ? '✅' : '❌'} Setting interval to ${testInterval}s: ${success}`);
    
    // Verify the change
    const newInterval = window.MessageLoop.getInterval();
    console.log(`✅ New interval: ${newInterval}ms (${newInterval/1000}s)`);
  } else {
    console.log('❌ MessageLoop.setInterval method not found');
  }
  
  // Test getStatus method
  if (typeof window.MessageLoop.getStatus === 'function') {
    const status = window.MessageLoop.getStatus();
    console.log('✅ MessageLoop status:', status);
  } else {
    console.log('❌ MessageLoop.getStatus method not found');
  }
  
} else {
  console.log('❌ MessageLoop not available');
}

// Test 2: Check if RaySettings has messageLoop configuration
if (typeof window.RaySettings !== 'undefined') {
  console.log('✅ RaySettings is available');
  
  const messageLoopInterval = window.RaySettings.get('messageLoop.interval');
  const messageLoopMinInterval = window.RaySettings.get('messageLoop.minInterval');
  const messageLoopMaxInterval = window.RaySettings.get('messageLoop.maxInterval');
  
  console.log(`✅ MessageLoop settings:
    - interval: ${messageLoopInterval}s
    - minInterval: ${messageLoopMinInterval}s
    - maxInterval: ${messageLoopMaxInterval}s`);
} else {
  console.log('❌ RaySettings not available');
}

// Test 3: Simulate popup message handling
console.log('🧪 Testing popup message simulation...');

// Simulate the popup sending a setHeartbeatInterval message
const testMessage = {
  action: 'setHeartbeatInterval',
  interval: 60 // 60 seconds
};

console.log('📤 Simulating popup message:', testMessage);

// This would normally be handled by chrome.runtime.onMessage
// Let's test the logic directly
if (window.MessageLoop && typeof window.MessageLoop.setInterval === 'function') {
  const success = window.MessageLoop.setInterval(testMessage.interval);
  console.log(`${success ? '✅' : '❌'} Popup message simulation result: ${success}`);
  
  // Check the new status
  if (typeof window.MessageLoop.getStatus === 'function') {
    const status = window.MessageLoop.getStatus();
    console.log('📊 Updated status:', status);
  }
} else {
  console.log('❌ Cannot simulate popup message - MessageLoop methods not available');
}

console.log('🏁 Heartbeat interval control test completed');