/**
 * Test script for send button functionality
 * Run this in the browser console on ChatGPT page
 */

console.log("🧪 Testing Send Button Functionality");

// Test 1: Check if elements can be found
console.log("\n📋 Test 1: Element Detection");
if (window.DOMUtils) {
  const elements = window.DOMUtils.findRequiredElements();
  console.log("Elements found:", elements.success);
  if (elements.success) {
    console.log("Textarea:", elements.textarea);
    console.log("Send button:", elements.sendButton);
    console.log("Send button disabled:", elements.sendButton.disabled);
    console.log("Send button visible:", elements.sendButton.offsetParent !== null);
  }
} else {
  console.log("❌ DOMUtils not loaded");
}

// Test 2: Manual send button test
console.log("\n🖱️ Test 2: Manual Send Button Click");
if (window.DOMUtils) {
  const elements = window.DOMUtils.findRequiredElements();
  if (elements.success) {
    // Put some test text in the textarea
    if (elements.textarea.id === "prompt-textarea") {
      elements.textarea.innerHTML = "";
      const p = document.createElement("p");
      p.textContent = "Test message for send button";
      elements.textarea.appendChild(p);
      
      // Trigger input events
      elements.textarea.dispatchEvent(new Event("input", { bubbles: true }));
      elements.textarea.dispatchEvent(new Event("change", { bubbles: true }));
      
      console.log("✅ Test text inserted");
      console.log("Send button disabled after text:", elements.sendButton.disabled);
      
      // Wait a moment then try to click
      setTimeout(() => {
        console.log("🖱️ Attempting to click send button...");
        try {
          elements.sendButton.click();
          console.log("✅ Send button clicked successfully");
        } catch (error) {
          console.error("❌ Send button click failed:", error);
        }
      }, 1000);
    }
  }
}

// Test 3: Check for send button state changes
console.log("\n👁️ Test 3: Send Button State Monitoring");
if (window.DOMUtils) {
  const elements = window.DOMUtils.findRequiredElements();
  if (elements.success) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
          console.log("🔄 Send button disabled state changed:", mutation.target.disabled);
        }
      });
    });
    
    observer.observe(elements.sendButton, {
      attributes: true,
      attributeFilter: ['disabled']
    });
    
    console.log("👁️ Monitoring send button state changes...");
    
    // Stop monitoring after 30 seconds
    setTimeout(() => {
      observer.disconnect();
      console.log("⏹️ Stopped monitoring send button");
    }, 30000);
  }
}

console.log("\n🎉 Send Button Tests Started!");
console.log("Watch the console for results and try typing in the ChatGPT input to see button state changes.");