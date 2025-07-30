/**
 * Quick test to verify list_directory action routes to /directory/search
 * This addresses the specific issue where list_directory was not being routed correctly
 */

console.log("🔧 List Directory Fix Verification Test");

// Test the specific case mentioned in the issue
if (typeof window.FetchSender !== 'undefined') {
  console.log("✅ FetchSender is available");
  
  // Check if list_directory route is configured
  const routes = window.FetchSender.getActionRoutes();
  console.log("📊 Current action routes:", routes);
  
  if (routes.list_directory === "directory/search") {
    console.log("🎉 SUCCESS: list_directory route is correctly configured!");
  } else {
    console.log("❌ FAILED: list_directory route not found or incorrect");
  }
  
  // Mock sendData to test the exact JSON from the issue
  const originalSendData = window.FetchSender.sendData;
  let capturedUrl = null;
  
  window.FetchSender.sendData = async function(data, options = {}) {
    capturedUrl = options.baseUrl || this.config.baseUrl;
    console.log("📡 Captured URL:", capturedUrl);
    console.log("📦 Captured data:", data);
    return { success: true, mock: true, url: capturedUrl };
  };
  
  // Test the exact JSON from the issue
  console.log("\n🧪 Testing the exact JSON from the issue:");
  const issueJson = {
    "action": "list_directory",
    "search_type": "list_directory", 
    "path": "./modules",
    "include_hidden": false
  };
  
  console.log("Input JSON:", JSON.stringify(issueJson, null, 2));
  
  window.FetchSender.sendJSON(issueJson).then(result => {
    console.log("✅ Result:", result);
    
    if (capturedUrl && capturedUrl.includes('/directory/search')) {
      console.log("🎉 SUCCESS: list_directory now routes to /directory/search!");
      console.log("🌐 Full URL:", capturedUrl);
      console.log("✅ The issue has been FIXED!");
    } else {
      console.log("❌ FAILED: Still not routing correctly");
      console.log("🌐 Actual URL:", capturedUrl);
    }
    
    // Restore original function
    window.FetchSender.sendData = originalSendData;
  });
  
} else {
  console.log("❌ FetchSender not available");
}

console.log("\n📋 Expected behavior:");
console.log("Before fix: list_directory → default endpoint (/)");
console.log("After fix:  list_directory → /directory/search");
console.log("\n🎯 This should resolve the routing issue!");