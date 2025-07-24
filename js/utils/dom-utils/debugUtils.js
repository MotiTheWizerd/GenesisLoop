/**
 * Debug Utilities Module
 * Contains helper functions for debugging the ChatGPT UI
 */
(function() {
  'use strict';

  /**
   * Debug function to log information about ChatGPT UI elements
   */
  function debugElements() {
  console.log("🔍 Debugging ChatGPT UI elements...");
  
  // Find all interactive elements
  const interactiveElements = [
    'button',
    'a',
    'input',
    'textarea',
    '[role="button"]',
    '[tabindex]'
  ].join(',');
  
  const elements = document.querySelectorAll(interactiveElements);
  console.log(`Found ${elements.length} interactive elements`);
  
  // Log important elements
  const importantElements = {
    'Main container': document.querySelector('main'),
    'Textarea': document.querySelector('textarea'),
    'Send button': document.querySelector('button[data-testid="send-button"]'),
    'New chat button': document.querySelector('a[href*="/chat"]'),
    'Regenerate button': document.querySelector('button:has(svg[aria-label*="regenerate"])')
  };
  
  console.log("\nImportant Elements:");
  for (const [name, element] of Object.entries(importantElements)) {
    console.log(`\n${name}:`, element);
    if (element) {
      console.log(`- Classes: ${element.className}`);
      console.log(`- Attributes:`);
      for (const attr of element.attributes) {
        console.log(`  - ${attr.name} = ${attr.value}`);
      }
    }
  }
  
  // Log all buttons for reference
  const buttons = document.querySelectorAll('button');
  console.log("\nAll Buttons:");
  buttons.forEach((btn, index) => {
    const label = btn.textContent.trim() || 
                 btn.getAttribute('aria-label') || 
                 btn.getAttribute('data-testid') ||
                 'No label';
    console.log(`${index + 1}. ${label}`);
  });
}

/**
 * Debug function to analyze current ChatGPT message structure
 */
function debugMessageStructure() {
  console.log("🔍 Analyzing message structure...");
  
  // Find all message containers
  const messageContainers = document.querySelectorAll([
    '[data-message-author-role]',
    '.group.w-full',
    '[data-testid*="conversation-turn"]',
    'article.text-token-text-primary'
  ].join(','));
  
  console.log(`Found ${messageContainers.length} message containers`);
  
  messageContainers.forEach((container, index) => {
    const role = container.getAttribute('data-message-author-role') || 'unknown';
    const classes = container.className || 'no-classes';
    const id = container.id ? `#${container.id}` : '';
    
    console.log(`\nMessage ${index + 1} (${role}):`);
    console.log(`- Classes: ${classes}`);
    console.log(`- ID: ${id || 'none'}`);
    
    // Log content structure
    const content = container.textContent || '';
    console.log(`- Content preview: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`);
    
    // Log child elements
    const children = container.children;
    console.log(`- Has ${children.length} direct children`);
    
    // Log important child elements
    const importantChildren = container.querySelectorAll([
      '.markdown',
      '[data-message-content]',
      '.prose',
      'pre',
      'code',
      'button',
      'a'
    ].join(','));
    
    if (importantChildren.length > 0) {
      console.log("  Important child elements:");
      importantChildren.forEach((child, i) => {
        const tag = child.tagName.toLowerCase();
        const childClasses = child.className || '';
        const childId = child.id ? `#${child.id}` : '';
        console.log(`  ${i + 1}. <${tag}${childId} class="${childClasses}">`);
      });
    }
  });
  }

  // Expose the module
  window.DebugUtils = {
    debugElements: debugElements,
    debugMessageStructure: debugMessageStructure
  };

  console.log('✅ DebugUtils loaded');
})();
