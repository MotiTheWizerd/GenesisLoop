/**
 * Fix: MessageLoop Continuation Issue
 * 
 * This fixes the issue where MessageLoop stops after the first heartbeat
 * instead of continuing to send messages at the configured interval.
 */

(function() {
    'use strict';

    console.log('🔧 Fixing MessageLoop Continuation Issue...');

    function fixMessageLoopContinuation() {
        if (typeof window.MessageLoop === 'undefined') {
            console.error('❌ MessageLoop not available');
            return false;
        }

        console.log('🔧 Applying MessageLoop continuation fix...');

        // Store original methods
        const originalSetupResponseObserver = window.MessageLoop.setupResponseObserver;
        const originalStopLoop = window.MessageLoop.stopLoop;

        // Enhanced setupResponseObserver
        window.MessageLoop.setupResponseObserver = function() {
            console.log('🔧 Setting up enhanced response observer...');
            const self = this;

            // Check if DOMUtils is available
            if (typeof window.DOMUtils === 'undefined') {
                console.error('❌ DOMUtils not available for response observer');
                return;
            }

            console.log('🔧 DOMUtils available, calling waitForResponse...');

            // Set up observer to wait for response
            this.responseObserver = window.DOMUtils.waitForResponse((response) => {
                console.log('🎉 RESPONSE RECEIVED! Processing and scheduling next message...');
                console.log('📥 Response length:', response?.length);

                self.waitingForResponse = false;
                self.responseObserver = null;
                self.responseCount++;

                // Update status display immediately
                if (typeof window.RayLoopStatus !== 'undefined') {
                    window.RayLoopStatus.incrementResponses();
                    window.RayLoopStatus.setStatus('Processing Response');
                    window.RayLoopStatus.updateState({
                        lastRun: Date.now(),
                        responseCount: self.responseCount
                    });
                }

                // Store the response
                if (typeof window.ResponseTracker !== 'undefined') {
                    window.ResponseTracker.addResponse(response, {
                        source: 'messageLoop',
                        type: 'continuing_response',
                        loopIteration: self.attemptCount,
                        isHeartbeat: true,
                    });
                    console.log('💾 Response stored in tracker');
                }

                // Send JSON response to server
                self.sendResponseToServer(response);

                // Check if this is a reflect action response - IMPROVED LOGIC
                let shouldStop = false;
                try {
                    const jsonData = JSON.parse(response);
                    // Only stop for explicit reflect actions that are NOT heartbeat responses
                    if (jsonData && jsonData.action === 'reflect' && jsonData.type !== 'heartbeat') {
                        console.log('🧠 REFLECT ACTION DETECTED! Stopping heartbeat loop.');
                        shouldStop = true;
                    } else if (jsonData && jsonData.type === 'heartbeat') {
                        console.log('💓 Heartbeat response received, continuing loop');
                    }
                } catch (parseError) {
                    console.log('⚠️ Response is not JSON, continuing normal loop');
                }

                if (shouldStop) {
                    self.stopLoop();
                    if (typeof window.ToggleButton !== 'undefined') {
                        window.ToggleButton.resetToggleButton();
                    }
                    return;
                }

                // CRITICAL: Schedule the next message
                if (self.isRunning) {
                    console.log('⏳ Scheduling next message in continuing loop...');
                    const intervalMs = self.getInterval();
                    self.nextRunTime = Date.now() + intervalMs;
                    
                    console.log(`🕐 Next message scheduled for: ${new Date(self.nextRunTime).toLocaleTimeString()}`);
                    console.log(`⏰ Interval: ${intervalMs / 1000}s`);
                    
                    // Update status display with next run time
                    if (typeof window.RayLoopStatus !== 'undefined') {
                        window.RayLoopStatus.setNextRun(self.nextRunTime);
                        window.RayLoopStatus.setStatus('Waiting');
                    }
                    
                    // Schedule the next message
                    setTimeout(() => {
                        console.log('🔄 Executing scheduled next message...');
                        if (self.isRunning) {
                            self.sendMessageAndWaitForResponse();
                        } else {
                            console.warn('⚠️ Loop stopped before scheduled message could be sent');
                        }
                    }, intervalMs);
                } else {
                    console.log('⚠️ Loop is not running, not scheduling next message');
                }
            });

            if (!this.responseObserver) {
                console.error('❌ Failed to set up response observer');
            } else {
                console.log('✅ Response observer set up successfully');
            }
        };

        // Enhanced stopLoop to ensure proper cleanup
        window.MessageLoop.stopLoop = function() {
            console.log('🛑 Stopping MessageLoop with enhanced cleanup...');
            
            // Call original stop logic
            originalStopLoop.call(this);
            
            // Additional cleanup
            this.nextRunTime = null;
            
            // Update status display
            if (typeof window.RayLoopStatus !== 'undefined') {
                window.RayLoopStatus.setRunning(false);
                window.RayLoopStatus.setStatus('Stopped');
                window.RayLoopStatus.setNextRun(null);
            }
            
            console.log('✅ MessageLoop stopped with full cleanup');
        };

        console.log('✅ MessageLoop continuation fix applied');
        return true;
    }

    function testMessageLoopFix() {
        console.log('\n🧪 Testing MessageLoop Fix...');
        
        if (typeof window.MessageLoop === 'undefined') {
            console.error('❌ MessageLoop not available for testing');
            return;
        }

        // Check current state
        const status = window.MessageLoop.getStatus();
        console.log('📊 Current MessageLoop state:');
        console.log('- Running:', status.running);
        console.log('- Response Count:', status.responseCount);
        console.log('- Interval:', status.interval + 's');

        // Start monitoring
        let monitorCount = 0;
        let lastResponseCount = status.responseCount;
        
        const monitor = setInterval(() => {
            monitorCount++;
            const currentStatus = window.MessageLoop.getStatus();
            
            console.log(`⏰ Monitor ${monitorCount}: Running=${currentStatus.running}, Responses=${currentStatus.responseCount}`);
            
            if (currentStatus.responseCount > lastResponseCount) {
                console.log('🎉 New response detected!');
                lastResponseCount = currentStatus.responseCount;
            }
            
            if (!currentStatus.running && monitorCount > 1) {
                console.warn('⚠️ MessageLoop stopped unexpectedly!');
                clearInterval(monitor);
            }
            
            if (monitorCount >= 30) { // Monitor for 30 seconds
                clearInterval(monitor);
                console.log('🛑 Monitoring stopped after 30 seconds');
            }
        }, 1000);

        // If not running, start it
        if (!status.running) {
            console.log('▶️ Starting MessageLoop for test...');
            window.MessageLoop.startLoop();
            
            setTimeout(() => {
                if (typeof window.MessageLoop.waitForFirstResponse === 'function') {
                    window.MessageLoop.waitForFirstResponse();
                } else {
                    console.warn('⚠️ waitForFirstResponse method not found');
                }
            }, 1000);
        }
    }

    // Wait for dependencies and apply fix
    function waitAndFix() {
        if (typeof window.MessageLoop !== 'undefined' && typeof window.RayLoopStatus !== 'undefined') {
            console.log('✅ Dependencies loaded, applying fix...');
            const success = fixMessageLoopContinuation();
            
            if (success) {
                setTimeout(() => {
                    testMessageLoopFix();
                }, 2000);
            }
        } else {
            console.log('⏳ Waiting for MessageLoop and RayLoopStatus...');
            setTimeout(waitAndFix, 1000);
        }
    }

    waitAndFix();

    // Expose fix functions
    window.MessageLoopFix = {
        fix: fixMessageLoopContinuation,
        test: testMessageLoopFix
    };

    console.log('✅ MessageLoop Continuation Fix loaded');
    console.log('💡 Run window.MessageLoopFix.test() to test the fix');

})();