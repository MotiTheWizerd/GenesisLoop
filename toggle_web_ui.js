// Toggle Web UI Visibility
(function() {
  'use strict';

  console.log('🔄 [Toggle] Web UI Visibility Toggle Script');

  function toggleWebUI() {
    if (!window.RaySettings) {
      console.log('❌ [Toggle] RaySettings not available');
      console.log('💡 [Toggle] Please wait for Ray systems to load and try again');
      return;
    }

    const currentSetting = window.RaySettings.get('ui.showWebUIButtons');
    const newSetting = !currentSetting;
    
    console.log(`📊 [Toggle] Current setting: ${currentSetting}`);
    console.log(`🔄 [Toggle] Changing to: ${newSetting}`);
    
    // Update the setting
    window.RaySettings.set('ui.showWebUIButtons', newSetting);
    
    if (newSetting) {
      console.log('👁️ [Toggle] Web UI buttons ENABLED');
      console.log('🔄 [Toggle] Please refresh the page to see web UI buttons');
    } else {
      console.log('🚫 [Toggle] Web UI buttons DISABLED');
      console.log('🎛️ [Toggle] Use the browser extension popup to control Ray systems');
      
      // Hide any existing buttons immediately
      hideExistingButtons();
    }
    
    return newSetting;
  }

  function hideExistingButtons() {
    // Hide Ray buttons but keep the Genesis Loop toggle button
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
    
    let hiddenCount = 0;
    rayButtonSelectors.forEach(selector => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach(button => {
        button.style.display = 'none';
        hiddenCount++;
      });
    });
    
    if (hiddenCount > 0) {
      console.log(`🚫 [Toggle] Immediately hid ${hiddenCount} Ray buttons (keeping toggle button)`);
    }
  }

  function showCurrentStatus() {
    if (!window.RaySettings) {
      console.log('❌ [Status] RaySettings not available');
      return;
    }

    const showWebUI = window.RaySettings.get('ui.showWebUIButtons');
    console.log(`📊 [Status] Web UI buttons: ${showWebUI ? '👁️ ENABLED' : '🚫 DISABLED'}`);
    
    if (showWebUI) {
      console.log('💡 [Status] Web UI buttons should appear on the ChatGPT page');
    } else {
      console.log('💡 [Status] Use the browser extension popup for Ray controls');
    }
    
    return showWebUI;
  }

  function enableWebUI() {
    if (!window.RaySettings) {
      console.log('❌ [Enable] RaySettings not available');
      return false;
    }
    
    window.RaySettings.set('ui.showWebUIButtons', true);
    console.log('👁️ [Enable] Web UI buttons ENABLED');
    console.log('🔄 [Enable] Please refresh the page to see web UI buttons');
    return true;
  }

  function disableWebUI() {
    if (!window.RaySettings) {
      console.log('❌ [Disable] RaySettings not available');
      return false;
    }
    
    window.RaySettings.set('ui.showWebUIButtons', false);
    console.log('🚫 [Disable] Web UI buttons DISABLED');
    console.log('🎛️ [Disable] Use the browser extension popup to control Ray systems');
    hideExistingButtons();
    return true;
  }

  // Expose functions globally for easy console access
  window.RayUIControl = {
    toggle: toggleWebUI,
    status: showCurrentStatus,
    enable: enableWebUI,
    disable: disableWebUI
  };

  // Show current status
  console.log('\n=== Ray Web UI Control ===');
  showCurrentStatus();
  console.log('\n💡 Available commands:');
  console.log('  RayUIControl.toggle()  - Toggle web UI visibility');
  console.log('  RayUIControl.enable()  - Enable web UI buttons');
  console.log('  RayUIControl.disable() - Disable web UI buttons');
  console.log('  RayUIControl.status()  - Show current status');
  console.log('\n🎛️ Use the browser extension popup for Ray controls when web UI is disabled');

})();