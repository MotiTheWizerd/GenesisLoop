/**
 * Test script for web scrape routing
 * Tests the new web_scrape action routing within task structure
 * 
 * USAGE: Run this in the browser console on a ChatGPT page with the extension loaded
 */

console.log("🕷️ Web Scrape Routing Test Suite Starting...");

// Test function to run in browser console
function testWebScrapeRouting() {
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
      json: async () => ({ success: true, message: 'Mock scrape response', data: { title: 'Test Page', content: 'Mock content' } })
    };
  };

  // Test Case 1: Direct scrape action format
  console.log("\n🎯 Test Case 1: Direct scrape action format");
  const directScrapeJson = {
    "action": "scrape",
    "url": "https://example.com",
    "options": {
      "extract_text": true,
      "extract_links": false,
      "wait_for_load": true
    },
    "assigned_by": "ray",
    "execute_immediately": true,
    "self_destruct": true
  };
  
  window.FetchSender.sendJSON(directScrapeJson).then(result => {
    console.log("✅ Direct scrape routing result:", result);
    
    if (capturedUrl && capturedUrl.includes('/web/scrape')) {
      console.log("🎉 SUCCESS: Direct scrape routed to /web/scrape endpoint!");
    } else {
      console.log("❌ FAILED: Direct scrape not routed correctly");
      console.log("🔍 Captured URL:", capturedUrl);
    }
    
    console.log("📋 Final data sent:", capturedData);
  }).catch(error => {
    console.error("❌ Direct scrape routing error:", error);
  });

  // Test Case 2: web_scrape action format (alternative naming)
  setTimeout(() => {
    console.log("\n🎯 Test Case 2: web_scrape action format");
    const webScrapeJson = {
      "action": "web_scrape",
      "url": "https://example.com/page",
      "options": {
        "extract_text": true,
        "extract_images": true,
        "follow_redirects": true
      },
      "assigned_by": "ray",
      "execute_immediately": true,
      "self_destruct": true
    };
    
    window.FetchSender.sendJSON(webScrapeJson).then(result => {
      console.log("✅ Web scrape routing result:", result);
      
      if (capturedUrl && capturedUrl.includes('/web/scrape')) {
        console.log("🎉 SUCCESS: Web scrape routed to /web/scrape endpoint!");
      } else {
        console.log("❌ FAILED: Web scrape not routed correctly");
        console.log("🔍 Captured URL:", capturedUrl);
      }
      
      console.log("📋 Final data sent:", capturedData);
    }).catch(error => {
      console.error("❌ Web scrape routing error:", error);
    });
  }, 1000);

  // Test Case 3: Scrape action within task array
  setTimeout(() => {
    console.log("\n🎯 Test Case 3: Scrape action within task array");
    const scrapeTaskJson = {
      "task": [{"action": "scrape", "url": "https://example.com/article", "options": {"extract_text": true}, "assigned_by": "ray"}],
      "assigned_by": "ray",
      "execute_immediately": true,
      "self_destruct": true
    };
    
    window.FetchSender.sendJSON(scrapeTaskJson).then(result => {
      console.log("✅ Scrape task routing result:", result);
      
      if (capturedUrl && capturedUrl.includes('/web/scrape')) {
        console.log("🎉 SUCCESS: Scrape task routed to /web/scrape endpoint!");
      } else if (capturedUrl && capturedUrl.includes('/tasks')) {
        console.log("⚠️ FALLBACK: Scrape routed to /tasks endpoint (still works)");
      } else {
        console.log("❌ FAILED: Scrape task not routed correctly");
        console.log("🔍 Captured URL:", capturedUrl);
      }
      
      console.log("📋 Final data sent:", capturedData);
    }).catch(error => {
      console.error("❌ Scrape task routing error:", error);
    });
  }, 2000);

  // Test Case 4: Multiple scrape actions in task array (should go to /tasks)
  setTimeout(() => {
    console.log("\n🎯 Test Case 4: Multiple scrape actions in task array");
    const multipleScrapeTaskJson = {
      "task": [
        {"action": "scrape", "url": "https://example.com/page1", "assigned_by": "ray"},
        {"action": "scrape", "url": "https://example.com/page2", "assigned_by": "ray"}
      ],
      "assigned_by": "ray",
      "execute_immediately": true,
      "self_destruct": true
    };
    
    window.FetchSender.sendJSON(multipleScrapeTaskJson).then(result => {
      console.log("✅ Multiple scrape task routing result:", result);
      
      if (capturedUrl && capturedUrl.includes('/tasks')) {
        console.log("🎉 SUCCESS: Multiple scrape tasks routed to /tasks endpoint (correct behavior)!");
      } else {
        console.log("❌ FAILED: Multiple scrape tasks not routed correctly");
        console.log("🔍 Captured URL:", capturedUrl);
      }
      
      console.log("📋 Final data sent:", capturedData);
    }).catch(error => {
      console.error("❌ Multiple scrape task routing error:", error);
    });
  }, 3000);

  // Restore original fetch after tests
  setTimeout(() => {
    window.fetch = originalFetch;
    console.log("🔄 Original fetch restored");
    
    console.log("\n✅ Web Scrape Routing Test Suite Complete!");
    console.log("\n💡 Your JSON structure should now route to /web/scrape endpoint");
    console.log("\n📋 Supported formats:");
    console.log("   • Direct: {\"action\": \"scrape\", \"url\": \"...\"}");
    console.log("   • Alternative: {\"action\": \"web_scrape\", \"url\": \"...\"}");
    console.log("   • Task: {\"task\": [{\"action\": \"scrape\", \"url\": \"...\"}]}");
  }, 4000);
}

// Auto-run if in browser environment
if (typeof window !== 'undefined') {
  testWebScrapeRouting();
} else {
  console.log("📝 This test is designed to run in a browser console");
  console.log("💡 Copy and paste this into the browser console on a ChatGPT page");
}