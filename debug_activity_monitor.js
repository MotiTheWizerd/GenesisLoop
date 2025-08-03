// Debug Activity Monitor Visibility
// Run this in browser console to diagnose activity monitor issues

console.log('🔍 Debugging Ray Activity Monitor visibility...');

function checkActivityMonitorStatus() {
  console.log('\n=== Activity Monitor Debug ===');
  
  // Check if module is loaded
  if (window.RayActivityMonitor) {
    console.log('✅ RayActivityMonitor module is loaded');
    
    // Check available methods
    console.log('Available methods:', Object.keys(window.RayActivityMonitor));
    
    // Try to get stats
    try {
      const stats = window.RayActivityMonitor.stats();
      console.log('📊 Activity stats:', stats);
    } catch (error) {
      console.error('❌ Error getting stats:', error);
    }
    
  } else {
    console.error('❌ RayActivityMonitor module NOT loaded');
    return;
  }
  
  // Check for monitor button in DOM
  const monitorButton = document.querySelector('button[title="Ray Activity Monitor"]');
  if (monitorButton) {
    console.log('✅ Monitor button found in DOM');
    console.log('Button styles:', {
      position: monitorButton.style.position,
      top: monitorButton.style.top,
      right: monitorButton.style.right,
      zIndex: monitorButton.style.zIndex,
      display: monitorButton.style.display,
      visibility: monitorButton.style.visibility
    });
    
    // Check if button is visible
    const rect = monitorButton.getBoundingClientRect();
    console.log('Button position:', rect);
    
    if (rect.width === 0 || rect.height === 0) {
      console.warn('⚠️ Button has zero dimensions');
    }
    
    if (rect.top < 0 || rect.left < 0 || rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
      console.warn('⚠️ Button is positioned outside viewport');
    }
    
  } else {
    console.error('❌ Monitor button NOT found in DOM');
    
    // Check for any buttons with 📊 emoji
    const allButtons = Array.from(document.querySelectorAll('button'));
    const chartButtons = allButtons.filter(btn => btn.innerHTML.includes('📊'));
    console.log('Buttons with 📊 emoji:', chartButtons.length);
    
    if (chartButtons.length > 0) {
      chartButtons.forEach((btn, index) => {
        console.log(`Button ${index}:`, {
          innerHTML: btn.innerHTML,
          title: btn.title,
          styles: btn.style.cssText
        });
      });
    }
  }
  
  // Check for monitor panel
  const monitorPanels = Array.from(document.querySelectorAll('div')).filter(div => 
    div.textContent.includes('Ray Activity Monitor')
  );
  
  if (monitorPanels.length > 0) {
    console.log('✅ Monitor panel found in DOM');
    monitorPanels.forEach((panel, index) => {
      console.log(`Panel ${index} display:`, panel.style.display);
    });
  } else {
    console.log('❌ Monitor panel NOT found in DOM');
  }
}

function forceCreateActivityMonitor() {
  console.log('\n🔧 Force creating activity monitor...');
  
  if (!window.RayActivityMonitor) {
    console.error('❌ RayActivityMonitor module not available');
    return;
  }
  
  try {
    // Try to initialize
    window.RayActivityMonitor.init();
    console.log('✅ Activity monitor initialization attempted');
    
    // Wait a moment then check again
    setTimeout(() => {
      checkActivityMonitorStatus();
    }, 1000);
    
  } catch (error) {
    console.error('❌ Error initializing activity monitor:', error);
  }
}

function createManualActivityButton() {
  console.log('\n🛠️ Creating manual activity monitor button...');
  
  // Remove any existing manual buttons
  const existingManual = document.querySelector('#manualActivityButton');
  if (existingManual) {
    existingManual.remove();
  }
  
  // Create manual button
  const manualButton = document.createElement('button');
  manualButton.id = 'manualActivityButton';
  manualButton.innerHTML = '📊 MANUAL';
  manualButton.title = 'Manual Activity Monitor';
  manualButton.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 99999;
    background: #ff4444;
    color: white;
    border: 2px solid #fff;
    border-radius: 8px;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  `;
  
  manualButton.addEventListener('click', () => {
    if (window.RayActivityMonitor) {
      window.RayActivityMonitor.show();
      console.log('📊 Manually showing activity monitor');
    } else {
      alert('RayActivityMonitor not available');
    }
  });
  
  document.body.appendChild(manualButton);
  console.log('✅ Manual activity button created at top-right');
}

function testActivityLogging() {
  console.log('\n📝 Testing activity logging...');
  
  if (!window.RayActivityMonitor) {
    console.error('❌ RayActivityMonitor not available');
    return;
  }
  
  // Log some test activities
  window.RayActivityMonitor.log('DEBUG_TEST', { message: 'Testing activity logging' });
  window.RayActivityMonitor.log('VISIBILITY_TEST', { action: 'Checking monitor visibility' });
  window.RayActivityMonitor.log('MANUAL_TEST', { user: 'Ray', action: 'Manual debugging' });
  
  console.log('✅ Test activities logged');
  
  // Show the monitor
  window.RayActivityMonitor.show();
}

// Run initial check
checkActivityMonitorStatus();

// Expose functions for manual testing
window.checkActivityMonitorStatus = checkActivityMonitorStatus;
window.forceCreateActivityMonitor = forceCreateActivityMonitor;
window.createManualActivityButton = createManualActivityButton;
window.testActivityLogging = testActivityLogging;

console.log('\n🎯 Available debug functions:');
console.log('- checkActivityMonitorStatus() - Check current status');
console.log('- forceCreateActivityMonitor() - Force recreation');
console.log('- createManualActivityButton() - Create backup button');
console.log('- testActivityLogging() - Test logging and show monitor');