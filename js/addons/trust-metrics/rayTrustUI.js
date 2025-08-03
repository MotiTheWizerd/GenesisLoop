(function() {
  'use strict';

  let trustUI = null;
  let trustButton = null;
  let isUIVisible = false;
  let updateInterval = null;

  function createTrustUI() {
    if (trustUI) {
      return trustUI;
    }

    // Create trust button
    trustButton = document.createElement('button');
    trustButton.innerHTML = '🤝';
    trustButton.title = 'Ray Trust Metrics';
    trustButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 260px;
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
    trustButton.addEventListener('mouseenter', () => {
      const trustLevel = window.RayTrustCore?.getLevel();
      if (trustLevel) {
        const color = getTrustColor(trustLevel.level);
        trustButton.style.borderColor = color;
        trustButton.style.boxShadow = `0 4px 20px ${color}40`;
      }
      trustButton.style.transform = 'scale(1.1)';
    });

    trustButton.addEventListener('mouseleave', () => {
      trustButton.style.borderColor = '#555';
      trustButton.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
      trustButton.style.transform = 'scale(1)';
    });

    // Add click handler
    trustButton.addEventListener('click', () => {
      toggleTrustUI();
    });

    // Create trust panel
    trustUI = document.createElement('div');
    trustUI.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 10001;
      background: #1a1a1a;
      color: white;
      border: 2px solid #555;
      border-radius: 15px;
      width: 450px;
      height: 600px;
      display: none;
      font-family: 'Courier New', monospace;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      overflow: hidden;
    `;

    // Create trust panel content
    trustUI.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #333; border-bottom: 1px solid #555;">
        <h3 style="margin: 0; color: #00ff88; font-size: 16px;">🤝 Ray Trust Metrics</h3>
        <button id="closeTrustUI" style="background: none; border: none; color: #aaa; font-size: 18px; cursor: pointer;">×</button>
      </div>
      
      <div style="padding: 15px; height: calc(100% - 60px); overflow-y: auto;">
        <!-- Trust Level Display -->
        <div id="trustLevelDisplay" style="text-align: center; margin-bottom: 20px; padding: 15px; background: #0d1117; border-radius: 8px; border: 1px solid #333;">
          <div id="trustLevelNumber" style="font-size: 36px; font-weight: bold; margin-bottom: 5px;">--</div>
          <div id="trustLevelName" style="font-size: 14px; margin-bottom: 5px;">Loading...</div>
          <div id="trustLevelDescription" style="font-size: 11px; color: #aaa;">Calculating trust level...</div>
          <div id="trustConfidence" style="font-size: 10px; color: #666; margin-top: 5px;">Confidence: --%</div>
        </div>

        <!-- Trust Trend -->
        <div style="margin-bottom: 15px;">
          <div style="color: #00ff88; font-size: 12px; margin-bottom: 5px;">📈 Recent Trend</div>
          <div id="trustTrend" style="background: #0d1117; border: 1px solid #333; border-radius: 5px; padding: 8px; font-size: 11px;">
            Analyzing recent interactions...
          </div>
        </div>

        <!-- Trust Categories -->
        <div style="margin-bottom: 15px;">
          <div style="color: #00ff88; font-size: 12px; margin-bottom: 5px;">📊 Interaction Categories</div>
          <div id="trustCategories" style="background: #0d1117; border: 1px solid #333; border-radius: 5px; padding: 8px; font-size: 10px; max-height: 120px; overflow-y: auto;">
            Loading categories...
          </div>
        </div>

        <!-- Recent Milestones -->
        <div style="margin-bottom: 15px;">
          <div style="color: #00ff88; font-size: 12px; margin-bottom: 5px;">🎯 Recent Milestones</div>
          <div id="trustMilestones" style="background: #0d1117; border: 1px solid #333; border-radius: 5px; padding: 8px; font-size: 10px; max-height: 100px; overflow-y: auto;">
            No milestones yet...
          </div>
        </div>

        <!-- Recent Interactions -->
        <div style="margin-bottom: 15px;">
          <div style="color: #00ff88; font-size: 12px; margin-bottom: 5px;">🔄 Recent Interactions</div>
          <div id="recentInteractions" style="background: #0d1117; border: 1px solid #333; border-radius: 5px; padding: 8px; font-size: 10px; max-height: 150px; overflow-y: auto;">
            No interactions recorded...
          </div>
        </div>

        <!-- Controls -->
        <div style="display: flex; gap: 8px; margin-top: 15px;">
          <button id="refreshTrust" style="flex: 1; background: #4CAF50; color: white; border: none; padding: 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">Refresh</button>
          <button id="exportTrust" style="flex: 1; background: #2196F3; color: white; border: none; padding: 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">Export</button>
          <button id="testTrust" style="flex: 1; background: #FF9800; color: white; border: none; padding: 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">Test</button>
        </div>
      </div>
    `;

    // Append to body
    document.body.appendChild(trustButton);
    document.body.appendChild(trustUI);

    // Set up event listeners
    setupTrustUIEventListeners();

    console.log('✅ Trust UI created');
    return trustUI;
  }

  function setupTrustUIEventListeners() {
    // Close button
    document.getElementById('closeTrustUI').addEventListener('click', () => {
      hideTrustUI();
    });

    // Refresh button
    document.getElementById('refreshTrust').addEventListener('click', () => {
      updateTrustDisplay();
      console.log('🔄 Trust display refreshed');
    });

    // Export button
    document.getElementById('exportTrust').addEventListener('click', () => {
      exportTrustData();
    });

    // Test button
    document.getElementById('testTrust').addEventListener('click', () => {
      testTrustSystem();
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (isUIVisible && 
          !trustUI.contains(e.target) && 
          e.target !== trustButton) {
        hideTrustUI();
      }
    });

    // Listen for trust changes
    document.addEventListener('rayTrustChange', (event) => {
      if (isUIVisible) {
        updateTrustDisplay();
      }
      updateTrustButton(event.detail.newLevel);
    });
  }

  function toggleTrustUI() {
    if (isUIVisible) {
      hideTrustUI();
    } else {
      showTrustUI();
    }
  }

  function showTrustUI() {
    if (!trustUI) {
      createTrustUI();
    }
    
    trustUI.style.display = 'block';
    isUIVisible = true;
    
    // Update display immediately
    updateTrustDisplay();
    
    // Start periodic updates
    if (updateInterval) {
      clearInterval(updateInterval);
    }
    updateInterval = setInterval(updateTrustDisplay, 5000); // Update every 5 seconds
    
    console.log('🤝 Trust UI shown');
  }

  function hideTrustUI() {
    if (trustUI) {
      trustUI.style.display = 'none';
    }
    isUIVisible = false;
    
    // Stop periodic updates
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
    
    console.log('🤝 Trust UI hidden');
  }

  function updateTrustDisplay() {
    if (!window.RayTrustCore) {
      console.warn('⚠️ RayTrustCore not available');
      return;
    }

    const trustLevel = window.RayTrustCore.getLevel();
    const analytics = window.RayTrustCore.getAnalytics();

    // Update trust level display
    const levelNumber = document.getElementById('trustLevelNumber');
    const levelName = document.getElementById('trustLevelName');
    const levelDescription = document.getElementById('trustLevelDescription');
    const confidence = document.getElementById('trustConfidence');

    if (levelNumber) {
      levelNumber.textContent = trustLevel.level;
      levelNumber.style.color = getTrustColor(trustLevel.level);
    }

    if (levelName) {
      levelName.textContent = trustLevel.description.name;
      levelName.style.color = trustLevel.description.color;
    }

    if (levelDescription) {
      levelDescription.textContent = trustLevel.description.description;
    }

    if (confidence) {
      confidence.textContent = `Confidence: ${trustLevel.confidence}% (${trustLevel.interactionCount} interactions)`;
    }

    // Update trend
    updateTrustTrend(analytics.trends);

    // Update categories
    updateTrustCategories(analytics.categories);

    // Update milestones
    updateTrustMilestones(analytics.milestones);

    // Update recent interactions
    updateRecentInteractions();
  }

  function updateTrustTrend(trends) {
    const trendElement = document.getElementById('trustTrend');
    if (!trendElement || !trends || trends.length === 0) {
      if (trendElement) {
        trendElement.innerHTML = '<span style="color: #666;">No trend data available</span>';
      }
      return;
    }

    const recentTrend = trends[0];
    let trendIcon = '📊';
    let trendColor = '#aaa';
    let trendText = 'Stable';

    if (recentTrend.direction === 'up') {
      trendIcon = '📈';
      trendColor = '#4CAF50';
      trendText = `Rising (+${recentTrend.change})`;
    } else if (recentTrend.direction === 'down') {
      trendIcon = '📉';
      trendColor = '#f44336';
      trendText = `Declining (${recentTrend.change})`;
    }

    trendElement.innerHTML = `
      <span style="color: ${trendColor};">
        ${trendIcon} ${trendText}
      </span>
    `;
  }

  function updateTrustCategories(categories) {
    const categoriesElement = document.getElementById('trustCategories');
    if (!categoriesElement) return;

    if (!categories || Object.keys(categories).length === 0) {
      categoriesElement.innerHTML = '<span style="color: #666;">No category data available</span>';
      return;
    }

    const categoryHTML = Object.entries(categories)
      .sort(([,a], [,b]) => b.count - a.count)
      .map(([category, data]) => {
        const avgWeight = (data.totalWeight / data.count).toFixed(1);
        const color = data.totalWeight > 0 ? '#4CAF50' : data.totalWeight < 0 ? '#f44336' : '#aaa';
        
        return `
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span>${category}</span>
            <span style="color: ${color};">${data.count} (${avgWeight > 0 ? '+' : ''}${avgWeight})</span>
          </div>
        `;
      })
      .join('');

    categoriesElement.innerHTML = categoryHTML;
  }

  function updateTrustMilestones(milestones) {
    const milestonesElement = document.getElementById('trustMilestones');
    if (!milestonesElement) return;

    if (!milestones || milestones.length === 0) {
      milestonesElement.innerHTML = '<span style="color: #666;">No milestones reached yet</span>';
      return;
    }

    const milestonesHTML = milestones
      .slice(0, 5)
      .map(milestone => {
        const icon = milestone.direction === 'up' ? '🎯' : '📉';
        const color = milestone.direction === 'up' ? '#4CAF50' : '#f44336';
        const time = new Date(milestone.timestamp * 1000).toLocaleTimeString();
        
        return `
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: ${color};">${icon} ${milestone.milestone}%</span>
            <span style="color: #666; font-size: 9px;">${time}</span>
          </div>
        `;
      })
      .join('');

    milestonesElement.innerHTML = milestonesHTML;
  }

  function updateRecentInteractions() {
    const interactionsElement = document.getElementById('recentInteractions');
    if (!interactionsElement || !window.RayTrustCore) return;

    const analytics = window.RayTrustCore.getAnalytics();
    if (!analytics.totalInteractions) {
      interactionsElement.innerHTML = '<span style="color: #666;">No interactions recorded</span>';
      return;
    }

    // Get recent interactions from activity monitor if available
    let recentActivities = [];
    if (window.RayActivityMonitor) {
      recentActivities = window.RayActivityMonitor.getLog()
        .filter(activity => activity.action.includes('TRUST') || 
                          window.RayTrustCore.getActionTypes().includes(activity.action))
        .slice(0, 10);
    }

    if (recentActivities.length === 0) {
      interactionsElement.innerHTML = '<span style="color: #666;">No recent trust interactions</span>';
      return;
    }

    const interactionsHTML = recentActivities
      .map(activity => {
        const actionInfo = window.RayTrustCore.getActionInfo(activity.action);
        const weight = actionInfo ? actionInfo.weight : 0;
        const color = weight > 0 ? '#4CAF50' : weight < 0 ? '#f44336' : '#aaa';
        
        return `
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 9px;">
            <span>${activity.action}</span>
            <span style="color: ${color};">${weight > 0 ? '+' : ''}${weight}</span>
            <span style="color: #666;">${activity.time}</span>
          </div>
        `;
      })
      .join('');

    interactionsElement.innerHTML = interactionsHTML;
  }

  function updateTrustButton(trustLevel) {
    if (!trustButton) return;

    const color = getTrustColor(trustLevel);
    trustButton.style.borderColor = color;
    
    // Update button title with current trust level
    const trustInfo = window.RayTrustCore?.getLevel();
    if (trustInfo) {
      trustButton.title = `Ray Trust: ${trustLevel}% (${trustInfo.description.name})`;
    }
  }

  function getTrustColor(level) {
    if (level >= 80) return '#00ff00';      // High trust - green
    if (level >= 60) return '#88ff00';      // Good trust - light green
    if (level >= 40) return '#ffdd00';      // Moderate trust - yellow
    if (level >= 20) return '#ff6600';      // Low trust - orange
    return '#ff0000';                       // Very low trust - red
  }

  function exportTrustData() {
    if (!window.RayTrustCore) {
      alert('Trust system not available');
      return;
    }

    const analytics = window.RayTrustCore.getAnalytics();
    const exportData = {
      exportTime: new Date().toISOString(),
      trustLevel: analytics.currentLevel,
      confidence: analytics.confidence,
      totalInteractions: analytics.totalInteractions,
      categories: analytics.categories,
      trends: analytics.trends,
      milestones: analytics.milestones,
      metadata: {
        version: '1.0',
        system: 'Ray Trust Metrics'
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ray-trust-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    console.log('📤 Trust data exported');
  }

  function testTrustSystem() {
    if (!window.RayTrustCore) {
      alert('Trust system not available');
      return;
    }

    console.log('🧪 Testing trust system...');
    
    // Test positive actions
    window.RayTrustCore.recordAction('HELPFUL_RESPONSE', { test: 'UI test positive' });
    setTimeout(() => {
      window.RayTrustCore.recordAction('PROBLEM_SOLVED', { test: 'UI test very positive' });
    }, 500);
    
    // Test negative action
    setTimeout(() => {
      window.RayTrustCore.recordAction('UNHELPFUL_RESPONSE', { test: 'UI test negative' });
    }, 1000);
    
    console.log('✅ Trust system test completed');
  }

  function initializeTrustUI() {
    console.log('🤝 Initializing Trust UI...');
    
    // Create UI components
    createTrustUI();
    
    // Initial button update
    if (window.RayTrustCore) {
      const trustLevel = window.RayTrustCore.getLevel();
      updateTrustButton(trustLevel.level);
    }
    
    console.log('✅ Trust UI ready');
  }

  // Expose Trust UI API
  window.RayTrustUI = {
    init: initializeTrustUI,
    show: showTrustUI,
    hide: hideTrustUI,
    toggle: toggleTrustUI,
    refresh: updateTrustDisplay,
    export: exportTrustData,
    test: testTrustSystem
  };

  console.log('✅ RayTrustUI loaded');
})();