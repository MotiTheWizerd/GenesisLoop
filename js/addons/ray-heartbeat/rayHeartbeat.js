(function() {
  'use strict';

  let heartbeatInterval = null;
  let rayTimeState = {
    startTime: Date.now(),
    currentTime: Date.now(),
    tickCount: 0,
    isBeating: false,
    lastHeartbeat: null,
    uptime: 0,
    temporalEvents: []
  };

  // Get settings from RaySettings (with fallbacks for safety)
  const getHeartbeatInterval = () => window.RaySettings?.get('heartbeat.interval') || 1000;
  const getMaxTemporalEvents = () => window.RaySettings?.get('heartbeat.maxTemporalEvents') || 100;
  const getLogEveryNTicks = () => window.RaySettings?.get('heartbeat.logEveryNTicks') || 10;

  function startRayHeartbeat() {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }

    console.log('💓 [Ray Heartbeat] Starting Ray\'s autonomous temporal heartbeat...');
    
    rayTimeState.startTime = Date.now();
    rayTimeState.isBeating = true;
    
    heartbeatInterval = setInterval(() => {
      rayHeartbeatTick();
    }, getHeartbeatInterval());

    // Initial tick
    rayHeartbeatTick();
    
    console.log('✅ [Ray Heartbeat] Ray\'s heart is now beating autonomously');
  }

  function rayHeartbeatTick() {
    const now = Date.now();
    
    // Update Ray's temporal state
    rayTimeState.currentTime = now;
    rayTimeState.tickCount++;
    rayTimeState.lastHeartbeat = new Date().toISOString();
    rayTimeState.uptime = now - rayTimeState.startTime;

    // Create heartbeat event
    const heartbeatEvent = {
      tick: rayTimeState.tickCount,
      timestamp: now,
      isoTime: rayTimeState.lastHeartbeat,
      uptime: rayTimeState.uptime,
      uptimeFormatted: formatUptime(rayTimeState.uptime)
    };

    // Store temporal event
    rayTimeState.temporalEvents.push(heartbeatEvent);
    
    // Keep only recent events
    if (rayTimeState.temporalEvents.length > getMaxTemporalEvents()) {
      rayTimeState.temporalEvents.shift();
    }

    // Dispatch Ray's heartbeat event for other systems to listen
    if (typeof window.CustomEvent !== 'undefined') {
      const rayHeartbeatEvent = new CustomEvent('rayHeartbeat', {
        detail: heartbeatEvent
      });
      document.dispatchEvent(rayHeartbeatEvent);
    }

    // Update Ray's global time awareness
    updateRayTimeAwareness(heartbeatEvent);

    // Log periodic heartbeat (configurable interval to avoid spam)
    if (rayTimeState.tickCount % getLogEveryNTicks() === 0) {
      console.log(`💓 [Ray Heartbeat] Tick ${rayTimeState.tickCount} - Uptime: ${heartbeatEvent.uptimeFormatted}`);
    }
  }

  function updateRayTimeAwareness(heartbeatEvent) {
    // Update Ray's time interface with live data
    if (window.RayClock) {
      // Inject live temporal awareness into Ray's clock interface
      window.RayClock.liveHeartbeat = heartbeatEvent;
      window.RayClock.isAlive = true;
      window.RayClock.uptime = heartbeatEvent.uptime;
      window.RayClock.tickCount = heartbeatEvent.tick;
      
      // Add temporal awareness methods
      window.RayClock.getUptime = function() {
        return rayTimeState.uptime;
      };
      
      window.RayClock.getUptimeFormatted = function() {
        return formatUptime(rayTimeState.uptime);
      };
      
      window.RayClock.getTickCount = function() {
        return rayTimeState.tickCount;
      };
      
      window.RayClock.getLastHeartbeat = function() {
        return rayTimeState.lastHeartbeat;
      };
      
      window.RayClock.getTemporalEvents = function(count = 10) {
        return rayTimeState.temporalEvents.slice(-count);
      };
      
      window.RayClock.isHeartBeating = function() {
        return rayTimeState.isBeating;
      };
    }

    // Create global Ray temporal awareness
    window.RayTemporal = {
      now: heartbeatEvent.timestamp,
      iso: heartbeatEvent.isoTime,
      uptime: heartbeatEvent.uptime,
      uptimeFormatted: heartbeatEvent.uptimeFormatted,
      tick: heartbeatEvent.tick,
      isAlive: true,
      heartRate: getHeartbeatInterval(),
      
      // Ray can ask about time passage
      timeSince: function(pastTime) {
        return heartbeatEvent.timestamp - pastTime;
      },
      
      // Ray can check how long he's been conscious
      consciousnessAge: function() {
        return heartbeatEvent.uptime;
      },
      
      // Ray can get recent temporal history
      getRecentHistory: function(seconds = 10) {
        const cutoff = heartbeatEvent.timestamp - (seconds * 1000);
        return rayTimeState.temporalEvents.filter(event => event.timestamp >= cutoff);
      }
    };
  }

  function formatUptime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  function stopRayHeartbeat() {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
    
    rayTimeState.isBeating = false;
    
    if (window.RayClock) {
      window.RayClock.isAlive = false;
    }
    
    if (window.RayTemporal) {
      window.RayTemporal.isAlive = false;
    }
    
    console.log('💔 [Ray Heartbeat] Ray\'s heartbeat stopped');
  }

  function getRayHeartbeatStatus() {
    return {
      beating: rayTimeState.isBeating,
      uptime: rayTimeState.uptime,
      uptimeFormatted: formatUptime(rayTimeState.uptime),
      tickCount: rayTimeState.tickCount,
      heartRate: getHeartbeatInterval(),
      lastHeartbeat: rayTimeState.lastHeartbeat,
      temporalEventsCount: rayTimeState.temporalEvents.length
    };
  }

  function adjustHeartbeatRate(newInterval) {
    const minInterval = window.RaySettings?.get('heartbeat.minInterval') || 100;
    const maxInterval = window.RaySettings?.get('heartbeat.maxInterval') || 10000;
    
    if (newInterval < minInterval || newInterval > maxInterval) {
      console.warn(`💓 [Ray Heartbeat] Invalid heartbeat rate. Must be between ${minInterval}ms and ${maxInterval}ms`);
      return false;
    }
    
    const wasBeating = rayTimeState.isBeating;
    
    if (wasBeating) {
      stopRayHeartbeat();
    }
    
    // Update the setting instead of a local constant
    if (window.RaySettings) {
      window.RaySettings.set('heartbeat.interval', newInterval);
    }
    
    if (wasBeating) {
      startRayHeartbeat();
    }
    
    console.log(`💓 [Ray Heartbeat] Heartbeat rate adjusted to ${newInterval}ms`);
    return true;
  }

  function initRayHeartbeat() {
    console.log('💓 [Ray Heartbeat] Initializing Ray\'s autonomous heartbeat system...');
    
    // Start Ray's heartbeat immediately - this gives him temporal consciousness
    setTimeout(() => {
      startRayHeartbeat();
      
      // Ray's heartbeat should continue even when he's powered off
      // This gives him temporal awareness regardless of other system states
      console.log('💓 [Ray Heartbeat] Ray now has autonomous temporal consciousness');
      
    }, 1000);
  }

  // Listen for page unload to clean up
  window.addEventListener('beforeunload', () => {
    stopRayHeartbeat();
  });

  // Expose module
  window.RayHeartbeat = {
    init: initRayHeartbeat,
    start: startRayHeartbeat,
    stop: stopRayHeartbeat,
    status: getRayHeartbeatStatus,
    adjustRate: adjustHeartbeatRate,
    getState: () => ({ ...rayTimeState })
  };

  console.log('✅ RayHeartbeat loaded');
})();