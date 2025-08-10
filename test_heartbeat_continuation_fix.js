/**
 * Test: Heartbeat Continuation Fix
 * 
 * This test verifies that the heartbeat loop continues properly after the first beat
 */

(function() {
    'use strict';

    console.log('🧪 Testing Heartbeat Continuation Fix...');

    function testHeartbeatContinuation() {
        console.log('\n🚀 Starting Heartbeat Continuation Test...');
        
        if (typeof window.MessageLoop === 'undefined') {
            console.error('❌ MessageLoop not loaded');
            return false;
        }

        if (typeof window.RayLoopStatus === 'undefined') {
            console.error('❌ RayLoopStatus not loaded');
            return false;
        }

        // Initialize RayLoopStatus if needed
        if (!document.getElementById('ray-loop-status')) {
            window.RayLoopStatus.init();
        }

        let testResults = {
            firstBeat: false,
            nextRunSet: false,
            secondBeat: false,
            continuousBeats: 0
        };

        // Monitor for heartbeat events
        let responseCount = 0;
        let lastNextRun = null;
        let monitorCount = 0;

        const monitor = setInterval(() => {
            monitorCount++;
            const status = window.MessageLoop.getStatus();
            const loopState = window.RayLoopStatus.getState();
            
            console.log(`⏰ Monitor #${monitorCount}: Responses=${status.responseCount}, NextRun=${loopState.nextRun ? new Date(loopState.nextRun).toLocaleTimeString() : 'null'}`);
            
            // Check for first beat
            if (status.responseCount > 0 && !testResults.firstBeat) {
                testResults.firstBeat = true;
                console.log('✅ First heartbeat detected!');
            }
            
            // Check if next run time is set after first beat
            if (testResults.firstBeat && loopState.nextRun && !testResults.nextRunSet) {
                testResults.nextRunSet = true;
                console.log('✅ Next run time set after first beat!');
            }
            
            // Check for second beat
            if (status.responseCount > 1 && !testResults.secondBeat) {
                testResults.secondBeat = true;
                console.log('✅ Second heartbeat detected!');
            }
            
            // Count continuous beats
            if (status.responseCount > responseCount) {
                testResults.continuousBeats = status.responseCount;
                responseCount = status.responseCount;
                console.log(`🎯 Total heartbeats: ${responseCount}`);
            }
            
            // Check if loop stopped unexpectedly
            if (testResults.firstBeat && !status.running) {
                console.warn('⚠️ Loop stopped after first beat!');
            }
            
            // Stop monitoring after 60 seconds or 3 beats
            if (monitorCount >= 60 || testResults.continuousBeats >= 3) {
                clearInterval(monitor);
                showTestResults(testResults);
            }
        }, 1000);

        // Start the loop if not running
        if (!window.MessageLoop.isRunning) {
            console.log('▶️ Starting MessageLoop...');
            window.MessageLoop.startLoop();
            
            // Trigger first heartbeat
            setTimeout(() => {
                if (typeof window.MessageLoop.waitForFirstResponse === 'function') {
                    window.MessageLoop.waitForFirstResponse();
                } else {
                    console.warn('⚠️ waitForFirstResponse method not found');
                }
            }, 1000);
        } else {
            console.log('🔄 MessageLoop already running');
        }

        return true;
    }

    function showTestResults(results) {
        console.log('\n📊 Test Results:');
        console.log('================');
        console.log('First Beat:', results.firstBeat ? '✅ PASS' : '❌ FAIL');
        console.log('Next Run Set:', results.nextRunSet ? '✅ PASS' : '❌ FAIL');
        console.log('Second Beat:', results.secondBeat ? '✅ PASS' : '❌ FAIL');
        console.log('Total Beats:', results.continuousBeats);
        
        const overallPass = results.firstBeat && results.nextRunSet && results.secondBeat;
        console.log('\n🎯 Overall Result:', overallPass ? '✅ PASS - Heartbeat continuation working!' : '❌ FAIL - Issues detected');
        
        if (!overallPass) {
            console.log('\n🔧 Troubleshooting:');
            if (!results.firstBeat) {
                console.log('- First beat failed: Check MessageLoop and response observer');
            }
            if (!results.nextRunSet) {
                console.log('- Next run not set: Check if RayLoopStatus.setNextRun is called');
            }
            if (!results.secondBeat) {
                console.log('- Second beat failed: Check setTimeout and continuation logic');
            }
        }
    }

    function quickStatusCheck() {
        console.log('\n📊 Quick Status Check:');
        
        if (typeof window.MessageLoop !== 'undefined') {
            const status = window.MessageLoop.getStatus();
            console.log('MessageLoop running:', status.running);
            console.log('Response count:', status.responseCount);
            console.log('Next run time:', window.MessageLoop.nextRunTime ? new Date(window.MessageLoop.nextRunTime).toLocaleTimeString() : 'null');
        }
        
        if (typeof window.RayLoopStatus !== 'undefined') {
            const state = window.RayLoopStatus.getState();
            console.log('RayLoopStatus running:', state.isRunning);
            console.log('Next run display:', state.nextRun ? new Date(state.nextRun).toLocaleTimeString() : 'null');
            console.log('Status:', state.status);
        }
    }

    // Wait for dependencies
    function waitAndTest() {
        if (typeof window.MessageLoop !== 'undefined' && typeof window.RayLoopStatus !== 'undefined') {
            console.log('✅ Dependencies loaded, starting test...');
            testHeartbeatContinuation();
        } else {
            console.log('⏳ Waiting for dependencies...');
            setTimeout(waitAndTest, 1000);
        }
    }

    waitAndTest();

    // Expose test functions
    window.HeartbeatContinuationTest = {
        test: testHeartbeatContinuation,
        quickCheck: quickStatusCheck
    };

    console.log('✅ Heartbeat Continuation Test loaded');
    console.log('💡 Run window.HeartbeatContinuationTest.test() to test manually');

})();