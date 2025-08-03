// Test Ray Activity Monitor
// Run this in the browser console on ChatGPT to test the activity monitor

console.log('📊 Testing Ray Activity Monitor...');

function testActivityMonitorSystem() {
  console.log('\n=== Activity Monitor System Test ===');
  
  // Check if activity monitor is loaded
  if (window.RayActivityMonitor) {
    console.log('✅ RayActivityMonitor module loaded');
  } else {
    console.error('❌ RayActivityMonitor module not loaded');
    return;
  }

  // Check if monitor button exists
  const monitorButton = document.querySelector('button[title="Ray Activity Monitor"]');
  if (monitorButton) {
    console.log('✅ Activity monitor button found in DOM');
    console.log('Button position:', monitorButton.style.right);
  } else {
    console.warn('⚠️ Activity monitor button not found in DOM');
  }

  // Test basic functions
  try {
    const stats = window.RayActivityMonitor.stats();
    console.log('✅ Activity stats available:', stats);
  } catch (error) {
    console.error('❌ Error getting activity stats:', error);
  }
}

function testActivityLogging() {
  console.log('\n=== Activity Logging Test ===');
  
  if (!window.RayActivityMonitor) {
    console.error('❌ RayActivityMonitor not available');
    return;
  }

  console.log('📝 Testing manual activity logging...');
  
  // Test different types of activities
  const testActivities = [
    { action: 'TEST_ACTION', details: { test: 'Manual test entry' } },
    { action: 'VOICE_RECOGNITION', details: { text: 'Test voice input' } },
    { action: 'VOICE_SYNTHESIS', details: { text: 'Test voice output' } },
    { action: 'DOM_INTERACTION', details: { element: 'button', action: 'click' } },
    { action: 'INFO', details: { message: 'Test information log' } }
  ];

  testActivities.forEach((activity, index) => {
    setTimeout(() => {
      window.RayActivityMonitor.log(activity.action, activity.details);
      console.log(`✅ Logged activity ${index + 1}: ${activity.action}`);
    }, index * 500);
  });

  // Check log after all activities
  setTimeout(() => {
    const log = window.RayActivityMonitor.getLog();
    console.log(`📊 Total activities in log: ${log.length}`);
    console.log('Recent activities:', log.slice(0, 3));
  }, 3000);
}

function testActivityMonitorUI() {
  console.log('\n=== Activity Monitor UI Test ===');
  
  if (!window.RayActivityMonitor) {
    console.error('❌ RayActivityMonitor not available');
    return;
  }

  console.log('👁️ Testing monitor UI...');
  
  // Test show
  console.log('📊 Showing activity monitor...');
  window.RayActivityMonitor.show();
  
  setTimeout(() => {
    // Check if monitor is visible
    const monitor = document.querySelector('div');
    const monitors = Array.from(document.querySelectorAll('div')).filter(div => 
      div.textContent.includes('Ray Activity Monitor')
    );
    
    if (monitors.length > 0) {
      console.log('✅ Activity monitor is visible');
      
      // Test hide after 3 seconds
      setTimeout(() => {
        console.log('🙈 Hiding activity monitor...');
        window.RayActivityMonitor.hide();
        console.log('✅ Activity monitor hidden');
      }, 3000);
      
    } else {
      console.error('❌ Activity monitor not visible');
    }
  }, 500);
}

function testActivityTracking() {
  console.log('\n=== Activity Tracking Test ===');
  
  console.log('🔍 Testing automatic activity tracking...');
  
  // Test voice recognition tracking (if available)
  if (window.VoiceRecognition) {
    console.log('🎤 Testing voice recognition tracking...');
    
    // This should be logged automatically
    try {
      window.VoiceRecognition.startListening(() => {});
      setTimeout(() => {
        window.VoiceRecognition.stopListening();
      }, 1000);
      console.log('✅ Voice recognition tracking test completed');
    } catch (error) {
      console.warn('⚠️ Voice recognition tracking test failed:', error);
    }
  }
  
  // Test voice synthesis tracking (if available)
  if (window.VoiceSynthesis) {
    console.log('🔊 Testing voice synthesis tracking...');
    
    try {
      window.VoiceSynthesis.speak('Test activity tracking');
      console.log('✅ Voice synthesis tracking test completed');
    } catch (error) {
      console.warn('⚠️ Voice synthesis tracking test failed:', error);
    }
  }
  
  // Test power control tracking (if available)
  if (window.RayPowerControl) {
    console.log('⚡ Testing power control tracking...');
    
    try {
      const initialState = window.RayPowerControl.isPowered();
      window.RayPowerControl.toggle();
      
      setTimeout(() => {
        window.RayPowerControl.toggle(); // Toggle back
        console.log('✅ Power control tracking test completed');
      }, 1000);
    } catch (error) {
      console.warn('⚠️ Power control tracking test failed:', error);
    }
  }
}

function testActivityExport() {
  console.log('\n=== Activity Export Test ===');
  
  if (!window.RayActivityMonitor) {
    console.error('❌ RayActivityMonitor not available');
    return;
  }

  console.log('📤 Testing activity log export...');
  
  // Add some test data first
  window.RayActivityMonitor.log('EXPORT_TEST', { test: 'Export functionality test' });
  
  try {
    // Note: This will trigger a download
    console.log('💾 Triggering export (will download file)...');
    window.RayActivityMonitor.export();
    console.log('✅ Export function executed successfully');
  } catch (error) {
    console.error('❌ Export test failed:', error);
  }
}

function testActivityStats() {
  console.log('\n=== Activity Stats Test ===');
  
  if (!window.RayActivityMonitor) {
    console.error('❌ RayActivityMonitor not available');
    return;
  }

  // Add some test activities
  const testActions = ['INFO', 'WARNING', 'ERROR', 'VOICE_RECOGNITION', 'VOICE_SYNTHESIS'];
  
  testActions.forEach(action => {
    window.RayActivityMonitor.log(action, { test: `Stats test for ${action}` });
  });

  // Get stats
  const stats = window.RayActivityMonitor.stats();
  
  console.log('📊 Activity Statistics:');
  console.log('  Total activities:', stats.totalActivities);
  console.log('  Activity types:', stats.activityTypes);
  console.log('  Time range:', stats.timeRange);
  console.log('  Recent activities:', stats.recentActivities.length);
}

function simulateRayActivity() {
  console.log('\n=== Simulate Ray Activity ===');
  
  console.log('🤖 Simulating Ray performing various activities...');
  
  const activities = [
    { action: 'SYSTEM_INIT', details: { component: 'Simulation' } },
    { action: 'HEARTBEAT', details: { tick: 42, uptime: '1m 23s' } },
    { action: 'VOICE_RECOGNITION', details: { text: 'Hello Ray, how are you?' } },
    { action: 'MESSAGE_SENT', details: { message: 'Processing your request...' } },
    { action: 'VOICE_SYNTHESIS', details: { text: 'I am functioning well, thank you!' } },
    { action: 'DOM_INTERACTION', details: { element: 'button', action: 'click' } },
    { action: 'RESPONSE_RECEIVED', details: { length: 150, type: 'text' } },
    { action: 'INFO', details: { message: 'Activity simulation completed' } }
  ];

  activities.forEach((activity, index) => {
    setTimeout(() => {
      window.RayActivityMonitor.log(activity.action, activity.details);
      console.log(`🤖 Ray performed: ${activity.action}`);
    }, index * 300);
  });

  setTimeout(() => {
    console.log('🎉 Ray activity simulation completed');
    console.log('📊 Check the activity monitor to see all logged activities');
  }, activities.length * 300 + 500);
}

// Run all tests
function runAllActivityMonitorTests() {
  console.log('📊 === Ray Activity Monitor Test Suite ===');
  
  testActivityMonitorSystem();
  testActivityLogging();
  
  setTimeout(() => {
    testActivityMonitorUI();
  }, 4000);
  
  setTimeout(() => {
    testActivityTracking();
  }, 8000);
  
  console.log('\n📊 === Manual Tests Available ===');
  console.log('Run testActivityExport() to test log export');
  console.log('Run testActivityStats() to test statistics');
  console.log('Run simulateRayActivity() to simulate Ray activities');
  console.log('Or click the 📊 button to open the activity monitor');
}

// Auto-run basic tests
runAllActivityMonitorTests();

// Expose test functions globally
window.testActivityMonitorSystem = testActivityMonitorSystem;
window.testActivityLogging = testActivityLogging;
window.testActivityMonitorUI = testActivityMonitorUI;
window.testActivityTracking = testActivityTracking;
window.testActivityExport = testActivityExport;
window.testActivityStats = testActivityStats;
window.simulateRayActivity = simulateRayActivity;
window.runAllActivityMonitorTests = runAllActivityMonitorTests;