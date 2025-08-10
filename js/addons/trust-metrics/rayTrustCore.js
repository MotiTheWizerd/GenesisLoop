(function() {
  'use strict';

  // Trust Metrics Core Engine
  let trustData = {
    currentLevel: 50,        // Base trust level (0-100)
    interactions: [],        // Interaction history
    patterns: {},            // Behavioral patterns
    milestones: [],          // Trust milestones
    lastUpdate: null,        // Last trust calculation
    initialized: false       // Initialization state
  };

  let trustConfig = {
    maxInteractions: 1000,   // Maximum stored interactions
    decayRate: 0.1,          // Trust decay over time (per day)
    learningRate: 0.05,      // How quickly trust adapts
    confidenceThreshold: 10, // Minimum interactions for confidence
    updateInterval: 60000,   // Update frequency (1 minute)
    persistenceKey: 'rayTrustData'
  };

  // Utility functions
  function getCurrentUnixTime() {
    return Math.floor(Date.now() / 1000);
  }

  // Trust Action Categories and Weights
  const trustActions = {
    // Positive trust actions
    HELPFUL_RESPONSE: { weight: 2, category: 'helpful' },
    PROBLEM_SOLVED: { weight: 5, category: 'helpful' },
    RESPECTFUL_INTERACTION: { weight: 1, category: 'respectful' },
    PRIVACY_RESPECTED: { weight: 3, category: 'respectful' },
    PROMISE_KEPT: { weight: 4, category: 'reliable' },
    ACCURATE_INFORMATION: { weight: 2, category: 'reliable' },
    EMOTIONAL_SUPPORT: { weight: 3, category: 'caring' },
    UNDERSTANDING_SHOWN: { weight: 2, category: 'caring' },
    
    // Negative trust actions
    UNHELPFUL_RESPONSE: { weight: -2, category: 'unhelpful' },
    PROBLEM_CREATED: { weight: -5, category: 'unhelpful' },
    DISRESPECTFUL_BEHAVIOR: { weight: -4, category: 'disrespectful' },
    PRIVACY_VIOLATED: { weight: -6, category: 'disrespectful' },
    PROMISE_BROKEN: { weight: -5, category: 'unreliable' },
    INACCURATE_INFORMATION: { weight: -3, category: 'unreliable' },
    EMOTIONAL_HARM: { weight: -4, category: 'harmful' },
    MISUNDERSTANDING: { weight: -1, category: 'harmful' },
    
    // Neutral/system actions
    SYSTEM_INTERACTION: { weight: 0, category: 'system' },
    ROUTINE_OPERATION: { weight: 0, category: 'system' },
    MAINTENANCE_ACTION: { weight: 0, category: 'system' }
  };

  // Trust Level Descriptions
  const trustLevels = {
    0: { name: 'No Trust', description: 'Complete distrust', color: '#ff0000' },
    20: { name: 'Low Trust', description: 'Significant skepticism', color: '#ff6600' },
    40: { name: 'Cautious Trust', description: 'Careful optimism', color: '#ffaa00' },
    60: { name: 'Moderate Trust', description: 'Growing confidence', color: '#ffdd00' },
    80: { name: 'High Trust', description: 'Strong confidence', color: '#88ff00' },
    100: { name: 'Complete Trust', description: 'Absolute faith', color: '#00ff00' }
  };

  function initializeTrustSystem() {
    console.log('🤝 Initializing Ray Trust Metrics System...');
    
    // Load existing trust data
    loadTrustData();
    
    // Start trust update cycle
    startTrustUpdateCycle();
    
    // Mark as initialized
    trustData.initialized = true;
    
    console.log('✅ Trust system initialized - Current level:', trustData.currentLevel);
    logTrustEvent('SYSTEM_INIT', { level: trustData.currentLevel });
  }

  function recordTrustAction(actionType, context = {}) {
    if (!trustData.initialized) {
      console.warn('⚠️ Trust system not initialized');
      return;
    }

    const action = trustActions[actionType];
    if (!action) {
      console.warn('⚠️ Unknown trust action:', actionType);
      return;
    }

    const interaction = {
      id: Date.now() + Math.random(),
      timestamp: getCurrentUnixTime(),
      action: actionType,
      weight: action.weight,
      category: action.category,
      context: context,
      trustBefore: trustData.currentLevel,
      trustAfter: null // Will be calculated
    };

    // Add to interactions
    trustData.interactions.unshift(interaction);
    
    // Limit interaction history
    if (trustData.interactions.length > trustConfig.maxInteractions) {
      trustData.interactions = trustData.interactions.slice(0, trustConfig.maxInteractions);
    }

    // Recalculate trust level
    const newTrustLevel = calculateTrustLevel();
    interaction.trustAfter = newTrustLevel;
    
    // Update current level
    const oldLevel = trustData.currentLevel;
    trustData.currentLevel = newTrustLevel;
    trustData.lastUpdate = getCurrentUnixTime();

    // Check for milestones
    checkTrustMilestones(oldLevel, newTrustLevel);

    // Save data
    saveTrustData();

    // Log the trust action
    console.log(`🤝 Trust action: ${actionType} (${action.weight > 0 ? '+' : ''}${action.weight}) - Level: ${oldLevel} → ${newTrustLevel}`);
    
    // Broadcast trust change event
    broadcastTrustChange(oldLevel, newTrustLevel, actionType);

    return newTrustLevel;
  }

  function calculateTrustLevel() {
    if (trustData.interactions.length === 0) {
      return 50; // Neutral starting point
    }

    const now = getCurrentUnixTime();
    let totalWeight = 0;
    let weightedSum = 0;
    let recentWeight = 0;

    // Calculate weighted trust based on interactions
    trustData.interactions.forEach(interaction => {
      const age = (now - interaction.timestamp) / 86400; // Age in days
      const decayFactor = Math.exp(-age * trustConfig.decayRate);
      const adjustedWeight = interaction.weight * decayFactor;
      
      totalWeight += Math.abs(adjustedWeight);
      weightedSum += adjustedWeight;
      
      // Give more weight to recent interactions
      if (age < 1) {
        recentWeight += adjustedWeight * 2;
      }
    });

    // Base calculation
    let trustScore = 50; // Neutral baseline
    
    if (totalWeight > 0) {
      const averageWeight = weightedSum / totalWeight;
      trustScore += averageWeight * 50; // Scale to 0-100 range
    }

    // Apply recent interaction bias
    if (recentWeight !== 0) {
      trustScore += (recentWeight / Math.max(trustData.interactions.length, 1)) * 10;
    }

    // Apply learning rate for gradual changes
    const currentLevel = trustData.currentLevel;
    const adjustedScore = currentLevel + (trustScore - currentLevel) * trustConfig.learningRate;

    // Ensure bounds
    return Math.max(0, Math.min(100, Math.round(adjustedScore)));
  }

  function getTrustLevel() {
    return {
      level: trustData.currentLevel,
      description: getTrustDescription(trustData.currentLevel),
      confidence: calculateConfidence(),
      lastUpdate: trustData.lastUpdate,
      interactionCount: trustData.interactions.length
    };
  }

  function getTrustDescription(level) {
    const ranges = Object.keys(trustLevels).map(Number).sort((a, b) => b - a);
    
    for (const threshold of ranges) {
      if (level >= threshold) {
        return trustLevels[threshold];
      }
    }
    
    return trustLevels[0];
  }

  function calculateConfidence() {
    const interactionCount = trustData.interactions.length;
    if (interactionCount < trustConfig.confidenceThreshold) {
      return Math.round((interactionCount / trustConfig.confidenceThreshold) * 100);
    }
    return 100;
  }

  function checkTrustMilestones(oldLevel, newLevel) {
    const milestones = [10, 25, 50, 75, 90];
    
    milestones.forEach(milestone => {
      if (oldLevel < milestone && newLevel >= milestone) {
        const milestoneEvent = {
          timestamp: getCurrentUnixTime(),
          milestone: milestone,
          direction: 'up',
          description: `Trust reached ${milestone}%`
        };
        
        trustData.milestones.unshift(milestoneEvent);
        logTrustEvent('TRUST_MILESTONE', milestoneEvent);
        
        console.log(`🎯 Trust milestone reached: ${milestone}%`);
      } else if (oldLevel >= milestone && newLevel < milestone) {
        const milestoneEvent = {
          timestamp: getCurrentUnixTime(),
          milestone: milestone,
          direction: 'down',
          description: `Trust fell below ${milestone}%`
        };
        
        trustData.milestones.unshift(milestoneEvent);
        logTrustEvent('TRUST_MILESTONE', milestoneEvent);
        
        console.log(`📉 Trust milestone lost: ${milestone}%`);
      }
    });
  }

  function getTrustAnalytics() {
    const recentInteractions = trustData.interactions.slice(0, 50);
    const categories = {};
    const trends = [];

    // Analyze categories
    recentInteractions.forEach(interaction => {
      if (!categories[interaction.category]) {
        categories[interaction.category] = { count: 0, totalWeight: 0 };
      }
      categories[interaction.category].count++;
      categories[interaction.category].totalWeight += interaction.weight;
    });

    // Calculate trends (last 10 interactions)
    const recentTrend = trustData.interactions.slice(0, 10);
    if (recentTrend.length >= 2) {
      const firstLevel = recentTrend[recentTrend.length - 1].trustBefore;
      const lastLevel = recentTrend[0].trustAfter;
      trends.push({
        period: 'recent',
        change: lastLevel - firstLevel,
        direction: lastLevel > firstLevel ? 'up' : lastLevel < firstLevel ? 'down' : 'stable'
      });
    }

    return {
      currentLevel: trustData.currentLevel,
      confidence: calculateConfidence(),
      totalInteractions: trustData.interactions.length,
      categories: categories,
      trends: trends,
      milestones: trustData.milestones.slice(0, 5),
      lastUpdate: trustData.lastUpdate
    };
  }

  function startTrustUpdateCycle() {
    setInterval(() => {
      // Apply natural trust decay over time
      const now = getCurrentUnixTime();
      const timeSinceUpdate = (now - (trustData.lastUpdate || now)) / 86400; // Days
      
      if (timeSinceUpdate > 1) {
        const decayAmount = timeSinceUpdate * trustConfig.decayRate;
        const newLevel = Math.max(0, trustData.currentLevel - decayAmount);
        
        if (newLevel !== trustData.currentLevel) {
          const oldLevel = trustData.currentLevel;
          trustData.currentLevel = Math.round(newLevel);
          trustData.lastUpdate = now;
          
          console.log(`⏰ Trust decay applied: ${oldLevel} → ${trustData.currentLevel}`);
          broadcastTrustChange(oldLevel, trustData.currentLevel, 'TIME_DECAY');
        }
      }
      
      saveTrustData();
    }, trustConfig.updateInterval);
  }

  function broadcastTrustChange(oldLevel, newLevel, actionType) {
    const event = new CustomEvent('rayTrustChange', {
      detail: {
        oldLevel: oldLevel,
        newLevel: newLevel,
        change: newLevel - oldLevel,
        actionType: actionType,
        timestamp: getCurrentUnixTime(),
        description: getTrustDescription(newLevel)
      }
    });
    
    document.dispatchEvent(event);
  }

  function logTrustEvent(eventType, details) {
    if (window.RayActivityMonitor) {
      window.RayActivityMonitor.log(eventType, details);
    }
  }

  function saveTrustData() {
    try {
      const dataToSave = {
        currentLevel: trustData.currentLevel,
        interactions: trustData.interactions.slice(0, 100), // Save last 100
        milestones: trustData.milestones.slice(0, 20),      // Save last 20
        lastUpdate: trustData.lastUpdate
      };
      
      localStorage.setItem(trustConfig.persistenceKey, JSON.stringify(dataToSave));
    } catch (error) {
      console.warn('⚠️ Failed to save trust data:', error);
    }
  }

  function loadTrustData() {
    try {
      const saved = localStorage.getItem(trustConfig.persistenceKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        trustData.currentLevel = parsed.currentLevel || 50;
        trustData.interactions = parsed.interactions || [];
        trustData.milestones = parsed.milestones || [];
        trustData.lastUpdate = parsed.lastUpdate || getCurrentUnixTime();
        
        console.log('✅ Trust data loaded - Level:', trustData.currentLevel);
      }
    } catch (error) {
      console.warn('⚠️ Failed to load trust data:', error);
      trustData.currentLevel = 50; // Reset to neutral
    }
  }

  function resetTrustData() {
    trustData = {
      currentLevel: 50,
      interactions: [],
      patterns: {},
      milestones: [],
      lastUpdate: getCurrentUnixTime(),
      initialized: true
    };
    
    saveTrustData();
    console.log('🔄 Trust data reset to neutral state');
    return trustData.currentLevel;
  }

  // Expose Trust Core API
  window.RayTrustCore = {
    init: initializeTrustSystem,
    recordAction: recordTrustAction,
    getLevel: getTrustLevel,
    getAnalytics: getTrustAnalytics,
    reset: resetTrustData,
    
    // Read-only access to trust actions for reference
    getActionTypes: () => Object.keys(trustActions),
    getActionInfo: (actionType) => trustActions[actionType],
    
    // Configuration access
    getConfig: () => ({ ...trustConfig }),
    updateConfig: (newConfig) => {
      trustConfig = { ...trustConfig, ...newConfig };
      saveTrustData();
    }
  };

  console.log('✅ RayTrustCore loaded');
})();