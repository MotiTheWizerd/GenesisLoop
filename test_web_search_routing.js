/**
 * Test script for web search routing
 * Tests the new web_search action routing within task structure
 * 
 * USAGE: Run this in the browser console on a ChatGPT page with the extension loaded
 */

console.log("🔍 Web Search Routing Test Suite Starting...");

// Test function to run in browser console
function testWebSearchRouting() {
  // Test 1: Check if FetchSender is loaded
  if (typeof window.FetchSender === 'undefined') {
    console.error("❌ FetchSender not loaded - cannot test routing");
    return;
  }
  
  console.log("✅ FetchSender is available");
  
  // Show current action routes
  console.log("🗺️ Current action routes:", window.FetchSender.getActionRoutes());
  
  // Capture the URL that would be called
  let capturedUrl = null;
  let capturedData = null;
  
  // Mock fetch to capture the request
  const originalFetch = window.fetch;
  window.fetch = async (url, options) => {
    capturedUrl = url;
    capturedData = options.body ? JSON.parse(options.body) : null;
    console.log(`🎯 Mock fetch called with URL: ${url}`);
    console.log(`📦 Mock fetch called with data:`, capturedData);
    
    // Return a mock successful response
    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: {
        get: (name) => name === 'content-type' ? 'application/json' : null
      },
      json: async () => ({ success: true, message: 'Mock response' })
    };
  };

  // Test Case 1: Your exact JSON structure with web_search in task
  console.log("\n🎯 Test Case 1: JSON with web_search in task array");
  const webSearchTaskJson = {
    "task": [{"action": "web_search","query": "YOUR SEARCH QUERY HERE","assigned_by": "ray"}],
    "assigned_by": "ray",
    "execute_immediately": true,
    "self_destruct": true
  };
  
  window.FetchSender.sendJSON(webSearchTaskJson).then(result => {
    console.log("✅ Web search task routing result:", result);
    
    if (capturedUrl && capturedUrl.includes('/web/search')) {
      console.log("🎉 SUCCESS: Web search task routed to /web/search endpoint!");
    } else if (capturedUrl && capturedUrl.includes('/tasks')) {
      console.log("⚠️ FALLBACK: Web search routed to /tasks endpoint (still works)");
    } else {
      console.log("❌ FAILED: Web search not routed correctly");
      console.log("🔍 Captured URL:", capturedUrl);
    }
    
    console.log("📋 Final data sent:", capturedData);
  }).catch(error => {
    console.error("❌ Web search task routing error:", error);
  });

  // Test Case 2: Direct action format (for comparison)
  setTimeout(() => {
    console.log("\n🎯 Test Case 2: Direct web_search action format");
    const directWebSearchJson = {
      "action": "web_search",
      "query": "YOUR SEARCH QUERY HERE",
      "assigned_by": "ray",
      "execute_immediately": true,
      "self_destruct": true
    };
    
    window.FetchSender.sendJSON(directWebSearchJson).then(result => {
      console.log("✅ Direct web search routing result:", result);
      
      if (capturedUrl && capturedUrl.includes('/web/search')) {
        console.log("🎉 SUCCESS: Direct web search routed to /web/search endpoint!");
      } else {
        console.log("❌ FAILED: Direct web search not routed correctly");
        console.log("🔍 Captured URL:", capturedUrl);
      }
      
      console.log("📋 Final data sent:", capturedData);
    }).catch(error => {
      console.error("❌ Direct web search routing error:", error);
    });
  }, 1000);

  // Restore original fetch after tests
  setTimeout(() => {
    window.fetch = originalFetch;
    console.log("🔄 Original fetch restored");
    
    console.log("\n✅ Web Search Routing Test Suite Complete!");
    console.log("\n💡 Your JSON structure should now route to /web/search endpoint");
  }, 2000);
}

// Auto-run if in browser environment
if (typeof window !== 'undefined') {
  testWebSearchRouting();
} else {
  console.log("📝 This test is designed to run in a browser console");
  console.log("💡 Copy and paste this into the browser console on a ChatGPT page");
}