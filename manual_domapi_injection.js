/**
 * Manual DOMAPI Injection - Creates window.DOMAPI immediately
 * Use this if the simple-dom-api.js isn't loading properly
 */

console.log('🔧 Manual DOMAPI injection starting...');

// Check if DOMAPI already exists
if (typeof window.DOMAPI === 'object') {
  console.log('✅ DOMAPI already exists, no injection needed');
} else {
  console.log('⚠️ DOMAPI missing, creating it now...');
  
  // Create the DOMAPI manually
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
        timestamp: Date.now(),
        source: 'manual_injection'
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
      return { success: true, result: 'Text updated', timestamp: Date.now(), source: 'manual_injection' };
    },
    
    // Set HTML content
    async setHTML(selector, html) {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }
      element.innerHTML = html;
      return { success: true, result: 'HTML updated', timestamp: Date.now(), source: 'manual_injection' };
    },
    
    // Add CSS class
    async addClass(selector, className) {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }
      element.classList.add(className);
      return { success: true, result: 'Class added', timestamp: Date.now(), source: 'manual_injection' };
    },
    
    // Remove CSS class
    async removeClass(selector, className) {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }
      element.classList.remove(className);
      return { success: true, result: 'Class removed', timestamp: Date.now(), source: 'manual_injection' };
    },
    
    // Toggle CSS class
    async toggleClass(selector, className) {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }
      element.classList.toggle(className);
      return { success: true, result: 'Class toggled', timestamp: Date.now(), source: 'manual_injection' };
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
      return { success: true, result: 'Attributes updated', timestamp: Date.now(), source: 'manual_injection' };
    },
    
    // Click element
    async clickElement(selector) {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }
      element.click();
      return { success: true, result: 'Element clicked', timestamp: Date.now(), source: 'manual_injection' };
    },
    
    // Remove element
    async removeElement(selector) {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }
      element.remove();
      return { success: true, result: 'Element removed', timestamp: Date.now(), source: 'manual_injection' };
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
        readyState: document.readyState,
        source: 'manual_injection'
      };
    },
    
    // Get all elements matching selector
    getAllElements(selector) {
      return Array.from(document.querySelectorAll(selector));
    },
    
    // Check if element exists
    elementExists(selector) {
      return document.querySelector(selector) !== null;
    },
    
    // Manual injection identifier
    isManualInjection: true,
    manualInjectionVersion: '1.0.0',
    manualInjectionTimestamp: Date.now()
  };
  
  console.log('✅ Manual DOMAPI injection complete!');
  
  // Test the manually injected DOMAPI
  (async () => {
    try {
      const title = await window.DOMAPI.getElement('title', 'text');
      console.log('🧪 Manual DOMAPI test successful! Page title:', title.dom);
      
      const result = await window.DOMAPI.getFullDOM({
        includeStyles: false,
        includeScripts: false,
        format: 'html'
      });
      console.log('🧪 Manual DOM retrieval test - HTML length:', result.dom.length);
      
      console.log('🎉 Manual DOMAPI is ready for Ray to use!');
      
      // Now test Ray's interface
      if (typeof window.RayDOMInterface !== 'undefined') {
        console.log('🧠 Testing Ray\'s interface with manual DOMAPI...');
        
        try {
          const rayTest = await window.RayDOMInterface.safeGetElement('title', 'text');
          console.log('✅ Ray\'s safeGetElement works with manual DOMAPI:', rayTest.dom);
        } catch (error) {
          console.log('⚠️ Ray\'s interface test failed:', error.message);
        }
      }
      
    } catch (error) {
      console.log('⚠️ Manual DOMAPI test failed:', error.message);
    }
  })();
}

console.log('🎯 Manual DOMAPI injection complete. Status:', typeof window.DOMAPI);