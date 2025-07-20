# Technical Stack & Development Guidelines

## Tech Stack
- **Browser Extension**: Chrome Extension using Manifest V3
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Storage**: Chrome Storage API

## Development Environment
- No specific build system identified (vanilla JS approach)
- No external dependencies or frameworks currently used
- No bundler or transpiler setup (direct browser execution)

## Browser Compatibility
- Chrome and Chromium-based browsers supporting Manifest V3
- Firefox compatibility would require adaptation for Manifest V2/V3 differences

## Development Commands
Since this is a simple browser extension without a build system:

### Testing the Extension
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked" and select the extension directory
4. The extension should appear in your browser toolbar

### Debugging
- Right-click the extension icon and select "Inspect popup" to debug the popup
- Use Chrome DevTools on ChatGPT pages to debug content script execution
- Check the "Errors" button on the extensions page for any loading errors

### Reloading Changes
- Click the refresh icon on the extension card in `chrome://extensions/` after making changes
- For content script changes, you may need to refresh the target page as well