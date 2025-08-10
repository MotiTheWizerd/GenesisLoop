// Test script for popup-to-content heartbeat communication
console.log('🧪 Testing popup-to-content heartbeat communication...');

// Simulate popup functions
function simulatePopupMessage(message, callback) {
  console.log('📤 [Popup Simulation] Sending message:', message);
  
  // Simulate the content script message handler
  try {
    let response = {};
    
    switch (message.action) {
      case "setHeartbeatInterval":
        if (window.MessageLoop) {
          const success = window.MessageLoop.setInterval(message.interval);
          response = {success: success};
        } else {
          response = {success: false, error: 'MessageLoop not available'};
        }
        break;

      case "getHeartbeatSettings":
        if (window.RaySettings) {
          const settings = {
            interval: window.RaySettings.get('messageLoop.interval') || 30
          };
          response = {settings: settings};
        } else {
          response = {settings: {interval: 30}};
        }
        break;

      case "getHeartbeatStatus":
        if (window.MessageLoop) {
          const status = window.MessageLoop.getStatus();
          response = {status: status};
        } else {
          response = {status: {running: false, interval: 'Unknown'}};
        }
        break;
        
      default:
        response = {success: false, error: 'Unknown action'};
    }
    
    console.log('📥 [Content Simulation] Response:', response);
    if (callback) callback(response);
    return response;
    
  } catch (error) {
    console.error('❌ [Content Simulation] Error:', error);
    const errorResponse = {success: false, error: error.message};
    if (callback) callback(errorResponse);
    return errorResponse;
  }
}

// Test 1: Get current heartbeat settings
console.log('\n🧪 Test 1: Get current heartbeat settings');
simulatePopupMessage({action: 'getHeartbeatSettings'}, (response) => {
  if (response.settings) {
    console.log(`✅ Current interval: ${response.settings.interval}s`);
  } else {
    console.log('❌ Failed to get settings:', response.error);
  }
});

// Test 2: Get current heartbeat status
console.log('\n🧪 Test 2: Get current heartbeat status');
simulatePopupMessage({action: 'getHeartbeatStatus'}, (response) => {
  if (response.status) {
    console.log('✅ Current status:', response.status);
  } else {
    console.log('❌ Failed to get status:', response.error);
  }
});

// Test 3: Set new heartbeat interval
console.log('\n🧪 Test 3: Set heartbeat interval to 15 seconds');
simulatePopupMessage({action: 'setHeartbeatInterval', interval: 15}, (response) => {
  if (response.success) {
    console.log('✅ Successfully set interval to 15s');
    
    // Verify the change
    simulatePopupMessage({action: 'getHeartbeatSettings'}, (verifyResponse) => {
      if (verifyResponse.settings) {
        console.log(`✅ Verified new interval: ${verifyResponse.settings.interval}s`);
      }
    });
  } else {
    console.log('❌ Failed to set interval:', response.error);
  }
});

// Test 4: Test invalid interval
console.log('\n🧪 Test 4: Test invalid interval (500 seconds - should fail)');
simulatePopupMessage({action: 'setHeartbeatInterval', interval: 500}, (response) => {
  if (response.success) {
    console.log('❌ Unexpectedly succeeded with invalid interval');
  } else {
    console.log('✅ Correctly rejected invalid interval:', response.error);
  }
});

// Test 5: Test preset values
console.log('\n🧪 Test 5: Test preset values');
const presets = [5, 30, 60];
presets.forEach((preset, index) => {
  console.log(`\n🧪 Test 5.${index + 1}: Set preset ${preset}s`);
  simulatePopupMessage({action: 'setHeartbeatInterval', interval: preset}, (response) => {
    if (response.success) {
      console.log(`✅ Successfully set preset ${preset}s`);
    } else {
      console.log(`❌ Failed to set preset ${preset}s:`, response.error);
    }
  });
});

// Test 6: Final status check
console.log('\n🧪 Test 6: Final status check');
setTimeout(() => {
  simulatePopupMessage({action: 'getHeartbeatStatus'}, (response) => {
    if (response.status) {
      console.log('✅ Final status:', response.status);
    } else {
      console.log('❌ Failed to get final status:', response.error);
    }
    console.log('\n🏁 Popup-to-content communication test completed');
  });
}, 100);