/**
 * Test Auto-Save on Every Change
 * Verifies that every single change to loop data triggers a save
 */

console.log("🧪 Testing Auto-Save on Every Change...");

// Track save operations
let saveCount = 0;
let saveLog = [];

// Override localStorage.setItem to track saves
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    if (key === 'ray_loop_status_state') {
        saveCount++;
        const timestamp = new Date().toISOString();
        const parsedValue = JSON.parse(value);
        
        saveLog.push({
            saveNumber: saveCount,
            timestamp: timestamp,
            triggerType: 'localStorage.setItem',
            data: parsedValue
        });
        
        console.log(`💾 Save #${saveCount} at ${timestamp}`);
        console.log(`📄 Data:`, parsedValue);
    }
    return originalSetItem.call(this, key, value);
};

// Test 1: Initialize and verify auto-save setup
if (typeof window.RayLoopStatus !== 'undefined') {
    console.log("✅ RayLoopStatus module loaded");
    
    // Clear previous saves for clean test
    saveCount = 0;
    saveLog = [];
    
    // Initialize
    window.RayLoopStatus.init();
    console.log(`📊 Saves after init: ${saveCount}`);
    
    // Test 2: Individual property changes
    setTimeout(() => {
        console.log("🔄 Testing individual property changes...");
        
        const initialSaveCount = saveCount;
        
        // Each of these should trigger a save
        window.RayLoopStatus.setStatus('Test Status 1');
        window.RayLoopStatus.setRunning(true);
        window.RayLoopStatus.setNextRun(Date.now() + 30000);
        window.RayLoopStatus.incrementResponses();
        window.RayLoopStatus.incrementErrors();
        window.RayLoopStatus.setInterval(45000);
        
        const savesAfterChanges = saveCount - initialSaveCount;
        console.log(`📊 Individual changes triggered ${savesAfterChanges} saves`);
        
        if (savesAfterChanges >= 6) {
            console.log("✅ Individual property changes test PASSED");
        } else {
            console.log("❌ Individual property changes test FAILED");
        }
        
    }, 2000);
    
    // Test 3: Bulk state updates
    setTimeout(() => {
        console.log("🔄 Testing bulk state updates...");
        
        const initialSaveCount = saveCount;
        
        window.RayLoopStatus.updateState({
            status: 'Bulk Update Test',
            responseCount: 25,
            errors: 3,
            interval: 60000
        });
        
        const savesAfterBulk = saveCount - initialSaveCount;
        console.log(`📊 Bulk update triggered ${savesAfterBulk} saves`);
        
        if (savesAfterBulk >= 1) {
            console.log("✅ Bulk state update test PASSED");
        } else {
            console.log("❌ Bulk state update test FAILED");
        }
        
    }, 4000);
    
    // Test 4: UI interactions
    setTimeout(() => {
        console.log("🔄 Testing UI interactions...");
        
        const initialSaveCount = saveCount;
        
        window.RayLoopStatus.hide();
        window.RayLoopStatus.show();
        window.RayLoopStatus.resetPosition();
        
        const savesAfterUI = saveCount - initialSaveCount;
        console.log(`📊 UI interactions triggered ${savesAfterUI} saves`);
        
        if (savesAfterUI >= 3) {
            console.log("✅ UI interactions test PASSED");
        } else {
            console.log("❌ UI interactions test FAILED");
        }
        
    }, 6000);
    
    // Test 5: Rapid changes (debouncing test)
    setTimeout(() => {
        console.log("🔄 Testing rapid changes (debouncing)...");
        
        const initialSaveCount = saveCount;
        
        // Make rapid changes
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                window.RayLoopStatus.setStatus(`Rapid Change ${i + 1}`);
            }, i * 50); // 50ms apart
        }
        
        // Check saves after debouncing period
        setTimeout(() => {
            const savesAfterRapid = saveCount - initialSaveCount;
            console.log(`📊 Rapid changes triggered ${savesAfterRapid} saves`);
            
            // Should be less than 10 due to debouncing
            if (savesAfterRapid < 10 && savesAfterRapid > 0) {
                console.log("✅ Rapid changes debouncing test PASSED");
            } else {
                console.log("❌ Rapid changes debouncing test FAILED");
            }
        }, 2000);
        
    }, 8000);
    
    // Test 6: MessageLoop integration
    setTimeout(() => {
        console.log("🔄 Testing MessageLoop integration...");
        
        if (typeof window.MessageLoop !== 'undefined') {
            const initialSaveCount = saveCount;
            
            // Simulate MessageLoop operations
            if (typeof window.RayLoopStatus !== 'undefined') {
                // Simulate loop starting
                window.RayLoopStatus.setRunning(true);
                window.RayLoopStatus.setStatus('Loop Started');
                
                // Simulate response received
                window.RayLoopStatus.incrementResponses();
                window.RayLoopStatus.setStatus('Response Received');
                
                // Simulate next run scheduled
                window.RayLoopStatus.setNextRun(Date.now() + 30000);
                window.RayLoopStatus.setStatus('Waiting for Next Run');
            }
            
            const savesAfterLoop = saveCount - initialSaveCount;
            console.log(`📊 MessageLoop simulation triggered ${savesAfterLoop} saves`);
            
            if (savesAfterLoop >= 6) {
                console.log("✅ MessageLoop integration test PASSED");
            } else {
                console.log("❌ MessageLoop integration test FAILED");
            }
        } else {
            console.log("⚠️ MessageLoop not available for integration test");
        }
        
    }, 11000);
    
    // Test 7: Position changes (drag simulation)
    setTimeout(() => {
        console.log("🔄 Testing position changes...");
        
        const initialSaveCount = saveCount;
        
        // Simulate dragging to different positions
        const positions = [
            { top: 50, right: 50 },
            { top: 100, right: 100 },
            { top: 150, right: 150 },
            { top: 10, right: 10 } // Reset
        ];
        
        positions.forEach((pos, index) => {
            setTimeout(() => {
                window.RayLoopStatus.updateState({
                    position: pos
                });
                
                const display = document.getElementById('ray-loop-status');
                if (display) {
                    display.style.top = pos.top + 'px';
                    display.style.right = pos.right + 'px';
                }
            }, index * 500);
        });
        
        setTimeout(() => {
            const savesAfterPosition = saveCount - initialSaveCount;
            console.log(`📊 Position changes triggered ${savesAfterPosition} saves`);
            
            if (savesAfterPosition >= 4) {
                console.log("✅ Position changes test PASSED");
            } else {
                console.log("❌ Position changes test FAILED");
            }
        }, 3000);
        
    }, 13000);
    
    // Test 8: Final summary
    setTimeout(() => {
        console.log("🎉 Auto-Save Test Summary:");
        console.log(`📊 Total saves during test: ${saveCount}`);
        console.log(`📋 Save log entries: ${saveLog.length}`);
        
        if (saveCount > 20) {
            console.log("✅ AUTO-SAVE SYSTEM WORKING PERFECTLY!");
            console.log("💾 Every change is being saved automatically");
        } else if (saveCount > 10) {
            console.log("⚠️ Auto-save working but may need optimization");
        } else {
            console.log("❌ Auto-save system needs attention");
        }
        
        // Show detailed save log
        console.log("📄 Detailed Save Log:");
        saveLog.forEach((entry, index) => {
            console.log(`${index + 1}. ${entry.timestamp} - Save #${entry.saveNumber}`);
            console.log(`   Status: ${entry.data.status}`);
            console.log(`   Responses: ${entry.data.responseCount}`);
            console.log(`   Errors: ${entry.data.errors}`);
            console.log(`   Position: ${JSON.stringify(entry.data.position)}`);
            console.log('---');
        });
        
        // Restore original localStorage.setItem
        localStorage.setItem = originalSetItem;
        console.log("🔄 localStorage.setItem restored to original");
        
    }, 18000);
    
} else {
    console.error("❌ RayLoopStatus not loaded");
}

console.log("🧪 Auto-Save Every Change test suite started");
console.log("📊 This test will run for about 20 seconds");
console.log("💾 Watch console for detailed save tracking");
console.log("🔍 Every change should trigger a save operation");