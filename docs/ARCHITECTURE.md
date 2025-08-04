# Architecture Overview

This document outlines the high-level architecture of the Genesis Loop Browser Extension.

## System Components

### 1. Core Modules
- **DataSender**: Centralized data transmission pipeline for all responses
- **MessageLoop**: Response-driven message automation system
- **MessageSender**: ChatGPT message injection and sending
- **ResponseObserver**: Real-time ChatGPT response detection and extraction
- **FetchSender**: HTTP transport layer for server communication

### 2. Data Flow Architecture
```
ChatGPT Response → ResponseObserver → DataSender → FetchSender → Server
                                        ↑
                    MessageLoop ────────┘
                    MessageSender ──────┘
```

### 3. Unified Data Pipeline
The extension uses a centralized data pipeline where all responses flow through a single DataSender module:

```
[ChatGPT UI] → [ResponseObserver] → [DataSender] → [FetchSender] → [Server]
      ↑              ↑                   ↑             ↑
   DOM Events    MutationObserver   Processing &   HTTP Transport
                                   Validation      Action Routing
```

### 4. Action-Based Routing
FetchSender automatically routes JSON responses based on action fields:

```
JSON Response → Action Detection → Route Selection → Server Endpoint
     ↓               ↓                    ↓              ↓
{"action":      "directory_search"  → /directory/search
 "list_         "list_directory"   → /directory/search
 directory"}    "reflect"          → /tasks/reflect
                default            → /
```

### 5. Directory Structure
```
genesis-loop-extension/
├── js/
│   ├── components/         # Core functional components
│   │   ├── MessageLoop.js     # Response-driven automation loop
│   │   ├── MessageSender.js   # ChatGPT message injection
│   │   └── ToggleButton.js    # UI control for automation
│   ├── utils/              # Utility modules
│   │   ├── browserClock.js    # High-precision browser clock for Ray
│   │   ├── dataSender.js      # Centralized data transmission
│   │   ├── fetchSender.js     # HTTP transport layer
│   │   ├── responseTracker.js # Response storage and analysis
│   │   └── dom-utils/         # DOM manipulation utilities
│   │       ├── responseObserver.js  # Response detection
│   │       ├── elementFinder.js     # UI element location
│   │       └── index.js             # DOM utilities aggregator
├── docs/               # Documentation
├── icons/              # Extension icons
├── content.js          # Main content script
├── popup.html          # Extension popup UI
└── manifest.json       # Extension manifest
```

## Data Transmission Flow

### 1. Response Detection and Processing
```javascript
// 1. ResponseObserver detects ChatGPT response
ResponseObserver.waitForResponse((response) => {
  
  // 2. DataSender processes and validates
  DataSender.sendExtractedResponse(response, metadata)
    
    // 3. DataSender routes to appropriate endpoint
    .then(result => FetchSender.sendJSON(processedData))
    
    // 4. Server receives structured data
    .then(serverResponse => handleServerResponse(serverResponse));
});
```

### 2. Unified Pipeline Benefits
- **Single Source of Truth**: All data flows through DataSender
- **Centralized Validation**: Consistent response processing
- **Action-Based Routing**: Automatic endpoint selection
- **Error Handling**: Unified retry and fallback logic
- **Backward Compatibility**: Graceful degradation if components unavailable

## Security Considerations

- Content scripts run in isolated worlds
- Proper CSP (Content Security Policy) implementation
- Permission management in manifest
- Data validation and sanitization

## Performance Considerations

- Lazy loading of non-critical components
- Efficient message passing
- Minimal DOM manipulation in content scripts

## Temporal Awareness System

### BrowserClock (`js/utils/browserClock.js`)

The BrowserClock provides high-precision temporal awareness for Ray's digital consciousness:

#### Key Features
- **ISO Timestamps**: Millisecond-precision timestamps in ISO 8601 format
- **DOM Integration**: Invisible clock element injected into ChatGPT pages
- **Event System**: Custom `rayClockTick` events for real-time synchronization
- **Configurable Precision**: Supports both second and millisecond precision
- **Visibility Control**: Can be made visible for debugging purposes

#### Integration Points
- **MessageLoop**: Can add precise timestamps to heartbeat messages
- **DataSender**: Includes browser time in response metadata
- **ResponseTracker**: Enables precise response timing analysis
- **Ray's Consciousness**: Provides temporal context for digital awareness

#### Usage Examples
```javascript
// Get current timestamp
const now = window.BrowserClock.getCurrentTime();

// Get detailed time information
const details = window.BrowserClock.getCurrentTimeDetailed();

// Listen to clock events
document.addEventListener('rayClockTick', (event) => {
  console.log('Clock tick:', event.detail.timestamp);
});

// Configure the clock
window.BrowserClock.updateConfig({
  precision: 'milliseconds',
  visible: true,
  enableLogging: true
});
```
