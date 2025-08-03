/**
 * Emergency Browser Clock Fix
 * Quick fix for BrowserClock issues - run this in console
 */

console.log("🚑 Emergency BrowserClock Fix Starting...");

// Quick diagnostic
console.log("BrowserClock exists?", !!window.BrowserClock);

if (!window.BrowserClock) {
  console.log("❌ BrowserClock missing - creating emergency version...");
  
  // Create minimal emergency BrowserClock
  window.BrowserClock = {
    getCurrentTime() {
      return new Date().toISOString();
    },
    
    getCurrentTimeDetailed() {
      const now = new Date();
      return {
        iso: now.toISOString(),
        unix: now.getTime(),
        formatted: now.toLocaleString(),
        utc: now.toUTCString(),
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        precision: "milliseconds"
      };
    },
    
    show() {
      let clockElement = document.getElementById("ray-browser-clock");
      if (!clockElement) {
        clockElement = document.createElement("div");
        clockElement.id = "ray-browser-clock";
        clockElement.style.position = "fixed";
        clockElement.style.top = "10px";
        clockElement.style.right = "10px";
        clockElement.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        clockElement.style.color = "white";
        clockElement.style.padding = "5px 10px";
        clockElement.style.borderRadius = "5px";
        clockElement.style.fontFamily = "monospace";
        clockElement.style.fontSize = "12px";
        clockElement.style.zIndex = "10000";
        clockElement.style.pointerEvents = "none";
        document.body.appendChild(clockElement);
        
        // Update time every second
        setInterval(() => {
          clockElement.textContent = new Date().toISOString();
        }, 1000);
      }
      clockElement.style.display = "block";
      clockElement.textContent = new Date().toISOString();
      console.log("✅ Emergency clock is now visible!");
      return true;
    },
    
    hide() {
      const clockElement = document.getElementById("ray-browser-clock");
      if (clockElement) {
        clockElement.style.display = "none";
        console.log("✅ Clock hidden");
      }
      return true;
    },
    
    getStatus() {
      const clockElement = document.getElementById("ray-browser-clock");
      return {
        isRunning: true,
        hasElement: !!clockElement,
        visible: clockElement ? clockElement.style.display !== "none" : false,
        currentTime: this.getCurrentTime(),
        emergency: true
      };
    }
  };
  
  console.log("✅ Emergency BrowserClock created!");
} else {
  console.log("✅ BrowserClock exists - checking functionality...");
}

// Test the show function
try {
  window.BrowserClock.show();
  console.log("🎉 SUCCESS: Clock should now be visible in top-right corner!");
} catch (error) {
  console.error("❌ Error showing clock:", error);
}

// Show status
console.log("📊 Clock status:", window.BrowserClock.getStatus());

console.log("\n🚑 Emergency fix complete!");
console.log("💡 The clock should now be visible in the top-right corner of the page.");
console.log("💡 To hide it, run: window.BrowserClock.hide()");