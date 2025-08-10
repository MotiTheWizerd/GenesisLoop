/**
 * Test Task Results Debug
 * Investigates why task results are not appearing in heartbeat
 */

console.log('🔍 Debugging Task Results Issue...');

// Test 1: Send a task and monitor the flow
console.log('\n📋 Test 1: Task Sending and Result Monitoring');

if (typeof window.FetchSender !== 'undefined') {
  console.log('✅ FetchSender is available');
  
  // Create a test task similar to your example
  const testTask = {
    task: [
      {
        action: "web_scrape",
        url: "https://httpbin.org/json", // Simple test endpoint
        extract_text: true,
        extract_links: false,
        extract_images: false,
        max_content_length: 5000,
        timeout: 10,
        follow_redirects: true
      },
      {
        action: "reflect",
        question: "What data was returned from this test endpoint?"
      }
    ],
    assigned_by: "debug_test",
    execute_immediately: true,
    timestamp: new Date().toISOString()
  };
  
  console.log('📤 Sending test task:', JSON.stringify(testTask, null, 2));
  
  // Monitor the request
  const originalSendData = window.FetchSender.sendData;
  let taskRequestCaptured = false;
  
  window.FetchSender.sendData = async function(data, options) {
    if (data && data.task) {
      taskRequestCaptured = true;
      console.log('📡 Task request captured:');
      console.log('  URL:', options?.baseUrl || 'default');
      console.log('  Data:', JSON.stringify(data, null, 2));
    }
    
    // Call original function
    const result = await originalSendData.call(this, data, options);
    
    if (data && data.task) {
      console.log('📥 Task response received:', result);
    }
    
    return result;
  };
  
  // Send the task
  window.FetchSender.sendJSON(testTask)
    .then(result => {
      console.log('✅ Task sent successfully:', result);
      
      if (taskRequestCaptured) {
        console.log('✅ Task request was properly captured and sent');
      } else {
        console.log('❌ Task request was not captured');
      }
      
      // Restore original function
      window.FetchSender.sendData = originalSendData;
      
      // Now monitor heartbeat for results
      console.log('\n💓 Monitoring heartbeat for task results...');
      monitorHeartbeatForResults();
      
    })
    .catch(error => {
      console.error('❌ Task sending failed:', error);
      window.FetchSender.sendData = originalSendData;
    });
    
} else {
  console.log('❌ FetchSender not available');
}

// Function to monitor heartbeat responses
function monitorHeartbeatForResults() {
  let heartbeatCount = 0;
  const maxHeartbeats = 10; // Monitor for 10 heartbeats
  
  // Override FetchSender.getHeartbeat to monitor responses
  const originalGetHeartbeat = window.FetchSender?.getHeartbeat;
  
  if (originalGetHeartbeat) {
    window.FetchSender.getHeartbeat = async function(options) {
      const result = await originalGetHeartbeat.call(this, options);
      
      heartbeatCount++;
      console.log(`💓 Heartbeat ${heartbeatCount}/${maxHeartbeats}:`, result);
      
      if (result.success && result.data) {
        const heartbeatData = result.data;
        
        // Check for task results
        if (heartbeatData.vsrequests && heartbeatData.vsrequests.length > 0) {
          console.log('📋 VS Requests found:', heartbeatData.vsrequests);
        } else {
          console.log('📋 VS Requests: empty');
        }
        
        if (heartbeatData.ray_responses && heartbeatData.ray_responses.length > 0) {
          console.log('🤖 Ray Responses found:', heartbeatData.ray_responses);
        } else {
          console.log('🤖 Ray Responses: empty');
        }
        
        // Check if task is being worked on
        if (heartbeatData.ray_working_on_request !== undefined) {
          console.log('⚙️ Ray working on request:', heartbeatData.ray_working_on_request);
        }
        
        // Check ray_state for active task
        if (heartbeatData.ray_state && heartbeatData.ray_state.active_task) {
          console.log('📋 Active task:', heartbeatData.ray_state.active_task);
        } else {
          console.log('📋 Active task: null');
        }
      }
      
      // Stop monitoring after max heartbeats
      if (heartbeatCount >= maxHeartbeats) {
        console.log('\n📊 Heartbeat monitoring complete');
        console.log('Summary:');
        console.log(`  - Monitored ${heartbeatCount} heartbeats`);
        console.log('  - Check above for any task results');
        
        // Restore original function
        window.FetchSender.getHeartbeat = originalGetHeartbeat;
      }
      
      return result;
    };
  }
}

// Test 2: Check current heartbeat structure
setTimeout(() => {
  console.log('\n🔍 Test 2: Current Heartbeat Structure Analysis');
  
  if (typeof window.FetchSender !== 'undefined') {
    window.FetchSender.getHeartbeat()
      .then(result => {
        if (result.success) {
          const heartbeat = result.data;
          console.log('📊 Current heartbeat structure:');
          
          // Analyze the structure
          const keys = Object.keys(heartbeat);
          console.log('Available keys:', keys);
          
          // Check specific fields
          console.log('\n🔍 Field Analysis:');
          console.log('  vsrequests:', Array.isArray(heartbeat.vsrequests) ? `array (${heartbeat.vsrequests.length} items)` : typeof heartbeat.vsrequests);
          console.log('  ray_responses:', Array.isArray(heartbeat.ray_responses) ? `array (${heartbeat.ray_responses.length} items)` : typeof heartbeat.ray_responses);
          console.log('  ray_working_on_request:', heartbeat.ray_working_on_request);
          console.log('  ray_state.active_task:', heartbeat.ray_state?.active_task);
          
          // Look for any fields that might contain task results
          keys.forEach(key => {
            const value = heartbeat[key];
            if (Array.isArray(value) && value.length > 0) {
              console.log(`  ${key}: has ${value.length} items - might contain results`);
            }
          });
          
        } else {
          console.log('❌ Failed to get heartbeat:', result.error);
        }
      })
      .catch(error => {
        console.error('❌ Heartbeat request failed:', error);
      });
  }
}, 2000);

console.log('\n💡 Task Results Debug Summary:');
console.log('  📋 Sends a test task to the backend');
console.log('  💓 Monitors heartbeat responses for task results');
console.log('  🔍 Analyzes heartbeat structure for result fields');
console.log('  📊 Reports on vsrequests, ray_responses, and active_task fields');
console.log('\n⏳ Running tests... check results above');

// Test 3: Check if backend is processing tasks
setTimeout(() => {
  console.log('\n🔧 Test 3: Backend Task Processing Check');
  
  console.log('Expected flow:');
  console.log('  1. Extension sends task to /tasks endpoint');
  console.log('  2. Backend processes web_scrape action');
  console.log('  3. Backend processes reflect action');
  console.log('  4. Backend includes results in heartbeat response');
  console.log('  5. Extension receives results via heartbeat');
  
  console.log('\nPossible issues:');
  console.log('  ❓ Backend not processing tasks from /tasks endpoint');
  console.log('  ❓ Backend not including results in heartbeat');
  console.log('  ❓ Results being cleared before heartbeat is called');
  console.log('  ❓ Task routing not working correctly');
  
  console.log('\nTo debug further:');
  console.log('  1. Check backend logs for task processing');
  console.log('  2. Verify /tasks endpoint is receiving data');
  console.log('  3. Confirm backend is populating vsrequests/ray_responses');
  console.log('  4. Test with simpler single-action tasks');
  
}, 5000);