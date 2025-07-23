/**
 * Utility functions for DOM manipulation and element selection
 */
(function () {
  "use strict";

  window.DOMUtils = {
    /**
     * Wait for ChatGPT to finish responding
     * @param {Function} callback Function to call when response is complete
     * @returns {MutationObserver} The observer instance
     */
    waitForResponse: function (callback) {
      // Find the main chat container
      const targetNode = document.querySelector("main");
      if (!targetNode) {
        console.error("❌ Could not find main chat container");
        return null;
      }

      console.log("👁️ Setting up response observer...");

      // Create a new observer
      const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) {
              // Skip SVG elements and other non-content elements
              if (
                node.tagName === "SVG" ||
                node.tagName === "PATH" ||
                node.tagName === "CIRCLE"
              ) {
                continue;
              }

              const className =
                typeof node.className === "string"
                  ? node.className
                  : node.className?.baseVal || "";
              console.log("🔍 New node added:", node.tagName, className);

              // Try multiple selectors for message detection (updated for current ChatGPT)
              let messageContent = null;
              let isAssistantMessage = false;

              try {
                // Method 1: Prioritize the specific assistant message pattern you identified
                if (
                  node.matches("[data-message-author-role='assistant']") ||
                  node.querySelector(
                    "[data-message-author-role='assistant']"
                  ) ||
                  node.matches(".group.w-full") ||
                  node.matches("[data-testid*='conversation-turn']") ||
                  node.matches("article.text-token-text-primary")
                ) {
                  console.log("🎯 Potential message container found");

                  // Special handling for assistant messages
                  const isAssistantDiv =
                    node.matches("[data-message-author-role='assistant']") ||
                    node.querySelector(
                      "[data-message-author-role='assistant']"
                    );

                  if (isAssistantDiv) {
                    console.log(
                      "🤖 Confirmed assistant message div found! Using your proven method..."
                    );

                    // Use the exact method you provided that works - wait longer and monitor for completion
                    let checkCount = 0;
                    const maxChecks = 6; // Check up to 6 times

                    const checkForCompleteResponse = () => {
                      checkCount++;

                      // Use your exact proven method
                      // Try multiple selectors to find the JSON
                      const lastAssistant = 
                        document.querySelector('[data-message-author-role="assistant"]:last-of-type .markdown') ||
                        document.querySelector('[data-message-author-role="assistant"]:last-of-type') ||
                        document.querySelector('[data-message-author-role="assistant"]:last-child');

                      // Try different ways to extract the JSON
                      let jsonText = null;

                      if (lastAssistant) {
                        // Method 1: Look for JSON in code blocks
                        const codeBlock =
                          lastAssistant.querySelector("pre, code");
                        if (codeBlock) {
                          jsonText = codeBlock.innerText.trim();
                          console.log("🔍 Found JSON in code block:", jsonText);
                        }

                        // Method 2: Look for JSON pattern in the text
                        if (!jsonText) {
                          const fullText = lastAssistant.innerText;
                          const jsonMatch = fullText.match(
                            /\{[^}]*"status"[^}]*"message"[^}]*\}/
                          );
                          if (jsonMatch) {
                            jsonText = jsonMatch[0];
                            console.log("🔍 Found JSON via regex:", jsonText);
                          }
                        }

                        // Method 3: Fallback to full text
                        if (!jsonText) {
                          jsonText = lastAssistant.innerText.trim();
                          console.log(
                            "🔍 Using full text as fallback:",
                            jsonText
                          );
                        }
                      }

                      console.log(
                        `🔍 Check ${checkCount}/${maxChecks} - Using your proven method`
                      );
                      console.log("📝 RAW JSON TEXT:", jsonText);
                      console.log(
                        "📊 JSON TEXT LENGTH:",
                        jsonText?.length || 0
                      );

                      if (!jsonText) {
                        console.log(
                          "⏳ No response found yet, checking again..."
                        );
                        if (checkCount < maxChecks) {
                          setTimeout(checkForCompleteResponse, 2000);
                        }
                        return;
                      }

                      // Check if response starts with "<" - means it's the echo, ignore it
                      if (jsonText.startsWith("<")) {
                        console.log("⏭️ Response starts with '<' - it's the echo, ignoring...");
                        if (checkCount < maxChecks) {
                          setTimeout(checkForCompleteResponse, 2000);
                        }
                        return;
                      }
                      
                      // Check if response starts with "{" - this is the JSON we want
                      if (!jsonText.startsWith("{")) {
                        console.log("⏳ Response doesn't start with '{' - not JSON yet, waiting...");
                        if (checkCount < maxChecks) {
                          setTimeout(checkForCompleteResponse, 2000);
                        }
                        return;
                      }

                      // Try to parse as JSON to check if complete
                      let isValidJson = false;
                      let jsonData = null;

                      try {
                        jsonData = JSON.parse(jsonText);
                        isValidJson = true;
                        console.log("✅ Valid complete JSON found:", jsonData);
                      } catch (e) {
                        console.log(
                          "⚠️ Incomplete JSON - still generating, waiting 5 seconds..."
                        );
                        if (checkCount < maxChecks) {
                          setTimeout(checkForCompleteResponse, 5000); // Wait 5 seconds for incomplete JSON
                        }
                        return;
                      }

                      // We have valid JSON - capture it regardless of content
                      if (isValidJson && jsonData) {
                        console.log("✅ Valid JSON response - capturing it");
                        console.log("🔍 Message field:", jsonData.message);
                      }

                      // We have a complete, valid JSON response that's not an echo
                      console.log("🎉 COMPLETE VALID RESPONSE FOUND!");
                      console.log("📄 FINAL JSON RESPONSE:", jsonText);
                      console.log("📊 Response length:", jsonText.length);
                      if (jsonData && jsonData.message) {
                        console.log("💬 Message content:", jsonData.message);
                      }

                      // Clear the timeout since we found a response
                      if (observer.timeoutId) {
                        clearTimeout(observer.timeoutId);
                        console.log("🔄 Timeout cleared");
                      }

                      observer.disconnect();
                      console.log("🔄 Observer disconnected");

                      if (callback) {
                        console.log(
                          "🚀 Calling callback with complete JSON response"
                        );
                        callback(jsonText); // Return the complete JSON string
                      } else {
                        console.log("❌ No callback function provided");
                      }
                    };

                    // Start checking immediately since observer starts when message is sent
                    setTimeout(checkForCompleteResponse, 1000);

                    // Don't process this message further right now
                    continue;
                  }

                  // Try different content selectors (updated for current ChatGPT)
                  const contentElement =
                    node.querySelector(".result-thinking") ||
                    node.querySelector(".markdown") ||
                    node.querySelector("[data-message-content]") ||
                    node.querySelector(".prose") ||
                    node.querySelector("p") ||
                    node;

                  if (contentElement) {
                    messageContent =
                      contentElement.innerText || contentElement.textContent;
                    const className =
                      typeof contentElement.className === "string"
                        ? contentElement.className
                        : "";
                    console.log("🔍 Content element found:", className);
                    console.log(
                      "🔍 Raw content:",
                      messageContent?.substring(0, 100)
                    );

                    // Special handling for result-thinking elements that might be still loading
                    if (
                      className.includes("result-thinking") &&
                      (!messageContent || messageContent.trim().length < 5)
                    ) {
                      console.log(
                        "🔄 Result-thinking element found but content empty, will retry"
                      );
                      // Don't process this yet, let the timeout mechanism handle it
                      return;
                    }
                  }

                  isAssistantMessage =
                    node.matches("[data-message-author-role='assistant']") ||
                    node.querySelector(
                      "[data-message-author-role='assistant']"
                    ) ||
                    !node.querySelector("[data-message-author-role='user']");
                }

                // Method 2: Check if the node itself contains message content
                if (
                  !messageContent &&
                  (node.matches(".markdown") ||
                    node.matches("[data-message-content]") ||
                    node.matches(".prose") ||
                    node.matches(".result-thinking") ||
                    (typeof node.className === "string" &&
                      node.className.includes("prose")))
                ) {
                  console.log("🎯 Direct content node found");
                  messageContent = node.innerText || node.textContent;
                  console.log(
                    "🔍 Direct content extracted:",
                    messageContent?.substring(0, 100)
                  );

                  // Check if parent indicates this is an assistant message
                  let parent = node.parentElement;
                  while (parent && !isAssistantMessage) {
                    if (
                      parent.matches(
                        "[data-message-author-role='assistant']"
                      ) ||
                      parent.querySelector(
                        "[data-message-author-role='assistant']"
                      ) ||
                      (typeof parent.className === "string" &&
                        parent.className.includes("text-message"))
                    ) {
                      isAssistantMessage = true;
                    }
                    parent = parent.parentElement;
                    if (parent?.tagName === "BODY") break; // Don't go too far up
                  }

                  // If we can't determine from parent, assume it's assistant if it contains meaningful content
                  if (
                    !isAssistantMessage &&
                    messageContent &&
                    messageContent.trim().length > 10
                  ) {
                    isAssistantMessage = true;
                    console.log(
                      "🤖 Assuming assistant message based on content length"
                    );
                  }
                }
              } catch (error) {
                console.log("⚠️ Error processing node:", error.message);
                continue;
              }

              if (messageContent && messageContent.trim()) {
                console.log(
                  "📝 Message content found:",
                  messageContent.substring(0, 100)
                );
                console.log("🤖 Is assistant message:", isAssistantMessage);

                // Only process if it's an assistant message and not our test
                if (isAssistantMessage && !messageContent.includes("<test>")) {
                  // Add delay to ensure rendering is complete
                  setTimeout(() => {
                    // Re-extract content in case it was still loading
                    const finalContent =
                      node.querySelector(".markdown")?.innerText ||
                      node.querySelector("[data-message-content]")?.innerText ||
                      node.querySelector(".prose")?.innerText ||
                      node.querySelector(".result-thinking")?.innerText ||
                      node.querySelector("p")?.innerText ||
                      node.innerText ||
                      node.textContent;

                    const response = finalContent?.trim();

                    if (response && response.length > 5) {
                      console.log(
                        "✅ Response detected:",
                        response.substring(0, 50) + "..."
                      );
                      console.log(
                        "🔄 Disconnecting observer and calling callback"
                      );

                      // Clear the timeout since we found a response
                      if (observer.timeoutId) {
                        clearTimeout(observer.timeoutId);
                      }

                      observer.disconnect();
                      if (callback) callback(response);
                    } else {
                      console.log(
                        "⚠️ Response content still empty, waiting longer..."
                      );
                      // Try again with longer delay
                      setTimeout(() => {
                        const retryContent =
                          node.querySelector(".markdown")?.innerText ||
                          node.querySelector(".prose")?.innerText ||
                          node.innerText ||
                          node.textContent;

                        if (retryContent && retryContent.trim().length > 5) {
                          console.log(
                            "✅ Response detected on retry:",
                            retryContent.substring(0, 50) + "..."
                          );
                          if (observer.timeoutId) {
                            clearTimeout(observer.timeoutId);
                          }
                          observer.disconnect();
                          if (callback) callback(retryContent.trim());
                        }
                      }, 2000);
                    }
                  }, 1500); // Increased delay for better reliability
                } else if (messageContent.includes("<test>")) {
                  console.log("⏭️ Skipping our own test message");
                } else if (!isAssistantMessage) {
                  console.log("⏭️ Skipping user message");
                }
              }
            }
          }
        }
      });

      // Start observing
      observer.observe(targetNode, { childList: true, subtree: true });
      console.log("👁️ Observer started, waiting for response...");

      // Add a timeout fallback in case response detection fails
      const timeoutId = setTimeout(() => {
        console.log(
          "⏰ Response detection timeout - using your proven method as fallback"
        );

        // Use your exact proven method for fallback
        // Try multiple selectors to find the JSON
        const lastAssistant = 
          document.querySelector('[data-message-author-role="assistant"]:last-of-type .markdown') ||
          document.querySelector('[data-message-author-role="assistant"]:last-of-type') ||
          document.querySelector('[data-message-author-role="assistant"]:last-child');

        // Try different ways to extract the JSON
        let jsonText = null;

        if (lastAssistant) {
          // Method 1: Look for JSON in code blocks
          const codeBlock = lastAssistant.querySelector("pre, code");
          if (codeBlock) {
            jsonText = codeBlock.innerText.trim();
            console.log("🔍 Fallback: Found JSON in code block:", jsonText);
          }

          // Method 2: Look for JSON pattern in the text
          if (!jsonText) {
            const fullText = lastAssistant.innerText;
            const jsonMatch = fullText.match(
              /\{[^}]*"status"[^}]*"message"[^}]*\}/
            );
            if (jsonMatch) {
              jsonText = jsonMatch[0];
              console.log("🔍 Fallback: Found JSON via regex:", jsonText);
            }
          }

          // Method 3: Fallback to full text
          if (!jsonText) {
            jsonText = lastAssistant.innerText.trim();
            console.log("🔍 Fallback: Using full text as fallback:", jsonText);
          }
        }

        console.log("🔍 Fallback: Using your proven method");
        console.log("📝 FALLBACK - RAW JSON TEXT:", jsonText);
        console.log("📊 FALLBACK - JSON LENGTH:", jsonText?.length || 0);

        if (!jsonText) {
          console.log("❌ Fallback: No response found");
        } else if (jsonText.startsWith("<")) {
          console.log("⏭️ Fallback: Response starts with '<' - it's the echo, ignoring");
        } else if (jsonText.startsWith("{")) {
          // Try to parse as JSON
          let isValidJson = false;
          let jsonData = null;

          try {
            jsonData = JSON.parse(jsonText);
            isValidJson = true;
            console.log("✅ Fallback: Valid complete JSON found:", jsonData);
          } catch (e) {
            console.log("⚠️ Fallback: Incomplete JSON detected");
          }

          if (isValidJson) {
            // Capture any valid JSON response
            if (jsonData) {
              console.log("🎉 FALLBACK SUCCESS - Complete valid JSON found!");
              console.log("📄 FALLBACK FINAL JSON:", jsonText);
              console.log("💬 Fallback message content:", jsonData.message);
              observer.disconnect();
              if (callback) callback(jsonText);
              return;
            }
          }
        }

        // If proven method doesn't work, try the old approach
        const assistantMessages = document.querySelectorAll(
          "[data-message-author-role='assistant']"
        );
        const otherMessages = document.querySelectorAll(
          ".group.w-full, [data-testid*='conversation-turn'], .text-message, .result-thinking"
        );

        // Combine with assistant messages first
        const allMessages = [...assistantMessages, ...otherMessages];

        console.log(
          `🔍 Fallback: Found ${allMessages.length} potential message elements`
        );

        if (allMessages.length > 0) {
          // Check the last few messages in case the latest one is still our test message
          for (
            let i = allMessages.length - 1;
            i >= Math.max(0, allMessages.length - 3);
            i--
          ) {
            const message = allMessages[i];

            const contentElement =
              message.querySelector(".markdown") ||
              message.querySelector("[data-message-content]") ||
              message.querySelector(".prose") ||
              message.querySelector(".result-thinking") ||
              message.querySelector("p") ||
              message;

            const content =
              contentElement?.innerText || contentElement?.textContent;

            console.log(`🔍 Checking message ${i}:`, content?.substring(0, 50));

            if (
              content &&
              content.trim() &&
              !content.includes("<test>") &&
              content.trim().length > 5
            ) {
              let finalContent = content.trim();

              // If it's a JSON response, try to extract the actual message
              if (
                finalContent.includes('"status": "received"') &&
                finalContent.includes('"message":')
              ) {
                try {
                  const jsonMatch = finalContent.match(
                    /\{[^}]*"message":\s*"([^"]*)"[^}]*\}/
                  );
                  if (jsonMatch && jsonMatch[1]) {
                    finalContent = jsonMatch[1];
                    console.log(
                      "📝 Extracted message from JSON:",
                      finalContent
                    );
                  }
                } catch (e) {
                  console.log(
                    "⚠️ Could not parse JSON response, using raw content"
                  );
                }
              }

              console.log("✅ Fallback: Found response via backup method");
              observer.disconnect();
              if (callback) callback(finalContent);
              return;
            }
          }
        }

        // Last resort: look for any new text content that might be a response
        console.log("🔍 Last resort: Looking for any new text content...");
        const allTextElements = document.querySelectorAll(
          "p, div, span, .markdown, .prose"
        );

        for (const element of allTextElements) {
          const text = element.innerText || element.textContent;
          if (
            text &&
            text.trim().length > 10 &&
            !text.includes("<test>") &&
            !text.includes("Message ChatGPT") &&
            !text.includes("Send message") &&
            !text.includes("You said:")
          ) {
            let finalText = text.trim();

            // Handle JSON responses
            if (
              finalText.includes('"status": "received"') &&
              finalText.includes('"message":')
            ) {
              try {
                const jsonMatch = finalText.match(
                  /\{[^}]*"message":\s*"([^"]*)"[^}]*\}/
                );
                if (jsonMatch && jsonMatch[1]) {
                  finalText = jsonMatch[1];
                  console.log(
                    "📝 Last resort: Extracted message from JSON:",
                    finalText
                  );
                }
              } catch (e) {
                console.log(
                  "⚠️ Could not parse JSON in last resort, using raw content"
                );
              }
            }

            // Check if this looks like a ChatGPT response (contains common patterns or is substantial)
            if (
              finalText.length > 15 &&
              (finalText.includes("I") ||
                finalText.includes("you") ||
                finalText.includes("can") ||
                finalText.includes("help") ||
                finalText.includes("would") ||
                finalText.includes("The") ||
                finalText.includes("This") ||
                finalText.length > 50)
            ) {
              console.log("✅ Last resort: Found potential response");
              observer.disconnect();
              if (callback) callback(finalText);
              return;
            }
          }
        }

        console.log(
          "❌ No response detected after timeout and fallback attempts"
        );
        observer.disconnect();
      }, 15000); // 15 second timeout to allow for complete response loading

      // Store timeout ID so we can clear it if response is detected normally
      observer.timeoutId = timeoutId;

      return observer;
    },

    /**
     * Find required ChatGPT UI elements (textarea and send button)
     * @returns {Object} Object containing success status and found elements
     */
    findRequiredElements: function () {
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

      // If we still don't have a send button, try more approaches
      if (!sendButton) {
        console.log(
          "⚠️ Standard send button selectors failed, trying alternatives..."
        );

        // Try to find the button with class that contains "relative flex h-9" (from debug output)
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
        success: !!(textarea && sendButton),
        textarea,
        sendButton,
      };
    },

    /**
     * Debug function to log information about ChatGPT UI elements
     */
    debugElements: function () {
      console.log("--- Debug Information ---");
      console.log("URL:", window.location.href);
      console.log(
        "Is ChatGPT page:",
        window.location.href.includes("chat.openai.com") ||
          window.location.href.includes("chatgpt.com")
      );

      // Check for standard textarea
      const standardTextarea = document.querySelector(
        "textarea#prompt-textarea"
      );
      console.log("Standard textarea found:", !!standardTextarea);
      if (standardTextarea) {
        console.log("Textarea ID:", standardTextarea.id);
        console.log(
          "Textarea is visible:",
          standardTextarea.offsetParent !== null
        );
      }

      // Check for contenteditable div
      const contentEditable = document.querySelector(
        "div[contenteditable='true']"
      );
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
        console.log(
          "ProseMirror is visible:",
          proseMirror.offsetParent !== null
        );
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
          console.log(
            "Found textarea classes:",
            foundElements.textarea.className
          );
        }
        console.log("Found send button:", !!foundElements.sendButton);
      }

      console.log("--- End Debug Information ---");
    },

    /**
     * Debug function to analyze current ChatGPT message structure
     */
    debugMessageStructure: function () {
      console.log("--- Message Structure Debug ---");

      // Look for all potential message containers
      const containers = document.querySelectorAll(
        ".group, [data-message-author-role], [data-testid*='conversation'], .markdown, .prose"
      );

      console.log(`Found ${containers.length} potential message elements`);

      containers.forEach((container, index) => {
        if (index < 5) {
          // Only log first 5 to avoid spam
          console.log(`Element ${index}:`, {
            tagName: container.tagName,
            className: container.className,
            id: container.id,
            dataAttributes: Array.from(container.attributes)
              .filter((attr) => attr.name.startsWith("data-"))
              .map((attr) => `${attr.name}="${attr.value}"`),
            textContent: container.textContent?.substring(0, 50) + "...",
          });
        }
      });

      // Look for the main chat container
      const main = document.querySelector("main");
      if (main) {
        console.log("Main container found:", main.className);
      }

      console.log("--- End Message Structure Debug ---");
    },
  };

  console.log("✅ DOMUtils loaded");
})();
