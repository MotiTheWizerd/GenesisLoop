// Test Web UI Hiding Functionality
(function() {
  'use strict';

  console.log('🚫 [Test] Testing Web UI hiding functionality...');

  function testUIHiding() {
    console.log('\n=== Web UI Hiding Test ===');

    // Check current setting
    if (window.RaySettings) {
      const showWebUI = window.RaySettings.get('ui.showWebUIButtons');
      console.log(`📊 [Test] Current showWebUIButtons setting: ${showWebUI}`);
      
      if (showWebUI === false) {
        console.log('✅ [Test] Web UI buttons should be hidden');
      } else {
        console.log('⚠️ [Test] Web UI buttons should be visible');
      }
    } else {
      console.log('❌ [Test] RaySettings not available');
    }

    // Check for Ray buttons (Genesis toggle should remain visible)
    const rayButtonSelectors = [
      'button[title*="Ray Power Control"]',
      'button[title="Ray Control Panel"]',
      'button[title*="Ray Activity Monitor"]',
      'button[title*="Ray Voice"]',
      'button[title="Ray Voice Settings"]',
      'button[title*="Toggle Voice Recognition"]',
      'button[title*="Ray Trust Metrics"]',
      'button[title*="Make Promise"]',
      'button[title*="Toggle Ray UI"]'
    ];
    
    // Check Genesis toggle separately
    const genesisToggle = document.querySelector('#genesis-toggle');
    if (genesisToggle) {
      const isHidden = genesisToggle.style.display === 'none' || 
                      getComputedStyle(genesisToggle).display === 'none';
      console.log(`🔄 [Test] Genesis toggle button: ${isHidden ? '🚫 Hidden (WRONG!)' : '👁️ Visible (CORRECT)'}`);
    } else {
      console.log('🔄 [Test] Genesis toggle button: Not found yet');
    }

    console.log('🔍 [Test] Checking for Ray buttons:');
    let foundButtons = 0;
    let hiddenButtons = 0;

    rayButtonSelectors.forEach(selector => {
      const buttons = document.querySelectorAll(selector);
      if (buttons.length > 0) {
        foundButtons += buttons.length;
        buttons.forEach(button => {
          const isHidden = button.style.display === 'none' || 
                          getComputedStyle(button).display === 'none';
          if (isHidden) {
            hiddenButtons++;
            console.log(`  🚫 Hidden: ${selector}`);
          } else {
            console.log(`  👁️ Visible: ${selector}`);
          }
        });
      }
    });

    console.log(`📊 [Test] Summary: ${foundButtons} Ray buttons found, ${hiddenButtons} hidden`);

    if (foundButtons === 0) {
      console.log('✅ [Test] No Ray UI buttons found - clean interface');
    } else if (hiddenButtons === foundButtons) {
      console.log('✅ [Test] All Ray UI buttons successfully hidden');
    } else {
      console.log('⚠️ [Test] Some Ray buttons may still be visible');
    }
    
    // Verify Genesis toggle is still available
    if (genesisToggle && !genesisToggle.style.display === 'none') {
      console.log('✅ [Test] Genesis Loop toggle button remains available');
    }
  }

  function testPopupOnlyMode() {
    console.log('\n=== Popup-Only Mode Test ===');

    // Test that systems are still available for popup control
    const systemsToCheck = [
      'RayPowerControl',
      'RayHeartbeat',
      'RaySettings',
      'VoiceSynthesisUI',
      'VoiceRecognition',
      'MessageLoop',
      'ResponseTracker'
    ];

    console.log('🔍 [Test] Checking system availability for popup control:');
    let availableSystems = 0;

    systemsToCheck.forEach(system => {
      if (typeof window[system] !== 'undefined') {
        availableSystems++;
        console.log(`  ✅ ${system}: Available`);
        
        // Test basic functionality
        if (system === 'RayPowerControl' && window[system].isPowered) {
          const powered = window[system].isPowered();
          console.log(`    🔋 Power state: ${powered}`);
        }
        
        if (system === 'RayHeartbeat' && window[system].status) {
          const status = window[system].status();
          console.log(`    💓 Heartbeat: ${status.beating ? 'Beating' : 'Stopped'}`);
        }
        
        if (system === 'RaySettings' && window[system].get) {
          const interval = window[system].get('heartbeat.interval');
          console.log(`    ⚙️ Heartbeat interval: ${interval}ms`);
        }
      } else {
        console.log(`  ❌ ${system}: Not Available`);
      }
    });

    console.log(`📊 [Test] ${availableSystems}/${systemsToCheck.length} systems available for popup control`);

    if (availableSystems >= systemsToCheck.length * 0.8) {
      console.log('✅ [Test] Sufficient systems available for popup interface');
    } else {
      console.log('⚠️ [Test] Some systems may not be available for popup control');
    }
  }

  function testSettingsToggle() {
    console.log('\n=== Settings Toggle Test ===');

    if (!window.RaySettings) {
      console.log('❌ [Test] RaySettings not available for toggle test');
      return;
    }

    const currentSetting = window.RaySettings.get('ui.showWebUIButtons');
    console.log(`📊 [Test] Current setting: ${currentSetting}`);

    // Test toggling the setting
    console.log('🔄 [Test] Testing setting toggle...');
    
    // Toggle to opposite value
    const newValue = !currentSetting;
    window.RaySettings.set('ui.showWebUIButtons', newValue);
    
    const updatedSetting = window.RaySettings.get('ui.showWebUIButtons');
    console.log(`📊 [Test] Updated setting: ${updatedSetting}`);

    if (updatedSetting === newValue) {
      console.log('✅ [Test] Setting toggle successful');
    } else {
      console.log('❌ [Test] Setting toggle failed');
    }

    // Restore original value
    window.RaySettings.set('ui.showWebUIButtons', currentSetting);
    console.log(`🔄 [Test] Restored original setting: ${currentSetting}`);
  }

  // Run tests
  function runAllHidingTests() {
    console.log('🚫 === Web UI Hiding Test Suite ===');
    
    testUIHiding();
    
    setTimeout(() => {
      testPopupOnlyMode();
    }, 1000);
    
    setTimeout(() => {
      testSettingsToggle();
    }, 2000);
    
    setTimeout(() => {
      console.log('✅ [Test] Web UI hiding tests completed');
      console.log('💡 [Test] Use the browser extension popup to control Ray systems');
    }, 3000);
  }

  // Start tests
  runAllHidingTests();

})();