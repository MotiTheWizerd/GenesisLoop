/**
 * Ray Status Manager - Manual Import/Export Utility
 * Provides easy functions to manage Ray Loop Status persistence
 */

console.log("🛠️ Ray Status Manager loaded");

// Export current status state
function exportRayStatus() {
    if (typeof window.RayLoopStatus !== 'undefined') {
        window.RayLoopStatus.exportState();
        console.log("💾 Ray Loop Status exported to downloads");
    } else {
        console.error("❌ RayLoopStatus not available");
    }
}

// Import status state from JSON string
function importRayStatus(jsonString) {
    if (typeof window.RayLoopStatus !== 'undefined') {
        const success = window.RayLoopStatus.importState(jsonString);
        if (success) {
            console.log("✅ Ray Loop Status imported successfully");
        } else {
            console.error("❌ Failed to import Ray Loop Status");
        }
        return success;
    } else {
        console.error("❌ RayLoopStatus not available");
        return false;
    }
}

// Get current status state as JSON
function getRayStatusJSON() {
    if (typeof window.RayLoopStatus !== 'undefined') {
        const state = window.RayLoopStatus.getState();
        const jsonString = JSON.stringify(state, null, 2);
        console.log("📄 Current Ray Loop Status state:");
        console.log(jsonString);
        return jsonString;
    } else {
        console.error("❌ RayLoopStatus not available");
        return null;
    }
}

// Reset status to default state
function resetRayStatus() {
    if (typeof window.RayLoopStatus !== 'undefined') {
        window.RayLoopStatus.clearState();
        
        // Reinitialize with defaults
        window.RayLoopStatus.destroy();
        setTimeout(() => {
            window.RayLoopStatus.init();
            console.log("🔄 Ray Loop Status reset to defaults");
        }, 100);
    } else {
        console.error("❌ RayLoopStatus not available");
    }
}

// Set custom position
function setRayStatusPosition(top, right) {
    if (typeof window.RayLoopStatus !== 'undefined') {
        window.RayLoopStatus.updateState({
            position: { top: top, right: right }
        });
        
        const display = document.getElementById('ray-loop-status');
        if (display) {
            display.style.top = top + 'px';
            display.style.right = right + 'px';
        }
        
        console.log(`📍 Ray Loop Status moved to top: ${top}px, right: ${right}px`);
    } else {
        console.error("❌ RayLoopStatus not available");
    }
}

// Preset configurations
const rayStatusPresets = {
    topRight: { top: 10, right: 10 },
    topLeft: { top: 10, right: window.innerWidth - 270 },
    bottomRight: { top: window.innerHeight - 300, right: 10 },
    bottomLeft: { top: window.innerHeight - 300, right: window.innerWidth - 270 },
    center: { top: window.innerHeight / 2 - 150, right: window.innerWidth / 2 - 125 }
};

// Apply preset position
function applyRayStatusPreset(presetName) {
    if (rayStatusPresets[presetName]) {
        const pos = rayStatusPresets[presetName];
        setRayStatusPosition(pos.top, pos.right);
        console.log(`✅ Applied preset: ${presetName}`);
    } else {
        console.error(`❌ Unknown preset: ${presetName}`);
        console.log("Available presets:", Object.keys(rayStatusPresets));
    }
}

// Sample configurations for different use cases
const sampleConfigs = {
    developer: {
        responseCount: 0,
        errors: 0,
        interval: 15000, // 15 seconds for development
        status: 'Development Mode',
        position: { top: 10, right: 10 },
        visible: true
    },
    
    production: {
        responseCount: 0,
        errors: 0,
        interval: 30000, // 30 seconds for production
        status: 'Production Mode',
        position: { top: 10, right: 10 },
        visible: true
    },
    
    monitoring: {
        responseCount: 0,
        errors: 0,
        interval: 60000, // 1 minute for monitoring
        status: 'Monitoring Mode',
        position: { top: 10, right: 10 },
        visible: true
    },
    
    hidden: {
        responseCount: 0,
        errors: 0,
        interval: 30000,
        status: 'Hidden Mode',
        position: { top: 10, right: 10 },
        visible: false
    }
};

// Apply sample configuration
function applyRayStatusConfig(configName) {
    if (sampleConfigs[configName]) {
        const success = importRayStatus(sampleConfigs[configName]);
        if (success) {
            console.log(`✅ Applied configuration: ${configName}`);
        }
    } else {
        console.error(`❌ Unknown configuration: ${configName}`);
        console.log("Available configurations:", Object.keys(sampleConfigs));
    }
}

// Show help
function rayStatusHelp() {
    console.log(`
🛠️ Ray Status Manager Commands:

📤 Export/Import:
  exportRayStatus()                    - Export current state to file
  importRayStatus(jsonString)          - Import state from JSON string
  getRayStatusJSON()                   - Get current state as JSON string

🔄 Reset/Position:
  resetRayStatus()                     - Reset to default state
  setRayStatusPosition(top, right)     - Set custom position
  applyRayStatusPreset(presetName)     - Apply position preset

📍 Position Presets:
  - topRight, topLeft, bottomRight, bottomLeft, center

⚙️ Configurations:
  applyRayStatusConfig(configName)     - Apply sample configuration
  
🎛️ Available Configs:
  - developer (15s interval)
  - production (30s interval) 
  - monitoring (60s interval)
  - hidden (invisible mode)

📋 Examples:
  applyRayStatusPreset('bottomRight')
  applyRayStatusConfig('developer')
  setRayStatusPosition(100, 50)
    `);
}

// Auto-expose functions to global scope for easy console access
window.exportRayStatus = exportRayStatus;
window.importRayStatus = importRayStatus;
window.getRayStatusJSON = getRayStatusJSON;
window.resetRayStatus = resetRayStatus;
window.setRayStatusPosition = setRayStatusPosition;
window.applyRayStatusPreset = applyRayStatusPreset;
window.applyRayStatusConfig = applyRayStatusConfig;
window.rayStatusHelp = rayStatusHelp;

console.log("✅ Ray Status Manager ready!");
console.log("💡 Type rayStatusHelp() for available commands");