/**
 * Genesis Loop - ChatGPT Automation Extension
 * Main content script that runs on ChatGPT pages
 */

// Global references to our modules
let DOMUtils, Constants, MessageSender, MessageLoop, ToggleButton;

// Load all module scripts
function loadModules() {
  // First, load the utility scripts
  loadScript('js/utils/constants.js', function() {
    loadScript('js/utils/domUtils.js', function() {
      // Then load the component scripts
      loadScript('js/components/MessageSender.js', function() {
        loadScript('js/components/MessageLoop.js', function() {
          loadScript('js/components/ToggleButton.js', function() {
            // All scripts loaded, initialize the extension
            initialize();
          });
        });
      });
    });
  });
}

// Helper function to load a script
function loadScript(src, callback) {
  // Create a script element
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(src);
  script.onload = function() {
    // Remove the script element once loaded
    this.remove();
    if (callback) callback();
  };
  // Append the script to the document
  (document.head || document.documentElement).appendChild(script);
}

// Initialize the extension
function initialize() {
  // Create the toggle button after a delay to ensure DOM is ready
  setTimeout(function() {
    if (typeof ToggleButton !== 'undefined' && ToggleButton.createToggleButton) {
      ToggleButton.createToggleButton();
    } else {
      console.error("ToggleButton module not loaded correctly");
    }
  }, 1500);
  
  // Handle URL changes (for SPA navigation)
  let lastUrl = location.href;
  new MutationObserver(function() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      // Stop any existing loop
      if (typeof MessageLoop !== 'undefined' && MessageLoop.stopLoop) {
        MessageLoop.stopLoop();
      }
      // Create button again after a delay
      setTimeout(function() {
        if (typeof ToggleButton !== 'undefined' && ToggleButton.createToggleButton) {
          ToggleButton.createToggleButton();
        }
      }, 1500);
    }
  }).observe(document, { subtree: true, childList: true });
}

// Initialize on page load
window.addEventListener("load", loadModules);

// Also try on DOM content loaded
document.addEventListener("DOMContentLoaded", loadModules);