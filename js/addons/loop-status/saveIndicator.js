/**
 * Save Indicator - Visual feedback for auto-save operations
 * Shows a small indicator when data is being saved
 */

(function() {
    'use strict';

    let saveIndicator = null;
    let saveTimeout = null;
    let saveCount = 0;

    function createSaveIndicator() {
        if (saveIndicator) return;

        saveIndicator = document.createElement('div');
        saveIndicator.id = 'ray-save-indicator';
        saveIndicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 270px;
            background: rgba(0, 255, 136, 0.9);
            color: #000;
            padding: 5px 10px;
            border-radius: 15px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            font-weight: bold;
            z-index: 10001;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            pointer-events: none;
            box-shadow: 0 2px 10px rgba(0, 255, 136, 0.5);
        `;

        document.body.appendChild(saveIndicator);
    }

    function showSaveIndicator(saveType = 'auto', details = '') {
        createSaveIndicator();
        saveCount++;

        const messages = {
            auto: '💾 Auto-Saved',
            manual: '💾 Manual Save',
            export: '📤 Exported',
            import: '📥 Imported',
            position: '📍 Position Saved',
            state: '🔄 State Saved'
        };

        const message = messages[saveType] || '💾 Saved';
        const fullMessage = details ? `${message} - ${details}` : `${message} #${saveCount}`;

        saveIndicator.textContent = fullMessage;
        saveIndicator.style.opacity = '1';
        saveIndicator.style.transform = 'translateY(0)';

        // Clear existing timeout
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }

        // Hide after 2 seconds
        saveTimeout = setTimeout(() => {
            if (saveIndicator) {
                saveIndicator.style.opacity = '0';
                saveIndicator.style.transform = 'translateY(-10px)';
            }
        }, 2000);

        console.log(`💾 Save indicator shown: ${fullMessage}`);
    }

    function flashSaveIndicator() {
        createSaveIndicator();
        
        // Quick flash for rapid saves
        saveIndicator.style.background = 'rgba(255, 255, 0, 0.9)';
        saveIndicator.textContent = '⚡ Rapid Save';
        saveIndicator.style.opacity = '1';
        saveIndicator.style.transform = 'translateY(0)';

        setTimeout(() => {
            if (saveIndicator) {
                saveIndicator.style.background = 'rgba(0, 255, 136, 0.9)';
                saveIndicator.style.opacity = '0';
                saveIndicator.style.transform = 'translateY(-10px)';
            }
        }, 500);
    }

    // Hook into localStorage to show indicator on saves
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        const result = originalSetItem.call(this, key, value);
        
        if (key === 'ray_loop_status_state') {
            try {
                const data = JSON.parse(value);
                const details = `${data.status || 'Unknown'}`;
                showSaveIndicator('auto', details);
            } catch (e) {
                showSaveIndicator('auto');
            }
        }
        
        return result;
    };

    // Public API
    window.RaySaveIndicator = {
        show: showSaveIndicator,
        flash: flashSaveIndicator,
        
        getSaveCount: function() {
            return saveCount;
        },
        
        resetCount: function() {
            saveCount = 0;
            console.log('🔄 Save count reset');
        },
        
        hide: function() {
            if (saveIndicator) {
                saveIndicator.style.display = 'none';
            }
        },
        
        show: function() {
            if (saveIndicator) {
                saveIndicator.style.display = 'block';
            }
        },
        
        destroy: function() {
            if (saveIndicator) {
                saveIndicator.remove();
                saveIndicator = null;
            }
            if (saveTimeout) {
                clearTimeout(saveTimeout);
                saveTimeout = null;
            }
            // Restore original localStorage
            localStorage.setItem = originalSetItem;
        }
    };

    console.log('✅ RaySaveIndicator loaded');
})();