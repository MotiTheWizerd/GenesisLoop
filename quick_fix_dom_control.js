/**
 * Quick Fix for DOM Control System
 * Run this in browser console if DOM Control isn't working
 */

console.log('🚀 Quick Fix: Force Loading DOM Control System...');

// Function to wait for a condition
function waitFor(condition, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    function check() {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'));
      } else {
        setTimeout(check, 100);
      }
    }
    
    check();
  });
}

// Step 1: Force initialize all components
async function forceInitialize() {
  console.log('🔧 Step 1: Force initializing components...');
  
  // Wait for basic modules to load
  try {
    await waitFor(() => window.DOMHelpers && window.DOMRetriever && window.DOMController, 3000);
    console.log('✅ Basic modules detected');
  } catch (error) {
    console.log('❌ Basic modules not loaded. Extension may not be working.');
    return false;
  }
  
  // Initialize DOMRetriever
  if (window.DOMRetriever && !window.DOMRetriever.isInitialized) {
    try {
      window.DOMRetriever.initialize();
      console.log('✅ DOMRetriever initialized');
    } catch (error) {
      console.log('❌ DOMRetriever initialization failed:', error.message);
    }
  }
  
  // Initialize DOMController
  if (window.DOMController && !window.DOMController.isInitialized) {
    try {
      window.DOMController.initialize();
      console.log('✅ DOMController initialized');
    } catch (error) {
      console.log('❌ DOMController initialization failed:', error.message);
    }
  }
  
  // Initialize DOMAPI
  if (window.DOMAPI && !window.DOMAPI.isInitialized) {
    try {
      window.DOMAPI.initialize();
      console.log('✅ DOMAPI initialized');
    } catch (error) {
      console.log('❌ DOMAPI initialization failed:', error.message);
    }
  }
  
  // Initialize DOMControlSystem
  if (window.DOMControlSystem) {
    try {
      window.DOMControlSystem.initialize();
      console.log('✅ DOMControlSystem initialized');
    } catch (error) {
      console.log('❌ DOMControlSystem initialization failed:', error.message);
    }
  }
  
  return true;
}

// Step 2: Test functionality
async function testFunctionality() {
  console.log('🧪 Step 2: Testing functionality...');
  
  // Test DOMAPI
  if (window.DOMAPI) {
    try {
      const result = await window.DOMAPI.getElement('title', 'text');
      console.log('✅ DOMAPI working! Page title:', result.dom);
      return true;
    } catch (error) {
      console.log('❌ DOMAPI test failed:', error.message);
    }
  }
  
  // Fallback: Test DOMRetriever directly
  if (window.DOMRetriever) {
    try {
      const dom = window.DOMRetriever.getDOM({ selector: 'title', format: 'text' });
      console.log('✅ DOMRetriever working! Page title:', dom);
      return true;
    } catch (error) {
      console.log('❌ DOMRetriever test failed:', error.message);
    }
  }
  
  return false;
}

// Step 3: Create fallback DOMAPI if needed
function createFallbackDOMAPI() {
  console.log('🔧 Step 3: Creating fallback DOMAPI...');
  
  if (!window.DOMAPI && window.DOMRetriever && window.DOMController) {
    window.DOMAPI = {
      // Basic retrieval method
      async getElement(selector, format = 'outerHTML') {
        return new Promise((resolve, reject) => {
          try {
            const dom = window.DOMRetriever.getDOM({ selector, format });
            resolve({ success: true, dom, timestamp: Date.now() });
          } catch (error) {
            reject(error);
          }
        });
      },
      
      // Basic manipulation method
      async setText(selector, text) {
        return new Promise((resolve, reject) => {
          try {
            const element = document.querySelector(selector);
            if (!element) {
              throw new Error(`Element not found: ${selector}`);
            }
            element.textContent = text;
            resolve({ success: true, result: 'Text updated', timestamp: Date.now() });
          } catch (error) {
            reject(error);
          }
        });
      },
      
      // Basic page info
      async getPageInfo() {
        return Promise.resolve({
          success: true,
          title: document.title,
          url: window.location.href,
          domain: window.location.hostname,
          timestamp: Date.now()
        });
      }
    };
    
    console.log('✅ Fallback DOMAPI created');
    return true;
  }
  
  return false;
}

// Main execution
(async () => {
  try {
    // Try to initialize
    const initialized = await forceInitialize();
    
    if (!initialized) {
      console.log('❌ Could not initialize. Extension may not be loaded.');
      return;
    }
    
    // Wait a moment for initialization to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test functionality
    const working = await testFunctionality();
    
    if (!working) {
      // Create fallback
      const fallbackCreated = createFallbackDOMAPI();
      
      if (fallbackCreated) {
        // Test fallback
        const fallbackWorking = await testFunctionality();
        if (fallbackWorking) {
          console.log('✅ Fallback DOMAPI is working!');
        }
      }
    }
    
    // Final status
    console.log('\n🎯 Final Status:');
    console.log('DOMAPI available:', typeof window.DOMAPI);
    console.log('DOMHelpers available:', typeof window.DOMHelpers);
    console.log('DOMRetriever available:', typeof window.DOMRetriever);
    console.log('DOMController available:', typeof window.DOMController);
    
    if (window.DOMAPI) {
      console.log('\n🎉 SUCCESS! You can now use DOM Control System');
      console.log('Try this: await window.DOMAPI.getElement("title", "text")');
      
      // Test the original command that failed
      console.log('\n🧠 Testing your original command...');
      try {
        const result = await window.DOMAPI.getElement('[data-message-author-role="assistant"]:last-child', 'text');
        console.log('✅ Latest AI response:', result.dom);
      } catch (error) {
        console.log('⚠️ Original command still failing (element may not exist):', error.message);
        console.log('💡 Try: await window.DOMAPI.getElement("title", "text") first');
      }
    } else {
      console.log('\n❌ DOM Control System still not working');
      console.log('🔄 Try reloading the extension and refreshing this page');
    }
    
  } catch (error) {
    console.log('❌ Quick fix failed:', error.message);
  }
})();

console.log('⏳ Quick fix running... check results above in a moment.');