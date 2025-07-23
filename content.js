/**
 * Genesis Loop - ChatGPT Automation Extension
 * Main content script that runs on ChatGPT pages
 */

// Immediately-invoked function expression to avoid polluting global namespace
(function () {
  /**
   * Initialize the extension
   */
  function initialize() {
    setTimeout(ToggleButton.createToggleButton, 1500);
  }

  // Initialize on page load
  window.addEventListener("load", initialize);

  // Also try on DOM content loaded
  document.addEventListener("DOMContentLoaded", initialize);

  // Handle URL changes (for SPA navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      // Stop any existing loop
      MessageLoop.stopLoop();
      // Create button again after a delay
      setTimeout(ToggleButton.createToggleButton, 1500);
    }
  }).observe(document, { subtree: true, childList: true });
})();
