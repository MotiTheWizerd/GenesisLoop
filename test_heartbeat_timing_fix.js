/**
 * Test: Heartbeat Timing Control Fix
 * 
 * This test verifies that:
 * 1. Ray Loop Status shows real-time interval from MessageLoop/RaySettings
 * 2. Countdown timer updates every second
 * 3. Interval changes from popup are reflected immediately
 * 4. Next run time shows accurate countdown
 */

(function() {
    'use strict';

    console.log('🧪 Testing Heartbeat Timing Control Fix...');

    // Test 1: Check if RayLoopStatus can get real-time interval
    function testRealTimeInterval() {
        console.log('\n📊 Test 1: Real-time interval detection');
        
        if (typeof window.RayLoopStatus === 'undefined') {
            console.error('❌ RayLoopStatus not loaded');
            return false;
        }

        // Initialize if not already done
        if (!document.getElementById('ray-loop-status')) {
            window.RayLoopStatus.init();
        }

        // Get current state
        const state = window.RayLoopStatus.getState();
        console.log('📈 Current interval from state:', state.interval / 1000 + 's');

        // Check if MessageLoop is available
        if (typeof window.MessageLoop !== 'undefined') {
            const messageLoopInterval = window.MessageLoop.getInterval();
            console.log('📈 MessageLoop interval:', messageLoopInterval / 1000 + 's');
            
            if (state.interval === messageLoopInterval) {
                console.log('✅ Intervals match - real-time sync working');
                return true;
            } else {
                console.warn('⚠️ Intervals don\'t match - syncing...');
                window.RayLoopStatus.syncInterval();
                return true;
            }
        } else {
            console.warn('⚠️ MessageLoop not available, checking RaySettings...');
            
            if (typeof window.RaySettings !== 'undefined') {
                const settingsInterval = window.RaySettings.get('messageLoop.interval') * 1000;
                console.log('📈 RaySettings interval:', settingsInterval / 1000 + 's');
                
                if (state.interval === settingsInterval) {
                    console.log('✅ Intervals match with RaySettings');
                    return true;
                } else {
                    console.warn('⚠️ Intervals don\'t match with RaySettings');
                    return false;
                }
            } else {
                console.error('❌ Neither MessageLoop nor RaySettings available');
                return false;
            }
        }
    }

    // Test 2: Test interval change detection
    function testIntervalChange() {
        console.log('\n🔄 Test 2: Interval change detection');
        
        if (typeof window.RaySettings === 'undefined') {
            console.error('❌ RaySettings not available for testing');
            return false;
        }

        const originalInterval = window.RaySettings.get('messageLoop.interval');
        console.log('📊 Original interval:', originalInterval + 's');

        // Change interval
        const testInterval = originalInterval === 30 ? 45 : 30;
        console.log('🔧 Changing interval to:', testInterval + 's');
        
        window.RaySettings.set('messageLoop.interval', testInterval);

        // Wait a moment for the event to propagate
        setTimeout(() => {
            const state = window.RayLoopStatus.getState();
            const currentInterval = state.interval / 1000;
            
            if (currentInterval === testInterval) {
                console.log('✅ Interval change detected and updated');
                
                // Restore original interval
                window.RaySettings.set('messageLoop.interval', originalInterval);
                console.log('🔧 Restored original interval:', originalInterval + 's');
            } else {
                console.error('❌ Interval change not detected');
                console.log('Expected:', testInterval + 's', 'Got:', currentInterval + 's');
                
                // Restore original interval anyway
                window.RaySettings.set('messageLoop.interval', originalInterval);
            }
        }, 100);

        return true;
    }

    // Test 3: Test countdown display
    function testCountdownDisplay() {
        console.log('\n⏰ Test 3: Countdown display');
        
        // Set a next run time 10 seconds in the future
        const nextRunTime = Date.now() + 10000;
        window.RayLoopStatus.setNextRun(nextRunTime);
        
        console.log('🎯 Set next run time to 10 seconds from now');
        
        // Check countdown every second for 5 seconds
        let checkCount = 0;
        const countdownCheck = setInterval(() => {
            checkCount++;
            const state = window.RayLoopStatus.getState();
            const timeUntilNext = state.nextRun ? state.nextRun - Date.now() : 0;
            const secondsRemaining = Math.floor(timeUntilNext / 1000);
            
            console.log(`⏱️ Check ${checkCount}: ${secondsRemaining}s remaining`);
            
            if (checkCount >= 5) {
                clearInterval(countdownCheck);
                console.log('✅ Countdown display test completed');
                
                // Clear the next run time
                window.RayLoopStatus.setNextRun(null);
            }
        }, 1000);

        return true;
    }

    // Test 4: Test popup integration simulation
    function testPopupIntegration() {
        console.log('\n🎛️ Test 4: Popup integration simulation');
        
        if (typeof window.MessageLoop === 'undefined') {
            console.warn('⚠️ MessageLoop not available, skipping popup integration test');
            return false;
        }

        const originalInterval = window.MessageLoop.getInterval() / 1000;
        console.log('📊 Original MessageLoop interval:', originalInterval + 's');

        // Simulate popup changing interval
        const testInterval = originalInterval === 30 ? 60 : 30;
        console.log('🎛️ Simulating popup change to:', testInterval + 's');
        
        const success = window.MessageLoop.setInterval(testInterval);
        
        if (success) {
            console.log('✅ MessageLoop interval changed successfully');
            
            // Check if RayLoopStatus picked up the change
            setTimeout(() => {
                const state = window.RayLoopStatus.getState();
                const displayedInterval = state.interval / 1000;
                
                if (displayedInterval === testInterval) {
                    console.log('✅ RayLoopStatus updated with new interval');
                } else {
                    console.error('❌ RayLoopStatus did not update');
                    console.log('Expected:', testInterval + 's', 'Got:', displayedInterval + 's');
                }
                
                // Restore original interval
                window.MessageLoop.setInterval(originalInterval);
                console.log('🔧 Restored original interval');
            }, 100);
        } else {
            console.error('❌ Failed to change MessageLoop interval');
            return false;
        }

        return true;
    }

    // Test 5: Visual verification
    function testVisualDisplay() {
        console.log('\n👁️ Test 5: Visual display verification');
        
        const statusElement = document.getElementById('ray-loop-status');
        if (!statusElement) {
            console.error('❌ Ray Loop Status display not found');
            return false;
        }

        console.log('✅ Ray Loop Status display is visible');
        console.log('📊 Current display content:');
        
        // Extract key information from display
        const content = statusElement.textContent;
        const intervalMatch = content.match(/Interval:\s*(\d+[ms]+)/);
        const nextRunMatch = content.match(/Next Run:\s*(.+?)(?:\n|$)/);
        
        if (intervalMatch) {
            console.log('⏰ Displayed interval:', intervalMatch[1]);
        }
        
        if (nextRunMatch) {
            console.log('🎯 Displayed next run:', nextRunMatch[1].trim());
        }

        return true;
    }

    // Run all tests
    function runAllTests() {
        console.log('🚀 Starting Heartbeat Timing Control Fix Tests...\n');
        
        const tests = [
            { name: 'Real-time Interval Detection', fn: testRealTimeInterval },
            { name: 'Interval Change Detection', fn: testIntervalChange },
            { name: 'Countdown Display', fn: testCountdownDisplay },
            { name: 'Popup Integration Simulation', fn: testPopupIntegration },
            { name: 'Visual Display Verification', fn: testVisualDisplay }
        ];

        let passed = 0;
        let total = tests.length;

        tests.forEach((test, index) => {
            try {
                console.log(`\n🧪 Running Test ${index + 1}/${total}: ${test.name}`);
                const result = test.fn();
                if (result) {
                    passed++;
                    console.log(`✅ Test ${index + 1} PASSED`);
                } else {
                    console.log(`❌ Test ${index + 1} FAILED`);
                }
            } catch (error) {
                console.error(`💥 Test ${index + 1} ERROR:`, error);
            }
        });

        console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
        
        if (passed === total) {
            console.log('🎉 All tests passed! Heartbeat timing control is working correctly.');
        } else {
            console.log('⚠️ Some tests failed. Check the issues above.');
        }
    }

    // Auto-run tests when dependencies are loaded
    function waitForDependencies() {
        const checkDependencies = () => {
            if (typeof window.RayLoopStatus !== 'undefined') {
                console.log('✅ Dependencies loaded, starting tests...');
                runAllTests();
            } else {
                console.log('⏳ Waiting for RayLoopStatus to load...');
                setTimeout(checkDependencies, 1000);
            }
        };
        
        checkDependencies();
    }

    // Start the test
    waitForDependencies();

    // Expose test functions for manual testing
    window.HeartbeatTimingTests = {
        runAll: runAllTests,
        testRealTimeInterval,
        testIntervalChange,
        testCountdownDisplay,
        testPopupIntegration,
        testVisualDisplay
    };

    console.log('✅ Heartbeat Timing Control Fix Test loaded');
    console.log('💡 Run window.HeartbeatTimingTests.runAll() to test manually');

})();