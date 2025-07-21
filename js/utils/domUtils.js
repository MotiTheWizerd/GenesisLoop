/**
 * Utility functions for DOM manipulation and element selection
 */
const DOMUtils = {
  /**
   * Find required ChatGPT UI elements (textarea and send button)
   * @returns {Object} Object containing success status and found elements
   */
  findRequiredElements: function() {
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
  },

  /**
   * Debug function to log information about ChatGPT UI elements
   */
  debugElements: function() {
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
    const foundElements = this.findRequiredElements();
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
};