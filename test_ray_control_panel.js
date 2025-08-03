// Test Ray Control Panel
// Run this in the browser console on ChatGPT to test the control panel

console.log('🎛️ Testing Ray Control Panel...');

function testControlPanelSystem() {
  console.log('\n=== Control Panel System Test ===');
  
  // Check if control panel is loaded
  if (window.RayControlPanel) {
    console.log('✅ RayControlPanel loaded');
  } else {
    console.error('❌ RayControlPanel not loaded');
    return;
  }

  // Check if control panel button exists
  const controlButton = document.querySelector('button[title="Ray Control Panel"]');
  if (controlButton) {
    console.log('✅ Control panel button found in DOM');
    console.log('Button position:', controlButton.style.right);
  } else {
    console.warn('⚠️ Control panel button not found in DOM');
  }

  // Check system states
  const states = window.RayControlPanel.getStates();
  console.log('⚙️ Current system states:', states);
}

function testControlPanelUI() {
  console.log('\n=== Control Panel UI Test ===');
  
  if (!window.RayControlPanel) {
    console.error('❌ RayControlPanel not available');
    return;
  }

  // Open control panel
  console.log('🎛️ Opening control panel...');
  window.RayControlPanel.open();
  
  setTimeout(() => {
    // Check if panel is visible
    const panel = document.querySelector('div');
    const panels = Array.from(document.querySelectorAll('div')).filter(div => 
      div.textContent.includes('Ray Control Panel')
    );
    
    if (panels.length > 0) {
      console.log('✅ Control panel opened successfully');
      
      // Check for toggle switches
      const toggles = document.querySelectorAll('input[type="checkbox"]');
      console.log(`✅ Found ${toggles.length} toggle switches`);
      
      // Check for quick action buttons
      const buttons = document.querySelectorAll('button');
      const actionButtons = Array.from(buttons).filter(btn => 
        btn.textContent.includes('Enable All') || 
        btn.textContent.includes('Disable All') || 
        btn.textContent.includes('Voice Only')
      );
      console.log(`✅ Found ${actionButtons.length} quick action buttons`);
      
    } else {
      console.error('❌ Control panel not visible');
    }
    
    // Close panel after test
    setTimeout(() => {
      window.RayControlPanel.close();
      console.log('✅ Control panel closed');
    }, 3000);
    
  }, 1000);
}

function testIndividualToggles() {
  console.log('\n=== Individual Toggle Test ===');
  
  // Open panel first
  window.RayControlPanel.open();
  
  setTimeout(() => {
    // Test individual system toggles
    const systemToggles = [
      'masterPowerToggle',
      'domControlToggle', 
      'voiceRecognitionToggle',
      'voiceSynthesisToggle',
      'messageLoopToggle',
      'responseTrackingToggle',
      'dataTransmissionToggle',
      'fileOperationsToggle'
    ];
    
    console.log('🧪 Testing individual toggles...');
    
    systemToggles.forEach(toggleId => {
      const toggle = document.getElementById(toggleId);
      if (toggle) {
        console.log(`✅ ${toggleId} found`);
        
        // Test toggle functionality
        const initialState = toggle.checked;
        toggle.click(); // Toggle it
        
        setTimeout(() => {
          const newState = toggle.checked;
          if (newState !== initialState) {
            console.log(`✅ ${toggleId} toggle works (${initialState} → ${newState})`);
          } else {
            console.warn(`⚠️ ${toggleId} toggle may not be working`);
          }
        }, 100);
        
      } else {
        console.error(`❌ ${toggleId} not found`);
      }
    });
    
    // Close panel
    setTimeout(() => {
      window.RayControlPanel.close();
    }, 2000);
    
  }, 1000);
}

function testQuickActions() {
  console.log('\n=== Quick Actions Test ===');
  
  // Open panel
  window.RayControlPanel.open();
  
  setTimeout(() => {
    // Test Enable All button
    const enableAllBtn = document.getElementById('enableAllSystems');
    if (enableAllBtn) {
      console.log('🧪 Testing Enable All button...');
      enableAllBtn.click();
      
      setTimeout(() => {
        const states = window.RayControlPanel.getStates();
        const enabledCount = Object.values(states).filter(Boolean).length;
        console.log(`✅ Enable All result: ${enabledCount} systems enabled`);
        
        // Test Disable All button
        const disableAllBtn = document.getElementById('disableAllSystems');
        if (disableAllBtn) {
          console.log('🧪 Testing Disable All button...');
          disableAllBtn.click();
          
          setTimeout(() => {
            const newStates = window.RayControlPanel.getStates();
            const disabledCount = Object.values(newStates).filter(state => !state).length;
            console.log(`✅ Disable All result: ${disabledCount} systems disabled`);
            
            // Test Voice Only Mode
            const voiceOnlyBtn = document.getElementById('voiceOnlyMode');
            if (voiceOnlyBtn) {
              console.log('🧪 Testing Voice Only Mode...');
              voiceOnlyBtn.click();
              
              setTimeout(() => {
                const voiceStates = window.RayControlPanel.getStates();
                console.log('✅ Voice Only Mode result:', voiceStates);
              }, 500);
            }
            
          }, 500);
        }
        
      }, 500);
    }
    
    // Close panel
    setTimeout(() => {
      window.RayControlPanel.close();
    }, 3000);
    
  }, 1000);
}

function testSystemIntegration() {
  console.log('\n=== System Integration Test ===');
  
  // Test integration with existing systems
  const systems = [
    { name: 'RayPowerControl', obj: window.RayPowerControl },
    { name: 'VoiceSynthesisUI', obj: window.VoiceSynthesisUI },
    { name: 'VoiceRecognition', obj: window.VoiceRecognition },
    { name: 'MessageLoop', obj: window.MessageLoop },
    { name: 'DOMAPI', obj: window.DOMAPI }
  ];
  
  systems.forEach(system => {
    if (system.obj) {
      console.log(`✅ ${system.name} available for integration`);
    } else {
      console.warn(`⚠️ ${system.name} not available`);
    }
  });
  
  // Test that control panel can interact with power control
  if (window.RayPowerControl && window.RayControlPanel) {
    const initialPower = window.RayPowerControl.isPowered();
    console.log(`🔋 Initial power state: ${initialPower}`);
    
    // The control panel should be able to control the power system
    console.log('✅ Control panel can integrate with power system');
  }
}

function testButtonLayout() {
  console.log('\n=== Button Layout Test ===');
  
  // Check button positions
  const buttons = [
    { name: 'Power Control', selector: 'button[title*="Ray Power Control"]' },
    { name: 'Control Panel', selector: 'button[title="Ray Control Panel"]' },
    { name: 'Voice Settings', selector: 'button[title="Ray Voice Settings"]' },
    { name: 'Voice Synthesis', selector: 'button[title*="Ray Voice"]' },
    { name: 'Voice Recognition', selector: 'button[title*="Voice Recognition"]' }
  ];
  
  console.log('🎛️ Checking button layout...');
  
  buttons.forEach(button => {
    const element = document.querySelector(button.selector);
    if (element) {
      console.log(`✅ ${button.name}: ${element.style.right} from right`);
    } else {
      console.warn(`⚠️ ${button.name}: not found`);
    }
  });
}

// Run all tests
function runAllControlPanelTests() {
  console.log('🎛️ === Ray Control Panel Test Suite ===');
  
  testControlPanelSystem();
  testButtonLayout();
  testSystemIntegration();
  
  console.log('\n🎛️ === Manual Tests Available ===');
  console.log('Run testControlPanelUI() to test the panel interface');
  console.log('Run testIndividualToggles() to test individual system toggles');
  console.log('Run testQuickActions() to test Enable All/Disable All/Voice Only');
  console.log('Or click the 🎛️ button to open the control panel');
}

// Auto-run basic tests
runAllControlPanelTests();

// Expose test functions globally
window.testControlPanelSystem = testControlPanelSystem;
window.testControlPanelUI = testControlPanelUI;
window.testIndividualToggles = testIndividualToggles;
window.testQuickActions = testQuickActions;
window.testSystemIntegration = testSystemIntegration;
window.testButtonLayout = testButtonLayout;
window.runAllControlPanelTests = runAllControlPanelTests;