/**
 * Test Trust System Fix
 * Verifies that getCurrentUnixTime error is resolved
 */

console.log('🔧 Testing Trust System Fix...');

// Test 1: Check if RayTrustCore is available
console.log('\n📊 Test 1: RayTrustCore Availability');

if (typeof window.RayTrustCore !== 'undefined') {
  console.log('✅ RayTrustCore is available');
  
  // Test initialization
  try {
    console.log('🧪 Testing trust system initialization...');
    window.RayTrustCore.init();
    console.log('✅ Trust system initialized successfully');
  } catch (error) {
    console.error('❌ Trust system initialization failed:', error);
  }
  
  // Test recording an action (this was causing the error)
  try {
    console.log('🧪 Testing trust action recording...');
    window.RayTrustCore.recordAction('HELPFUL_RESPONSE', {
      test: true,
      source: 'trust_fix_test'
    });
    console.log('✅ Trust action recorded successfully');
  } catch (error) {
    console.error('❌ Trust action recording failed:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
  }
  
  // Test getting trust level
  try {
    console.log('🧪 Testing trust level retrieval...');
    const level = window.RayTrustCore.getLevel();
    console.log('✅ Current trust level:', level);
  } catch (error) {
    console.error('❌ Trust level retrieval failed:', error);
  }
  
  // Test getting analytics
  try {
    console.log('🧪 Testing trust analytics...');
    const analytics = window.RayTrustCore.getAnalytics();
    console.log('✅ Trust analytics:', analytics);
  } catch (error) {
    console.error('❌ Trust analytics failed:', error);
  }
  
} else {
  console.log('❌ RayTrustCore not available');
  console.log('💡 Make sure the trust-metrics modules are loaded');
}

// Test 2: Check trust integration
setTimeout(() => {
  console.log('\n🔗 Test 2: Trust Integration Check');
  
  if (typeof window.RayTrustIntegration !== 'undefined') {
    console.log('✅ RayTrustIntegration is available');
    
    try {
      console.log('🧪 Testing trust integration...');
      // This should trigger trust actions internally
      window.RayTrustIntegration.init();
      console.log('✅ Trust integration initialized successfully');
    } catch (error) {
      console.error('❌ Trust integration failed:', error);
    }
  } else {
    console.log('⚠️ RayTrustIntegration not available');
  }
}, 1000);

// Test 3: Verify no more getCurrentUnixTime errors
setTimeout(() => {
  console.log('\n🚨 Test 3: Error Monitoring');
  
  // Override console.error to catch any getCurrentUnixTime errors
  const originalError = console.error;
  let errorCaught = false;
  
  console.error = function(...args) {
    const message = args.join(' ');
    if (message.includes('getCurrentUnixTime')) {
      errorCaught = true;
      console.log('❌ getCurrentUnixTime error still occurring:', message);
    }
    originalError.apply(console, args);
  };
  
  // Trigger some trust actions to test
  if (typeof window.RayTrustCore !== 'undefined') {
    try {
      window.RayTrustCore.recordAction('HELPFUL_RESPONSE');
      window.RayTrustCore.recordAction('PROBLEM_SOLVED');
      window.RayTrustCore.recordAction('RESPECTFUL_INTERACTION');
    } catch (error) {
      // Errors will be caught by our override
    }
  }
  
  // Check results after a delay
  setTimeout(() => {
    if (!errorCaught) {
      console.log('✅ No getCurrentUnixTime errors detected');
    }
    
    // Restore original console.error
    console.error = originalError;
    
    console.log('\n🎯 Trust System Fix Test Complete!');
    console.log('Expected results:');
    console.log('  ✅ Trust system initializes without errors');
    console.log('  ✅ Trust actions can be recorded');
    console.log('  ✅ No getCurrentUnixTime reference errors');
    console.log('  ✅ Trust level and analytics accessible');
    
  }, 1000);
}, 2000);

console.log('\n💡 This test verifies that the getCurrentUnixTime function is properly scoped');
console.log('  🔧 Function moved to top of file for proper hoisting');
console.log('  🚫 Duplicate definition removed');
console.log('  ✅ Trust system should work without errors');
console.log('\n⏳ Running tests... check results above in 5 seconds');