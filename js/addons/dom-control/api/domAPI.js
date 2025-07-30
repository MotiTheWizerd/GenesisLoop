(function() {
  'use strict';
  
  // DOM API - High-level interface for DOM operations
  class DOMAPI {
    constructor() {
      this.isInitialized = false;
    }
    
    initialize() {
      if (this.isInitialized) {
        console.log('🔄 DOM API already initialized');
        return;
      }
      
      this.isInitialized = true;
      console.log('✅ DOM API initialized');
    }
    
    // Retrieval methods - Direct content script version
    async getFullDOM(options = {}) {
      return new Promise((resolve, reject) => {
        try {
          if (window.DOMRetriever && window.DOMRetriever.isInitialized) {
            const result = window.DOMRetriever.extractDOM(options);
            resolve({ success: true, dom: result, timestamp: Date.now() });
          } else {
            reject(new Error('DOMRetriever not initialized'));
          }
        } catch (error) {
          reject(error);
        }
      });
    }
    
    async getElement(selector, format = 'outerHTML') {
      return this.getFullDOM({ selector, format });
    }
    
    async getPageInfo() {
      return new Promise((resolve) => {
        if (window.DOMRetriever && window.DOMRetriever.isInitialized) {
          const pageInfo = window.DOMRetriever.getPageInfo();
          resolve(pageInfo);
        } else {
          resolve({
            success: true,
            title: document.title,
            url: window.location.href,
            domain: window.location.hostname,
            timestamp: Date.now(),
            readyState: document.readyState
          });
        }
      });
    }
    
    // Manipulation methods - Direct content script version
    async manipulateDOM(operation, selector, content = null, attributes = null) {
      return new Promise((resolve, reject) => {
        try {
          const element = document.querySelector(selector);
          if (!element) {
            reject(new Error(`Element not found: ${selector}`));
            return;
          }
          
          let result;
          
          switch (operation) {
            case 'setText':
              element.textContent = content;
              result = 'Text updated';
              break;
            case 'setHTML':
              element.innerHTML = content;
              result = 'HTML updated';
              break;
            case 'setAttribute':
              if (attributes) {
                Object.entries(attributes).forEach(([key, value]) => {
                  element.setAttribute(key, value);
                });
              }
              result = 'Attributes updated';
              break;
            case 'addClass':
              element.classList.add(content);
              result = 'Class added';
              break;
            case 'removeClass':
              element.classList.remove(content);
              result = 'Class removed';
              break;
            case 'toggleClass':
              element.classList.toggle(content);
              result = 'Class toggled';
              break;
            case 'remove':
              element.remove();
              result = 'Element removed';
              break;
            case 'click':
              element.click();
              result = 'Element clicked';
              break;
            default:
              throw new Error(`Unknown operation: ${operation}`);
          }
          
          resolve({ 
            success: true, 
            result,
            timestamp: Date.now()
          });
        } catch (error) {
          reject(error);
        }
      });
    }
    
    async setText(selector, text) {
      return this.manipulateDOM('setText', selector, text);
    }
    
    async setHTML(selector, html) {
      return this.manipulateDOM('setHTML', selector, html);
    }
    
    async setAttribute(selector, attributes) {
      return this.manipulateDOM('setAttribute', selector, null, attributes);
    }
    
    async addClass(selector, className) {
      return this.manipulateDOM('addClass', selector, className);
    }
    
    async removeClass(selector, className) {
      return this.manipulateDOM('removeClass', selector, className);
    }
    
    async toggleClass(selector, className) {
      return this.manipulateDOM('toggleClass', selector, className);
    }
    
    async removeElement(selector) {
      return this.manipulateDOM('remove', selector);
    }
    
    async clickElement(selector) {
      return this.manipulateDOM('click', selector);
    }
    
    // Observer methods - Direct content script version
    async startObserving(selector, observerId, options = {}) {
      return new Promise((resolve, reject) => {
        try {
          if (window.DOMController && window.DOMController.isInitialized) {
            window.DOMController.handleDOMObservation({ selector, observerId, options }, (response) => {
              if (response && response.success) {
                resolve(response);
              } else {
                reject(new Error(response?.error || 'Failed to start observing'));
              }
            });
          } else {
            reject(new Error('DOMController not initialized'));
          }
        } catch (error) {
          reject(error);
        }
      });
    }
    
    async stopObserving(observerId) {
      return new Promise((resolve, reject) => {
        try {
          if (window.DOMController && window.DOMController.isInitialized) {
            window.DOMController.handleStopObserving({ observerId }, (response) => {
              if (response && response.success) {
                resolve(response);
              } else {
                reject(new Error(response?.error || 'Failed to stop observing'));
              }
            });
          } else {
            reject(new Error('DOMController not initialized'));
          }
        } catch (error) {
          reject(error);
        }
      });
    }
    
    // Utility methods
    generateObserverId() {
      return `observer_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }
    
    // Batch operations
    async batchOperations(operations) {
      const results = [];
      
      for (const op of operations) {
        try {
          const result = await this.manipulateDOM(
            op.operation, 
            op.selector, 
            op.content, 
            op.attributes
          );
          results.push({ success: true, operation: op, result });
        } catch (error) {
          results.push({ success: false, operation: op, error: error.message });
        }
      }
      
      return results;
    }
  }
  
  // Expose DOM API
  window.DOMAPI = new DOMAPI();
  
  console.log('✅ DOMAPI loaded');
})();