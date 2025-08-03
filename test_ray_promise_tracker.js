// Test Ray Promise Tracker System
// Run this in the browser console on ChatGPT to test the promise system

console.log('🤞 Testing Ray Promise Tracker System...');

function testPromiseTrackerBasics() {
  console.log('\n=== Promise Tracker Basics Test ===');
  
  // Check if promise tracker is loaded
  if (window.RayPromiseTracker) {
    console.log('✅ RayPromiseTracker loaded');
    
    // Check available methods
    console.log('Available methods:', Object.keys(window.RayPromiseTracker));
    
    // Get current stats
    const stats = window.RayPromiseTracker.getStats();
    console.log('Promise stats:', stats);
    
  } else {
    console.error('❌ RayPromiseTracker not loaded');
    return false;
  }
  
  // Check for promise button
  const promiseButton = document.querySelector('button[title*="Promise"]');
  if (promiseButton) {
    console.log('✅ Promise button found in DOM');
    console.log('Button position:', {
      top: promiseButton.style.top,
      right: promiseButton.style.right,
      zIndex: promiseButton.style.zIndex
    });
  } else {
    console.warn('⚠️ Promise button not found in DOM');
  }
  
  return true;
}

function testPromiseCreation() {
  console.log('\n=== Promise Creation Test ===');
  
  if (!window.RayPromiseTracker) {
    console.error('❌ RayPromiseTracker not available');
    return;
  }

  console.log('🧪 Testing promise creation...');
  
  // Test quick promise creation
  const testPromises = [
    { text: 'I will test the voice recognition feature', category: 'USAGE', days: 3 },
    { text: 'I will provide feedback on any bugs I find', category: 'FEEDBACK', days: 7 },
    { text: 'I will be patient with system issues', category: 'RESPECT', days: 14 },
    { text: 'I will read the documentation', category: 'LEARNING', days: 5 }
  ];

  testPromises.forEach((promise, index) => {
    setTimeout(() => {
      const promiseId = window.RayPromiseTracker.makeQuickPromise(
        promise.text, 
        promise.category, 
        promise.days
      );
      console.log(`✅ Created promise ${promiseId}: ${promise.text}`);
    }, index * 500);
  });

  // Show stats after creation
  setTimeout(() => {
    const stats = window.RayPromiseTracker.getStats();
    console.log('📊 Promise stats after creation:', stats);
  }, 3000);
}

function testPromiseFulfillment() {
  console.log('\n=== Promise Fulfillment Test ===');
  
  if (!window.RayPromiseTracker) {
    console.error('❌ RayPromiseTracker not available');
    return;
  }

  const promises = window.RayPromiseTracker.getPromises();
  const activePromises = promises.filter(p => p.status === 'active');
  
  if (activePromises.length === 0) {
    console.log('⚠️ No active promises to test fulfillment');
    return;
  }

  console.log(`🧪 Testing promise fulfillment with ${activePromises.length} active promises...`);
  
  // Fulfill the first active promise
  const firstPromise = activePromises[0];
  console.log('Fulfilling promise:', firstPromise.text);
  
  const success = window.RayPromiseTracker.markKept(firstPromise.id, {
    test: 'Automated fulfillment test',
    method: 'console_test'
  });
  
  if (success) {
    console.log('✅ Promise marked as kept successfully');
    
    // Check trust level change
    setTimeout(() => {
      if (window.RayTrustCore) {
        const trustLevel = window.RayTrustCore.getLevel();
        console.log('🤝 Current trust level after promise kept:', trustLevel.level);
      }
    }, 500);
  } else {
    console.error('❌ Failed to mark promise as kept');
  }
}

function testPromiseBreaking() {
  console.log('\n=== Promise Breaking Test ===');
  
  if (!window.RayPromiseTracker) {
    console.error('❌ RayPromiseTracker not available');
    return;
  }

  const promises = window.RayPromiseTracker.getPromises();
  const activePromises = promises.filter(p => p.status === 'active');
  
  if (activePromises.length === 0) {
    console.log('⚠️ No active promises to test breaking');
    return;
  }

  console.log(`🧪 Testing promise breaking...`);
  
  // Break the last active promise
  const lastPromise = activePromises[activePromises.length - 1];
  console.log('Breaking promise:', lastPromise.text);
  
  const success = window.RayPromiseTracker.markBroken(lastPromise.id, 'Testing promise breaking functionality');
  
  if (success) {
    console.log('💔 Promise marked as broken successfully');
    
    // Check trust level change
    setTimeout(() => {
      if (window.RayTrustCore) {
        const trustLevel = window.RayTrustCore.getLevel();
        console.log('🤝 Current trust level after promise broken:', trustLevel.level);
      }
    }, 500);
  } else {
    console.error('❌ Failed to mark promise as broken');
  }
}

function testPromiseUI() {
  console.log('\n=== Promise UI Test ===');
  
  if (!window.RayPromiseTracker) {
    console.error('❌ RayPromiseTracker not available');
    return;
  }

  console.log('🎨 Testing promise UI...');
  
  // Show the promise UI
  window.RayPromiseTracker.show();
  console.log('✅ Promise UI shown');
  
  // Check if UI is visible
  setTimeout(() => {
    const promiseUI = Array.from(document.querySelectorAll('div')).find(div => 
      div.textContent.includes('Promises to Ray')
    );
    
    if (promiseUI && promiseUI.style.display !== 'none') {
      console.log('✅ Promise UI is visible');
    } else {
      console.warn('⚠️ Promise UI not visible');
    }
  }, 1000);
}

function simulateUserPromiseWorkflow() {
  console.log('\n=== Simulated User Promise Workflow ===');
  
  if (!window.RayPromiseTracker) {
    console.error('❌ RayPromiseTracker not available');
    return;
  }

  console.log('🎭 Simulating realistic user promise workflow...');
  
  const workflow = [
    {
      delay: 0,
      action: () => {
        console.log('👤 User makes a promise to test voice features');
        return window.RayPromiseTracker.makeQuickPromise(
          'I will test the voice recognition and synthesis features today',
          'USAGE',
          1
        );
      }
    },
    {
      delay: 2000,
      action: () => {
        console.log('👤 User makes another promise about feedback');
        return window.RayPromiseTracker.makeQuickPromise(
          'I will report any bugs I encounter while using Ray',
          'FEEDBACK',
          7
        );
      }
    },
    {
      delay: 4000,
      action: () => {
        console.log('👤 User opens promise UI to check status');
        window.RayPromiseTracker.show();
      }
    },
    {
      delay: 6000,
      action: () => {
        console.log('👤 User fulfills first promise (tested voice features)');
        const promises = window.RayPromiseTracker.getPromises();
        const activePromise = promises.find(p => p.status === 'active' && p.text.includes('voice'));
        if (activePromise) {
          window.RayPromiseTracker.markKept(activePromise.id, {
            action: 'Used voice recognition successfully',
            satisfaction: 'high'
          });
        }
      }
    },
    {
      delay: 8000,
      action: () => {
        console.log('👤 User checks final trust level and promise stats');
        const stats = window.RayPromiseTracker.getStats();
        console.log('📊 Final promise stats:', stats);
        
        if (window.RayTrustCore) {
          const trustLevel = window.RayTrustCore.getLevel();
          console.log('🤝 Final trust level:', trustLevel);
        }
      }
    }
  ];

  workflow.forEach(({ delay, action }) => {
    setTimeout(action, delay);
  });
}

function testPromiseButton() {
  console.log('\n=== Promise Button Test ===');
  
  // Look for promise button
  const promiseButton = document.querySelector('button[title*="Promise"]');
  
  if (promiseButton) {
    console.log('✅ Promise button found');
    console.log('Button styles:', {
      position: promiseButton.style.position,
      top: promiseButton.style.top,
      right: promiseButton.style.right,
      borderColor: promiseButton.style.borderColor
    });
    
    // Test button click
    console.log('🖱️ Testing button click...');
    promiseButton.click();
    
    setTimeout(() => {
      const promiseUI = Array.from(document.querySelectorAll('div')).find(div => 
        div.textContent.includes('Promises to Ray')
      );
      
      if (promiseUI && promiseUI.style.display !== 'none') {
        console.log('✅ Button click opened promise UI');
      } else {
        console.warn('⚠️ Button click did not open promise UI');
      }
    }, 500);
    
  } else {
    console.error('❌ Promise button not found');
    
    // Check if UI is hidden
    if (window.RayUIToggle && !window.RayUIToggle.isVisible()) {
      console.log('💡 Ray UI might be hidden - try Ctrl+Shift+H');
    }
  }
}

// Run all tests
function runAllPromiseTests() {
  console.log('🤞 === Ray Promise Tracker Test Suite ===');
  
  const basicsOK = testPromiseTrackerBasics();
  
  if (!basicsOK) {
    console.error('❌ Basic tests failed, stopping test suite');
    return;
  }
  
  setTimeout(() => {
    testPromiseCreation();
  }, 1000);
  
  setTimeout(() => {
    testPromiseFulfillment();
  }, 5000);
  
  setTimeout(() => {
    testPromiseBreaking();
  }, 7000);
  
  setTimeout(() => {
    testPromiseUI();
  }, 9000);
  
  setTimeout(() => {
    testPromiseButton();
  }, 11000);
  
  setTimeout(() => {
    simulateUserPromiseWorkflow();
  }, 13000);
  
  console.log('\n🎯 All promise tests scheduled. Watch the console for results!');
  console.log('💡 You can also run individual tests manually:');
  console.log('- testPromiseTrackerBasics()');
  console.log('- testPromiseCreation()');
  console.log('- testPromiseFulfillment()');
  console.log('- testPromiseUI()');
  console.log('- simulateUserPromiseWorkflow()');
}

// Auto-run basic tests
runAllPromiseTests();

// Expose test functions globally
window.testPromiseTrackerBasics = testPromiseTrackerBasics;
window.testPromiseCreation = testPromiseCreation;
window.testPromiseFulfillment = testPromiseFulfillment;
window.testPromiseBreaking = testPromiseBreaking;
window.testPromiseUI = testPromiseUI;
window.simulateUserPromiseWorkflow = simulateUserPromiseWorkflow;
window.testPromiseButton = testPromiseButton;
window.runAllPromiseTests = runAllPromiseTests;