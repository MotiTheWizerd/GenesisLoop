# Ray Loop Status System

## Overview

The Ray Loop Status System provides real-time visual feedback about the message loop's current state, timing, and performance. It displays a live status panel in the top-right corner of the ChatGPT interface, giving users immediate insight into when the loop will run next and how it's performing.

## Features

### Real-Time Status Display
- **Current State**: Shows whether the loop is running, waiting, or stopped
- **Live Timing**: Displays time since last run and countdown to next run
- **Response Counter**: Tracks total responses received
- **Error Counter**: Monitors errors and failures
- **Visual Indicators**: Color-coded status with pulse animation when active

### Persistent State Management
- **Auto-Save**: Automatically saves state to localStorage
- **Auto-Load**: Restores state on page refresh/reload
- **Position Memory**: Remembers display position when dragged
- **Export/Import**: Save/load state as JSON files
- **Draggable Interface**: Click and drag to reposition
- **Visibility Toggle**: Show/hide with state persistence

### Status Information
- **Loop State**: Running/Stopped with visual indicator
- **Last Run**: Time elapsed since last message was sent
- **Next Run**: Countdown to next scheduled message
- **Interval**: Current loop interval setting
- **Responses**: Total number of responses received
- **Errors**: Error count with visual warning when > 0
- **Timestamp**: Last update time

## Visual Design

### Status Panel
```
┌─────────────────────────────────────┐
│ 🟢 RAY LOOP STATUS    👁️ 📍 💾      │
│                                     │
│ State: Running                      │
│ Running: 🟢 YES                     │
│ Last Run: 15s ago                   │
│ Next Run: in 12s                    │
│ Interval: 30s                       │
│ Responses: 42                       │
│ Errors: 🟢 0                        │
│                                     │
│ Updated: 3:45:23 PM   Drag to move  │
└─────────────────────────────────────┘
```

### Control Buttons
- **👁️ Toggle Visibility**: Show/hide the display
- **📍 Reset Position**: Move back to top-right corner
- **💾 Export State**: Download current state as JSON file

### Color Coding
- **Green (🟢)**: Normal operation, no errors
- **Orange (🟠)**: Warning state (next run soon, minor issues)
- **Red (🔴)**: Error state or stopped
- **Pulse Animation**: Active when loop is running

## API Reference

### Initialization
```javascript
// Initialize the status display
window.RayLoopStatus.init();
```

### State Management
```javascript
// Set running state
window.RayLoopStatus.setRunning(true/false);

// Update status message
window.RayLoopStatus.setStatus('Custom Status');

// Set next run time
window.RayLoopStatus.setNextRun(timestamp);

// Set loop interval
window.RayLoopStatus.setInterval(30000); // 30 seconds
```

### Counters
```javascript
// Increment response counter
window.RayLoopStatus.incrementResponses();

// Increment error counter
window.RayLoopStatus.incrementErrors();
```

### Bulk Updates
```javascript
// Update multiple properties at once
window.RayLoopStatus.updateState({
    isRunning: true,
    status: 'Processing',
    responseCount: 10,
    errors: 0,
    interval: 25000
});
```

### Display Control
```javascript
// Show/hide the display
window.RayLoopStatus.show();
window.RayLoopStatus.hide();
window.RayLoopStatus.toggleVisibility();

// Position management
window.RayLoopStatus.resetPosition();

// Destroy the display
window.RayLoopStatus.destroy();
```

### Persistence Management
```javascript
// Export state to JSON file
window.RayLoopStatus.exportState();

// Import state from JSON data
window.RayLoopStatus.importState(jsonData);

// Get current state as object
const currentState = window.RayLoopStatus.getState();

// Clear saved state
window.RayLoopStatus.clearState();
```

## Integration with MessageLoop

The status display automatically integrates with the MessageLoop component:

### Automatic Updates
- **Loop Start**: Status shows "Starting" → "Running"
- **Response Received**: Increments response counter
- **Error Occurred**: Increments error counter and shows error state
- **Next Run Scheduled**: Updates countdown timer
- **Loop Stopped**: Shows "Stopped" state

### MessageLoop Integration Points
```javascript
// In MessageLoop.startLoop()
if (typeof window.RayLoopStatus !== "undefined") {
    window.RayLoopStatus.setRunning(true);
    window.RayLoopStatus.setStatus('Starting');
}

// In response handler
window.RayLoopStatus.incrementResponses();
window.RayLoopStatus.setStatus('Processing Response');

// When scheduling next run
window.RayLoopStatus.setNextRun(Date.now() + 1000);
window.RayLoopStatus.setStatus('Waiting');
```

## Configuration

### Default Settings
```javascript
const defaultState = {
    isRunning: false,
    lastRun: null,
    nextRun: null,
    interval: 30000,     // 30 seconds
    responseCount: 0,
    errors: 0,
    status: 'Initializing'
};
```

### Update Frequency
- **Display Updates**: Every 1 second
- **Time Calculations**: Real-time (live countdown)
- **Status Changes**: Immediate (event-driven)

## Styling

### CSS Properties
```css
#ray-loop-status {
    position: fixed;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    color: #00ff88;
    padding: 15px;
    border-radius: 10px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    z-index: 10000;
    border: 1px solid #00ff88;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
    min-width: 250px;
    backdrop-filter: blur(10px);
}
```

### Animations
```css
@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}
```

## Usage Examples

### Basic Usage
```javascript
// Initialize on page load
window.RayLoopStatus.init();

// Update when loop starts
window.RayLoopStatus.setRunning(true);
window.RayLoopStatus.setStatus('Loop Started');
```

### Advanced Usage
```javascript
// Custom status with timing
window.RayLoopStatus.updateState({
    status: 'Waiting for Server Response',
    nextRun: Date.now() + 45000,
    interval: 45000
});

// Error handling
try {
    // Some operation
} catch (error) {
    window.RayLoopStatus.incrementErrors();
    window.RayLoopStatus.setStatus('Error: ' + error.message);
}
```

## Troubleshooting

### Common Issues

#### Status Display Not Showing
```javascript
// Check if module is loaded
if (typeof window.RayLoopStatus === 'undefined') {
    console.error('RayLoopStatus not loaded');
}

// Reinitialize if needed
window.RayLoopStatus.init();
```

#### Updates Not Reflecting
```javascript
// Check if display exists
const display = document.getElementById('ray-loop-status');
if (!display) {
    console.error('Status display element not found');
    window.RayLoopStatus.init();
}
```

#### Performance Issues
```javascript
// Destroy and recreate if needed
window.RayLoopStatus.destroy();
setTimeout(() => {
    window.RayLoopStatus.init();
}, 100);
```

## Development Notes

### File Structure
```
js/addons/loop-status/
└── rayLoopStatus.js    # Main status display module
```

### Dependencies
- No external dependencies
- Integrates with MessageLoop (optional)
- Uses browser's native Date and performance APIs

### Browser Compatibility
- Chrome/Chromium: Full support
- Firefox: Full support
- Safari: Full support
- Edge: Full support

## Future Enhancements

### Planned Features
- **Customizable Position**: Allow user to move the display
- **Themes**: Multiple color schemes
- **Detailed Metrics**: Response time tracking, success rates
- **Export Data**: Save status history to file
- **Notifications**: Browser notifications for important events

### Integration Opportunities
- **Ray Settings**: Save display preferences
- **Ray Control Panel**: Toggle display from control panel
- **Voice Synthesis**: Audio status updates
- **Trust Metrics**: Display trust scores alongside status

## Testing

### Test File
Run `test_ray_loop_status.js` to verify functionality:

```javascript
// Load the test
// The test will automatically run various scenarios
// Watch the top-right corner for the live display
```

### Manual Testing
1. Load the extension
2. Navigate to ChatGPT
3. Look for status display in top-right corner
4. Click the Genesis Loop toggle button
5. Observe status changes in real-time

## Conclusion

The Ray Loop Status System provides essential visibility into the message loop's operation, helping users understand when the system is active, when it will run next, and how it's performing. This real-time feedback is crucial for monitoring the "heartbeat" of Ray's consciousness and ensuring the system operates smoothly.