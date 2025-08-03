// Test Popup Integration with Content Script
(function() {
  'use strict';

  console.log('🎛️ [Test] Testing Popup Integration...');

  function testPopupMessageHandling() {
    console.log('\n=== Popup Message Handling Test ===');

    // Simulate popup messages to test content script responses
    const testMessages = [
      {
        action: 'getSystemStates',
        description: 'Get current system states'
      },
      {
        action: 'getHeartbeatSettings',
        description: 'Get heartbeat configuration'
      },
      {
        action: 'getHeartbeatStatus',
        description: 'Get heartbeat status'
      },
      {
        action: 'toggleMasterPower',
        enabled: true,
        description: 'Enable master power'
      },
      {
        action: 'setHeartbeatInterval',
        interval: 1500,
        description: 'Set heartbeat to 1500ms'
      },
      {
        action: 'toggleSystem',
        system: 'voiceSynthesis',
        enabled: true,
        description: 'Enable voice synthesis'
      }
    ];

    // Test each message type
    testMessages.forEach((message, index) => {
      setTimeout(() => {
        console.log(`📨 [Test] Testing message ${index + 1}: ${message.description}`);
        
        // Simulate the message handling that would happen from popup
        const mockRequest = { ...message };
        const mockSender = { tab: { id: 'test' } };
        
        // Create a mock sendResponse function
        const mockSendResponse = (response) => {
          console.log(`✅ [Test] Response for "${message.action}":`, response);
        };

        // Test the message handling directly
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
          // In a real extension environment, we'd send the message
          console.log(`📤 [Test] Would send message:`, mockRequest);
        } else {
          // In test environment, simulate the handling
          console.log(`🔧 [Test] Simulating message handling for:`, mockRequest);
          
          // Test specific handlers based on action
          switch (message.action) {
            case 'getSystemStates':
              if (window.RayPowerControl) {
                const states = {
                  masterPower: window.RayPowerControl.isPowered(),
                  voiceSynthesis: window.VoiceSynthesisUI ? window.VoiceSynthesisUI.isEnabled() : false,
                  heartbeat: window.RayHeartbeat ? window.RayHeartbeat.status().beating : false
                };
                console.log('📊 [Test] System states:', states);
              }
              break;
              
            case 'getHeartbeatSettings':
              if (window.RaySettings) {
                const settings = {
                  interval: window.RaySettings.get('heartbeat.interval'),
                  maxEvents: window.RaySettings.get('heartbeat.maxTemporalEvents')
                };
                console.log('💓 [Test] Heartbeat settings:', settings);
              }
              break;
              
            case 'getHeartbeatStatus':
              if (window.RayHeartbeat) {
                const status = window.RayHeartbeat.status();
                console.log('💓 [Test] Heartbeat status:', status);
              }
              break;
              
            case 'toggleMasterPower':
              if (window.RayPowerControl) {
                const currentState = window.RayPowerControl.isPowered();
                console.log(`⚡ [Test] Master power currently: ${currentState}`);
                console.log(`⚡ [Test] Would ${message.enabled ? 'enable' : 'disable'} master power`);
              }
              break;
              
            case 'setHeartbeatInterval':
              if (window.RayHeartbeat) {
                console.log(`💓 [Test] Would set heartbeat interval to ${message.interval}ms`);
                const currentRate = window.RaySettings?.get('heartbeat.interval');
                console.log(`💓 [Test] Current rate: ${currentRate}ms`);
              }
              break;
              
            case 'toggleSystem':
              console.log(`🔧 [Test] Would toggle ${message.system} to ${message.enabled}`);
              break;
          }
        }
      }, index * 1000);
    });
  }

  function testPopupUIElements() {
    console.log('\n=== Popup UI Elements Test ===');
    
    // Test if popup would have access to required systems
    const requiredSystems = [
      'RayPowerControl',
      'RayHeartbeat', 
      'RaySettings',
      'VoiceSynthesisUI',
      'VoiceRecognition',
      'MessageLoop',
      'ResponseTracker'
    ];
    
    console.log('🔍 [Test] Checking system availability for popup:');
    requiredSystems.forEach(system => {
      const available = typeof window[system] !== 'undefined';
      console.log(`  ${available ? '✅' : '❌'} ${system}: ${available ? 'Available' : 'Not Available'}`);
    });
  }

  function testPopupDataFlow() {
    console.log('\n=== Popup Data Flow Test ===');
    
    // Test the data that popup would need
    const popupData = {
      systemStates: {},
      heartbeatSettings: {},
      heartbeatStatus: {}
    };
    
    // Collect system states
    if (window.RayPowerControl) {
      popupData.systemStates.masterPower = window.RayPowerControl.isPowered();
    }
    
    if (window.VoiceSynthesisUI) {
      popupData.systemStates.voiceSynthesis = window.VoiceSynthesisUI.isEnabled();
    }
    
    if (window.MessageLoop) {
      popupData.systemStates.messageLoop = window.MessageLoop.isRunning();
    }
    
    // Collect heartbeat data
    if (window.RaySettings) {
      popupData.heartbeatSettings = {
        interval: window.RaySettings.get('heartbeat.interval'),
        maxEvents: window.RaySettings.get('heartbeat.maxTemporalEvents')
      };
    }
    
    if (window.RayHeartbeat) {
      popupData.heartbeatStatus = window.RayHeartbeat.status();
    }
    
    console.log('📊 [Test] Data available for popup:', popupData);
    
    // Test data completeness
    const hasSystemStates = Object.keys(popupData.systemStates).length > 0;
    const hasHeartbeatSettings = Object.keys(popupData.heartbeatSettings).length > 0;
    const hasHeartbeatStatus = Object.keys(popupData.heartbeatStatus).length > 0;
    
    console.log('📈 [Test] Data completeness:');
    console.log(`  System States: ${hasSystemStates ? '✅' : '❌'}`);
    console.log(`  Heartbeat Settings: ${hasHeartbeatSettings ? '✅' : '❌'}`);
    console.log(`  Heartbeat Status: ${hasHeartbeatStatus ? '✅' : '❌'}`);
  }

  function testPopupCompatibility() {
    console.log('\n=== Popup Compatibility Test ===');
    
    // Test Chrome extension APIs that popup would use
    const chromeAPIs = [
      'chrome.tabs',
      'chrome.runtime',
      'chrome.storage'
    ];
    
    console.log('🔍 [Test] Chrome API availability:');
    chromeAPIs.forEach(api => {
      const parts = api.split('.');
      let obj = window;
      let available = true;
      
      for (const part of parts) {
        if (obj && typeof obj[part] !== 'undefined') {
          obj = obj[part];
        } else {
          available = false;
          break;
        }
      }
      
      console.log(`  ${available ? '✅' : '❌'} ${api}: ${available ? 'Available' : 'Not Available'}`);
    });
    
    // Test popup-specific functionality
    console.log('🎛️ [Test] Popup functionality requirements:');
    console.log(`  ✅ Modern CSS support: ${CSS.supports('backdrop-filter', 'blur(10px)')}`);
    console.log(`  ✅ ES6 support: ${typeof Promise !== 'undefined'}`);
    console.log(`  ✅ DOM manipulation: ${typeof document.querySelector !== 'undefined'}`);
  }

  // Run all tests
  function runAllPopupTests() {
    console.log('🎛️ === Popup Integration Test Suite ===');
    
    testPopupUIElements();
    
    setTimeout(() => {
      testPopupDataFlow();
    }, 1000);
    
    setTimeout(() => {
      testPopupCompatibility();
    }, 2000);
    
    setTimeout(() => {
      testPopupMessageHandling();
    }, 3000);
    
    setTimeout(() => {
      console.log('✅ [Test] Popup integration tests completed');
    }, 10000);
  }

  // Start tests
  runAllPopupTests();

})();