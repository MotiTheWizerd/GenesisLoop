/**
 * Force MessageLoop Simple Fix
 * 
 * This creates a simple, reliable message loop that bypasses complex logic
 * and just sends messages at the specified interval.
 */

(function() {
    'use strict';

    console.log('🔧 Creating Simple MessageLoop Fix...');

    let simpleLoopInterval = null;
    let isSimpleLoopRunning = false;

    function createSimpleMessageLoop() {
        console.log('🚀 Creating simple message loop...');

        function sendMessage() {
            console.log('📤 Simple loop: Sending message...');
            
            // Update status
            if (typeof window.RayLoopStatus !== 'undefined') {
                window.RayLoopStatus.setStatus('Sending Message');
                window.RayLoopStatus.updateState({
                    lastRun: Date.now()
                });
            }

            // Get heartbeat data and send
            if (typeof window.FetchSender !== 'undefined') {
                window.FetchSender.getHeartbeat()
                    .then((heartbeatResult) => {
                        if (heartbeatResult.success) {
                            const heartbeatJson = JSON.stringify(heartbeatResult.data);
                            console.log('💓 Got heartbeat data, sending to ChatGPT...');

                            // Send using MessageSender
                            if (typeof window.MessageSender !== 'undefined') {
                                const success = window.MessageSender.sendTestMessage(
                                    heartbeatJson,
                                    () => {
                                        console.log('❌ Message send failed');
                                    },
                                    true // Skip MessageSender's response handling
                                );

                                if (success) {
                                    console.log('✅ Message sent successfully');
                                    
                                    // Update response count
                                    if (typeof window.RayLoopStatus !== 'undefined') {
                                        window.RayLoopStatus.incrementResponses();
                                    }
                                } else {
                                    console.log('❌ Message send returned false');
                                }
                            }
                        } else {
                            console.error('❌ Heartbeat failed:', heartbeatResult.error);
                        }
                    })
                    .catch((error) => {
                        console.error('❌ Heartbeat error:', error);
                    });
            } else {
                console.warn('⚠️ FetchSender not available');
            }

            // Schedule next message
            if (isSimpleLoopRunning) {
                const intervalSeconds = window.RaySettings?.get('messageLoop.interval') || 15;
                const intervalMs = intervalSeconds * 1000;
                const nextRunTime = Date.now() + intervalMs;
                
                console.log(`⏰ Next message scheduled in ${intervalSeconds}s`);
                
                // Update status display
                if (typeof window.RayLoopStatus !== 'undefined') {
                    window.RayLoopStatus.setNextRun(nextRunTime);
                    window.RayLoopStatus.setStatus('Waiting');
                }
            }
        }

        function startSimpleLoop() {
            if (isSimpleLoopRunning) {
                console.log('⚠️ Simple loop already running');
                return;
            }

            console.log('▶️ Starting simple message loop...');
            isSimpleLoopRunning = true;

            // Update status
            if (typeof window.RayLoopStatus !== 'undefined') {
                window.RayLoopStatus.setRunning(true);
                window.RayLoopStatus.setStatus('Simple Loop Running');
            }

            // Get interval
            const intervalSeconds = window.RaySettings?.get('messageLoop.interval') || 15;
            const intervalMs = intervalSeconds * 1000;
            
            console.log(`⏰ Using interval: ${intervalSeconds}s`);

            // Send first message immediately
            sendMessage();

            // Set up interval for subsequent messages
            simpleLoopInterval = setInterval(() => {
                if (isSimpleLoopRunning) {
                    sendMessage();
                } else {
                    console.log('🛑 Simple loop stopped, clearing interval');
                    clearInterval(simpleLoopInterval);
                    simpleLoopInterval = null;
                }
            }, intervalMs);

            console.log('✅ Simple message loop started');
        }

        function stopSimpleLoop() {
            console.log('🛑 Stopping simple message loop...');
            isSimpleLoopRunning = false;

            if (simpleLoopInterval) {
                clearInterval(simpleLoopInterval);
                simpleLoopInterval = null;
            }

            // Update status
            if (typeof window.RayLoopStatus !== 'undefined') {
                window.RayLoopStatus.setRunning(false);
                window.RayLoopStatus.setStatus('Simple Loop Stopped');
                window.RayLoopStatus.setNextRun(null);
            }

            console.log('✅ Simple message loop stopped');
        }

        function getSimpleLoopStatus() {
            return {
                running: isSimpleLoopRunning,
                interval: window.RaySettings?.get('messageLoop.interval') || 15,
                hasInterval: !!simpleLoopInterval
            };
        }

        return {
            start: startSimpleLoop,
            stop: stopSimpleLoop,
            status: getSimpleLoopStatus,
            isRunning: () => isSimpleLoopRunning
        };
    }

    // Create the simple loop
    const simpleLoop = createSimpleMessageLoop();

    // Expose it globally
    window.SimpleMessageLoop = simpleLoop;

    // Also patch the original MessageLoop to use simple logic
    function patchOriginalMessageLoop() {
        if (typeof window.MessageLoop !== 'undefined') {
            console.log('🔧 Patching original MessageLoop...');

            // Override startLoop
            window.MessageLoop.startLoop = function() {
                console.log('🔄 Original MessageLoop.startLoop called, using simple loop instead');
                simpleLoop.start();
                
                // Update internal state to match
                this.isRunning = true;
                this.attemptCount = 0;
                this.waitingForResponse = false;
                this.responseCount = 0;
                this.errorCount = 0;
            };

            // Override stopLoop
            window.MessageLoop.stopLoop = function() {
                console.log('🔄 Original MessageLoop.stopLoop called, stopping simple loop');
                simpleLoop.stop();
                
                // Update internal state to match
                this.isRunning = false;
                this.waitingForResponse = false;
                this.attemptCount = 0;
                this.nextRunTime = null;
            };

            // Override getStatus
            const originalGetStatus = window.MessageLoop.getStatus;
            window.MessageLoop.getStatus = function() {
                const originalStatus = originalGetStatus.call(this);
                const simpleStatus = simpleLoop.status();
                
                return {
                    ...originalStatus,
                    running: simpleStatus.running,
                    interval: simpleStatus.interval
                };
            };

            console.log('✅ Original MessageLoop patched');
        }
    }

    // Wait for dependencies and patch
    function waitAndPatch() {
        if (typeof window.MessageLoop !== 'undefined' && 
            typeof window.RayLoopStatus !== 'undefined' &&
            typeof window.RaySettings !== 'undefined') {
            
            console.log('✅ Dependencies loaded, patching MessageLoop...');
            patchOriginalMessageLoop();
            
            // Auto-start if the original loop was trying to run
            if (window.MessageLoop.isRunning) {
                console.log('🔄 Original loop was running, starting simple loop...');
                simpleLoop.start();
            }
        } else {
            console.log('⏳ Waiting for dependencies...');
            setTimeout(waitAndPatch, 1000);
        }
    }

    waitAndPatch();

    console.log('✅ Simple MessageLoop Fix loaded');
    console.log('💡 Available commands:');
    console.log('  - window.SimpleMessageLoop.start()');
    console.log('  - window.SimpleMessageLoop.stop()');
    console.log('  - window.SimpleMessageLoop.status()');

})();