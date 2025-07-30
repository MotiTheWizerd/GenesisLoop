# DOM Control System - Usage Guide

## 🚀 Quick Start

The DOM Control System is automatically loaded when your extension runs on ChatGPT pages. You can start using it immediately in your content scripts, popup, or background scripts.

### Verify Installation
Check the browser console on a ChatGPT page for these messages:
```
✅ DOMHelpers loaded
✅ DOMRetriever loaded  
✅ DOMController loaded
✅ DOMAPI loaded
✅ DOMControlSystem loaded
🧱 Initializing DOM Control System...
✅ DOM Control System initialized successfully
```

## 📖 Basic Usage Patterns

### 1. Getting DOM Content

#### Get Full Page HTML
```javascript
// Basic usage - get entire page
const result = await window.DOMAPI.getFullDOM();
console.log('Page HTML:', result.dom);

// With options - clean HTML without styles/scripts
const cleanResult = await window.DOMAPI.getFullDOM({
  includeStyles: false,
  includeScripts: false,
  format: 'html'
});
```

#### Get Specific Elements
```javascript
// Get element by selector
const titleElement = await window.DOMAPI.getElement('title', 'text');
console.log('Page title:', titleElement.dom);

// Get ChatGPT message container
const chatContainer = await window.DOMAPI.getElement('[role="main"]', 'outerHTML');

// Get multiple formats
const elementHTML = await window.DOMAPI.getElement('#my-element', 'outerHTML');
const elementText = await window.DOMAPI.getElement('#my-element', 'text');
const elementInner = await window.DOMAPI.getElement('#my-element', 'innerHTML');
```

#### Get Page Information
```javascript
const pageInfo = await window.DOMAPI.getPageInfo();
console.log('Page info:', {
  title: pageInfo.title,
  url: pageInfo.url,
  domain: pageInfo.domain,
  timestamp: pageInfo.timestamp
});
```

### 2. DOM Manipulation

#### Text and HTML Updates
```javascript
// Update text content
await window.DOMAPI.setText('#my-element', 'New text content');

// Update HTML content
await window.DOMAPI.setHTML('#container', '<p>New paragraph</p><span>New span</span>');

// Update ChatGPT input (example)
await window.DOMAPI.setText('#prompt-textarea', 'Hello ChatGPT!');
```

#### CSS Class Management
```javascript
// Add classes
await window.DOMAPI.addClass('#my-element', 'active');
await window.DOMAPI.addClass('.buttons', 'highlighted');

// Remove classes
await window.DOMAPI.removeClass('#my-element', 'inactive');

// Toggle classes
await window.DOMAPI.toggleClass('#toggle-button', 'pressed');
```

#### Attribute Management
```javascript
// Set single attribute
await window.DOMAPI.setAttribute('#my-input', { 'placeholder': 'Enter text here' });

// Set multiple attributes
await window.DOMAPI.setAttribute('#my-element', {
  'data-id': '123',
  'title': 'Tooltip text',
  'aria-label': 'Accessible label'
});
```

#### Element Interaction
```javascript
// Click elements
await window.DOMAPI.clickElement('#submit-button');
await window.DOMAPI.clickElement('[data-testid="send-button"]');

// Remove elements
await window.DOMAPI.removeElement('#unwanted-popup');
await window.DOMAPI.removeElement('.advertisement');
```

### 3. DOM Observation

#### Basic Observer Setup
```javascript
// Generate unique observer ID
const observerId = window.DOMAPI.generateObserverId();

// Listen for DOM changes
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'domChanged' && message.observerId === observerId) {
    console.log('DOM changed:', message.changes);
    
    // Handle specific change types
    message.changes.forEach(change => {
      if (change.type === 'childList') {
        console.log('Children added/removed:', change.addedNodes, change.removedNodes);
      }
      if (change.type === 'attributes') {
        console.log('Attribute changed:', change.attributeName);
      }
    });
  }
});

// Start observing
await window.DOMAPI.startObserving('#chat-container', observerId);
```

#### Advanced Observer Options
```javascript
// Observe with specific options
await window.DOMAPI.startObserving('#my-container', observerId, {
  childList: true,        // Watch for added/removed children
  subtree: true,          // Watch entire subtree
  attributes: true,       // Watch attribute changes
  attributeOldValue: true, // Include old attribute values
  characterData: true,    // Watch text content changes
  characterDataOldValue: true // Include old text values
});

// Stop observing when done
await window.DOMAPI.stopObserving(observerId);
```

### 4. Using DOM Helpers

#### Element Validation and Existence
```javascript
// Check if selector is valid
const isValid = window.DOMHelpers.isValidSelector('#my-element');
console.log('Selector valid:', isValid);

// Check if element exists
const exists = window.DOMHelpers.elementExists('#my-element');
console.log('Element exists:', exists);

// Check if element is visible
const element = document.querySelector('#my-element');
const isVisible = window.DOMHelpers.isElementVisible(element);
console.log('Element visible:', isVisible);
```

#### Waiting for Dynamic Elements
```javascript
// Wait for element to appear (useful for dynamic content)
try {
  const element = await window.DOMHelpers.waitForElement('#dynamic-content', 5000);
  console.log('Element appeared:', element);
  
  // Now you can work with the element
  await window.DOMAPI.setText('#dynamic-content', 'Content loaded!');
} catch (error) {
  console.log('Element did not appear within 5 seconds');
}
```

#### Element Information
```javascript
// Get comprehensive element information
const info = window.DOMHelpers.getElementInfo('#my-element');
console.log('Element info:', {
  tagName: info.tagName,
  id: info.id,
  className: info.className,
  textContent: info.textContent,
  attributes: info.attributes,
  position: info.position,
  visible: info.visible
});

// Get element's CSS selector path
const element = document.querySelector('#my-element');
const path = window.DOMHelpers.getElementPath(element);
console.log('Element path:', path);
```

#### Element Creation and Insertion
```javascript
// Create new element
const newElement = window.DOMHelpers.createElement('div', {
  'id': 'my-new-element',
  'class': 'custom-element',
  'data-value': '123'
}, 'Element content');

// Insert element
const inserted = window.DOMHelpers.insertElement('#container', newElement, 'append');
console.log('Element inserted:', inserted);

// Other insertion positions: 'prepend', 'before', 'after'
```

### 5. Batch Operations

#### Multiple DOM Operations
```javascript
// Define multiple operations
const operations = [
  { operation: 'setText', selector: '#title', content: 'New Title' },
  { operation: 'setText', selector: '#subtitle', content: 'New Subtitle' },
  { operation: 'addClass', selector: '.item', content: 'active' },
  { operation: 'setAttribute', selector: '#form', attributes: { 'data-ready': 'true' } },
  { operation: 'removeClass', selector: '.old-style', content: 'deprecated' }
];

// Execute all operations
const results = await window.DOMAPI.batchOperations(operations);

// Check results
results.forEach((result, index) => {
  if (result.success) {
    console.log(`Operation ${index + 1} succeeded:`, result.result);
  } else {
    console.log(`Operation ${index + 1} failed:`, result.error);
  }
});
```

## 🎯 Real-World Examples

### Example 1: ChatGPT Message Monitoring
```javascript
// Monitor for new ChatGPT responses
const observerId = window.DOMAPI.generateObserverId();

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'domChanged' && message.observerId === observerId) {
    // Check if new assistant messages were added
    message.changes.forEach(change => {
      if (change.type === 'childList' && change.addedNodes > 0) {
        console.log('New content detected in chat');
        
        // Extract latest response
        window.DOMAPI.getElement('[data-message-author-role="assistant"]:last-child', 'text')
          .then(result => {
            console.log('Latest AI response:', result.dom);
          });
      }
    });
  }
});

// Start monitoring the chat container
await window.DOMAPI.startObserving('[role="main"]', observerId);
```

### Example 2: Auto-fill ChatGPT Input
```javascript
// Function to send message to ChatGPT
async function sendMessageToChatGPT(message) {
  try {
    // Wait for input to be available
    await window.DOMHelpers.waitForElement('#prompt-textarea', 3000);
    
    // Set the message
    await window.DOMAPI.setText('#prompt-textarea', message);
    
    // Wait a moment for the UI to update
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Click send button
    await window.DOMAPI.clickElement('[data-testid="send-button"]');
    
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}

// Usage
sendMessageToChatGPT('Hello, how can you help me today?');
```

### Example 3: Page Content Extraction
```javascript
// Extract all important content from a page
async function extractPageContent() {
  try {
    // Get page info
    const pageInfo = await window.DOMAPI.getPageInfo();
    
    // Get main content
    const mainContent = await window.DOMAPI.getElement('main', 'text');
    
    // Get all headings
    const headings = window.DOMHelpers.getAllElements('h1, h2, h3, h4, h5, h6')
      .map(h => ({ level: h.tagName, text: h.textContent }));
    
    // Get all links
    const links = window.DOMHelpers.getAllElements('a[href]')
      .map(a => ({ text: a.textContent, url: a.href }));
    
    return {
      pageInfo,
      mainContent: mainContent.dom,
      headings,
      links
    };
  } catch (error) {
    console.error('Content extraction failed:', error);
    return null;
  }
}

// Usage
const content = await extractPageContent();
console.log('Extracted content:', content);
```

### Example 4: Dynamic UI Enhancement
```javascript
// Add custom UI elements to ChatGPT
async function enhanceChatGPTUI() {
  try {
    // Wait for the main container
    await window.DOMHelpers.waitForElement('[role="main"]', 5000);
    
    // Create custom toolbar
    const toolbar = window.DOMHelpers.createElement('div', {
      'id': 'custom-toolbar',
      'style': 'position: fixed; top: 10px; right: 10px; background: #f0f0f0; padding: 10px; border-radius: 5px; z-index: 9999;'
    });
    
    // Add buttons to toolbar
    const saveButton = window.DOMHelpers.createElement('button', {
      'id': 'save-conversation',
      'style': 'margin-right: 5px; padding: 5px 10px;'
    }, 'Save Chat');
    
    const clearButton = window.DOMHelpers.createElement('button', {
      'id': 'clear-conversation',
      'style': 'padding: 5px 10px;'
    }, 'Clear');
    
    toolbar.appendChild(saveButton);
    toolbar.appendChild(clearButton);
    
    // Insert toolbar into page
    document.body.appendChild(toolbar);
    
    // Add click handlers
    saveButton.addEventListener('click', async () => {
      const chatContent = await window.DOMAPI.getElement('[role="main"]', 'text');
      console.log('Saving conversation:', chatContent.dom);
      // Add your save logic here
    });
    
    clearButton.addEventListener('click', async () => {
      // Add your clear logic here
      console.log('Clearing conversation');
    });
    
    console.log('UI enhanced successfully');
  } catch (error) {
    console.error('UI enhancement failed:', error);
  }
}

// Usage
enhanceChatGPTUI();
```

## 🛠️ Advanced Usage

### Error Handling
```javascript
// Always wrap DOM operations in try-catch
async function safeDOMOperation() {
  try {
    const result = await window.DOMAPI.setText('#my-element', 'New text');
    console.log('Success:', result);
  } catch (error) {
    console.error('DOM operation failed:', error.message);
    
    // Handle specific error types
    if (error.message.includes('Element not found')) {
      console.log('Element does not exist, creating it...');
      // Create element logic here
    }
  }
}
```

### Performance Optimization
```javascript
// Check element existence before operations
if (window.DOMHelpers.elementExists('#my-element')) {
  await window.DOMAPI.setText('#my-element', 'New text');
} else {
  console.log('Element not found, skipping operation');
}

// Use batch operations for multiple changes
const operations = [
  { operation: 'setText', selector: '#elem1', content: 'Text 1' },
  { operation: 'setText', selector: '#elem2', content: 'Text 2' },
  { operation: 'setText', selector: '#elem3', content: 'Text 3' }
];

// More efficient than individual operations
const results = await window.DOMAPI.batchOperations(operations);
```

### Debugging
```javascript
// Highlight elements for debugging
window.DOMHelpers.highlightElement('#my-element', 3000);

// Get detailed element information
const info = window.DOMHelpers.getElementInfo('#my-element');
console.log('Debug info:', info);

// Log all elements matching a selector
const elements = window.DOMHelpers.getAllElements('.my-class');
console.log('Found elements:', elements.length);
```

## 🚨 Common Pitfalls and Solutions

### 1. Element Not Found
```javascript
// Problem: Element doesn't exist yet
// Solution: Wait for element or check existence

// Bad
await window.DOMAPI.setText('#dynamic-element', 'text'); // May fail

// Good
try {
  await window.DOMHelpers.waitForElement('#dynamic-element', 3000);
  await window.DOMAPI.setText('#dynamic-element', 'text');
} catch (error) {
  console.log('Element never appeared');
}
```

### 2. Timing Issues
```javascript
// Problem: DOM operations happen too fast
// Solution: Add delays or wait for specific conditions

// Bad
await window.DOMAPI.setText('#input', 'text');
await window.DOMAPI.clickElement('#submit'); // May click before text is set

// Good
await window.DOMAPI.setText('#input', 'text');
await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
await window.DOMAPI.clickElement('#submit');
```

### 3. Observer Memory Leaks
```javascript
// Problem: Forgetting to stop observers
// Solution: Always clean up observers

const observerId = window.DOMAPI.generateObserverId();
await window.DOMAPI.startObserving('#container', observerId);

// Don't forget to stop when done
window.addEventListener('beforeunload', async () => {
  await window.DOMAPI.stopObserving(observerId);
});
```

## 📚 API Reference Summary

### DOMAPI Methods
- **Retrieval**: `getFullDOM()`, `getElement()`, `getPageInfo()`
- **Manipulation**: `setText()`, `setHTML()`, `setAttribute()`, `addClass()`, `removeClass()`, `toggleClass()`, `removeElement()`, `clickElement()`
- **Observation**: `startObserving()`, `stopObserving()`, `generateObserverId()`
- **Batch**: `batchOperations()`

### DOMHelpers Methods
- **Validation**: `isValidSelector()`, `elementExists()`, `isElementVisible()`
- **Information**: `getElementInfo()`, `getElementPath()`, `getComputedStyles()`
- **Operations**: `waitForElement()`, `createElement()`, `insertElement()`, `scrollToElement()`, `highlightElement()`
- **Utilities**: `getAllElements()`, `safeOperation()`, `batchElementOperation()`

## 🎉 You're Ready!

The DOM Control System is now at your fingertips. Start with simple operations like getting page content or updating text, then gradually explore more advanced features like observers and batch operations.

Remember to check the browser console for helpful debug messages and error information. Happy coding! 🚀