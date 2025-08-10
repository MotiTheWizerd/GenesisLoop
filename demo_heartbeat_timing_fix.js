/**
 * Demo: Heartbeat Timing Control Fix
 * 
 * This demo shows the fixed heartbeat timing control in action:
 * 1. Shows real-time interval updates
 * 2. Demonstrates countdown timer
 * 3. Tests interval changes from different sources
 */

(function() {
    'use strict';

    console.log('🎬 Demo: Heartbeat Timing Control Fix');

    function runDemo() {
        console.log('\n🚀 Starting Heartbeat Timing Control Demo...');

        // Step 1: Initialize and show current state
        console.log('\n📊 Step 1: Current State');
        if (window.RayLoopStatus) {
            if (!document.getElementById('ray-loop-status')) {
                window.RayLoopStatus.init();
            }
            
            const state = window.RayLoopStatus.getState();
            console.log('Current interval:', state.interval / 1000 + 's');
            console.log('Running:', state.isRunning);
            console.log('Status:', state.status);
        }

        // Step 2: Demonstrate interval change
        setTimeout(() => {
            console.log('\n🔧 Step 2: Changing interval to 15 seconds');
            if (window.MessageLoop) {
                window.MessageLoop.setInterval(15);
                console.log('✅ Interval changed - watch the display update!');
            }
        }, 2000);

        // Step 3: Set up a countdown demonstration
        setTimeout(() => {
            console.log('\n⏰ Step 3: Setting up countdown demonstration');
            const nextRun = Date.now() + 30000; // 30 seconds from now
            if (window.RayLoopStatus) {
                window.RayLoopStatus.setNextRun(nextRun);
                console.log('✅ Next run set to 30 seconds from now - watch the countdown!');
            }
        }, 4000);

        // Step 4: Change interval again to show real-time updates
        setTimeout(() => {
            console.log('\n🔄 Step 4: Changing interval to 45 seconds');
            if (window.MessageLoop) {
                window.MessageLoop.setInterval(45);
                console.log('✅ Interval changed again - display should update immediately!');
            }
        }, 8000);

        // Step 5: Restore original interval
        setTimeout(() => {
            console.log('\n🔧 Step 5: Restoring original interval (30 seconds)');
            if (window.MessageLoop) {
                window.MessageLoop.setInterval(30);
                console.log('✅ Original interval restored');
            }
        }, 12000);

        // Step 6: Show final state
        setTimeout(() => {
            console.log('\n📊 Step 6: Final State');
            if (window.RayLoopStatus) {
                const state = window.RayLoopStatus.getState();
                console.log('Final interval:', state.interval / 1000 + 's');
                console.log('Running:', state.isRunning);
                console.log('Status:', state.status);
            }
            
            console.log('\n🎉 Demo completed!');
            console.log('💡 Key improvements:');
            console.log('   ✅ Real-time interval updates from MessageLoop/RaySettings');
            console.log('   ✅ Live countdown timer with color coding');
            console.log('   ✅ Immediate response to popup interval changes');
            console.log('   ✅ Automatic sync when settings change');
        }, 15000);
    }

    // Wait for dependencies and run demo
    function waitAndRun() {
        if (typeof window.RayLoopStatus !== 'undefined' && 
            typeof window.MessageLoop !== 'undefined' && 
            typeof window.RaySettings !== 'undefined') {
            runDemo();
        } else {
            console.log('⏳ Waiting for dependencies to load...');
            setTimeout(waitAndRun, 1000);
        }
    }

    waitAndRun();

    // Expose demo function
    window.HeartbeatTimingDemo = {
        run: runDemo
    };

    console.log('✅ Heartbeat Timing Control Demo loaded');
    console.log('💡 Run window.HeartbeatTimingDemo.run() to start demo');

})();