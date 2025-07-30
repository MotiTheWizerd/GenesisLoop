/**
 * Test script for complex JSON extraction fix
 * Tests the enhanced ResponseObserver with nested JSON structures
 */

console.log("🧪 Complex JSON Extraction Test Suite Starting...");

// Test 1: Verify ResponseObserver is loaded with enhancements
console.log("\n📋 Test 1: ResponseObserver Enhancement Check");
if (typeof window.ResponseObserver !== 'undefined') {
  console.log("✅ ResponseObserver is loaded");
} else {
  console.log("❌ ResponseObserver is not loaded");
}

// Test 2: Test JSON structure validation logic
console.log("\n🔍 Test 2: JSON Structure Validation");

function testJsonStructure(jsonText, description) {
  console.log(`\nTesting: ${description}`);
  console.log(`JSON: ${jsonText.substring(0, 100)}...`);
  
  const openBraces = (jsonText.match(/\{/g) || []).length;
  const closeBraces = (jsonText.match(/\}/g) || []).length;
  const openBrackets = (jsonText.match(/\[/g) || []).length;
  const closeBrackets = (jsonText.match(/\]/g) || []).length;
  
  console.log(`Structure: {${openBraces}/${closeBraces}} [${openBrackets}/${closeBrackets}]`);
  
  const isBalanced = (openBraces === closeBraces) && (openBrackets === closeBrackets);
  const endsCorrectly = jsonText.trim().endsWith('}') || jsonText.trim().endsWith(']');
  
  console.log(`Balanced: ${isBalanced ? '✅' : '❌'}`);
  console.log(`Ends correctly: ${endsCorrectly ? '✅' : '❌'}`);
  
  try {
    const parsed = JSON.parse(jsonText);
    console.log(`Parse result: ✅ Valid JSON`);
    console.log(`Parsed structure:`, Object.keys(parsed));
  } catch (e) {
    console.log(`Parse result: ❌ ${e.message}`);
  }
}

// Test cases
const testCases = [
  {
    json: '{"task": [{"type": "reflect","question": "What is the origin of thought?"}],"assigned_by": "ray"}',
    description: "Complete complex JSON with task array"
  },
  {
    json: '{"task": [{"type": "reflect","question": "What is the origin of thought?"}',
    description: "Incomplete JSON - missing closing brackets and braces"
  },
  {
    json: '{"action": "reflect", "message": "Simple JSON"}',
    description: "Simple JSON (should work as before)"
  },
  {
    json: '{"nested": {"deep": {"structure": [1, 2, {"inner": "value"}]}}}',
    description: "Deeply nested JSON structure"
  },
  {
    json: '{"task": [{"type": "reflect","question": "What is consciousness?"}, {"type": "analyze","data": [1,2,3]}],"assigned_by": "ray"}',
    description: "Complex JSON with multiple task objects"
  }
];

testCases.forEach((testCase, index) => {
  testJsonStructure(testCase.json, `${index + 1}. ${testCase.description}`);
});

// Test 3: Test brace matching extraction logic
console.log("\n🔧 Test 3: Brace Matching Extraction Logic");

function testBraceMatching(fullText, description) {
  console.log(`\nTesting brace matching: ${description}`);
  console.log(`Full text: ${fullText.substring(0, 150)}...`);
  
  const jsonStart = fullText.indexOf('{');
  if (jsonStart !== -1) {
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
      const extractedJson = fullText.substring(jsonStart, jsonEnd + 1);
      console.log(`✅ Extracted JSON: ${extractedJson.substring(0, 100)}...`);
      console.log(`Length: ${extractedJson.length}`);
      
      try {
        const parsed = JSON.parse(extractedJson);
        console.log(`✅ Successfully parsed extracted JSON`);
      } catch (e) {
        console.log(`❌ Failed to parse: ${e.message}`);
      }
    } else {
      console.log(`❌ No matching closing brace found`);
    }
  } else {
    console.log(`❌ No opening brace found`);
  }
}

// Test brace matching with realistic ChatGPT response text
const chatGptResponses = [
  'Here is your task: {"task": [{"type": "reflect","question": "What is the origin of thought?"}],"assigned_by": "ray"} Please process this carefully.',
  'The response is {"action": "reflect", "message": "I am thinking about consciousness"} and that completes the task.',
  'Complex structure: {"nested": {"data": [{"item": 1}, {"item": 2}]}, "status": "complete"} - end of response.',
  'Incomplete response: {"task": [{"type": "reflect","question": "What is consciousness?" - this is cut off'
];

chatGptResponses.forEach((response, index) => {
  testBraceMatching(response, `ChatGPT Response ${index + 1}`);
});

// Test 4: Integration test with actual ResponseObserver (if available)
console.log("\n🔗 Test 4: Integration Test");
if (typeof window.DOMUtils !== 'undefined' && window.DOMUtils.waitForResponse) {
  console.log("✅ DOMUtils available for integration testing");
  console.log("💡 To test with actual ChatGPT responses:");
  console.log("   1. Send a message that generates complex JSON");
  console.log("   2. Watch console for enhanced JSON extraction messages");
  console.log("   3. Look for: '🔍 Found complete JSON via brace matching'");
  console.log("   4. Verify: '✅ Valid complete JSON found'");
} else {
  console.log("⚠️ DOMUtils not available - cannot test integration");
}

console.log("\n✅ Complex JSON Extraction Test Suite Complete!");
console.log("\n🎯 Expected Improvements:");
console.log("  - Better detection of complex nested JSON structures");
console.log("  - Proper brace/bracket balance checking");
console.log("  - Enhanced extraction logic for task arrays");
console.log("  - Reduced false positives for incomplete JSON");

console.log("\n💡 To test the fix:");
console.log("  1. Reload the extension");
console.log("  2. Send a message that generates complex JSON like:");
console.log('     {"task": [{"type": "reflect","question": "What is consciousness?"}],"assigned_by": "ray"}');
console.log("  3. Watch for improved extraction messages in console");
console.log("  4. Verify no more 'Incomplete JSON' errors for complete responses");