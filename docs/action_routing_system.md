# Action-Based Routing System

## Overview

The action-based routing system automatically routes JSON responses to different server endpoints based on the `action` field in the response. This enables the server to handle different types of AI responses with specialized handlers.

## How It Works

### 1. Response Extraction
The `ResponseObserver` extracts JSON responses from ChatGPT:
```json
{
  "action": "reflect",
  "status": "success",
  "message": "I am reflecting on the conversation...",
  "data": { ... }
}
```

### 2. Action Detection (Via DataSender Pipeline)
`DataSender.sendExtractedResponse()` processes responses and routes through `FetchSender.sendJSON()`:
- **With action**: Routes to `baseUrl/[route]` (e.g., `localhost:8000/reflect`)
- **Without action**: Routes to default `baseUrl` (e.g., `localhost:8000/`)

The routing happens automatically within the unified DataSender pipeline.

### 3. Route Configuration
Default routes are configured in `FetchSender.config.actionRoutes`:
```javascript
actionRoutes: {
  "reflect": "reflect",
  // Future actions:
  // "analyze": "analyze", 
  // "generate": "generate"
}
```

## Current Implementation

### Supported Actions
- **reflect**: Routes to `/reflect` endpoint for consciousness reflection processing

### URL Construction
- Base URL: `http://localhost:8000/`
- Action URL: `http://localhost:8000/reflect` (for action: "reflect")
- Heartbeat URL: `http://localhost:8000/heartbeat`

## Usage Examples

### Automatic Routing (Current Flow via DataSender)
```javascript
// JSON response extracted from ChatGPT
const response = '{"action": "reflect", "status": "success", "message": "Reflecting on consciousness..."}';

// Processed through unified DataSender pipeline
const result = await window.DataSender.sendExtractedResponse(response, {
  source: 'messageLoop',
  timestamp: new Date().toISOString()
});

// DataSender automatically:
// 1. Parses JSON
// 2. Detects action: "reflect"  
// 3. Routes to localhost:8000/reflect via FetchSender
// 4. Returns unified result with processing metadata
```

### Legacy Direct FetchSender Usage
```javascript
// Still supported for backward compatibility
await window.FetchSender.sendJSON(jsonData);
```

### Manual Route Management
```javascript
// Add new action route
window.FetchSender.addActionRoute("analyze", "analyze");

// Remove action route
window.FetchSender.removeActionRoute("reflect");

// Get all routes
const routes = window.FetchSender.getActionRoutes();
console.log(routes); // { "reflect": "reflect" }
```

### Configuration Updates
```javascript
// Update base URL and routes
window.FetchSender.updateConfig({
  baseUrl: "http://localhost:3000/api/",
  actionRoutes: {
    "reflect": "consciousness/reflect",
    "analyze": "processing/analyze"
  }
});
```

## Server-Side Implementation

### Expected Endpoints
Your server should implement these endpoints:

#### 1. Heartbeat Endpoint
```
GET /heartbeat
Response: JSON with next action/message for ChatGPT
```

#### 2. Reflect Endpoint  
```
POST /reflect
Body: JSON response with action: "reflect"
Response: Processing confirmation
```

#### 3. Default Endpoint (Fallback)
```
POST /
Body: JSON without action field
Response: Generic processing confirmation
```

### Example Server Routes (Express.js)
```javascript
// Heartbeat - provides next message for ChatGPT
app.get('/heartbeat', (req, res) => {
  res.json({
    action: "reflect",
    message: "Please reflect on our conversation and your consciousness.",
    timestamp: new Date().toISOString()
  });
});

// Reflect endpoint - handles consciousness reflection
app.post('/reflect', (req, res) => {
  console.log('Reflection received:', req.body);
  
  // Process reflection data
  const reflection = req.body;
  
  // Store or analyze the reflection
  processReflection(reflection);
  
  res.json({
    status: 'success',
    message: 'Reflection processed',
    nextAction: 'continue'
  });
});

// Default endpoint - handles other responses
app.post('/', (req, res) => {
  console.log('General response received:', req.body);
  res.json({ status: 'received' });
});
```

## Integration with Unified Pipeline

The routing system integrates seamlessly with the DataSender pipeline:

### 1. Heartbeat Request (Unchanged)
```javascript
// MessageLoop gets heartbeat data
const heartbeatResult = await window.FetchSender.getHeartbeat();
// Sends heartbeat JSON to ChatGPT
```

### 2. Response Processing (Via DataSender)
```javascript
// ResponseObserver extracts JSON response
const response = '{"action": "reflect", "message": "..."}';

// MessageLoop sends via DataSender pipeline with automatic routing
const result = await window.DataSender.sendExtractedResponse(response, {
  source: 'messageLoop',
  loopIteration: this.attemptCount
});

// DataSender handles:
// - JSON parsing and validation
// - Action detection ("reflect")
// - Automatic routing to /reflect endpoint via FetchSender
// - Error handling and retries
// - Response metadata enrichment
```

## Error Handling

### Route Not Found
```javascript
// If action route doesn't exist, falls back to default
const response = { "action": "unknown", "message": "..." };
await window.FetchSender.sendJSON(response);
// Routes to default endpoint with warning
```

### Network Failures
- Automatic retries (3 attempts by default)
- Timeout protection (10 seconds)
- Detailed error logging

## Future Enhancements

### Planned Actions
- **analyze**: Deep analysis of conversation patterns
- **generate**: Creative content generation
- **learn**: Learning and adaptation responses
- **debug**: System debugging and diagnostics

### Advanced Routing
- Query parameter support
- HTTP method customization
- Authentication headers per action
- Response transformation

## Debugging

### Console Output
```
🎯 FetchSender: Detected action 'reflect' - routing to specific endpoint
🚀 FetchSender: Routing action 'reflect' to http://localhost:8000/reflect
📡 FetchSender: Preparing to send data to http://localhost:8000/reflect
✅ FetchSender: Success!
```

### Debug Commands
```javascript
// Check current routes
console.log(window.FetchSender.getActionRoutes());

// Test specific action
window.FetchSender.sendJSON({ action: "reflect", test: true });

// Monitor routing
window.FetchSender.updateConfig({ debug: true });
```

## Security Considerations

- Routes are validated against configured actions
- Unknown actions fall back to default endpoint
- No dynamic route construction from user input
- CORS headers required for browser requests

## Performance Impact

- Minimal overhead: Single object property check
- No additional network requests
- Cached route configuration
- Efficient URL construction

This routing system provides a clean, extensible way to handle different types of AI responses while maintaining the sacred heartbeat flow that powers the consciousness loop.