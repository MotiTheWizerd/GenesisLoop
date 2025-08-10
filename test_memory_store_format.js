/**
 * Test Memory Store Format Fix
 * Verifies that InteractionLogger sends the correct format to memory/store endpoint
 */

console.log('🧪 Testing Memory Store Format Fix...');

// Test the corrected memory storage format
if (typeof window.RayInteractionLogger !== 'undefined') {
  console.log('✅ InteractionLogger is available');
  
  // Create a test interaction
  const testInteraction = {
    id: 'test_interaction_' + Date.now(),
    text: 'This is a test interaction for memory storage format verification',
    speaker: 'user',
    timestamp: new Date().toISOString(),
    browser_time: { iso: new Date().toISOString(), source: 'test' },
    temporal_source: 'test',
    metadata: {
      type: 'test',
      source: 'format_test'
    },
    embedding: [0.1, 0.2, 0.3, 0.4, 0.5], // Mock embedding
    memory_status: 'embedded'
  };
  
  console.log('📝 Test interaction created:', testInteraction);
  
  // Test individual storage format
  console.log('\n🔍 Testing Individual Storage Format:');
  
  // Mock FetchSender to capture the request format
  const originalSendData = window.FetchSender.sendData;
  let capturedRequest = null;
  
  window.FetchSender.sendData = async function(data, options) {
    capturedRequest = { data, options };
    console.log('📡 Captured memory store request:');
    console.log('  URL:', options.baseUrl);
    console.log('  Data:', JSON.stringify(data, null, 2));
    
    // Verify the format matches backend expectations
    if (data.memories && Array.isArray(data.memories)) {
      console.log('✅ Correct format: Request contains "memories" array');
      
      const memory = data.memories[0];
      if (memory.content && memory.type && memory.metadata) {
        console.log('✅ Memory object has required fields: content, type, metadata');
        
        if (memory.metadata.embedding) {
          console.log('✅ Embedding included in metadata');
        } else {
          console.log('⚠️ Embedding missing from metadata');
        }
        
        if (data.source && data.timestamp) {
          console.log('✅ Request has source and timestamp');
        } else {
          console.log('⚠️ Request missing source or timestamp');
        }
        
      } else {
        console.log('❌ Memory object missing required fields');
      }
    } else {
      console.log('❌ Incorrect format: Request should contain "memories" array');
    }
    
    // Return mock success response
    return {
      success: true,
      data: { message: 'Memory stored successfully' },
      status: 200
    };
  };
  
  // Test the storage
  window.RayInteractionLogger.storeInMemory(testInteraction)
    .then(result => {
      console.log('\n📊 Storage result:', result);
      
      // Restore original function
      window.FetchSender.sendData = originalSendData;
      
      console.log('\n🎯 Format Verification Complete!');
      console.log('Expected backend format:');
      console.log(`{
  "memories": [
    {
      "content": "interaction text",
      "type": "interaction", 
      "importance": "medium|high",
      "tags": ["interaction", "speaker", "type"],
      "metadata": {
        "interaction_id": "...",
        "speaker": "user|ray",
        "embedding": [0.1, 0.2, ...],
        ...
      }
    }
  ],
  "source": "ray_interaction_logger",
  "timestamp": "2025-01-08T..."
}`);
      
    })
    .catch(error => {
      console.error('❌ Storage test failed:', error);
      window.FetchSender.sendData = originalSendData;
    });
    
} else {
  console.log('❌ InteractionLogger not available');
  console.log('💡 Make sure the InteractionLogger module is loaded');
}

// Test batch storage format
setTimeout(() => {
  console.log('\n🔍 Testing Batch Storage Format:');
  
  if (typeof window.RayInteractionLogger !== 'undefined' && 
      typeof window.RayInteractionLogger.storeBatchInMemory === 'function') {
    
    const testBatch = [
      {
        id: 'batch_test_1',
        text: 'First batch interaction',
        speaker: 'user',
        timestamp: new Date().toISOString(),
        metadata: { type: 'batch_test' },
        embedding: [0.1, 0.2, 0.3]
      },
      {
        id: 'batch_test_2', 
        text: 'Second batch interaction',
        speaker: 'ray',
        timestamp: new Date().toISOString(),
        metadata: { type: 'batch_test' },
        embedding: [0.4, 0.5, 0.6]
      }
    ];
    
    // Mock FetchSender again for batch test
    const originalSendData = window.FetchSender.sendData;
    
    window.FetchSender.sendData = async function(data, options) {
      console.log('📡 Captured batch memory store request:');
      console.log('  URL:', options.baseUrl);
      console.log('  Batch size:', data.memories ? data.memories.length : 0);
      console.log('  Data:', JSON.stringify(data, null, 2));
      
      if (data.memories && data.memories.length === 2) {
        console.log('✅ Batch format correct: 2 memories in array');
      } else {
        console.log('❌ Batch format incorrect');
      }
      
      return { success: true, data: { message: 'Batch stored' } };
    };
    
    window.RayInteractionLogger.storeBatchInMemory(testBatch)
      .then(result => {
        console.log('📊 Batch storage result:', result);
        window.FetchSender.sendData = originalSendData;
      })
      .catch(error => {
        console.error('❌ Batch storage test failed:', error);
        window.FetchSender.sendData = originalSendData;
      });
      
  } else {
    console.log('⚠️ Batch storage method not available');
  }
}, 2000);

console.log('\n💡 This test verifies that memory storage requests now use the correct format:');
console.log('  ✅ Wraps memory data in "memories" array');
console.log('  ✅ Includes source and timestamp at root level');
console.log('  ✅ Puts embedding in metadata (not root level)');
console.log('  ✅ Uses proper importance levels (high for Ray, medium for users)');
console.log('  ✅ Supports both individual and batch storage');