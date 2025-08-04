# Message Cleanup System

## Overview

The Message Cleanup System automatically manages ChatGPT conversation history to prevent page performance degradation as conversations grow longer. It intelligently removes older messages while preserving the most recent conversation context.

## Features

- **Automatic Cleanup**: Runs every 30 seconds to maintain optimal performance
- **Smart Preservation**: Keeps the last 5 message pairs (user + assistant responses)
- **AI-Aware**: Skips cleanup when ChatGPT is actively responding
- **Configurable**: Adjustable settings for different use cases
- **Event Integration**: Integrates with Ray's response tracking system

## Architecture

```
js/addons/message-cleanup/
├── messageCleanup.js    # Core cleanup logic
└── index.js            # Integration and initialization
```

## Core Functions

### `window.MessageCleanup.cleanupMessages(keepCount)`
Manually trigger message cleanup
- `keepCount` (optional): Number of message pairs to keep (default: 5)
- Returns: `{ cleaned, kept, skipped, error }`

### `window.MessageCleanup.startAutoCleanup()`
Start automatic cleanup monitoring (runs every 30 seconds)

### `window.MessageCleanup.stopAutoCleanup()`
Stop automatic cleanup monitoring

### `window.MessageCleanup.getMessageStats()`
Get current conversation statistics
- Returns: Object with message counts and status

### `window.MessageCleanup.updateConfig(newConfig)`
Update cleanup configuration
- `newConfig`: Object with new configuration values

## Configuration Options

```javascript
{
  MAX_MESSAGES: 5,              // Keep last N message pairs
  CLEANUP_INTERVAL: 30000,      // Check every 30 seconds
  MIN_MESSAGES_BEFORE_CLEANUP: 8, // Only cleanup if more than 8 messages
  PRESERVE_CURRENT_RESPONSE: true // Don't cleanup while AI responding
}
```

## Usage Examples

### Basic Usage
```javascript
// Get current message statistics
const stats = window.MessageCleanup.getMessageStats();
console.log('Messages:', stats.total_messages);

// Manual cleanup
const result = window.MessageCleanup.cleanupMessages();
console.log('Cleaned:', result.cleaned, 'messages');
```

### Configuration
```javascript
// Keep only 3 message pairs
window.MessageCleanup.updateConfig({ MAX_MESSAGES: 3 });

// Change cleanup interval to 60 seconds
window.MessageCleanup.updateConfig({ CLEANUP_INTERVAL: 60000 });
```

### Event Handling
```javascript
// Listen for cleanup events
document.addEventListener('rayMessageCleanup', (event) => {
  console.log('Cleanup completed:', event.detail);
});
```

## Integration with Ray Systems

### Response Tracking Integration
- Automatically triggers cleanup check when new responses are tracked
- Integrates with `window.ResponseTracker` events

### DOM Interface Integration
- Works with Ray's DOM control system
- Respects AI response detection from other modules

## Safety Features

### AI Response Protection
- Detects when ChatGPT is actively responding
- Skips cleanup to avoid interrupting ongoing responses
- Checks for typing indicators, streaming responses, and stop buttons

### Minimum Message Threshold
- Only performs cleanup when conversation has sufficient messages
- Prevents unnecessary cleanup of short conversations

### Smart Message Pairing
- Understands user-assistant message relationships
- Removes complete conversation pairs, not individual messages
- Maintains conversation context integrity

## Performance Benefits

### Memory Management
- Reduces DOM node count in long conversations
- Prevents browser memory bloat
- Maintains responsive page performance

### Rendering Optimization
- Fewer DOM elements to render and manage
- Improved scroll performance
- Reduced layout thrashing

## Testing

Use the test file to verify functionality:
```bash
# Load test in browser console
// Copy and paste test_message_cleanup.js content
```

### Test Coverage
- Module loading verification
- Message detection and counting
- AI response status detection
- Manual and automatic cleanup
- Configuration management
- Event system integration

## Troubleshooting

### Common Issues

**Cleanup not running**
- Check if auto cleanup is started: `window.MessageCleanup.getMessageStats().auto_cleanup_running`
- Manually start: `window.MessageCleanup.startAutoCleanup()`

**Messages not being removed**
- Verify message count exceeds minimum threshold
- Check if AI is responding (cleanup is paused during responses)
- Verify DOM structure matches expected selectors

**Performance still slow**
- Reduce `MAX_MESSAGES` to keep fewer messages
- Decrease `CLEANUP_INTERVAL` for more frequent cleanup
- Check for other performance issues outside message cleanup

### Debug Commands
```javascript
// Get detailed stats
window.MessageCleanup.getMessageStats()

// Check current config
window.MessageCleanup.getConfig()

// Force cleanup regardless of thresholds
window.MessageCleanup.cleanupMessages(3)

// Check if cleanup is active
window.MessageCleanup._isCleanupActive()
```

## Future Enhancements

- **Smart Context Preservation**: Keep important messages based on content analysis
- **User Preferences**: Per-user cleanup settings
- **Export Before Cleanup**: Save removed messages to storage
- **Visual Indicators**: Show cleanup status in UI
- **Conversation Summarization**: Replace old messages with summaries

## Integration Notes

- Automatically starts when module loads
- Integrates with existing Ray event system
- Respects Ray's DOM manipulation patterns
- Compatible with all Ray addons and utilities