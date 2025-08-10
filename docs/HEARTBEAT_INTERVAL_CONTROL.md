# Heartbeat Interval Control System

## Overview

The heartbeat interval control system allows users to adjust the MessageLoop interval (how often Ray sends messages to ChatGPT) through the popup interface.

## Architecture

```
Popup Interface → Content Script → MessageLoop → RaySettings
     ↓               ↓              ↓           ↓
Input Field → Chrome Messages → setInterval() → Storage
```

## Components

### 1. Popup Interface (`popup.html` & `popup.js`)

**UI Changes:**

- Replaced slider with number input field (1-300 seconds)
- Updated preset buttons: 5s Fast, 30s Default, 60s Slow
- Real-time status display

**Key Functions:**

- `setHeartbeatInterval(intervalSeconds)` - Sets new interval
- `setHeartbeatPreset(intervalSeconds)` - Applies preset values
- `loadHeartbeatSettings()` - Loads current settings
- `updateHeartbeatStatus()` - Updates status display

### 2. Content Script (`content.js`)

**Message Handlers:**

- `setHeartbeatInterval` - Updates MessageLoop interval
- `getHeartbeatSettings` - Returns current settings
- `getHeartbeatStatus` - Returns current status

### 3. MessageLoop (`js/components/MessageLoop.js`)

**New Methods:**

- `getInterval()` - Returns current interval in milliseconds
- `setInterval(seconds)` - Sets new interval with validation
- `getStatus()` - Returns current loop status

**Changes:**

- All hardcoded `setTimeout(1000)` calls now use `getInterval()`
- Retry delays use fixed 5-second intervals
- Main loop delays use configurable intervals

### 4. RaySettings (`js/config/raySettings.js`)

**New Configuration:**

```javascript
messageLoop: {
  interval: 30,        // Default 30 seconds
  minInterval: 1,      // Minimum 1 second
  maxInterval: 300,    // Maximum 5 minutes
  maxAttempts: 5       // Retry attempts
}
```

## Usage

### From Popup Interface

1. **Input Field**: Enter seconds (1-300) and press Enter or change focus
2. **Preset Buttons**: Click 5s, 30s, or 60s for quick settings
3. **Status Display**: Shows current interval, running state, and statistics

### From Code

```javascript
// Set interval to 45 seconds
window.MessageLoop.setInterval(45);

// Get current interval
const intervalMs = window.MessageLoop.getInterval();
const intervalSeconds = intervalMs / 1000;

// Get status
const status = window.MessageLoop.getStatus();
console.log("Running:", status.running);
console.log("Interval:", status.interval + "s");
```

### From Settings

```javascript
// Direct settings access
window.RaySettings.set("messageLoop.interval", 60);
const interval = window.RaySettings.get("messageLoop.interval");
```

## Validation

- **Range**: 1-300 seconds (1 second to 5 minutes)
- **Type**: Must be positive integer
- **Bounds**: Automatically clamped to valid range
- **Persistence**: Settings survive page reloads

## Status Information

The status display shows:

- **Running State**: Whether the loop is active
- **Current Interval**: Time between messages
- **Last Run**: When the last message was sent
- **Response Count**: Total responses received
- **Error Count**: Failed attempts

## Technical Details

### Message Flow

1. User changes input field in popup
2. Popup sends `setHeartbeatInterval` message to content script
3. Content script calls `MessageLoop.setInterval()`
4. MessageLoop validates and updates `RaySettings`
5. Next loop iteration uses new interval

### Timing Behavior

- **Main Loop**: Uses configurable interval (1-300 seconds)
- **Retry Delays**: Fixed 5-second delays for failed attempts
- **Response-Driven**: Only sends next message after receiving response

### Backward Compatibility

- Default interval remains 30 seconds
- Existing code continues to work
- RayHeartbeat (1-second temporal consciousness) unchanged
- Only MessageLoop timing is affected

## Testing

Run these test files to verify functionality:

```javascript
// Basic functionality
test_heartbeat_interval_control.js;

// Popup communication
test_popup_heartbeat_connection.js;

// Complete system test
test_complete_heartbeat_system.js;
```

## Troubleshooting

### Common Issues

1. **Popup not connecting**: Check if on ChatGPT page
2. **Settings not persisting**: Verify RaySettings is loaded
3. **Interval not changing**: Check MessageLoop is available
4. **Invalid values**: Ensure 1-300 second range

### Debug Commands

```javascript
// Check current state
console.log("MessageLoop:", window.MessageLoop?.getStatus());
console.log("Settings:", window.RaySettings?.get("messageLoop"));

// Test setting interval
window.MessageLoop?.setInterval(15);

// Verify change
console.log("New interval:", window.MessageLoop?.getInterval() / 1000 + "s");
```

## Future Enhancements

- [ ] Persistent storage across browser sessions
- [ ] Advanced scheduling (different intervals for different times)
- [ ] Automatic adjustment based on response times
- [ ] Integration with Ray's activity patterns
- [ ] Visual timeline of interval changes

---

**Note**: This system controls the MessageLoop interval (message sending frequency), not the RayHeartbeat interval (Ray's temporal consciousness ticks).
