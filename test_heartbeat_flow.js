// Test Heartbeat Flow - Debug the complete heartbeat data flow
(function() {
  'use strict';

  console.log('🔄 [Heartbeat Flow] Testing complete heartbeat data flow...');

  // Test the complete flow from server to ChatGPT
  async function testCompleteHeartbeatFlow() {
    console.log('🧪 [Heartbeat Flow] Starting complete flow test...');

    // Step 1: Test FetchSender.getHeartbeat()
    console.log('📡 [Step 1] Testing FetchSender.getHeartbeat()...');
    
    if (typeof window.FetchSender === 'undefined') {
      console.error('❌ [Step 1] FetchSender not available');
      return;
    }

    let heartbeatData = null;
    try {
      const result = await window.FetchSender.getHeartbeat();
      console.log('✅ [Step 1] FetchSender.getHeartbeat() result:', result);
      
      if (result.success) {
        heartbeatData = result.data;
        console.log('📦 [Step 1] Heartbeat data extracted:', heartbeatData);
      } else {
        console.error('❌ [Step 1] Heartbeat request failed:', result.error);
        return;
      }
    } catch (error) {
      console.error('❌ [Step 1] FetchSender.getHeartbeat() threw error:', error);
      return;
    }

    // Step 2: Test JSON stringification (what MessageLoop does)
    console.log('📝 [Step 2] Testing JSON stringification...');
    
    try {
      const heartbeatJson = JSON.stringify(heartbeatData);
      console.log('✅ [Step 2] JSON stringified heartbeat:', heartbeatJson);
      console.log('📏 [Step 2] JSON length:', heartbeatJson.length);
      
      // Test parsing back
      const parsedBack = JSON.parse(heartbeatJson);
      console.log('🔄 [Step 2] Parsed back successfully:', parsedBack);
      
    } catch (error) {
      console.error('❌ [Step 2] JSON processing failed:', error);
      return;
    }

    // Step 3: Test MessageSender (if available)
    console.log('📤 [Step 3] Testing MessageSender...');
    
    if (typeof window.MessageSender === 'undefined') {
      console.warn('⚠️ [Step 3] MessageSender not available');
    } else {
      console.log('✅ [Step 3] MessageSender is available');
      
      // Test if we can send the heartbeat data
      const heartbeatJson = JSON.stringify(heartbeatData);
      console.log('🚀 [Step 3] Attempting to send heartbeat via MessageSender...');
      
      try {
        // Don't actually send, just test the preparation
        const success = window.MessageSender.sendTestMessage(
          heartbeatJson,
          () => {
            console.log('❌ [Step 3] MessageSender reported failure');
          },
          true // Skip response handling
        );
        
        console.log('📊 [Step 3] MessageSender.sendTestMessage returned:', success);
      } catch (error) {
        console.error('❌ [Step 3] MessageSender threw error:', error);
      }
    }

    // Step 4: Test DOM elements (what MessageSender needs)
    console.log('🔍 [Step 4] Testing DOM elements...');
    
    if (typeof window.DOMUtils === 'undefined') {
      console.warn('⚠️ [Step 4] DOMUtils not available');
    } else {
      console.log('✅ [Step 4] DOMUtils is available');
      
      // Test element finding
      try {
        const textarea = window.DOMUtils.findTextarea();
        const sendButton = window.DOMUtils.findSendButton();
        
        console.log('📝 [Step 4] Textarea found:', !!textarea);
        console.log('🔘 [Step 4] Send button found:', !!sendButton);
        
        if (textarea) {
          console.log('📏 [Step 4] Current textarea content length:', textarea.value?.length || 0);
        }
        
      } catch (error) {
        console.error('❌ [Step 4] DOM element testing failed:', error);
      }
    }

    // Step 5: Test the actual MessageLoop flow (simulation)
    console.log('🔄 [Step 5] Simulating MessageLoop flow...');
    
    if (typeof window.MessageLoop !== 'undefined') {
      console.log('✅ [Step 5] MessageLoop is available');
      console.log('📊 [Step 5] MessageLoop state:', {
        isRunning: window.MessageLoop.isRunning,
        waitingForResponse: window.MessageLoop.waitingForResponse,
        attemptCount: window.MessageLoop.attemptCount,
        responseCount: window.MessageLoop.responseCount
      });
    } else {
      console.warn('⚠️ [Step 5] MessageLoop not available');
    }

    console.log('✅ [Heartbeat Flow] Complete flow test finished');
  }

  // Test heartbeat data changes over time
  async function testHeartbeatChanges() {
    console.log('⏰ [Heartbeat Changes] Testing heartbeat data changes over time...');
    
    const results = [];
    const testCount = 3;
    const delayBetweenTests = 2000; // 2 seconds
    
    for (let i = 0; i < testCount; i++) {
      console.log(`📡 [Test ${i + 1}/${testCount}] Getting heartbeat...`);
      
      try {
        const timestamp = Date.now();
        const result = await window.FetchSender.getHeartbeat();
        
        results.push({
          testNumber: i + 1,
          timestamp: timestamp,
          success: result.success,
          data: result.data,
          error: result.error
        });
        
        console.log(`✅ [Test ${i + 1}] Result:`, result);
        
        if (i < testCount - 1) {
          console.log(`⏳ [Test ${i + 1}] Waiting ${delayBetweenTests}ms before next test...`);
          await new Promise(resolve => setTimeout(resolve, delayBetweenTests));
        }
        
      } catch (error) {
        console.error(`❌ [Test ${i + 1}] Failed:`, error);
        results.push({
          testNumber: i + 1,
          timestamp: Date.now(),
          success: false,
          error: error.message
        });
      }
    }
    
    // Analyze results
    console.log('🔬 [Analysis] Heartbeat change analysis:');
    console.log('📊 [Analysis] All results:', results);
    
    const successfulResults = results.filter(r => r.success);
    if (successfulResults.length >= 2) {
      const first = successfulResults[0];
      const last = successfulResults[successfulResults.length - 1];
      
      const firstJson = JSON.stringify(first.data);
      const lastJson = JSON.stringify(last.data);
      
      if (firstJson === lastJson) {
        console.log('⚠️ [Analysis] Heartbeat data is identical across requests');
        console.log('💡 [Analysis] This suggests either:');
        console.log('   1. Server is not updating the heartbeat data');
        console.log('   2. Server is caching responses');
        console.log('   3. Browser is caching responses');
      } else {
        console.log('✅ [Analysis] Heartbeat data is changing between requests');
        console.log('🔍 [Analysis] First data:', first.data);
        console.log('🔍 [Analysis] Last data:', last.data);
      }
    } else {
      console.log('❌ [Analysis] Not enough successful requests to compare');
    }
  }

  // Main execution
  async function runHeartbeatFlowTests() {
    console.log('🚀 [Heartbeat Flow] Starting comprehensive heartbeat flow tests...');
    
    await testCompleteHeartbeatFlow();
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    await testHeartbeatChanges();
    
    console.log('✅ [Heartbeat Flow] All tests completed');
    console.log('💡 [Heartbeat Flow] Check the logs above to identify where the issue occurs');
  }

  // Execute the tests
  runHeartbeatFlowTests();

})();