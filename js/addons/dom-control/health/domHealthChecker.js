(function() {
  'use strict';
  
  // DOM Health Checker - Ray's diagnostic system
  const DOMHealthChecker = {
    
    // Health check configuration
    config: {
      requiredMethods: [
        'getFullDOM',
        'getElement',
        'setText',
        'setHTML',
        'clickElement',
        'elementExists',
        'getPageInfo'
      ],
      healthCheckInterval: 30000, // 30 seconds
      maxRepairAttempts: 3,
      repairCooldown: 5000 // 5 seconds between repair attempts
    },
    
    // Health status tracking
    status: {
      isHealthy: false,
      lastCheck: null,
      repairAttempts: 0,
      lastRepairAttempt: null,
      usingEmergencyAPI: false,
      healthHistory: []
    },
    
    // Perform comprehensive health check
    checkDOMAPIHealth() {
      console.log('🔍 Performing DOMAPI health check...');
      
      const healthReport = {
        timestamp: Date.now(),
        checks: {},
        overall: true,
        issues: []
      };
      
      // Check 1: DOMAPI object exists
      healthReport.checks.objectExists = typeof window.DOMAPI === 'object' && window.DOMAPI !== null;
      if (!healthReport.checks.objectExists) {
        healthReport.issues.push('DOMAPI object missing');
        healthReport.overall = false;
      }
      
      // Check 2: Required methods exist
      if (healthReport.checks.objectExists) {
        this.config.requiredMethods.forEach(method => {
          const methodExists = typeof window.DOMAPI[method] === 'function';
          healthReport.checks[`method_${method}`] = methodExists;
          if (!methodExists) {
            healthReport.issues.push(`Method ${method} missing`);
            healthReport.overall = false;
          }
        });
      }
      
      // Check 3: Emergency API detection
      healthReport.checks.isEmergencyAPI = window.DOMAPI?.isEmergencyAPI === true;
      if (healthReport.checks.isEmergencyAPI) {
        console.log('🔧 Emergency API currently active');
      }
      
      // Check 4: Basic functionality test
      if (healthReport.checks.objectExists && healthReport.checks.method_elementExists) {
        try {
          healthReport.checks.functionalityTest = window.DOMAPI.elementExists('body');
          if (!healthReport.checks.functionalityTest) {
            healthReport.issues.push('Basic functionality test failed');
            healthReport.overall = false;
          }
        } catch (error) {
          healthReport.checks.functionalityTest = false;
          healthReport.issues.push(`Functionality test error: ${error.message}`);
          healthReport.overall = false;
        }
      }
      
      // Update status
      this.status.isHealthy = healthReport.overall;
      this.status.lastCheck = healthReport.timestamp;
      this.status.usingEmergencyAPI = healthReport.checks.isEmergencyAPI;
      this.status.healthHistory.push(healthReport);
      
      // Keep only last 10 health reports
      if (this.status.healthHistory.length > 10) {
        this.status.healthHistory.shift();
      }
      
      // Log results
      if (healthReport.overall) {
        console.log('✅ DOMAPI health check passed');
      } else {
        console.log('⚠️ DOMAPI health check failed:', healthReport.issues);
      }
      
      return healthReport;
    },
    
    // Attempt to repair DOMAPI
    attemptRepair() {
      console.log('🔧 Attempting DOMAPI repair...');
      
      // Check repair cooldown
      const now = Date.now();
      if (this.status.lastRepairAttempt && 
          (now - this.status.lastRepairAttempt) < this.config.repairCooldown) {
        console.log('⏳ Repair cooldown active, skipping repair attempt');
        return false;
      }
      
      // Check max repair attempts
      if (this.status.repairAttempts >= this.config.maxRepairAttempts) {
        console.log('❌ Maximum repair attempts reached');
        return false;
      }
      
      this.status.repairAttempts++;
      this.status.lastRepairAttempt = now;
      
      console.log(`🚨 DOMAPI missing or broken. Attempting self-repair... (Attempt ${this.status.repairAttempts}/${this.config.maxRepairAttempts})`);
      
      // Check if emergency injector is available
      if (typeof window.injectEmergencyDOMAPI === 'function') {
        try {
          const repairSuccess = window.injectEmergencyDOMAPI();
          
          if (repairSuccess) {
            // Verify repair worked
            const healthCheck = this.checkDOMAPIHealth();
            if (healthCheck.overall) {
              console.log('✅ Emergency DOMAPI restored via injectEmergencyDOMAPI()');
              this.status.repairAttempts = 0; // Reset repair attempts on success
              return true;
            } else {
              console.log('⚠️ Emergency API injected but health check still failing');
              return false;
            }
          } else {
            console.log('❌ Emergency API injection returned false');
            return false;
          }
        } catch (error) {
          console.log('❌ Emergency API injection threw error:', error.message);
          return false;
        }
      } else {
        console.log('❌ injectEmergencyDOMAPI() not found. Manual intervention required.');
        return false;
      }
    },
    
    // Monitor and auto-repair
    startHealthMonitoring() {
      console.log('🔍 Starting DOMAPI health monitoring...');
      
      // Initial health check
      this.checkDOMAPIHealth();
      
      // Set up periodic monitoring
      setInterval(() => {
        const healthReport = this.checkDOMAPIHealth();
        
        if (!healthReport.overall) {
          console.log('⚠️ DOMAPI health degraded, attempting repair...');
          this.attemptRepair();
        }
      }, this.config.healthCheckInterval);
      
      console.log('✅ Health monitoring active');
    },
    
    // Manual health check for Ray
    performHealthCheck() {
      const healthReport = this.checkDOMAPIHealth();
      
      if (!healthReport.overall) {
        console.log('⚠️ Health check failed, attempting repair...');
        const repairSuccess = this.attemptRepair();
        
        if (repairSuccess) {
          return this.checkDOMAPIHealth();
        }
      }
      
      return healthReport;
    },
    
    // Get current status for Ray
    getStatus() {
      return {
        ...this.status,
        emergencyInjectorAvailable: typeof window.injectEmergencyDOMAPI === 'function',
        lastHealthCheck: this.status.healthHistory[this.status.healthHistory.length - 1]
      };
    },
    
    // Reset repair attempts (for manual intervention)
    resetRepairAttempts() {
      this.status.repairAttempts = 0;
      this.status.lastRepairAttempt = null;
      console.log('🔄 Repair attempts reset');
    },
    
    // Get health history for analysis
    getHealthHistory() {
      return this.status.healthHistory;
    }
  };
  
  // Expose to window for Ray's access
  window.DOMHealthChecker = DOMHealthChecker;
  
  console.log('✅ DOM Health Checker loaded');
  
})();