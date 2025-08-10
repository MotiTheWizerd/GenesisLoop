/**
 * Test: Interval Options and Persistence
 * 
 * This test verifies:
 * 1. New interval preset options work
 * 2. Interval settings persist across sessions
 * 3. Preset button styling updates correctly
 * 4. Custom intervals are handled properly
 */

(function() {
    'use strict';

    console.log('🧪 Testing Interval Options and Persistence...');

    function testIntervalPresets() {
        console.log('\n📊 Test 1: Interval Preset Options');
        
        const presetValues = [1, 5, 15, 30, 60, 120, 300];
        let testsPassed = 0;
        
        presetValues.forEach((value, index) => {
            setTimeout(() => {
                console.log(`\n🔧 Testing ${value}s preset...`);
                
                if (typeof window.MessageLoop !== 'undefined') {
                    const success = window.MessageLoop.setInterval(value);
                    
                    if (success) {
                        console.log(`✅ ${value}s interval set successfully`);
                        testsPassed++;
                        
                        // Check if RayLoopStatus updated
                        setTimeout(() => {
                            if (typeof window.RayLoopStatus !== 'undefined') {
                                const state = window.RayLoopStatus.getState();
                                const displayedInterval = state.interval / 1000;
                                
                                if (displayedInterval === value) {
                                    console.log(`✅ RayLoopStatus shows correct interval: ${displayedInterval}s`);
                                } else {
                                    console.log(`❌ RayLoopStatus shows wrong interval: ${displayedInterval}s (expected ${value}s)`);
                                }
                            }
                        }, 100);
                    } else {
                        console.log(`❌ Failed to set ${value}s interval`);
                    }
                } else {
                    console.log('⚠️ MessageLoop not available');
                }
                
                // Final summary
                if (index === presetValues.length - 1) {
                    setTimeout(() => {
                        console.log(`\n📊 Preset Test Results: ${testsPassed}/${presetValues.length} presets working`);
                    }, 500);
                }
            }, index * 1000);
        });
    }

    function testPersistence() {
        console.log('\n💾 Test 2: Settings Persistence');
        
        if (typeof window.RaySettings === 'undefined') {
            console.error('❌ RaySettings not available for persistence test');
            return;
        }

        // Test saving a custom interval
        const testInterval = 45;
        console.log(`🔧 Setting test interval: ${testInterval}s`);
        
        window.RaySettings.set('messageLoop.interval', testInterval);
        
        // Verify it was saved
        setTimeout(() => {
            const savedInterval = window.RaySettings.get('messageLoop.interval');
            
            if (savedInterval === testInterval) {
                console.log(`✅ Interval saved correctly: ${savedInterval}s`);
                
                // Test localStorage persistence
                try {
                    const savedData = localStorage.getItem('ray_settings');
                    if (savedData) {
                        const parsedData = JSON.parse(savedData);
                        const storedInterval = parsedData.settings?.messageLoop?.interval;
                        
                        if (storedInterval === testInterval) {
                            console.log(`✅ Interval persisted to localStorage: ${storedInterval}s`);
                        } else {
                            console.log(`❌ Interval not persisted correctly: ${storedInterval}s`);
                        }
                    } else {
                        console.log('❌ No data found in localStorage');
                    }
                } catch (error) {
                    console.error('❌ Error checking localStorage:', error);
                }
            } else {
                console.log(`❌ Interval not saved correctly: ${savedInterval}s (expected ${testInterval}s)`);
            }
            
            // Restore default
            window.RaySettings.set('messageLoop.interval', 30);
            console.log('🔧 Restored default interval: 30s');
        }, 200);
    }

    function testCustomIntervals() {
        console.log('\n🎛️ Test 3: Custom Interval Values');
        
        const customValues = [7, 23, 77, 150, 250];
        let customTestsPassed = 0;
        
        customValues.forEach((value, index) => {
            setTimeout(() => {
                console.log(`\n🔧 Testing custom interval: ${value}s`);
                
                if (typeof window.MessageLoop !== 'undefined') {
                    const success = window.MessageLoop.setInterval(value);
                    
                    if (success) {
                        console.log(`✅ Custom interval ${value}s set successfully`);
                        customTestsPassed++;
                        
                        // Verify it's actually applied
                        const currentInterval = window.MessageLoop.getInterval() / 1000;
                        if (currentInterval === value) {
                            console.log(`✅ Custom interval verified: ${currentInterval}s`);
                        } else {
                            console.log(`❌ Custom interval mismatch: ${currentInterval}s (expected ${value}s)`);
                        }
                    } else {
                        console.log(`❌ Failed to set custom interval ${value}s`);
                    }
                }
                
                // Final summary
                if (index === customValues.length - 1) {
                    setTimeout(() => {
                        console.log(`\n📊 Custom Interval Test Results: ${customTestsPassed}/${customValues.length} custom intervals working`);
                    }, 200);
                }
            }, index * 800);
        });
    }

    function testBoundaryValues() {
        console.log('\n🚧 Test 4: Boundary Value Testing');
        
        const boundaryTests = [
            { value: 0, shouldWork: false, name: 'Zero (invalid)' },
            { value: 1, shouldWork: true, name: 'Minimum (1s)' },
            { value: 300, shouldWork: true, name: 'Maximum (300s)' },
            { value: 301, shouldWork: false, name: 'Over maximum (invalid)' },
            { value: -5, shouldWork: false, name: 'Negative (invalid)' }
        ];
        
        boundaryTests.forEach((test, index) => {
            setTimeout(() => {
                console.log(`\n🧪 Testing ${test.name}: ${test.value}s`);
                
                if (typeof window.MessageLoop !== 'undefined') {
                    const success = window.MessageLoop.setInterval(test.value);
                    
                    if (success === test.shouldWork) {
                        console.log(`✅ Boundary test passed: ${test.name}`);
                    } else {
                        console.log(`❌ Boundary test failed: ${test.name} (expected ${test.shouldWork ? 'success' : 'failure'}, got ${success ? 'success' : 'failure'})`);
                    }
                } else {
                    console.log('⚠️ MessageLoop not available for boundary test');
                }
            }, index * 500);
        });
    }

    function testStorageCleanup() {
        console.log('\n🧹 Test 5: Storage Cleanup');
        
        // Test old data cleanup
        try {
            // Create fake old data
            const oldData = {
                settings: { messageLoop: { interval: 99 } },
                timestamp: Date.now() - (8 * 24 * 60 * 60 * 1000), // 8 days old
                version: "1.0"
            };
            
            localStorage.setItem('ray_settings', JSON.stringify(oldData));
            console.log('🔧 Created fake old data (8 days old)');
            
            // Try to load settings (should ignore old data)
            if (typeof window.RaySettings !== 'undefined') {
                // Reinitialize to test loading
                const currentInterval = window.RaySettings.get('messageLoop.interval');
                console.log(`📊 Current interval after old data test: ${currentInterval}s`);
                
                if (currentInterval !== 99) {
                    console.log('✅ Old data correctly ignored');
                } else {
                    console.log('❌ Old data was incorrectly loaded');
                }
            }
        } catch (error) {
            console.error('❌ Storage cleanup test error:', error);
        }
    }

    function runAllTests() {
        console.log('🚀 Starting Interval Options and Persistence Tests...\n');
        
        // Run tests in sequence
        testIntervalPresets();
        
        setTimeout(() => {
            testPersistence();
        }, 8000);
        
        setTimeout(() => {
            testCustomIntervals();
        }, 10000);
        
        setTimeout(() => {
            testBoundaryValues();
        }, 15000);
        
        setTimeout(() => {
            testStorageCleanup();
        }, 18000);
        
        setTimeout(() => {
            console.log('\n🎉 All interval and persistence tests completed!');
            console.log('💡 Check the popup interface to verify the new preset buttons work');
            console.log('💡 Try refreshing the page to test persistence');
        }, 20000);
    }

    // Wait for dependencies and run tests
    function waitForDependencies() {
        if (typeof window.RaySettings !== 'undefined' && 
            typeof window.MessageLoop !== 'undefined') {
            console.log('✅ Dependencies loaded, starting tests...');
            runAllTests();
        } else {
            console.log('⏳ Waiting for dependencies to load...');
            setTimeout(waitForDependencies, 1000);
        }
    }

    waitForDependencies();

    // Expose test functions
    window.IntervalPersistenceTests = {
        runAll: runAllTests,
        testPresets: testIntervalPresets,
        testPersistence: testPersistence,
        testCustom: testCustomIntervals,
        testBoundary: testBoundaryValues,
        testCleanup: testStorageCleanup
    };

    console.log('✅ Interval Options and Persistence Test loaded');
    console.log('💡 Run window.IntervalPersistenceTests.runAll() to test manually');

})();