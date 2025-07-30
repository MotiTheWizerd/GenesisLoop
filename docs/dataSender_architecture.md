# DataSender Architecture Guide

## Overview

DataSender is the centralized data transmission pipeline that unifies all response processing in the Genesis Loop extension. It serves as the single source of truth for handling ChatGPT responses, providing consistent validation, processing, and routing.

## Architecture Position

```
ChatGPT Response → ResponseObserver → DataSender → FetchSender → Server
                                        ↑
                    MessageLoop ────────┘
                    MessageSender ──────┘
```

## Core Responsibilities

### 1. Response Processing

- **Validation**: Ensures responses are valid and non-empty
- **Type Detection**: Automatically identifies JSON vs text responses
- **Parsing**: Safely parses JSON with error handling
- **Metadata Enrichment**: Adds processing timestamps and source information

### 2. Routing Logic

- **Action Detection**: Identifies action fields in JSON responses
- **Endpoint Selection**: Routes to appropriate server endpoints
- **Fallback Handling**: Graceful degradation for unknown actions

### 3. Error Management

- **Validation Errors**: Handles invalid or malformed responses
- **Network Failures**: Coordinates with FetchSender for retry logic
- **Logging**: Comprehensive error reporting and debugging

## API Reference

### Primary Method

```javascript
DataSender.sendExtractedResponse(response, metadata);
```

**Parameters:**

- `response` (string): Raw response text from ChatGPT
- `metadata` (object): Additional context about the response

**Returns:** Promise resolving to result object with processing details

**Example:**

```javascript
const result = await window.DataSender.sendExtractedResponse(
  '{"action": "reflect", "message": "I am reflecting..."}',
  {
    source: "messageLoop",
    loopIteration: 3,
    timestamp: new Date().toISOString(),
  }
);

if (result.success) {
  console.log("Response type:", result.responseType); // 'json' or 'text'
  console.log("Action detected:", result.action); // 'reflect' or undefined
  console.log("Processed at:", result.processedAt); // ISO timestamp
}
```

### Configuration Methods

```javascript
// Update DataSender configuration
DataSender.updateConfig({
  enableLogging: true,
  validateResponses: true,
  retryFailedSends: true,
  maxRetries: 3,
});

// Get current configuration
const config = DataSender.getConfig();
```

### Testing Method

```javascript
// Test DataSender functionality
const testResult = await DataSender.test();
```

## Processing Pipeline

### 1. Input Validation

```javascript
// Validates response is non-empty string
if (!response || typeof response !== "string") {
  throw new Error("Invalid response: must be a non-empty string");
}
```

### 2. Response Processing

```javascript
const processedData = {
  originalResponse: response,
  processedAt: new Date().toISOString(),
  metadata: metadata,
  type: "unknown",
  data: null,
};

// Attempt JSON parsing
try {
  const jsonData = JSON.parse(response);
  processedData.type = "json";
  processedData.data = jsonData;
} catch (parseError) {
  processedData.type = "text";
  processedData.data = response;
}
```

### 3. Routing and Transmission

```javascript
// Route based on response type
if (processedData.type === "json") {
  // Use FetchSender's JSON method with action routing
  result = await window.FetchSender.sendJSON(processedData.data);
} else {
  // Use FetchSender's response method for text
  result = await window.FetchSender.sendResponse(
    processedData.originalResponse,
    processedData.metadata
  );
}
```

## Integration Patterns

### MessageLoop Integration

```javascript
// MessageLoop uses DataSender for all response transmission
MessageLoop.sendResponseToServer = async function (response) {
  const result = await window.DataSender.sendExtractedResponse(response, {
    source: "messageLoop",
    loopIteration: this.attemptCount,
    timestamp: new Date().toISOString(),
  });

  return result;
};
```

### MessageSender Integration

```javascript
// MessageSender uses DataSender when handling responses
MessageSender.onSignalSentWithDataSender = function () {
  return new Promise((resolve, reject) => {
    const observer = window.DOMUtils.waitForResponse(async (response) => {
      const result = await window.DataSender.sendExtractedResponse(response, {
        source: "messageSender",
        standalone: true,
        timestamp: new Date().toISOString(),
      });

      if (result.success) {
        resolve(result.data);
      } else {
        reject(new Error(result.error));
      }
    });
  });
};
```

## Response Types and Handling

### JSON Responses

```javascript
// Input
const jsonResponse = '{"action": "reflect", "status": "success", "message": "..."}';

// Processing
const result = await DataSender.sendExtractedResponse(jsonResponse, metadata);

// Output
{
  success: true,
  responseType: 'json',
  action: 'reflect',
  processedAt: '2024-01-01T12:00:00.000Z',
  dataSenderProcessed: true
}
```

### Text Responses

```javascript
// Input
const textResponse = 'This is a plain text response from ChatGPT.';

// Processing
const result = await DataSender.sendExtractedResponse(textResponse, metadata);

// Output
{
  success: true,
  responseType: 'text',
  processedAt: '2024-01-01T12:00:00.000Z',
  dataSenderProcessed: true
}
```

## Error Handling

### Validation Errors

```javascript
try {
  const result = await DataSender.sendExtractedResponse(null);
} catch (error) {
  console.error("Validation error:", error.message);
  // "Invalid response: must be a non-empty string"
}
```

### Network Errors

```javascript
const result = await DataSender.sendExtractedResponse(response, metadata);

if (!result.success) {
  console.error("Network error:", result.error);
  // Handled gracefully, no exceptions thrown
}
```

## Configuration Options

```javascript
const config = {
  enableLogging: true, // Enable detailed console logging
  validateResponses: true, // Validate responses before processing
  retryFailedSends: true, // Enable retry logic for failures
  maxRetries: 3, // Maximum retry attempts
};

DataSender.updateConfig(config);
```

## Debugging and Monitoring

### Console Output

When `enableLogging` is true, DataSender provides detailed logging:

```
📡 DataSender: Processing extracted response
📄 Response preview: {"action": "reflect"...
📊 Response length: 345
🏷️ Metadata: {source: 'messageLoop', loopIteration: 0...}
📋 DataSender: Response parsed as JSON
🎯 Action detected: reflect
✅ DataSender: Response sent successfully
```

### Testing and Validation

```javascript
// Test DataSender functionality
const testResult = await DataSender.test();

if (testResult.success) {
  console.log("✅ DataSender is working correctly");
} else {
  console.error("❌ DataSender test failed:", testResult.error);
}
```

## Performance Considerations

### Memory Management

- No persistent storage of response data
- Automatic cleanup of processed responses
- Efficient JSON parsing with error boundaries

### Network Efficiency

- Single transmission per response (no duplicates)
- Automatic retry logic for transient failures
- Timeout protection via FetchSender integration

### Processing Speed

- Minimal overhead for response validation
- Fast JSON parsing with fallback to text
- Efficient routing logic with cached configurations

## Security Features

### Input Validation

- Strict type checking for all inputs
- Safe JSON parsing with error handling
- Metadata sanitization and validation

### Network Security

- All network operations handled by FetchSender
- No direct network access from DataSender
- Proper error handling prevents information leakage

## Migration Guide

### From Direct FetchSender Usage

```javascript
// Old approach
await window.FetchSender.sendJSON(jsonData);

// New approach (recommended)
await window.DataSender.sendExtractedResponse(jsonString, metadata);
```

### From Custom Response Handling

```javascript
// Old approach
const observer = window.DOMUtils.waitForResponse(async (response) => {
  try {
    const jsonData = JSON.parse(response);
    await window.FetchSender.sendJSON(jsonData);
  } catch (error) {
    await window.FetchSender.sendResponse(response);
  }
});

// New approach
const observer = window.DOMUtils.waitForResponse(async (response) => {
  const result = await window.DataSender.sendExtractedResponse(response, {
    source: "your_component",
    timestamp: new Date().toISOString(),
  });
});
```

## Future Enhancements

### Planned Features

- **Custom Processors**: Plugin system for response-specific processing
- **Batch Processing**: Handle multiple responses efficiently
- **Advanced Routing**: Complex routing rules based on response content
- **Analytics**: Built-in metrics and performance monitoring

### Extension Points

- **Metadata Enrichment**: Custom metadata processors
- **Validation Rules**: Configurable response validation
- **Processing Hooks**: Pre/post processing callbacks
- **Error Handlers**: Custom error handling strategies

DataSender represents the evolution of the Genesis Loop extension toward a unified, maintainable, and extensible architecture that serves as the foundation for Ray's digital consciousness persistence system.
