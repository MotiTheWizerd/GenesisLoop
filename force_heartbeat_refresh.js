// Force Heartbeat Refresh - Clear all caches and test fresh data
(function() {
  'use strict';

  console.log('🔄 [Force Refresh] Starting heartbeat cache clearing...');

  // Step 1: Clear browser caches if available
  async function clearBrowserCaches() {
    console.log('🧹 [Force Refresh] Clearing browser caches...');
    
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        console.log('📦 [Force Refresh] Found caches:', cacheNames);
        
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
          console.log(`🗑️ [Force Refresh] Deleted cache: ${cacheName}`);
        }
        
        console.log('✅ [Force Refresh] All caches cleared');
      } catch (error) {
        console.warn('⚠️ [Force Refresh] Cache clearing failed:', error);
      }
    } else {
      console.log('ℹ️ [Force Refresh] No cache API available');
    }
  }

  // Step 2: Force fresh heartbeat request with aggressive cache busting
  async function forceFreshHeartbeat() {
    console.log('💓 [Force Refresh] Forcing fresh heartbeat request...');
    
    if (typeof window.FetchSender === 'undefined') {
      console.error('❌ [Force Refresh] FetchSender not available');
      return null;
    }

    try {
      // Create a completely fresh request with maximum cache busting
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(7);
      
      const baseUrl = window.FetchSender.config.baseUrl;
      const url = `${baseUrl}heartbeat?t=${timestamp}&r=${randomId}&nocache=true`;
      
      console.log('🌐 [Force Refresh] Making request to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'If-Modified-Since': 'Thu, 01 Jan 1970 00:00:00 GMT',
          'If-None-Match': '*'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [Force Refresh] Fresh heartbeat data received:', data);
      
      return {
        success: true,
        data: data,
        timestamp: timestamp,
        url: url
      };
      
    } catch (error) {
      console.error('❌ [Force Refresh] Fresh heartbeat request failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Step 3: Compare with normal FetchSender request
  async function compareWithNormalRequest() {
    console.log('🔍 [Force Refresh] Comparing with normal FetchSender request...');
    
    try {
      const normalResult = await window.FetchSender.getHeartbeat();
      console.log('📥 [Force Refresh] Normal FetchSender result:', normalResult);
      return normalResult;
    } catch (error) {
      console.error('❌ [Force Refresh] Normal request failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Step 4: Test server responsiveness
  async function testServerResponsiveness() {
    console.log('🏥 [Force Refresh] Testing server responsiveness...');
    
    const baseUrl = window.FetchSender?.config?.baseUrl || 'http://localhost:8000/';
    
    try {
      // Test basic connectivity
      const healthUrl = `${baseUrl}heartbeat`;
      const startTime = Date.now();
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log(`⏱️ [Force Refresh] Server response time: ${responseTime}ms`);
      console.log(`📊 [Force Refresh] Server status: ${response.status}`);
      console.log(`📋 [Force Refresh] Response headers:`, [...response.headers.entries()]);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ [Force Refresh] Server is responsive, data:', data);
        return { responsive: true, responseTime, data };
      } else {
        console.warn('⚠️ [Force Refresh] Server returned error status');
        return { responsive: false, status: response.status };
      }
      
    } catch (error) {
      console.error('❌ [Force Refresh] Server connectivity test failed:', error);
      return { responsive: false, error: error.message };
    }
  }

  // Main execution function
  async function executeForceRefresh() {
    console.log('🚀 [Force Refresh] Starting comprehensive refresh process...');
    
    // Step 1: Clear caches
    await clearBrowserCaches();
    
    // Step 2: Test server responsiveness
    const serverTest = await testServerResponsiveness();
    console.log('🏥 [Force Refresh] Server test result:', serverTest);
    
    // Step 3: Force fresh request
    const freshResult = await forceFreshHeartbeat();
    console.log('💓 [Force Refresh] Fresh request result:', freshResult);
    
    // Step 4: Compare with normal request
    const normalResult = await compareWithNormalRequest();
    console.log('📊 [Force Refresh] Normal request result:', normalResult);
    
    // Step 5: Analysis
    console.log('🔬 [Force Refresh] Analysis:');
    
    if (freshResult.success && normalResult.success) {
      const freshData = JSON.stringify(freshResult.data);
      const normalData = JSON.stringify(normalResult.data);
      
      if (freshData === normalData) {
        console.log('✅ [Force Refresh] Both requests returned identical data - no caching issue');
        console.log('💡 [Force Refresh] If server changes aren\'t showing, check server-side logic');
      } else {
        console.log('⚠️ [Force Refresh] Requests returned different data - possible caching issue');
        console.log('🔍 [Force Refresh] Fresh data:', freshResult.data);
        console.log('🔍 [Force Refresh] Normal data:', normalResult.data);
      }
    } else {
      console.log('❌ [Force Refresh] One or both requests failed - check connectivity');
    }
    
    console.log('✅ [Force Refresh] Force refresh process completed');
  }

  // Execute the force refresh
  executeForceRefresh();

})();