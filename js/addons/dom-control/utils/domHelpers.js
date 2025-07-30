(function() {
  'use strict';
  
  // DOM Helpers - Utility functions for DOM operations
  const DOMHelpers = {
    
    // Element validation
    isValidSelector(selector) {
      try {
        document.querySelector(selector);
        return true;
      } catch (e) {
        return false;
      }
    },
    
    // Element existence check
    elementExists(selector) {
      return document.querySelector(selector) !== null;
    },
    
    // Wait for element to appear
    waitForElement(selector, timeout = 5000) {
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
    
    // Get element info
    getElementInfo(selector) {
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
    isElementVisible(element) {
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
    
    // Get all elements matching selector
    getAllElements(selector) {
      return Array.from(document.querySelectorAll(selector));
    },
    
    // Get element path (CSS selector path)
    getElementPath(element) {
      if (!element) return '';
      
      const path = [];
      while (element && element.nodeType === Node.ELEMENT_NODE) {
        let selector = element.nodeName.toLowerCase();
        
        if (element.id) {
          selector += '#' + element.id;
          path.unshift(selector);
          break;
        } else {
          let sibling = element;
          let nth = 1;
          while (sibling = sibling.previousElementSibling) {
            if (sibling.nodeName.toLowerCase() === selector) nth++;
          }
          if (nth !== 1) selector += ':nth-of-type(' + nth + ')';
        }
        
        path.unshift(selector);
        element = element.parentNode;
      }
      
      return path.join(' > ');
    },
    
    // Safe element operations
    safeOperation(selector, operation) {
      try {
        const element = document.querySelector(selector);
        if (!element) {
          throw new Error(`Element not found: ${selector}`);
        }
        
        return operation(element);
      } catch (error) {
        console.error('DOM operation failed:', error);
        return { success: false, error: error.message };
      }
    },
    
    // Batch element operations
    batchElementOperation(selectors, operation) {
      const results = [];
      
      selectors.forEach(selector => {
        const result = this.safeOperation(selector, operation);
        results.push({ selector, result });
      });
      
      return results;
    },
    
    // Create element with attributes
    createElement(tagName, attributes = {}, textContent = '') {
      const element = document.createElement(tagName);
      
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
      
      if (textContent) {
        element.textContent = textContent;
      }
      
      return element;
    },
    
    // Insert element at position
    insertElement(parentSelector, element, position = 'append') {
      const parent = document.querySelector(parentSelector);
      if (!parent) return false;
      
      switch (position) {
        case 'prepend':
          parent.prepend(element);
          break;
        case 'append':
          parent.append(element);
          break;
        case 'before':
          parent.parentNode.insertBefore(element, parent);
          break;
        case 'after':
          parent.parentNode.insertBefore(element, parent.nextSibling);
          break;
        default:
          parent.append(element);
      }
      
      return true;
    },
    
    // Get computed styles
    getComputedStyles(selector, properties = []) {
      const element = document.querySelector(selector);
      if (!element) return null;
      
      const styles = window.getComputedStyle(element);
      
      if (properties.length === 0) {
        return styles;
      }
      
      const result = {};
      properties.forEach(prop => {
        result[prop] = styles.getPropertyValue(prop);
      });
      
      return result;
    },
    
    // Scroll to element
    scrollToElement(selector, behavior = 'smooth') {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ behavior, block: 'center' });
        return true;
      }
      return false;
    },
    
    // Highlight element (for debugging)
    highlightElement(selector, duration = 2000) {
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
  
  // Expose DOM Helpers
  window.DOMHelpers = DOMHelpers;
  
  console.log('✅ DOMHelpers loaded');
})();