/**
 * Fix: Interval Persistence Loading
 * 
 * This fixes the issue where the saved interval isn't automatically loaded
 * on page refresh, causing the green display to show 30s instead of the saved value.
 */

(function() {
    'use strict';

    console.log('🔧 Fixing interval persistence loading...');

    function fixIntervalPersistence() {
        // Step 1: Force RaySettings to load saved settings immediately
        if (typeof window.RaySettings !== 'undefined') {
            console.log('📂 Loading saved settings into RaySettings...');
            
            try {
                const savedData = localStorage.getItem('ray_settings');
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    const timeSinceSave = Date.now() - (parsedData.timestamp || 0);
                    
                    // Load if saved within last 7 days
                    if (timeSinceSave < 7 * 24 * 60 * 60 * 1000 && parsedData.settings) {
                        const savedInterval = parsedData.settings?.messageLoop?.interval;
                        if (savedInterval && savedInterval !== 30) {
                            console.log(`🔄 Found saved interval: ${savedInterval}s`);
                            window.RaySettings.set('messageLoop.interval', savedInterval);
                            console.log('✅ Saved interval applied to RaySettings');
                        }
                    }
                }
            } catch (error) {
                console.warn('⚠️ Error loading saved settings:', error);
            }
        }

        // Step 2: Force RayLoopStatus to sync with current settings
        if (typeof window.RayLoopStatus !== 'undefined') {
            console.log('🔄 Syncing RayLoopStatus with current settings...');
            window.RayLoopStatus.syncInterval();
            console.log('✅ RayLoopStatus synced');
        }

        // Step 3: Also check Chrome storage (popup persistence)
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(['ray_heartbeat_interval'], (result) => {
                if (result.ray_heartbeat_interval && result.ray_heartbeat_interval !== 30) {
                    console.log(`📂 Found Chrome storage interval: ${result.ray_heartbeat_interval}s`);
                    
                    if (typeof window.RaySettings !== 'undefined') {
                        window.RaySettings.set('messageLoop.interval', result.ray_heartbeat_interval);
                    }
                    
                    if (typeof window.RayLoopStatus !== 'undefined') {
                        window.RayLoopStatus.syncInterval();
                    }
                    
                    console.log('✅ Chrome storage interval applied');
                }
            });
        }
    }

    // Wait for dependencies and apply fix
    function waitAndFix() {
        if (typeof window.RaySettings !== 'undefined' && typeof window.RayLoopStatus !== 'undefined') {
            console.log('✅ Dependencies loaded, applying fix...');
            fixIntervalPersistence();
            
            // Also set up a listener for future settings changes
            document.addEventListener('raySettingsChanged', (event) => {
                if (event.detail && event.detail.path === 'messageLoop.interval') {
                    console.log('🔄 Settings changed, syncing RayLoopStatus...');
                    if (typeof window.RayLoopStatus !== 'undefined') {
                        setTimeout(() => {
                            window.RayLoopStatus.syncInterval();
                        }, 100);
                    }
                }
            });
            
        } else {
            console.log('⏳ Waiting for RaySettings and RayLoopStatus...');
            setTimeout(waitAndFix, 500);
        }
    }

    // Start the fix
    waitAndFix();

    // Expose fix function for manual use
    window.FixIntervalPersistence = {
        fix: fixIntervalPersistence,
        checkCurrentSettings: function() {
            console.log('📊 Current Settings Check:');
            
            if (typeof window.RaySettings !== 'undefined') {
                const currentInterval = window.RaySettings.get('messageLoop.interval');
                console.log('RaySettings interval:', currentInterval + 's');
            }
            
            if (typeof window.RayLoopStatus !== 'undefined') {
                const state = window.RayLoopStatus.getState();
                console.log('RayLoopStatus interval:', state.interval / 1000 + 's');
            }
            
            // Check localStorage
            try {
                const savedData = localStorage.getItem('ray_settings');
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    const savedInterval = parsedData.settings?.messageLoop?.interval;
                    console.log('localStorage interval:', savedInterval + 's');
                }
            } catch (error) {
                console.log('localStorage: No saved data');
            }
            
            // Check Chrome storage
            if (typeof chrome !== 'undefined' && chrome.storage) {
                chrome.storage.local.get(['ray_heartbeat_interval'], (result) => {
                    console.log('Chrome storage interval:', result.ray_heartbeat_interval + 's');
                });
            }
        }
    };

    console.log('✅ Interval Persistence Fix loaded');
    console.log('💡 Run window.FixIntervalPersistence.checkCurrentSettings() to debug');

})();