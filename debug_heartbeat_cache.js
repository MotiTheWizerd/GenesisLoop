// Debug Heartbeat Cache Issues
// This script helps identify if the problem is client-side caching or server-side

(function() {
  'use strict';

  console.log('🔍 [Debug] Starting heartbeat cache investigation...');

  // Test 1: Check if FetchSender is available
  if (typeof window.FetchSender === 'undefined') {
    console.error('❌ [Debug] FetchSender not available');
    return;
  }

  console.log('✅ [Debug] FetchSender is available');

  // Test 2: Make multiple heartbeat requests with cache-busting
  async function testHeartbeatCaching() {
    console.log('🧪 [Debug] Testing heartbeat caching behavior...');

    // Test 1: Normal request
    console.log('📡 [Debug] Test 1: Normal heartbeat request');
    try {
      const result1 = await window.FetchSender.getHeartbeat();
      console.log('📥 [Debug] Normal request result:', result1);
    } catch (error) {
      console.error('❌ [Debug] Normal request failed:', error);
    }

    // Wait 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 2: Request with cache-busting headers
    console.log('📡 [Debug] Test 2: Cache-busted heartbeat request');
    try {
      const result2 = await window.FetchSender.getHeartbeat({
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      console.log('📥 [Debug] Cache-busted request result:', result2);
    } catch (error) {
      console.error('❌ [Debug] Cache-busted request failed:', error);
    }

    // Wait 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 3: Direct fetch with timestamp to bypass cache
    console.log('📡 [Debug] Test 3: Direct fetch with timestamp');
    try {
      const timestamp = Date.now();
      const url = `http://localhost:8000/heartbeat?t=${timestamp}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📥 [Debug] Direct fetch result:', data);
      } else {
        console.error('❌ [Debug] Direct fetch failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ [Debug] Direct fetch error:', error);
    }

    // Test 4: Check if server is actually updating
    console.log('📡 [Debug] Test 4: Multiple requests to check server updates');
    for (let i = 0; i < 3; i++) {
      try {
        const timestamp = Date.now();
        const result = await window.FetchSender.getHeartbeat();
        console.log(`📥 [Debug] Request ${i + 1} at ${timestamp}:`, result);
        
        // Wait 2 seconds between requests
        if (i < 2) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`❌ [Debug] Request ${i + 1} failed:`, error);
      }
    }
  }

  // Test 3: Check browser cache status
  function checkBrowserCache() {
    console.log('🌐 [Debug] Checking browser cache behavior...');
    
    // Check if we're in a service worker context
    if ('serviceWorker' in navigator) {
      console.log('🔧 [Debug] Service Worker available');
    } else {
      console.log('ℹ️ [Debug] No Service Worker');
    }

    // Check cache API
    if ('caches' in window) {
      console.log('🗄️ [Debug] Cache API available');
      caches.keys().then(cacheNames => {
        console.log('📦 [Debug] Available caches:', cacheNames);
      });
    } else {
      console.log('ℹ️ [Debug] No Cache API');
    }
  }

  // Test 4: Monitor network requests
  function monitorNetworkRequests() {
    console.log('📊 [Debug] Setting up network monitoring...');
    
    // Override fetch to monitor requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0];
      if (typeof url === 'string' && url.includes('heartbeat')) {
        console.log('🌐 [Debug] Heartbeat request intercepted:', url);
        console.log('🌐 [Debug] Request options:', args[1]);
      }
      
      return originalFetch.apply(this, args).then(response => {
        if (typeof url === 'string' && url.includes('heartbeat')) {
          console.log('📨 [Debug] Heartbeat response:', response.status, response.statusText);
          console.log('📨 [Debug] Response headers:', [...response.headers.entries()]);
        }
        return response;
      });
    };
    
    console.log('✅ [Debug] Network monitoring active');
  }

  // Run all tests
  async function runAllTests() {
    console.log('🚀 [Debug] Running comprehensive heartbeat cache tests...');
    
    checkBrowserCache();
    monitorNetworkRequests();
    
    // Wait a moment for setup
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testHeartbeatCaching();
    
    console.log('✅ [Debug] All tests completed. Check the logs above for issues.');
    console.log('💡 [Debug] If all requests return identical data, the issue is server-side.');
    console.log('💡 [Debug] If requests show different timestamps but same content, check server logic.');
  }

  // Start the tests
  runAllTests();

})();