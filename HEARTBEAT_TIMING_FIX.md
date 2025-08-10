# Heartbeat Timing Control Fix

## Problem

The Ray Loop Status display (green window on the left) was showing:
- Static interval (30s) that didn't update when changed from popup
- "Next Run: Now" without a real countdown timer
- No real-time synchronization with actual MessageLoop settings

## Solution

### 1. Real-Time Interval Detection

Added `getRealTimeInterval()` function that:
- Gets current interval from `MessageLoop.getInterval()` (most accurate)
- Falls back to `RaySettings.get('messageLoop.interval')` 
- Uses stored state as final fallback

```javascript
function getRealTimeInterval() {
    // Try MessageLoop first (most accurate)
    if (typeof window.MessageLoop !== 'undefined' && window.MessageLoop.getInterval) {
        return window.MessageLoop.getInterval();
    }
    
    // Fallback to RaySettings
    if (typeof window.RaySettings !== 'undefined') {
        const intervalSeconds = window.RaySettings.get('messageLoop.interval') || 30;
        return intervalSeconds * 1000; // Convert to milliseconds
    }
    
    // Final fallback to stored state
    return loopState.interval;
}
```

### 2. Live Countdown Timer

Enhanced `updateDisplay()` to show:
- Real countdown with color coding:
  - 🟢 Green: Normal (>10s remaining)
  - 🟠 Orange: Warning (<10s remaining)  
  - 🔴 Red: Critical (<5s remaining)
  - 🟠 Orange: "Now" (time expired)

```javascript
const getCountdownColor = () => {
    if (timeUntilNextRun <= 0) return '#ffaa00'; // Orange for "Now"
    if (timeUntilNextRun < 5000) return '#ff6666'; // Red for < 5s
    if (timeUntilNextRun < 10000) return '#ffaa00'; // Orange for < 10s
    return '#00ff88'; // Green for normal
};
```

### 3. Settings Change Listener

Added event listener for real-time updates:

```javascript
document.addEventListener('raySettingsChanged', (event) => {
    if (event.detail && event.detail.path === 'messageLoop.interval') {
        console.log('🔄 Ray Loop Status: Interval changed to', event.detail.newValue + 's');
        loopState.interval = event.detail.newValue * 1000;
        updateDisplay(); // Immediate update
    }
});
```

### 4. Popup Integration

Enhanced content.js message handler:

```javascript
case "setHeartbeatInterval":
  if (window.MessageLoop) {
    const success = window.MessageLoop.setInterval(request.interval);
    
    // Sync RayLoopStatus with new interval
    if (success && window.RayLoopStatus) {
      window.RayLoopStatus.syncInterval();
    }
    
    sendResponse({success: success});
  }
```

### 5. Sync Method

Added `syncInterval()` method for manual synchronization:

```javascript
syncInterval: function() {
    const realInterval = getRealTimeInterval();
    if (realInterval !== loopState.interval) {
        loopState.interval = realInterval;
        updateDisplay();
        triggerAutoSave('syncInterval');
        console.log('🔄 Ray Loop Status: Synced interval to', realInterval / 1000 + 's');
    }
}
```

## Key Improvements

### ✅ Real-Time Updates
- Interval display updates immediately when changed from popup
- Automatic sync with MessageLoop and RaySettings
- No more static "30s" display

### ✅ Live Countdown
- Shows actual time remaining until next heartbeat
- Color-coded countdown (green → orange → red)
- Updates every second with precise timing

### ✅ Popup Integration
- Changes from popup interface reflect immediately
- Bidirectional communication between popup and display
- Proper error handling and fallbacks

### ✅ Automatic Synchronization
- Listens for settings changes from any source
- Syncs on initialization and when needed
- Maintains accuracy across all components

## Usage

### From Popup
1. Change interval in popup input field
2. Ray Loop Status updates immediately
3. Countdown shows new timing

### From Code
```javascript
// Change interval programmatically
window.MessageLoop.setInterval(45); // 45 seconds

// Force sync if needed
window.RayLoopStatus.syncInterval();

// Check current state
const state = window.RayLoopStatus.getState();
console.log('Interval:', state.interval / 1000 + 's');
```

## Testing

Run the test files to verify functionality:

```javascript
// Load and run comprehensive tests
// test_heartbeat_timing_fix.js

// Run interactive demo
// demo_heartbeat_timing_fix.js
```

## Files Modified

1. **`js/addons/loop-status/rayLoopStatus.js`**
   - Added `getRealTimeInterval()` function
   - Enhanced `updateDisplay()` with countdown colors
   - Added settings change listener
   - Added `syncInterval()` method

2. **`content.js`**
   - Enhanced `setHeartbeatInterval` handler
   - Added RayLoopStatus sync call

3. **`popup.js`**
   - Enhanced interval change feedback
   - Added immediate status update

## Result

The Ray Loop Status display now shows:
- ✅ Real interval from MessageLoop/RaySettings (not static 30s)
- ✅ Live countdown timer with color coding
- ✅ Immediate updates when interval changes from popup
- ✅ Accurate "Next Run" timing with countdown

The green window is now a true real-time heartbeat monitor that stays synchronized with all system components.