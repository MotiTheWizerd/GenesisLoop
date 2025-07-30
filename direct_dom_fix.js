/**
 * DIRECT DOM FIX - Copy and paste this entire script into browser console
 * This bypasses all extension loading issues and creates working DOM control immediately
 */

console.log('🚀 Loading Direct DOM Fix...');

// Create the working DOM API directly
window.DOMAPI = {
  
  // Get full DOM content
  async getFullDOM(options = {}) {
    const {
      includeStyles = false,
      includeScripts = false,
      selector = null,
      format = 'html'
    } = options;
    
    let targetElement = selector ? 
      document.querySelector(selector) : 
      document.documentElement;
    
    if (!targetElement) {
      throw new Error(`Element not found: ${selector}`);
    }
    
    let content;
    
    switch (format) {
      case 'outerHTML':
        content = targetElement.outerHTML;
        break;
      case 'innerHTML':
        content = targetElement.innerHTML;
        break;
      case 'text':
        content = targetElement.textContent || targetElement.innerText;
        break;
      default:
        content = targetElement.outerHTML;
    }
    
    if (!includeStyles) {
      content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                      .replace(/style\s*=\s*"[^"]*"/gi, '');
    }
    
    if (!includeScripts) {
      content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    }
    
    return {
      success: true,
      dom: content,
      timestamp: Date.now()
    };
  },
  
  // Get specific element
  async getElement(selector, format = 'outerHTML') {
    return this.getFullDOM({ selector, format });
  },
  
  // Set text content
  async setText(selector, text) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    element.textContent = text;
    return { success: true, result: 'Text updated', timestamp: Date.now() };
  },
  
  // Set HTML content
  async setHTML(selector, html) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    element.innerHTML = html;
    return { success: true, result: 'HTML updated', timestamp: Date.now() };
  },
  
  // Add CSS class
  async addClass(selector, className) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    element.classList.add(className);
    return { success: true, result: 'Class added', timestamp: Date.now() };
  },
  
  // Remove CSS class
  async removeClass(selector, className) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    element.classList.remove(className);
    return { success: true, result: 'Class removed', timestamp: Date.now() };
  },
  
  // Toggle CSS class
  async toggleClass(selector, className) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    element.classList.toggle(className);
    return { success: true, result: 'Class toggled', timestamp: Date.now() };
  },
  
  // Set attributes
  async setAttribute(selector, attributes) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return { success: true, result: 'Attributes updated', timestamp: Date.now() };
  },
  
  // Click element
  async clickElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    element.click();
    return { success: true, result: 'Element clicked', timestamp: Date.now() };
  },
  
  // Remove element
  async removeElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    element.remove();
    return { success: true, result: 'Element removed', timestamp: Date.now() };
  },
  
  // Check if element exists
  elementExists(selector) {
    return document.querySelector(selector) !== null;
  },
  
  // Wait for element to appear
  async waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }
      
      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
          obs.disconnect();
          resolve(element);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  },
  
  // Get page info
  async getPageInfo() {
    return {
      success: true,
      title: document.title,
      url: window.location.href,
      domain: window.location.hostname,
      timestamp: Date.now(),
      readyState: document.readyState
    };
  },
  
  // Get all elements matching selector
  getAllElements(selector) {
    return Array.from(document.querySelectorAll(selector));
  },
  
  // Get element info
  getElementInfo(selector) {
    const element = document.querySelector(selector);
    if (!element) return null;
    
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    
    return {
      tagName: element.tagName,
      id: element.id,
      className: element.className,
      textContent: element.textContent?.substring(0, 100) + '...',
      attributes: Array.from(element.attributes).map(attr => ({
        name: attr.name,
        value: attr.value
      })),
      position: rect,
      visible: (
        rect.width > 0 &&
        rect.height > 0 &&
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        style.opacity !== '0'
      )
    };
  },
  
  // Highlight element for debugging
  highlightElement(selector, duration = 2000) {
    const element = document.querySelector(selector);
    if (!element) return false;
    
    const originalStyle = element.style.cssText;
    element.style.cssText += 'border: 3px solid red !important; background-color: yellow !important;';
    
    setTimeout(() => {
      element.style.cssText = originalStyle;
    }, duration);
    
    return true;
  },
  
  // Batch operations
  async batchOperations(operations) {
    const results = [];
    
    for (const op of operations) {
      try {
        let result;
        switch (op.operation) {
          case 'setText':
            result = await this.setText(op.selector, op.content);
            break;
          case 'setHTML':
            result = await this.setHTML(op.selector, op.content);
            break;
          case 'addClass':
            result = await this.addClass(op.selector, op.content);
            break;
          case 'removeClass':
            result = await this.removeClass(op.selector, op.content);
            break;
          case 'setAttribute':
            result = await this.setAttribute(op.selector, op.attributes);
            break;
          case 'click':
            result = await this.clickElement(op.selector);
            break;
          case 'remove':
            result = await this.removeElement(op.selector);
            break;
          default:
            throw new Error(`Unknown operation: ${op.operation}`);
        }
        results.push({ success: true, operation: op, result });
      } catch (error) {
        results.push({ success: false, operation: op, error: error.message });
      }
    }
    
    return results;
  }
};

console.log('✅ Direct DOM Fix loaded successfully!');

// Test the system immediately
(async () => {
  try {
    // Test 1: Get page title
    const title = await window.DOMAPI.getElement('title', 'text');
    console.log('🧪 Test 1 - Page title:', title.dom);
    
    // Test 2: Get full DOM
    const result = await window.DOMAPI.getFullDOM({
      includeStyles: false,
      includeScripts: false,
      format: 'html'
    });
    console.log('🧪 Test 2 - Page HTML length:', result.dom.length);
    
    // Test 3: Check ChatGPT elements
    const hasMain = window.DOMAPI.elementExists('[role="main"]');
    const hasInput = window.DOMAPI.elementExists('#prompt-textarea');
    console.log('🧪 Test 3 - ChatGPT elements:', { hasMain, hasInput });
    
    // Test 4: Try to get ChatGPT messages
    const messages = window.DOMAPI.getAllElements('[data-message-author-role="assistant"]');
    console.log('🧪 Test 4 - Found', messages.length, 'assistant messages');
    
    if (messages.length > 0) {
      try {
        const lastMessage = await window.DOMAPI.getElement('[data-message-author-role="assistant"]:last-child', 'text');
        console.log('🧠 Latest AI response:', lastMessage.dom.substring(0, 100) + '...');
      } catch (error) {
        console.log('⚠️ Could not get latest message:', error.message);
      }
    }
    
    console.log('🎉 All tests completed! DOMAPI is ready to use.');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
})();

// Show usage examples
console.log(`
🎯 DOMAPI is now ready! Try these commands:

// Get full page HTML (clean)
const result = await window.DOMAPI.getFullDOM({
  includeStyles: false,
  includeScripts: false,
  format: 'html'
});
console.log('HTML length:', result.dom.length);

// Get ChatGPT latest response
const response = await window.DOMAPI.getElement('[data-message-author-role="assistant"]:last-child', 'text');
console.log('Latest response:', response.dom);

// Get page title
const title = await window.DOMAPI.getElement('title', 'text');
console.log('Title:', title.dom);

// Check if element exists
const exists = window.DOMAPI.elementExists('#prompt-textarea');
console.log('Input exists:', exists);
`);

console.log('🚀 Direct DOM Fix complete! Copy the examples above to test.');