# Technical Stack & Development Guidelines

## Tech Stack
- **Browser Extension**: Chrome Extension using Manifest V3
- **Frontend**: Vanilla JavaScript with modular IIFE architecture
- **Storage**: Chrome Storage API for response tracking
- **DOM Manipulation**: Custom utilities with MutationObserver
- **Architecture**: Modular component-based design

## Development Environment
- **Build System**: None (vanilla JS approach for simplicity)
- **Module System**: IIFE (Immediately Invoked Function Expression) pattern for browser compatibility
- **Dependencies**: No external frameworks - all custom utilities
- **Bundling**: Direct browser execution with script loading order management

## JavaScript Architecture

### Module Pattern
- **IIFE Pattern**: All modules use `(function() { ... })()` for encapsulation
- **Global Exposure**: Modules attach to `window` object for cross-module communication
- **Dependency Management**: Custom dependency loader with retry logic
- **Loading Order**: Managed through manifest.json script array

### Key Architectural Decisions
- **No ES6 Modules**: Avoided to prevent "Cannot use import statement outside a module" errors
- **No Build Step**: Keeps development simple and deployment straightforward  
- **Modular Design**: Split large files into focused, single-responsibility modules
- **Fallback Strategies**: Multiple approaches for critical operations (element finding, response detection)

## Browser Compatibility
- **Primary**: Chrome and Chromium-based browsers supporting Manifest V3
- **Firefox**: Would require adaptation for Manifest V2/V3 differences
- **Edge**: Should work with Chromium-based Edge
- **Safari**: Would require significant adaptation for Safari Web Extensions

## Development Commands

### Testing the Extension
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked" and select the extension directory
4. The extension should appear in your browser toolbar

### Debugging
- **Content Script**: Use Chrome DevTools on ChatGPT pages (F12)
- **Popup**: Right-click extension icon → "Inspect popup"
- **Background**: Check "Errors" button on extensions page
- **Console Logging**: Extension provides comprehensive logging with emojis for easy identification

### Expected Console Output
When working correctly, you should see:
```
✅ Constants loaded
✅ ResponseObserver loaded  
✅ ElementFinder loaded
✅ DebugUtils loaded
✅ DOMUtils initialized and attached to window
✅ ResponseTracker loaded
✅ DependencyLoader loaded
✅ MessageSender loaded
✅ ToggleButton loaded
✅ MessageLoop loaded
✅ All critical dependencies loaded successfully
```

### Reloading Changes
1. Click the refresh icon on the extension card in `chrome://extensions/`
2. Refresh the ChatGPT page to reload content scripts
3. Check console for any loading errors
4. Verify toggle button appears in top-right of ChatGPT interface

### Development Workflow
1. **Make Changes**: Edit JavaScript files in your preferred editor
2. **Reload Extension**: Refresh in chrome://extensions/
3. **Test**: Reload ChatGPT page and check console
4. **Debug**: Use browser DevTools for troubleshooting
5. **Iterate**: Repeat until functionality works as expected

### Common Development Tasks

#### Adding New DOM Utilities
1. Create new file in `js/utils/dom-utils/`
2. Use IIFE pattern with global exposure
3. Add to manifest.json script loading order
4. Update `dom-utils/index.js` to include new utility
5. Test loading and functionality

#### Modifying Response Detection
- Edit `js/utils/dom-utils/responseObserver.js`
- Test with different ChatGPT response types
- Verify timeout and fallback mechanisms work

#### Updating UI Element Detection  
- Modify `js/utils/dom-utils/elementFinder.js`
- Test with different ChatGPT interface states
- Ensure fallback strategies are robust

### Performance Considerations
- **Script Loading**: Minimize number of scripts in manifest
- **DOM Queries**: Cache frequently accessed elements
- **Observer Cleanup**: Properly disconnect MutationObservers
- **Memory Management**: Avoid memory leaks in long-running content scripts