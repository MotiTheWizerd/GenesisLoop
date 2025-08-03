// Test Ray Settings Configuration System
(function() {
  'use strict';

  console.log('🧪 [Test] Testing Ray Settings system...');

  function testRaySettings() {
    // Wait for RaySettings to load
    if (!window.RaySettings) {
      console.log('⏳ [Test] Waiting for RaySettings to load...');
      setTimeout(testRaySettings, 500);
      return;
    }

    console.log('✅ [Test] RaySettings loaded, running tests...');

    // Test 1: Get heartbeat interval
    const heartbeatInterval = window.RaySettings.get('heartbeat.interval');
    console.log(`📊 [Test] Current heartbeat interval: ${heartbeatInterval}ms`);

    // Test 2: Get all heartbeat settings
    const heartbeatSettings = window.RaySettings.get('heartbeat');
    console.log('📊 [Test] All heartbeat settings:', heartbeatSettings);

    // Test 3: Test setting validation
    const isValid1000 = window.RaySettings.validate('heartbeat.interval', 1000);
    const isValid50 = window.RaySettings.validate('heartbeat.interval', 50); // Should be invalid
    console.log(`📊 [Test] 1000ms valid: ${isValid1000}, 50ms valid: ${isValid50}`);

    // Test 4: Change heartbeat interval
    console.log('📊 [Test] Changing heartbeat interval to 2000ms...');
    window.RaySettings.set('heartbeat.interval', 2000);
    
    const newInterval = window.RaySettings.get('heartbeat.interval');
    console.log(`📊 [Test] New heartbeat interval: ${newInterval}ms`);

    // Test 5: Test RayHeartbeat integration
    if (window.RayHeartbeat) {
      console.log('📊 [Test] Testing RayHeartbeat integration...');
      const status = window.RayHeartbeat.status();
      console.log('📊 [Test] RayHeartbeat status:', status);
      
      // Test adjusting heartbeat rate through RayHeartbeat
      console.log('📊 [Test] Adjusting heartbeat rate to 1500ms through RayHeartbeat...');
      const adjusted = window.RayHeartbeat.adjustRate(1500);
      console.log(`📊 [Test] Rate adjustment successful: ${adjusted}`);
      
      const finalInterval = window.RaySettings.get('heartbeat.interval');
      console.log(`📊 [Test] Final heartbeat interval: ${finalInterval}ms`);
    } else {
      console.log('⚠️ [Test] RayHeartbeat not loaded yet');
    }

    // Test 6: Listen for settings changes
    document.addEventListener('raySettingsChanged', (event) => {
      console.log('📊 [Test] Settings changed event:', event.detail);
    });

    console.log('✅ [Test] Ray Settings tests completed');
  }

  // Start tests
  testRaySettings();

})();