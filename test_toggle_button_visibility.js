// Test Toggle Button Visibility
(function() {
  'use strict';

  console.log('🔄 [Test] Testing Toggle Button Visibility...');

  function testToggleButtonVisibility() {
    console.log('\n=== Toggle Button Visibility Test ===');

    // Check Ray UI setting
    if (window.RaySettings) {
      const showRayUI = window.RaySettings.get('ui.showWebUIButtons');
      console.log(`📊 [Test] Ray UI buttons setting: ${showRayUI}`);
      
      if (showRayUI === false) {
        console.log('✅ [Test] Ray UI buttons disabled - toggle button should remain visible');
      } else {
        console.log('⚠️ [Test] Ray UI buttons enabled - all buttons should be visible');
      }
    }

    // Look for the Genesis toggle button
    setTimeout(() => {
      const toggleButton = document.querySelector('#genesis-toggle');
      
      if (toggleButton) {
        const isVisible = toggleButton.style.display !== 'none' && 
                         getComputedStyle(toggleButton).display !== 'none';
        
        console.log(`🔄 [Test] Genesis toggle button found: ${isVisible ? '✅ VISIBLE' : '❌ HIDDEN'}`);
        
        if (isVisible) {
          console.log(`📍 [Test] Button position: ${toggleButton.style.position || 'default'}`);
          console.log(`📍 [Test] Button text: "${toggleButton.textContent}"`);
          console.log(`📍 [Test] Button title: "${toggleButton.title}"`);
          
          // Test if button is functional
          if (typeof toggleButton.onclick === 'function' || toggleButton.onclick) {
            console.log('✅ [Test] Button has click handler - should be functional');
          } else {
            console.log('⚠️ [Test] Button may not have click handler yet');
          }
        } else {
          console.log('❌ [Test] CRITICAL: Toggle button is hidden! This breaks the loop functionality');
        }
      } else {
        console.log('⏳ [Test] Genesis toggle button not found yet - may still be loading');
        
        // Try again in a few seconds
        setTimeout(() => {
          const delayedToggle = document.querySelector('#genesis-toggle');
          if (delayedToggle) {
            const isVisible = delayedToggle.style.display !== 'none' && 
                             getComputedStyle(delayedToggle).display !== 'none';
            console.log(`🔄 [Test] Delayed check - Toggle button: ${isVisible ? '✅ VISIBLE' : '❌ HIDDEN'}`);
          } else {
            console.log('❌ [Test] Toggle button still not found after delay');
          }
        }, 3000);
      }
    }, 1000);

    // Check for Ray buttons (should be hidden)
    setTimeout(() => {
      const rayButtons = [
        'button[title*="Ray Power Control"]',
        'button[title="Ray Control Panel"]',
        'button[title*="Ray Activity Monitor"]'
      ];

      console.log('🔍 [Test] Checking Ray buttons (should be hidden):');
      rayButtons.forEach(selector => {
        const buttons = document.querySelectorAll(selector);
        if (buttons.length > 0) {
          buttons.forEach(button => {
            const isHidden = button.style.display === 'none' || 
                            getComputedStyle(button).display === 'none';
            console.log(`  ${isHidden ? '✅' : '❌'} ${selector}: ${isHidden ? 'Hidden' : 'Visible'}`);
          });
        } else {
          console.log(`  ✅ ${selector}: Not found (good - not created)`);
        }
      });
    }, 2000);
  }

  function testMessageLoopFunctionality() {
    console.log('\n=== Message Loop Functionality Test ===');

    // Check if MessageLoop is available
    if (window.MessageLoop) {
      console.log('✅ [Test] MessageLoop system available');
      
      const isRunning = window.MessageLoop.isRunning();
      console.log(`📊 [Test] MessageLoop status: ${isRunning ? 'Running' : 'Stopped'}`);
      
      // Check if we can control it
      if (typeof window.MessageLoop.startLoop === 'function') {
        console.log('✅ [Test] MessageLoop.startLoop() available');
      }
      
      if (typeof window.MessageLoop.stopLoop === 'function') {
        console.log('✅ [Test] MessageLoop.stopLoop() available');
      }
    } else {
      console.log('⚠️ [Test] MessageLoop system not available yet');
    }

    // Check if ToggleButton functionality is available
    if (window.ToggleButton) {
      console.log('✅ [Test] ToggleButton system available');
      
      if (typeof window.ToggleButton.createToggleButton === 'function') {
        console.log('✅ [Test] ToggleButton.createToggleButton() available');
      }
    } else {
      console.log('⚠️ [Test] ToggleButton system not available yet');
    }
  }

  // Run tests
  function runToggleButtonTests() {
    console.log('🔄 === Toggle Button Visibility Test Suite ===');
    
    testToggleButtonVisibility();
    
    setTimeout(() => {
      testMessageLoopFunctionality();
    }, 4000);
    
    setTimeout(() => {
      console.log('✅ [Test] Toggle button visibility tests completed');
      console.log('💡 [Test] The Genesis Loop toggle button should be the ONLY visible button');
      console.log('🎛️ [Test] All Ray controls should be accessible via the popup interface');
    }, 6000);
  }

  // Start tests
  runToggleButtonTests();

})();