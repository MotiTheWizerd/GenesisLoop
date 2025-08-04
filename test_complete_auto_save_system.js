/**
 * Complete Auto-Save System Test
 * Comprehensive test of the entire auto-save system with visual feedback
 */

console.log("🧪 Testing Complete Auto-Save System...");

// Test configuration
const TEST_CONFIG = {
    duration: 30000, // 30 seconds
    changeInterval: 1000, // 1 second between changes
    rapidTestCount: 20,
    positionTestCount: 5
};

let testResults = {
    totalChanges: 0,
    totalSaves: 0,
    testsPassed: 0,
    testsFailed: 0,
    startTime: Date.now()
};

// Enhanced save tracking
let saveOperations = [];
const originalSetItem = localStorage.setItem;

localStorage.setItem = function(key, value) {
    const result = originalSetItem.call(this, key, value);
    
    if (key === 'ray_loop_status_state') {
        const saveInfo = {
            timestamp: Date.now(),
            timeFromStart: Date.now() - testResults.startTime,
            data: JSON.parse(value),
            saveNumber: saveOperations.length + 1
        };
        
        saveOperations.push(saveInfo);
        testResults.totalSaves++;
        
        console.log(`💾 Save #${saveInfo.saveNumber} at +${saveInfo.timeFromStart}ms`);
        console.log(`📊 Status: ${saveInfo.data.status}`);
        console.log(`📈 Responses: ${saveInfo.data.responseCount}, Errors: ${saveInfo.data.errors}`);
    }
    
    return result;
};

function runTest(testName, testFunction, expectedSaves = 1) {
    return new Promise((resolve) => {
        console.log(`🔄 Running test: ${testName}`);
        const initialSaves = testResults.totalSaves;
        
        testFunction().then(() => {
            const actualSaves = testResults.totalSaves - initialSaves;
            const passed = actualSaves >= expectedSaves;
            
            if (passed) {
                testResults.testsPassed++;
                console.log(`✅ ${testName} PASSED (${actualSaves} saves)`);
            } else {
                testResults.testsFailed++;
                console.log(`❌ ${testName} FAILED (${actualSaves}/${expectedSaves} saves)`);
            }
            
            resolve(passed);
        });
    });
}

// Test functions
const tests = {
    initialization: () => {
        return new Promise((resolve) => {
            if (typeof window.RayLoopStatus !== 'undefined') {
                window.RayLoopStatus.init();
                setTimeout(resolve, 500);
            } else {
                resolve();
            }
        });
    },
    
    basicStateChanges: () => {
        return new Promise((resolve) => {
            const changes = [
                () => window.RayLoopStatus.setStatus('Basic Test 1'),
                () => window.RayLoopStatus.setRunning(true),
                () => window.RayLoopStatus.setNextRun(Date.now() + 30000),
                () => window.RayLoopStatus.incrementResponses(),
                () => window.RayLoopStatus.incrementErrors(),
                () => window.RayLoopStatus.setInterval(45000)
            ];
            
            changes.forEach((change, index) => {
                setTimeout(() => {
                    change();
                    testResults.totalChanges++;
                    if (index === changes.length - 1) {
                        setTimeout(resolve, 500);
                    }
                }, index * 200);
            });
        });
    },
    
    bulkStateUpdate: () => {
        return new Promise((resolve) => {
            window.RayLoopStatus.updateState({
                status: 'Bulk Update Test',
                responseCount: 50,
                errors: 2,
                interval: 60000,
                position: { top: 100, right: 100 }
            });
            testResults.totalChanges++;
            setTimeout(resolve, 500);
        });
    },
    
    uiInteractions: () => {
        return new Promise((resolve) => {
            const interactions = [
                () => window.RayLoopStatus.hide(),
                () => window.RayLoopStatus.show(),
                () => window.RayLoopStatus.toggleVisibility(),
                () => window.RayLoopStatus.toggleVisibility(),
                () => window.RayLoopStatus.resetPosition()
            ];
            
            interactions.forEach((interaction, index) => {
                setTimeout(() => {
                    interaction();
                    testResults.totalChanges++;
                    if (index === interactions.length - 1) {
                        setTimeout(resolve, 500);
                    }
                }, index * 300);
            });
        });
    },
    
    rapidChanges: () => {
        return new Promise((resolve) => {
            for (let i = 0; i < TEST_CONFIG.rapidTestCount; i++) {
                setTimeout(() => {
                    window.RayLoopStatus.setStatus(`Rapid Change ${i + 1}`);
                    testResults.totalChanges++;
                    
                    if (i === TEST_CONFIG.rapidTestCount - 1) {
                        setTimeout(resolve, 1000); // Wait for debouncing
                    }
                }, i * 50);
            }
        });
    },
    
    positionChanges: () => {
        return new Promise((resolve) => {
            const positions = [
                { top: 50, right: 50 },
                { top: 100, right: 100 },
                { top: 150, right: 150 },
                { top: 200, right: 200 },
                { top: 10, right: 10 }
            ];
            
            positions.forEach((pos, index) => {
                setTimeout(() => {
                    window.RayLoopStatus.updateState({ position: pos });
                    testResults.totalChanges++;
                    
                    if (index === positions.length - 1) {
                        setTimeout(resolve, 500);
                    }
                }, index * 400);
            });
        });
    },
    
    messageLoopSimulation: () => {
        return new Promise((resolve) => {
            const loopActions = [
                () => window.RayLoopStatus.setRunning(true),
                () => window.RayLoopStatus.setStatus('Sending Message'),
                () => window.RayLoopStatus.setStatus('Waiting for Response'),
                () => window.RayLoopStatus.incrementResponses(),
                () => window.RayLoopStatus.setStatus('Processing Response'),
                () => window.RayLoopStatus.setNextRun(Date.now() + 30000),
                () => window.RayLoopStatus.setStatus('Waiting for Next Run'),
                () => window.RayLoopStatus.setRunning(false)
            ];
            
            loopActions.forEach((action, index) => {
                setTimeout(() => {
                    action();
                    testResults.totalChanges++;
                    
                    if (index === loopActions.length - 1) {
                        setTimeout(resolve, 500);
                    }
                }, index * 300);
            });
        });
    }
};

// Run all tests
async function runAllTests() {
    console.log("🚀 Starting Complete Auto-Save System Test Suite");
    console.log(`⏱️ Test duration: ${TEST_CONFIG.duration / 1000} seconds`);
    
    try {
        await runTest('Initialization', tests.initialization, 1);
        await runTest('Basic State Changes', tests.basicStateChanges, 6);
        await runTest('Bulk State Update', tests.bulkStateUpdate, 1);
        await runTest('UI Interactions', tests.uiInteractions, 5);
        await runTest('Rapid Changes (Debouncing)', tests.rapidChanges, 1);
        await runTest('Position Changes', tests.positionChanges, 5);
        await runTest('MessageLoop Simulation', tests.messageLoopSimulation, 8);
        
        // Final results
        setTimeout(() => {
            const duration = Date.now() - testResults.startTime;
            const saveRate = (testResults.totalSaves / (duration / 1000)).toFixed(2);
            
            console.log("🎉 COMPLETE AUTO-SAVE SYSTEM TEST RESULTS:");
            console.log("=" .repeat(50));
            console.log(`⏱️ Test Duration: ${duration}ms`);
            console.log(`🔄 Total Changes Made: ${testResults.totalChanges}`);
            console.log(`💾 Total Saves Triggered: ${testResults.totalSaves}`);
            console.log(`📊 Save Rate: ${saveRate} saves/second`);
            console.log(`✅ Tests Passed: ${testResults.testsPassed}`);
            console.log(`❌ Tests Failed: ${testResults.testsFailed}`);
            console.log(`📈 Success Rate: ${((testResults.testsPassed / (testResults.testsPassed + testResults.testsFailed)) * 100).toFixed(1)}%`);
            
            // Efficiency analysis
            const efficiency = (testResults.totalSaves / testResults.totalChanges * 100).toFixed(1);
            console.log(`⚡ Save Efficiency: ${efficiency}% (saves per change)`);
            
            if (testResults.totalSaves >= testResults.totalChanges * 0.8) {
                console.log("🏆 EXCELLENT: Auto-save system is highly responsive!");
            } else if (testResults.totalSaves >= testResults.totalChanges * 0.5) {
                console.log("👍 GOOD: Auto-save system is working well with debouncing");
            } else {
                console.log("⚠️ NEEDS ATTENTION: Auto-save system may be missing changes");
            }
            
            // Detailed save log
            console.log("\n📋 DETAILED SAVE LOG:");
            saveOperations.forEach((save, index) => {
                console.log(`${index + 1}. +${save.timeFromStart}ms - ${save.data.status}`);
                console.log(`   📊 R:${save.data.responseCount} E:${save.data.errors} I:${save.data.interval}ms`);
                console.log(`   📍 Position: (${save.data.position.top}, ${save.data.position.right})`);
            });
            
            // Restore original localStorage
            localStorage.setItem = originalSetItem;
            console.log("\n🔄 localStorage.setItem restored to original");
            
        }, 2000);
        
    } catch (error) {
        console.error("❌ Test suite error:", error);
    }
}

// Start the test suite
if (typeof window.RayLoopStatus !== 'undefined') {
    runAllTests();
} else {
    console.error("❌ RayLoopStatus not available - cannot run tests");
}

console.log("🧪 Complete Auto-Save System Test Suite started");
console.log("👀 Watch for visual save indicators in the top-right corner");
console.log("📊 Detailed results will be shown at the end");