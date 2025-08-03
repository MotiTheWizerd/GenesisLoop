// Test UI Toggle Immediate Loading
// Run this right after page load to verify UI toggle is available

console.log('👁️ Testing UI Toggle Immediate Availability...');

function testImmediateAvailability() {
  console.log('\n=== Immediate Availability Test ===');
  
  // Test if RayUIToggle is available
  if (window.RayUIToggle) {
    console.log('✅ RayUIToggle is immediately available');
    
    // Test basic functions
    try {
      const status = window.RayUIToggle.status();
      console.log('✅ RayUIToggle.status() works:', status);
    } catch (error) {
      console.error('❌ RayUIToggle.status() error:', error);
    }
    
    try {
      const isVisible = window.RayUIToggle.isVisible();
      console.log('✅ RayUIToggle.isVisible() works:', isVisible);
    } catch (error) {
      console.error('❌ RayUIToggle.isVisible() error:', error);
    }
    
  } else {
    console.error('❌ RayUIToggle is NOT immediately available');
    console.log('⏳ Waiting for RayUIToggle to load...');
    
    // Wait and check again
    setTimeout(() => {
      if (window.RayUIToggle) {
        console.log('✅ RayUIToggle loaded after delay');
      } else {
        console.error('❌ RayUIToggle still not available after delay');
      }
    }, 2000);
  }
}

function testToggleButton() {
  console.log('\n=== Toggle Button Test ===');
  
  // Look for the toggle button
  const toggleButton = document.querySelector('button[title*="Toggle Ray UI"]');
  if (toggleButton) {
    console.log('✅ UI Toggle button found in DOM');
    console.log('Button position:', toggleButton.style.left, toggleButton.style.top);
    console.log('Button z-index:', toggleButton.style.zIndex);
  } else {
    console.warn('⚠️ UI Toggle button not found yet');
    
    // Wait and check again
    setTimeout(() => {
      const delayedButton = document.querySelector('button[title*="Toggle Ray UI"]');
      if (delayedButton) {
        console.log('✅ UI Toggle button found after delay');
      } else {
        console.error('❌ UI Toggle button still not found');
      }
    }, 1000);
  }
}

function testQuickToggle() {
  console.log('\n=== Quick Toggle Test ===');
  
  if (window.RayUIToggle) {
    console.log('🧪 Testing quick UI toggle...');
    
    try {
      // Test hide
      window.RayUIToggle.hide();
      console.log('✅ UI hide command executed');
      
      setTimeout(() => {
        // Test show
        window.RayUIToggle.show();
        console.log('✅ UI show command executed');
      }, 1000);
      
    } catch (error) {
      console.error('❌ Quick toggle test failed:', error);
    }
    
  } else {
    console.error('❌ Cannot test quick toggle - RayUIToggle not available');
  }
}

function createEmergencyToggle() {
  console.log('\n=== Emergency Toggle Creation ===');
  
  if (window.RayUIToggle) {
    console.log('✅ RayUIToggle available - no emergency toggle needed');
    return;
  }
  
  console.log('🚨 Creating emergency UI toggle...');
  
  // Create emergency toggle function
  window.emergencyToggleRayUI = function() {
    const rayElements = document.querySelectorAll(`
      #ray-clock-display,
      button[title*="Ray"],
      button[title*="Voice"],
      button[style*="position: fixed"][style*="right:"]
    `);
    
    rayElements.forEach(el => {
      if (el.style.display === 'none') {
        el.style.display = el.getAttribute('data-original-display') || 'block';
      } else {
        el.setAttribute('data-original-display', el.style.display || 'block');
        el.style.display = 'none';
      }
    });
    
    console.log(`🔄 Emergency toggle affected ${rayElements.length} elements`);
  };
  
  console.log('✅ Emergency toggle created: emergencyToggleRayUI()');
}

// Run immediate tests
function runImmediateTests() {
  console.log('👁️ === UI Toggle Immediate Test Suite ===');
  
  testImmediateAvailability();
  testToggleButton();
  createEmergencyToggle();
  
  console.log('\n👁️ === Available Commands ===');
  if (window.RayUIToggle) {
    console.log('✅ window.RayUIToggle.hide() - Hide Ray UI');
    console.log('✅ window.RayUIToggle.show() - Show Ray UI');
    console.log('✅ window.RayUIToggle.toggle() - Toggle Ray UI');
  }
  
  if (window.emergencyToggleRayUI) {
    console.log('🚨 window.emergencyToggleRayUI() - Emergency toggle');
  }
  
  console.log('⌨️ Ctrl+Shift+H - Keyboard shortcut');
}

// Run tests immediately
runImmediateTests();

// Also test after a short delay
setTimeout(() => {
  console.log('\n👁️ === Delayed Availability Check ===');
  testQuickToggle();
}, 1000);

// Expose functions
window.testImmediateAvailability = testImmediateAvailability;
window.testToggleButton = testToggleButton;
window.testQuickToggle = testQuickToggle;
window.runImmediateTests = runImmediateTests;