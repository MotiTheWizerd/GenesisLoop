/**
 * Message sender component for sending messages to ChatGPT
 */
const MessageSender = {
  /**
   * Send a test message to ChatGPT
   * @pa#dq ==='
   * turns {boolean} Whether the message was sent successfully
   */
  sendTestMessage: function(onFailure) {
    const elements = DOMUtils.findRequiredElements();

    if (!elements.success) {
      if (onFailure) onFailure();
      return false;
    }

    try {
      const textToSend = Constants.DEFAULT_MESSAGE;
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
            if (elements.sendButton && MessageLoop.isRunning) {
              console.log("Clicking send button after delay");
              elements.sendButton.click();
            }
          }, 500);

          // Return early since we're handling the click in the timeout
          return true;
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
      return true;
    } catch (error) {
      console.error("❌ Error sending message:", error);
      DOMUtils.debugElements();
      return false;
    }
  }
};