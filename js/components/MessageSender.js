/**
 * Message sender component for sending messages to ChatGPT
 */
(function () {
  "use strict";

  window.MessageSender = {
    /**
     * Send a test message to ChatGPT
     * @param {string|Function} message - Message to send or callback function for failure
     * @param {Function} onFailure - Callback function for failure (when message is string)
     * @param {boolean} skipResponseHandling - Skip automatic response handling (for MessageLoop)
     * @returns {Promise<boolean>} Promise that resolves when message is actually sent
     */
    sendTestMessage: async function (message, onFailure, skipResponseHandling = false) {
      console.log("🚀 MessageSender.sendTestMessage called");

      // Handle legacy callback parameter (when message is actually a callback)
      if (typeof message === 'function') {
        onFailure = message;
        message = null;
      }

      // Check if dependencies are loaded
      if (
        typeof window.DOMUtils === "undefined" ||
        typeof window.Constants === "undefined"
      ) {
        console.error("❌ Dependencies not loaded");
        return false;
      }

      const elements = window.DOMUtils.findRequiredElements();

      // We only need the textarea now (not the send button)
      if (!elements.textarea) {
        console.log("❌ Textarea not found");
        if (onFailure) onFailure();
        return false;
      }

      try {
        const textToSend = message || Constants.DEFAULT_MESSAGE;
        console.log(
          "📝 Attempting to send message:",
          textToSend,
          "using:",
          elements.textarea.tagName
        );

        // Try to focus the textarea first to ensure it's active
        try {
          elements.textarea.focus();
          console.log("✅ Textarea focused");
        } catch (focusError) {
          console.log("⚠️ Could not focus textarea:", focusError);
        }

        // Try to simulate keyboard events for better compatibility
        const simulateTyping = () => {
          // Clear existing content first
          if (elements.textarea.tagName === "TEXTAREA") {
            elements.textarea.value = "";
          } else {
            elements.textarea.innerHTML = "";
          }

          // Simulate typing each character
          const chars = textToSend.split("");
          chars.forEach((char, index) => {
            // Create keyboard event
            const keyEvent = new KeyboardEvent("keydown", {
              key: char,
              code: `Key${char.toUpperCase()}`,
              bubbles: true,
            });

            // Dispatch the event
            elements.textarea.dispatchEvent(keyEvent);

            // Update the content
            if (elements.textarea.tagName === "TEXTAREA") {
              elements.textarea.value += char;
            } else {
              // For contenteditable
              const textNode = document.createTextNode(char);
              if (index === 0) {
                elements.textarea.innerHTML = "";
                const p = document.createElement("p");
                p.appendChild(textNode);
                elements.textarea.appendChild(p);
              } else {
                const p = elements.textarea.querySelector("p");
                if (p) p.appendChild(textNode);
              }
            }

            // Dispatch input event
            elements.textarea.dispatchEvent(
              new Event("input", { bubbles: true })
            );
          });

          // Final input event
          elements.textarea.dispatchEvent(
            new Event("input", { bubbles: true })
          );
          elements.textarea.dispatchEvent(
            new Event("change", { bubbles: true })
          );
        };

        // Check if message is complex and skip simulation
        const isComplexMessage =
          textToSend.includes('"') ||
          textToSend.includes("{") ||
          textToSend.includes("}");

        if (!isComplexMessage) {
          // Try the simulation approach first for simple messages
          try {
            console.log("🔤 Trying simulated typing approach");
            simulateTyping();
          } catch (typingError) {
            console.log("⚠️ Simulated typing failed:", typingError);
          }
        } else {
          console.log(
            "🔤 Complex message detected, using direct value setting"
          );
        }

        // Use direct value setting for complex messages or if simulation failed
        if (isComplexMessage) {
          // Fall back to direct value setting
          console.log("⚠️ Using direct value setting for complex message");

          // Handle different types of input elements
          if (elements.textarea.tagName === "TEXTAREA") {
            // Standard textarea
            elements.textarea.value = textToSend;
            elements.textarea.dispatchEvent(
              new Event("input", { bubbles: true })
            );
            elements.textarea.dispatchEvent(
              new Event("change", { bubbles: true })
            );
            elements.textarea.dispatchEvent(
              new Event("keyup", { bubbles: true })
            );
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
              elements.textarea.dispatchEvent(
                new Event("input", { bubbles: true })
              );
              elements.textarea.dispatchEvent(
                new Event("change", { bubbles: true })
              );

              // Additional events to trigger ChatGPT's validation
              elements.textarea.dispatchEvent(
                new Event("keyup", { bubbles: true })
              );
              elements.textarea.dispatchEvent(
                new Event("paste", { bubbles: true })
              );

              // Don't return early - let it fall through to send button click
              console.log("✅ ProseMirror content set, will proceed to send button click");
            } else {
              // Generic contenteditable approach
              elements.textarea.innerHTML = textToSend;
              elements.textarea.dispatchEvent(
                new Event("input", { bubbles: true })
              );
            }
          }
        }

        // Send message using Enter key simulation (much simpler and more reliable)
        console.log("⌨️ Sending message via Enter key simulation");

        setTimeout(() => {
          console.log("🔍 Textarea info:");
          console.log("  - Textarea element:", elements.textarea);
          console.log("  - Textarea focused:", document.activeElement === elements.textarea);
          console.log("  - Textarea content:", elements.textarea.innerText || elements.textarea.value);
          
          try {
            // Focus the textarea first
            console.log("🎯 Focusing textarea...");
            elements.textarea.focus();
            
            // Wait a moment for focus to take effect
            setTimeout(() => {
              console.log("⌨️ Simulating Enter key press...");
              
              // Create comprehensive Enter key events
              const enterKeyDown = new KeyboardEvent("keydown", {
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
                ctrlKey: false,
                shiftKey: false,
                altKey: false,
                metaKey: false
              });
              
              const enterKeyPress = new KeyboardEvent("keypress", {
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
                ctrlKey: false,
                shiftKey: false,
                altKey: false,
                metaKey: false
              });
              
              const enterKeyUp = new KeyboardEvent("keyup", {
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
                ctrlKey: false,
                shiftKey: false,
                altKey: false,
                metaKey: false
              });
              
              // Dispatch all three events in sequence
              console.log("📤 Dispatching keydown event...");
              const keydownResult = elements.textarea.dispatchEvent(enterKeyDown);
              console.log("📤 Keydown result:", keydownResult);
              
              console.log("📤 Dispatching keypress event...");
              const keypressResult = elements.textarea.dispatchEvent(enterKeyPress);
              console.log("📤 Keypress result:", keypressResult);
              
              console.log("📤 Dispatching keyup event...");
              const keyupResult = elements.textarea.dispatchEvent(enterKeyUp);
              console.log("📤 Keyup result:", keyupResult);
              
              console.log("✅ Enter key simulation completed");
              
            }, 100); // Small delay after focus
            
          } catch (error) {
            console.error("❌ Enter key simulation failed:", error);
          }
        }, 1500); // 1.5 second delay to ensure text is recognized

        console.log("✅ Sent: <test>");

        // Fire the signal after sending (only if not skipping response handling)
        if (!skipResponseHandling) {
          console.log("📡 Starting MessageSender's own response handling");
          this.onSignalSent();
        } else {
          console.log("⏭️ Skipping MessageSender response handling - MessageLoop will handle it");
        }

        return true;
      } catch (error) {
        console.error("❌ Error sending message:", error);
        if (typeof window.DOMUtils !== "undefined") {
          window.DOMUtils.debugElements();
        }
        return false;
      }
    },

    /**
     * Function called after signal is sent
     */
    onSignalSent: function () {
      console.log("📡 Signal sent — initializing observer...");

      const MAX_RETRIES = 10;
      let retryCount = 0;
      let retryCooldown = false; // 👈 Debounce guard

      return new Promise((resolve, reject) => {
        const observer = new MutationObserver((mutations, obs) => {
          if (retryCooldown) return; // ⛔ Prevent overlap
          retryCooldown = true;

          console.log("👁️ MutationObserver triggered");

          const tryScan = async () => {
            const assistants = Array.from(
              document.querySelectorAll(
                '[data-message-author-role="assistant"]'
              )
            ).reverse(); // newest first

            for (const assistantNode of assistants) {
              const markdown = assistantNode.querySelector(".markdown");
              if (!markdown) continue;

              const text = markdown.innerText.trim();
              if (!text) continue;

              console.log("📄 Found assistant response:", text);

              if (text.startsWith("{")) {
                console.log("✅ Found potential JSON:", text);

                const openCount = (text.match(/{/g) || []).length;
                const closeCount = (text.match(/}/g) || []).length;

                if (openCount !== closeCount || !text.endsWith("}")) {
                  console.log(
                    "⏳ JSON still streaming... waiting for completion"
                  );
                  return false; // try again on next retry
                }

                try {
                  const json = JSON.parse(text);
                  console.log("📦 Parsed:", json);

                  // Send JSON to default address
                  if (window.FetchSender) {
                    try {
                      await window.FetchSender.sendJSON(json);
                      console.log("📡 JSON sent to server successfully");
                    } catch (fetchError) {
                      console.error(
                        "❌ Failed to send JSON to server:",
                        fetchError
                      );
                    }
                  }

                  observer.disconnect();
                  resolve(json);
                  return true;
                } catch (e) {
                  console.error("❌ Parse error:", e);
                  observer.disconnect();
                  reject(e);
                  return true;
                }
              }
            }

            return false;
          };

          const retryLoop = async () => {
            if (await tryScan()) return;

            retryCount++;
            if (retryCount < MAX_RETRIES) {
              console.log(`🔁 Retry ${retryCount}/${MAX_RETRIES}`);
              setTimeout(async () => {
                retryCooldown = false; // 👈 Allow next MutationObserver trigger
                await retryLoop();
              }, 2000); // 👈 Your desired delay
            } else {
              console.warn("❌ Max retries reached, no valid response found.");
              obs.disconnect();
              reject(
                new Error("Max retries reached without finding valid JSON.")
              );
            }
          };

          retryLoop().catch(console.error);
        });

        setTimeout(() => {
          console.log("🔗 Observer attached");
          observer.observe(document.body, {
            childList: true,
            subtree: true,
          });
        }, 5000);
      });
    },
  };

  console.log("✅ MessageSender loaded");
})();
