(function() {
  'use strict';

  let clockDisplay = null;
  let clockInterval = null;
  let isVisible = true;

  function createClockDisplay() {
    if (clockDisplay) {
      return clockDisplay;
    }

    // Create clock display element
    clockDisplay = document.createElement('div');
    clockDisplay.id = 'ray-clock-display';
    clockDisplay.style.cssText = `
      position: fixed;
      top: 20px;
      right: 50%;
      transform: translateX(50%);
      z-index: 9999;
      background: linear-gradient(135deg, #2d2d2d 0%, #404040 100%);
      color: #00ff88;
      border: 2px solid #555;
      border-radius: 25px;
      padding: 8px 20px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      cursor: pointer;
      user-select: none;
      min-width: 200px;
    `;

    // Add hover effects
    clockDisplay.addEventListener('mouseenter', () => {
      clockDisplay.style.transform = 'translateX(50%) scale(1.05)';
      clockDisplay.style.boxShadow = '0 6px 20px rgba(0,255,136,0.3)';
      clockDisplay.style.borderColor = '#00ff88';
    });

    clockDisplay.addEventListener('mouseleave', () => {
      clockDisplay.style.transform = 'translateX(50%) scale(1)';
      clockDisplay.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
      clockDisplay.style.borderColor = '#555';
    });

    // Click to toggle format
    clockDisplay.addEventListener('click', () => {
      toggleTimeFormat();
    });

    // Initial time display
    updateClockDisplay();

    // Append to body
    document.body.appendChild(clockDisplay);

    console.log('✅ [Clock Display] Clock display created');
    return clockDisplay;
  }

  let timeFormat = 'time'; // 'time', 'iso', 'unix', 'detailed'
  const formats = ['time', 'iso', 'unix', 'detailed'];

  function toggleTimeFormat() {
    const currentIndex = formats.indexOf(timeFormat);
    const nextIndex = (currentIndex + 1) % formats.length;
    timeFormat = formats[nextIndex];
    
    console.log(`🕐 [Clock Display] Switched to ${timeFormat} format`);
    updateClockDisplay();
  }

  function updateClockDisplay() {
    if (!clockDisplay) return;

    try {
      let timeString = '';
      let subtitle = '';

      switch (timeFormat) {
        case 'time':
          timeString = new Date().toLocaleTimeString();
          subtitle = 'Local Time';
          break;
          
        case 'iso':
          if (window.RayClock) {
            timeString = window.RayClock.getISOTime();
          } else {
            timeString = new Date().toISOString();
          }
          subtitle = 'ISO Time';
          break;
          
        case 'unix':
          if (window.RayClock) {
            timeString = window.RayClock.getTimestamp().toString();
          } else {
            timeString = Date.now().toString();
          }
          subtitle = 'Unix Timestamp';
          break;
          
        case 'detailed':
          const now = new Date();
          timeString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
          subtitle = 'Full Date & Time';
          break;
      }

      // Update display with main time and subtitle
      clockDisplay.innerHTML = `
        <div style="font-size: 14px; font-weight: bold; color: #00ff88; transition: all 0.1s ease;">
          ${timeString}
        </div>
        <div style="font-size: 10px; color: #aaa; margin-top: 2px;">
          ${subtitle} • Click to change
        </div>
      `;

      // Add subtle tick animation
      clockDisplay.style.transform = 'translateX(50%) scale(1.01)';
      setTimeout(() => {
        clockDisplay.style.transform = 'translateX(50%) scale(1)';
      }, 100);

      // Add power status and heartbeat indicator
      const rayPowered = window.RayPowerControl ? window.RayPowerControl.isPowered() : false;
      const rayHeartbeating = window.RayTemporal ? window.RayTemporal.isAlive : false;
      const powerDot = rayPowered ? '🟢' : '🔴';
      const heartDot = rayHeartbeating ? '💓' : '💔';
      
      clockDisplay.innerHTML += `
        <div style="position: absolute; top: -5px; right: -5px; font-size: 12px;">
          ${powerDot}
        </div>
        <div style="position: absolute; top: -5px; left: -5px; font-size: 12px;">
          ${heartDot}
        </div>
      `;

      // Add Ray's uptime if available
      if (window.RayTemporal && timeFormat === 'detailed') {
        const uptime = window.RayTemporal.uptimeFormatted;
        clockDisplay.innerHTML += `
          <div style="font-size: 9px; color: #666; margin-top: 3px;">
            Ray Uptime: ${uptime}
          </div>
        `;
      }

    } catch (error) {
      console.error('🕐 [Clock Display] Update error:', error);
      clockDisplay.innerHTML = `
        <div style="color: #ff6666;">
          Clock Error
        </div>
        <div style="font-size: 10px; color: #aaa;">
          ${new Date().toLocaleTimeString()}
        </div>
      `;
    }
  }

  function startClockDisplay() {
    if (clockInterval) {
      clearInterval(clockInterval);
    }

    // Update immediately first
    updateClockDisplay();

    // Then update every second (1000ms)
    clockInterval = setInterval(() => {
      updateClockDisplay();
    }, 1000);

    console.log('✅ [Clock Display] Clock display started - updating every 1 second');
  }

  function stopClockDisplay() {
    if (clockInterval) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
    console.log('🕐 [Clock Display] Clock display stopped');
  }

  function showClockDisplay() {
    if (clockDisplay) {
      clockDisplay.style.display = 'block';
      isVisible = true;
      console.log('👁️ [Clock Display] Clock display shown');
    }
  }

  function hideClockDisplay() {
    if (clockDisplay) {
      clockDisplay.style.display = 'none';
      isVisible = false;
      console.log('👁️ [Clock Display] Clock display hidden');
    }
  }

  function toggleClockDisplay() {
    if (isVisible) {
      hideClockDisplay();
    } else {
      showClockDisplay();
    }
  }

  function removeClockDisplay() {
    stopClockDisplay();
    
    if (clockDisplay) {
      clockDisplay.remove();
      clockDisplay = null;
    }
    
    console.log('🗑️ [Clock Display] Clock display removed');
  }

  function setClockStyle(style) {
    if (!clockDisplay) return;

    switch (style) {
      case 'minimal':
        clockDisplay.style.background = 'rgba(0,0,0,0.8)';
        clockDisplay.style.border = '1px solid #333';
        clockDisplay.style.borderRadius = '15px';
        clockDisplay.style.padding = '5px 15px';
        break;
        
      case 'neon':
        clockDisplay.style.background = 'rgba(0,0,0,0.9)';
        clockDisplay.style.border = '2px solid #00ff88';
        clockDisplay.style.boxShadow = '0 0 20px rgba(0,255,136,0.5)';
        clockDisplay.style.color = '#00ff88';
        break;
        
      case 'classic':
        clockDisplay.style.background = 'linear-gradient(135deg, #2d2d2d 0%, #404040 100%)';
        clockDisplay.style.border = '2px solid #555';
        clockDisplay.style.color = '#00ff88';
        break;
        
      case 'transparent':
        clockDisplay.style.background = 'rgba(45,45,45,0.7)';
        clockDisplay.style.backdropFilter = 'blur(15px)';
        clockDisplay.style.border = '1px solid rgba(255,255,255,0.2)';
        break;
    }
    
    console.log(`🎨 [Clock Display] Style changed to ${style}`);
  }

  function getClockStatus() {
    return {
      visible: isVisible,
      running: clockInterval !== null,
      format: timeFormat,
      element: clockDisplay !== null
    };
  }

  function initClockDisplay() {
    console.log('🕐 [Clock Display] Initializing clock display...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          createClockDisplay();
          startClockDisplay();
        }, 1000);
      });
    } else {
      setTimeout(() => {
        createClockDisplay();
        startClockDisplay();
      }, 1000);
    }
  }

  // Expose module
  window.ClockDisplay = {
    init: initClockDisplay,
    show: showClockDisplay,
    hide: hideClockDisplay,
    toggle: toggleClockDisplay,
    remove: removeClockDisplay,
    setStyle: setClockStyle,
    toggleFormat: toggleTimeFormat,
    status: getClockStatus
  };

  console.log('✅ ClockDisplay loaded');
})();