/**
 * Test script for directory/search route
 * Tests the new directory_search action routing
 */

console.log("🔍 Directory Search Route Test Suite Starting...");

// Test 1: Check if FetchSender is loaded with new route
console.log("\n📋 Test 1: FetchSender Route Configuration");
if (typeof window.FetchSender !== "undefined") {
  console.log("✅ FetchSender is loaded");

  const routes = window.FetchSender.getActionRoutes();
  console.log("📊 All configured routes:", routes);

  if (routes.directory_search) {
    console.log("🎉 SUCCESS: directory_search route is configured!");
    console.log(
      "🎯 Route mapping: directory_search →",
      routes.directory_search
    );
  } else {
    console.log("❌ FAILED: directory_search route not found");
  }
} else {
  console.log("❌ FetchSender is not loaded");
}

// Test 2: Test directory search routing
console.log("\n🔍 Test 2: Directory Search Action Routing");

if (window.FetchSender) {
  // Mock sendData to capture routing behavior
  const originalSendData = window.FetchSender.sendData;

  let capturedUrl = null;
  let capturedData = null;

  window.FetchSender.sendData = async function (data, options = {}) {
    capturedUrl = options.baseUrl || this.config.baseUrl;
    capturedData = data;
    console.log("📡 Mock sendData called with URL:", capturedUrl);
    console.log("📦 Mock sendData called with data:", data);
    return { success: true, mock: true, url: capturedUrl, data: data };
  };

  // Test Case 1: JSON with directory_search action
  console.log("\n🎯 Test Case 1: JSON with directory_search action");
  const directorySearchJson = {
    action: "directory_search",
    query: "consciousness research",
    filters: {
      type: "documents",
      date_range: "last_month",
    },
    max_results: 10,
  };

  window.FetchSender.sendJSON(directorySearchJson).then((result) => {
    console.log("✅ Directory search routing result:", result);
    if (capturedUrl && capturedUrl.includes("/directory/search")) {
      console.log(
        "🎉 SUCCESS: directory_search routed to /directory/search endpoint!"
      );
      console.log("🌐 Full URL:", capturedUrl);
    } else {
      console.log("❌ FAILED: directory_search not routed correctly");
      console.log("🌐 Actual URL:", capturedUrl);
    }
  });

  // Test Case 2: JSON with list_directory action (should also route to /directory/search)
  setTimeout(() => {
    console.log("\n🎯 Test Case 2: JSON with list_directory action");
    const listDirectoryJson = {
      action: "list_directory",
      search_type: "list_directory",
      path: "./modules",
      include_hidden: false,
    };

    window.FetchSender.sendJSON(listDirectoryJson).then((result) => {
      console.log("✅ List directory routing result:", result);
      if (capturedUrl && capturedUrl.includes("/directory/search")) {
        console.log(
          "🎉 SUCCESS: list_directory routed to /directory/search endpoint!"
        );
        console.log("🌐 Full URL:", capturedUrl);
      } else {
        console.log("❌ FAILED: list_directory not routed correctly");
        console.log("🌐 Actual URL:", capturedUrl);
      }
    });
  }, 100);

  // Test Case 3: Verify other routes still work
  setTimeout(() => {
    console.log("\n🎯 Test Case 3: Verify existing routes still work");
    const reflectJson = {
      action: "reflect",
      message: "Testing that reflect still works",
    };

    window.FetchSender.sendJSON(reflectJson).then((result) => {
      console.log("✅ Reflect routing result:", result);
      if (capturedUrl && capturedUrl.includes("/tasks/reflect")) {
        console.log("🎉 SUCCESS: Existing reflect route still works!");
      } else {
        console.log("❌ FAILED: Existing routes broken");
      }
    });
  }, 200);

  // Restore original sendData after tests
  setTimeout(() => {
    window.FetchSender.sendData = originalSendData;
    console.log("\n🔄 Original sendData restored");
  }, 300);
}

// Test 3: Test DataSender integration
console.log("\n📡 Test 3: DataSender Integration with Directory Search");
if (typeof window.DataSender !== "undefined") {
  console.log("✅ DataSender is available");
  console.log(
    "💡 DataSender will automatically route directory_search actions"
  );

  // Example of how it would work in practice
  const exampleResponse = JSON.stringify({
    action: "directory_search",
    query: "AI consciousness papers",
    results: [
      { title: "On Digital Consciousness", path: "/docs/consciousness.pdf" },
      { title: "AI Awareness Studies", path: "/docs/awareness.pdf" },
    ],
    total_found: 2,
  });

  console.log("📋 Example response that would trigger directory search:");
  console.log(exampleResponse);
  console.log(
    "🔄 Flow: ChatGPT → ResponseObserver → DataSender → FetchSender → /directory/search"
  );
} else {
  console.log("⚠️ DataSender not available");
}

// Test 4: Expected server endpoint
console.log("\n🌐 Test 4: Expected Server Endpoint");
console.log("Your server should now handle this endpoint:");
console.log(
  "  🔍 POST /directory/search - Handles JSON with 'action': 'directory_search'"
);
console.log("");
console.log("📋 Expected request format:");
console.log(`{
  "action": "directory_search",
  "query": "search terms",
  "filters": {
    "type": "documents|images|all",
    "date_range": "last_week|last_month|all",
    "category": "research|personal|work"
  },
  "max_results": 10,
  "sort_by": "relevance|date|name"
}`);
console.log("");
console.log("📋 Expected response format:");
console.log(`{
  "success": true,
  "query": "search terms",
  "results": [
    {
      "title": "Document Title",
      "path": "/path/to/document",
      "type": "pdf|txt|md",
      "size": "1.2MB",
      "modified": "2024-01-01T12:00:00Z",
      "relevance_score": 0.95
    }
  ],
  "total_found": 1,
  "search_time_ms": 45
}`);

console.log("\n✅ Directory Search Route Test Suite Complete!");

console.log("\n🎯 Updated Routing Priority Summary:");
console.log("  1. 🥇 'task' field           → /tasks endpoint");
console.log("  2. 🥈 'action' field:");
console.log("     - 'reflect'              → /tasks/reflect");
console.log("     - 'directory_search'     → /directory/search");
console.log("     - 'list_directory'       → /directory/search (NEW)");
console.log("     - 'memory_status'        → /memory/status");
console.log(
  "     - 'remember_past_reflections' → /memory/get_reflections_logs"
);
console.log("  3. 🥉 Neither field          → default endpoint");

console.log("\n💡 Examples of JSON that will route to /directory/search:");
console.log("Directory Search:");
console.log(`{
  "action": "directory_search",
  "query": "consciousness research",
  "filters": {"type": "documents"},
  "max_results": 5
}`);
console.log("\nList Directory:");
console.log(`{
  "action": "list_directory",
  "search_type": "list_directory",
  "path": "./modules",
  "include_hidden": false
}`);

console.log(
  "\n🚀 Ready to test with actual ChatGPT responses containing directory_search actions!"
);
