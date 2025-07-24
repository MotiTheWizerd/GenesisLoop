# Genesis Loop - ChatGPT Automation Extension

A Chrome extension that automates interactions with ChatGPT by sending predefined messages and tracking responses.

## Features

- Automatically send test messages to ChatGPT
- Track and store responses for analysis
- Toggle automation on/off with a simple button
- Response-driven message loop (waits for ChatGPT to respond before sending next message)
- Robust dependency loading with fallback mechanisms
- Enhanced error handling and debugging

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked" and select the extension directory
5. The extension should appear in your browser toolbar

## Usage

1. Navigate to [ChatGPT](https://chat.openai.com/) or [ChatGPT](https://chatgpt.com/)
2. Look for the toggle button in the top-right corner of the page (▶️ Start Auto-Test)
3. Click the button to begin sending test messages
4. Click again to stop the automation (⏹️ Stop Auto-Test)
5. View collected responses by clicking the extension icon and then "View Responses"

## Recent Updates

### Modular DOM Utilities Architecture (Latest)

- ✅ **Restructured DOM utilities into modular components**
  - Split large domUtils.js into focused, reusable modules
  - Created dedicated responseObserver.js for response detection
  - Separated elementFinder.js for UI element location
  - Isolated debugUtils.js for debugging functionality
- ✅ **Converted ES6 modules to browser-compatible IIFE pattern**
  - Fixed "Cannot use import statement outside a module" errors
  - Maintained backward compatibility with existing code
  - Proper script loading order in manifest.json
- ✅ **Enhanced element detection with multiple fallback strategies**
  - Robust textarea and send button detection
  - Position-based element finding as fallback
  - SVG icon-based button identification
  - Comprehensive error handling and logging

### Dependency Loading System

- ✅ Fixed ResponseTracker loading problems
- ✅ Added fallback mechanisms for missing dependencies
- ✅ Improved error handling and retry logic
- ✅ Enhanced debugging and logging
- ✅ Made ResponseTracker optional with automatic fallback creation
- ✅ Smart dependency loading with proper module initialization order

### Robustness Improvements

- ✅ Better script loading order management
- ✅ Graceful degradation when components fail to load
- ✅ Enhanced retry mechanisms with limits
- ✅ Comprehensive error logging
- ✅ Modular architecture for easier maintenance and testing

## Architecture

### DOM Utilities Modular Design

The extension uses a modular approach for DOM manipulation, split into focused components:

#### ResponseObserver (`js/utils/dom-utils/responseObserver.js`)

- **Purpose**: Monitors ChatGPT for response completion
- **Key Features**:
  - Advanced MutationObserver implementation
  - Multiple detection strategies for different response types
  - JSON response parsing and validation
  - Timeout handling with fallback methods
  - Support for both text and structured responses

#### ElementFinder (`js/utils/dom-utils/elementFinder.js`)

- **Purpose**: Locates UI elements in the ChatGPT interface
- **Key Features**:
  - Multiple selector strategies for textarea detection
  - Robust send button finding with fallbacks
  - Position-based element detection
  - SVG icon-based button identification
  - Comprehensive error handling and logging

#### DebugUtils (`js/utils/dom-utils/debugUtils.js`)

- **Purpose**: Provides debugging and analysis tools
- **Key Features**:
  - Interactive element analysis
  - Message structure debugging
  - UI element inspection
  - Comprehensive logging for troubleshooting

#### Index (`js/utils/dom-utils/index.js`)

- **Purpose**: Main entry point that aggregates all DOM utilities
- **Key Features**:
  - Waits for all sub-modules to load
  - Creates unified DOMUtils interface
  - Maintains backward compatibility
  - Attaches utilities to global window object

### Module Loading Pattern

The extension uses IIFE (Immediately Invoked Function Expression) pattern instead of ES6 modules for browser compatibility:

```javascript
(function () {
  "use strict";

  // Module implementation
  function myFunction() {
    // Function logic
  }

  // Expose to global scope
  window.MyModule = {
    myFunction: myFunction,
  };

  console.log("✅ MyModule loaded");
})();
```

## Development

### Project Structure

```
/
├── .kiro/                  # Kiro AI assistant configuration
│   └── steering/           # Steering rules for AI assistance
├── icons/                  # Extension icon assets
│   ├── extension_icon_16x16.png
│   ├── extension_icon_48x48.png
│   └── extension_icon_128x128.png
├── js/                     # JavaScript modules
│   ├── components/         # UI and functional components
│   │   ├── MessageSender.js    # Handles sending messages to ChatGPT
│   │   ├── ToggleButton.js     # Creates and manages the toggle button
│   │   └── MessageLoop.js      # Manages the response-driven message loop
│   └── utils/              # Utility functions and helpers
│       ├── dom-utils/          # Modular DOM manipulation utilities
│       │   ├── index.js            # Main entry point - aggregates all DOM utilities
│       │   ├── responseObserver.js # Advanced response detection and monitoring
│       │   ├── elementFinder.js    # Robust UI element location with fallbacks
│       │   └── debugUtils.js       # Comprehensive debugging and analysis tools
│       ├── constants.js        # Application constants and configuration
│       ├── responseTracker.js  # Response storage and tracking system
│       └── dependencyLoader.js # Smart dependency management with retries
├── content.js              # Main content script injected into ChatGPT pages
├── manifest.json           # Extension manifest configuration (Manifest V3)
├── popup.html              # Extension popup UI
└── README.md               # This documentation file
```

### Testing the Extension

After making changes:

1. Click the refresh icon on the extension card in `chrome://extensions/`
2. Reload the ChatGPT page
3. Check the browser console for debugging information
4. Look for these success messages:
   - ✅ Constants loaded
   - ✅ ResponseObserver loaded
   - ✅ ElementFinder loaded
   - ✅ DebugUtils loaded
   - ✅ DOMUtils initialized and attached to window
   - ✅ ResponseTracker loaded (or fallback created)
   - ✅ DependencyLoader loaded
   - ✅ MessageSender loaded
   - ✅ ToggleButton loaded
   - ✅ MessageLoop loaded
   - ✅ All critical dependencies loaded successfully

### Console Debugging

The extension provides detailed console logging:

- 🚀 Initialization messages
- ✅ Success indicators
- ⚠️ Warnings for non-critical issues
- ❌ Error messages for critical failures
- 📝 Response tracking confirmations
- 🔧 Fallback mechanism activations

## Troubleshooting

### Common Issues

1. **Toggle button doesn't appear**

   - Check console for dependency loading errors
   - Ensure you're on chat.openai.com or chatgpt.com
   - Try refreshing the page after a few seconds

2. **Dependencies not loading**

   - The extension now has fallback mechanisms
   - Check for "✅ All critical dependencies loaded" in console
   - Optional dependencies (like ResponseTracker) will use fallbacks

3. **Messages not sending**
   - Check if ChatGPT's UI has changed
   - Look for DOM element detection errors in console
   - The extension will retry with multiple approaches

### Debug Information

Open browser console (F12) and look for:

- Dependency loading

- DOM element detection results
- Message sending attempts
- Response detection confirmations

## License

MIT
