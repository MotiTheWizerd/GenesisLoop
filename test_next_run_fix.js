/**
 * Test: Next Run Display Fix
 * 
 * This test verifies that the "Next Run" field shows proper values instead of always "Now"
 */

(function() {
    'use strict';

    console.log('🧪 Testing Next Run Display Fix...');

    function testNextRunDisplay() {
        console.log('\n📊 Test: Next Run Display Logic');
        
        if (typeof window.RayLoopStatus === 'undefined') {
            console.error('❌ RayLoopStatus not loaded');
            return false;
        }

        // Initialize if not already done
        if (!document.getElementById('ray-loop-status')) {
            window.RayLoopStatus.init();
        }

        // Test 1: Loop not running - should show "Stopped"
        console.log('\n🔴 Test 1: Loop not running');
        window.RayLoopStatus.setRunning(false);
        window.RayLoopStatus.setNextRun(null);
        
        setTimeout(() => {
            const display = document.getElementById('ray-loop-status');
            const content = display ? display.textContent : '';
            console.log('Display content:', content.includes('Next Run:') ? content.match(/Next Run:\s*([^\n]+)/)[1] : 'Not found');
        }, 100);

        // Test 2: Loop running with explicit next run time
        setTimeout(() => {
            console.log('\n🟢 Test 2: Loop running with scheduled next run');
            window.RayLoopStatus.setRunning(true);
            const nextRun = Date.now() + 15000; // 15 seconds from now
            window.RayLoopStatus.setNextRun(nextRun);
            
            setTimeout(() => {
                const display = document.getElementById('ray-loop-status');
                const content = display ? display.textContent : '';
                const nextRunMatch = content.match(/Next Run:\s*([^\n]+)/);
                console.log('Next run display:', nextRunMatch ? nextRunMatch[1].trim() : 'Not found');
            }, 100);
        }, 2000);

        // Test 3: Loop running with last run but no explicit next run
        setTimeout(() => {
            console.log('\n🟡 Test 3: Loop running with last run, no explicit next run');
            window.RayLoopStatus.setRunning(true);
            window.RayLoopStatus.setNextRun(null); // Clear explicit next run
            window.RayLoopStatus.updateState({
                lastRun: Date.now() - 10000, // 10 seconds ago
                interval: 30000 // 30 second interval
            });
            
            setTimeout(() => {
                const display = document.getElementById('ray-loop-status');
                const content = display ? display.textContent : '';
                const nextRunMatch = content.match(/Next Run:\s*([^\n]+)/);
                console.log('Next run display (calculated):', nextRunMatch ? nextRunMatch[1].trim() : 'Not found');
            }, 100);
        }, 4000);

        // Test 4: Loop running but overdue (should show "Now")
        setTimeout(() => {
            console.log('\n🔥 Test 4: Loop running but overdue');
            window.RayLoopStatus.setRunning(true);
            window.RayLoopStatus.setNextRun(null);
            window.RayLoopStatus.updateState({
                lastRun: Date.now() - 60000, // 1 minute ago
                interval: 30000 // 30 second interval (so it's overdue)
            });
            
            setTimeout(() => {
                const display = document.getElementById('ray-loop-status');
                const content = display ? display.textContent : '';
                const nextRunMatch = content.match(/Next Run:\s*([^\n]+)/);
                console.log('Next run display (overdue):', nextRunMatch ? nextRunMatch[1].trim() : 'Not found');
            }, 100);
        }, 6000);

        // Test 5: Live countdown test
        setTimeout(() => {
            console.log('\n⏰ Test 5: Live countdown test');
            window.RayLoopStatus.setRunning(true);
            const nextRun = Date.now() + 10000; // 10 seconds from now
            window.RayLoopStatus.setNextRun(nextRun);
            
            console.log('Starting 5-second countdown observation...');
            let countdownChecks = 0;
            const countdownInterval = setInterval(() => {
                countdownChecks++;
                const display = document.getElementById('ray-loop-status');
                const content = display ? display.textContent : '';
                const nextRunMatch = content.match(/Next Run:\s*([^\n]+)/);
                const timeRemaining = nextRunMatch ? nextRunMatch[1].trim() : 'Not found';
                
                console.log(`⏱️ Check ${countdownChecks}: ${timeRemaining}`);
                
                if (countdownChecks >= 5) {
                    clearInterval(countdownInterval);
                    console.log('✅ Countdown test completed');
                }
            }, 1000);
        }, 8000);

        return true;
    }

    function testIntervalSync() {
        console.log('\n🔄 Test: Interval Synchronization');
        
        if (typeof window.MessageLoop === 'undefined' || typeof window.RaySettings === 'undefined') {
            console.warn('⚠️ MessageLoop or RaySettings not available');
            return false;
        }

        const originalInterval = window.RaySettings.get('messageLoop.interval');
        console.log('Original interval:', originalInterval + 's');

        // Change interval and check if display updates
        const testInterval = originalInterval === 30 ? 45 : 30;
        console.log('Changing to:', testInterval + 's');
        
        window.RaySettings.set('messageLoop.interval', testInterval);
        
        setTimeout(() => {
            const state = window.RayLoopStatus.getState();
            const displayedInterval = state.interval / 1000;
            
            if (displayedInterval === testInterval) {
                console.log('✅ Interval sync working');
            } else {
                console.log('❌ Interval sync failed');
                console.log('Expected:', testInterval + 's', 'Got:', displayedInterval + 's');
            }
            
            // Restore original
            window.RaySettings.set('messageLoop.interval', originalInterval);
        }, 500);

        return true;
    }

    function runAllTests() {
        console.log('🚀 Starting Next Run Display Fix Tests...\n');
        
        testNextRunDisplay();
        
        setTimeout(() => {
            testIntervalSync();
        }, 15000);
        
        setTimeout(() => {
            console.log('\n🎉 All tests completed!');
            console.log('💡 Check the Ray Loop Status display to verify the fixes are working');
        }, 20000);
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
    window.NextRunFixTests = {
        runAll: runAllTests,
        testDisplay: testNextRunDisplay,
        testSync: testIntervalSync
    };

    console.log('✅ Next Run Display Fix Test loaded');
    console.log('💡 Run window.NextRunFixTests.runAll() to test manually');

})();