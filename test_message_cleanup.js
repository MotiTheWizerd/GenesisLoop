/**
 * Test Message Cleanup System
 * Comprehensive testing of the message cleanup functionality
 */

console.log('🧹 Testing Message Cleanup System...');

// Test 1: Check if MessageCleanup is loaded
console.log('\n📋 Test 1: Module Loading');
if (typeof window.MessageCleanup !== 'undefined') {
  console.log('✅ MessageCleanup module is loaded');
  console.log('🔧 Available methods:', Object.keys(window.MessageCleanup));
} else {
  console.error('❌ MessageCleanup module not found');
}

// Test 2: Get current message statistics
console.log('\n📊 Test 2: Message Statistics');
try {
  const stats = window.MessageCleanup.getMessageStats();
  console.log('✅ Message stats:', stats);
  
  if (stats.total_messages > 0) {
    console.log(`📝 Found ${stats.total_messages} total messages`);
    console.log(`👥 User messages: ${stats.user_messages}`);
    console.log(`🤖 Assistant messages: ${stats.assistant_messages}`);
    console.log(`💬 Message pairs: ${stats.message_pairs}`);
    console.log(`🔄 AI responding: ${stats.ai_responding}`);
  } else {
    console.log('ℹ️ No messages found in current conversation');
  }
} catch (error) {
  console.error('❌ Error getting message stats:', error);
}

// Test 3: Get all messages
console.log('\n📄 Test 3: Message Detection');
try {
  const allMessages = window.MessageCleanup.getAllMessages();
  console.log(`✅ Found ${allMessages.length} messages in DOM`);
  
  if (allMessages.length > 0) {
    console.log('📋 Message breakdown:');
    allMessages.forEach((msg, index) => {
      const role = msg.getAttribute('data-message-author-role');
      const preview = msg.innerText.substring(0, 50).replace(/\n/g, ' ') + '...';
      console.log(`  ${index + 1}. [${role}] ${preview}`);
    });
  }
} catch (error) {
  console.error('❌ Error getting messages:', error);
}

// Test 4: Check AI response status
console.log('\n🤖 Test 4: AI Response Detection');
try {
  const isResponding = window.MessageCleanup.isAIResponding();
  console.log(`✅ AI responding status: ${isResponding}`);
  
  if (isResponding) {
    console.log('⏸️ AI is currently responding - cleanup will be skipped');
  } else {
    console.log('✅ AI is not responding - cleanup can proceed');
  }
} catch (error) {
  console.error('❌ Error checking AI response status:', error);
}

// Test 5: Get current configuration
console.log('\n⚙️ Test 5: Configuration');
try {
  const config = window.MessageCleanup.getConfig();
  console.log('✅ Current config:', config);
} catch (error) {
  console.error('❌ Error getting config:', error);
}

// Test 6: Manual cleanup (dry run simulation)
console.log('\n🧹 Test 6: Cleanup Simulation');
try {
  const stats = window.MessageCleanup.getMessageStats();
  
  if (stats.message_pairs > 5) {
    console.log(`📊 Current pairs: ${stats.message_pairs}, would cleanup ${stats.message_pairs - 5} pairs`);
    console.log('🔄 Running manual cleanup...');
    
    const result = window.MessageCleanup.cleanupMessages();
    console.log('✅ Cleanup result:', result);
    
    if (result.cleaned > 0) {
      console.log(`🗑️ Cleaned ${result.cleaned} messages`);
      console.log(`📝 Kept ${result.kept} message pairs`);
    } else if (result.skipped) {
      console.log('⏸️ Cleanup was skipped (not enough messages or AI responding)');
    }
  } else {
    console.log('ℹ️ Not enough messages to trigger cleanup');
  }
} catch (error) {
  console.error('❌ Error during cleanup test:', error);
}

// Test 7: Auto cleanup status
console.log('\n🔄 Test 7: Auto Cleanup Status');
try {
  const stats = window.MessageCleanup.getMessageStats();
  console.log(`✅ Auto cleanup running: ${stats.auto_cleanup_running}`);
  console.log(`🔄 Cleanup active: ${stats.cleanup_active}`);
  
  if (!stats.auto_cleanup_running) {
    console.log('🚀 Starting auto cleanup...');
    window.MessageCleanup.startAutoCleanup();
  }
} catch (error) {
  console.error('❌ Error checking auto cleanup status:', error);
}

// Test 8: Event listener test
console.log('\n📡 Test 8: Event Integration');
try {
  // Listen for cleanup events
  document.addEventListener('rayMessageCleanup', (event) => {
    console.log('🎉 Cleanup event received:', event.detail);
  });
  
  console.log('✅ Event listener registered for rayMessageCleanup');
} catch (error) {
  console.error('❌ Error setting up event listener:', error);
}

// Test 9: Configuration update test
console.log('\n⚙️ Test 9: Configuration Update');
try {
  const originalConfig = window.MessageCleanup.getConfig();
  console.log('📋 Original config:', originalConfig);
  
  // Test config update (but restore original)
  window.MessageCleanup.updateConfig({ MAX_MESSAGES: 3 });
  const updatedConfig = window.MessageCleanup.getConfig();
  console.log('✅ Updated config:', updatedConfig);
  
  // Restore original
  window.MessageCleanup.updateConfig(originalConfig);
  console.log('🔄 Config restored to original');
} catch (error) {
  console.error('❌ Error testing config update:', error);
}

// Summary
console.log('\n📋 Test Summary');
console.log('✅ Message Cleanup System test completed');
console.log('🔧 Use window.MessageCleanup.cleanupMessages() for manual cleanup');
console.log('📊 Use window.MessageCleanup.getMessageStats() for current stats');
console.log('⚙️ Use window.MessageCleanup.updateConfig({MAX_MESSAGES: N}) to change settings');
console.log('🔄 Auto cleanup runs every 30 seconds by default');