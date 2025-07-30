(function() {
  'use strict';
  
  // DOM Control System - Main Entry Point
  function initializeDOMControl() {
    console.log('🧱 Initializing DOM Control System...');
    
    if (!window.DOMRetriever || !window.DOMController) {
      console.warn('⚠️ DOM Control dependencies not loaded yet, retrying...');
      setTimeout(initializeDOMControl, 100);
      return;
    }
    
    // Initialize all DOM control components
    window.DOMRetriever.initialize();
    window.DOMController.initialize();
    
    console.log('✅ DOM Control System initialized successfully');
  }
  
  // Expose main initializer
  window.DOMControlSystem = {
    initialize: initializeDOMControl
  };
  
  console.log('✅ DOMControlSystem loaded');
})();