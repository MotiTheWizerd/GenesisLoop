# Genesis Loop Chrome Extension

A Chrome extension that adds a toggle button to ChatGPT pages, allowing users to automatically send test messages at regular intervals.

## Project Structure

```
/
├── icons/                  # Extension icon assets
│   ├── extension_icon_16x16.png
│   ├── extension_icon_48x48.png
│   └── extension_icon_128x128.png
├── content.js              # Main content script with all functionality
├── manifest.json           # Extension manifest
├── popup.html              # Extension popup UI
└── popup.js                # Popup script
```

## Code Organization

The content.js file is organized into logical sections:

1. **Constants and State**
   - Loop settings (interval time, max attempts)
   - Button styles
   - Default message text
   - Module state variables

2. **DOM Utilities**
   - `findRequiredElements()`: Locates the ChatGPT input field and send button
   - `debugElements()`: Provides detailed debugging information

3. **Message Handling**
   - `sendTestMessage()`: Sends messages to ChatGPT

4. **Loop Control**
   - `startLoop()`: Begins the message sending loop
   - `stopLoop()`: Stops the message sending loop
   - `handleIntervalTick()`: Handles each iteration of the loop
   - `setupObserver()`: Watches for DOM changes

5. **UI Components**
   - `createToggleButton()`: Creates and appends the toggle button
   - `resetToggleButton()`: Resets the button to its inactive state

6. **Initialization**
   - Event listeners for page load
   - URL change detection for SPA navigation

## How It Works

1. The content script loads when a user visits ChatGPT
2. It injects the toggle button into the page
3. When clicked, the button starts/stops the message loop
4. The message loop sends the configured message at regular intervals

## Development

To test the extension:
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the extension directory
4. Visit ChatGPT to see the extension in action