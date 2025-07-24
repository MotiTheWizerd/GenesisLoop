/**
 * DOM Utilities Module
 * Main entry point for DOM-related utility functions
 */
(function() {
  'use strict';

  // Wait for all sub-modules to be loaded
  function initializeDOMUtils() {
    // Check if all required modules are loaded
    if (typeof window.ResponseObserver === 'undefined' ||
        typeof window.ElementFinder === 'undefined' ||
        typeof window.DebugUtils === 'undefined') {
      // Wait a bit more for modules to load
      setTimeout(initializeDOMUtils, 100);
      return;
    }

    // Create the main DOMUtils object
    const DOMUtils = {
      waitForResponse: window.ResponseObserver.waitForResponse,
      findRequiredElements: window.ElementFinder.findRequiredElements,
      debugElements: window.DebugUtils.debugElements,
      debugMessageStructure: window.DebugUtils.debugMessageStructure
    };

    // Attach to window for global access
    window.DOMUtils = DOMUtils;
    
    // Also attach directly to window for backward compatibility
    window.waitForResponse = DOMUtils.waitForResponse;
    window.findRequiredElements = DOMUtils.findRequiredElements;
    window.debugElements = DOMUtils.debugElements;
    window.debugMessageStructure = DOMUtils.debugMessageStructure;
    
    console.log('✅ DOMUtils initialized and attached to window');
  }

  // Start initialization
  initializeDOMUtils();
})();
