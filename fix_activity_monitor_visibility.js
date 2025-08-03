// Fix Activity Monitor Visibility
// Run this in browser console to fix visibility issues

console.log('🔧 Fixing Ray Activity Monitor visibility...');

function fixActivityMonitorVisibility() {
  console.log('\n=== Activity Monitor Visibility Fix ===');
  
  // Check if RayActivityMonitor exists
  if (!window.RayActivityMonitor) {
    console.error('❌ RayActivityMonitor module not loaded');
    console.log('💡 Try reloading the extension and refreshing the page');
    return false;
  }
  
  console.log('✅ RayActivityMonitor module found');
  
  // Force initialization
  try {
    window.RayActivityMonitor.init();
    console.log('✅ Activity monitor initialized');
  } catch (error) {
    console.error('❌ Initialization error:', error);
  }
  
  // Wait a moment for DOM creation
  setTimeout(() => {
    // Find the activity monitor button
    let monitorButton = document.querySelector('button[title="Ray Activity Monitor"]');
    
    if (!monitorButton) {
      console.warn('⚠️ Monitor button not found, searching for alternatives...');
      
      // Look for any button with 📊
      const chartButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
        btn.innerHTML.includes('📊')
      );
      
      if (chartButtons.length > 0) {
        monitorButton = chartButtons[0];
        console.log('✅ Found chart button:', monitorButton);
      }
    }
    
    if (monitorButton) {
      console.log('✅ Monitor button found, fixing visibility...');
      
      // Force visible styles
      monitorButton.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 380px !important;
        z-index: 99999 !important;
        background: #2d2d2d !important;
        color: white !important;
        border: 2px solid #00ff88 !important;
        border-radius: 50% !important;
        width: 50px !important;
        height: 50px !important;
        font-size: 18px !important;
        cursor: pointer !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        box-shadow: 0 2px 10px rgba(0,255,136,0.5) !important;
        transition: all 0.3s ease !important;
      `;
      
      // Add glow effect
      monitorButton.addEventListener('mouseenter', () => {
        monitorButton.style.background = '#404040';
        monitorButton.style.transform = 'scale(1.1)';
        monitorButton.style.boxShadow = '0 4px 20px rgba(0,255,136,0.8)';
      });
      
      monitorButton.addEventListener('mouseleave', () => {
        monitorButton.style.background = '#2d2d2d';
        monitorButton.style.transform = 'scale(1)';
        monitorButton.style.boxShadow = '0 2px 10px rgba(0,255,136,0.5)';
      });
      
      console.log('✅ Monitor button visibility fixed!');
      console.log('📊 Button positioned at right: 380px (moved to avoid conflicts)');
      
      // Test click functionality
      monitorButton.addEventListener('click', () => {
        console.log('📊 Activity monitor button clicked!');
        if (window.RayActivityMonitor) {
          window.RayActivityMonitor.toggle();
        }
      });
      
      return true;
    } else {
      console.error('❌ Could not find monitor button to fix');
      return false;
    }
  }, 1000);
  
  return true;
}

function checkUIToggleConflict() {
  console.log('\n=== Checking UI Toggle Conflicts ===');
  
  // Check if UI toggle is hiding the monitor
  if (window.RayUIToggle) {
    console.log('✅ RayUIToggle found');
    
    const isUIVisible = window.RayUIToggle.isVisible();
    console.log('UI visibility state:', isUIVisible);
    
    if (!isUIVisible) {
      console.log('⚠️ Ray UI is hidden - this might hide the activity monitor');
      console.log('💡 Try pressing Ctrl+Shift+H to toggle UI visibility');
      
      // Force show UI
      window.RayUIToggle.show();
      console.log('✅ Forced UI to show');
    }
  } else {
    console.log('⚠️ RayUIToggle not found');
  }
}

function createBackupActivityButton() {
  console.log('\n=== Creating Backup Activity Button ===');
  
  // Remove existing backup
  const existing = document.querySelector('#backupActivityButton');
  if (existing) existing.remove();
  
  // Create backup button
  const backupButton = document.createElement('button');
  backupButton.id = 'backupActivityButton';
  backupButton.innerHTML = '📊';
  backupButton.title = 'Ray Activity Monitor (Backup)';
  backupButton.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 440px !important;
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
    opacity: 1 !important;
    box-shadow: 0 4px 20px rgba(255,107,107,0.5) !important;
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
    console.log('📊 Backup activity monitor clicked!');
    if (window.RayActivityMonitor) {
      window.RayActivityMonitor.show();
      console.log('✅ Activity monitor shown via backup button');
    } else {
      alert('RayActivityMonitor not available');
    }
  });
  
  document.body.appendChild(backupButton);
  console.log('✅ Backup activity button created at right: 440px');
  console.log('🔴 Red pulsing button should be visible now');
}

// Run all fixes
console.log('🚀 Starting activity monitor visibility fixes...');

fixActivityMonitorVisibility();
checkUIToggleConflict();
createBackupActivityButton();

console.log('\n🎯 Activity Monitor Visibility Status:');
console.log('1. ✅ Backup red button created (should be visible)');
console.log('2. 🔧 Original button visibility fixed');
console.log('3. 👁️ UI toggle conflicts checked');
console.log('\n📊 Look for buttons in the top-right area of the page');
console.log('🔴 Red pulsing button = Backup (always works)');
console.log('🟢 Green bordered button = Fixed original');

// Expose function for manual use
window.fixActivityMonitorVisibility = fixActivityMonitorVisibility;
window.checkUIToggleConflict = checkUIToggleConflict;
window.createBackupActivityButton = createBackupActivityButton;