// Fix Trust System After Browser Refresh
// Run this immediately after refreshing the page to ensure trust system works

console.log('🔧 Fixing Trust System After Refresh...');

function fixTrustSystemAfterRefresh() {
  console.log('🤝 === Trust System Refresh Fix ===');
  
  // Step 1: Check if trust components are loaded
  const requiredComponents = ['RayTrustCore', 'RayTrustUI', 'RayTrustIntegration', 'RayTrustSystem'];
  const missingComponents = requiredComponents.filter(comp => !window[comp]);
  
  if (missingComponents.length > 0) {
    console.error('❌ Missing trust components:', missingComponents);
    console.log('💡 Please reload the extension and refresh the page');
    return false;
  }
  
  console.log('✅ All trust components loaded');
  
  // Step 2: Force initialize trust system
  if (window.RayTrustSystem) {
    console.log('🔄 Force initializing trust system...');
    
    window.RayTrustSystem.init()
      .then(() => {
        console.log('✅ Trust system initialized successfully');
        
        // Step 3: Test trust recording
        setTimeout(() => {
          testTrustRecording();
        }, 1000);
        
        // Step 4: Ensure UI is visible
        setTimeout(() => {
          ensureTrustUIVisible();
        }, 2000);
        
        // Step 5: Test integration
        setTimeout(() => {
          testTrustIntegration();
        }, 3000);
        
      })
      .catch(error => {
        console.error('❌ Trust system initialization failed:', error);
        
        // Try manual component initialization
        manualTrustInitialization();
      });
  }
  
  return true;
}

function testTrustRecording() {
  console.log('🧪 Testing trust recording...');
  
  if (!window.RayTrustCore) {
    console.error('❌ RayTrustCore not available');
    return;
  }
  
  try {
    const initialLevel = window.RayTrustCore.getLevel();
    console.log('Initial trust level:', initialLevel.level);
    
    // Record a test action
    const newLevel = window.RayTrustCore.recordAction('HELPFUL_RESPONSE', {
      test: 'Post-refresh recording test',
      timestamp: Date.now()
    });
    
    console.log('✅ Trust recording successful - New level:', newLevel);
    
    // Record system interaction
    window.RayTrustCore.recordAction('SYSTEM_INTERACTION', {
      action: 'refresh_fix_applied',
      timestamp: Date.now()
    });
    
  } catch (error) {
    console.error('❌ Trust recording failed:', error);
  }
}

function ensureTrustUIVisible() {
  console.log('👁️ Ensuring trust UI is visible...');
  
  // Check if trust button exists
  let trustButton = document.querySelector('button[title*="Trust"]');
  
  if (!trustButton) {
    console.log('🔧 Trust button not found, creating...');
    
    if (window.RayTrustUI) {
      window.RayTrustUI.init();
      
      // Wait and check again
      setTimeout(() => {
        trustButton = document.querySelector('button[title*="Trust"]');
        if (trustButton) {
          console.log('✅ Trust button created successfully');
        } else {
          console.error('❌ Failed to create trust button');
        }
      }, 1000);
    }
  } else {
    console.log('✅ Trust button already exists');
    
    // Ensure it's visible
    const rect = trustButton.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      console.log('🔧 Trust button exists but not visible, fixing...');
      
      trustButton.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 260px !important;
        z-index: 10000 !important;
        background: #2d2d2d !important;
        color: white !important;
        border: 2px solid #555 !important;
        border-radius: 50% !important;
        width: 50px !important;
        height: 50px !important;
        font-size: 18px !important;
        cursor: pointer !important;
        display: block !important;
        visibility: visible !important;
      `;
      
      console.log('✅ Trust button visibility fixed');
    }
  }
  
  // Check if UI is hidden by RayUIToggle
  if (window.RayUIToggle && !window.RayUIToggle.isVisible()) {
    console.log('💡 Ray UI is hidden - trust button may not be visible');
    console.log('💡 Press Ctrl+Shift+H to show Ray UI');
  }
}

function testTrustIntegration() {
  console.log('🔗 Testing trust integration...');
  
  if (!window.RayTrustIntegration) {
    console.error('❌ RayTrustIntegration not available');
    return;
  }
  
  const status = window.RayTrustIntegration.getStatus();
  console.log('Integration status:', status);
  
  if (!status.active) {
    console.log('🔧 Trust integration not active, fixing...');
    
    const success = window.RayTrustIntegration.init();
    if (success) {
      console.log('✅ Trust integration activated');
    } else {
      console.error('❌ Trust integration activation failed');
    }
  } else {
    console.log('✅ Trust integration is active');
  }
  
  // Test manual trust recording through integration
  try {
    window.RayTrustIntegration.recordPositive({
      test: 'Integration test after refresh'
    });
    console.log('✅ Integration trust recording successful');
  } catch (error) {
    console.error('❌ Integration trust recording failed:', error);
  }
}

function manualTrustInitialization() {
  console.log('🛠️ Attempting manual trust initialization...');
  
  // Initialize core
  if (window.RayTrustCore) {
    try {
      window.RayTrustCore.init();
      console.log('✅ Trust core manually initialized');
    } catch (error) {
      console.error('❌ Trust core manual initialization failed:', error);
    }
  }
  
  // Initialize UI
  if (window.RayTrustUI) {
    try {
      window.RayTrustUI.init();
      console.log('✅ Trust UI manually initialized');
    } catch (error) {
      console.error('❌ Trust UI manual initialization failed:', error);
    }
  }
  
  // Initialize integration
  if (window.RayTrustIntegration) {
    try {
      window.RayTrustIntegration.init();
      console.log('✅ Trust integration manually initialized');
    } catch (error) {
      console.error('❌ Trust integration manual initialization failed:', error);
    }
  }
}

function createBackupTrustButton() {
  console.log('🆘 Creating backup trust button...');
  
  // Remove any existing backup
  const existing = document.querySelector('#backupTrustButton');
  if (existing) existing.remove();
  
  // Create backup button
  const backupButton = document.createElement('button');
  backupButton.id = 'backupTrustButton';
  backupButton.innerHTML = '🤝';
  backupButton.title = 'Ray Trust (Backup)';
  backupButton.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 200px !important;
    z-index: 999999 !important;
    background: #ff6b6b !important;
    color: white !important;
    border: 2px solid #fff !important;
    border-radius: 50% !important;
    width: 50px !important;
    height: 50px !important;
    font-size: 18px !important;
    cursor: pointer !important;
    display: block !important;
    visibility: visible !important;
    animation: pulse 2s infinite !important;
  `;
  
  // Add pulse animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { box-shadow: 0 4px 20px rgba(255,107,107,0.5); }
      50% { box-shadow: 0 4px 30px rgba(255,107,107,0.8); }
      100% { box-shadow: 0 4px 20px rgba(255,107,107,0.5); }
    }
  `;
  document.head.appendChild(style);
  
  backupButton.addEventListener('click', () => {
    if (window.RayTrustUI) {
      window.RayTrustUI.show();
      console.log('✅ Trust UI shown via backup button');
    } else {
      alert('Trust system not available');
    }
  });
  
  document.body.appendChild(backupButton);
  console.log('✅ Backup trust button created (red, pulsing)');
}

// Main fix function
function runTrustRefreshFix() {
  console.log('🚀 Running Trust System Refresh Fix...');
  
  // Wait a moment for systems to load
  setTimeout(() => {
    const success = fixTrustSystemAfterRefresh();
    
    if (!success) {
      // Create backup button if main fix fails
      setTimeout(() => {
        createBackupTrustButton();
      }, 2000);
    }
  }, 1000);
  
  console.log('✅ Trust refresh fix initiated');
  console.log('💡 Watch console for results...');
}

// Auto-run the fix
runTrustRefreshFix();

// Expose functions for manual use
window.fixTrustSystemAfterRefresh = fixTrustSystemAfterRefresh;
window.testTrustRecording = testTrustRecording;
window.ensureTrustUIVisible = ensureTrustUIVisible;
window.testTrustIntegration = testTrustIntegration;
window.createBackupTrustButton = createBackupTrustButton;
window.runTrustRefreshFix = runTrustRefreshFix;

console.log('\n💡 Available manual fix functions:');
console.log('- fixTrustSystemAfterRefresh()');
console.log('- testTrustRecording()');
console.log('- ensureTrustUIVisible()');
console.log('- testTrustIntegration()');
console.log('- createBackupTrustButton()');
console.log('- runTrustRefreshFix()');