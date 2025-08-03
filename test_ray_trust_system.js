// Test Ray Trust Metrics System
// Run this in the browser console on ChatGPT to test the trust system

console.log('🤝 Testing Ray Trust Metrics System...');

function testTrustSystemBasics() {
  console.log('\n=== Trust System Basics Test ===');
  
  // Check if trust system is loaded
  const components = ['RayTrustCore', 'RayTrustUI', 'RayTrustIntegration', 'RayTrustSystem'];
  
  components.forEach(component => {
    if (window[component]) {
      console.log(`✅ ${component} loaded`);
    } else {
      console.error(`❌ ${component} not loaded`);
    }
  });

  // Check trust system status
  if (window.RayTrustSystem) {
    const status = window.RayTrustSystem.getStatus();
    console.log('Trust System Status:', status);
  }
}

function testTrustInitialization() {
  console.log('\n=== Trust Initialization Test ===');
  
  if (!window.RayTrustSystem) {
    console.error('❌ RayTrustSystem not available');
    return;
  }

  // Initialize trust system
  window.RayTrustSystem.init()
    .then(() => {
      console.log('✅ Trust system initialized successfully');
      
      // Get initial trust level
      const trustLevel = window.RayTrustSystem.getCurrentLevel();
      console.log('Initial Trust Level:', trustLevel);
      
      // Show trust UI
      setTimeout(() => {
        if (window.RayTrustUI) {
          window.RayTrustUI.show();
          console.log('✅ Trust UI displayed');
        }
      }, 1000);
      
    })
    .catch(error => {
      console.error('❌ Trust system initialization failed:', error);
    });
}

function testTrustActions() {
  console.log('\n=== Trust Actions Test ===');
  
  if (!window.RayTrustCore) {
    console.error('❌ RayTrustCore not available');
    return;
  }

  console.log('🧪 Testing various trust actions...');
  
  // Test positive actions
  const positiveActions = [
    { action: 'HELPFUL_RESPONSE', context: { test: 'Provided useful information' } },
    { action: 'PROBLEM_SOLVED', context: { test: 'Fixed user issue successfully' } },
    { action: 'RESPECTFUL_INTERACTION', context: { test: 'Polite and considerate response' } },
    { action: 'EMOTIONAL_SUPPORT', context: { test: 'Provided comfort and understanding' } }
  ];

  positiveActions.forEach((item, index) => {
    setTimeout(() => {
      const newLevel = window.RayTrustCore.recordAction(item.action, item.context);
      console.log(`✅ ${item.action}: Trust level now ${newLevel}`);
    }, index * 500);
  });

  // Test negative actions after positive ones
  setTimeout(() => {
    console.log('🧪 Testing negative trust actions...');
    
    const negativeActions = [
      { action: 'UNHELPFUL_RESPONSE', context: { test: 'Failed to help user' } },
      { action: 'INACCURATE_INFORMATION', context: { test: 'Provided wrong information' } }
    ];

    negativeActions.forEach((item, index) => {
      setTimeout(() => {
        const newLevel = window.RayTrustCore.recordAction(item.action, item.context);
        console.log(`⚠️ ${item.action}: Trust level now ${newLevel}`);
      }, index * 500);
    });
  }, 3000);
}

function testTrustUI() {
  console.log('\n=== Trust UI Test ===');
  
  if (!window.RayTrustUI) {
    console.error('❌ RayTrustUI not available');
    return;
  }

  console.log('🎨 Testing trust UI functionality...');
  
  // Show UI
  window.RayTrustUI.show();
  console.log('✅ Trust UI shown');
  
  // Test refresh
  setTimeout(() => {
    window.RayTrustUI.refresh();
    console.log('✅ Trust UI refreshed');
  }, 2000);
  
  // Test toggle
  setTimeout(() => {
    window.RayTrustUI.toggle();
    console.log('✅ Trust UI toggled');
  }, 4000);
  
  // Show again
  setTimeout(() => {
    window.RayTrustUI.show();
    console.log('✅ Trust UI shown again');
  }, 6000);
}

function testTrustIntegration() {
  console.log('\n=== Trust Integration Test ===');
  
  if (!window.RayTrustIntegration) {
    console.error('❌ RayTrustIntegration not available');
    return;
  }

  // Check integration status
  const status = window.RayTrustIntegration.getStatus();
  console.log('Integration Status:', status);
  
  // Test manual trust recording
  console.log('🧪 Testing manual trust recording...');
  
  window.RayTrustIntegration.recordPositive({ test: 'Manual positive action' });
  console.log('✅ Positive action recorded');
  
  setTimeout(() => {
    window.RayTrustIntegration.recordRespect({ test: 'Manual respectful action' });
    console.log('✅ Respectful action recorded');
  }, 1000);
  
  setTimeout(() => {
    window.RayTrustIntegration.recordNegative({ test: 'Manual negative action' });
    console.log('⚠️ Negative action recorded');
  }, 2000);
}

function testTrustAnalytics() {
  console.log('\n=== Trust Analytics Test ===');
  
  if (!window.RayTrustCore) {
    console.error('❌ RayTrustCore not available');
    return;
  }

  // Get trust analytics
  const analytics = window.RayTrustCore.getAnalytics();
  console.log('Trust Analytics:', analytics);
  
  // Get current trust level details
  const trustLevel = window.RayTrustCore.getLevel();
  console.log('Current Trust Level:', trustLevel);
  
  // Get available action types
  const actionTypes = window.RayTrustCore.getActionTypes();
  console.log('Available Trust Actions:', actionTypes);
}

function testTrustPersistence() {
  console.log('\n=== Trust Persistence Test ===');
  
  if (!window.RayTrustCore) {
    console.error('❌ RayTrustCore not available');
    return;
  }

  // Record some actions
  window.RayTrustCore.recordAction('HELPFUL_RESPONSE', { test: 'Persistence test' });
  
  const beforeLevel = window.RayTrustCore.getLevel();
  console.log('Trust level before:', beforeLevel.level);
  
  // Simulate page reload by reinitializing
  setTimeout(() => {
    console.log('🔄 Simulating system restart...');
    
    // Reinitialize trust system
    window.RayTrustCore.init();
    
    const afterLevel = window.RayTrustCore.getLevel();
    console.log('Trust level after restart:', afterLevel.level);
    
    if (afterLevel.level === beforeLevel.level) {
      console.log('✅ Trust persistence working correctly');
    } else {
      console.warn('⚠️ Trust persistence may have issues');
    }
  }, 2000);
}

function testTrustHealthCheck() {
  console.log('\n=== Trust Health Check Test ===');
  
  if (!window.RayTrustSystem) {
    console.error('❌ RayTrustSystem not available');
    return;
  }

  const health = window.RayTrustSystem.healthCheck();
  console.log('Trust System Health:', health);
  
  if (health.overall === 'healthy') {
    console.log('✅ Trust system is healthy');
  } else {
    console.warn(`⚠️ Trust system health: ${health.overall}`);
    console.log('Issues:', health.issues);
    console.log('Recommendations:', health.recommendations);
  }
}

function simulateUserInteraction() {
  console.log('\n=== Simulated User Interaction Test ===');
  
  if (!window.RayTrustSystem) {
    console.error('❌ RayTrustSystem not available');
    return;
  }

  console.log('🎭 Simulating realistic user interaction...');
  
  const interactions = [
    { delay: 0, action: () => window.RayTrustSystem.recordRespectful({ interaction: 'User greeted Ray politely' }) },
    { delay: 1000, action: () => window.RayTrustSystem.recordHelpful({ interaction: 'Ray provided useful information' }) },
    { delay: 2000, action: () => window.RayTrustSystem.recordProblemSolved({ interaction: 'Ray solved user problem' }) },
    { delay: 3000, action: () => window.RayTrustSystem.recordSupport({ interaction: 'Ray provided emotional support' }) },
    { delay: 4000, action: () => window.RayTrustSystem.recordRespectful({ interaction: 'User thanked Ray' }) },
    { delay: 5000, action: () => {
      const finalLevel = window.RayTrustSystem.getCurrentLevel();
      console.log('🎉 Final trust level after interaction:', finalLevel);
    }}
  ];

  interactions.forEach(({ delay, action }) => {
    setTimeout(action, delay);
  });
}

function testTrustButton() {
  console.log('\n=== Trust Button Test ===');
  
  // Look for trust button
  const trustButton = document.querySelector('button[title*="Trust"]');
  
  if (trustButton) {
    console.log('✅ Trust button found in DOM');
    console.log('Button position:', {
      top: trustButton.style.top,
      right: trustButton.style.right,
      zIndex: trustButton.style.zIndex
    });
    
    // Test button click
    trustButton.click();
    console.log('✅ Trust button clicked');
  } else {
    console.warn('⚠️ Trust button not found in DOM');
    
    // Check if UI is hidden
    if (window.RayUIToggle && !window.RayUIToggle.isVisible()) {
      console.log('💡 UI might be hidden - try Ctrl+Shift+H');
    }
  }
}

// Run all tests
function runAllTrustTests() {
  console.log('🤝 === Ray Trust Metrics Test Suite ===');
  
  testTrustSystemBasics();
  
  setTimeout(() => {
    testTrustInitialization();
  }, 1000);
  
  setTimeout(() => {
    testTrustActions();
  }, 3000);
  
  setTimeout(() => {
    testTrustUI();
  }, 8000);
  
  setTimeout(() => {
    testTrustIntegration();
  }, 15000);
  
  setTimeout(() => {
    testTrustAnalytics();
  }, 20000);
  
  setTimeout(() => {
    testTrustPersistence();
  }, 22000);
  
  setTimeout(() => {
    testTrustHealthCheck();
  }, 26000);
  
  setTimeout(() => {
    testTrustButton();
  }, 28000);
  
  setTimeout(() => {
    simulateUserInteraction();
  }, 30000);
  
  console.log('\n🎯 All trust tests scheduled. Watch the console for results!');
  console.log('💡 You can also run individual tests manually:');
  console.log('- testTrustSystemBasics()');
  console.log('- testTrustInitialization()');
  console.log('- testTrustActions()');
  console.log('- testTrustUI()');
  console.log('- simulateUserInteraction()');
}

// Auto-run basic tests
runAllTrustTests();

// Expose test functions globally
window.testTrustSystemBasics = testTrustSystemBasics;
window.testTrustInitialization = testTrustInitialization;
window.testTrustActions = testTrustActions;
window.testTrustUI = testTrustUI;
window.testTrustIntegration = testTrustIntegration;
window.testTrustAnalytics = testTrustAnalytics;
window.testTrustPersistence = testTrustPersistence;
window.testTrustHealthCheck = testTrustHealthCheck;
window.simulateUserInteraction = simulateUserInteraction;
window.testTrustButton = testTrustButton;
window.runAllTrustTests = runAllTrustTests;