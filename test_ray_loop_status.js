/**
 * Test Ray Loop Status Display
 * Tests the real-time loop status UI component
 */

console.log("🧪 Testing Ray Loop Status Display...");

// Test 1: Check if RayLoopStatus is loaded
if (typeof window.RayLoopStatus !== 'undefined') {
    console.log("✅ RayLoopStatus module loaded");
    
    // Test 2: Initialize the status display
    try {
        window.RayLoopStatus.init();
        console.log("✅ Status display initialized");
        
        // Test 3: Simulate loop states
        setTimeout(() => {
            console.log("🔄 Testing loop state changes...");
            
            // Simulate starting
            window.RayLoopStatus.setStatus('Starting');
            window.RayLoopStatus.setRunning(true);
            
            setTimeout(() => {
                // Simulate waiting for response
                window.RayLoopStatus.setStatus('Waiting for Response');
                window.RayLoopStatus.setNextRun(Date.now() + 30000);
                
                setTimeout(() => {
                    // Simulate response received
                    window.RayLoopStatus.incrementResponses();
                    window.RayLoopStatus.setStatus('Processing Response');
                    
                    setTimeout(() => {
                        // Simulate next run scheduled
                        window.RayLoopStatus.setStatus('Waiting');
                        window.RayLoopStatus.setNextRun(Date.now() + 25000);
                        
                        setTimeout(() => {
                            // Simulate error
                            window.RayLoopStatus.incrementErrors();
                            window.RayLoopStatus.setStatus('Error Occurred');
                            
                            setTimeout(() => {
                                // Simulate recovery
                                window.RayLoopStatus.setStatus('Running');
                                window.RayLoopStatus.incrementResponses();
                                
                                console.log("✅ All status display tests completed");
                            }, 2000);
                        }, 2000);
                    }, 2000);
                }, 2000);
            }, 2000);
        }, 1000);
        
        // Test 4: Test manual state updates
        setTimeout(() => {
            console.log("🔄 Testing manual state updates...");
            
            window.RayLoopStatus.updateState({
                interval: 45000,
                responseCount: 15,
                errors: 2,
                status: 'Custom Status Test'
            });
            
            console.log("✅ Manual state update test completed");
        }, 12000);
        
        // Test 5: Test show/hide functionality
        setTimeout(() => {
            console.log("🔄 Testing show/hide functionality...");
            
            window.RayLoopStatus.hide();
            console.log("📱 Status display hidden");
            
            setTimeout(() => {
                window.RayLoopStatus.show();
                console.log("📱 Status display shown");
                
                console.log("✅ Show/hide test completed");
            }, 2000);
        }, 15000);
        
    } catch (error) {
        console.error("❌ Error testing status display:", error);
    }
    
} else {
    console.error("❌ RayLoopStatus not loaded");
}

// Test 6: Integration with MessageLoop (if available)
if (typeof window.MessageLoop !== 'undefined') {
    console.log("🔄 Testing MessageLoop integration...");
    
    // Override some MessageLoop methods to test integration
    const originalStartLoop = window.MessageLoop.startLoop;
    const originalStopLoop = window.MessageLoop.stopLoop;
    
    window.MessageLoop.startLoop = function() {
        console.log("🧪 MessageLoop.startLoop called - testing status integration");
        return originalStartLoop.call(this);
    };
    
    window.MessageLoop.stopLoop = function() {
        console.log("🧪 MessageLoop.stopLoop called - testing status integration");
        return originalStopLoop.call(this);
    };
    
    console.log("✅ MessageLoop integration test setup completed");
} else {
    console.warn("⚠️ MessageLoop not available for integration testing");
}

// Test 7: Performance test
setTimeout(() => {
    console.log("🔄 Running performance test...");
    
    const startTime = performance.now();
    
    // Rapid updates to test performance
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            if (typeof window.RayLoopStatus !== 'undefined') {
                window.RayLoopStatus.setStatus(`Performance Test ${i + 1}`);
                
                if (i === 99) {
                    const endTime = performance.now();
                    console.log(`✅ Performance test completed in ${endTime - startTime}ms`);
                    
                    // Reset to normal status
                    window.RayLoopStatus.setStatus('Performance Test Complete');
                }
            }
        }, i * 10);
    }
}, 20000);

console.log("🧪 Ray Loop Status Display test suite started");
console.log("📊 Watch the top-right corner for the live status display");
console.log("⏱️ Tests will run for about 30 seconds");