# ChatGPT Signal Sending System

## Overview

The signal sending system is responsible for programmatically injecting messages into ChatGPT's interface and triggering the send action. This system handles the complex task of interacting with ChatGPT's dynamic UI elements, including text input, content manipulation, and button activation.

## Architecture

The signal sending system consists of multiple interconnected components:

```
ToggleButton.js ──► MessageSender.js ──► ElementFinder.js
      │                    │                    │
      │                    ▼                    ▼
      │            onSignalSent()        DOM Element
      │                    │             Detection
      │                    ▼                    │
      └──────────► MessageLoop.js ◄────────────┘
                        │
                        ▼
                ResponseObserver.js
```

## Core Components

### 1. Signal Initiation (`ToggleButton.js`)

**Purpose**: Provides the user interface trigger for signal sending.

**Key Function**: `createToggleButton()`

**Trigger Mechanism**:
```javascript
button.onclick = () => {
  console.log("🔘 Button clicked - Sending single test message");
  
  // Verify UI elements are available
  const elements = window.DOMUtils.findRequiredElements();
  if (elements.success) {
    console.log("✅ Elements found - Sending test message");
    window.MessageSender.sendTestMessage();
  } else {
    console.log("❌ Elements not found");
  }
};
```

**Button Configuration**:
- **Position**: Fixed at bottom-right (20px from edges)
- **Z-Index**: 99999 (ensures visibility over ChatGPT UI)
- **States**: Active (red, "Stop") / Inactive (green, "Start")
- **Text**: "▶️ Start Auto-Test" / "⏹️ Stop Auto-Test"

### 2. Signal Content & Transmission (`MessageSender.js`)

**Purpose**: Handles the actual message injection and transmission to ChatGPT.

**Key Function**: `sendTestMessage()`

**Signal Content**: 
- **Default Message**: `"<test>"` (defined in `Constants.DEFAULT_MESSAGE`)
- **Purpose**: Simple, recognizable signal that triggers ChatGPT response
- **Format**: Plain text wrapped in angle brackets for easy identification

### 3. UI Element Detection (`ElementFinder.js`)

**Purpose**: Locates the required ChatGPT interface elements for signal injection.

**Key Function**: `findRequiredElements()`

**Target Elements**:

#### Textarea Detection (Priority Order):
1. **Primary**: `textarea#prompt-textarea` (ChatGPT's main input)
2. **Fallback 1**: `textarea[placeholder*='Message']` (placeholder-based)
3. **Fallback 2**: `textarea[data-id='root']` (data attribute)
4. **Fallback 3**: `div[contenteditable='true']` (contenteditable div)
5. **Fallback 4**: `.ProseMirror` (ProseMirror editor)
6. **Fallback 5**: `textarea` (any textarea)
7. **Fallback 6**: `[contenteditable='true']` (any contenteditable)

#### Send Button Detection (Priority Order):
1. **Primary**: `button[data-testid="send-button"]` (official test ID)
2. **Fallback 1**: `button[aria-label="Send message"]` (accessibility label)
3. **Fallback 2**: `button[aria-label*="Send"]` (partial aria label)
4. **Fallback 3**: `button[title*="Send"]` (title attribute)
5. **Fallback 4**: CSS class-based detection
6. **Fallback 5**: SVG icon-based detection (paper plane icons)
7. **Fallback 6**: Position-based detection (bottom-right quadrant)
8. **Fallback 7**: Proximity-based detection (near textarea)

## Signal Injection Process

### 1. Element Preparation
```javascript
// Focus the textarea to ensure it's active
elements.textarea.focus();
console.log("✅ Textarea focused");
```

### 2. Content Injection Methods

The system uses multiple approaches for maximum compatibility:

#### Method A: Simulated Typing (Primary)
```javascript
const simulateTyping = () => {
  // Clear existing content
  if (elements.textarea.tagName === "TEXTAREA") {
    elements.textarea.value = "";
  } else {
    elements.textarea.innerHTML = "";
  }

  // Simulate typing each character
  const chars = textToSend.split("");
  chars.forEach((char, index) => {
    // Create keyboard event
    const keyEvent = new KeyboardEvent("keydown", {
      key: char,
      code: `Key${char.toUpperCase()}`,
      bubbles: true,
    });

    // Dispatch the event
    elements.textarea.dispatchEvent(keyEvent);

    // Update content based on element type
    if (elements.textarea.tagName === "TEXTAREA") {
      elements.textarea.value += char;
    } else {
      // Handle contenteditable elements
      const textNode = document.createTextNode(char);
      // ... DOM manipulation logic
    }

    // Trigger input events
    elements.textarea.dispatchEvent(new Event("input", { bubbles: true }));
  });
};
```

#### Method B: Direct Value Setting (Fallback)
```javascript
// Standard textarea
if (elements.textarea.tagName === "TEXTAREA") {
  elements.textarea.value = textToSend;
  elements.textarea.dispatchEvent(new Event("input", { bubbles: true }));
}
```

#### Method C: ProseMirror Specific (Special Case)
```javascript
if (elements.textarea.id === "prompt-textarea") {
  console.log("Using ProseMirror specific approach");

  // Clear and create paragraph element
  elements.textarea.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = textToSend;
  elements.textarea.appendChild(p);

  // Focus and trigger events
  elements.textarea.focus();
  elements.textarea.dispatchEvent(new Event("input", { bubbles: true }));
  elements.textarea.dispatchEvent(new Event("change", { bubbles: true }));
}
```

### 3. Send Button Activation

The system employs multiple click strategies for maximum reliability:

#### Strategy 1: Direct Click
```javascript
try {
  elements.sendButton.click();
  console.log("✅ Send button clicked via .click()");
} catch (clickError) {
  // Fallback to next strategy
}
```

#### Strategy 2: MouseEvent Dispatch
```javascript
try {
  elements.sendButton.dispatchEvent(new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
  }));
  console.log("✅ Send button clicked via MouseEvent");
} catch (mouseError) {
  // Fallback to next strategy
}
```

#### Strategy 3: Child Element Click
```javascript
const childElements = elements.sendButton.querySelectorAll("*");
for (let i = 0; i < childElements.length; i++) {
  try {
    childElements[i].click();
    console.log(`✅ Clicked child element ${i}`);
    break;
  } catch (e) {
    // Try next child
  }
}
```

#### Strategy 4: Enter Key Press (Last Resort)
```javascript
try {
  elements.textarea.focus();
  const enterEvent = new KeyboardEvent("keydown", {
    key: "Enter",
    code: "Enter",
    keyCode: 13,
    which: 13,
    bubbles: true,
    cancelable: true,
  });
  elements.textarea.dispatchEvent(enterEvent);
  console.log("✅ Enter key pressed");
} catch (enterError) {
  // Complete failure
}
```

### 4. Button State Management

#### Disabled Button Handling
```javascript
// Try to enable the button if it's disabled
if (elements.sendButton.disabled) {
  console.log("⚠️ Send button is disabled, trying to enable it");
  elements.sendButton.disabled = false;
}
```

#### Visibility Checks
```javascript
console.log("Button disabled?", elements.sendButton.disabled);
console.log("Button visible?", elements.sendButton.offsetParent !== null);
```

## Timing & Synchronization

### 1. ProseMirror Timing
For ProseMirror editors, the system uses delayed execution:
```javascript
// Wait for UI updates before clicking send
setTimeout(() => {
  if (elements.sendButton && window.MessageLoop.isRunning) {
    // Perform click operations
  }
}, 500); // 500ms delay
```

### 2. Signal Completion Callback
```javascript
// Fire the signal after sending
this.onSignalSent();
```

## Signal Completion Detection

### 1. Observer Initialization
```javascript
onSignalSent: function () {
  console.log("📡 Signal sent — initializing observer...");
  
  const MAX_RETRIES = 10;
  let retryCount = 0;
  let retryCooldown = false; // Debounce guard
  
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver((mutations, obs) => {
      // Response detection logic
    });
  });
}
```

### 2. Response Scanning
```javascript
const tryScan = async () => {
  const assistants = Array.from(
    document.querySelectorAll('[data-message-author-role="assistant"]')
  ).reverse(); // newest first

  for (const assistantNode of assistants) {
    const markdown = assistantNode.querySelector(".markdown");
    if (!markdown) continue;

    const text = markdown.innerText.trim();
    if (!text) continue;

    // Process response based on content type
    if (text.startsWith("{")) {
      // JSON response handling
    } else {
      // Regular text response handling
    }
  }
};
```

### 3. Retry Mechanism
```javascript
const retryLoop = async () => {
  if (await tryScan()) return;

  retryCount++;
  if (retryCount < MAX_RETRIES) {
    console.log(`🔁 Retry ${retryCount}/${MAX_RETRIES}`);
    setTimeout(async () => {
      retryCooldown = false;
      await retryLoop();
    }, 2000); // 2-second delay between retries
  } else {
    console.warn("❌ Max retries reached, no valid response found.");
    obs.disconnect();
    reject(new Error("Max retries reached without finding valid JSON."));
  }
};
```

## Integration with Message Loop

### 1. Loop Initialization
```javascript
// MessageLoop coordinates with signal sending
sendMessageAndWaitForResponse: function() {
  const success = window.MessageSender.sendTestMessage();
  
  if (success) {
    this.waitingForResponse = true;
    // Set up response observer
    this.responseObserver = window.DOMUtils.waitForResponse((response) => {
      // Handle response and continue loop
    });
  }
}
```

### 2. Response-Driven Continuation
```javascript
// After receiving response, send next signal
if (self.isRunning) {
  setTimeout(() => {
    self.sendMessageAndWaitForResponse();
  }, 1000); // 1-second delay between signals
}
```

## Error Handling & Fallbacks

### 1. Element Detection Failures
```javascript
if (!elements.success) {
  console.log("❌ Elements not found");
  // Trigger debug analysis
  window.DOMUtils.debugElements();
  return false;
}
```

### 2. Injection Failures
```javascript
try {
  simulateTyping();
} catch (typingError) {
  console.log("⚠️ Simulated typing failed:", typingError);
  // Fall back to direct value setting
}
```

### 3. Click Failures
Multiple fallback strategies ensure signal transmission even if primary methods fail.

### 4. Dependency Checks
```javascript
// Verify all required modules are loaded
if (typeof window.DOMUtils === 'undefined' || 
    typeof window.Constants === 'undefined') {
  console.error("❌ Dependencies not loaded");
  return false;
}
```

## Performance Considerations

### 1. DOM Query Optimization
- Uses specific selectors first, then fallbacks
- Caches element references when possible
- Implements early returns to avoid unnecessary processing

### 2. Event Throttling
- Debounce guards prevent overlapping operations
- Cooldown periods between retry attempts
- Timeout mechanisms prevent infinite loops

### 3. Memory Management
- Observers are properly disconnected after use
- Timeouts are cleared when operations complete
- No persistent DOM references stored

## Browser Compatibility

### 1. Event Handling
- Uses standard DOM events (KeyboardEvent, MouseEvent)
- Includes legacy properties (keyCode, which) for older browsers
- Bubbling events for proper propagation

### 2. Element Detection
- Multiple selector strategies for different ChatGPT versions
- Graceful degradation when elements aren't found
- Cross-browser DOM manipulation techniques

## Security Considerations

### 1. Content Injection
- Only injects predefined, safe content (`<test>`)
- No user-controlled content injection
- Respects ChatGPT's content policies

### 2. DOM Manipulation
- Read-only operations where possible
- Minimal DOM modifications
- Proper event cleanup

## Debugging & Monitoring

### 1. Comprehensive Logging
```javascript
console.log("🚀 MessageSender.sendTestMessage called");
console.log("📝 Attempting to send message:", textToSend);
console.log("✅ Send button clicked via .click()");
```

### 2. State Tracking
```javascript
console.log("Button disabled?", elements.sendButton.disabled);
console.log("Button visible?", elements.sendButton.offsetParent !== null);
```

### 3. Error Reporting
```javascript
console.error("❌ Error sending message:", error);
if (typeof window.DOMUtils !== 'undefined') {
  window.DOMUtils.debugElements();
}
```

## Usage Examples

### 1. Single Signal Send
```javascript
// Direct signal sending
const elements = window.DOMUtils.findRequiredElements();
if (elements.success) {
  window.MessageSender.sendTestMessage();
}
```

### 2. Loop Integration
```javascript
// Automated signal loop
window.MessageLoop.startLoop();
window.MessageLoop.sendMessageAndWaitForResponse();
```

### 3. Manual Button Trigger
```javascript
// User-initiated signal
document.getElementById("genesis-toggle").click();
```

## Future Enhancements

1. **Adaptive Element Detection**: Machine learning-based element recognition
2. **Custom Signal Content**: User-configurable message content
3. **Batch Signal Sending**: Multiple signals in sequence
4. **Signal Templates**: Predefined signal patterns for different use cases
5. **Real-time UI Adaptation**: Dynamic adjustment to ChatGPT UI changes