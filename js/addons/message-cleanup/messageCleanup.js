/**
 * Message Cleanup Module
 * Manages ChatGPT conversation history to prevent page performance issues
 * Keeps only the last N messages to maintain optimal performance
 */
(function() {
  'use strict';
  
  console.log('🧹 MessageCleanup module starting to load...');

  // Configuration
  const CONFIG = {
    MAX_MESSAGES: 5, // Keep last 5 message pairs (user + assistant)
    CLEANUP_INTERVAL: 30000, // Check every 30 seconds
    MIN_MESSAGES_BEFORE_CLEANUP: 8, // Only cleanup if more than 8 messages exist
    PRESERVE_CURRENT_RESPONSE: true // Don't cleanup while AI is responding
  };

  let cleanupInterval = null;
  let isCleanupActive = false;

  /**
   * Get all message elements in chronological order
   * @returns {Array} Array of message elements
   */
  function getAllMessages() {
    try {
      // Get both user and assistant messages
      const userMessages = Array.from(document.querySelectorAll('[data-message-author-role="user"]'));
      const assistantMessages = Array.from(document.querySelectorAll('[data-message-author-role="assistant"]'));
      
      // Combine and sort by DOM position
      const allMessages = [...userMessages, ...assistantMessages];
      
      // Sort by their position in the DOM
      allMessages.sort((a, b) => {
        const position = a.compareDocumentPosition(b);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
          return -1;
        } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
          return 1;
        }
        return 0;
      });
      
      return allMessages;
    } catch (error) {
      console.error('❌ Error getting all messages:', error);
      return [];
    }
  }

  /**
   * Check if AI is currently responding
   * @returns {boolean} True if AI is responding
   */
  function isAIResponding() {
    try {
      // Check for typing indicators or streaming response
      const typingIndicator = document.querySelector('[data-testid="typing-indicator"]');
      const streamingResponse = document.querySelector('.result-streaming');
      const stopButton = document.querySelector('[data-testid="stop-button"]');
      
      return !!(typingIndicator || streamingResponse || stopButton);
    } catch (error) {
      console.error('❌ Error checking AI response status:', error);
      return false;
    }
  }

  /**
   * Get message pairs (user message + corresponding assistant response)
   * @param {Array} messages Array of all message elements
   * @returns {Array} Array of message pairs
   */
  function getMessagePairs(messages) {
    const pairs = [];
    let currentPair = { user: null, assistant: null };
    
    for (const message of messages) {
      const role = message.getAttribute('data-message-author-role');
      
      if (role === 'user') {
        // If we have a previous pair, save it
        if (currentPair.user || currentPair.assistant) {
          pairs.push(currentPair);
        }
        // Start new pair
        currentPair = { user: message, assistant: null };
      } else if (role === 'assistant') {
        currentPair.assistant = message;
      }
    }
    
    // Add the last pair if it exists
    if (currentPair.user || currentPair.assistant) {
      pairs.push(currentPair);
    }
    
    return pairs;
  }

  /**
   * Remove old messages while preserving the most recent ones
   * @param {number} keepCount Number of message pairs to keep
   * @returns {Object} Cleanup results
   */
  function cleanupMessages(keepCount = CONFIG.MAX_MESSAGES) {
    try {
      console.log(`🧹 Starting message cleanup (keeping last ${keepCount} pairs)...`);
      
      // Don't cleanup if AI is responding
      if (CONFIG.PRESERVE_CURRENT_RESPONSE && isAIResponding()) {
        console.log('⏸️ AI is responding, skipping cleanup');
        return { cleaned: 0, kept: 0, skipped: true };
      }
      
      const allMessages = getAllMessages();
      console.log(`📊 Found ${allMessages.length} total messages`);
      
      // Don't cleanup if we don't have enough messages
      if (allMessages.length <= CONFIG.MIN_MESSAGES_BEFORE_CLEANUP) {
        console.log(`⏸️ Only ${allMessages.length} messages, no cleanup needed`);
        return { cleaned: 0, kept: allMessages.length, skipped: true };
      }
      
      const messagePairs = getMessagePairs(allMessages);
      console.log(`📊 Found ${messagePairs.length} message pairs`);
      
      if (messagePairs.length <= keepCount) {
        console.log(`⏸️ Only ${messagePairs.length} pairs, no cleanup needed`);
        return { cleaned: 0, kept: messagePairs.length, skipped: true };
      }
      
      // Calculate how many pairs to remove
      const pairsToRemove = messagePairs.length - keepCount;
      const pairsToDelete = messagePairs.slice(0, pairsToRemove);
      
      console.log(`🗑️ Removing ${pairsToRemove} oldest message pairs...`);
      
      let cleanedCount = 0;
      
      // Remove old message pairs
      for (const pair of pairsToDelete) {
        try {
          if (pair.user) {
            // Find the parent container that holds the entire message
            const userContainer = pair.user.closest('[data-testid*="conversation-turn"]') || 
                                 pair.user.closest('div[class*="group"]') || 
                                 pair.user.parentElement;
            if (userContainer) {
              userContainer.remove();
              cleanedCount++;
            }
          }
          
          if (pair.assistant) {
            // Find the parent container that holds the entire message
            const assistantContainer = pair.assistant.closest('[data-testid*="conversation-turn"]') || 
                                      pair.assistant.closest('div[class*="group"]') || 
                                      pair.assistant.parentElement;
            if (assistantContainer) {
              assistantContainer.remove();
              cleanedCount++;
            }
          }
        } catch (error) {
          console.error('❌ Error removing message pair:', error);
        }
      }
      
      console.log(`✅ Cleanup complete: removed ${cleanedCount} messages, kept ${keepCount} pairs`);
      
      // Dispatch cleanup event
      const event = new CustomEvent('rayMessageCleanup', {
        detail: {
          cleaned: cleanedCount,
          kept: keepCount,
          timestamp: new Date().toISOString()
        }
      });
      document.dispatchEvent(event);
      
      return { cleaned: cleanedCount, kept: keepCount, skipped: false };
      
    } catch (error) {
      console.error('❌ Error during message cleanup:', error);
      return { cleaned: 0, kept: 0, error: error.message };
    }
  }

  /**
   * Start automatic cleanup monitoring
   */
  function startAutoCleanup() {
    if (cleanupInterval) {
      console.log('⚠️ Auto cleanup already running');
      return;
    }
    
    console.log(`🔄 Starting auto cleanup (every ${CONFIG.CLEANUP_INTERVAL/1000}s)`);
    
    cleanupInterval = setInterval(() => {
      if (!isCleanupActive) {
        isCleanupActive = true;
        cleanupMessages();
        isCleanupActive = false;
      }
    }, CONFIG.CLEANUP_INTERVAL);
    
    // Also run initial cleanup after a delay
    setTimeout(() => {
      if (!isCleanupActive) {
        isCleanupActive = true;
        cleanupMessages();
        isCleanupActive = false;
      }
    }, 5000);
  }

  /**
   * Stop automatic cleanup monitoring
   */
  function stopAutoCleanup() {
    if (cleanupInterval) {
      clearInterval(cleanupInterval);
      cleanupInterval = null;
      console.log('⏹️ Auto cleanup stopped');
    }
  }

  /**
   * Manual cleanup trigger
   * @param {number} keepCount Optional number of pairs to keep
   * @returns {Object} Cleanup results
   */
  function manualCleanup(keepCount) {
    console.log('🧹 Manual cleanup triggered');
    return cleanupMessages(keepCount);
  }

  /**
   * Get current message statistics
   * @returns {Object} Message statistics
   */
  function getMessageStats() {
    try {
      const allMessages = getAllMessages();
      const pairs = getMessagePairs(allMessages);
      
      return {
        total_messages: allMessages.length,
        message_pairs: pairs.length,
        user_messages: allMessages.filter(m => m.getAttribute('data-message-author-role') === 'user').length,
        assistant_messages: allMessages.filter(m => m.getAttribute('data-message-author-role') === 'assistant').length,
        ai_responding: isAIResponding(),
        cleanup_active: isCleanupActive,
        auto_cleanup_running: !!cleanupInterval
      };
    } catch (error) {
      console.error('❌ Error getting message stats:', error);
      return { error: error.message };
    }
  }

  /**
   * Update cleanup configuration
   * @param {Object} newConfig New configuration options
   */
  function updateConfig(newConfig) {
    Object.assign(CONFIG, newConfig);
    console.log('⚙️ Cleanup config updated:', CONFIG);
    
    // Restart auto cleanup if it was running
    if (cleanupInterval) {
      stopAutoCleanup();
      startAutoCleanup();
    }
  }

  // Expose the module
  try {
    window.MessageCleanup = {
      // Core functions
      cleanupMessages: manualCleanup,
      startAutoCleanup: startAutoCleanup,
      stopAutoCleanup: stopAutoCleanup,
      
      // Utility functions
      getMessageStats: getMessageStats,
      getAllMessages: getAllMessages,
      isAIResponding: isAIResponding,
      
      // Configuration
      updateConfig: updateConfig,
      getConfig: () => ({ ...CONFIG }),
      
      // Internal functions (for debugging)
      _getMessagePairs: getMessagePairs,
      _isCleanupActive: () => isCleanupActive
    };
    
    console.log('✅ MessageCleanup loaded successfully');
    
    // Auto-start cleanup by default
    setTimeout(() => {
      startAutoCleanup();
    }, 2000);
    
  } catch (error) {
    console.error('❌ Error exposing MessageCleanup:', error);
  }
  
})();