(function() {
  'use strict';
  
  // Ray DOM System Initialization
  console.log('🚀 Initializing Ray DOM Emergency System...');
  
  let waitAttempts = 0;
  const maxWaitAttempts = 50; // 10 seconds max wait
  
  // Wait for essential components to load (more flexible)
  function waitForComponents() {
    waitAttempts++;
    
    if (waitAttempts > maxWaitAttempts) {
      console.log('⚠️ Ray DOM initialization timeout - proceeding with available components');
      initializeRayDOMSystem();
      return;
    }
    // Only wait for the most essential components
    const essentialComponents = [
      'RayDOMInterface'
    ];
    
    const essentialLoaded = essentialComponents.every(component => 
      typeof window[component] !== 'undefined'
    );
    
    if (essentialLoaded) {
      initializeRayDOMSystem();
    } else {
      console.log('⏳ Waiting for essential Ray DOM components to load...');
      console.log('  - RayDOMInterface:', typeof window.RayDOMInterface);
      setTimeout(waitForComponents, 200);
    }
  }
  
  function initializeRayDOMSystem() {
    console.log('🧠 Ray DOM Emergency System initializing...');
    
    try {
      // Start health monitoring
      if (window.DOMHealthChecker) {
        window.DOMHealthChecker.startHealthMonitoring();
      }
      
      // Perform initial health check
      if (window.RayDOMInterface) {
        window.RayDOMInterface.checkSystemHealth().then(healthReport => {
          if (healthReport.overall) {
            console.log('✅ Ray DOM System healthy and ready');
          } else {
            console.log('⚠️ Ray DOM System detected issues, repair may be needed');
          }
        });
      }
      
      // Set up heartbeat check every 60 seconds
      setInterval(() => {
        if (window.RayDOMInterface) {
          window.RayDOMInterface.performHeartbeatCheck();
        }
      }, 60000);
      
      console.log('✅ Ray DOM Emergency System fully initialized');
      
      // Log available Ray methods
      console.log('🧠 Ray DOM Methods Available:');
      console.log('  📊 Health & Diagnostics:');
      console.log('    • window.RayDOMInterface.checkSystemHealth()');
      console.log('    • window.RayDOMInterface.attemptSelfRepair()');
      console.log('    • window.RayDOMInterface.getSystemStatus()');
      console.log('    • window.RayDOMInterface.generateDiagnosticReport()');
      console.log('    • window.RayDOMInterface.performHeartbeatCheck()');
      console.log('    • window.RayDOMInterface.getRepairMemory()');
      console.log('  🔍 Safe DOM Retrieval:');
      console.log('    • window.RayDOMInterface.safeGetElement(selector, format)');
      console.log('    • window.RayDOMInterface.safeGetFullDOM(options)');
      console.log('    • window.RayDOMInterface.safeElementExists(selector)');
      console.log('    • window.RayDOMInterface.safeWaitForElement(selector, timeout)');
      console.log('  ✏️ Safe DOM Manipulation:');
      console.log('    • window.RayDOMInterface.safeSetText(selector, text)');
      console.log('    • window.RayDOMInterface.safeSetHTML(selector, html)');
      console.log('    • window.RayDOMInterface.safeClick(selector)');
      console.log('    • window.RayDOMInterface.safeSetAttribute(selector, attributes)');
      console.log('    • window.RayDOMInterface.safeAddClass(selector, className)');
      console.log('    • window.RayDOMInterface.safeRemoveClass(selector, className)');
      console.log('    • window.RayDOMInterface.safeToggleClass(selector, className)');
      console.log('    • window.RayDOMInterface.safeRemoveElement(selector)');
      console.log('  🗣️ Natural Language Commands (Console):');
      console.log('    • window.Ray.executeCommand("click send button")');
      console.log('    • window.Ray.executeCommand("remove ad")');
      console.log('    • window.Ray.executeCommand("set title to Hello World")');
      console.log('  🌉 Console Bridge Methods:');
      console.log('    • window.Ray.safeSetText(selector, text)');
      console.log('    • window.Ray.safeGetElement(selector, format)');
      console.log('    • window.Ray.safeClick(selector)');
      console.log('    • window.Ray.executeCommand(naturalLanguage)');
      
    } catch (error) {
      console.log('❌ Ray DOM System initialization failed:', error.message);
    }
  }
  
  // Start the initialization process
  waitForComponents();
  
})();