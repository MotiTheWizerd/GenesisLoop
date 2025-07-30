/**
 * DOM Control System Test
 * Demonstrates how to use the new DOM control addon
 */

// Test the DOM Control System
async function testDOMControl() {
  console.log('🧪 Testing DOM Control System...');
  
  try {
    // Test 1: Get full DOM
    console.log('📄 Test 1: Getting full DOM...');
    const domResult = await window.DOMAPI.getFullDOM({
      includeStyles: false,
      includeScripts: false,
      format: 'html'
    });
    console.log('✅ DOM retrieved:', domResult.dom.length, 'characters');
    
    // Test 2: Get specific element
    console.log('📄 Test 2: Getting specific element...');
    const titleResult = await window.DOMAPI.getElement('title', 'text');
    console.log('✅ Title retrieved:', titleResult);
    
    // Test 3: Get page info
    console.log('📄 Test 3: Getting page info...');
    const pageInfo = await window.DOMAPI.getPageInfo();
    console.log('✅ Page info:', pageInfo);
    
    // Test 4: DOM manipulation (if safe element exists)
    console.log('📄 Test 4: Testing DOM manipulation...');
    
    // Create a test element first
    const testElement = window.DOMHelpers.createElement('div', {
      id: 'dom-control-test',
      style: 'position: fixed; top: 10px; right: 10px; background: yellow; padding: 10px; z-index: 9999;'
    }, 'DOM Control Test');
    
    document.body.appendChild(testElement);
    
    // Test manipulation
    await window.DOMAPI.setText('#dom-control-test', 'DOM Control Working!');
    console.log('✅ Text updated');
    
    await window.DOMAPI.addClass('#dom-control-test', 'test-class');
    console.log('✅ Class added');
    
    // Test 5: Observer
    console.log('📄 Test 5: Testing DOM observer...');
    const observerId = window.DOMAPI.generateObserverId();
    
    // Listen for DOM changes
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === 'domChanged' && message.observerId === observerId) {
        console.log('🔍 DOM changed:', message.changes);
      }
    });
    
    await window.DOMAPI.startObserving('#dom-control-test', observerId);
    console.log('✅ Observer started');
    
    // Make a change to trigger observer
    setTimeout(async () => {
      await window.DOMAPI.setText('#dom-control-test', 'Observer Test!');
      
      // Clean up after 3 seconds
      setTimeout(async () => {
        await window.DOMAPI.stopObserving(observerId);
        await window.DOMAPI.removeElement('#dom-control-test');
        console.log('🧹 Test cleanup completed');
      }, 3000);
    }, 1000);
    
    console.log('✅ All DOM Control tests completed successfully!');
    
  } catch (error) {
    console.error('❌ DOM Control test failed:', error);
  }
}

// Test DOM Helpers
function testDOMHelpers() {
  console.log('🧪 Testing DOM Helpers...');
  
  // Test element validation
  console.log('Valid selector test:', window.DOMHelpers.isValidSelector('body')); // true
  console.log('Invalid selector test:', window.DOMHelpers.isValidSelector('>>invalid')); // false
  
  // Test element existence
  console.log('Body exists:', window.DOMHelpers.elementExists('body')); // true
  console.log('Fake element exists:', window.DOMHelpers.elementExists('#fake-element')); // false
  
  // Test element info
  const bodyInfo = window.DOMHelpers.getElementInfo('body');
  console.log('Body info:', bodyInfo);
  
  // Test element visibility
  const isBodyVisible = window.DOMHelpers.isElementVisible(document.body);
  console.log('Body visible:', isBodyVisible);
  
  // Test element path
  const bodyPath = window.DOMHelpers.getElementPath(document.body);
  console.log('Body path:', bodyPath);
  
  console.log('✅ DOM Helpers tests completed!');
}

// Usage examples for popup or background script
function showUsageExamples() {
  console.log(`
🧱 DOM Control System Usage Examples:

// 1. Get full page DOM
const dom = await window.DOMAPI.getFullDOM();

// 2. Get specific element
const element = await window.DOMAPI.getElement('#my-element', 'outerHTML');

// 3. Manipulate DOM
await window.DOMAPI.setText('#my-element', 'New text');
await window.DOMAPI.setHTML('#container', '<p>New content</p>');
await window.DOMAPI.addClass('#my-element', 'new-class');

// 4. Observe DOM changes
const observerId = window.DOMAPI.generateObserverId();
await window.DOMAPI.startObserving('#container', observerId);

// 5. Use helpers
const exists = window.DOMHelpers.elementExists('#my-element');
const info = window.DOMHelpers.getElementInfo('#my-element');
await window.DOMHelpers.waitForElement('#dynamic-element');

// 6. Batch operations
const operations = [
  { operation: 'setText', selector: '#elem1', content: 'Text 1' },
  { operation: 'setText', selector: '#elem2', content: 'Text 2' }
];
const results = await window.DOMAPI.batchOperations(operations);
  `);
}

// Run tests when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      testDOMHelpers();
      testDOMControl();
      showUsageExamples();
    }, 2000); // Wait for extension to load
  });
} else {
  setTimeout(() => {
    testDOMHelpers();
    testDOMControl();
    showUsageExamples();
  }, 2000);
}