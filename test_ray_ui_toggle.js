// Test Ray UI Toggle
// Run this in the browser console on ChatGPT to test the UI visibility toggle

console.log('👁️ Testing Ray UI Toggle...');

function testUIToggleSystem() {
  console.log('\n=== UI Toggle System Test ===');
  
  // Check if UI toggle is loaded
  if (window.RayUIToggle) {
    console.log('✅ RayUIToggle module loaded');
  } else {
    console.error('❌ RayUIToggle module not loaded');
    return;
  }

  // Check if toggle button exists
  const toggleButton = document.querySelector('button[title*="Toggle Ray UI"]');
  if (toggleButton) {
    console.log('✅ UI toggle button found in DOM');
    console.log('Button position:', toggleButton.style.left, toggleButton.style.top);
  } else {
    console.warn('⚠️ UI toggle button not found in DOM');
  }

  // Check toggle status
  const status = window.RayUIToggle.status();
  console.log('👁️ UI Toggle Status:', status);
}

function testRayUIElements() {
  console.log('\n=== Ray UI Elements Detection Test ===');
  
  // Find all Ray UI elements
  const rayUISelectors = [
    '#ray-clock-display',
    'button[title*="Ray Power Control"]',
    'button[title="Ray Control Panel"]',
    'button[title="Ray Voice Settings"]',
    'button[title*="Ray Voice"]',
    'button[title*="Voice Recognition"]'
  ];

  let foundElements = 0;
  
  rayUISelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      foundElements += elements.length;
      console.log(`✅ Found ${elements.length} element(s) for: ${selector}`);
    } else {
      console.warn(`⚠️ No elements found for: ${selector}`);
    }
  });

  console.log(`📊 Total Ray UI elements detected: ${foundElements}`);
  
  if (foundElements >= 3) {
    console.log('✅ Sufficient Ray UI elements for toggle testing');
  } else {
    console.warn('⚠️ Limited Ray UI elements detected');
  }
}

function testUIToggleFunctionality() {
  console.log('\n=== UI Toggle Functionality Test ===');
  
  if (!window.RayUIToggle) {
    console.error('❌ RayUIToggle not available');
    return;
  }

  console.log('👁️ Testing UI hide/show functionality...');
  
  // Test hide
  console.log('🙈 Testing UI hide...');
  window.RayUIToggle.hide();
  
  setTimeout(() => {
    const isVisible = window.RayUIToggle.isVisible();
    if (!isVisible) {
      console.log('✅ UI successfully hidden');
    } else {
      console.error('❌ UI hide failed');
    }
    
    // Test show
    setTimeout(() => {
      console.log('👁️ Testing UI show...');
      window.RayUIToggle.show();
      
      setTimeout(() => {
        const isVisibleAgain = window.RayUIToggle.isVisible();
        if (isVisibleAgain) {
          console.log('✅ UI successfully shown');
        } else {
          console.error('❌ UI show failed');
        }
      }, 500);
      
    }, 2000);
    
  }, 500);
}

function testUIToggleButton() {
  console.log('\n=== UI Toggle Button Test ===');
  
  const toggleButton = document.querySelector('button[title*="Toggle Ray UI"]');
  if (!toggleButton) {
    console.error('❌ Toggle button not found');
    return;
  }

  console.log('🖱️ Testing toggle button click...');
  
  // Get initial state
  const initialVisible = window.RayUIToggle.isVisible();
  console.log(`Initial UI state: ${initialVisible ? 'Visible' : 'Hidden'}`);
  
  // Simulate click
  toggleButton.click();
  
  setTimeout(() => {
    const newVisible = window.RayUIToggle.isVisible();
    console.log(`New UI state: ${newVisible ? 'Visible' : 'Hidden'}`);
    
    if (newVisible !== initialVisible) {
      console.log('✅ Toggle button click works');
      
      // Toggle back
      setTimeout(() => {
        toggleButton.click();
        setTimeout(() => {
          const finalVisible = window.RayUIToggle.isVisible();
          if (finalVisible === initialVisible) {
            console.log('✅ Toggle button works both ways');
          } else {
            console.warn('⚠️ Toggle button may not work consistently');
          }
        }, 500);
      }, 1000);
      
    } else {
      console.error('❌ Toggle button click failed');
    }
  }, 500);
}

function testKeyboardShortcut() {
  console.log('\n=== Keyboard Shortcut Test ===');
  
  console.log('⌨️ Testing Ctrl+Shift+H shortcut...');
  console.log('📝 Note: This test simulates the keyboard event');
  
  // Get initial state
  const initialVisible = window.RayUIToggle.isVisible();
  
  // Create keyboard event
  const keyEvent = new KeyboardEvent('keydown', {
    key: 'H',
    ctrlKey: true,
    shiftKey: true,
    bubbles: true
  });
  
  // Dispatch event
  document.dispatchEvent(keyEvent);
  
  setTimeout(() => {
    const newVisible = window.RayUIToggle.isVisible();
    
    if (newVisible !== initialVisible) {
      console.log('✅ Keyboard shortcut works');
    } else {
      console.warn('⚠️ Keyboard shortcut may not be working');
    }
  }, 500);
}

function testAutoHideFeature() {
  console.log('\n=== Auto-Hide Feature Test ===');
  
  if (!window.RayUIToggle) {
    console.error('❌ RayUIToggle not available');
    return;
  }

  console.log('⏰ Testing auto-hide for 3 seconds...');
  
  // Enable auto-hide for 3 seconds
  window.RayUIToggle.autoHide(3000);
  
  // Check that UI is hidden
  setTimeout(() => {
    const isHidden = !window.RayUIToggle.isVisible();
    if (isHidden) {
      console.log('✅ Auto-hide activated UI');
    } else {
      console.warn('⚠️ Auto-hide may not have activated');
    }
  }, 500);
  
  // Check that UI is restored after 3 seconds
  setTimeout(() => {
    const isVisible = window.RayUIToggle.isVisible();
    if (isVisible) {
      console.log('✅ Auto-hide restored UI after timeout');
    } else {
      console.warn('⚠️ Auto-hide may not have restored UI');
    }
  }, 3500);
}

function testUIToggleStates() {
  console.log('\n=== UI Toggle States Test ===');
  
  if (!window.RayUIToggle) {
    console.error('❌ RayUIToggle not available');
    return;
  }

  console.log('🔄 Testing different UI states...');
  
  // Test programmatic visibility control
  console.log('📝 Setting UI to hidden...');
  window.RayUIToggle.setVisibility(false);
  
  setTimeout(() => {
    console.log('Current state:', window.RayUIToggle.isVisible() ? 'Visible' : 'Hidden');
    
    console.log('📝 Setting UI to visible...');
    window.RayUIToggle.setVisibility(true);
    
    setTimeout(() => {
      console.log('Final state:', window.RayUIToggle.isVisible() ? 'Visible' : 'Hidden');
      console.log('✅ Programmatic state control test completed');
    }, 500);
    
  }, 500);
}

// Run all tests
function runAllUIToggleTests() {
  console.log('👁️ === Ray UI Toggle Test Suite ===');
  
  testUIToggleSystem();
  testRayUIElements();
  
  setTimeout(() => {
    testUIToggleFunctionality();
  }, 1000);
  
  setTimeout(() => {
    testUIToggleButton();
  }, 5000);
  
  console.log('\n👁️ === Manual Tests Available ===');
  console.log('Run testKeyboardShortcut() to test Ctrl+Shift+H');
  console.log('Run testAutoHideFeature() to test auto-hide');
  console.log('Run testUIToggleStates() to test programmatic control');
  console.log('Or click the eye button (👁️) in the top-left corner');
  console.log('Or press Ctrl+Shift+H to toggle UI visibility');
}

// Auto-run basic tests
runAllUIToggleTests();

// Expose test functions globally
window.testUIToggleSystem = testUIToggleSystem;
window.testRayUIElements = testRayUIElements;
window.testUIToggleFunctionality = testUIToggleFunctionality;
window.testUIToggleButton = testUIToggleButton;
window.testKeyboardShortcut = testKeyboardShortcut;
window.testAutoHideFeature = testAutoHideFeature;
window.testUIToggleStates = testUIToggleStates;
window.runAllUIToggleTests = runAllUIToggleTests;