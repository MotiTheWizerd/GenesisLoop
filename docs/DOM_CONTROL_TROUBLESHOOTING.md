# DOM Control System - Troubleshooting Guide

## 🚨 Common Issues and Solutions

### Issue 1: `window.DOMAPI` is undefined

**Error Message:**
```
TypeError: Cannot read properties of undefined (reading 'getElement')
```

**Cause:** The DOM Control System modules haven't loaded properly.

**Solutions:**

#### Step 1: Check Extension Loading
1. Go to `chrome://extensions/`
2. Find "Genesis Loop" extension
3. Click the refresh/reload button
4. Go back to ChatGPT page and refresh

#### Step 2: Verify Console Messages
Open browser console (F12) on ChatGPT page and look for:
```
✅ DOMHelpers loaded
✅ DOMRetriever loaded  
✅ DOMController loaded
✅ DOMAPI loaded
✅ DOMControlSystem loaded
🧱 Initializing DOM Control System...
✅ DOM Control System initialized successfully
```

If you don't see these messages, the scripts aren't loading.

#### Step 3: Check Script Loading Order
Run this in console to verify modules are loaded:
```javascript
console.log('DOMHelpers:', typeof window.DOMHelpers);
console.log('DOMRetriever:', typeof window.DOMRetriever);
console.log('DOMController:', typeof window.DOMController);
console.log('DOMAPI:', typeof window.DOMAPI);
console.log('DOMControlSystem:', typeof window.DOMControlSystem);
```

Expected output:
```
DOMHelpers: object
DOMRetriever: object
DOMController: object
DOMAPI: object
DOMControlSystem: object
```

### Issue 2: Scripts Loading But Not Initializing

**Symptoms:** Modules exist but `window.DOMAPI` methods don't work.

**Solution:** Manually initialize the system:
```javascript
// Force initialization
if (window.DOMControlSystem) {
  window.DOMControlSystem.initialize();
}

// Wait a moment then test
setTimeout(() => {
  console.log('DOMAPI ready:', typeof window.DOMAPI);
}, 1000);
```

### Issue 3: Permission Issues

**Error:** Extension can't access page content.

**Solution:** Verify manifest.json permissions:
```json
"permissions": [
  "storage",
  "activeTab", 
  "scripting"
]
```

## 🔧 Quick Fixes

### Fix 1: Manual Module Check
```javascript
// Check if all modules are loaded
function checkDOMControlModules() {
  const modules = ['DOMHelpers', 'DOMRetriever', 'DOMController', 'DOMAPI', 'DOMControlSystem'];
  const status = {};
  
  modules.forEach(module => {
    status[module] = typeof window[module];
  });
  
  console.log('Module Status:', status);
  return status;
}

checkDOMControlModules();
```

### Fix 2: Force Reload and Initialize
```javascript
// Force reload extension and reinitialize
function forceReloadDOMControl() {
  console.log('🔄 Force reloading DOM Control...');
  
  // Wait for modules to load
  const checkInterval = setInterval(() => {
    if (window.DOMControlSystem) {
      clearInterval(checkInterval);
      window.DOMControlSystem.initialize();
      console.log('✅ DOM Control force initialized');
    }
  }, 100);
  
  // Timeout after 5 seconds
  setTimeout(() => {
    clearInterval(checkInterval);
    console.log('❌ DOM Control initialization timeout');
  }, 5000);
}

forceReloadDOMControl();
```

### Fix 3: Alternative Direct Access
If DOMAPI isn't working, use the underlying modules directly:
```javascript
// Direct access to DOMRetriever
if (window.DOMRetriever) {
  const dom = window.DOMRetriever.getDOM({ 
    selector: '[data-message-author-role="assistant"]:last-child',
    format: 'text' 
  });
  console.log('Direct retrieval:', dom);
}

// Direct access to DOMController
if (window.DOMController) {
  window.DOMController.setText('#my-element', 'New text');
}
```

## 🛠️ Step-by-Step Debugging

### Step 1: Basic Extension Check
```javascript
// Check if we're on the right page
console.log('Current URL:', window.location.href);
console.log('Should match ChatGPT:', window.location.href.includes('chatgpt.com') || window.location.href.includes('chat.openai.com'));
```

### Step 2: Check Content Script Loading
```javascript
// Check if main extension components are loaded
console.log('Main extension loaded:', {
  Constants: typeof window.Constants,
  ResponseTracker: typeof window.ResponseTracker,
  DependencyLoader: typeof window.DependencyLoader,
  ToggleButton: typeof window.ToggleButton
});
```

### Step 3: Manual DOM Control Test
```javascript
// Test DOM Control step by step
async function testDOMControlManually() {
  console.log('🧪 Manual DOM Control Test');
  
  // Step 1: Check modules
  if (!window.DOMHelpers) {
    console.log('❌ DOMHelpers not loaded');
    return;
  }
  
  if (!window.DOMRetriever) {
    console.log('❌ DOMRetriever not loaded');
    return;
  }
  
  if (!window.DOMAPI) {
    console.log('❌ DOMAPI not loaded');
    return;
  }
  
  // Step 2: Initialize if needed
  if (window.DOMRetriever && !window.DOMRetriever.isInitialized) {
    window.DOMRetriever.initialize();
  }
  
  if (window.DOMController && !window.DOMController.isInitialized) {
    window.DOMController.initialize();
  }
  
  if (window.DOMAPI && !window.DOMAPI.isInitialized) {
    window.DOMAPI.initialize();
  }
  
  // Step 3: Test basic functionality
  try {
    const result = await window.DOMAPI.getElement('title', 'text');
    console.log('✅ DOM Control working:', result);
  } catch (error) {
    console.log('❌ DOM Control test failed:', error);
  }
}

testDOMControlManually();
```

## 🚀 Working Examples (After Fix)

Once the system is working, these should work:

### Test 1: Basic Element Retrieval
```javascript
(async () => {
  try {
    const result = await window.DOMAPI.getElement('title', 'text');
    console.log('✅ Page title:', result.dom);
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }
})();
```

### Test 2: ChatGPT Specific
```javascript
(async () => {
  try {
    // Wait for ChatGPT to load
    await window.DOMHelpers.waitForElement('[role="main"]', 5000);
    
    // Get latest assistant message
    const result = await window.DOMAPI.getElement('[data-message-author-role="assistant"]:last-child', 'text');
    console.log('🧠 Latest AI response:', result.dom);
  } catch (error) {
    console.log('❌ ChatGPT test failed:', error.message);
  }
})();
```

### Test 3: DOM Manipulation
```javascript
(async () => {
  try {
    // Create test element
    const testDiv = window.DOMHelpers.createElement('div', {
      id: 'dom-test',
      style: 'position: fixed; top: 10px; right: 10px; background: yellow; padding: 10px; z-index: 9999;'
    }, 'DOM Test');
    
    document.body.appendChild(testDiv);
    
    // Test manipulation
    await window.DOMAPI.setText('#dom-test', 'DOM Working!');
    console.log('✅ DOM manipulation working');
    
    // Clean up after 3 seconds
    setTimeout(() => {
      document.getElementById('dom-test')?.remove();
    }, 3000);
  } catch (error) {
    console.log('❌ Manipulation test failed:', error.message);
  }
})();
```

## 📞 Getting Help

If issues persist:

1. **Check Browser Console** - Look for error messages
2. **Verify Extension Permissions** - Ensure all required permissions are granted
3. **Test on Fresh Page** - Try on a new ChatGPT tab
4. **Check Extension Status** - Ensure extension is enabled and up to date

## 🔄 Reset Instructions

If all else fails, completely reset:

1. Go to `chrome://extensions/`
2. Remove "Genesis Loop" extension
3. Reload the extension from your local files
4. Refresh ChatGPT page
5. Check console for loading messages
6. Test with basic examples above