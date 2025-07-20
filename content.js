let intervalId = null;
let isRunning = false;
let attemptCount = 0;
const MAX_ATTEMPTS = 10;
const INTERVAL_TIME = 5000; // 5 seconds

function createToggleButton() {
  const existing = document.getElementById("genesis-toggle");
  if (existing) return;

  const button = document.createElement("button");
  button.id = "genesis-toggle";
  button.textContent = "▶️ Start Loop";
  button.style.position = "fixed";
  button.style.top = "10px";
  button.style.right = "10px";
  button.style.zIndex = "9999";
  button.style.padding = "6px 12px";
  button.style.fontSize = "14px";
  button.style.borderRadius = "6px";
  button.style.backgroundColor = "#10a37f";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.cursor = "pointer";

  button.onclick = () => {
    if (isRunning) {
      stopLoop();
      button.textContent = "▶️ Start Loop";
      button.style.backgroundColor = "#10a37f";
    } else {
      startLoop();
      button.textContent = "⏸️ Stop Loop";
      button.style.backgroundColor = "#ef4444";
    }
  };

  document.body.appendChild(button);
  console.log("✅ Toggle button created");
}

function stopLoop() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  isRunning = false;
  attemptCount = 0;
  console.log("⏹️ Loop stopped.");
}

function startLoop() {
  if (isRunning) return;

  isRunning = true;
  attemptCount = 0;
  console.log("⏳ Starting loop...");

  // Try to find elements immediately
  const elements = findRequiredElements();
  if (elements.success) {
    console.log("✅ Elements found immediately. Starting interval.");
    intervalId = setInterval(sendTestMessage, INTERVAL_TIME);
  } else {
    // If not found, set up an observer and a safety timeout
    console.log("👁️ Watching for ChatGPT UI to render...");
    setupObserver();

    // Safety timeout to prevent getting stuck in "Starting loop..." state
    setTimeout(() => {
      if (isRunning && !intervalId) {
        console.log("⚠️ Timeout reached. Elements not found. Stopping loop.");
        stopLoop();

        // Reset the button appearance
        const button = document.getElementById("genesis-toggle");
        if (button) {
          button.textContent = "▶️ Start Loop";
          button.style.backgroundColor = "#10a37f";
        }

        // Show debug info
        debugElements();
      }
    }, 10000); // 10 second timeout
  }
}

function findRequiredElements() {
  // Try multiple possible selectors for the textarea
  const textarea =
    document.querySelector("textarea#prompt-textarea") ||
    document.querySelector("div[contenteditable='true']") ||
    document.querySelector(".ProseMirror");

  // Try multiple possible selectors for the send button
  let sendButton =
    document.querySelector('button[data-testid="send-button"]') ||
    document.querySelector(
      "button.absolute.p-1.rounded-md.md\\:bottom-3.md\\:p-2.md\\:right-3"
    );

  // If we still don't have a send button, look for specific classes from the debug output
  if (!sendButton) {
    // Try to find the button with class that contains "relative flex h-9" (from debug output)
    sendButton = document.querySelector("button.relative.flex.h-9");

    // If that doesn't work, try the composer-btn class
    if (!sendButton) {
      sendButton = document.querySelector("button.composer-btn");
    }

    // If still not found, try to find any button near the textarea
    if (!sendButton && textarea) {
      // Get all buttons
      const allButtons = Array.from(document.querySelectorAll("button"));

      // Find buttons that are positioned near the bottom right (likely to be send button)
      const possibleSendButtons = allButtons.filter((btn) => {
        const rect = btn.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Check if button is in the bottom right quadrant of the screen
        return (
          rect.bottom > viewportHeight * 0.7 &&
          rect.right > viewportWidth * 0.7 &&
          btn.innerHTML.includes("svg")
        ); // Must have an SVG icon
      });

      // Sort by proximity to bottom right corner
      possibleSendButtons.sort((a, b) => {
        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();
        const distanceA = Math.sqrt(
          Math.pow(window.innerWidth - rectA.right, 2) +
            Math.pow(window.innerHeight - rectA.bottom, 2)
        );
        const distanceB = Math.sqrt(
          Math.pow(window.innerWidth - rectB.right, 2) +
            Math.pow(window.innerHeight - rectB.bottom, 2)
        );
        return distanceA - distanceB;
      });

      // Take the closest one
      if (possibleSendButtons.length > 0) {
        sendButton = possibleSendButtons[0];
        console.log("Found send button by position:", sendButton.className);
      }
    }
  }

  // Log what we found for debugging
  if (textarea)
    console.log(
      "Found textarea:",
      textarea.tagName,
      textarea.className || textarea.id
    );
  if (sendButton) console.log("Found send button:", sendButton.className);

  return {
    success: !!(textarea && sendButton),
    textarea,
    sendButton,
  };
}

function sendTestMessage() {
  const elements = findRequiredElements();

  if (!elements.success) {
    attemptCount++;
    console.log(
      `❌ Elements not ready. Attempt ${attemptCount}/${MAX_ATTEMPTS}`
    );

    // If we've tried too many times, stop the loop
    if (attemptCount >= MAX_ATTEMPTS) {
      console.log("⚠️ Max attempts reached. Stopping loop.");
      stopLoop();

      // Reset the button appearance
      const button = document.getElementById("genesis-toggle");
      if (button) {
        button.textContent = "▶️ Start Loop";
        button.style.backgroundColor = "#10a37f";
      }

      // Show debug info
      debugElements();
      return;
    }
    return;
  }

  // Reset attempt count if successful
  attemptCount = 0;

  try {
    const textToSend = "<test>";
    console.log("Attempting to send message using:", elements.textarea.tagName);

    // Handle different types of input elements
    if (elements.textarea.tagName === "TEXTAREA") {
      // Standard textarea
      elements.textarea.value = textToSend;
      elements.textarea.dispatchEvent(new Event("input", { bubbles: true }));
    } else if (
      elements.textarea.getAttribute("contenteditable") === "true" ||
      elements.textarea.classList.contains("ProseMirror")
    ) {
      // For ProseMirror specifically
      if (elements.textarea.id === "prompt-textarea") {
        console.log("Using ProseMirror specific approach");

        // Clear existing content first
        elements.textarea.innerHTML = "";

        // Create a paragraph element with our text
        const p = document.createElement("p");
        p.textContent = textToSend;
        elements.textarea.appendChild(p);

        // Focus the element
        elements.textarea.focus();

        // Dispatch multiple events to ensure the UI updates
        elements.textarea.dispatchEvent(new Event("input", { bubbles: true }));
        elements.textarea.dispatchEvent(new Event("change", { bubbles: true }));

        // Wait a moment to ensure the UI updates before clicking send
        setTimeout(() => {
          if (elements.sendButton && isRunning) {
            console.log("Clicking send button after delay");
            elements.sendButton.click();
          }
        }, 500);

        // Return early since we're handling the click in the timeout
        return;
      } else {
        // Generic contenteditable approach
        elements.textarea.innerHTML = textToSend;
        elements.textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }

    // Click the send button immediately for non-ProseMirror cases
    console.log("Clicking send button immediately");
    elements.sendButton.click();
    console.log("✅ Sent: <test>");
  } catch (error) {
    console.error("❌ Error sending message:", error);
    debugElements();
  }
}

function setupObserver() {
  const observer = new MutationObserver(() => {
    const elements = findRequiredElements();

    if (elements.success && isRunning && !intervalId) {
      observer.disconnect();
      console.log("✅ Elements appeared. Starting interval.");
      intervalId = setInterval(sendTestMessage, INTERVAL_TIME);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function debugElements() {
  console.log("--- Debug Information ---");
  console.log("URL:", window.location.href);
  console.log(
    "Is ChatGPT page:",
    window.location.href.includes("chat.openai.com") ||
      window.location.href.includes("chatgpt.com")
  );

  // Check for standard textarea
  const standardTextarea = document.querySelector("textarea#prompt-textarea");
  console.log("Standard textarea found:", !!standardTextarea);
  if (standardTextarea) {
    console.log("Textarea ID:", standardTextarea.id);
    console.log("Textarea is visible:", standardTextarea.offsetParent !== null);
  }

  // Check for contenteditable div
  const contentEditable = document.querySelector("div[contenteditable='true']");
  console.log("Contenteditable div found:", !!contentEditable);
  if (contentEditable) {
    console.log("Contenteditable classes:", contentEditable.className);
    console.log(
      "Contenteditable is visible:",
      contentEditable.offsetParent !== null
    );
  }

  // Check for ProseMirror
  const proseMirror = document.querySelector(".ProseMirror");
  console.log("ProseMirror found:", !!proseMirror);
  if (proseMirror) {
    console.log("ProseMirror ID:", proseMirror.id);
    console.log("ProseMirror is visible:", proseMirror.offsetParent !== null);
  }

  // Check for standard send button
  const standardSendButton = document.querySelector(
    'button[data-testid="send-button"]'
  );
  console.log("Standard send button found:", !!standardSendButton);
  if (standardSendButton) {
    console.log(
      "Send button data-testid:",
      standardSendButton.getAttribute("data-testid")
    );
    console.log(
      "Send button is visible:",
      standardSendButton.offsetParent !== null
    );
  }

  // Check for buttons with SVG (potential send buttons)
  const svgButtons = Array.from(document.querySelectorAll("button")).filter(
    (btn) => btn.innerHTML.includes("svg")
  );
  console.log("Buttons with SVG found:", svgButtons.length);
  svgButtons.forEach((btn, index) => {
    console.log(`SVG Button ${index}:`, {
      classes: btn.className,
      isVisible: btn.offsetParent !== null,
      position: btn.getBoundingClientRect(),
    });
  });

  // Check which elements our function actually finds
  const foundElements = findRequiredElements();
  console.log("Our function found elements:", foundElements.success);
  if (foundElements.success) {
    console.log("Found textarea type:", foundElements.textarea.tagName);
    if (foundElements.textarea.tagName === "DIV") {
      console.log("Found textarea classes:", foundElements.textarea.className);
    }
    console.log("Found send button:", !!foundElements.sendButton);
  }

  console.log("--- End Debug Information ---");
}

// Initialize on page load with a delay to ensure DOM is ready
window.addEventListener("load", () => {
  setTimeout(createToggleButton, 1500);
});

// Also try on DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(createToggleButton, 1500);
});

// Try again when URL changes (for SPA navigation)
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    // Stop any existing loop
    stopLoop();
    // Create button again after a delay
    setTimeout(createToggleButton, 1500);
  }
}).observe(document, { subtree: true, childList: true });
