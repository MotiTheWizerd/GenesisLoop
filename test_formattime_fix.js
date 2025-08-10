/**
 * Test: FormatTime Fix
 * 
 * This test verifies that the formatTime function error is fixed
 */

(function() {
    'use strict';

    console.log('🧪 Testing FormatTime Fix...');

    function testRayLoopStatusDisplay() {
        console.log('\n📊 Test: Ray Loop Status Display');
        
        if (typeof window.RayLoopStatus === 'undefined') {
            console.error('❌ RayLoopStatus not loaded');
            return false;
        }

        try {
            // Initialize if not already done
            if (!document.getElementById('ray-loop-status')) {
                window.RayLoopStatus.init();
                console.log('✅ RayLoopStatus initialized successfully');
            }

            // Test setting running state (this should trigger updateDisplay)
            console.log('🔄 Testing setRunning...');
            window.RayLoopStatus.setRunning(true);
            console.log('✅ setRunning(true) completed without error');

            // Test setting next run time
            console.log('🔄 Testing setNextRun...');
            const nextRun = Date.now() + 30000; // 30 seconds from now
            window.RayLoopStatus.setNextRun(nextRun);
            console.log('✅ setNextRun completed without error');

            // Test updating state
            console.log('🔄 Testing updateState...');
            window.RayLoopStatus.updateState({
                lastRun: Date.now() - 10000, // 10 seconds ago
                responseCount: 5,
                errors: 0
            });
            console.log('✅ updateState completed without error');

            // Check if display is visible and working
            const display = document.getElementById('ray-loop-status');
            if (display) {
                console.log('✅ Display element found');
                const content = display.textContent;
                if (content.includes('Next Run:')) {
                    console.log('✅ Display shows Next Run information');
                    const nextRunMatch = content.match(/Next Run:\s*([^\n]+)/);
                    if (nextRunMatch) {
                        console.log('📊 Next Run shows:', nextRunMatch[1].trim());
                    }
                } else {
                    console.warn('⚠️ Display does not show Next Run information');
                }
            } else {
                console.error('❌ Display element not found');
                return false;
            }

            return true;

        } catch (error) {
            console.error('❌ Error during test:', error);
            return false;
        }
    }

    function testDifferentStates() {
        console.log('\n🔄 Test: Different Loop States');
        
        try {
            // Test stopped state
            console.log('🔴 Testing stopped state...');
            window.RayLoopStatus.setRunning(false);
            window.RayLoopStatus.setNextRun(null);
            
            setTimeout(() => {
                const display = document.getElementById('ray-loop-status');
                if (display) {
                    const content = display.textContent;
                    const nextRunMatch = content.match(/Next Run:\s*([^\n]+)/);
                    console.log('📊 Stopped state - Next Run:', nextRunMatch ? nextRunMatch[1].trim() : 'Not found');
                }
            }, 100);

            // Test running with scheduled time
            setTimeout(() => {
                console.log('🟢 Testing running with scheduled time...');
                window.RayLoopStatus.setRunning(true);
                window.RayLoopStatus.setNextRun(Date.now() + 45000); // 45 seconds
                
                setTimeout(() => {
                    const display = document.getElementById('ray-loop-status');
                    if (display) {
                        const content = display.textContent;
                        const nextRunMatch = content.match(/Next Run:\s*([^\n]+)/);
                        console.log('📊 Running state - Next Run:', nextRunMatch ? nextRunMatch[1].trim() : 'Not found');
                    }
                }, 100);
            }, 1000);

            // Test running without explicit next run (should calculate from last run)
            setTimeout(() => {
                console.log('🟡 Testing running without explicit next run...');
                window.RayLoopStatus.setRunning(true);
                window.RayLoopStatus.setNextRun(null);
                window.RayLoopStatus.updateState({
                    lastRun: Date.now() - 5000, // 5 seconds ago
                    interval: 30000 // 30 second interval
                });
                
                setTimeout(() => {
                    const display = document.getElementById('ray-loop-status');
                    if (display) {
                        const content = display.textContent;
                        const nextRunMatch = content.match(/Next Run:\s*([^\n]+)/);
                        console.log('📊 Calculated state - Next Run:', nextRunMatch ? nextRunMatch[1].trim() : 'Not found');
                    }
                }, 100);
            }, 2000);

            return true;

        } catch (error) {
            console.error('❌ Error during state tests:', error);
            return false;
        }
    }

    function runAllTests() {
        console.log('🚀 Starting FormatTime Fix Tests...\n');
        
        const test1 = testRayLoopStatusDisplay();
        
        if (test1) {
            setTimeout(() => {
                testDifferentStates();
                
                setTimeout(() => {
                    console.log('\n🎉 FormatTime fix tests completed!');
                    console.log('💡 If no errors appeared, the formatTime issue is fixed');
                }, 5000);
            }, 1000);
        } else {
            console.log('❌ Basic test failed, skipping additional tests');
        }
    }

    // Wait for dependencies and run tests
    function waitForDependencies() {
        if (typeof window.RayLoopStatus !== 'undefined') {
            console.log('✅ Dependencies loaded, starting tests...');
            runAllTests();
        } else {
            console.log('⏳ Waiting for RayLoopStatus to load...');
            setTimeout(waitForDependencies, 1000);
        }
    }

    waitForDependencies();

    // Expose test functions
    window.FormatTimeFixTests = {
        runAll: runAllTests,
        testDisplay: testRayLoopStatusDisplay,
        testStates: testDifferentStates
    };

    console.log('✅ FormatTime Fix Test loaded');
    console.log('💡 Run window.FormatTimeFixTests.runAll() to test manually');

})();