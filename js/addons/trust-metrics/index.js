(function() {
  'use strict';

  // Trust Metrics System Index
  // This module coordinates the entire trust metrics system

  let trustSystemInitialized = false;
  let initializationPromise = null;

  function initializeTrustSystem() {
    if (trustSystemInitialized) {
      return Promise.resolve(true);
    }

    if (initializationPromise) {
      return initializationPromise;
    }

    console.log('🤝 Initializing Ray Trust Metrics System...');

    initializationPromise = new Promise((resolve, reject) => {
      // Retry logic for initialization
      let retryCount = 0;
      const maxRetries = 3;
      
      function attemptInitialization() {
        try {
          // Check dependencies
          const dependencies = [
            'RayTrustCore',
            'RayTrustUI', 
            'RayTrustIntegration'
          ];

          const missingDeps = dependencies.filter(dep => !window[dep]);
          if (missingDeps.length > 0) {
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`⏳ Missing dependencies (${missingDeps.join(', ')}), retrying in ${retryCount}s... (${retryCount}/${maxRetries})`);
              setTimeout(attemptInitialization, retryCount * 1000);
              return;
            }
            throw new Error(`Missing trust system dependencies after ${maxRetries} retries: ${missingDeps.join(', ')}`);
          }

          // Initialize core system first
          window.RayTrustCore.init();
          console.log('✅ Trust core initialized');

          // Initialize UI
          window.RayTrustUI.init();
          console.log('✅ Trust UI initialized');

          // Initialize integration with other systems (with delay)
          setTimeout(() => {
            const integrationSuccess = window.RayTrustIntegration.init();
            if (integrationSuccess) {
              console.log('✅ Trust integration initialized');
            } else {
              console.warn('⚠️ Trust integration partially failed');
            }
          }, 500);

          // Set up system-wide trust event handling
          setupGlobalTrustHandling();

          // Record system initialization
          setTimeout(() => {
            if (window.RayTrustCore) {
              window.RayTrustCore.recordAction('SYSTEM_INIT', {
                system: 'trust_metrics',
                timestamp: Math.floor(Date.now() / 1000),
                version: '1.0'
              });
            }
          }, 1000);

          trustSystemInitialized = true;
          console.log('🎉 Ray Trust Metrics System fully initialized');

          resolve(true);

        } catch (error) {
          console.error('❌ Trust system initialization failed:', error);
          
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`🔄 Retrying trust system initialization... (${retryCount}/${maxRetries})`);
            setTimeout(attemptInitialization, retryCount * 1000);
          } else {
            reject(error);
          }
        }
      }
      
      // Start initialization attempt
      attemptInitialization();
    });

    return initializationPromise;
  }

  function setupGlobalTrustHandling() {
    // Global error handling for trust impact
    window.addEventListener('error', (event) => {
      if (window.RayTrustCore) {
        window.RayTrustCore.recordAction('PROBLEM_CREATED', {
          type: 'javascript_error',
          message: event.message,
          source: event.filename,
          line: event.lineno,
          column: event.colno
        });
      }
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      if (window.RayTrustCore) {
        window.RayTrustCore.recordAction('PROBLEM_CREATED', {
          type: 'unhandled_promise_rejection',
          reason: event.reason?.toString() || 'Unknown promise rejection'
        });
      }
    });

    // Monitor page visibility for engagement tracking
    document.addEventListener('visibilitychange', () => {
      if (window.RayTrustCore) {
        if (document.hidden) {
          window.RayTrustCore.recordAction('SYSTEM_INTERACTION', {
            type: 'page_hidden',
            timestamp: Math.floor(Date.now() / 1000)
          });
        } else {
          window.RayTrustCore.recordAction('RESPECTFUL_INTERACTION', {
            type: 'page_visible',
            timestamp: Math.floor(Date.now() / 1000)
          });
        }
      }
    });

    console.log('🌐 Global trust event handling enabled');
  }

  function getTrustSystemStatus() {
    return {
      initialized: trustSystemInitialized,
      components: {
        core: !!window.RayTrustCore,
        ui: !!window.RayTrustUI,
        integration: !!window.RayTrustIntegration
      },
      currentLevel: window.RayTrustCore ? window.RayTrustCore.getLevel() : null,
      integrationStatus: window.RayTrustIntegration ? window.RayTrustIntegration.getStatus() : null
    };
  }

  function shutdownTrustSystem() {
    console.log('🔌 Shutting down trust system...');

    if (window.RayTrustIntegration) {
      window.RayTrustIntegration.disable();
    }

    if (window.RayTrustUI) {
      window.RayTrustUI.hide();
    }

    if (window.RayTrustCore) {
      window.RayTrustCore.recordAction('SYSTEM_INTERACTION', {
        type: 'system_shutdown',
        timestamp: Math.floor(Date.now() / 1000)
      });
    }

    trustSystemInitialized = false;
    initializationPromise = null;

    console.log('✅ Trust system shutdown complete');
  }

  // Convenience methods for common trust actions
  function recordHelpfulAction(context = {}) {
    if (window.RayTrustCore) {
      return window.RayTrustCore.recordAction('HELPFUL_RESPONSE', {
        source: 'manual',
        ...context
      });
    }
  }

  function recordProblemSolved(context = {}) {
    if (window.RayTrustCore) {
      return window.RayTrustCore.recordAction('PROBLEM_SOLVED', {
        source: 'manual',
        ...context
      });
    }
  }

  function recordRespectfulInteraction(context = {}) {
    if (window.RayTrustCore) {
      return window.RayTrustCore.recordAction('RESPECTFUL_INTERACTION', {
        source: 'manual',
        ...context
      });
    }
  }

  function recordProblemCreated(context = {}) {
    if (window.RayTrustCore) {
      return window.RayTrustCore.recordAction('PROBLEM_CREATED', {
        source: 'manual',
        ...context
      });
    }
  }

  function recordEmotionalSupport(context = {}) {
    if (window.RayTrustCore) {
      return window.RayTrustCore.recordAction('EMOTIONAL_SUPPORT', {
        source: 'manual',
        ...context
      });
    }
  }

  // Quick trust level check
  function getCurrentTrustLevel() {
    if (window.RayTrustCore) {
      const trustInfo = window.RayTrustCore.getLevel();
      return {
        level: trustInfo.level,
        name: trustInfo.description.name,
        description: trustInfo.description.description,
        confidence: trustInfo.confidence
      };
    }
    return null;
  }

  // Trust system health check
  function performTrustHealthCheck() {
    console.log('🏥 Performing trust system health check...');

    const health = {
      overall: 'healthy',
      issues: [],
      recommendations: []
    };

    // Check if core components are loaded
    if (!window.RayTrustCore) {
      health.issues.push('Trust core not loaded');
      health.overall = 'critical';
    }

    if (!window.RayTrustUI) {
      health.issues.push('Trust UI not loaded');
      health.overall = health.overall === 'critical' ? 'critical' : 'degraded';
    }

    if (!window.RayTrustIntegration) {
      health.issues.push('Trust integration not loaded');
      health.overall = health.overall === 'critical' ? 'critical' : 'degraded';
    }

    // Check trust level sanity
    if (window.RayTrustCore) {
      const trustLevel = window.RayTrustCore.getLevel();
      
      if (trustLevel.level < 0 || trustLevel.level > 100) {
        health.issues.push('Trust level out of bounds');
        health.overall = 'critical';
      }

      if (trustLevel.confidence < 50 && trustLevel.interactionCount > 20) {
        health.issues.push('Low confidence despite many interactions');
        health.recommendations.push('Review trust calculation algorithm');
      }

      if (trustLevel.level < 20) {
        health.recommendations.push('Trust level is very low - investigate recent negative interactions');
      }
    }

    // Check integration status
    if (window.RayTrustIntegration) {
      const integrationStatus = window.RayTrustIntegration.getStatus();
      const integratedCount = Object.values(integrationStatus.integratedSystems).filter(Boolean).length;
      
      if (integratedCount < 3) {
        health.issues.push('Few systems integrated with trust metrics');
        health.recommendations.push('Ensure all Ray systems are properly integrated');
      }
    }

    console.log('🏥 Trust health check complete:', health);
    return health;
  }

  // Expose main Trust System API
  window.RayTrustSystem = {
    // Core functions
    init: initializeTrustSystem,
    shutdown: shutdownTrustSystem,
    getStatus: getTrustSystemStatus,
    healthCheck: performTrustHealthCheck,

    // Convenience methods
    getCurrentLevel: getCurrentTrustLevel,
    recordHelpful: recordHelpfulAction,
    recordProblemSolved: recordProblemSolved,
    recordRespectful: recordRespectfulInteraction,
    recordProblem: recordProblemCreated,
    recordSupport: recordEmotionalSupport,

    // Direct access to subsystems
    get core() { return window.RayTrustCore; },
    get ui() { return window.RayTrustUI; },
    get integration() { return window.RayTrustIntegration; }
  };

  console.log('✅ RayTrustSystem index loaded');
})();