/**
 * Test Ray Loop Status Persistence
 * Tests the JSON save/load functionality
 */

console.log("🧪 Testing Ray Loop Status Persistence...");

// Test 1: Check if RayLoopStatus is loaded
if (typeof window.RayLoopStatus !== 'undefined') {
    console.log("✅ RayLoopStatus module loaded");
    
    // Test 2: Initialize and test basic persistence
    try {
        window.RayLoopStatus.init();
        console.log("✅ Status display initialized with persistence");
        
        // Test 3: Update state and verify it saves
        setTimeout(() => {
            console.log("🔄 Testing state persistence...");
            
            // Update various state properties
            window.RayLoopStatus.updateState({
                responseCount: 25,
                errors: 3,
                interval: 45000,
                status: 'Persistence Test'
            });
            
            // Move the display to test position saving
            const display = document.getElementById('ray-loop-status');
            if (display) {
                display.style.top = '100px';
                display.style.right = '50px';
                
                // Trigger position save
                window.RayLoopStatus.updateState({
                    position: { top: 100, right: 50 }
                });
            }
            
            console.log("✅ State updated - should be saved to localStorage");
            
            // Test 4: Verify localStorage contains our data
            setTimeout(() => {
                const savedData = localStorage.getItem('ray_loop_status_state');
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    console.log("✅ Data found in localStorage:", parsed);
                    
                    if (parsed.responseCount === 25 && parsed.errors === 3) {
                        console.log("✅ Persistence test PASSED - data matches");
                    } else {
                        console.log("❌ Persistence test FAILED - data mismatch");
                    }
                } else {
                    console.log("❌ No data found in localStorage");
                }
            }, 1000);
            
        }, 1000);
        
        // Test 5: Test export functionality
        setTimeout(() => {
            console.log("🔄 Testing export functionality...");
            
            // This will trigger a download
            window.RayLoopStatus.exportState();
            console.log("✅ Export triggered - check your downloads folder");
            
        }, 3000);
        
        // Test 6: Test import functionality with sample data
        setTimeout(() => {
            console.log("🔄 Testing import functionality...");
            
            const sampleImportData = {
                responseCount: 100,
                errors: 0,
                interval: 60000,
                status: 'Imported State Test',
                position: { top: 200, right: 100 },
                visible: true
            };
            
            const success = window.RayLoopStatus.importState(sampleImportData);
            if (success) {
                console.log("✅ Import test PASSED");
                
                // Verify the import worked
                const currentState = window.RayLoopStatus.getState();
                if (currentState.responseCount === 100) {
                    console.log("✅ Import verification PASSED");
                } else {
                    console.log("❌ Import verification FAILED");
                }
            } else {
                console.log("❌ Import test FAILED");
            }
            
        }, 5000);
        
        // Test 7: Test position reset
        setTimeout(() => {
            console.log("🔄 Testing position reset...");
            
            window.RayLoopStatus.resetPosition();
            
            const display = document.getElementById('ray-loop-status');
            if (display && display.style.top === '10px' && display.style.right === '10px') {
                console.log("✅ Position reset test PASSED");
            } else {
                console.log("❌ Position reset test FAILED");
            }
            
        }, 7000);
        
        // Test 8: Test visibility toggle
        setTimeout(() => {
            console.log("🔄 Testing visibility toggle...");
            
            window.RayLoopStatus.hide();
            console.log("📱 Display hidden");
            
            setTimeout(() => {
                window.RayLoopStatus.show();
                console.log("📱 Display shown");
                
                // Test toggle function
                setTimeout(() => {
                    window.RayLoopStatus.toggleVisibility();
                    console.log("📱 Display toggled");
                    
                    setTimeout(() => {
                        window.RayLoopStatus.toggleVisibility();
                        console.log("📱 Display toggled back");
                        console.log("✅ Visibility toggle test completed");
                    }, 1000);
                }, 1000);
            }, 1000);
            
        }, 9000);
        
        // Test 9: Test state clearing
        setTimeout(() => {
            console.log("🔄 Testing state clearing...");
            
            // First save current state
            const currentState = window.RayLoopStatus.getState();
            console.log("💾 Current state before clear:", currentState);
            
            // Clear the state
            window.RayLoopStatus.clearState();
            
            // Check if localStorage is cleared
            const clearedData = localStorage.getItem('ray_loop_status_state');
            if (!clearedData) {
                console.log("✅ State clearing test PASSED");
            } else {
                console.log("❌ State clearing test FAILED");
            }
            
        }, 13000);
        
        // Test 10: Test reload simulation
        setTimeout(() => {
            console.log("🔄 Testing reload simulation...");
            
            // Set some test data
            window.RayLoopStatus.updateState({
                responseCount: 50,
                errors: 1,
                status: 'Pre-Reload Test',
                position: { top: 150, right: 75 }
            });
            
            console.log("💾 Test data set, simulating page reload...");
            
            // Destroy current instance
            window.RayLoopStatus.destroy();
            
            // Wait a moment then reinitialize
            setTimeout(() => {
                window.RayLoopStatus.init();
                
                // Check if data was restored
                const restoredState = window.RayLoopStatus.getState();
                if (restoredState.responseCount === 50 && restoredState.errors === 1) {
                    console.log("✅ Reload simulation test PASSED - data restored");
                } else {
                    console.log("❌ Reload simulation test FAILED - data not restored");
                    console.log("🔍 Restored state:", restoredState);
                }
                
                console.log("🎉 All persistence tests completed!");
            }, 1000);
            
        }, 15000);
        
    } catch (error) {
        console.error("❌ Error testing persistence:", error);
    }
    
} else {
    console.error("❌ RayLoopStatus not loaded");
}

// Test 11: Manual localStorage inspection
setTimeout(() => {
    console.log("🔍 Manual localStorage inspection:");
    
    try {
        const keys = Object.keys(localStorage);
        const rayKeys = keys.filter(key => key.includes('ray'));
        
        console.log("🔑 Ray-related localStorage keys:", rayKeys);
        
        rayKeys.forEach(key => {
            try {
                const value = localStorage.getItem(key);
                const parsed = JSON.parse(value);
                console.log(`📄 ${key}:`, parsed);
            } catch (e) {
                console.log(`📄 ${key}: ${value} (not JSON)`);
            }
        });
        
    } catch (error) {
        console.error("❌ Error inspecting localStorage:", error);
    }
    
}, 18000);

console.log("🧪 Ray Loop Status Persistence test suite started");
console.log("📊 Tests will run for about 20 seconds");
console.log("💾 Check console for persistence verification");
console.log("📁 Check downloads folder for exported JSON file");