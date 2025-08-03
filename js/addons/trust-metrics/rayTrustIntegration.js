(function() {
  'use strict';

  let integrationActive = false;
  let originalMethods = {};

  function initializeTrustIntegration() {
    console.log('🔗 Initializing Trust Integration...');
    
    if (!window.RayTrustCore) {
      console.error('❌ RayTrustCore not available for integration');
      return false;
    }

    // Use setTimeout to ensure other systems are loaded
    setTimeout(() => {
      // Integrate with existing systems
      integrateWithVoiceSystems();
      integrateWithPowerControl();
      integrateWithActivityMonitor();
      integrateWithMessageSender();
      integrateWithUIToggle();
      
      // Set up automatic trust tracking
      setupAutomaticTrustTracking();
      
      integrationActive = true;
      console.log('✅ Trust integration active');
      
      // Record integration initialization
      window.RayTrustCore.recordAction('SYSTEM_INTERACTION', {
        system: 'trust_integration',
        action: 'initialized'
      });
    }, 1000); // 1 second delay to ensure other systems are loaded
    
    return true;
  }

  function integrateWithVoiceSystems() {
    // Voice Recognition Integration
    if (window.VoiceRecognition) {
      const originalStartListening = window.VoiceRecognition.startListening;
      
      window.VoiceRecognition.startListening = function(callback) {
        // Record trust action for voice interaction
        window.RayTrustCore.recordAction('RESPECTFUL_INTERACTION', {
          system: 'voice_recognition',
          action: 'listening_started'
        });
        
        return originalStartListening.call(this, (transcript) => {
          if (transcript && transcript.trim()) {
            // Analyze transcript for trust indicators
            analyzeSpeechForTrust(transcript);
          }
          
          if (callback) callback(transcript);
        });
      };
      
      console.log('🎤 Voice Recognition integrated with trust system');
    }

    // Voice Synthesis Integration
    if (window.VoiceSynthesis) {
      const originalSpeak = window.VoiceSynthesis.speak;
      
      window.VoiceSynthesis.speak = function(text, options) {
        // Record helpful response when Ray speaks
        window.RayTrustCore.recordAction('HELPFUL_RESPONSE', {
          system: 'voice_synthesis',
          textLength: text.length,
          hasOptions: !!options
        });
        
        return originalSpeak.call(this, text, options);
      };
      
      console.log('🔊 Voice Synthesis integrated with trust system');
    }
  }

  function integrateWithPowerControl() {
    if (window.RayPowerControl) {
      const originalToggle = window.RayPowerControl.toggle;
      
      window.RayPowerControl.toggle = function() {
        const wasPowered = this.isPowered();
        const result = originalToggle.call(this);
        const nowPowered = this.isPowered();
        
        if (wasPowered && !nowPowered) {
          // User powered down Ray - neutral action
          window.RayTrustCore.recordAction('SYSTEM_INTERACTION', {
            system: 'power_control',
            action: 'powered_down'
          });
        } else if (!wasPowered && nowPowered) {
          // User powered up Ray - positive trust signal
          window.RayTrustCore.recordAction('RESPECTFUL_INTERACTION', {
            system: 'power_control',
            action: 'powered_up'
          });
        }
        
        return result;
      };
      
      console.log('⚡ Power Control integrated with trust system');
    }
  }

  function integrateWithActivityMonitor() {
    if (window.RayActivityMonitor) {
      // Monitor activity patterns for trust indicators
      const originalLog = window.RayActivityMonitor.log;
      
      window.RayActivityMonitor.log = function(action, details) {
        const result = originalLog.call(this, action, details);
        
        // Analyze activities for trust patterns
        analyzeActivityForTrust(action, details);
        
        return result;
      };
      
      console.log('📊 Activity Monitor integrated with trust system');
    }
  }

  function integrateWithMessageSender() {
    if (window.MessageSender) {
      const originalSend = window.MessageSender.sendTestMessage;
      
      window.MessageSender.sendTestMessage = function(message, onFailure, skipResponseHandling) {
        // Record interaction attempt
        window.RayTrustCore.recordAction('SYSTEM_INTERACTION', {
          system: 'message_sender',
          messageType: typeof message,
          hasFailureHandler: !!onFailure
        });
        
        return originalSend.call(this, message, (error) => {
          // Record failure as potential trust issue
          window.RayTrustCore.recordAction('PROBLEM_CREATED', {
            system: 'message_sender',
            error: error?.message || 'Unknown error'
          });
          
          if (onFailure) onFailure(error);
        }, skipResponseHandling);
      };
      
      console.log('📤 Message Sender integrated with trust system');
    }
  }

  function integrateWithUIToggle() {
    if (window.RayUIToggle) {
      const originalToggle = window.RayUIToggle.toggle;
      
      window.RayUIToggle.toggle = function() {
        const wasVisible = this.isVisible();
        const result = originalToggle.call(this);
        const nowVisible = this.isVisible();
        
        if (!wasVisible && nowVisible) {
          // User showed Ray's UI - positive trust signal
          window.RayTrustCore.recordAction('RESPECTFUL_INTERACTION', {
            system: 'ui_toggle',
            action: 'ui_shown'
          });
        } else if (wasVisible && !nowVisible) {
          // User hid Ray's UI - neutral (privacy preference)
          window.RayTrustCore.recordAction('PRIVACY_RESPECTED', {
            system: 'ui_toggle',
            action: 'ui_hidden'
          });
        }
        
        return result;
      };
      
      console.log('🎛️ UI Toggle integrated with trust system');
    }
  }

  function setupAutomaticTrustTracking() {
    // Track heartbeat consistency as reliability indicator
    let heartbeatCount = 0;
    let missedHeartbeats = 0;
    
    document.addEventListener('rayHeartbeat', (event) => {
      heartbeatCount++;
      
      // Every 100 heartbeats, record system reliability
      if (heartbeatCount % 100 === 0) {
        const reliability = (heartbeatCount - missedHeartbeats) / heartbeatCount;
        
        if (reliability > 0.95) {
          window.RayTrustCore.recordAction('PROMISE_KEPT', {
            system: 'heartbeat',
            reliability: reliability,
            count: heartbeatCount
          });
        } else if (reliability < 0.9) {
          window.RayTrustCore.recordAction('PROMISE_BROKEN', {
            system: 'heartbeat',
            reliability: reliability,
            missed: missedHeartbeats
          });
        }
      }
    });

    // Track system errors as trust issues
    window.addEventListener('error', (event) => {
      window.RayTrustCore.recordAction('PROBLEM_CREATED', {
        system: 'javascript_error',
        message: event.message,
        filename: event.filename,
        line: event.lineno
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      window.RayTrustCore.recordAction('PROBLEM_CREATED', {
        system: 'promise_rejection',
        reason: event.reason?.toString() || 'Unknown rejection'
      });
    });

    console.log('🔄 Automatic trust tracking enabled');
  }

  function analyzeSpeechForTrust(transcript) {
    const text = transcript.toLowerCase();
    
    // Positive indicators
    const positiveWords = ['thank', 'please', 'good', 'great', 'excellent', 'helpful', 'appreciate'];
    const negativeWords = ['bad', 'terrible', 'awful', 'useless', 'stupid', 'hate', 'wrong'];
    const questionWords = ['how', 'what', 'when', 'where', 'why', 'can you', 'could you'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    let questionCount = 0;
    
    positiveWords.forEach(word => {
      if (text.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (text.includes(word)) negativeCount++;
    });
    
    questionWords.forEach(word => {
      if (text.includes(word)) questionCount++;
    });
    
    // Record trust actions based on speech analysis
    if (positiveCount > negativeCount) {
      window.RayTrustCore.recordAction('RESPECTFUL_INTERACTION', {
        system: 'speech_analysis',
        sentiment: 'positive',
        positiveWords: positiveCount
      });
    } else if (negativeCount > positiveCount && negativeCount > 1) {
      window.RayTrustCore.recordAction('DISRESPECTFUL_BEHAVIOR', {
        system: 'speech_analysis',
        sentiment: 'negative',
        negativeWords: negativeCount
      });
    }
    
    if (questionCount > 0) {
      window.RayTrustCore.recordAction('RESPECTFUL_INTERACTION', {
        system: 'speech_analysis',
        type: 'question',
        questions: questionCount
      });
    }
  }

  function analyzeActivityForTrust(action, details) {
    // Map activity types to trust actions
    const activityTrustMap = {
      'ERROR': 'PROBLEM_CREATED',
      'WARNING': 'INACCURATE_INFORMATION',
      'INFO': 'ACCURATE_INFORMATION',
      'SYSTEM_INIT': 'PROMISE_KEPT',
      'HEARTBEAT': 'ROUTINE_OPERATION',
      'VOICE_RECOGNITION': 'RESPECTFUL_INTERACTION',
      'VOICE_SYNTHESIS': 'HELPFUL_RESPONSE',
      'MESSAGE_SENT': 'HELPFUL_RESPONSE',
      'RESPONSE_RECEIVED': 'ACCURATE_INFORMATION'
    };
    
    const trustAction = activityTrustMap[action];
    if (trustAction) {
      window.RayTrustCore.recordAction(trustAction, {
        system: 'activity_analysis',
        originalAction: action,
        details: details
      });
    }
  }

  function createTrustEventHandlers() {
    // Handle trust level changes
    document.addEventListener('rayTrustChange', (event) => {
      const { oldLevel, newLevel, change, actionType } = event.detail;
      
      console.log(`🤝 Trust changed: ${oldLevel} → ${newLevel} (${change > 0 ? '+' : ''}${change}) via ${actionType}`);
      
      // Log significant trust changes
      if (Math.abs(change) >= 5) {
        if (window.RayActivityMonitor) {
          window.RayActivityMonitor.log('TRUST_SIGNIFICANT_CHANGE', {
            oldLevel: oldLevel,
            newLevel: newLevel,
            change: change,
            trigger: actionType
          });
        }
      }
      
      // Handle trust milestones
      const milestones = [25, 50, 75, 90];
      milestones.forEach(milestone => {
        if (oldLevel < milestone && newLevel >= milestone) {
          console.log(`🎯 Trust milestone reached: ${milestone}%`);
          
          // Could trigger special behaviors here
          if (milestone === 75) {
            console.log('🌟 High trust achieved - Ray feels more confident');
          }
        }
      });
    });
  }

  function getTrustIntegrationStatus() {
    return {
      active: integrationActive,
      integratedSystems: {
        voiceRecognition: !!window.VoiceRecognition,
        voiceSynthesis: !!window.VoiceSynthesis,
        powerControl: !!window.RayPowerControl,
        activityMonitor: !!window.RayActivityMonitor,
        messageSender: !!window.MessageSender,
        uiToggle: !!window.RayUIToggle
      },
      trustCore: !!window.RayTrustCore,
      trustUI: !!window.RayTrustUI
    };
  }

  function disableTrustIntegration() {
    if (!integrationActive) return;
    
    console.log('🔌 Disabling trust integration...');
    
    // Restore original methods
    Object.keys(originalMethods).forEach(key => {
      const [system, method] = key.split('.');
      if (window[system] && originalMethods[key]) {
        window[system][method] = originalMethods[key];
      }
    });
    
    integrationActive = false;
    console.log('✅ Trust integration disabled');
  }

  // Initialize event handlers
  createTrustEventHandlers();

  // Expose Trust Integration API
  window.RayTrustIntegration = {
    init: initializeTrustIntegration,
    disable: disableTrustIntegration,
    getStatus: getTrustIntegrationStatus,
    
    // Manual trust recording methods
    recordPositive: (context) => {
      if (window.RayTrustCore) {
        window.RayTrustCore.recordAction('HELPFUL_RESPONSE', context);
      }
    },
    
    recordNegative: (context) => {
      if (window.RayTrustCore) {
        window.RayTrustCore.recordAction('UNHELPFUL_RESPONSE', context);
      }
    },
    
    recordRespect: (context) => {
      if (window.RayTrustCore) {
        window.RayTrustCore.recordAction('RESPECTFUL_INTERACTION', context);
      }
    },
    
    recordProblem: (context) => {
      if (window.RayTrustCore) {
        window.RayTrustCore.recordAction('PROBLEM_CREATED', context);
      }
    }
  };

  console.log('✅ RayTrustIntegration loaded');
})();