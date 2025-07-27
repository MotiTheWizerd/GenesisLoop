/**
 * Element Finder Module
 * Handles locating UI elements in the ChatGPT interface
 */
(function() {
  'use strict';

  /**
   * Find required ChatGPT UI elements (textarea and send button)
   * @returns {Object} Object containing success status and found elements
   */
  function findRequiredElements() {
    console.log("🔍 Finding required UI elements...");

    // Try multiple possible selectors for the textarea (updated for current ChatGPT)
    const textarea =
      document.querySelector("textarea#prompt-textarea") ||
      document.querySelector("textarea[placeholder*='Message']") ||
      document.querySelector("textarea[data-id='root']") ||
      document.querySelector("div[contenteditable='true']") ||
      document.querySelector(".ProseMirror") ||
      document.querySelector("textarea") || // Fallback to any textarea
      document.querySelector("[contenteditable='true']"); // Any contenteditable element

    if (!textarea) {
      console.log("❌ Could not find textarea element");
      console.log(
        "🔍 Available textareas:",
        document.querySelectorAll("textarea").length
      );
      console.log(
        "🔍 Available contenteditable:",
        document.querySelectorAll("[contenteditable='true']").length
      );
    } else {
      console.log(
        "✅ Found textarea:",
        textarea.tagName,
        textarea.id || textarea.className
      );
    }

    // Try multiple possible selectors for the send button (updated for current ChatGPT)
    let sendButton =
      document.querySelector('button[data-testid="send-button"]') ||
      document.querySelector('button[aria-label="Send message"]') ||
      document.querySelector('button[aria-label*="Send"]') ||
      document.querySelector('button[title*="Send"]') ||
      document.querySelector(
        "button.absolute.p-1.rounded-md.md\\:bottom-3.md\\:p-2.md\\:right-3"
      ) ||
      document.querySelector("button[type='submit']"); // Common submit button

    // Exclude voice/speech buttons specifically
    if (sendButton && (
      sendButton.getAttribute('data-testid') === 'composer-speech-button' ||
      sendButton.getAttribute('aria-label')?.includes('voice') ||
      sendButton.getAttribute('aria-label')?.includes('speech')
    )) {
      console.log("⚠️ Found voice button, not send button - continuing search...");
      sendButton = null;
    }

    // If we still don't have a send button, try more approaches
    if (!sendButton) {
      console.log(
        "⚠️ Standard send button selectors failed, trying alternatives..."
      );

      // Try to find the button with class that contains "relative flex h-9"
      sendButton = document.querySelector("button.relative.flex.h-9");

      // If that doesn't work, try the composer-btn class
      if (!sendButton) {
        sendButton = document.querySelector("button.composer-btn");
      }

      // Try to find a button with a paper plane icon (common for send buttons)
      if (!sendButton) {
        const allSVGs = document.querySelectorAll("svg");
        for (const svg of allSVGs) {
          // Look for SVG paths that might be a paper plane icon
          if (
            svg.innerHTML.includes("M.5 1.5") ||
            svg.innerHTML.includes("paper-plane") ||
            svg.innerHTML.includes("send")
          ) {
            // Found a potential send icon, get its parent button
            let element = svg;
            while (element && element.tagName !== "BUTTON") {
              element = element.parentElement;
            }
            if (element && element.tagName === "BUTTON") {
              sendButton = element;
              console.log("Found send button by SVG icon");
              break;
            }
          }
        }
      }

      // If still not found, try to find any button near the textarea
      if (!sendButton && textarea) {
        console.log("⚠️ Trying position-based button detection...");
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

      // Last resort: try to find any button that's a sibling or near the textarea
      if (!sendButton && textarea) {
        console.log("⚠️ Trying to find button near textarea...");
        let parent = textarea.parentElement;
        while (parent && !sendButton) {
          const buttons = parent.querySelectorAll("button");
          if (buttons.length > 0) {
            // Prefer buttons with SVG icons
            for (const btn of buttons) {
              if (btn.innerHTML.includes("svg")) {
                sendButton = btn;
                console.log("Found send button as sibling of textarea");
                break;
              }
            }
            // If no button with SVG found, take the first button
            if (!sendButton && buttons.length > 0) {
              sendButton = buttons[0];
              console.log("Found first button near textarea");
            }
          }
          parent = parent.parentElement;
          // Don't go too far up the tree
          if (parent && parent.tagName === "BODY") break;
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
      success: !!textarea, // Only require textarea now
      textarea,
      sendButton, // Optional - kept for backward compatibility
    };
  }

  // Expose the module
  window.ElementFinder = {
    findRequiredElements: findRequiredElements
  };

  console.log('✅ ElementFinder loaded');
})();
