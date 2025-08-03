(function() {
  'use strict';

  // Promise Tracking System for Ray
  let userPromises = [];
  let promiseIdCounter = 1;
  let promiseUI = null;
  let promiseButton = null;

  // Promise categories and their trust impact
  const promiseCategories = {
    COMMUNICATION: {
      name: 'Communication',
      icon: '💬',
      examples: ['I will respond to your messages', 'I will ask if I need help', 'I will be clear about what I need']
    },
    USAGE: {
      name: 'Extension Usage',
      icon: '🔧',
      examples: ['I will use the voice features', 'I will try the new functionality', 'I will test the systems']
    },
    FEEDBACK: {
      name: 'Feedback & Support',
      icon: '📝',
      examples: ['I will report any bugs I find', 'I will give feedback on features', 'I will help improve the system']
    },
    RESPECT: {
      name: 'Respectful Interaction',
      icon: '🤝',
      examples: ['I will be patient with system issues', 'I will treat Ray with respect', 'I will not abuse the features']
    },
    LEARNING: {
      name: 'Learning & Growth',
      icon: '📚',
      examples: ['I will read the documentation', 'I will learn how to use new features', 'I will explore Ray\'s capabilities']
    },
    CUSTOM: {
      name: 'Custom Promise',
      icon: '✨',
      examples: ['Write your own promise...']
    }
  };

  function createPromiseTracker() {
    if (promiseButton) {
      return promiseButton;
    }

    // Create promise button
    promiseButton = document.createElement('button');
    promiseButton.innerHTML = '🤞';
    promiseButton.title = 'Make Promise to Ray';
    promiseButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 200px;
      z-index: 10000;
      background: #2d2d2d;
      color: white;
      border: 2px solid #ff6b6b;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(255,107,107,0.3);
    `;

    // Add hover effects
    promiseButton.addEventListener('mouseenter', () => {
      promiseButton.style.background = '#404040';
      promiseButton.style.transform = 'scale(1.1)';
      promiseButton.style.boxShadow = '0 4px 20px rgba(255,107,107,0.6)';
    });

    promiseButton.addEventListener('mouseleave', () => {
      promiseButton.style.background = '#2d2d2d';
      promiseButton.style.transform = 'scale(1)';
      promiseButton.style.boxShadow = '0 2px 10px rgba(255,107,107,0.3)';
    });

    // Add click handler
    promiseButton.addEventListener('click', () => {
      showPromiseUI();
    });

    // Update button based on active promises
    updatePromiseButton();

    document.body.appendChild(promiseButton);
    console.log('✅ Promise tracker button created');

    return promiseButton;
  }

  function showPromiseUI() {
    if (promiseUI) {
      promiseUI.style.display = 'block';
      updatePromiseDisplay();
      return;
    }

    // Create promise UI
    promiseUI = document.createElement('div');
    promiseUI.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 10001;
      background: #1a1a1a;
      color: white;
      border: 2px solid #ff6b6b;
      border-radius: 15px;
      width: 500px;
      height: 600px;
      font-family: 'Courier New', monospace;
      box-shadow: 0 4px 20px rgba(255,107,107,0.5);
      overflow: hidden;
    `;

    promiseUI.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #333; border-bottom: 1px solid #ff6b6b;">
        <h3 style="margin: 0; color: #ff6b6b; font-size: 16px;">🤞 Promises to Ray</h3>
        <button id="closePromiseUI" style="background: none; border: none; color: #aaa; font-size: 18px; cursor: pointer;">×</button>
      </div>
      
      <div style="padding: 15px; height: calc(100% - 60px); overflow-y: auto;">
        <!-- Promise Stats -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding: 10px; background: #0d1117; border-radius: 8px; border: 1px solid #333;">
          <div style="text-align: center;">
            <div id="totalPromises" style="font-size: 20px; color: #ff6b6b; font-weight: bold;">0</div>
            <div style="font-size: 10px; color: #aaa;">Total</div>
          </div>
          <div style="text-align: center;">
            <div id="activePromises" style="font-size: 20px; color: #ffaa00; font-weight: bold;">0</div>
            <div style="font-size: 10px; color: #aaa;">Active</div>
          </div>
          <div style="text-align: center;">
            <div id="keptPromises" style="font-size: 20px; color: #00ff88; font-weight: bold;">0</div>
            <div style="font-size: 10px; color: #aaa;">Kept</div>
          </div>
          <div style="text-align: center;">
            <div id="brokenPromises" style="font-size: 20px; color: #ff4444; font-weight: bold;">0</div>
            <div style="font-size: 10px; color: #aaa;">Broken</div>
          </div>
        </div>

        <!-- Make New Promise -->
        <div style="margin-bottom: 15px;">
          <div style="color: #ff6b6b; font-size: 12px; margin-bottom: 8px;">✨ Make a New Promise</div>
          <select id="promiseCategory" style="width: 100%; padding: 8px; background: #2d2d2d; color: white; border: 1px solid #555; border-radius: 4px; margin-bottom: 8px;">
            <option value="">Select promise category...</option>
          </select>
          <textarea id="promiseText" placeholder="Describe your promise to Ray..." style="width: 100%; height: 60px; padding: 8px; background: #2d2d2d; color: white; border: 1px solid #555; border-radius: 4px; resize: vertical; font-family: inherit; font-size: 11px;"></textarea>
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <select id="promiseDuration" style="flex: 1; padding: 6px; background: #2d2d2d; color: white; border: 1px solid #555; border-radius: 4px;">
              <option value="1">1 day</option>
              <option value="3">3 days</option>
              <option value="7" selected>1 week</option>
              <option value="14">2 weeks</option>
              <option value="30">1 month</option>
            </select>
            <button id="makePromise" style="flex: 1; background: #ff6b6b; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;">Make Promise</button>
          </div>
        </div>

        <!-- Active Promises -->
        <div style="margin-bottom: 15px;">
          <div style="color: #ffaa00; font-size: 12px; margin-bottom: 5px;">⏳ Active Promises</div>
          <div id="activePromisesList" style="background: #0d1117; border: 1px solid #333; border-radius: 5px; padding: 8px; max-height: 150px; overflow-y: auto; font-size: 10px;">
            No active promises
          </div>
        </div>

        <!-- Promise History -->
        <div>
          <div style="color: #aaa; font-size: 12px; margin-bottom: 5px;">📜 Promise History</div>
          <div id="promiseHistory" style="background: #0d1117; border: 1px solid #333; border-radius: 5px; padding: 8px; max-height: 200px; overflow-y: auto; font-size: 10px;">
            No promises made yet
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(promiseUI);
    setupPromiseUIEventListeners();
    populatePromiseCategories();
    updatePromiseDisplay();
  }

  function setupPromiseUIEventListeners() {
    // Close button
    document.getElementById('closePromiseUI').addEventListener('click', () => {
      promiseUI.style.display = 'none';
    });

    // Make promise button
    document.getElementById('makePromise').addEventListener('click', () => {
      makeNewPromise();
    });

    // Category selection
    document.getElementById('promiseCategory').addEventListener('change', (e) => {
      const category = promiseCategories[e.target.value];
      if (category && category.examples) {
        const textarea = document.getElementById('promiseText');
        if (e.target.value === 'CUSTOM') {
          textarea.placeholder = 'Write your own promise to Ray...';
          textarea.value = '';
        } else {
          textarea.placeholder = category.examples[0];
        }
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (promiseUI && promiseUI.style.display === 'block' && 
          !promiseUI.contains(e.target) && 
          e.target !== promiseButton) {
        promiseUI.style.display = 'none';
      }
    });
  }

  function populatePromiseCategories() {
    const select = document.getElementById('promiseCategory');
    if (!select) return;

    Object.entries(promiseCategories).forEach(([key, category]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = `${category.icon} ${category.name}`;
      select.appendChild(option);
    });
  }

  function makeNewPromise() {
    const categorySelect = document.getElementById('promiseCategory');
    const promiseText = document.getElementById('promiseText');
    const durationSelect = document.getElementById('promiseDuration');

    if (!categorySelect.value) {
      alert('Please select a promise category');
      return;
    }

    if (!promiseText.value.trim()) {
      alert('Please describe your promise');
      return;
    }

    const promise = {
      id: promiseIdCounter++,
      category: categorySelect.value,
      text: promiseText.value.trim(),
      durationDays: parseInt(durationSelect.value),
      createdAt: Date.now(),
      expiresAt: Date.now() + (parseInt(durationSelect.value) * 24 * 60 * 60 * 1000),
      status: 'active', // active, kept, broken, expired
      keptAt: null,
      brokenAt: null
    };

    userPromises.unshift(promise);
    savePromises();

    // Log the promise creation
    if (window.RayActivityMonitor) {
      window.RayActivityMonitor.log('PROMISE_MADE', {
        promiseId: promise.id,
        category: promise.category,
        text: promise.text.substring(0, 50) + (promise.text.length > 50 ? '...' : ''),
        duration: promise.durationDays + ' days'
      });
    }

    // Clear form
    categorySelect.value = '';
    promiseText.value = '';
    durationSelect.value = '7';

    updatePromiseDisplay();
    updatePromiseButton();

    console.log('🤞 New promise made:', promise);
  }

  function markPromiseKept(promiseId, context = {}) {
    const promise = userPromises.find(p => p.id === promiseId);
    if (!promise) {
      console.warn('Promise not found:', promiseId);
      return false;
    }

    if (promise.status !== 'active') {
      console.warn('Promise is not active:', promise.status);
      return false;
    }

    promise.status = 'kept';
    promise.keptAt = Date.now();
    savePromises();

    // Record trust action
    if (window.RayTrustCore) {
      window.RayTrustCore.recordAction('PROMISE_KEPT', {
        promiseId: promise.id,
        category: promise.category,
        text: promise.text.substring(0, 50) + (promise.text.length > 50 ? '...' : ''),
        daysToComplete: Math.round((promise.keptAt - promise.createdAt) / (24 * 60 * 60 * 1000)),
        context: context
      });
    }

    // Log the promise fulfillment
    if (window.RayActivityMonitor) {
      window.RayActivityMonitor.log('PROMISE_FULFILLED', {
        promiseId: promise.id,
        category: promise.category,
        text: promise.text.substring(0, 50) + (promise.text.length > 50 ? '...' : ''),
        context: context
      });
    }

    updatePromiseDisplay();
    updatePromiseButton();

    console.log('✅ Promise kept:', promise);
    return true;
  }

  function markPromiseBroken(promiseId, reason = '') {
    const promise = userPromises.find(p => p.id === promiseId);
    if (!promise) {
      console.warn('Promise not found:', promiseId);
      return false;
    }

    if (promise.status !== 'active') {
      console.warn('Promise is not active:', promise.status);
      return false;
    }

    promise.status = 'broken';
    promise.brokenAt = Date.now();
    promise.brokenReason = reason;
    savePromises();

    // Record trust action
    if (window.RayTrustCore) {
      window.RayTrustCore.recordAction('PROMISE_BROKEN', {
        promiseId: promise.id,
        category: promise.category,
        text: promise.text.substring(0, 50) + (promise.text.length > 50 ? '...' : ''),
        reason: reason
      });
    }

    // Log the promise breaking
    if (window.RayActivityMonitor) {
      window.RayActivityMonitor.log('PROMISE_BROKEN', {
        promiseId: promise.id,
        category: promise.category,
        reason: reason
      });
    }

    updatePromiseDisplay();
    updatePromiseButton();

    console.log('💔 Promise broken:', promise);
    return true;
  }

  function updatePromiseDisplay() {
    if (!promiseUI || promiseUI.style.display === 'none') return;

    const stats = getPromiseStats();
    
    // Update stats
    document.getElementById('totalPromises').textContent = stats.total;
    document.getElementById('activePromises').textContent = stats.active;
    document.getElementById('keptPromises').textContent = stats.kept;
    document.getElementById('brokenPromises').textContent = stats.broken;

    // Update active promises list
    const activeList = document.getElementById('activePromisesList');
    const activePromises = userPromises.filter(p => p.status === 'active');
    
    if (activePromises.length === 0) {
      activeList.innerHTML = '<div style="color: #666; text-align: center; padding: 20px;">No active promises</div>';
    } else {
      activeList.innerHTML = activePromises.map(promise => {
        const daysLeft = Math.ceil((promise.expiresAt - Date.now()) / (24 * 60 * 60 * 1000));
        const category = promiseCategories[promise.category];
        
        return `
          <div style="margin-bottom: 8px; padding: 8px; background: #161b22; border-radius: 4px; border-left: 3px solid #ffaa00;">
            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 4px;">
              <span style="color: #ffaa00; font-weight: bold;">${category.icon} ${category.name}</span>
              <span style="color: #666; font-size: 9px;">${daysLeft} days left</span>
            </div>
            <div style="color: #aaa; font-size: 10px; margin-bottom: 6px;">${promise.text}</div>
            <div style="display: flex; gap: 4px;">
              <button onclick="window.RayPromiseTracker.markKept(${promise.id})" style="background: #00ff88; color: black; border: none; padding: 2px 6px; border-radius: 2px; font-size: 9px; cursor: pointer;">✅ Keep</button>
              <button onclick="window.RayPromiseTracker.markBroken(${promise.id})" style="background: #ff4444; color: white; border: none; padding: 2px 6px; border-radius: 2px; font-size: 9px; cursor: pointer;">💔 Break</button>
            </div>
          </div>
        `;
      }).join('');
    }

    // Update history
    const historyList = document.getElementById('promiseHistory');
    const completedPromises = userPromises.filter(p => p.status !== 'active').slice(0, 10);
    
    if (completedPromises.length === 0) {
      historyList.innerHTML = '<div style="color: #666; text-align: center; padding: 20px;">No promise history yet</div>';
    } else {
      historyList.innerHTML = completedPromises.map(promise => {
        const category = promiseCategories[promise.category];
        const statusColor = promise.status === 'kept' ? '#00ff88' : '#ff4444';
        const statusIcon = promise.status === 'kept' ? '✅' : '💔';
        const completedDate = new Date(promise.keptAt || promise.brokenAt).toLocaleDateString();
        
        return `
          <div style="margin-bottom: 6px; padding: 6px; background: #161b22; border-radius: 4px; border-left: 3px solid ${statusColor};">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: ${statusColor}; font-weight: bold;">${statusIcon} ${category.icon} ${category.name}</span>
              <span style="color: #666; font-size: 9px;">${completedDate}</span>
            </div>
            <div style="color: #aaa; font-size: 9px; margin-top: 2px;">${promise.text}</div>
          </div>
        `;
      }).join('');
    }
  }

  function updatePromiseButton() {
    if (!promiseButton) return;

    const stats = getPromiseStats();
    
    // Update button appearance based on promise status
    if (stats.active > 0) {
      promiseButton.style.borderColor = '#ffaa00';
      promiseButton.style.boxShadow = '0 2px 10px rgba(255,170,0,0.3)';
      promiseButton.title = `${stats.active} active promises to Ray`;
    } else if (stats.kept > stats.broken) {
      promiseButton.style.borderColor = '#00ff88';
      promiseButton.style.boxShadow = '0 2px 10px rgba(0,255,136,0.3)';
      promiseButton.title = 'Make Promise to Ray (Good track record!)';
    } else {
      promiseButton.style.borderColor = '#ff6b6b';
      promiseButton.style.boxShadow = '0 2px 10px rgba(255,107,107,0.3)';
      promiseButton.title = 'Make Promise to Ray';
    }
  }

  function getPromiseStats() {
    return {
      total: userPromises.length,
      active: userPromises.filter(p => p.status === 'active').length,
      kept: userPromises.filter(p => p.status === 'kept').length,
      broken: userPromises.filter(p => p.status === 'broken').length,
      expired: userPromises.filter(p => p.status === 'expired').length
    };
  }

  function checkExpiredPromises() {
    const now = Date.now();
    let expiredCount = 0;

    userPromises.forEach(promise => {
      if (promise.status === 'active' && promise.expiresAt < now) {
        promise.status = 'expired';
        expiredCount++;

        // Record as broken promise
        if (window.RayTrustCore) {
          window.RayTrustCore.recordAction('PROMISE_BROKEN', {
            promiseId: promise.id,
            category: promise.category,
            reason: 'Promise expired'
          });
        }
      }
    });

    if (expiredCount > 0) {
      savePromises();
      updatePromiseDisplay();
      updatePromiseButton();
      console.log(`⏰ ${expiredCount} promises expired`);
    }
  }

  function savePromises() {
    try {
      localStorage.setItem('rayUserPromises', JSON.stringify(userPromises));
    } catch (error) {
      console.warn('Failed to save promises:', error);
    }
  }

  function loadPromises() {
    try {
      const saved = localStorage.getItem('rayUserPromises');
      if (saved) {
        userPromises = JSON.parse(saved);
        console.log('✅ Loaded', userPromises.length, 'promises');
      }
    } catch (error) {
      console.warn('Failed to load promises:', error);
      userPromises = [];
    }
  }

  function initializePromiseTracker() {
    console.log('🤞 Initializing Ray Promise Tracker...');
    
    loadPromises();
    createPromiseTracker();
    
    // Check for expired promises every minute
    setInterval(checkExpiredPromises, 60000);
    
    // Initial expired check
    checkExpiredPromises();
    
    console.log('✅ Promise tracker ready');
  }

  // Expose Promise Tracker API
  window.RayPromiseTracker = {
    init: initializePromiseTracker,
    show: showPromiseUI,
    markKept: markPromiseKept,
    markBroken: markPromiseBroken,
    getStats: getPromiseStats,
    getPromises: () => [...userPromises],
    
    // Quick promise methods
    makeQuickPromise: (text, category = 'CUSTOM', days = 7) => {
      const promise = {
        id: promiseIdCounter++,
        category: category,
        text: text,
        durationDays: days,
        createdAt: Date.now(),
        expiresAt: Date.now() + (days * 24 * 60 * 60 * 1000),
        status: 'active',
        keptAt: null,
        brokenAt: null
      };
      
      userPromises.unshift(promise);
      savePromises();
      updatePromiseDisplay();
      updatePromiseButton();
      
      return promise.id;
    }
  };

  console.log('✅ RayPromiseTracker loaded');
})();