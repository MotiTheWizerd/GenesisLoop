# FetchSender Utility Usage Guide

## Overview

The FetchSender utility provides a reusable, robust way to send data from the ChatGPT extension to external endpoints. It's designed to work seamlessly with your existing response extraction system.

## Basic Usage

### 1. Send Simple Data
```javascript
// Send basic data
const result = await window.FetchSender.sendData({
  message: "Hello from ChatGPT extension",
  timestamp: new Date().toISOString()
});

if (result.success) {
  console.log("Data sent successfully:", result.data);
} else {
  console.error("Failed to send data:", result.error);
}
```

### 2. Send ChatGPT Response
```javascript
// Convenience method for ChatGPT responses
const response = "This is ChatGPT's response...";
const result = await window.FetchSender.sendResponse(response, {
  conversationId: "12345",
  messageType: "assistant"
});
```

### 3. Send JSON Data
```javascript
// Send structured JSON
const jsonData = {
  status: "success",
  message: "Task completed",
  data: { count: 42 }
};

const result = await window.FetchSender.sendJSON(jsonData);
```

## Integration with Response Extraction

### Automatic Response Forwarding
```javascript
// Modify your response observer to automatically send responses
const observer = window.DOMUtils.waitForResponse(async (response) => {
  console.log("Response received:", response);
  
  // Store locally (existing functionality)
  window.ResponseTracker.addResponse(response);
  
  // Send to external server
  try {
    const result = await window.FetchSender.sendResponse(response, {
      source: "chatgpt_automation",
      sessionId: Date.now()
    });
    
    if (result.success) {
      console.log("✅ Response forwarded to server");
    } else {
      console.log("❌ Failed to forward response:", result.error);
    }
  } catch (error) {
    console.error("Error forwarding response:", error);
  }
});
```

### Integration with MessageLoop
```javascript
// In MessageLoop.js - modify the response callback
this.responseObserver = window.DOMUtils.waitForResponse(async (response) => {
  console.log("🎉 Response received in loop");
  
  // Existing functionality
  self.waitingForResponse = false;
  self.responseObserver = null;
  window.ResponseTracker.addResponse(response);
  
  // NEW: Send to external server
  if (window.FetchSender) {
    try {
      await window.FetchSender.sendResponse(response, {
        loopIteration: self.attemptCount,
        timestamp: new Date().toISOString()
      });
      console.log("📡 Response sent to external server");
    } catch (error) {
      console.error("Failed to send to external server:", error);
    }
  }
  
  // Continue loop
  if (self.isRunning) {
    setTimeout(() => {
      self.sendMessageAndWaitForResponse();
    }, 1000);
  }
});
```

## Configuration

### Update Base URL
```javascript
// Change the target server
window.FetchSender.updateConfig({
  baseUrl: 'http://localhost:3000/api/chatgpt',
  timeout: 15000,
  retries: 5
});
```

### Custom Headers
```javascript
// Send with authentication
const result = await window.FetchSender.sendData(data, {
  headers: {
    'Authorization': 'Bearer your-token-here',
    'X-API-Key': 'your-api-key'
  }
});
```

## Server Endpoint Examples

### Expected Request Format
Your localhost:8000 server should expect POST requests with JSON payloads:

```json
{
  "type": "chatgpt_response",
  "response": "ChatGPT's actual response text...",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "source": "chatgpt_automation",
  "sessionId": 1704110400000
}
```

### Simple Express.js Server Example
```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Enable CORS for localhost
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/', (req, res) => {
  console.log('Received data from ChatGPT extension:', req.body);
  
  // Process the data
  if (req.body.type === 'chatgpt_response') {
    console.log('ChatGPT Response:', req.body.response);
  }
  
  // Send response back
  res.json({
    status: 'success',
    message: 'Data received successfully',
    timestamp: new Date().toISOString()
  });
});

app.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});
```

## Error Handling

### Retry Logic
The FetchSender automatically retries failed requests:
- Default: 3 attempts with 1-second delays
- Configurable retry count and delay
- Automatic timeout handling (10 seconds default)

### Error Response Format
```javascript
{
  success: false,
  error: "Connection timeout",
  attempt: 3
}
```

## Testing

### Test Connection
```javascript
// Test if your server is reachable
const testResult = await window.FetchSender.testConnection();

if (testResult.success) {
  console.log("✅ Server is reachable");
} else {
  console.log("❌ Server connection failed:", testResult.error);
}
```

### Debug Mode
```javascript
// Enable detailed logging
window.FetchSender.updateConfig({
  debug: true
});
```

## Performance Considerations

1. **Non-blocking**: All requests are asynchronous and won't block the UI
2. **Timeout Protection**: Requests timeout after 10 seconds by default
3. **Retry Logic**: Failed requests are automatically retried
4. **Memory Efficient**: No persistent storage of request data

## Security Notes

1. **CORS**: Your server must handle CORS for browser requests
2. **Localhost Only**: Default configuration only sends to localhost
3. **No Sensitive Data**: Avoid sending authentication tokens in responses
4. **Rate Limiting**: Consider implementing rate limiting on your server

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your server sends proper CORS headers
2. **Connection Refused**: Check if your server is running on port 8000
3. **Timeout Errors**: Increase timeout for slow servers
4. **JSON Parse Errors**: Ensure your server returns valid JSON

### Debug Commands
```javascript
// Check if FetchSender is loaded
console.log(typeof window.FetchSender);

// Test basic functionality
window.FetchSender.testConnection().then(console.log);

// Check current configuration
console.log(window.FetchSender.config);
```