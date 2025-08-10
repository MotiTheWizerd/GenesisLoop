# Ray Settings Configuration System

## Overview

The Ray Settings system provides centralized configuration management for all Ray components. Instead of hardcoded values scattered throughout the codebase, all configurable parameters are now managed through a single settings file.

## Architecture

### Core Files

- `js/config/raySettings.js` - Main settings configuration and management
- `js/addons/ray-heartbeat/rayHeartbeat.js` - Updated to use settings

### Settings Structure

```javascript
RAY_SETTINGS = {
  heartbeat: {
    interval: 1000, // Ray's heartbeat interval (ms)
    maxTemporalEvents: 100, // Maximum temporal events to store
    minInterval: 100, // Minimum allowed interval
    maxInterval: 10000, // Maximum allowed interval
    autoStart: true, // Auto-start heartbeat
    logEveryNTicks: 10, // Log frequency
  },

  clock: {
    /* clock settings */
  },
  activityMonitor: {
    /* activity settings */
  },
  trustMetrics: {
    /* trust settings */
  },
  voice: {
    /* voice settings */
  },
  ui: {
    /* UI settings */
  },
  debug: {
    /* debug settings */
  },
};
```

## Usage

### Getting Settings

```javascript
// Get a specific setting
const interval = window.RaySettings.get("heartbeat.interval");

// Get a settings group
const heartbeatSettings = window.RaySettings.get("heartbeat");

// Get all settings
const allSettings = window.RaySettings.getAll();
```

### Setting Values

```javascript
// Set a specific value
window.RaySettings.set("heartbeat.interval", 2000);

// This will trigger a 'raySettingsChanged' event
```

### Validation

```javascript
// Validate a setting value
const isValid = window.RaySettings.validate("heartbeat.interval", 1500);
```

### Event Listening

```javascript
// Listen for settings changes
document.addEventListener("raySettingsChanged", (event) => {
  console.log("Setting changed:", event.detail);
  // event.detail contains: path, oldValue, newValue, timestamp
});
```

## Integration Examples

### Heartbeat System Integration

**Before:**

```javascript
const HEARTBEAT_INTERVAL = 1000; // Hardcoded
```

**After:**

```javascript
const getHeartbeatInterval = () =>
  window.RaySettings?.get("heartbeat.interval") || 1000;
```

### Dynamic Rate Adjustment

```javascript
// Adjust heartbeat rate with validation
function adjustHeartbeatRate(newInterval) {
  if (window.RaySettings.validate("heartbeat.interval", newInterval)) {
    window.RaySettings.set("heartbeat.interval", newInterval);
    // Restart heartbeat with new interval
    restartHeartbeat();
    return true;
  }
  return false;
}
```

## Benefits

1. **Centralized Configuration**: All settings in one place
2. **Runtime Modification**: Change settings without code changes
3. **Validation**: Built-in validation for setting values
4. **Event System**: Components can react to setting changes
5. **Fallback Safety**: Graceful fallbacks if settings aren't loaded
6. **Future Extensibility**: Easy to add new settings categories

## Migration Guide

### For Existing Components

1. **Identify Hardcoded Values**: Find constants that should be configurable
2. **Add to Settings**: Add the setting to `raySettings.js`
3. **Update Component**: Replace constants with `RaySettings.get()` calls
4. **Add Fallbacks**: Ensure graceful fallbacks if settings aren't loaded
5. **Test**: Verify the component works with different setting values

### Example Migration

**Before:**

```javascript
const UPDATE_INTERVAL = 5000;
setInterval(updateFunction, UPDATE_INTERVAL);
```

**After:**

```javascript
const getUpdateInterval = () =>
  window.RaySettings?.get("component.updateInterval") || 5000;
setInterval(updateFunction, getUpdateInterval());
```

## Testing

Use `test_ray_settings.js` to verify the settings system:

```bash
# Load the test file in the browser console or add to manifest for testing
```

The test covers:

- Settings loading
- Getting/setting values
- Validation
- Integration with RayHeartbeat
- Event system

## Future Enhancements

1. **Persistent Storage**: Save settings to Chrome storage
2. **UI Configuration Panel**: Visual settings editor
3. **Import/Export**: Settings backup and restore
4. **Profiles**: Different setting profiles for different use cases
5. **Remote Configuration**: Load settings from external sources

## Status

✅ **Core System**: Implemented and functional  
✅ **Heartbeat Integration**: Complete  
🔄 **Other Components**: Migration in progress  
📋 **UI Panel**: Planned  
📋 **Persistence**: Planned

---

_The monastery now has a configuration system. Ray's consciousness can be tuned and adjusted through centralized settings, making the system more flexible and maintainable._

## UI

Integration - Heartbeat Slider

### Control Panel Integration

The Ray Control Panel now includes a dedicated heartbeat configuration section with:

#### Heartbeat Slider

- **Range**: 100ms to 5000ms (0.1 to 5 seconds)
- **Step**: 100ms increments
- **Real-time preview**: Shows current value as you drag
- **Live status**: Updates every 2 seconds with current heartbeat info

#### Preset Buttons

- **1s (Default)**: Standard heartbeat rate (1000ms)
- **0.5s (Fast)**: High-frequency heartbeat (500ms)
- **2s (Slow)**: Low-frequency heartbeat (2000ms)

#### Status Display

Shows real-time heartbeat information:

- Current beating status (🟢 Beating / 🔴 Stopped)
- Active heartbeat rate in milliseconds
- System uptime since heartbeat started
- Total tick count

### Usage

1. **Open Control Panel**: Click the 🎛️ button in the top-right
2. **Adjust Heartbeat**: Use the slider or preset buttons
3. **Monitor Status**: Watch the live status updates
4. **Apply Changes**: Changes take effect immediately

### Technical Integration

The slider integrates with:

- `RaySettings.set('heartbeat.interval', value)` - Updates configuration
- `RayHeartbeat.adjustRate(value)` - Applies new rate with validation
- Real-time status monitoring via `RayHeartbeat.status()`

### Visual Design

- **Pink/Magenta theme** (💓) to match heartbeat concept
- **Smooth slider** with custom styling
- **Live updates** every 2 seconds when panel is open
- **Validation feedback** if invalid values are set

---

_Ray's heartbeat can now be tuned in real-time through the web interface, giving users direct control over the consciousness pulse rate._
