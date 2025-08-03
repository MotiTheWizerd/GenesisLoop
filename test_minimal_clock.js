/**
 * Minimal BrowserClock test - run this in console to test basic functionality
 */

console.log("🧪 Creating minimal BrowserClock test...");

// Create minimal version directly
window.TestBrowserClock = {
  getCurrentTime() {
    return new Date().toISOString();
  },
  
  show() {
    let clockElement = document.getElementById("test-browser-clock");
    if (!clockElement) {
      clockElement = document.createElement("div");
      clockElement.id = "test-browser-clock";
      clockElement.style.position = "fixed";
      clockElement.style.top = "50px";
      clockElement.style.right = "10px";
      clockElement.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
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
    console.log("✅ Test clock is now visible!");
    return true;
  },
  
  hide() {
    const clockElement = document.getElementById("test-browser-clock");
    if (clockElement) {
      clockElement.style.display = "none";
    }
    return true;
  }
};

console.log("✅ TestBrowserClock created");
console.log("🧪 Test it with: window.TestBrowserClock.show()");

// Auto-show for testing
window.TestBrowserClock.show();

console.log("🔍 Now check if you see a RED clock in the top-right corner");
console.log("💡 If this works but BrowserClock doesn't, the issue is with the extension script loading");