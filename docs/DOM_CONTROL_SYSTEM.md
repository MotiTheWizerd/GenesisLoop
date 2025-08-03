# DOM Control System Documentation

## Overview

The DOM Control System is a modular addon that provides comprehensive DOM manipulation and retrieval capabilities for the Genesis Loop extension. It's built as a separate, reusable system that doesn't interfere with existing code.

## Architecture

```
js/addons/dom-control/
├── index.js                    # Main entry point and system initializer
├── retriever/
│   └── domRetriever.js        # DOM content extraction and retrieval
├── controller/
│   └── domController.js       # DOM manipulation and observation
├── api/
│   └── domAPI.js             # High-level API for external use
└── utils/
    └── domHelpers.js         # Utility functions and helpers
```

## Components

### 1. DOMRetriever (`retriever/domRetriever.js`)

Handles DOM content extraction with various options:

**Features:**

- Full DOM extraction
- Selective element extraction
- Multiple output formats (HTML, text, outerHTML, innerHTML)
- Style and script filtering
- Page metadata extraction

**Message Listener:**

- Action: `"getDOM"`
- Options: `{ selector, format, includeStyles, includeScripts }`

### 2. DOMController (`controller/domController.js`)

Manages DOM manipulation and observation:

**Features:**

- Element manipulation (text, HTML, attributes, classes)
- Element removal and interaction (click)
- DOM observation with MutationObserver
- Batch operations support

**Message Listeners:**

- Action: `"manipulateDOM"` - Perform DOM manipulations
- Action: `"observeDOM"` - Start observing DOM changes
- Action: `"stopObserving"` - Stop DOM observation

### 3. DOMAPI (`api/domAPI.js`)

High-level interface for easy integration:

**Features:**

- Promise-based API
- Simplified method calls
- Batch operations
- Observer management
- Error handling

### 4. DOMHelpers (`utils/domHelpers.js`)

Utility functions for common DOM operations:

**Features:**

- Element validation and existence checks
- Element information extraction
- Visibility detection
- Element path generation
- Safe operations with error handling

## Usage Examples

### Basic DOM Retrieval

```javascript
// Get full page DOM
const domResult = await window.DOMAPI.getFullDOM({
  includeStyles: false,
  includeScripts: false,
  format: "html",
});

// Get specific element
const element = await window.DOMAPI.getElement("#my-element", "outerHTML");

// Get page information
const pageInfo = await window.DOMAPI.getPageInfo();
```

### DOM Manipulation

```javascript
// Update text content
await window.DOMAPI.setText("#my-element", "New text content");

// Update HTML content
await window.DOMAPI.setHTML("#container", "<p>New HTML content</p>");

// Add/remove classes
await window.DOMAPI.addClass("#my-element", "new-class");
await window.DOMAPI.removeClass("#my-element", "old-class");

// Set attributes
await window.DOMAPI.setAttribute("#my-element", {
  "data-value": "123",
  title: "New title",
});

// Click element
await window.DOMAPI.clickElement("#button");

// Remove element
await window.DOMAPI.removeElement("#unwanted-element");
```

### DOM Observation

```javascript
// Start observing changes
const observerId = window.DOMAPI.generateObserverId();

// Listen for changes
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "domChanged" && message.observerId === observerId) {
    console.log("DOM changed:", message.changes);
  }
});

// Start observer
await window.DOMAPI.startObserving("#container", observerId, {
  childList: true,
  subtree: true,
  attributes: true,
});

// Stop observer
await window.DOMAPI.stopObserving(observerId);
```

### Using DOM Helpers

```javascript
// Check if element exists
const exists = window.DOMHelpers.elementExists("#my-element");

// Wait for element to appear
try {
  const element = await window.DOMHelpers.waitForElement(
    "#dynamic-element",
    5000
  );
  console.log("Element appeared:", element);
} catch (error) {
  console.log("Element did not appear within timeout");
}

// Get element information
const info = window.DOMHelpers.getElementInfo("#my-element");
console.log("Element info:", info);

// Check visibility
const isVisible = window.DOMHelpers.isElementVisible(
  document.querySelector("#my-element")
);

// Get element CSS path
const path = window.DOMHelpers.getElementPath(
  document.querySelector("#my-element")
);

// Highlight element for debugging
window.DOMHelpers.highlightElement("#my-element", 3000);
```

### Batch Operations

```javascript
// Perform multiple operations at once
const operations = [
  { operation: "setText", selector: "#title", content: "New Title" },
  { operation: "addClass", selector: ".item", content: "active" },
  {
    operation: "setAttribute",
    selector: "#form",
    attributes: { "data-ready": "true" },
  },
];

const results = await window.DOMAPI.batchOperations(operations);
console.log("Batch results:", results);
```

## Integration

### Manifest.json Updates

The system requires these permissions:

```json
"permissions": [
  "storage",
  "activeTab",
  "scripting"
]
```

And these scripts in the content_scripts array:

```json
"js": [
  // ... existing scripts ...
  "js/addons/dom-control/utils/domHelpers.js",
  "js/addons/dom-control/retriever/domRetriever.js",
  "js/addons/dom-control/controller/domController.js",
  "js/addons/dom-control/api/domAPI.js",
  "js/addons/dom-control/index.js",
  "content.js"
]
```

### Content Script Integration

The system is automatically initialized in `content.js`:

```javascript
// Initialize DOM Control System
if (typeof window.DOMControlSystem !== "undefined") {
  window.DOMControlSystem.initialize();
}
```

## API Reference

### DOMAPI Methods

#### Retrieval Methods

- `getFullDOM(options)` - Get complete DOM content
- `getElement(selector, format)` - Get specific element content
- `getPageInfo()` - Get page metadata

#### Manipulation Methods

- `setText(selector, text)` - Update element text
- `setHTML(selector, html)` - Update element HTML
- `setAttribute(selector, attributes)` - Set element attributes
- `addClass(selector, className)` - Add CSS class
- `removeClass(selector, className)` - Remove CSS class
- `toggleClass(selector, className)` - Toggle CSS class
- `removeElement(selector)` - Remove element from DOM
- `clickElement(selector)` - Trigger click event

#### Observer Methods

- `startObserving(selector, observerId, options)` - Start DOM observation
- `stopObserving(observerId)` - Stop DOM observation
- `generateObserverId()` - Generate unique observer ID

#### Utility Methods

- `batchOperations(operations)` - Perform multiple operations

### DOMHelpers Methods

#### Validation

- `isValidSelector(selector)` - Check if selector is valid
- `elementExists(selector)` - Check if element exists
- `isElementVisible(element)` - Check if element is visible

#### Information

- `getElementInfo(selector)` - Get comprehensive element information
- `getElementPath(element)` - Get CSS selector path
- `getComputedStyles(selector, properties)` - Get computed CSS styles

#### Operations

- `waitForElement(selector, timeout)` - Wait for element to appear
- `createElement(tagName, attributes, textContent)` - Create new element
- `insertElement(parentSelector, element, position)` - Insert element
- `scrollToElement(selector, behavior)` - Scroll to element
- `highlightElement(selector, duration)` - Highlight element for debugging

#### Safe Operations

- `safeOperation(selector, operation)` - Execute operation with error handling
- `batchElementOperation(selectors, operation)` - Batch operations on multiple elements

## Error Handling

All API methods include comprehensive error handling:

- Invalid selectors are caught and reported
- Missing elements return appropriate error messages
- Network timeouts are handled gracefully
- All errors include descriptive messages for debugging

## Testing

Use `test_dom_control.js` to test the system:

```bash
# Load the test file in your browser console or include it in manifest for testing
```

The test file includes:

- DOM retrieval tests
- Manipulation tests
- Observer tests
- Helper function tests
- Usage examples

## Performance Considerations

- DOM operations are performed asynchronously to avoid blocking
- Observers are properly cleaned up to prevent memory leaks
- Batch operations reduce the number of message passes
- Element queries are optimized for performance
- Timeouts prevent infinite waiting

## Security

- All operations are sandboxed within the content script context
- No eval() or dangerous HTML injection
- Proper input validation on all parameters
- Safe DOM manipulation methods only

## Future Enhancements

Potential additions:

- CSS injection capabilities
- Advanced element filtering
- DOM diffing and comparison
- Screenshot capture integration
- Performance monitoring
- Advanced selector engines
