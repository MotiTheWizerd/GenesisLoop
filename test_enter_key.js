/**
 * Test script for Enter key sending functionality
 * Run this in the browser console on ChatGPT page
 */

console.log("🧪 Testing Enter Key Send Functionality");

// Test 1: Check if textarea can be found
console.log("\n📋 Test 1: Textarea Detection");
if (window.DOMUtils) {
  const elements = window.DOMUtils.findRequiredElements();
  console.log("Textarea found:", !!elements.textarea);
  if (elements.textarea) {
    console.log("Textarea:", elements.textarea);
    console.log("Textarea ID:", elements.textarea.id);
    console.log("Textarea tag:", elements.textarea.tagName);
    console.log("Is contenteditable:", elements.textarea.getAttribute('contenteditable'));
  }
} else {
  console.log("❌ DOMUtils not loaded");
}

// Test 2: Manual Enter key test
console.log("\n⌨️ Test 2: Manual Enter Key Simulation");
if (window.DOMUtils) {
  const elements = window.DOMUtils.findRequiredElements();
  if (elements.textarea) {
    // Put some test text in the textarea
    console.log("📝 Inserting test text...");
    
    if (elements.textarea.id === "prompt-textarea") {
      // ProseMirror approach
      elements.textarea.innerHTML = "";
      const p = document.createElement("p");
      p.textContent = "Test message for Enter key sending";
      elements.textarea.appendChild(p);
      
      // Trigger input events
      elements.textarea.dispatchEvent(new Event("input", { bubbles: true }));
      elements.textarea.dispatchEvent(new Event("change", { bubbles: true }));
      
      console.log("✅ Test text inserted (ProseMirror)");
    } else {
      // Regular textarea approach
      elements.textarea.value = "Test message for Enter key sending";
      elements.textarea.dispatchEvent(new Event("input", { bubbles: true }));
      console.log("✅ Test text inserted (regular textarea)");
    }
    
    // Focus and try Enter key
    setTimeout(() => {
      console.log("🎯 Focusing textarea...");
      elements.textarea.focus();
      console.log("Focused element:", document.activeElement);
      
      setTimeout(() => {
        console.log("⌨️ Simulating Enter key...");
        
        const enterEvent = new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true
        });
        
        const result = elements.textarea.dispatchEvent(enterEvent);
        console.log("✅ Enter key dispatched, result:", result);
        
        // Also try keyup
        const enterUpEvent = new KeyboardEvent("keyup", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true
        });
        
        elements.textarea.dispatchEvent(enterUpEvent);
        console.log("✅ Enter keyup dispatched");
        
      }, 500);
    }, 1000);
  }
}

// Test 3: Monitor for message sending
console.log("\n👁️ Test 3: Message Send Monitoring");
let messagesSent = 0;

// Watch for new messages in the chat
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1 && node.matches && node.matches('[data-message-author-role="user"]')) {
        messagesSent++;
        console.log(`📤 Message sent detected! Total: ${messagesSent}`);
        console.log("Message content:", node.innerText?.substring(0, 100) + "...");
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Stop monitoring after 30 seconds
setTimeout(() => {
  observer.disconnect();
  console.log("⏹️ Stopped monitoring message sends");
  console.log(`📊 Total messages sent during test: ${messagesSent}`);
}, 30000);

console.log("\n🎉 Enter Key Tests Started!");
console.log("Watch for 'Message sent detected!' to confirm Enter key is working.");
console.log("You can also manually type in ChatGPT and press Enter to test.");