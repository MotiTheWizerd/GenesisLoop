// Test Clock Display
// Run this in the browser console on ChatGPT to test the visible clock

console.log('🕐 Testing Clock Display...');

function testClockDisplaySystem() {
  console.log('\n=== Clock Display System Test ===');
  
  // Check if clock display is loaded
  if (window.ClockDisplay) {
    console.log('✅ ClockDisplay module loaded');
  } else {
    console.error('❌ ClockDisplay module not loaded');
    return;
  }

  // Check if clock display element exists
  const clockElement = document.getElementById('ray-clock-display');
  if (clockElement) {
    console.log('✅ Clock display element found in DOM');
    console.log('Clock position:', clockElement.style.top, clockElement.style.right);
    console.log('Clock content:', clockElement.textContent);
  } else {
    console.warn('⚠️ Clock display element not found in DOM');
  }

  // Check clock status
  const status = window.ClockDisplay.status();
  console.log('📊 Clock Display Status:', status);
}

function testClockDisplayFormats() {
  console.log('\n=== Clock Display Formats Test ===');
  
  if (!window.ClockDisplay) {
    console.error('❌ ClockDisplay not available');
    return;
  }

  console.log('🔄 Testing different time formats...');
  
  const formats = ['time', 'iso', 'unix', 'detailed'];
  let currentFormat = 0;
  
  const formatTest = setInterval(() => {
    if (currentFormat >= formats.length) {
      clearInterval(formatTest);
      console.log('✅ Format test completed');
      return;
    }
    
    console.log(`🕐 Testing format: ${formats[currentFormat]}`);
    window.ClockDisplay.toggleFormat();
    
    // Check what's displayed
    const clockElement = document.getElementById('ray-clock-display');
    if (clockElement) {
      console.log(`  Display: ${clockElement.textContent.split('\n')[0]}`);
    }
    
    currentFormat++;
  }, 2000);
}

function testClockDisplayStyles() {
  console.log('\n=== Clock Display Styles Test ===');
  
  if (!window.ClockDisplay) {
    console.error('❌ ClockDisplay not available');
    return;
  }

  const styles = ['minimal', 'neon', 'classic', 'transparent'];
  let currentStyle = 0;
  
  console.log('🎨 Testing different clock styles...');
  
  const styleTest = setInterval(() => {
    if (currentStyle >= styles.length) {
      clearInterval(styleTest);
      console.log('✅ Style test completed');
      return;
    }
    
    const style = styles[currentStyle];
    console.log(`🎨 Testing style: ${style}`);
    window.ClockDisplay.setStyle(style);
    
    currentStyle++;
  }, 3000);
}

function testClockDisplayControls() {
  console.log('\n=== Clock Display Controls Test ===');
  
  if (!window.ClockDisplay) {
    console.error('❌ ClockDisplay not available');
    return;
  }

  console.log('👁️ Testing show/hide controls...');
  
  // Test hide
  setTimeout(() => {
    console.log('🙈 Hiding clock display...');
    window.ClockDisplay.hide();
  }, 1000);
  
  // Test show
  setTimeout(() => {
    console.log('👁️ Showing clock display...');
    window.ClockDisplay.show();
  }, 3000);
  
  // Test toggle
  setTimeout(() => {
    console.log('🔄 Toggling clock display...');
    window.ClockDisplay.toggle();
  }, 5000);
  
  setTimeout(() => {
    console.log('🔄 Toggling clock display back...');
    window.ClockDisplay.toggle();
  }, 7000);
}

function testClockDisplayPosition() {
  console.log('\n=== Clock Display Position Test ===');
  
  const clockElement = document.getElementById('ray-clock-display');
  if (clockElement) {
    console.log('📍 Clock position analysis:');
    console.log('  Top:', clockElement.style.top);
    console.log('  Right:', clockElement.style.right);
    console.log('  Transform:', clockElement.style.transform);
    console.log('  Z-index:', clockElement.style.zIndex);
    
    // Check if it's above the control buttons
    const controlButtons = document.querySelectorAll('button[title*="Ray"]');
    console.log(`🎛️ Found ${controlButtons.length} control buttons`);
    
    if (controlButtons.length > 0) {
      const firstButton = controlButtons[0];
      const clockRect = clockElement.getBoundingClientRect();
      const buttonRect = firstButton.getBoundingClientRect();
      
      if (clockRect.bottom < buttonRect.top) {
        console.log('✅ Clock is positioned above control buttons');
      } else {
        console.warn('⚠️ Clock may be overlapping with control buttons');
      }
    }
    
  } else {
    console.error('❌ Clock element not found for position test');
  }
}

function testClockDisplayInteraction() {
  console.log('\n=== Clock Display Interaction Test ===');
  
  const clockElement = document.getElementById('ray-clock-display');
  if (clockElement) {
    console.log('🖱️ Testing click interaction...');
    
    // Simulate click to change format
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    
    console.log('🖱️ Simulating click on clock...');
    clockElement.dispatchEvent(clickEvent);
    
    setTimeout(() => {
      console.log('✅ Click interaction test completed');
      console.log('Current display:', clockElement.textContent.split('\n')[0]);
    }, 1000);
    
  } else {
    console.error('❌ Clock element not found for interaction test');
  }
}

function testClockDisplayIntegration() {
  console.log('\n=== Clock Display Integration Test ===');
  
  // Test integration with other systems
  const systems = [
    { name: 'RayClock', obj: window.RayClock },
    { name: 'BrowserClock', obj: window.BrowserClock },
    { name: 'RayPowerControl', obj: window.RayPowerControl },
    { name: 'ClockMonitor', obj: window.ClockMonitor }
  ];
  
  systems.forEach(system => {
    if (system.obj) {
      console.log(`✅ ${system.name} available for clock display integration`);
    } else {
      console.warn(`⚠️ ${system.name} not available`);
    }
  });
  
  // Test power status indicator
  if (window.RayPowerControl) {
    const powered = window.RayPowerControl.isPowered();
    console.log(`🔋 Ray power status: ${powered ? 'ON' : 'OFF'}`);
    console.log('🔍 Check if power indicator dot is correct on clock');
  }
}

// Run all tests
function runAllClockDisplayTests() {
  console.log('🕐 === Clock Display Test Suite ===');
  
  testClockDisplaySystem();
  testClockDisplayPosition();
  testClockDisplayIntegration();
  
  console.log('\n🕐 === Manual Tests Available ===');
  console.log('Run testClockDisplayFormats() to test time format cycling');
  console.log('Run testClockDisplayStyles() to test visual styles');
  console.log('Run testClockDisplayControls() to test show/hide');
  console.log('Run testClockDisplayInteraction() to test clicking');
  console.log('Or click the clock display to change formats');
}

// Auto-run basic tests
runAllClockDisplayTests();

// Expose test functions globally
window.testClockDisplaySystem = testClockDisplaySystem;
window.testClockDisplayFormats = testClockDisplayFormats;
window.testClockDisplayStyles = testClockDisplayStyles;
window.testClockDisplayControls = testClockDisplayControls;
window.testClockDisplayPosition = testClockDisplayPosition;
window.testClockDisplayInteraction = testClockDisplayInteraction;
window.testClockDisplayIntegration = testClockDisplayIntegration;
window.runAllClockDisplayTests = runAllClockDisplayTests;