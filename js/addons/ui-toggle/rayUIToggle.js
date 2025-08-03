(function() {
  'use strict';

  let uiToggleButton = null;
  let rayUIVisible = true;
  let hiddenElements = [];

  function createUIToggleButton() {
    if (uiToggleButton) {
      return uiToggleButton;
    }

    // Create UI toggle button - positioned at far left for easy access
    uiToggleButton = document.createElement('button');
    uiToggleButton.innerHTML = '👁️';
    uiToggleButton.title = 'Toggle Ray UI Visibility';
    uiToggleButton.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 10002;
      background: #2d2d2d;
      color: white;
      border: 2px solid #555;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;

    // Add hover effects
    uiToggleButton.addEventListener('mouseenter', () => {
      uiToggleButton.style.background = '#404040';
      uiToggleButton.style.transform = 'scale(1.1)';
    });

    uiToggleButton.addEventListener('mouseleave', () => {
      uiToggleButton.style.background = rayUIVisible ? '#2d2d2d' : '#666';
      uiToggleButton.style.transform = 'scale(1)';
    });

    // Add click handler
    uiToggleButton.addEventListener('click', () => {
      toggleRayUI();
    });

    // Append to body
    document.body.appendChild(uiToggleButton);

    console.log('✅ [UI Toggle] Ray UI toggle button created');
    return uiToggleButton;
  }

  function toggleRayUI() {
    if (rayUIVisible) {
      hideRayUI();
    } else {
      showRayUI();
    }
  }

  function hideRayUI() {
    console.log('👁️ [UI Toggle] Hiding Ray UI elements...');
    
    // Find all Ray UI elements with improved detection
    const rayUISelectors = [
      '#ray-clock-display',                    // Clock display
      'button[title*="Ray Power Control"]',    // Power button
      'button[title="Ray Control Panel"]',     // Control panel button
      'button[title="Ray Voice Settings"]',    // Voice settings button
      'button[title*="Ray Voice"]',            // Voice synthesis button
      'button[title*="Voice Recognition"]',    // Voice recognition button
      'button[title*="Toggle"]',               // Toggle button
      '[id*="ray-"]',                          // Any element with ray- id
      '[class*="ray-"]',                       // Any element with ray- class
      'button[style*="position: fixed"][style*="right:"]' // Fixed positioned buttons on right
    ];

    hiddenElements = [];

    rayUISelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        // Skip the UI toggle button itself
        if (element === uiToggleButton) return;
        
        // Store original display style
        const originalDisplay = element.style.display || 'block';
        element.setAttribute('data-ray-original-display', originalDisplay);
        
        // Hide the element
        element.style.display = 'none';
        hiddenElements.push(element);
      });
    });

    // Update toggle button state
    rayUIVisible = false;
    uiToggleButton.style.background = '#666';
    uiToggleButton.style.borderColor = '#888';
    uiToggleButton.innerHTML = '🙈';
    uiToggleButton.title = 'Show Ray UI (Hidden)';

    console.log(`👁️ [UI Toggle] Hidden ${hiddenElements.length} Ray UI elements`);
  }

  function showRayUI() {
    console.log('👁️ [UI Toggle] Showing Ray UI elements...');
    
    // Restore all hidden elements
    hiddenElements.forEach(element => {
      const originalDisplay = element.getAttribute('data-ray-original-display') || 'block';
      element.style.display = originalDisplay;
      element.removeAttribute('data-ray-original-display');
    });

    // Update toggle button state
    rayUIVisible = true;
    uiToggleButton.style.background = '#2d2d2d';
    uiToggleButton.style.borderColor = '#555';
    uiToggleButton.innerHTML = '👁️';
    uiToggleButton.title = 'Hide Ray UI (Visible)';

    console.log(`👁️ [UI Toggle] Restored ${hiddenElements.length} Ray UI elements`);
    hiddenElements = [];
  }

  function isRayUIVisible() {
    return rayUIVisible;
  }

  function setRayUIVisibility(visible) {
    if (visible !== rayUIVisible) {
      toggleRayUI();
    }
  }

  // Keyboard shortcut support
  function setupKeyboardShortcut() {
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + Shift + H to toggle Ray UI
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'H') {
        event.preventDefault();
        toggleRayUI();
        
        // Show brief notification
        showToggleNotification();
      }
    });

    console.log('⌨️ [UI Toggle] Keyboard shortcut enabled: Ctrl+Shift+H');
  }

  function showToggleNotification() {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      left: 20px;
      z-index: 10003;
      background: #333;
      color: white;
      padding: 10px 15px;
      border-radius: 10px;
      font-size: 14px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      transition: opacity 0.3s ease;
    `;
    
    notification.textContent = rayUIVisible ? 'Ray UI Visible' : 'Ray UI Hidden';
    document.body.appendChild(notification);

    // Fade out and remove
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 1500);
  }

  // Auto-hide feature for clean screenshots
  function enableAutoHide(duration = 10000) {
    console.log(`👁️ [UI Toggle] Auto-hide enabled for ${duration}ms`);
    
    hideRayUI();
    
    setTimeout(() => {
      showRayUI();
      console.log('👁️ [UI Toggle] Auto-hide expired, UI restored');
    }, duration);
  }

  function getUIToggleStatus() {
    return {
      visible: rayUIVisible,
      hiddenElementsCount: hiddenElements.length,
      toggleButtonExists: uiToggleButton !== null
    };
  }

  function initUIToggle() {
    console.log('👁️ [UI Toggle] Initializing Ray UI toggle system...');
    
    // Create toggle button immediately
    createUIToggleButton();
    setupKeyboardShortcut();
    
    console.log('✅ [UI Toggle] Ray UI toggle system ready');
    console.log('👁️ [UI Toggle] Click the eye button (👁️) or press Ctrl+Shift+H to toggle UI');
  }

  function removeUIToggle() {
    if (uiToggleButton) {
      uiToggleButton.remove();
      uiToggleButton = null;
    }
    
    // Restore any hidden elements
    if (!rayUIVisible) {
      showRayUI();
    }
    
    console.log('🗑️ [UI Toggle] UI toggle system removed');
  }

  // Expose module
  window.RayUIToggle = {
    init: initUIToggle,
    toggle: toggleRayUI,
    hide: hideRayUI,
    show: showRayUI,
    isVisible: isRayUIVisible,
    setVisibility: setRayUIVisibility,
    autoHide: enableAutoHide,
    status: getUIToggleStatus,
    remove: removeUIToggle
  };

  console.log('✅ RayUIToggle loaded');
})();