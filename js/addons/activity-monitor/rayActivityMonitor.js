(function() {
  'use strict';

  let activityMonitor = null;
  let activityLog = [];
  let isMonitorVisible = false;
  let monitorButton = null;
  let maxLogEntries = 100;

  function createActivityMonitor() {
    if (activityMonitor) {
      return activityMonitor;
    }

    // Create monitor button
    monitorButton = document.createElement('button');
    monitorButton.innerHTML = '📊';
    monitorButton.title = 'Ray Activity Monitor';
    monitorButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 320px;
      z-index: 10000;
      background: #2d2d2d;
      color: white;
      border: 2px solid #555;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;

    // Add hover effects
    monitorButton.addEventListener('mouseenter', () => {
      monitorButton.style.background = '#404040';
      monitorButton.style.transform = 'scale(1.1)';
    });

    monitorButton.addEventListener('mouseleave', () => {
      monitorButton.style.background = '#2d2d2d';
      monitorButton.style.transform = 'scale(1)';
    });

    // Add click handler
    monitorButton.addEventListener('click', () => {
      toggleActivityMonitor();
    });

    // Create activity monitor panel
    activityMonitor = document.createElement('div');
    activityMonitor.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 10001;
      background: #1a1a1a;
      color: white;
      border: 2px solid #555;
      border-radius: 15px;
      width: 400px;
      height: 500px;
      display: none;
      font-family: 'Courier New', monospace;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      overflow: hidden;
    `;

    // Create monitor content
    activityMonitor.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #333; border-bottom: 1px solid #555;">
        <h3 style="margin: 0; color: #00ff88; font-size: 16px;">📊 Ray Activity Monitor</h3>
        <button id="closeActivityMonitor" style="background: none; border: none; color: #aaa; font-size: 18px; cursor: pointer;">×</button>
      </div>
      
      <div style="padding: 10px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <div style="font-size: 12px; color: #aaa;">
            <span id="totalActions">0</span> actions logged
          </div>
          <div style="display: flex; gap: 5px;">
            <button id="clearLog" style="background: #ff4444; color: white; border: none; padding: 4px 8px; border-radius: 3px; font-size: 10px; cursor: pointer;">Clear</button>
            <button id="exportLog" style="background: #4CAF50; color: white; border: none; padding: 4px 8px; border-radius: 3px; font-size: 10px; cursor: pointer;">Export</button>
          </div>
        </div>
        
        <div id="activityLogContainer" style="
          height: 400px;
          overflow-y: auto;
          background: #0d1117;
          border: 1px solid #333;
          border-radius: 5px;
          padding: 10px;
          font-size: 11px;
          line-height: 1.4;
        ">
          <div style="color: #666; text-align: center; margin-top: 50px;">
            Waiting for Ray's activities...
          </div>
        </div>
      </div>
    `;

    // Append to body
    document.body.appendChild(monitorButton);
    document.body.appendChild(activityMonitor);

    // Set up event listeners
    setupMonitorEventListeners();

    console.log('✅ [Activity Monitor] Ray activity monitor created');
    return activityMonitor;
  }

  function setupMonitorEventListeners() {
    // Close button
    document.getElementById('closeActivityMonitor').addEventListener('click', () => {
      hideActivityMonitor();
    });

    // Clear log button
    document.getElementById('clearLog').addEventListener('click', () => {
      clearActivityLog();
    });

    // Export log button
    document.getElementById('exportLog').addEventListener('click', () => {
      exportActivityLog();
    });

    // Close monitor when clicking outside
    document.addEventListener('click', (e) => {
      if (isMonitorVisible && 
          !activityMonitor.contains(e.target) && 
          e.target !== monitorButton) {
        hideActivityMonitor();
      }
    });
  }

  function logActivity(action, details = {}) {
    const timestamp = new Date().toISOString();
    const entry = {
      id: Date.now() + Math.random(),
      timestamp: timestamp,
      time: new Date().toLocaleTimeString(),
      action: action,
      details: details,
      rayUptime: window.RayTemporal ? window.RayTemporal.uptimeFormatted : 'Unknown'
    };

    // Add to log
    activityLog.unshift(entry);

    // Keep only recent entries
    if (activityLog.length > maxLogEntries) {
      activityLog = activityLog.slice(0, maxLogEntries);
    }

    // Update display
    updateActivityDisplay();

    console.log(`📊 [Activity Monitor] ${action}:`, details);
  }

  function updateActivityDisplay() {
    const container = document.getElementById('activityLogContainer');
    const totalActions = document.getElementById('totalActions');
    
    if (!container || !totalActions) return;

    // Update total count
    totalActions.textContent = activityLog.length;

    // Update log display
    if (activityLog.length === 0) {
      container.innerHTML = `
        <div style="color: #666; text-align: center; margin-top: 50px;">
          No activities logged yet...
        </div>
      `;
      return;
    }

    const logHTML = activityLog.map(entry => {
      const actionColor = getActionColor(entry.action);
      const detailsText = formatDetails(entry.details);
      
      return `
        <div style="
          margin-bottom: 8px; 
          padding: 6px; 
          background: #161b22; 
          border-left: 3px solid ${actionColor}; 
          border-radius: 3px;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: ${actionColor}; font-weight: bold;">${entry.action}</span>
            <span style="color: #666; font-size: 10px;">${entry.time}</span>
          </div>
          ${detailsText ? `<div style="color: #aaa; font-size: 10px; margin-top: 2px;">${detailsText}</div>` : ''}
          <div style="color: #666; font-size: 9px; margin-top: 2px;">
            Ray Uptime: ${entry.rayUptime}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = logHTML;
    
    // Auto-scroll to top for newest entries
    container.scrollTop = 0;
  }

  function getActionColor(action) {
    const colorMap = {
      'HEARTBEAT': '#ff6b6b',
      'VOICE_RECOGNITION': '#4ecdc4',
      'VOICE_SYNTHESIS': '#45b7d1',
      'DOM_INTERACTION': '#96ceb4',
      'POWER_CHANGE': '#feca57',
      'MESSAGE_SENT': '#ff9ff3',
      'RESPONSE_RECEIVED': '#54a0ff',
      'SYSTEM_INIT': '#5f27cd',
      'ERROR': '#ee5a52',
      'WARNING': '#ff9f43',
      'INFO': '#00d2d3'
    };
    
    return colorMap[action] || '#888';
  }

  function formatDetails(details) {
    if (!details || Object.keys(details).length === 0) return '';
    
    const formatted = Object.entries(details)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' | ');
    
    return formatted.length > 60 ? formatted.substring(0, 60) + '...' : formatted;
  }

  function toggleActivityMonitor() {
    if (isMonitorVisible) {
      hideActivityMonitor();
    } else {
      showActivityMonitor();
    }
  }

  function showActivityMonitor() {
    if (!activityMonitor) {
      createActivityMonitor();
    }
    
    activityMonitor.style.display = 'block';
    isMonitorVisible = true;
    
    // Update display with current log
    updateActivityDisplay();
    
    console.log('📊 [Activity Monitor] Monitor shown');
  }

  function hideActivityMonitor() {
    if (activityMonitor) {
      activityMonitor.style.display = 'none';
    }
    isMonitorVisible = false;
    console.log('📊 [Activity Monitor] Monitor hidden');
  }

  function clearActivityLog() {
    activityLog = [];
    updateActivityDisplay();
    logActivity('LOG_CLEARED', { action: 'User cleared activity log' });
  }

  function exportActivityLog() {
    const exportData = {
      exportTime: new Date().toISOString(),
      totalEntries: activityLog.length,
      rayUptime: window.RayTemporal ? window.RayTemporal.uptimeFormatted : 'Unknown',
      activities: activityLog
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ray-activity-log-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    logActivity('LOG_EXPORTED', { entries: activityLog.length });
  }

  function setupActivityTracking() {
    console.log('📊 [Activity Monitor] Setting up activity tracking...');

    // Track Ray's heartbeat
    document.addEventListener('rayHeartbeat', (event) => {
      if (event.detail.tick % 10 === 0) { // Log every 10th heartbeat to avoid spam
        logActivity('HEARTBEAT', { 
          tick: event.detail.tick,
          uptime: event.detail.uptimeFormatted 
        });
      }
    });

    // Track power changes
    if (window.RayPowerControl) {
      const originalToggle = window.RayPowerControl.toggle;
      window.RayPowerControl.toggle = function() {
        const wasPowered = this.isPowered();
        const result = originalToggle.call(this);
        const nowPowered = this.isPowered();
        
        logActivity('POWER_CHANGE', { 
          from: wasPowered ? 'ON' : 'OFF',
          to: nowPowered ? 'ON' : 'OFF'
        });
        
        return result;
      };
    }

    // Track voice recognition
    if (window.VoiceRecognition) {
      const originalStart = window.VoiceRecognition.startListening;
      const originalStop = window.VoiceRecognition.stopListening;
      
      window.VoiceRecognition.startListening = function(callback) {
        logActivity('VOICE_RECOGNITION', { action: 'Started listening' });
        return originalStart.call(this, (transcript) => {
          logActivity('VOICE_RECOGNITION', { 
            action: 'Transcript received',
            text: transcript.substring(0, 50) + (transcript.length > 50 ? '...' : '')
          });
          if (callback) callback(transcript);
        });
      };
      
      window.VoiceRecognition.stopListening = function() {
        logActivity('VOICE_RECOGNITION', { action: 'Stopped listening' });
        return originalStop.call(this);
      };
    }

    // Track voice synthesis
    if (window.VoiceSynthesis) {
      const originalSpeak = window.VoiceSynthesis.speak;
      
      window.VoiceSynthesis.speak = function(text, options) {
        logActivity('VOICE_SYNTHESIS', { 
          action: 'Speaking',
          text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
          options: options
        });
        return originalSpeak.call(this, text, options);
      };
    }

    // Track message sending
    if (window.MessageSender) {
      const originalSend = window.MessageSender.sendTestMessage;
      
      window.MessageSender.sendTestMessage = function(message, onFailure, skipResponseHandling) {
        logActivity('MESSAGE_SENT', { 
          message: typeof message === 'string' ? 
            message.substring(0, 50) + (message.length > 50 ? '...' : '') : 
            'Function callback'
        });
        return originalSend.call(this, message, onFailure, skipResponseHandling);
      };
    }

    console.log('✅ [Activity Monitor] Activity tracking enabled');
  }

  function initActivityMonitor() {
    console.log('📊 [Activity Monitor] Initializing Ray activity monitor...');
    
    // Create monitor UI
    createActivityMonitor();
    
    // Set up activity tracking
    setupActivityTracking();
    
    // Log initialization
    logActivity('SYSTEM_INIT', { 
      component: 'Activity Monitor',
      timestamp: new Date().toISOString()
    });
    
    console.log('✅ [Activity Monitor] Ray activity monitor ready');
  }

  function getActivityStats() {
    const stats = {
      totalActivities: activityLog.length,
      recentActivities: activityLog.slice(0, 10),
      activityTypes: {},
      timeRange: {
        oldest: activityLog.length > 0 ? activityLog[activityLog.length - 1].timestamp : null,
        newest: activityLog.length > 0 ? activityLog[0].timestamp : null
      }
    };

    // Count activity types
    activityLog.forEach(entry => {
      stats.activityTypes[entry.action] = (stats.activityTypes[entry.action] || 0) + 1;
    });

    return stats;
  }

  // Expose module
  window.RayActivityMonitor = {
    init: initActivityMonitor,
    show: showActivityMonitor,
    hide: hideActivityMonitor,
    toggle: toggleActivityMonitor,
    log: logActivity,
    clear: clearActivityLog,
    export: exportActivityLog,
    stats: getActivityStats,
    getLog: () => [...activityLog]
  };

  console.log('✅ RayActivityMonitor loaded');
})();