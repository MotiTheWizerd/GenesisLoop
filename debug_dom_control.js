/**
 * DOM Control System Diagnostic Script
 * Run this in the browser console to diagnose loading issues
 */

console.log('🔍 Starting DOM Control System Diagnostic...');

// Step 1: Check if we're on the right page
console.log('📍 Page Check:');
console.log('  Current URL:', window.location.href);
console.log('  Is ChatGPT page:', window.location.href.includes('chatgpt.com') || window.location.href.includes('chat.openai.com'));

// Step 2: Check main extension components
console.log('\n🧩 Main Extension Components:');
const mainComponents = {
  'Constants': window.Constants,
  'ResponseTracker': window.ResponseTracker,
  'DependencyLoader': window.DependencyLoader,
  'ToggleButton': window.ToggleButton,
  'MessageLoop': window.MessageLoop
};

Object.entries(mainComponents).forEach(([name, component]) => {
  console.log(`  ${name}: ${typeof component} ${component ? '✅' : '❌'}`);
});

// Step 3: Check DOM Control modules
console.log('\n🧱 DOM Control Modules:');
const domModules = {
  'DOMHelpers': window.DOMHelpers,
  'DOMRetriever': window.DOMRetriever,
  'DOMController': window.DOMController,
  'DOMAPI': window.DOMAPI,
  'DOMControlSystem': window.DOMControlSystem
};

Object.entries(domModules).forEach(([name, module]) => {
  console.log(`  ${name}: ${typeof module} ${module ? '✅' : '❌'}`);
});

// Step 4: Check initialization status
console.log('\n🚀 Initialization Status:');
if (window.DOMRetriever) {
  console.log(`  DOMRetriever initialized: ${window.DOMRetriever.isInitialized ? '✅' : '❌'}`);
}
if (window.DOMController) {
  console.log(`  DOMController initialized: ${window.DOMController.isInitialized ? '✅' : '❌'}`);
}
if (window.DOMAPI) {
  console.log(`  DOMAPI initialized: ${window.DOMAPI.isInitialized ? '✅' : '❌'}`);
}

// Step 5: Attempt manual initialization if needed
console.log('\n🔧 Attempting Manual Initialization:');

function attemptInitialization() {
  let initCount = 0;
  
  if (window.DOMRetriever && !window.DOMRetriever.isInitialized) {
    try {
      window.DOMRetriever.initialize();
      console.log('  ✅ DOMRetriever manually initialized');
      initCount++;
    } catch (error) {
      console.log('  ❌ DOMRetriever initialization failed:', error.message);
    }
  }
  
  if (window.DOMController && !window.DOMController.isInitialized) {
    try {
      window.DOMController.initialize();
      console.log('  ✅ DOMController manually initialized');
      initCount++;
    } catch (error) {
      console.log('  ❌ DOMController initialization failed:', error.message);
    }
  }
  
  if (window.DOMAPI && !window.DOMAPI.isInitialized) {
    try {
      window.DOMAPI.initialize();
      console.log('  ✅ DOMAPI manually initialized');
      initCount++;
    } catch (error) {
      console.log('  ❌ DOMAPI initialization failed:', error.message);
    }
  }
  
  if (window.DOMControlSystem) {
    try {
      window.DOMControlSystem.initialize();
      console.log('  ✅ DOMControlSystem manually initialized');
      initCount++;
    } catch (error) {
      console.log('  ❌ DOMControlSystem initialization failed:', error.message);
    }
  }
  
  return initCount;
}

const initialized = attemptInitialization();
console.log(`  Manually initialized ${initialized} components`);

// Step 6: Test basic functionality
console.log('\n🧪 Testing Basic Functionality:');

async function testBasicFunctionality() {
  // Test 1: DOMHelpers
  if (window.DOMHelpers) {
    try {
      const exists = window.DOMHelpers.elementExists('body');
      console.log(`  DOMHelpers.elementExists('body'): ${exists} ✅`);
    } catch (error) {
      console.log(`  DOMHelpers test failed: ${error.message} ❌`);
    }
  } else {
    console.log('  DOMHelpers not available ❌');
  }
  
  // Test 2: DOMAPI
  if (window.DOMAPI) {
    try {
      const result = await window.DOMAPI.getElement('title', 'text');
      console.log(`  DOMAPI.getElement('title'): "${result.dom.substring(0, 50)}..." ✅`);
    } catch (error) {
      console.log(`  DOMAPI test failed: ${error.message} ❌`);
    }
  } else {
    console.log('  DOMAPI not available ❌');
  }
  
  // Test 3: Direct DOMRetriever
  if (window.DOMRetriever) {
    try {
      const dom = window.DOMRetriever.getDOM({ selector: 'title', format: 'text' });
      console.log(`  DOMRetriever.getDOM('title'): "${dom.substring(0, 50)}..." ✅`);
    } catch (error) {
      console.log(`  DOMRetriever test failed: ${error.message} ❌`);
    }
  } else {
    console.log('  DOMRetriever not available ❌');
  }
}

// Run tests after a short delay
setTimeout(testBasicFunctionality, 1000);

// Step 7: Provide recommendations
console.log('\n💡 Recommendations:');

if (!window.DOMHelpers || !window.DOMRetriever || !window.DOMController || !window.DOMAPI) {
  console.log('  🔄 Extension scripts not loaded properly. Try:');
  console.log('    1. Go to chrome://extensions/');
  console.log('    2. Find "Genesis Loop" extension');
  console.log('    3. Click the refresh/reload button');
  console.log('    4. Refresh this ChatGPT page');
  console.log('    5. Run this diagnostic again');
} else {
  console.log('  ✅ All modules loaded successfully!');
  console.log('  🎯 You can now use the DOM Control System');
  console.log('  📖 Try: await window.DOMAPI.getElement("title", "text")');
}

// Step 8: Create working example
console.log('\n🎯 Working Example (copy and paste):');
console.log(`
// Test the DOM Control System
(async () => {
  try {
    // Wait a moment for initialization
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test basic functionality
    if (window.DOMAPI) {
      const result = await window.DOMAPI.getElement('title', 'text');
      console.log('🎉 DOM Control working! Page title:', result.dom);
    } else {
      console.log('❌ DOMAPI still not available');
    }
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
})();
`);

console.log('🔍 Diagnostic complete! Check the results above.');