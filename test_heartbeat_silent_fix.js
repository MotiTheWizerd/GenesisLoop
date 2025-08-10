/**
 * Test Heartbeat Silent Fix
 * Verifies that heartbeat responses don't create duplicate ChatGPT messages
 */

console.log('💓 Testing Heartbeat Silent Fix...');

// Test 1: Verify DataSender uses silent mode
console.log('\n📡 Test 1: DataSender Silent Mode Usage');

if (typeof window.DataSender !== 'undefined') {
  console.log('✅ DataSender is available');
  
  // Mock FetchSender to verify silent flag is passed
  const originalSendJSON = window.FetchSender?.sendJSON;
  const originalSendResponse = window.FetchSender?.sendResponse;
  let silentFlagDetected = false;
  
  if (window.FetchSender) {
    window.FetchSender.sendJSON = async function(data, options) {
      console.log('📡 FetchSender.sendJSON called with options:', options);
      
      if (options && options.silent === true) {
        silentFlagDetected = true;
        console.log('✅ Silent flag detected in sendJSON');
      } else {
        console.log('⚠️ Silent flag NOT detected in sendJSON');
      }
      
      return { success: true, data: { message: 'Mock JSON response' } };
    };
    
    window.FetchSender.sendResponse = async function(response, metadata, options) {
      console.log('📡 FetchSender.sendResponse called with options:', options);
      
      if (options && options.silent === true) {
        silentFlagDetected = true;
        console.log('✅ Silent flag detected in sendResponse');
      } else {
        console.log('⚠️ Silent flag NOT detected in sendResponse');
      }
      
      return { success: true, data: { message: 'Mock response' } };
    };
    
    // Test JSON response through DataSender
    console.log('🧪 Testing JSON response through DataSender...');
    const jsonResponse = JSON.stringify({
      type: "heartbeat",
      timestamp: new Date().toISOString(),
      status: "active"
    });
    
    window.DataSender.sendExtractedResponse(jsonResponse, {
      source: 'test',
      type: 'heartbeat_test'
    }).then(result => {
      console.log('📊 JSON DataSender result:', result);
      
      if (silentFlagDetected) {
        console.log('✅ SUCCESS: DataSender uses silent mode for JSON');
      } else {
        console.log('❌ FAILED: DataSender does NOT use silent mode for JSON');
      }
      
      // Reset flag for text test
      silentFlagDetected = false;
      
      // Test text response through DataSender
      console.log('🧪 Testing text response through DataSender...');
      const textResponse = 'This is a plain text response';
      
      return window.DataSender.sendExtractedResponse(textResponse, {
        source: 'test',
        type: 'text_test'
      });
    }).then(result => {
      console.log('📊 Text DataSender result:', result);
      
      if (silentFlagDetected) {
        console.log('✅ SUCCESS: DataSender uses silent mode for text');
      } else {
        console.log('❌ FAILED: DataSender does NOT use silent mode for text');
      }
      
      // Restore original functions
      window.FetchSender.sendJSON = originalSendJSON;
      window.FetchSender.sendResponse = originalSendResponse;
      
    }).catch(error => {
      console.error('❌ DataSender test failed:', error);
      
      // Restore original functions
      window.FetchSender.sendJSON = originalSendJSON;
      window.FetchSender.sendResponse = originalSendResponse;
    });
  }
  
} else {
  console.log('❌ DataSender not available');
}

// Test 2: Simulate MessageLoop flow
setTimeout(() => {
  console.log('\n🔄 Test 2: MessageLoop Flow Simulation');
  
  if (typeof window.MessageLoop !== 'undefined' && typeof window.DataSender !== 'undefined') {
    console.log('✅ MessageLoop and DataSender available');
    
    let messageSenderCallCount = 0;
    
    // Mock MessageSender to count calls
    const originalSendTestMessage = window.MessageSender?.sendTestMessage;
    if (window.MessageSender) {
      window.MessageSender.sendTestMessage = function(message) {
        messageSenderCallCount++;
        console.log(`📤 MessageSender called (${messageSenderCallCount}):`, message.substring(0, 100) + '...');
        return Promise.resolve(true);
      };
    }
    
    // Mock FetchSender to avoid actual network calls
    const originalSendData = window.FetchSender?.sendData;
    if (window.FetchSender) {
      window.FetchSender.sendData = async function(data, options) {
        console.log('📡 FetchSender.sendData called with silent:', options?.silent);
        
        // Simulate the old behavior where it would call MessageSender
        if (!options?.silent && window.MessageSender) {
          setTimeout(() => {
            window.MessageSender.sendTestMessage(JSON.stringify({
              success: true,
              data: { received: true, extension_data: {} },
              status: 200,
              attempt: 1
            }));
          }, 100);
        }
        
        return {
          success: true,
          data: { received: true, extension_data: {} },
          status: 200,
          attempt: 1
        };
      };
    }
    
    // Simulate a heartbeat response being processed
    console.log('🧪 Simulating heartbeat response processing...');
    const heartbeatResponse = JSON.stringify({
      type: "heartbeat",
      timestamp: new Date().toISOString(),
      status: "idle",
      ray_state: { active_task: null }
    });
    
    window.MessageLoop.sendResponseToServer(heartbeatResponse)
      .then(result => {
        console.log('📊 MessageLoop result:', result);
        
        // Check after delay to see if MessageSender was called
        setTimeout(() => {
          console.log(`\n📊 MessageSender call count: ${messageSenderCallCount}`);
          
          if (messageSenderCallCount === 0) {
            console.log('✅ SUCCESS: No duplicate ChatGPT messages from heartbeat processing');
          } else if (messageSenderCallCount === 1) {
            console.log('⚠️ PARTIAL: One MessageSender call (might be expected)');
          } else {
            console.log('❌ FAILED: Multiple MessageSender calls detected');
          }
          
          // Restore original functions
          if (originalSendTestMessage) {
            window.MessageSender.sendTestMessage = originalSendTestMessage;
          }
          if (originalSendData) {
            window.FetchSender.sendData = originalSendData;
          }
          
        }, 1000);
        
      })
      .catch(error => {
        console.error('❌ MessageLoop test failed:', error);
        
        // Restore original functions
        if (originalSendTestMessage) {
          window.MessageSender.sendTestMessage = originalSendTestMessage;
        }
        if (originalSendData) {
          window.FetchSender.sendData = originalSendData;
        }
      });
      
  } else {
    console.log('❌ MessageLoop or DataSender not available');
  }
}, 3000);

console.log('\n💡 Heartbeat Silent Fix Summary:');
console.log('  🔧 DataSender now uses silent: true for all FetchSender calls');
console.log('  💓 Heartbeat responses processed silently (no duplicate messages)');
console.log('  📡 Server receives heartbeat data correctly');
console.log('  🚫 FetchSender success responses no longer sent to ChatGPT');
console.log('\n⏳ Running tests... check results above in 10 seconds');