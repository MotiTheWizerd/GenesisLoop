// Test Heartbeat Slider Integration
(function() {
  'use strict';

  console.log('💓 [Test] Testing Heartbeat Slider integration...');

  function testHeartbeatSlider() {
    // Wait for all components to load
    if (!window.RayControlPanel || !window.RayHeartbeat || !window.RaySettings) {
      console.log('⏳ [Test] Waiting for components to load...');
      setTimeout(testHeartbeatSlider, 1000);
      return;
    }

    console.log('✅ [Test] All components loaded, running tests...');

    // Test 1: Check initial heartbeat settings
    const initialInterval = window.RaySettings.get('heartbeat.interval');
    console.log(`📊 [Test] Initial heartbeat interval: ${initialInterval}ms`);

    // Test 2: Open control panel
    console.log('📊 [Test] Opening control panel...');
    window.RayControlPanel.open();

    setTimeout(() => {
      // Test 3: Check if heartbeat slider exists
      const slider = document.getElementById('heartbeatSlider');
      const valueDisplay = document.getElementById('heartbeatValue');
      const statusDisplay = document.getElementById('heartbeatStatus');

      if (slider && valueDisplay && statusDisplay) {
        console.log('✅ [Test] Heartbeat controls found in UI');
        console.log(`📊 [Test] Slider value: ${slider.value}ms`);
        console.log(`📊 [Test] Display value: ${valueDisplay.textContent}`);
        console.log(`📊 [Test] Status: ${statusDisplay.textContent.substring(0, 50)}...`);

        // Test 4: Test slider interaction
        console.log('📊 [Test] Testing slider interaction...');
        slider.value = 1500;
        slider.dispatchEvent(new Event('input'));
        
        setTimeout(() => {
          console.log(`📊 [Test] After slider input - Display: ${valueDisplay.textContent}`);
          
          // Test 5: Test preset buttons
          console.log('📊 [Test] Testing preset buttons...');
          const preset500 = document.getElementById('heartbeatPreset500');
          if (preset500) {
            preset500.click();
            
            setTimeout(() => {
              const newInterval = window.RaySettings.get('heartbeat.interval');
              console.log(`📊 [Test] After 500ms preset - Interval: ${newInterval}ms`);
              
              // Test 6: Test 2000ms preset
              const preset2000 = document.getElementById('heartbeatPreset2000');
              if (preset2000) {
                preset2000.click();
                
                setTimeout(() => {
                  const finalInterval = window.RaySettings.get('heartbeat.interval');
                  console.log(`📊 [Test] After 2000ms preset - Interval: ${finalInterval}ms`);
                  
                  // Test 7: Reset to default
                  const preset1000 = document.getElementById('heartbeatPreset1000');
                  if (preset1000) {
                    preset1000.click();
                    console.log('📊 [Test] Reset to default 1000ms');
                  }
                  
                  // Test 8: Check heartbeat status
                  setTimeout(() => {
                    const status = window.RayHeartbeat.status();
                    console.log('📊 [Test] Final heartbeat status:', status);
                    
                    console.log('✅ [Test] Heartbeat slider tests completed');
                    
                    // Close control panel
                    setTimeout(() => {
                      window.RayControlPanel.close();
                      console.log('📊 [Test] Control panel closed');
                    }, 2000);
                    
                  }, 1000);
                }, 1000);
              }
            }, 1000);
          }
        }, 500);
        
      } else {
        console.error('❌ [Test] Heartbeat controls not found in UI');
        console.log('Available elements:', {
          slider: !!slider,
          valueDisplay: !!valueDisplay,
          statusDisplay: !!statusDisplay
        });
      }
    }, 1000);
  }

  // Test heartbeat status updates
  function testHeartbeatStatusUpdates() {
    console.log('📊 [Test] Testing heartbeat status updates...');
    
    let updateCount = 0;
    const maxUpdates = 5;
    
    const testInterval = setInterval(() => {
      if (window.RayHeartbeat) {
        const status = window.RayHeartbeat.status();
        console.log(`📊 [Test] Status update ${updateCount + 1}:`, {
          beating: status.beating,
          tickCount: status.tickCount,
          uptime: status.uptimeFormatted,
          heartRate: status.heartRate
        });
        
        updateCount++;
        if (updateCount >= maxUpdates) {
          clearInterval(testInterval);
          console.log('✅ [Test] Status update tests completed');
        }
      }
    }, 2000);
  }

  // Start tests
  testHeartbeatSlider();
  
  // Start status update test after a delay
  setTimeout(() => {
    testHeartbeatStatusUpdates();
  }, 5000);

})();