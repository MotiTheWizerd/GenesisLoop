(function() {
  'use strict';

  let monitorInterval = null;
  let lastClockCheck = Date.now();
  let clockFailures = 0;
  const MAX_FAILURES = 3;
  const MONITOR_INTERVAL = 5000; // Check every 5 seconds

  function startClockMonitoring() {
    console.log('🕐 [Clock Monitor] Starting clock monitoring system...');
    
    if (monitorInterval) {
      clearInterval(monitorInterval);
    }
    
    monitorInterval = setInterval(() => {
      checkClockHealth();
    }, MONITOR_INTERVAL);
    
    console.log('✅ [Clock Monitor] Clock monitoring active');
  }

  function checkClockHealth() {
    const now = Date.now();
    let clockWorking = false;
    
    // Test 1: Check if BrowserClock exists and is running
    if (window.BrowserClock) {
      try {
        // Test basic clock functions
        const currentTime = window.BrowserClock.getCurrentTime();
        const unixTime = window.BrowserClock.getCurrentUnixTime ? 
                        window.BrowserClock.getCurrentUnixTime() : 
                        Date.now();
        
        if (currentTime && unixTime) {
          clockWorking = true;
          clockFailures = 0; // Reset failure count
        }
        
        // Check if clock is actually running (if method exists)
        if (window.BrowserClock.isRunning && typeof window.BrowserClock.isRunning === 'function') {
          const isRunning = window.BrowserClock.isRunning();
          if (!isRunning) {
            console.warn('🕐 [Clock Monitor] Clock not running, attempting restart...');
            restartClock();
          }
        }
        
      } catch (error) {
        console.error('🕐 [Clock Monitor] Clock function error:', error);
        clockWorking = false;
      }
    }
    
    // Test 2: Check if RayClock interface is available
    if (window.RayClock) {
      try {
        const rayTime = window.RayClock.getCurrentTime();
        const rayAccess = window.RayClock.checkAccess();
        
        if (rayTime && rayAccess && rayAccess.available) {
          clockWorking = true;
        }
      } catch (error) {
        console.error('🕐 [Clock Monitor] RayClock interface error:', error);
      }
    }
    
    // Handle clock failures
    if (!clockWorking) {
      clockFailures++;
      console.warn(`🕐 [Clock Monitor] Clock failure ${clockFailures}/${MAX_FAILURES}`);
      
      if (clockFailures >= MAX_FAILURES) {
        console.error('🕐 [Clock Monitor] Multiple clock failures, attempting emergency restart...');
        emergencyClockRestart();
      } else {
        // Try gentle restart
        restartClock();
      }
    } else {
      // Clock is working fine
      if (clockFailures > 0) {
        console.log('✅ [Clock Monitor] Clock recovered successfully');
        clockFailures = 0;
      }
    }
    
    lastClockCheck = now;
  }

  function restartClock() {
    console.log('🔄 [Clock Monitor] Attempting clock restart...');
    
    try {
      // Try to restart BrowserClock
      if (window.BrowserClock) {
        if (window.BrowserClock.startClock && typeof window.BrowserClock.startClock === 'function') {
          window.BrowserClock.startClock();
          console.log('✅ [Clock Monitor] BrowserClock restarted');
        }
        
        if (window.BrowserClock.init && typeof window.BrowserClock.init === 'function') {
          window.BrowserClock.init();
          console.log('✅ [Clock Monitor] BrowserClock re-initialized');
        }
      }
      
      // Ensure RayClock interface is available
      if (window.RayPowerControl && window.RayPowerControl.ensureClockAccess) {
        window.RayPowerControl.ensureClockAccess();
      }
      
    } catch (error) {
      console.error('🕐 [Clock Monitor] Clock restart failed:', error);
    }
  }

  function emergencyClockRestart() {
    console.log('🚨 [Clock Monitor] EMERGENCY CLOCK RESTART');
    
    try {
      // Force complete clock reinitialization
      if (window.BrowserClock) {
        // Stop existing clock
        if (window.BrowserClock.stopClock && typeof window.BrowserClock.stopClock === 'function') {
          window.BrowserClock.stopClock();
        }
        
        // Force reinit
        if (window.BrowserClock.forceInit && typeof window.BrowserClock.forceInit === 'function') {
          window.BrowserClock.forceInit();
        } else if (window.BrowserClock.init && typeof window.BrowserClock.init === 'function') {
          window.BrowserClock.init();
        }
        
        // Start clock
        if (window.BrowserClock.startClock && typeof window.BrowserClock.startClock === 'function') {
          window.BrowserClock.startClock();
        }
      }
      
      // Recreate RayClock interface
      createEmergencyClockInterface();
      
      // Reset failure count
      clockFailures = 0;
      
      console.log('✅ [Clock Monitor] Emergency restart completed');
      
    } catch (error) {
      console.error('🚨 [Clock Monitor] Emergency restart failed:', error);
      
      // Last resort: create basic clock interface
      createBasicClockInterface();
    }
  }

  function createEmergencyClockInterface() {
    console.log('🚨 [Clock Monitor] Creating emergency clock interface...');
    
    // Create minimal RayClock interface that always works
    window.RayClock = {
      getCurrentTime: function() {
        return new Date().toLocaleTimeString();
      },
      
      getISOTime: function() {
        return new Date().toISOString();
      },
      
      getTimestamp: function() {
        return Date.now();
      },
      
      checkAccess: function() {
        return {
          available: true,
          powered: window.RayPowerControl ? window.RayPowerControl.isPowered() : false,
          message: "Emergency clock interface active"
        };
      },
      
      isRunning: function() {
        return true; // Emergency interface is always "running"
      }
    };
    
    console.log('✅ [Clock Monitor] Emergency clock interface created');
  }

  function createBasicClockInterface() {
    console.log('🔧 [Clock Monitor] Creating basic fallback clock interface...');
    
    // Absolute fallback - basic JavaScript Date functions
    if (!window.RayClock) {
      window.RayClock = {};
    }
    
    window.RayClock.getCurrentTime = function() {
      return new Date().toLocaleTimeString();
    };
    
    window.RayClock.getISOTime = function() {
      return new Date().toISOString();
    };
    
    window.RayClock.getTimestamp = function() {
      return Date.now();
    };
    
    window.RayClock.checkAccess = function() {
      return {
        available: true,
        powered: false,
        message: "Basic fallback clock interface"
      };
    };
    
    console.log('✅ [Clock Monitor] Basic fallback clock interface ready');
  }

  function stopClockMonitoring() {
    if (monitorInterval) {
      clearInterval(monitorInterval);
      monitorInterval = null;
      console.log('🕐 [Clock Monitor] Clock monitoring stopped');
    }
  }

  function getMonitorStatus() {
    return {
      monitoring: monitorInterval !== null,
      lastCheck: lastClockCheck,
      failures: clockFailures,
      clockAvailable: window.BrowserClock !== undefined,
      rayClockAvailable: window.RayClock !== undefined
    };
  }

  function initClockMonitor() {
    console.log('🕐 [Clock Monitor] Initializing clock monitoring system...');
    
    // Start monitoring after a brief delay to let other systems load
    setTimeout(() => {
      startClockMonitoring();
      
      // Create basic clock interface immediately as fallback
      if (!window.RayClock) {
        createBasicClockInterface();
      }
      
    }, 3000);
  }

  // Expose module
  window.ClockMonitor = {
    init: initClockMonitor,
    start: startClockMonitoring,
    stop: stopClockMonitoring,
    restart: restartClock,
    emergency: emergencyClockRestart,
    status: getMonitorStatus
  };

  console.log('✅ ClockMonitor loaded');
})();