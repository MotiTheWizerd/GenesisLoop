/**
 * Complete Ray DOM Interface Test
 * Tests all of Ray's safe DOM manipulation methods
 */

console.log('🧠 Testing Ray\'s Complete DOM Interface...');

async function testRayDOMInterface() {
  console.log('\n📊 === HEALTH & DIAGNOSTICS ===');
  
  // Test health check
  try {
    const health = await window.RayDOMInterface.checkSystemHealth();
    console.log('✅ Health check:', health.overall ? 'HEALTHY' : 'NEEDS REPAIR');
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  // Test system status
  try {
    const status = window.RayDOMInterface.getSystemStatus();
    console.log('✅ System status:', {
      domapi: status.domapi.available,
      emergency: status.domapi.isEmergency,
      fallback: status.domapi.isFallback
    });
  } catch (error) {
    console.log('❌ System status failed:', error.message);
  }
  
  console.log('\n🔍 === SAFE DOM RETRIEVAL ===');
  
  // Test safe element retrieval
  try {
    const title = await window.RayDOMInterface.safeGetElement('title', 'text');
    console.log('✅ Safe get element (title):', title.dom.substring(0, 50) + '...');
  } catch (error) {
    console.log('❌ Safe get element failed:', error.message);
  }
  
  // Test safe full DOM
  try {
    const dom = await window.RayDOMInterface.safeGetFullDOM({
      includeStyles: false,
      includeScripts: false,
      format: 'html'
    });
    console.log('✅ Safe get full DOM:', dom.dom.length, 'characters');
  } catch (error) {
    console.log('❌ Safe get full DOM failed:', error.message);
  }
  
  // Test safe element exists
  try {
    const exists = await window.RayDOMInterface.safeElementExists('body');
    console.log('✅ Safe element exists (body):', exists);
  } catch (error) {
    console.log('❌ Safe element exists failed:', error.message);
  }
  
  console.log('\n✏️ === SAFE DOM MANIPULATION ===');
  
  // Create test element for manipulation
  const testElement = document.createElement('div');
  testElement.id = 'ray-test-element';
  testElement.style.cssText = 'position: fixed; top: 10px; left: 10px; background: lightblue; padding: 10px; z-index: 9999;';
  testElement.textContent = 'Ray Test Element';
  document.body.appendChild(testElement);
  
  console.log('🔧 Created test element for manipulation tests');
  
  // Test safe set text
  try {
    await window.RayDOMInterface.safeSetText('#ray-test-element', 'Ray setText works!');
    console.log('✅ Safe set text completed');
  } catch (error) {
    console.log('❌ Safe set text failed:', error.message);
  }
  
  // Test safe set HTML
  try {
    await window.RayDOMInterface.safeSetHTML('#ray-test-element', '<strong>Ray setHTML works!</strong>');
    console.log('✅ Safe set HTML completed');
  } catch (error) {
    console.log('❌ Safe set HTML failed:', error.message);
  }
  
  // Test safe add class
  try {
    await window.RayDOMInterface.safeAddClass('#ray-test-element', 'ray-test-class');
    console.log('✅ Safe add class completed');
  } catch (error) {
    console.log('❌ Safe add class failed:', error.message);
  }
  
  // Test safe set attribute
  try {
    await window.RayDOMInterface.safeSetAttribute('#ray-test-element', {
      'data-ray-test': 'true',
      'title': 'Ray controlled element'
    });
    console.log('✅ Safe set attribute completed');
  } catch (error) {
    console.log('❌ Safe set attribute failed:', error.message);
  }
  
  // Test safe toggle class
  try {
    await window.RayDOMInterface.safeToggleClass('#ray-test-element', 'ray-toggle-test');
    console.log('✅ Safe toggle class completed');
  } catch (error) {
    console.log('❌ Safe toggle class failed:', error.message);
  }
  
  // Wait 3 seconds to show the element
  console.log('⏳ Waiting 3 seconds to display test element...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test safe remove element
  try {
    await window.RayDOMInterface.safeRemoveElement('#ray-test-element');
    console.log('✅ Safe remove element completed');
  } catch (error) {
    console.log('❌ Safe remove element failed:', error.message);
  }
  
  console.log('\n🎯 === CHATGPT SPECIFIC TESTS ===');
  
  // Test ChatGPT elements
  const chatGPTTests = [
    { selector: '[role="main"]', name: 'Main chat container' },
    { selector: '#prompt-textarea', name: 'Input textarea' },
    { selector: '[data-testid="send-button"]', name: 'Send button' },
    { selector: '[data-message-author-role="assistant"]', name: 'Assistant messages' }
  ];
  
  for (const test of chatGPTTests) {
    try {
      const exists = await window.RayDOMInterface.safeElementExists(test.selector);
      console.log(`${exists ? '✅' : '❌'} ${test.name}: ${exists ? 'Found' : 'Not found'}`);
    } catch (error) {
      console.log(`❌ ${test.name} test failed:`, error.message);
    }
  }
  
  // Try to get latest ChatGPT response
  try {
    const response = await window.RayDOMInterface.safeGetElement('[data-message-author-role="assistant"]:last-child', 'text');
    console.log('✅ Latest ChatGPT response:', response.dom.substring(0, 100) + '...');
  } catch (error) {
    console.log('⚠️ No ChatGPT responses found or selector changed');
  }
  
  console.log('\n📈 === PERFORMANCE & MEMORY ===');
  
  // Test repair memory
  try {
    const memory = window.RayDOMInterface.getRepairMemory();
    console.log('✅ Repair memory:', {
      totalRepairs: memory.totalRepairs,
      successRate: memory.totalRepairs > 0 ? 
        `${((memory.successfulRepairs / memory.totalRepairs) * 100).toFixed(1)}%` : 'N/A'
    });
  } catch (error) {
    console.log('❌ Repair memory failed:', error.message);
  }
  
  // Test diagnostic report
  try {
    const report = window.RayDOMInterface.generateDiagnosticReport();
    console.log('✅ Diagnostic report generated with', report.recommendations.length, 'recommendations');
  } catch (error) {
    console.log('❌ Diagnostic report failed:', error.message);
  }
  
  console.log('\n🎉 === RAY DOM INTERFACE TEST COMPLETE ===');
  console.log('🧠 Ray now has complete DOM control with auto-repair capabilities!');
  
  // Show available methods summary
  console.log('\n📚 Ray\'s Complete Method Arsenal:');
  console.log('  Health: checkSystemHealth, attemptSelfRepair, performHeartbeatCheck');
  console.log('  Retrieval: safeGetElement, safeGetFullDOM, safeElementExists, safeWaitForElement');
  console.log('  Manipulation: safeSetText, safeSetHTML, safeClick, safeSetAttribute');
  console.log('  CSS: safeAddClass, safeRemoveClass, safeToggleClass');
  console.log('  Control: safeRemoveElement');
  console.log('  Diagnostics: getSystemStatus, generateDiagnosticReport, getRepairMemory');
}

// Run the complete test
testRayDOMInterface().catch(error => {
  console.log('❌ Ray DOM Interface test failed:', error.message);
});

console.log('🚀 Ray DOM Interface test initiated...');