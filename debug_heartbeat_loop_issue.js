/**
 * Debug: Heartbeat Loop Issue
 * 
 * This script helps diagnose why the heartbeat loop stops after the first beat
 */

(function() {
    'use strict';

    console.log('🔍 Debugging Heartbeat Loop Issue...');

    function debugMessageLoop() {
        console.log('\n📊 MessageLoop State Check:');
        
        if (typeof window.MessageLoop === 'undefined') {
            console.error('❌ MessageLoop not loaded');
            return;
        }

        const status = window.MessageLoop.getStatus();
        console.log('Running:', status.running);
        console.log('Interval:', status.interval + 's');
        console.log('Response Count:', status.responseCount);
        console.log('Error Count:', status.errorCount);
        console.log('Last Run:', status.lastRun);
        console.log('Next Run:', status.nextRun);

        // Check internal state
        console.log('\n🔧 Internal MessageLoop State:');
        console.log('isRunning:', window.MessageLoop.isRunning);
        console.log('waitingForResponse:', window.MessageLoop.waitingForResponse);
        console.log('nextRunTime:', window.MessageLoop.nextRunTime);
        console.log('attemptCount:', window.MessageLoop.attemptCount);
    }

    function debugRayLoopStatus() {
        console.log('\n📊 RayLoopStatus State Check:');
        
        if (typeof window.RayLoopStatus === 'undefined') {
            console.error('❌ RayLoopStatus not loaded');
            return;
        }

        const state = window.RayLoopStatus.getState();
        console.log('Running:', state.isRunning);
        console.log('Last Run:', state.lastRun ? new Date(state.lastRun).toLocaleTimeString() : 'Never');
        console.log('Next Run:', state.nextRun ? new Date(state.nextRun).toLocaleTimeString() : 'Not set');
        console.log('Interval:', state.interval / 1000 + 's');
        console.log('Status:', state.status);
    }

    function monitorHeartbeatLoop() {
        console.log('\n👁️ Starting Heartbeat Loop Monitor...');
        
        let lastResponseCount = 0;
        let lastNextRun = null;
        let monitorCount = 0;

        const monitor = setInterval(() => {
            monitorCount++;
            console.log(`\n⏰ Monitor Check #${monitorCount}:`);
            
            if (typeof window.MessageLoop !== 'undefined') {
                const status = window.MessageLoop.getStatus();
                
                // Check if response count changed (new heartbeat)
                if (status.responseCount !== lastResponseCount) {
                    console.log('🎉 New heartbeat detected!');
                    console.log('Response count:', lastResponseCount, '→', status.responseCount);
                    lastResponseCount = status.responseCount;
                }
                
                // Check next run time
                if (window.MessageLoop.nextRunTime !== lastNextRun) {
                    console.log('🕐 Next run time changed:');
                    console.log('From:', lastNextRun ? new Date(lastNextRun).toLocaleTimeString() : 'null');
                    console.log('To:', window.MessageLoop.nextRunTime ? new Date(window.MessageLoop.nextRunTime).toLocaleTimeString() : 'null');
                    lastNextRun = window.MessageLoop.nextRunTime;
                }
                
                // Check if loop is stuck
                if (status.running && !window.MessageLoop.waitingForResponse && !window.MessageLoop.nextRunTime) {
                    console.warn('⚠️ Loop appears to be stuck! Running but no next run time set.');
                }
                
                // Check if waiting too long for response
                if (window.MessageLoop.waitingForResponse) {
                    console.log('⏳ Still waiting for response...');
                }
            }
            
            if (monitorCount >= 20) { // Stop after 20 checks (20 seconds)
                clearInterval(monitor);
                console.log('🛑 Monitor stopped after 20 checks');
            }
        }, 1000);
        
        return monitor;
    }

    function testHeartbeatContinuation() {
        console.log('\n🧪 Testing Heartbeat Continuation...');
        
        if (typeof window.MessageLoop === 'undefined') {
            console.error('❌ MessageLoop not available');
            return;
        }

        // Check if loop is running
        if (!window.MessageLoop.isRunning) {
            console.log('▶️ Starting MessageLoop for test...');
            window.MessageLoop.startLoop();
            
            // Wait a moment then start first message
            setTimeout(() => {
                if (typeof window.MessageLoop.waitForFirstResponse === 'function') {
                    window.MessageLoop.waitForFirstResponse();
                } else {
                    console.warn('⚠️ waitForFirstResponse method not found');
                }
            }, 1000);
        }
        
        // Start monitoring
        monitorHeartbeatLoop();
    }

    function fixHeartbeatContinuation() {
        console.log('\n🔧 Attempting to fix heartbeat continuation...');
        
        if (typeof window.MessageLoop === 'undefined') {
            console.error('❌ MessageLoop not available');
            return;
        }

        // Add a patch to ensure nextRunTime is always set
        const originalSendMessageAndWaitForResponse = window.MessageLoop.sendMessageAndWaitForResponse;
        
        window.MessageLoop.sendMessageAndWaitForResponse = function() {
            console.log('🔄 sendMessageAndWaitForResponse called');
            
            // Call original function
            const result = originalSendMessageAndWaitForResponse.call(this);
            
            // Ensure nextRunTime is set if loop is running
            if (this.isRunning && !this.nextRunTime && !this.waitingForResponse) {
                const intervalMs = this.getInterval();
                this.nextRunTime = Date.now() + intervalMs;
                console.log('🔧 Fixed: Set nextRunTime to', new Date(this.nextRunTime).toLocaleTimeString());
                
                // Update RayLoopStatus
                if (typeof window.RayLoopStatus !== 'undefined') {
                    window.RayLoopStatus.setNextRun(this.nextRunTime);
                }
            }
            
            return result;
        };
        
        console.log('✅ Heartbeat continuation patch applied');
    }

    // Main debug function
    function runFullDiagnostic() {
        console.log('🚀 Running Full Heartbeat Diagnostic...\n');
        
        debugMessageLoop();
        debugRayLoopStatus();
        
        setTimeout(() => {
            testHeartbeatContinuation();
        }, 2000);
    }

    // Wait for dependencies
    function waitAndRun() {
        if (typeof window.MessageLoop !== 'undefined' && typeof window.RayLoopStatus !== 'undefined') {
            runFullDiagnostic();
        } else {
            console.log('⏳ Waiting for MessageLoop and RayLoopStatus...');
            setTimeout(waitAndRun, 1000);
        }
    }

    waitAndRun();

    // Expose debug functions
    window.HeartbeatLoopDebug = {
        debugMessageLoop,
        debugRayLoopStatus,
        monitorHeartbeatLoop,
        testHeartbeatContinuation,
        fixHeartbeatContinuation,
        runFullDiagnostic
    };

    console.log('✅ Heartbeat Loop Debug loaded');
    console.log('💡 Available functions:');
    console.log('  - window.HeartbeatLoopDebug.runFullDiagnostic()');
    console.log('  - window.HeartbeatLoopDebug.fixHeartbeatContinuation()');
    console.log('  - window.HeartbeatLoopDebug.monitorHeartbeatLoop()');

})();