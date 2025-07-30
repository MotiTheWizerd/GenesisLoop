/**
 * Response Observer Module
 * Handles observing and detecting ChatGPT responses
 */
(function() {
  'use strict';
  
  console.log('🔄 ResponseObserver module starting to load...');

  /**
   * Wait for ChatGPT to finish responding
   * @param {Function} callback Function to call when response is complete
   * @returns {MutationObserver} The observer instance
   */
  function waitForResponse(callback) {
    try {
      console.log('🔄 waitForResponse function called');
      
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
              if (node.tagName === "SVG" || node.tagName === "PATH" || node.tagName === "CIRCLE") {
                continue;
              }

              const className = typeof node.className === "string" ? node.className : node.className?.baseVal || "";
              console.log("🔍 New node added:", node.tagName, className);

              // Check if this is an assistant message container
              if (node.matches("[data-message-author-role='assistant']") ||
                  node.querySelector("[data-message-author-role='assistant']")) {
                
                console.log("🤖 Assistant message container found! Setting up response checker...");

                // Use the proven method with retries
                let checkCount = 0;
                const maxChecks = 6;

                const checkForCompleteResponse = () => {
                  checkCount++;
                  console.log(`🔍 Check ${checkCount}/${maxChecks} - Looking for JSON response`);

                  // Debug: Find ALL assistant messages
                  const allAssistants = Array.from(document.querySelectorAll('[data-message-author-role="assistant"]'));
                  console.log(`🔍 Found ${allAssistants.length} total assistant messages`);

                  // Get the newest assistant message (last in DOM order)
                  const newestAssistant = allAssistants[allAssistants.length - 1];
                  
                  if (!newestAssistant) {
                    console.log("❌ No assistant messages found");
                    if (checkCount < maxChecks) {
                      setTimeout(checkForCompleteResponse, 2000);
                    }
                    return;
                  }

                  // Try to find the content within the assistant message
                  const contentElement = newestAssistant.querySelector('.markdown') || newestAssistant;
                  let jsonText = null;

                  if (contentElement) {
                    // Method 1: Look for JSON in code blocks
                    const codeBlock = contentElement.querySelector("pre, code");
                    if (codeBlock) {
                      jsonText = codeBlock.innerText.trim();
                      console.log("🔍 Found text in code block:", jsonText.substring(0, 100) + "...");
                    }

                    // Method 2: Look for JSON pattern in the full text
                    if (!jsonText) {
                      const fullText = contentElement.innerText;
                      console.log("🔍 Full text to search:", fullText.substring(0, 200) + "...");
                      
                      // Enhanced JSON extraction for complex nested structures
                      const jsonStart = fullText.indexOf('{');
                      if (jsonStart !== -1) {
                        // Find the matching closing brace by counting braces
                        let braceCount = 0;
                        let jsonEnd = -1;
                        
                        for (let i = jsonStart; i < fullText.length; i++) {
                          if (fullText[i] === '{') {
                            braceCount++;
                          } else if (fullText[i] === '}') {
                            braceCount--;
                            if (braceCount === 0) {
                              jsonEnd = i;
                              break;
                            }
                          }
                        }
                        
                        if (jsonEnd !== -1) {
                          jsonText = fullText.substring(jsonStart, jsonEnd + 1);
                          console.log("🔍 Found complete JSON via brace matching:", jsonText.substring(0, 100) + "...");
                        } else {
                          // Fallback to simple regex for incomplete JSON
                          const jsonMatch = fullText.match(/\{[\s\S]*$/);
                          if (jsonMatch) {
                            jsonText = jsonMatch[0];
                            console.log("🔍 Found incomplete JSON via regex:", jsonText.substring(0, 100) + "...");
                          }
                        }
                      }
                    }

                    // Method 3: Fallback to full text
                    if (!jsonText) {
                      jsonText = contentElement.innerText.trim();
                      console.log("🔍 Using full text as fallback:", jsonText.substring(0, 100) + "...");
                    }
                  }

                  console.log("📝 RAW JSON TEXT:", jsonText);
                  console.log("📊 JSON TEXT LENGTH:", jsonText?.length || 0);

                  // Clean up ChatGPT UI artifacts (Copy, Edit buttons, etc.)
                  if (jsonText) {
                    // Find the first { and start JSON from there
                    const jsonStart = jsonText.indexOf('{');
                    if (jsonStart > 0) {
                      const originalText = jsonText;
                      jsonText = jsonText.substring(jsonStart);
                      console.log("🧹 Cleaned JSON TEXT:", jsonText.substring(0, 100) + "...");
                    }
                  }

                  if (!jsonText) {
                    console.log("⏳ No response found yet, checking again...");
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

                  // Enhanced JSON completion detection
                  let isValidJson = false;
                  let jsonData = null;

                  // First, check if JSON structure looks complete
                  const openBraces = (jsonText.match(/\{/g) || []).length;
                  const closeBraces = (jsonText.match(/\}/g) || []).length;
                  const openBrackets = (jsonText.match(/\[/g) || []).length;
                  const closeBrackets = (jsonText.match(/\]/g) || []).length;

                  console.log(`🔍 JSON structure check: {${openBraces}/${closeBraces}} [${openBrackets}/${closeBrackets}]`);

                  // Check if braces and brackets are balanced
                  if (openBraces !== closeBraces || openBrackets !== closeBrackets) {
                    console.log("⚠️ JSON structure incomplete - braces/brackets not balanced, waiting...");
                    if (checkCount < maxChecks) {
                      setTimeout(checkForCompleteResponse, 3000);
                    }
                    return;
                  }

                  // Check if JSON ends properly (not cut off mid-word)
                  const trimmedJson = jsonText.trim();
                  if (!trimmedJson.endsWith('}') && !trimmedJson.endsWith(']')) {
                    console.log("⚠️ JSON doesn't end properly, still generating...");
                    if (checkCount < maxChecks) {
                      setTimeout(checkForCompleteResponse, 3000);
                    }
                    return;
                  }

                  // Now try to parse as JSON
                  try {
                    jsonData = JSON.parse(jsonText);
                    isValidJson = true;
                    console.log("✅ Valid complete JSON found:", jsonData);
                  } catch (e) {
                    console.log("⚠️ JSON parse failed despite structure check:", e.message);
                    console.log("🔍 Problematic JSON:", jsonText.substring(0, 200) + "...");
                    if (checkCount < maxChecks) {
                      setTimeout(checkForCompleteResponse, 3000);
                    }
                    return;
                  }

                  // We have valid JSON - capture it
                  if (isValidJson && jsonData) {
                    console.log("✅ Valid JSON response - capturing it");
                    console.log("🔍 Message field:", jsonData.message);
                  }

                  // We have a complete, valid JSON response
                  console.log("🎉 COMPLETE VALID RESPONSE FOUND!");
                  console.log("📄 FINAL JSON RESPONSE:", jsonText);
                  console.log("📊 Response length:", jsonText.length);

                  // Clear the timeout since we found a response
                  if (observer.timeoutId) {
                    clearTimeout(observer.timeoutId);
                    console.log("🔄 Timeout cleared");
                  }

                  observer.disconnect();
                  console.log("🔄 Observer disconnected");

                  if (callback) {
                    console.log("🚀 Calling callback with complete JSON response");
                    callback(jsonText);
                  } else {
                    console.log("❌ No callback function provided");
                  }
                };

                // Start checking after a short delay
                setTimeout(checkForCompleteResponse, 1000);
                return;
              }
            }
          }
        }
      });

      // Start observing
      observer.observe(targetNode, { childList: true, subtree: true });
      console.log("👁️ Observer started, waiting for response...");

      // Add a timeout fallback
      observer.timeoutId = setTimeout(() => {
        console.log("⏰ Response detection timeout - using fallback method");
        
        const allAssistants = Array.from(document.querySelectorAll('[data-message-author-role="assistant"]'));
        const lastAssistant = allAssistants[allAssistants.length - 1];
        
        if (lastAssistant) {
          const response = lastAssistant.innerText.trim();
          if (response) {
            console.log("🔄 Using fallback method to get response");
            observer.disconnect();
            if (callback) callback(response);
            return;
          }
        }
        
        console.error("❌ Could not detect response after timeout");
        observer.disconnect();
        if (callback) callback(null);
      }, 30000);

      return observer;
      
    } catch (error) {
      console.error('❌ Error in waitForResponse:', error);
      return null;
    }
  }

  // Expose the module
  try {
    window.ResponseObserver = {
      waitForResponse: waitForResponse
    };
    console.log('✅ ResponseObserver loaded successfully');
  } catch (error) {
    console.error('❌ Error exposing ResponseObserver:', error);
  }
  
})();