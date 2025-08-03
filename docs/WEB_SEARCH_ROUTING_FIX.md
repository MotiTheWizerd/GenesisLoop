# Web Search Routing Fix

## Problem

Your JSON structure for web search wasn't reaching the server because:

```json
{
  "task": [
    {
      "action": "web_search",
      "query": "YOUR SEARCH QUERY HERE",
      "assigned_by": "ray"
    }
  ],
  "assigned_by": "ray",
  "execute_immediately": true,
  "self_destruct": true
}
```

The routing system was:

1. Detecting the `task` field and routing to `/tasks` endpoint
2. Not recognizing the nested `web_search` action
3. Missing the `web_search` action name in the routing configuration

## Solution Applied

### 1. Added `web_search` Action Route

Updated `js/utils/fetchSender.js` to include:

```javascript
actionRoutes: {
  // ... existing routes
  search: "web/search",
  web_search: "web/search", // Added support for web_search action name
}
```

### 2. Enhanced Task Routing Logic

Modified `sendJSONWithTaskRouting()` to handle single actions within tasks:

```javascript
// Check if task contains a single action that has a specific route
if (Array.isArray(jsonData.task) && jsonData.task.length === 1) {
  const taskItem = jsonData.task[0];
  if (taskItem.action && config.actionRoutes[taskItem.action]) {
    console.log(
      `🎯 FetchSender: Task contains single action '${taskItem.action}' - routing to specific endpoint`
    );

    // Extract the action data and route it directly
    const actionData = {
      ...taskItem,
      // Preserve any root-level metadata
      assigned_by: jsonData.assigned_by,
      execute_immediately: jsonData.execute_immediately,
      self_destruct: jsonData.self_destruct,
      timestamp: jsonData.timestamp || new Date().toISOString(),
    };

    return this.sendJSONWithAction(actionData, options);
  }
}
```

## How It Works Now

### Your JSON Structure

```json
{
  "task": [
    {
      "action": "web_search",
      "query": "YOUR SEARCH QUERY HERE",
      "assigned_by": "ray"
    }
  ],
  "assigned_by": "ray",
  "execute_immediately": true,
  "self_destruct": true
}
```

### Routing Flow

1. **Task Detection**: FetchSender detects `task` field
2. **Single Action Check**: Sees task contains single `web_search` action
3. **Route Lookup**: Finds `web_search` maps to `"web/search"`
4. **Data Transformation**: Extracts action data and preserves metadata:
   ```json
   {
     "action": "web_search",
     "query": "YOUR SEARCH QUERY HERE",
     "assigned_by": "ray",
     "execute_immediately": true,
     "self_destruct": true,
     "timestamp": "2025-01-03T..."
   }
   ```
5. **Endpoint Routing**: Sends to `http://localhost:8000/web/search`

## Alternative Formats Supported

### Direct Action Format

```json
{
  "action": "web_search",
  "query": "YOUR SEARCH QUERY HERE",
  "assigned_by": "ray"
}
```

Routes directly to `/web/search`

### Legacy Search Format

```json
{
  "action": "search",
  "query": "YOUR SEARCH QUERY HERE",
  "assigned_by": "ray"
}
```

Also routes to `/web/search`

## Testing

Run the test in browser console:

```javascript
// Load test_web_search_routing.js in browser console on ChatGPT page
```

## Server Requirements

Your server should handle:

```
POST /web/search
Content-Type: application/json

{
  "action": "web_search",
  "query": "search terms",
  "assigned_by": "ray",
  "execute_immediately": true,
  "self_destruct": true,
  "timestamp": "2025-01-03T..."
}
```

## Fallback Behavior

If the routing fails or the action isn't recognized, it will fall back to:

- `/tasks` endpoint with the original task structure
- Default endpoint for unrecognized formats

This ensures your web search requests will always reach the server, even if there are routing issues.
