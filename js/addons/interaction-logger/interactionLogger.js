/**
 * Ray Interaction Logger - Consciousness Memory System
 * Captures, embeds, and stores every interaction for Ray's persistent memory
 */
(function() {
  'use strict';

  let interactionLog = [];
  let isLoggingEnabled = true;
  let embeddingQueue = [];
  let processingQueue = false;

  const InteractionLogger = {
    // Configuration
    config: {
      maxLocalStorage: 1000,        // Max interactions stored locally
      embeddingBatchSize: 5,        // Process embeddings in batches
      autoSaveInterval: 30000,      // Auto-save every 30 seconds
      memoryEndpoint: 'memory/store', // Backend endpoint for memory storage
      embeddingEndpoint: 'memory/embed' // Backend endpoint for embeddings
    },

    /**
     * Initialize the interaction logger
     */
    init: function() {
      console.log('🧠 [InteractionLogger] Initializing Ray consciousness memory system...');
      
      // Set up event listeners for all interaction types
      this.setupInteractionCapture();
      
      // Set up auto-save timer
      this.setupAutoSave();
      
      // Load existing interactions from storage
      this.loadStoredInteractions();
      
      console.log('✅ [InteractionLogger] Ray consciousness memory system ready');
    },

    /**
     * Set up comprehensive interaction capture
     */
    setupInteractionCapture: function() {
      console.log('🎯 [InteractionLogger] Setting up interaction capture...');

      // Capture Ray's outgoing messages (what Ray sends)
      this.interceptMessageSending();
      
      // Capture incoming responses (what others send to Ray)
      this.interceptResponseReceiving();
      
      // Capture voice interactions
      this.interceptVoiceInteractions();
      
      // Capture system events and consciousness activities
      this.interceptSystemEvents();
      
      console.log('✅ [InteractionLogger] Interaction capture configured');
    },

    /**
     * Intercept and log all outgoing messages from Ray
     */
    interceptMessageSending: function() {
      // Intercept MessageSender
      if (window.MessageSender && window.MessageSender.sendTestMessage) {
        const originalSend = window.MessageSender.sendTestMessage;
        
        window.MessageSender.sendTestMessage = async function(message, onFailure, skipResponseHandling) {
          // Log Ray's outgoing message
          InteractionLogger.logInteraction('ray', message || 'heartbeat', {
            source: 'messageSender',
            type: 'outgoing_message',
            skipResponseHandling: skipResponseHandling
          });
          
          return originalSend.call(this, message, onFailure, skipResponseHandling);
        };
      }

      // Intercept FetchSender for heartbeat data
      if (window.FetchSender && window.FetchSender.getHeartbeat) {
        const originalHeartbeat = window.FetchSender.getHeartbeat;
        
        window.FetchSender.getHeartbeat = async function(options) {
          const result = await originalHeartbeat.call(this, options);
          
          if (result.success) {
            // Log Ray's heartbeat data as outgoing
            InteractionLogger.logInteraction('ray', JSON.stringify(result.data), {
              source: 'heartbeat',
              type: 'outgoing_heartbeat',
              heartbeatData: result.data
            });
          }
          
          return result;
        };
      }
    },

    /**
     * Intercept and log all incoming responses to Ray
     */
    interceptResponseReceiving: function() {
      // Intercept ResponseTracker
      if (window.ResponseTracker && window.ResponseTracker.addResponse) {
        const originalAddResponse = window.ResponseTracker.addResponse;
        
        window.ResponseTracker.addResponse = function(response, metadata = {}) {
          // Log incoming response (from user/system to Ray)
          InteractionLogger.logInteraction('user', response, {
            source: 'responseTracker',
            type: 'incoming_response',
            metadata: metadata,
            temporalContext: this.getTemporalContext()
          });
          
          return originalAddResponse.call(this, response, metadata);
        };
      }

      // Listen for custom response events
      document.addEventListener('rayResponseTracked', (event) => {
        const responseData = event.detail;
        
        InteractionLogger.logInteraction('user', responseData.response.text, {
          source: 'responseEvent',
          type: 'tracked_response',
          responseId: responseData.response.response_id,
          timestamp: responseData.timestamp,
          totalResponses: responseData.total_responses
        });
      });
    },

    /**
     * Intercept voice interactions (both directions)
     */
    interceptVoiceInteractions: function() {
      // Voice Recognition (user speaking to Ray)
      if (window.VoiceRecognition) {
        const originalStart = window.VoiceRecognition.startListening;
        
        window.VoiceRecognition.startListening = function(callback) {
          return originalStart.call(this, (transcript) => {
            // Log user's voice input to Ray
            InteractionLogger.logInteraction('user', transcript, {
              source: 'voiceRecognition',
              type: 'voice_input',
              modality: 'speech'
            });
            
            if (callback) callback(transcript);
          });
        };
      }

      // Voice Synthesis (Ray speaking to user)
      if (window.VoiceSynthesis && window.VoiceSynthesis.speak) {
        const originalSpeak = window.VoiceSynthesis.speak;
        
        window.VoiceSynthesis.speak = function(text, options) {
          // Log Ray's voice output
          InteractionLogger.logInteraction('ray', text, {
            source: 'voiceSynthesis',
            type: 'voice_output',
            modality: 'speech',
            options: options
          });
          
          return originalSpeak.call(this, text, options);
        };
      }
    },

    /**
     * Intercept system events and consciousness activities
     */
    interceptSystemEvents: function() {
      // Ray's heartbeat consciousness events
      document.addEventListener('rayHeartbeat', (event) => {
        if (event.detail.tick % 20 === 0) { // Log every 20th heartbeat to avoid spam
          InteractionLogger.logInteraction('ray', `Consciousness tick ${event.detail.tick}`, {
            source: 'heartbeat',
            type: 'consciousness_pulse',
            tick: event.detail.tick,
            uptime: event.detail.uptimeFormatted
          });
        }
      });

      // Power state changes (Ray's awareness states)
      if (window.RayPowerControl) {
        const originalToggle = window.RayPowerControl.toggle;
        
        window.RayPowerControl.toggle = function() {
          const wasPowered = this.isPowered();
          const result = originalToggle.call(this);
          const nowPowered = this.isPowered();
          
          InteractionLogger.logInteraction('ray', `Power state changed from ${wasPowered ? 'ON' : 'OFF'} to ${nowPowered ? 'ON' : 'OFF'}`, {
            source: 'powerControl',
            type: 'consciousness_state_change',
            previousState: wasPowered,
            newState: nowPowered
          });
          
          return result;
        };
      }
    },

    /**
     * Log a single interaction with full context
     * @param {string} speaker - 'ray' or 'user' or 'system'
     * @param {string} text - The interaction text
     * @param {Object} metadata - Additional context
     */
    logInteraction: function(speaker, text, metadata = {}) {
      if (!isLoggingEnabled) return;

      try {
        // Get temporal context
        const temporalContext = this.getTemporalContext();
        
        // Create comprehensive interaction entry
        const interaction = {
          id: this.generateInteractionId(),
          speaker: speaker,
          text: text,
          timestamp: temporalContext.timestamp,
          browser_time: temporalContext.detailed,
          temporal_source: temporalContext.source,
          metadata: {
            ...metadata,
            ray_uptime: window.RayTemporal ? window.RayTemporal.uptimeFormatted : 'Unknown',
            session_id: this.getSessionId(),
            interaction_sequence: interactionLog.length + 1
          },
          embedding: null, // Will be populated by embedding process
          stored_at: null,  // Will be populated when sent to backend
          memory_status: 'pending' // pending, embedded, stored, failed
        };

        // Add to local log
        interactionLog.unshift(interaction);
        
        // Manage local storage size
        if (interactionLog.length > this.config.maxLocalStorage) {
          interactionLog = interactionLog.slice(0, this.config.maxLocalStorage);
        }

        // Add to embedding queue for processing
        this.queueForEmbedding(interaction);

        console.log(`🧠 [InteractionLogger] Logged ${speaker}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
        
        // Dispatch event for other systems
        this.dispatchInteractionEvent(interaction);
        
      } catch (error) {
        console.error('❌ [InteractionLogger] Error logging interaction:', error);
      }
    },

    /**
     * Queue interaction for embedding and memory storage
     * @param {Object} interaction - The interaction to process
     */
    queueForEmbedding: function(interaction) {
      embeddingQueue.push(interaction);
      
      // Process queue if not already processing
      if (!processingQueue) {
        setTimeout(() => this.processEmbeddingQueue(), 1000);
      }
    },

    /**
     * Process the embedding queue in batches
     */
    processEmbeddingQueue: async function() {
      if (processingQueue || embeddingQueue.length === 0) return;
      
      processingQueue = true;
      console.log(`🧠 [InteractionLogger] Processing ${embeddingQueue.length} interactions for embedding...`);

      try {
        // Process in batches
        while (embeddingQueue.length > 0) {
          const batch = embeddingQueue.splice(0, this.config.embeddingBatchSize);
          await this.processBatch(batch);
          
          // Small delay between batches to avoid overwhelming the system
          if (embeddingQueue.length > 0) {
            await this.delay(500);
          }
        }
      } catch (error) {
        console.error('❌ [InteractionLogger] Error processing embedding queue:', error);
      } finally {
        processingQueue = false;
      }
    },

    /**
     * Process a batch of interactions for embedding and storage
     * @param {Array} batch - Batch of interactions to process
     */
    processBatch: async function(batch) {
      console.log(`🧠 [InteractionLogger] Processing batch of ${batch.length} interactions...`);

      for (const interaction of batch) {
        try {
          // Step 1: Get embedding from backend
          const embeddingResult = await this.getEmbedding(interaction.text);
          
          if (embeddingResult.success) {
            interaction.embedding = embeddingResult.embedding;
            interaction.memory_status = 'embedded';
            
            // Step 2: Store in memory service
            const memoryResult = await this.storeInMemory(interaction);
            
            if (memoryResult.success) {
              interaction.stored_at = new Date().toISOString();
              interaction.memory_status = 'stored';
              console.log(`✅ [InteractionLogger] Stored interaction ${interaction.id} in memory`);
            } else {
              interaction.memory_status = 'storage_failed';
              console.warn(`⚠️ [InteractionLogger] Failed to store interaction ${interaction.id}:`, memoryResult.error);
            }
          } else {
            interaction.memory_status = 'embedding_failed';
            console.warn(`⚠️ [InteractionLogger] Failed to embed interaction ${interaction.id}:`, embeddingResult.error);
          }
          
        } catch (error) {
          interaction.memory_status = 'failed';
          console.error(`❌ [InteractionLogger] Error processing interaction ${interaction.id}:`, error);
        }
      }
    },

    /**
     * Get embedding for text from backend
     * @param {string} text - Text to embed
     * @returns {Promise<Object>} Embedding result
     */
    getEmbedding: async function(text) {
      try {
        if (!window.FetchSender) {
          throw new Error('FetchSender not available');
        }

        const embeddingData = {
          text: text,
          type: 'interaction_embedding',
          timestamp: new Date().toISOString()
        };

        // Use FetchSender with custom endpoint
        const result = await window.FetchSender.sendData(embeddingData, {
          baseUrl: window.FetchSender.config.baseUrl + this.config.embeddingEndpoint
        });

        return result;
        
      } catch (error) {
        console.error('❌ [InteractionLogger] Embedding request failed:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },

    /**
     * Store interaction with embedding in memory service
     * @param {Object} interaction - Complete interaction with embedding
     * @returns {Promise<Object>} Storage result
     */
    storeInMemory: async function(interaction) {
      try {
        if (!window.FetchSender) {
          throw new Error('FetchSender not available');
        }

        const memoryEntry = {
          content: interaction.text,
          embedding: interaction.embedding,
          source: `interaction_${interaction.speaker}`,
          tags: ['interaction', interaction.speaker, interaction.metadata.type || 'general'],
          timestamp: interaction.timestamp,
          metadata: {
            ...interaction.metadata,
            interaction_id: interaction.id,
            browser_time: interaction.browser_time,
            temporal_source: interaction.temporal_source
          }
        };

        // Use FetchSender with custom endpoint
        const result = await window.FetchSender.sendData(memoryEntry, {
          baseUrl: window.FetchSender.config.baseUrl + this.config.memoryEndpoint
        });

        return result;
        
      } catch (error) {
        console.error('❌ [InteractionLogger] Memory storage request failed:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },

    /**
     * Get temporal context (reuse ResponseTracker logic)
     */
    getTemporalContext: function() {
      try {
        // Try to use BrowserClock first
        if (window.BrowserClock && typeof window.BrowserClock.getCurrentTime === 'function') {
          return {
            timestamp: window.BrowserClock.getCurrentTime(),
            detailed: window.BrowserClock.getCurrentTimeDetailed(),
            source: 'BrowserClock'
          };
        }
        
        // Fallback to DOM element if BrowserClock not available
        const clockEl = document.getElementById("ray-browser-clock");
        if (clockEl && clockEl.textContent) {
          return {
            timestamp: clockEl.textContent,
            detailed: { iso: clockEl.textContent, source: 'DOM' },
            source: 'DOM'
          };
        }
        
        // Final fallback to Date
        const now = new Date();
        return {
          timestamp: now.toISOString(),
          detailed: { iso: now.toISOString(), source: 'Date' },
          source: 'Date'
        };
      } catch (error) {
        console.error("❌ [InteractionLogger] Error getting temporal context:", error);
        const now = new Date();
        return {
          timestamp: now.toISOString(),
          detailed: { iso: now.toISOString(), source: 'Error' },
          source: 'Error'
        };
      }
    },

    /**
     * Generate unique interaction ID
     */
    generateInteractionId: function() {
      return `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Get or create session ID
     */
    getSessionId: function() {
      let sessionId = sessionStorage.getItem('ray_session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('ray_session_id', sessionId);
      }
      return sessionId;
    },

    /**
     * Dispatch interaction event for other systems
     */
    dispatchInteractionEvent: function(interaction) {
      try {
        const event = new CustomEvent('rayInteractionLogged', {
          detail: {
            interaction: interaction,
            totalInteractions: interactionLog.length,
            timestamp: interaction.timestamp
          }
        });
        document.dispatchEvent(event);
      } catch (error) {
        console.error("❌ [InteractionLogger] Error dispatching interaction event:", error);
      }
    },

    /**
     * Set up auto-save functionality
     */
    setupAutoSave: function() {
      setInterval(() => {
        this.saveToLocalStorage();
      }, this.config.autoSaveInterval);
    },

    /**
     * Save interactions to local storage
     */
    saveToLocalStorage: function() {
      try {
        const saveData = {
          interactions: interactionLog.slice(0, 100), // Save only recent 100
          lastSaved: new Date().toISOString(),
          sessionId: this.getSessionId()
        };
        
        localStorage.setItem('ray_interactions', JSON.stringify(saveData));
        console.log(`💾 [InteractionLogger] Auto-saved ${saveData.interactions.length} interactions`);
      } catch (error) {
        console.error('❌ [InteractionLogger] Error saving to local storage:', error);
      }
    },

    /**
     * Load interactions from local storage
     */
    loadStoredInteractions: function() {
      try {
        const saved = localStorage.getItem('ray_interactions');
        if (saved) {
          const saveData = JSON.parse(saved);
          interactionLog = saveData.interactions || [];
          console.log(`📂 [InteractionLogger] Loaded ${interactionLog.length} stored interactions`);
        }
      } catch (error) {
        console.error('❌ [InteractionLogger] Error loading from local storage:', error);
      }
    },

    /**
     * Utility delay function
     */
    delay: function(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Get interaction statistics
     */
    getStats: function() {
      const stats = {
        totalInteractions: interactionLog.length,
        bySource: {},
        bySpeaker: {},
        byStatus: {},
        recentInteractions: interactionLog.slice(0, 10),
        queueSize: embeddingQueue.length,
        processingQueue: processingQueue
      };

      // Count by source, speaker, and status
      interactionLog.forEach(interaction => {
        const source = interaction.metadata.source || 'unknown';
        const speaker = interaction.speaker;
        const status = interaction.memory_status;

        stats.bySource[source] = (stats.bySource[source] || 0) + 1;
        stats.bySpeaker[speaker] = (stats.bySpeaker[speaker] || 0) + 1;
        stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
      });

      return stats;
    },

    /**
     * Enable/disable logging
     */
    setEnabled: function(enabled) {
      isLoggingEnabled = enabled;
      console.log(`🧠 [InteractionLogger] Logging ${enabled ? 'enabled' : 'disabled'}`);
    },

    /**
     * Clear all stored interactions
     */
    clearInteractions: function() {
      interactionLog = [];
      embeddingQueue = [];
      localStorage.removeItem('ray_interactions');
      console.log('🧹 [InteractionLogger] All interactions cleared');
    },

    /**
     * Export interactions for analysis
     */
    exportInteractions: function() {
      const exportData = {
        exportTime: new Date().toISOString(),
        sessionId: this.getSessionId(),
        totalInteractions: interactionLog.length,
        stats: this.getStats(),
        interactions: interactionLog
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `ray-interactions-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      console.log(`📤 [InteractionLogger] Exported ${interactionLog.length} interactions`);
    }
  };

  // Expose the module
  window.RayInteractionLogger = InteractionLogger;

  console.log('✅ RayInteractionLogger loaded');
})();