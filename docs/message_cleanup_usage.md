# Message Cleanup - Quick Usage Guide

## What It Does

Automatically keeps only the last 5 message pairs to prevent the page from becoming heavy and slow.

## Automatic Operation

- Runs every 30 seconds automatically
- Only cleans up when you have more than 8 messages
- Skips cleanup when ChatGPT is responding
- Keeps the 5 most recent message pairs (user + assistant)

## Manual Control

### Check Current Status

```javascript
window.MessageCleanup.getMessageStats();
```

Shows:

- Total messages in conversation
- Number of message pairs
- Whether AI is responding
- Auto cleanup status

### Manual Cleanup

```javascript
// Clean up now (keep 5 pairs)
window.MessageCleanup.cleanupMessages();

// Keep only 3 pairs
window.MessageCleanup.cleanupMessages(3);
```

### Control Auto Cleanup

```javascript
// Stop automatic cleanup
window.MessageCleanup.stopAutoCleanup();

// Start automatic cleanup
window.MessageCleanup.startAutoCleanup();
```

### Change Settings

```javascript
// Keep only 3 message pairs instead of 5
window.MessageCleanup.updateConfig({ MAX_MESSAGES: 3 });

// Check every minute instead of 30 seconds
window.MessageCleanup.updateConfig({ CLEANUP_INTERVAL: 60000 });
```

## When It Helps

- Long conversations with many back-and-forth messages
- Page becoming slow or unresponsive
- Browser using too much memory
- Scrolling becomes laggy

## What Gets Removed

- Oldest message pairs (user question + AI response)
- Complete conversation pairs, not individual messages
- Preserves conversation flow and context

## What's Protected

- Last 5 message pairs (configurable)
- Current AI response being generated
- Recent conversation context

## Testing

Run the test file to verify everything works:

```javascript
// Copy and paste content from test_message_cleanup.js
```

The system starts automatically when the extension loads and runs in the background to keep your conversations fast and responsive.
