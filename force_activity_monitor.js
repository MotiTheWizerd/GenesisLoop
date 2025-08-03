// Force Activity Monitor to Appear
// Run this in browser console to force create the activity monitor

console.log('🚀 Force creating Ray Activity Monitor...');

function forceActivityMonitor() {
  // Remove any existing buttons first
  const existingButtons = document.querySelectorAll('button[title="Ray Activity Monitor"]');
  existingButtons.forEach(btn => btn.remove());
  
  const existingPanels = Array.from(document.querySelectorAll('div')).filter(div => 
    div.textContent.includes('Ray Activity Monitor')
  );
  existingPanels.forEach(panel => panel.remove());

  // Create the button manually
  const button = document.createElement('button');
  button.innerHTML = '📊';
  button.title = 'Ray Activity Monitor (FORCED)';
  button.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    z-index: 999999 !important;
    background: #2d2d2d !important;
    color: white !important;
    border: 2px solid #00ff88 !important;
    border-radius: 50% !important;
    width: 60px !important;
    height: 60px !important;
    font-size: 24px !important;
    cursor: pointer !important;
    box-shadow: 0 4px 20px rgba(0,255,136,0.5) !important;
    display: block !important;
    visibility: visible !important;
  `;

  // Create the panel
  const panel = document.createElement('div');
  panel.style.cssText = `
    position: fixed !important;
    top: 90px !important;
    right: 20px !important;
    z-index: 999998 !important;
    background: #1a1a1a !important;
    color: white !important;
    border: 2px solid #00ff88 !important;
    border-radius: 15px !important;
    width: 400px !important;
    height: 500px !important;
    display: none !important;
    font-family: 'Courier New', monospace !important;
    box-shadow: 0 4px 20px rgba(0,255,136,0.3) !important;
  `;

  panel.innerHTML = `
    <div style="padding: 15px; background: #333; border-bottom: 1px solid #00ff88; display: flex; justify-content: space-between; align-items: center;">
      <h3 style="margin: 0; color: #00ff88; font-size: 16px;">📊 Ray Activity Monitor (FORCED)</h3>
      <button id="closeForced" style="background: none; border: none; color: #aaa; font-size: 18px; cursor: pointer;">×</button>
    </div>
    
    <div style="padding: 15px; color: white;">
      <div style="margin-bottom: 15px;">
        <div style="color: #00ff88; font-weight: bold;">🎯 Monitor Status: ACTIVE</div>
        <div style="color: #aaa; font-size: 12px; margin-top: 5px;">
          This is a forced version of the activity monitor to test visibility.
        </div>
      </div>
      
      <div style="background: #0d1117; border: 1px solid #333; border-radius: 5px; padding: 15px; height: 350px; overflow-y: auto;">
        <div style="color: #00ff88; margin-bottom: 10px;">🔧 Debug Information:</div>
        <div style="color: #aaa; font-size: 11px; line-height: 1.6;">
          • Monitor button created at: ${new Date().toLocaleTimeString()}<br>
          • Position: top: 20px, right: 20px<br>
          • Z-index: 999999<br>
          • Viewport size: ${window.innerWidth}x${window.innerHeight}<br>
          • RayActivityMonitor available: ${window.RayActivityMonitor ? 'YES' : 'NO'}<br>
          <br>
          <div style="color: #ff6b6b;">If you can see this panel, the issue is with the original positioning or CSS conflicts.</div>
          <br>
          <div style="color: #4ecdc4;">Try refreshing the extension and reloading the page.</div>
        </div>
      </div>
      
      <div style="margin-top: 10px; display: flex; gap: 10px;">
        <button id="testOriginal" style="background: #4CAF50; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;">Test Original</button>
        <button id="reinitialize" style="background: #2196F3; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;">Reinitialize</button>
      </div>
    </div>
  `;

  // Add event listeners
  button.addEventListener('click', () => {
    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';
    console.log('📊 Forced monitor toggled:', !isVisible ? 'SHOWN' : 'HIDDEN');
  });

  document.getElementById = function(id) {
    return panel.querySelector('#' + id);
  };

  // Close button
  setTimeout(() => {
    const closeBtn = panel.querySelector('#closeForced');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        panel.style.display = 'none';
        console.log('📊 Forced monitor closed');
      });
    }

    // Test original button
    const testBtn = panel.querySelector('#testOriginal');
    if (testBtn) {
      testBtn.addEventListener('click', () => {
        if (window.RayActivityMonitor) {
          console.log('🔧 Testing original RayActivityMonitor...');
          window.RayActivityMonitor.show();
        } else {
          alert('Original RayActivityMonitor not available');
        }
      });
    }

    // Reinitialize button
    const reinitBtn = panel.querySelector('#reinitialize');
    if (reinitBtn) {
      reinitBtn.addEventListener('click', () => {
        if (window.RayActivityMonitor) {
          console.log('🔄 Reinitializing RayActivityMonitor...');
          window.RayActivityMonitor.init();
          setTimeout(() => {
            window.RayActivityMonitor.show();
          }, 500);
        } else {
          alert('RayActivityMonitor not available for reinitialization');
        }
      });
    }
  }, 100);

  // Add to DOM
  document.body.appendChild(button);
  document.body.appendChild(panel);

  console.log('✅ Forced activity monitor created!');
  console.log('📊 Look for the green-bordered button in the top-right corner');
  
  // Auto-show the panel
  setTimeout(() => {
    panel.style.display = 'block';
    console.log('📊 Forced monitor panel shown automatically');
  }, 500);

  return { button, panel };
}

// Create the forced monitor
const forcedMonitor = forceActivityMonitor();

// Also try to initialize the original if available
if (window.RayActivityMonitor) {
  console.log('🔧 Also attempting to initialize original monitor...');
  try {
    window.RayActivityMonitor.init();
    console.log('✅ Original monitor initialization attempted');
  } catch (error) {
    console.error('❌ Original monitor initialization failed:', error);
  }
}

console.log('\n🎯 If you can see the forced monitor but not the original:');
console.log('1. Check for CSS conflicts');
console.log('2. Verify script loading order');
console.log('3. Check browser console for errors');
console.log('4. Try refreshing the extension');