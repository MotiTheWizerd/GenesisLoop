/**
 * Instant DOM Control - Standalone Solution
 * Copy and paste this entire script into browser console for immediate DOM control
 */

console.log('🚀 Loading Instant DOM Control...');

// Create instant DOM control system
window.InstantDOM = {
  
  // Get full DOM content
  getFullDOM: function(options = {}) {
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
  getElement: function(selector, format = 'outerHTML') {
    return this.getFullDOM({ selector, format });
  },
  
  // Set text content
  setText: function(selector, text) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    element.textContent = text;
    return { success: true, result: 'Text updated', timestamp: Date.now() };
  },
  
  // Set HTML content
  setHTML: function(selector, html) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    element.innerHTML = html;
    return { success: true, result: 'HTML updated', timestamp: Date.now() };
  },
  
  // Add CSS class
  addClass: function(selector, className) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    element.classList.add(className);
    return { success: true, result: 'Class added', timestamp: Date.now() };
  },
  
  // Remove CSS class
  removeClass: function(selector, className) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    element.classList.remove(className);
    return { success: true, result: 'Class removed', timestamp: Date.now() };
  },
  
  // Toggle CSS class
  toggleClass: function(selector, className) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    element.classList.toggle(className);
    return { success: true, result: 'Class toggled', timestamp: Date.now() };
  },
  
  // Set attributes
  setAttribute: function(selector, attributes) {
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
  clickElement: function(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    element.click();
    return { success: true, result: 'Element clicked', timestamp: Date.now() };
  },
  
  // Remove element
  removeElement: function(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    element.remove();
    return { success: true, result: 'Element removed', timestamp: Date.now() };
  },
  
  // Check if element exists
  elementExists: function(selector) {
    return document.querySelector(selector) !== null;
  },
  
  // Wait for element to appear
  waitForElement: function(selector, timeout = 5000) {
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
  getPageInfo: function() {
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
  getAllElements: function(selector) {
    return Array.from(document.querySelectorAll(selector));
  },
  
  // Get element info
  getElementInfo: function(selector) {
    const element = document.querySelector(selector);
    if (!element) return null;
    
    return {
      tagName: element.tagName,
      id: element.id,
      className: element.className,
      textContent: element.textContent?.substring(0, 100) + '...',
      attributes: Array.from(element.attributes).map(attr => ({
        name: attr.name,
        value: attr.value
      })),
      position: element.getBoundingClientRect(),
      visible: this.isElementVisible(element)
    };
  },
  
  // Check if element is visible
  isElementVisible: function(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.visibility !== 'hidden' &&
      style.display !== 'none' &&
      style.opacity !== '0'
    );
  },
  
  // Highlight element for debugging
  highlightElement: function(selector, duration = 2000) {
    const element = document.querySelector(selector);
    if (!element) return false;
    
    const originalStyle = element.style.cssText;
    element.style.cssText += 'border: 3px solid red !important; background-color: yellow !important;';
    
    setTimeout(() => {
      element.style.cssText = originalStyle;
    }, duration);
    
    return true;
  }
};

console.log('✅ Instant DOM Control loaded successfully!');
console.log('🎯 Usage: window.InstantDOM.getFullDOM(), window.InstantDOM.getElement(), etc.');

// Test the system
try {
  const pageTitle = window.InstantDOM.getElement('title', 'text');
  console.log('🧪 Test successful! Page title:', pageTitle.dom);
} catch (error) {
  console.log('⚠️ Test failed:', error.message);
}

// Show available methods
console.log('\n📚 Available Methods:');
console.log('• getFullDOM(options) - Get full page HTML');
console.log('• getElement(selector, format) - Get specific element');
console.log('• setText(selector, text) - Update element text');
console.log('• setHTML(selector, html) - Update element HTML');
console.log('• addClass/removeClass/toggleClass(selector, className)');
console.log('• setAttribute(selector, attributes)');
console.log('• clickElement(selector) - Click element');
console.log('• removeElement(selector) - Remove element');
console.log('• elementExists(selector) - Check existence');
console.log('• waitForElement(selector, timeout) - Wait for element');
console.log('• getPageInfo() - Get page information');
console.log('• getAllElements(selector) - Get all matching elements');
console.log('• getElementInfo(selector) - Get element details');
console.log('• highlightElement(selector, duration) - Debug highlight');

console.log('\n🎉 Ready to use! Try: window.InstantDOM.getFullDOM()');