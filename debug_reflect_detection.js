/**
 * Debug: Reflect Detection Issue
 * 
 * This script helps debug why the reflect detection is stopping the heartbeat loop
 */

(function() {
    'use strict';

    console.log('🔍 Debugging Reflect Detection Issue...');

    // Intercept and log all responses
    function interceptResponses() {
        console.log('🎯 Setting up response interception...');
        
        // Hook into ResponseTracker if available
        if (typeof window.ResponseTracker !== 'undefined' && window.ResponseTracker.addResponse) {
            const originalAddResponse = window.ResponseTracker.addResponse;
            
            window.ResponseTracker.addResponse = function(response, metadata) {
                console.log('\n📥 Response Intercepted:');
                console.log('Length:', response?.length || 0);
                console.log('Metadata:', metadata);
                
                // Try to parse as JSON
                try {
                    const jsonData = JSON.parse(response);
                    console.log('📊 Parsed JSON:');
                    console.log('- Type:', jsonData.type);
                    console.log('- Action:', jsonData.action);
                    console.log('- Has ray_state:', !!jsonData.ray_state);
                    
                    // Check reflect detection logic
                    const isReflectAction = jsonData && jsonData.action === "reflect";
                    const isHeartbeat = jsonData && jsonData.type === "heartbeat";
                    
                    console.log('🧠 Reflect Detection:');
                    console.log('- Is reflect action:', isReflectAction);
                    console.log('- Is heartbeat:', isHeartbeat);
                    console.log('- Would stop loop:', isReflectAction && !isHeartbeat);
                    
                    if (isReflectAction && !isHeartbeat) {
                        console.warn('⚠️ This response would stop the heartbeat loop!');
                        console.log('Full response:', JSON.stringify(jsonData, null, 2));
                    }
                    
                } catch (parseError) {
                    console.log('⚠️ Response is not valid JSON');
                    console.log('First 200 chars:', response?.substring(0, 200));
                }
                
                // Call original function
                return originalAddResponse.call(this, response, metadata);
            };
            
            console.log('✅ Response interception set up');
        } else {
            console.warn('⚠️ ResponseTracker not available for interception');
        }
    }

    // Monitor MessageLoop state changes
    function monitorMessageLoop() {
        console.log('👁️ Starting MessageLoop monitor...');
        
        let lastRunning = null;
        let lastResponseCount = 0;
        
        const monitor = setInterval(() => {
            if (typeof window.MessageLoop !== 'undefined') {
                const status = window.MessageLoop.getStatus();
                
                // Check for state changes
                if (status.running !== lastRunning) {
                    console.log(`🔄 MessageLoop state changed: ${lastRunning} → ${status.running}`);
                    if (!status.running && lastRunning === true) {
                        console.warn('⚠️ MessageLoop stopped! Checking why...');
                        
                        // Check recent responses
                        if (typeof window.ResponseTracker !== 'undefined') {
                            const recentResponses = window.ResponseTracker.getResponses().slice(0, 3);
                            console.log('📋 Recent responses:', recentResponses.length);
                            
                            recentResponses.forEach((resp, index) => {
                                try {
                                    const jsonData = JSON.parse(resp.text);
                                    console.log(`Response ${index + 1}:`, {
                                        type: jsonData.type,
                                        action: jsonData.action,
                                        timestamp: resp.timestamp
                                    });
                                } catch (e) {
                                    console.log(`Response ${index + 1}: Not JSON`);
                                }
                            });
                        }
                    }
                    lastRunning = status.running;
                }
                
                // Check for new responses
                if (status.responseCount > lastResponseCount) {
                    console.log(`📈 New response detected: ${lastResponseCount} → ${status.responseCount}`);
                    lastResponseCount = status.responseCount;
                }
            }
        }, 1000);
        
        // Stop monitoring after 2 minutes
        setTimeout(() => {
            clearInterval(monitor);
            console.log('🛑 MessageLoop monitoring stopped');
        }, 120000);
        
        return monitor;
    }

    // Test reflect detection logic
    function testReflectDetection() {
        console.log('\n🧪 Testing Reflect Detection Logic...');
        
        const testCases = [
            {
                name: 'Heartbeat Response',
                data: { type: 'heartbeat', action: 'heartbeat', ray_state: 'active' }
            },
            {
                name: 'Reflect Action (should stop)',
                data: { action: 'reflect', content: 'reflection content' }
            },
            {
                name: 'Heartbeat with Reflect Action (should NOT stop)',
                data: { type: 'heartbeat', action: 'reflect', ray_state: 'active' }
            },
            {
                name: 'Regular Response',
                data: { message: 'Hello, this is a regular response' }
            }
        ];
        
        testCases.forEach(testCase => {
            console.log(`\n🔬 Testing: ${testCase.name}`);
            const jsonData = testCase.data;
            
            const isReflectAction = jsonData && jsonData.action === "reflect";
            const isHeartbeat = jsonData && jsonData.type === "heartbeat";
            const wouldStop = isReflectAction && !isHeartbeat;
            
            console.log('- Is reflect action:', isReflectAction);
            console.log('- Is heartbeat:', isHeartbeat);
            console.log('- Would stop loop:', wouldStop);
            console.log('- Result:', wouldStop ? '❌ STOP' : '✅ CONTINUE');
        });
    }

    // Main debug function
    function runDebug() {
        console.log('🚀 Starting Reflect Detection Debug...\n');
        
        interceptResponses();
        monitorMessageLoop();
        testReflectDetection();
        
        console.log('\n💡 Debug tools active. Watch console for response analysis.');
    }

    // Wait for dependencies
    function waitAndRun() {
        if (typeof window.MessageLoop !== 'undefined') {
            runDebug();
        } else {
            console.log('⏳ Waiting for MessageLoop...');
            setTimeout(waitAndRun, 1000);
        }
    }

    waitAndRun();

    // Expose debug functions
    window.ReflectDetectionDebug = {
        interceptResponses,
        monitorMessageLoop,
        testReflectDetection,
        runDebug
    };

    console.log('✅ Reflect Detection Debug loaded');
    console.log('💡 Run window.ReflectDetectionDebug.runDebug() to start debugging');

})();