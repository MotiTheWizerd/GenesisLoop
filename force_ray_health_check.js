/**
 * Force Ray Health Check - Triggers Ray's self-repair system
 * This will detect the missing DOMAPI and inject the emergency version
 */

console.log('🚨 Forcing Ray health check and repair...');

async function forceRayHealthCheck() {
  console.log('🔍 Step 1: Checking current DOMAPI status...');
  console.log('DOMAPI available:', typeof window.DOMAPI);
  console.log('RayDOMInterface available:', typeof window.RayDOMInterface);
  console.log('Emergency injector available:', typeof window.injectEmergencyDOMAPI);
  
  if (typeof window.RayDOMInterface !== 'undefined') {
    console.log('🧠 Step 2: Ray performing health check...');
    
    try {
      const healthReport = await window.RayDOMInterface.checkSystemHealth();
      console.log('📊 Health report:', healthReport);
      
      if (!healthReport.overall) {
        console.log('⚠️ Health check failed, Ray should auto-repair...');
      } else {
        console.log('✅ Health check passed!');
      }
      
    } catch (error) {
      console.log('❌ Health check failed with error:', error.message);
    }
    
    console.log('🔍 Step 3: Checking DOMAPI status after health check...');
    console.log('DOMAPI available now:', typeof window.DOMAPI);
    
    if (typeof window.DOMAPI === 'object') {
      console.log('✅ DOMAPI is now available!');
      
      // Test it
      try {
        const title = await window.DOMAPI.getElement('title', 'text');
        console.log('🧪 DOMAPI test successful:', title.dom);
      } catch (error) {
        console.log('⚠️ DOMAPI test failed:', error.message);
      }
    } else {
      console.log('❌ DOMAPI still not available, trying manual injection...');
      
      if (typeof window.injectEmergencyDOMAPI === 'function') {
        console.log('🔧 Manually injecting emergency DOMAPI...');
        const success = window.injectEmergencyDOMAPI();
        console.log('Emergency injection result:', success);
        
        if (success) {
          console.log('✅ Manual emergency injection successful!');
          
          // Test it
          try {
            const title = await window.DOMAPI.getElement('title', 'text');
            console.log('🧪 Emergency DOMAPI test successful:', title.dom);
          } catch (error) {
            console.log('⚠️ Emergency DOMAPI test failed:', error.message);
          }
        }
      } else {
        console.log('❌ Emergency injector not available');
      }
    }
    
  } else {
    console.log('❌ RayDOMInterface not available - extension may not be loaded properly');
  }
  
  console.log('🎯 Step 4: Final status check...');
  console.log('Final DOMAPI status:', typeof window.DOMAPI);
  console.log('DOMAPI methods available:', window.DOMAPI ? Object.keys(window.DOMAPI).length : 0);
  
  if (window.DOMAPI) {
    console.log('🎉 SUCCESS! DOMAPI is now available for Ray to use');
    console.log('Ray can now use all safe DOM methods with auto-repair');
  } else {
    console.log('❌ FAILED! DOMAPI still not available');
  }
}

// Run the force health check
forceRayHealthCheck().catch(error => {
  console.log('❌ Force health check failed:', error.message);
});

console.log('🚀 Force Ray health check initiated...');