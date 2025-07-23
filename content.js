/**
 * Genesis Loop - ChatGPT Automation Extension
 * Main content script that runs on ChatGPT pages
 */

// Immediately-invoked function expression to avoid polluting global namespace
(function () {
  console.log("🚀 Content script starting...");
  
  /**
   * Initialize the extension
   */
  function initialize() {
    console.log("🚀 Initializing Genesis Loop extension");
    console.log("Current URL:", window.location.href);
    
    // Check if we're on the right page
    if (!window.location.href.includes('chat.openai.com') && !window.location.href.includes('chatgpt.com')) {
      console.log("⚠️ Not on ChatGPT page, skipping initialization");
      return;
    }
    
    // Use the dependency loader to wait for all dependencies
    if (typeof window.DependencyLoader !== 'undefined') {
      console.log("✅ DependencyLoader found, waiting for dependencies");
      window.DependencyLoader.waitForDependencies(() => {
        console.log("✅ Dependencies ready, creating toggle button");
        
        // Ensure ResponseTracker exists before creating button
        if (typeof window.ResponseTracker === 'undefined') {
          console.log("🔧 Creating ResponseTracker fallback");
          window.ResponseTracker = {
            responses: [],
            addResponse: function(response) {
              this.responses.unshift({
                text: response,
                timestamp: new Date().toISOString()
              });
              console.log("📝 Fallback: Stored response");
            },
            getResponses: function() { return this.responses; },
            clearResponses: function() { this.responses = []; }
          };
        }
        
        setTimeout(window.ToggleButton.createToggleButton, 1500);
      });
    } else {
      console.log("⚠️ DependencyLoader not available, will retry initialization");
      setTimeout(initialize, 1000);
    }
  }

  // Initialize immediately if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

  // Also try on page load as backup
  window.addEventListener("load", initialize);

  // Handle URL changes (for SPA navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      // Stop any existing loop
      if (window.MessageLoop) {
        window.MessageLoop.stopLoop();
      }
      // Create button again after a delay
      setTimeout(() => {
        if (window.ToggleButton) {
          window.ToggleButton.createToggleButton();
        }
      }, 1500);
    }
  }).observe(document, { subtree: true, childList: true });
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getResponses") {
      // Return the stored responses
      if (window.ResponseTracker) {
        sendResponse({responses: window.ResponseTracker.getResponses()});
      } else {
        sendResponse({responses: []});
      }
      return true; // Required for async response
    }
  });
})();