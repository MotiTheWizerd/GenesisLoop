/**
 * Response Observer Module
 * Handles observing and detecting ChatGPT responses
 */
(function() {
  'use strict';

  /**
   * Wait for ChatGPT to finish responding
   * @param {Function} callback Function to call when response is complete
   * @returns {MutationObserver} The observer instance
   */
  function waitForResponse(callback) {
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

                // Use the exact method that works - wait longer and monitor for completion
                let checkCount = 0;
                const maxChecks = 6; // Check up to 6 times

                const checkForCompleteResponse = () => {
                  checkCount++;

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
                    callback(jsonText);
                  } else {
                    console.log("❌ No callback function provided");
                  }
                };

                // Start checking immediately since observer starts when message is sent
                setTimeout(checkForCompleteResponse, 1000);
                return;
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
  observer.timeoutId = setTimeout(() => {
    console.log(
      "⏰ Response detection timeout - using fallback method"
    );
    
    // Fallback method: Try to get the last assistant message
    const lastAssistant = 
      document.querySelector('[data-message-author-role="assistant"]:last-of-type .markdown') ||
      document.querySelector('[data-message-author-role="assistant"]:last-of-type') ||
      document.querySelector('[data-message-author-role="assistant"]:last-child');
    
    if (lastAssistant) {
      const response = lastAssistant.innerText.trim();
      if (response) {
        console.log("🔄 Using fallback method to get response");
        observer.disconnect();
        if (callback) callback(response);
        return;
      }
    }
    
    // If we still don't have a response, call the callback with null
    console.error("❌ Could not detect response after timeout");
    observer.disconnect();
    if (callback) callback(null);
  }, 30000); // 30 second timeout

  return observer;
  }

  // Expose the module
  window.ResponseObserver = {
    waitForResponse: waitForResponse
  };

  console.log('✅ ResponseObserver loaded');
})();
