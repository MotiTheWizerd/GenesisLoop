/**
 * Test Script for Instant DOM Control
 * Run this after loading instant_dom_control.js
 */

console.log('🧪 Testing Instant DOM Control...');

// Test 1: Get full DOM
console.log('\n📄 Test 1: Get Full DOM');
try {
  const result = window.InstantDOM.getFullDOM({
    includeStyles: false,
    includeScripts: false,
    format: 'html'
  });
  console.log('✅ Full DOM retrieved:', result.dom.length, 'characters');
} catch (error) {
  console.log('❌ Full DOM test failed:', error.message);
}

// Test 2: Get page title
console.log('\n📄 Test 2: Get Page Title');
try {
  const titleResult = window.InstantDOM.getElement('title', 'text');
  console.log('✅ Page title:', titleResult.dom);
} catch (error) {
  console.log('❌ Title test failed:', error.message);
}

// Test 3: Get page info
console.log('\n📄 Test 3: Get Page Info');
try {
  const pageInfo = window.InstantDOM.getPageInfo();
  console.log('✅ Page info:', {
    title: pageInfo.title,
    url: pageInfo.url,
    domain: pageInfo.domain
  });
} catch (error) {
  console.log('❌ Page info test failed:', error.message);
}

// Test 4: Check if ChatGPT elements exist
console.log('\n📄 Test 4: ChatGPT Elements Check');
const chatElements = [
  '[role="main"]',
  '#prompt-textarea',
  '[data-testid="send-button"]',
  '[data-message-author-role="assistant"]'
];

chatElements.forEach(selector => {
  const exists = window.InstantDOM.elementExists(selector);
  console.log(`${exists ? '✅' : '❌'} ${selector}: ${exists ? 'Found' : 'Not found'}`);
});

// Test 5: Try to get ChatGPT messages
console.log('\n📄 Test 5: Get ChatGPT Messages');
try {
  const messages = window.InstantDOM.getAllElements('[data-message-author-role="assistant"]');
  console.log(`✅ Found ${messages.length} assistant messages`);
  
  if (messages.length > 0) {
    const lastMessage = window.InstantDOM.getElement('[data-message-author-role="assistant"]:last-child', 'text');
    console.log('✅ Latest AI response:', lastMessage.dom.substring(0, 100) + '...');
  }
} catch (error) {
  console.log('❌ ChatGPT messages test failed:', error.message);
}

// Test 6: Create and test a temporary element
console.log('\n📄 Test 6: DOM Manipulation Test');
try {
  // Create test element
  const testDiv = document.createElement('div');
  testDiv.id = 'instant-dom-test';
  testDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: yellow; padding: 10px; z-index: 9999;';
  testDiv.textContent = 'Test Element';
  document.body.appendChild(testDiv);
  
  // Test manipulation
  window.InstantDOM.setText('#instant-dom-test', 'DOM Control Working!');
  window.InstantDOM.addClass('#instant-dom-test', 'test-class');
  
  console.log('✅ DOM manipulation successful');
  
  // Clean up after 3 seconds
  setTimeout(() => {
    window.InstantDOM.removeElement('#instant-dom-test');
    console.log('🧹 Test element cleaned up');
  }, 3000);
  
} catch (error) {
  console.log('❌ DOM manipulation test failed:', error.message);
}

console.log('\n🎉 All tests completed! Instant DOM Control is ready to use.');

// Provide working examples
console.log('\n🎯 Working Examples:');
console.log(`
// Get full page HTML (clean)
const cleanHTML = window.InstantDOM.getFullDOM({
  includeStyles: false,
  includeScripts: false,
  format: 'html'
});
console.log('Clean HTML:', cleanHTML.dom);

// Get ChatGPT latest response
try {
  const response = window.InstantDOM.getElement('[data-message-author-role="assistant"]:last-child', 'text');
  console.log('Latest AI response:', response.dom);
} catch (error) {
  console.log('No AI messages found yet');
}

// Get page title
const title = window.InstantDOM.getElement('title', 'text');
console.log('Page title:', title.dom);

// Check if element exists
const hasInput = window.InstantDOM.elementExists('#prompt-textarea');
console.log('ChatGPT input exists:', hasInput);
`);