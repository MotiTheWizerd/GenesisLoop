// Fix toggle button visibility - make it clearly visible in top-right corner
(function() {
  'use strict';
  
  console.log('🔧 Fixing toggle button visibility...');
  
  // Find the toggle button
  const toggleButton = document.querySelector('button[title*="Toggle"]') || 
                      document.querySelector('button:contains("▶️")') ||
                      Array.from(document.querySelectorAll('button')).find(btn => 
                        btn.textContent.includes('▶️') || btn.textContent.includes('⏹️')
                      );
  
  if (toggleButton) {
    console.log('✅ Found toggle button, applying visibility fixes...');
    
    // Force it to top-right corner with high z-index
    toggleButton.style.cssText = `
      position: fixed !important;
      top: 100px !important;
      right: 100px !important;
      z-index: 999999 !important;
      background: #ff6b35 !important;
      color: white !important;
      border: 3px solid #ff8c42 !important;
      border-radius: 12px !important;
      padding: 12px 20px !important;
      font-size: 18px !important;
      font-weight: bold !important;
      cursor: pointer !important;
      box-shadow: 0 4px 20px rgba(255, 107, 53, 0.6) !important;
      transition: all 0.3s ease !important;
      min-width: 120px !important;
      min-height: 50px !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    `;
    
    // Add hover effect
    toggleButton.addEventListener('mouseenter', () => {
      toggleButton.style.transform = 'scale(1.1)';
      toggleButton.style.boxShadow = '0 6px 25px rgba(255, 107, 53, 0.8)';
    });
    
    toggleButton.addEventListener('mouseleave', () => {
      toggleButton.style.transform = 'scale(1)';
      toggleButton.style.boxShadow = '0 4px 20px rgba(255, 107, 53, 0.6)';
    });
    
    console.log('✅ Toggle button visibility fixed!');
    console.log('📍 Button location: top-right corner (100px from edges)');
    console.log('🎨 Button style: Orange with glow effect');
    
  } else {
    console.warn('⚠️ Toggle button not found, creating a new one...');
    
    // Create a new toggle button if not found
    const newButton = document.createElement('button');
    newButton.textContent = '▶️ RAY TOGGLE';
    newButton.title = 'Toggle Ray Message Loop';
    
    newButton.style.cssText = `
      position: fixed !important;
      top: 100px !important;
      right: 100px !important;
      z-index: 999999 !important;
      background: #ff6b35 !important;
      color: white !important;
      border: 3px solid #ff8c42 !important;
      border-radius: 12px !important;
      padding: 12px 20px !important;
      font-size: 18px !important;
      font-weight: bold !important;
      cursor: pointer !important;
      box-shadow: 0 4px 20px rgba(255, 107, 53, 0.6) !important;
      transition: all 0.3s ease !important;
      min-width: 120px !important;
      min-height: 50px !important;
    `;
    
    // Add click handler
    newButton.onclick = () => {
      if (window.ToggleButton && window.ToggleButton.createToggleButton) {
        console.log('🔘 Manual toggle button clicked');
        // Try to trigger the original toggle logic
        if (window.MessageLoop) {
          if (window.MessageLoop.isRunning) {
            window.MessageLoop.stopLoop();
            newButton.textContent = '▶️ RAY TOGGLE';
          } else {
            window.MessageLoop.startLoop();
            window.MessageLoop.waitForFirstResponse();
            newButton.textContent = '⏹️ RAY TOGGLE';
          }
        }
      }
    };
    
    document.body.appendChild(newButton);
    console.log('✅ New toggle button created and positioned!');
  }
  
})();