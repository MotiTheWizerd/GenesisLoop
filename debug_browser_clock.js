/**
 * Debug script for BrowserClock issues
 * Run this in console to diagnose and fix BrowserClock problems
 */

console.log("🔧 BrowserClock Debug Script Starting...");

// Step 1: Check if BrowserClock exists on window
console.log("\n📋 Step 1: Window Object Check");
console.log("window.BrowserClock exists?", !!window.BrowserClock);

if (window.BrowserClock) {
  console.log("✅ BrowserClock is attached to window");
  console.log("📊 Available methods:", Object.keys(window.BrowserClock));
  
  // Check if show method exists
  if (typeof window.BrowserClock.show === 'function') {
    console.log("✅ show() method is available");
  } else {
    console.log("❌ show() method is missing");
  }
} else {
  console.log("❌ BrowserClock is not attached to window");
}

// Step 2: Check DOM element
console.log("\n🌐 Step 2: DOM Element Check");
const clockElement = document.getElementById("ray-browser-clock");
if (clockElement) {
  console.log("✅ Clock DOM element exists");
  console.log("📄 Element content:", clockElement.textContent);
  console.log("👁️ Element visibility:", clockElement.style.display);
} else {
  console.log("❌ Clock DOM element not found");
}

// Step 3: Try to fix if BrowserClock exists but has issues
if (window.BrowserClock) {
  console.log("\n🔧 Step 3: Attempting Fixes");
  
  try {
    // Get current status
    const status = window.BrowserClock.getStatus();
    console.log("📊 Current status:", status);
    
    // Try force re-initialization if available
    if (typeof window.BrowserClock.forceInit === 'function') {
      console.log("🔄 Attempting force re-initialization...");
      const result = window.BrowserClock.forceInit();
      console.log("🔄 Force init result:", result);
    }
    
    // Try to show the clock
    if (typeof window.BrowserClock.show === 'function') {
      console.log("👁️ Attempting to show clock...");
      window.BrowserClock.show();
      console.log("✅ Show command executed");
    }
    
  } catch (error) {
    console.error("❌ Error during fix attempt:", error);
  }
}

// Step 4: Manual injection if BrowserClock is missing
if (!window.BrowserClock) {
  console.log("\n🚑 Step 4: Emergency Manual Injection");
  
  // Try to manually load the script
  try {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("js/utils/browserClock.js");
    script.onload = () => {
      console.log("✅ BrowserClock script manually loaded");
      console.log("window.BrowserClock now exists?", !!window.BrowserClock);
      
      if (window.BrowserClock) {
        console.log("🎉 Manual injection successful!");
        console.log("📊 Available methods:", Object.keys(window.BrowserClock));
        
        // Try to show it
        setTimeout(() => {
          try {
            window.BrowserClock.show();
            console.log("✅ Clock is now visible!");
          } catch (error) {
            console.error("❌ Error showing clock:", error);
          }
        }, 1000);
      }
    };
    script.onerror = (error) => {
      console.error("❌ Failed to manually load script:", error);
    };
    document.body.appendChild(script);
    
  } catch (error) {
    console.error("❌ Manual injection failed:", error);
  }
}

// Step 5: Final verification
setTimeout(() => {
  console.log("\n✅ Step 5: Final Verification");
  console.log("window.BrowserClock exists?", !!window.BrowserClock);
  
  if (window.BrowserClock) {
    const status = window.BrowserClock.getStatus();
    console.log("📊 Final status:", status);
    
    if (status.visible) {
      console.log("🎉 SUCCESS: Clock is now visible!");
    } else {
      console.log("⚠️ Clock exists but is not visible");
    }
  }
}, 2000);

console.log("\n🔧 Debug script complete. Check results above.");
console.log("💡 If issues persist, try reloading the extension and refreshing the page.");