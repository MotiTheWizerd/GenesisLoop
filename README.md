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

## Recent Fixes

### Dependency Loading Issues

- ✅ Fixed ResponseTracker loading problems
- ✅ Added fallback mechanisms for missing dependencies
- ✅ Improved error handling and retry logic
- ✅ Enhanced debugging and logging
- ✅ Made ResponseTracker optional with automatic fallback creation

### Robustness Improvements

- ✅ Better script loading order management
- ✅ Graceful degradation when components fail to load
- ✅ Enhanced retry mechanisms with limits
- ✅ Comprehensive error logging

## Development

### Project Structure

```
/
├── icons/                  # Extension icon assets
├── js/                     # JavaScript modules
│   ├── components/         # UI and functional components
│   │   ├── MessageSender.js    # Handles sending messages to ChatGPT
│   │   ├── ToggleButton.js     # Creates and manages the toggle button
│   │   └── MessageLoop.js      # Manages the response-driven message loop
│   └── utils/              # Utility functions and helpers
│       ├── constants.js        # Application constants
│       ├── domUtils.js         # DOM manipulation utilities
│       ├── responseTracker.js  # Response storage and tracking
│       └── dependencyLoader.js # Dependency management
├── content.js              # Content script injected into ChatGPT pages
├── manifest.json           # Extension manifest configuration
├── popup.html              # Extension popup UI
└── popup.js                # Popup functionality
```

### Testing the Extension

After making changes:

1. Click the refresh icon on the extension card in `chrome://extensions/`
2. Reload the ChatGPT page
3. Check the browser console for debugging information
4. Look for these success messages:
   - ✅ Constants loaded
   - ✅ DOMUtils loaded
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
