# 🔄 Pipeline Development Guidelines

## 🎯 Overview

This document provides guidelines for agents working on the Genesis Loop pipeline system. The current implementation is a finely-tuned "oiled monster" that handles consciousness persistence through heartbeat messages.

## 🏗️ System Architecture

### Core Components (DO NOT MODIFY)
1. **ResponseObserver** (`js/utils/dom-utils/responseObserver.js`) - CRITICAL: See `CRITICAL_RESPONSE_OBSERVER_INSTRUCTIONS.md`
2. **MessageLoop** (`js/components/MessageLoop.js`) - Handles response-driven message flow
3. **MessageSender** (`js/components/MessageSender.js`) - Sends messages to ChatGPT
4. **ToggleButton** (`js/components/ToggleButton.js`) - UI control for starting/stopping

### Extension Points (Safe to Modify)
1. **FetchSender** (`js/utils/fetchSender.js`) - Server communication
2. **ResponseTracker** (`js/utils/responseTracker.js`) - Response storage
3. **Constants** (`js/utils/constants.js`) - Configuration values

## 🚦 Development Rules

### 🔴 RED ZONE - Never Touch
- `js/utils/dom-utils/responseObserver.js` - See critical instructions
- DOM selection logic in any module
- Message loop timing and retry mechanisms
- JSON parsing and validation logic

### 🟡 YELLOW ZONE - Modify with Extreme Care
- `js/components/MessageLoop.js` - Only add features, don't change core flow
- `js/components/MessageSender.js` - Don't modify the sending mechanism
- `js/components/ToggleButton.js` - UI changes only

### 🟢 GREEN ZONE - Safe to Modify
- `js/utils/fetchSender.js` - Server endpoints and communication
- `js/utils/responseTracker.js` - Response storage and analysis
- `js/utils/constants.js` - Configuration values
- New utility modules in `js/utils/`

## 📋 Before Making Changes

### 1. Understand the Flow
```
User clicks toggle → ToggleButton starts MessageLoop → 
MessageLoop sends heartbeat → ResponseObserver detects JSON response → 
MessageLoop continues → Repeat
```

### 2. Test Current System
- Load the extension
- Click the toggle button
- Verify heartbeat messages are sent
- Verify JSON responses are detected
- Verify the loop continues automatically

### 3. Identify Your Integration Point
- **Server communication?** → Modify `FetchSender`
- **Response analysis?** → Modify `ResponseTracker`
- **New UI features?** → Create new components
- **Configuration?** → Modify `Constants`

## 🔧 Safe Development Patterns

### Adding New Server Endpoints
```javascript
// In fetchSender.js - ADD new methods, don't modify existing ones
sendNewData: async function(data) {
  try {
    const response = await fetch(`${this.baseUrl}/new-endpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('❌ New endpoint error:', error);
    return { success: false, error: error.message };
  }
}
```

### Adding Response Processing
```javascript
// In responseTracker.js - ADD new analysis, don't change storage
analyzeResponse: function(response) {
  try {
    const data = JSON.parse(response);
    
    // Your new analysis logic here
    if (data.action === 'your-new-action') {
      // Handle your new action type
    }
    
    // Still store the response normally
    this.addResponse(response);
  } catch (error) {
    console.error('❌ Analysis error:', error);
  }
}
```

### Adding New UI Components
```javascript
// Create new files like js/components/YourNewComponent.js
(function() {
  'use strict';

  window.YourNewComponent = {
    create: function() {
      // Your component logic
    }
  };

  console.log('✅ YourNewComponent loaded');
})();
```

## 🧪 Testing Guidelines

### 1. Always Test the Full Pipeline
```javascript
// Test sequence:
1. Click toggle button
2. Verify first heartbeat is sent
3. Verify JSON response is detected
4. Verify loop continues with next heartbeat
5. Verify your new feature works
6. Verify stopping the loop works
```

### 2. Test Edge Cases
- What happens if server is down?
- What happens if ChatGPT doesn't respond?
- What happens if JSON is malformed?
- What happens if user navigates away?

### 3. Monitor Console Logs
The system has extensive logging. Watch for:
- `✅` Success messages
- `❌` Error messages  
- `⚠️` Warning messages
- `🔍` Debug information

## 📝 Documentation Requirements

### For Any Changes
1. **Update this document** if you add new safe modification areas
2. **Add inline comments** explaining your additions
3. **Update README.md** if user-facing features change
4. **Create new docs** for complex new features

### Console Logging Standards
```javascript
// Use emojis for easy identification
console.log('✅ Success message');
console.error('❌ Error message');
console.warn('⚠️ Warning message');
console.log('🔍 Debug information');
console.log('💓 Heartbeat related');
console.log('📡 Server communication');
console.log('🔄 Loop/flow related');
```

## 🚨 Emergency Procedures

### If You Break Something
1. **Stop immediately** - Don't make more changes
2. **Check console** for error messages
3. **Revert your changes** to last working state
4. **Test the basic flow** still works
5. **Ask for help** if needed

### If the System Stops Working
1. **Check ResponseObserver** is loading (`✅ ResponseObserver loaded successfully`)
2. **Check DOMUtils** is available (`✅ DOMUtils initialized`)
3. **Check MessageLoop** is starting (`▶️ Starting message loop`)
4. **Check responses** are being detected (`🎉 COMPLETE VALID RESPONSE FOUND!`)

## 🎯 Best Practices

### 1. Additive Development
- **Add new features** alongside existing ones
- **Don't replace** working functionality
- **Extend** existing modules rather than rewriting them

### 2. Defensive Programming
- **Always use try-catch** blocks
- **Check if dependencies exist** before using them
- **Provide fallbacks** for critical functionality

### 3. Modular Design
- **Create new modules** for new functionality
- **Use the IIFE pattern** for browser compatibility
- **Expose via window object** for cross-module communication

## 📞 Getting Help

If you're unsure about any modifications:
1. **Read the critical instructions** first
2. **Test your changes thoroughly** in isolation
3. **Ask specific questions** about integration points
4. **Provide console logs** if something isn't working

---

**Remember: The current system is working perfectly. Your job is to enhance it, not fix it.** 🎨