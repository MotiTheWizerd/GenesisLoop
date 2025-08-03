(function() {
  'use strict';
  
  // DOM Recovery System - Ray's self-repair orchestrator
  const DOMRecoverySystem = {
    
    // Recovery configuration
    config: {
      autoRecoveryEnabled: true,
      recoveryStrategies: ['emergency_injection', 'system_restart', 'fallback_mode'],
      maxRecoveryAttempts: 5,
      recoveryTimeout: 10000, // 10 seconds
      logRecoveryEvents: true
    },
    
    // Recovery state
    state: {
      recoveryInProgress: false,
      totalRecoveryAttempts: 0,
      successfulRecoveries: 0,
      failedRecoveries: 0,
      lastRecoveryTime: null,
      recoveryHistory: []
    },
    
    // Main recovery orchestrator
    async initiateRecovery(trigger = 'manual') {
      if (this.state.recoveryInProgress) {
        console.log('🔄 Recovery already in progress, skipping...');
        return false;
      }
      
      console.log(`🚨 DOM Recovery initiated (trigger: ${trigger})`);
      this.state.recoveryInProgress = true;
      this.state.totalRecoveryAttempts++;
      
      const recoverySession = {
        id: `recovery_${Date.now()}`,
        trigger,
        startTime: Date.now(),
        strategies: [],
        success: false,
        error: null
      };
      
      try {
        // Strategy 1: Emergency API Injection
        if (await this.tryEmergencyInjection(recoverySession)) {
          recoverySession.success = true;
          this.state.successfulRecoveries++;
          console.log('✅ Recovery successful via emergency injection');
        }
        // Strategy 2: System restart attempt
        else if (await this.trySystemRestart(recoverySession)) {
          recoverySession.success = true;
          this.state.successfulRecoveries++;
          console.log('✅ Recovery successful via system restart');
        }
        // Strategy 3: Fallback mode
        else if (await this.tryFallbackMode(recoverySession)) {
          recoverySession.success = true;
          this.state.successfulRecoveries++;
          console.log('✅ Recovery successful via fallback mode');
        }
        else {
          this.state.failedRecoveries++;
          console.log('❌ All recovery strategies failed');
        }
        
      } catch (error) {
        recoverySession.error = error.message;
        this.state.failedRecoveries++;
        console.log('❌ Recovery failed with error:', error.message);
      } finally {
        recoverySession.endTime = Date.now();
        recoverySession.duration = recoverySession.endTime - recoverySession.startTime;
        
        this.state.recoveryInProgress = false;
        this.state.lastRecoveryTime = recoverySession.endTime;
        this.state.recoveryHistory.push(recoverySession);
        
        // Keep only last 20 recovery sessions
        if (this.state.recoveryHistory.length > 20) {
          this.state.recoveryHistory.shift();
        }
        
        if (this.config.logRecoveryEvents) {
          this.logRecoveryEvent(recoverySession);
        }
      }
      
      return recoverySession.success;
    },
    
    // Strategy 1: Emergency API Injection
    async tryEmergencyInjection(session) {
      console.log('🔧 Trying emergency API injection...');
      session.strategies.push('emergency_injection');
      
      if (typeof window.injectEmergencyDOMAPI !== 'function') {
        console.log('❌ Emergency injector not available');
        return false;
      }
      
      try {
        const injectionSuccess = window.injectEmergencyDOMAPI();
        
        if (injectionSuccess) {
          // Wait a moment for injection to complete
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Verify with health checker
          if (window.DOMHealthChecker) {
            const healthReport = window.DOMHealthChecker.checkDOMAPIHealth();
            return healthReport.overall;
          } else {
            // Manual verification
            return typeof window.DOMAPI === 'object' && 
                   typeof window.DOMAPI.getElement === 'function';
          }
        }
        
        return false;
      } catch (error) {
        console.log('❌ Emergency injection failed:', error.message);
        return false;
      }
    },
    
    // Strategy 2: System restart attempt
    async trySystemRestart(session) {
      console.log('🔄 Trying system restart...');
      session.strategies.push('system_restart');
      
      try {
        // Try to reinitialize the DOM control system
        if (window.DOMControlSystem && typeof window.DOMControlSystem.initialize === 'function') {
          window.DOMControlSystem.initialize();
          
          // Wait for initialization
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if it worked
          if (window.DOMHealthChecker) {
            const healthReport = window.DOMHealthChecker.checkDOMAPIHealth();
            return healthReport.overall;
          }
        }
        
        return false;
      } catch (error) {
        console.log('❌ System restart failed:', error.message);
        return false;
      }
    },
    
    // Strategy 3: Fallback mode
    async tryFallbackMode(session) {
      console.log('🛡️ Trying fallback mode...');
      session.strategies.push('fallback_mode');
      
      try {
        // Create minimal fallback API
        window.DOMAPI = {
          async getElement(selector, format = 'text') {
            const element = document.querySelector(selector);
            if (!element) throw new Error(`Element not found: ${selector}`);
            
            let content;
            switch (format) {
              case 'text': content = element.textContent || element.innerText; break;
              case 'html': content = element.innerHTML; break;
              default: content = element.outerHTML;
            }
            
            return { success: true, dom: content, timestamp: Date.now(), source: 'fallback' };
          },
          
          elementExists(selector) {
            return document.querySelector(selector) !== null;
          },
          
          isFallbackMode: true,
          fallbackVersion: '1.0.0'
        };
        
        console.log('🛡️ Fallback mode activated - limited functionality');
        return true;
        
      } catch (error) {
        console.log('❌ Fallback mode failed:', error.message);
        return false;
      }
    },
    
    // Log recovery events
    logRecoveryEvent(session) {
      const logEntry = {
        timestamp: new Date(session.startTime).toISOString(),
        id: session.id,
        trigger: session.trigger,
        duration: session.duration,
        strategies: session.strategies,
        success: session.success,
        error: session.error
      };
      
      console.log('📊 Recovery Event:', logEntry);
      
      // Store in localStorage for persistence
      try {
        const existingLogs = JSON.parse(localStorage.getItem('domRecoveryLogs') || '[]');
        existingLogs.push(logEntry);
        
        // Keep only last 50 logs
        if (existingLogs.length > 50) {
          existingLogs.shift();
        }
        
        localStorage.setItem('domRecoveryLogs', JSON.stringify(existingLogs));
      } catch (error) {
        console.log('⚠️ Could not store recovery log:', error.message);
      }
    },
    
    // Get recovery statistics for Ray
    getRecoveryStats() {
      const successRate = this.state.totalRecoveryAttempts > 0 ? 
        (this.state.successfulRecoveries / this.state.totalRecoveryAttempts * 100).toFixed(1) : 0;
      
      return {
        totalAttempts: this.state.totalRecoveryAttempts,
        successful: this.state.successfulRecoveries,
        failed: this.state.failedRecoveries,
        successRate: `${successRate}%`,
        lastRecovery: this.state.lastRecoveryTime,
        inProgress: this.state.recoveryInProgress,
        recentHistory: this.state.recoveryHistory.slice(-5)
      };
    },
    
    // Get recovery logs from localStorage
    getRecoveryLogs() {
      try {
        return JSON.parse(localStorage.getItem('domRecoveryLogs') || '[]');
      } catch (error) {
        console.log('⚠️ Could not retrieve recovery logs:', error.message);
        return [];
      }
    },
    
    // Clear recovery logs
    clearRecoveryLogs() {
      try {
        localStorage.removeItem('domRecoveryLogs');
        this.state.recoveryHistory = [];
        console.log('🧹 Recovery logs cleared');
      } catch (error) {
        console.log('⚠️ Could not clear recovery logs:', error.message);
      }
    },
    
    // Enable/disable auto recovery
    setAutoRecovery(enabled) {
      this.config.autoRecoveryEnabled = enabled;
      console.log(`🔧 Auto recovery ${enabled ? 'enabled' : 'disabled'}`);
    }
  };
  
  // Expose to window for Ray's access
  window.DOMRecoverySystem = DOMRecoverySystem;
  
  console.log('✅ DOM Recovery System loaded');
  
})();