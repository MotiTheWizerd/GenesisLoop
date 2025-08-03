/**
 * Ray Console Bridge Test
 * Run this in the browser console to test Ray's functionality
 */

console.log('🧪 Testing Ray Console Bridge...');

async function testRayConsoleBridge() {
  console.log('\n🔍 Step 1: Checking Ray availability...');
  
  if (typeof window.Ray === 'undefined') {
    console.log('❌ window.Ray is not available in console');
    console.log('💡 Make sure the extension is loaded and refresh the page');
    return;
  }
  
  console.log('✅ window.Ray is available');
  console.log('Bridge info:', {
    isConsoleBridge: window.Ray.isConsoleBridge,
    bridgeVersion: window.Ray.bridgeVersion
  });
  
  console.log('\n🔍 Step 2: Testing element existence...');
  try {
    const bodyExists = window.Ray.elementExists('body');
    console.log('✅ Element existence test:', bodyExists);
  } catch (error) {
    console.log('❌ Element existence test failed:', error.message);
  }
  
  console.log('\n🔍 Step 3: Testing DOM retrieval...');
  try {
    const title = await window.Ray.safeGetElement('title', 'text');
    console.log('✅ DOM retrieval test successful:', title.dom);
  } catch (error) {
    console.log('❌ DOM retrieval test failed:', error.message);
  }
  
  console.log('\n🔍 Step 4: Testing DOM manipulation...');
  try {
    // Create a test element
    const testDiv = document.createElement('div');
    testDiv.id = 'ray-console-test';
    testDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: lightgreen; padding: 10px; z-index: 9999;';
    testDiv.textContent = 'Ray Console Test';
    document.body.appendChild(testDiv);
    
    // Test manipulation
    const result = await window.Ray.safeSetText('#ray-console-test', '🧠 Ray Console Bridge Works!');
    console.log('✅ DOM manipulation test successful:', result);
    
    // Clean up after 3 seconds
    setTimeout(() => {
      const testEl = document.getElementById('ray-console-test');
      if (testEl) testEl.remove();
      console.log('🧹 Test element cleaned up');
    }, 3000);
    
  } catch (error) {
    console.log('❌ DOM manipulation test failed:', error.message);
  }
  
  console.log('\n🔍 Step 5: Testing natural language commands...');
  try {
    // Test with a safe command that won't break anything
    const commandResult = await window.Ray.executeCommand('set title to Ray Test');
    console.log('✅ Natural language test successful:', commandResult);
  } catch (error) {
    console.log('❌ Natural language test failed:', error.message);
    console.log('💡 This might be expected if RayCommandRouter is not loaded yet');
  }
  
  console.log('\n🎉 Ray Console Bridge test completed!');
  console.log('🧠 Ray is ready for console commands');
  
  // Show usage examples
  console.log('\n📚 Usage Examples:');
  console.log('await window.Ray.safeSetText("body", "👁️ Ray controls the DOM");');
  console.log('await window.Ray.safeGetElement("title", "text");');
  console.log('await window.Ray.executeCommand("click send button");');
  console.log('window.Ray.elementExists("#prompt-textarea");');
}

// Run the test
testRayConsoleBridge().catch(error => {
  console.log('❌ Ray Console Bridge test failed:', error.message);
});

console.log('🚀 Ray Console Bridge test initiated...');