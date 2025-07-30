(function() {
  'use strict';
  
  console.log('🚀 Loading Simple DOM API...');
  
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
  
  console.log('✅ Simple DOM API loaded successfully!');
  
  // Test the system immediately
  (async () => {
    try {
      const title = await window.DOMAPI.getElement('title', 'text');
      console.log('🧪 DOMAPI Test successful! Page title:', title.dom);
      
      const result = await window.DOMAPI.getFullDOM({
        includeStyles: false,
        includeScripts: false,
        format: 'html'
      });
      console.log('🧪 DOM retrieval test - HTML length:', result.dom.length);
      
      console.log('🎉 DOMAPI is ready for use!');
    } catch (error) {
      console.log('⚠️ DOMAPI Test failed:', error.message);
    }
  })();
  
})();