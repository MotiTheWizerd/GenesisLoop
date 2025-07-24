/**
 * Message sender component for sending messages to ChatGPT
 */
(function () {
  "use strict";

  window.MessageSender = {
    /**
     * Send a test message to ChatGPT
     * @returns {boolean} Whether the message was sent successfully
     */
    sendTestMessage: function () {
      console.log("🚀 MessageSender.sendTestMessage called");

      // Check if dependencies are loaded
      if (
        typeof window.DOMUtils === "undefined" ||
        typeof window.Constants === "undefined"
      ) {
        console.error("❌ Dependencies not loaded");
        return false;
      }

      const elements = window.DOMUtils.findRequiredElements();

      if (!elements.success) {
        console.log("❌ Elements not found");
        return false;
      }

      try {
        const textToSend = Constants.DEFAULT_MESSAGE;
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

        // Try the simulation approach first
        try {
          console.log("🔤 Trying simulated typing approach");
          simulateTyping();
        } catch (typingError) {
          console.log("⚠️ Simulated typing failed:", typingError);

          // Fall back to direct value setting
          console.log("⚠️ Falling back to direct value setting");

          // Handle different types of input elements
          if (elements.textarea.tagName === "TEXTAREA") {
            // Standard textarea
            elements.textarea.value = textToSend;
            elements.textarea.dispatchEvent(
              new Event("input", { bubbles: true })
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

              // Wait a moment to ensure the UI updates before clicking send
              setTimeout(() => {
                if (
                  elements.sendButton &&
                  typeof window.MessageLoop !== "undefined" &&
                  window.MessageLoop.isRunning
                ) {
                  console.log("🖱️ Attempting to click send button...");
                  console.log("Button disabled?", elements.sendButton.disabled);
                  console.log(
                    "Button visible?",
                    elements.sendButton.offsetParent !== null
                  );

                  // Try to enable the button if it's disabled
                  if (elements.sendButton.disabled) {
                    console.log(
                      "⚠️ Send button is disabled, trying to enable it"
                    );
                    elements.sendButton.disabled = false;
                  }

                  // Try multiple click approaches
                  try {
                    // Method 1: Direct click
                    elements.sendButton.click();
                    console.log("✅ Send button clicked via .click()");
                  } catch (clickError) {
                    console.error("❌ Direct click failed:", clickError);

                    try {
                      // Method 2: MouseEvent
                      elements.sendButton.dispatchEvent(
                        new MouseEvent("click", {
                          bubbles: true,
                          cancelable: true,
                          view: window,
                        })
                      );
                      console.log("✅ Send button clicked via MouseEvent");
                    } catch (mouseError) {
                      console.error("❌ MouseEvent click failed:", mouseError);

                      // Method 3: Try to find and click any child elements
                      const childElements =
                        elements.sendButton.querySelectorAll("*");
                      console.log(
                        `Trying to click ${childElements.length} child elements`
                      );

                      for (let i = 0; i < childElements.length; i++) {
                        try {
                          childElements[i].click();
                          console.log(`✅ Clicked child element ${i}`);
                          break;
                        } catch (e) {
                          console.log(`Failed to click child ${i}`);
                        }
                      }
                    }
                  }

                  // If all click methods failed, try pressing Enter
                  try {
                    console.log("🔤 Trying Enter key press as last resort");
                    elements.textarea.focus();
                    const enterEvent = new KeyboardEvent("keydown", {
                      key: "Enter",
                      code: "Enter",
                      keyCode: 13,
                      which: 13,
                      bubbles: true,
                      cancelable: true,
                      ctrlKey: false,
                      shiftKey: false,
                    });
                    elements.textarea.dispatchEvent(enterEvent);
                    console.log("✅ Enter key pressed");
                  } catch (enterError) {
                    console.error("❌ Enter key press failed:", enterError);
                  }
                } else {
                  console.log(
                    "❌ Cannot click send button - button missing or loop stopped"
                  );
                }
              }, 500);

              // Return early since we're handling the click in the timeout
              return true;
            } else {
              // Generic contenteditable approach
              elements.textarea.innerHTML = textToSend;
              elements.textarea.dispatchEvent(
                new Event("input", { bubbles: true })
              );
            }
          }
        }

        // Click the send button immediately for non-ProseMirror cases
        console.log("🖱️ Clicking send button for non-ProseMirror case");

        // Try to enable the button if it's disabled
        if (elements.sendButton.disabled) {
          console.log("⚠️ Send button is disabled, trying to enable it");
          elements.sendButton.disabled = false;
        }

        // Try multiple click approaches
        try {
          // Method 1: Direct click
          elements.sendButton.click();
          console.log("✅ Send button clicked via .click()");
        } catch (clickError) {
          console.error("❌ Direct click failed:", clickError);

          try {
            // Method 2: MouseEvent
            elements.sendButton.dispatchEvent(
              new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window,
              })
            );
            console.log("✅ Send button clicked via MouseEvent");
          } catch (mouseError) {
            console.error("❌ MouseEvent click failed:", mouseError);

            // Method 3: Try pressing Enter key
            try {
              console.log("🔤 Trying Enter key press");
              elements.textarea.focus();
              const enterEvent = new KeyboardEvent("keydown", {
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
              });
              elements.textarea.dispatchEvent(enterEvent);
              console.log("✅ Enter key pressed");
            } catch (enterError) {
              console.error("❌ Enter key press failed:", enterError);
            }
          }
        }

        console.log("✅ Sent: <test>");

        // Fire the signal after sending
        this.onSignalSent();

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
