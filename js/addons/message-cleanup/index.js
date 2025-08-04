/**
 * Message Cleanup Addon - Index
 * Entry point for the message cleanup system
 */
(function() {
  'use strict';
  
  console.log('🧹 Message Cleanup addon initializing...');
  
  // Wait for dependencies and initialize
  function initializeMessageCleanup() {
    try {
      // Check if MessageCleanup is available
      if (typeof window.MessageCleanup === 'undefined') {
        console.error('❌ MessageCleanup module not loaded');
        return;
      }
      
      console.log('✅ Message Cleanup addon initialized successfully');
      
      // Log initial stats
      const stats = window.MessageCleanup.getMessageStats();
      console.log('📊 Initial message stats:', stats);
      
      // Set up event listeners for integration with other systems
      document.addEventListener('rayResponseTracked', (event) => {
        // When a new response is tracked, check if cleanup is needed
        const stats = window.MessageCleanup.getMessageStats();
        if (stats.message_pairs > 6) {
          console.log('🧹 New response detected, checking cleanup...');
          setTimeout(() => {
            window.MessageCleanup.cleanupMessages();
          }, 2000);
        }
      });
      
      // Integration with Ray systems
      if (window.RayDOMInterface) {
        console.log('🔗 Integrating with Ray DOM Interface');
      }
      
    } catch (error) {
      console.error('❌ Error initializing Message Cleanup addon:', error);
    }
  }
  
  // Initialize after a short delay to ensure dependencies are loaded
  setTimeout(initializeMessageCleanup, 1000);
  
})();