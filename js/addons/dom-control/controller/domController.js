(function() {
  'use strict';
  
  // DOM Controller - Handles DOM manipulation and control
  class DOMController {
    constructor() {
      this.isInitialized = false;
      this.messageListener = null;
      this.observers = new Map();
    }
    
    initialize() {
      if (this.isInitialized) {
        console.log('🔄 DOM Controller already initialized');
        return;
      }
      
      this.setupMessageListener();
      this.isInitialized = true;
      console.log('✅ DOM Controller initialized');
    }
    
    setupMessageListener() {
      this.messageListener = (request, sender, sendResponse) => {
        try {
          switch (request.action) {
            case "manipulateDOM":
              this.handleDOMManipulation(request.data, sendResponse);
              break;
            case "observeDOM":
              this.handleDOMObservation(request.data, sendResponse);
              break;
            case "stopObserving":
              this.handleStopObserving(request.data, sendResponse);
              break;
            default:
              return; // Not our message
          }
        } catch (error) {
          console.error('❌ DOM Controller error:', error);
          sendResponse({ 
            success: false, 
            error: error.message 
          });
        }
      };
      
      chrome.runtime.onMessage.addListener(this.messageListener);
    }
    
    handleDOMManipulation(data, sendResponse) {
      const { operation, selector, content, attributes } = data;
      
      const element = document.querySelector(selector);
      if (!element) {
        sendResponse({ 
          success: false, 
          error: `Element not found: ${selector}` 
        });
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
      
      sendResponse({ 
        success: true, 
        result,
        timestamp: Date.now()
      });
    }
    
    handleDOMObservation(data, sendResponse) {
      const { selector, observerId, options = {} } = data;
      
      const targetElement = selector ? 
        document.querySelector(selector) : 
        document.body;
      
      if (!targetElement) {
        sendResponse({ 
          success: false, 
          error: `Element not found: ${selector}` 
        });
        return;
      }
      
      // Stop existing observer if any
      if (this.observers.has(observerId)) {
        this.observers.get(observerId).disconnect();
      }
      
      const observer = new MutationObserver((mutations) => {
        const changes = mutations.map(mutation => ({
          type: mutation.type,
          target: mutation.target.tagName,
          addedNodes: mutation.addedNodes.length,
          removedNodes: mutation.removedNodes.length,
          attributeName: mutation.attributeName,
          oldValue: mutation.oldValue
        }));
        
        // Send changes back to extension
        chrome.runtime.sendMessage({
          action: 'domChanged',
          observerId,
          changes,
          timestamp: Date.now()
        });
      });
      
      const observerOptions = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true,
        ...options
      };
      
      observer.observe(targetElement, observerOptions);
      this.observers.set(observerId, observer);
      
      sendResponse({ 
        success: true, 
        result: `Observer ${observerId} started`,
        timestamp: Date.now()
      });
    }
    
    handleStopObserving(data, sendResponse) {
      const { observerId } = data;
      
      if (this.observers.has(observerId)) {
        this.observers.get(observerId).disconnect();
        this.observers.delete(observerId);
        
        sendResponse({ 
          success: true, 
          result: `Observer ${observerId} stopped` 
        });
      } else {
        sendResponse({ 
          success: false, 
          error: `Observer ${observerId} not found` 
        });
      }
    }
    
    // Direct manipulation methods (can be called programmatically)
    setText(selector, text) {
      const element = document.querySelector(selector);
      if (element) {
        element.textContent = text;
        return true;
      }
      return false;
    }
    
    setHTML(selector, html) {
      const element = document.querySelector(selector);
      if (element) {
        element.innerHTML = html;
        return true;
      }
      return false;
    }
    
    clickElement(selector) {
      const element = document.querySelector(selector);
      if (element) {
        element.click();
        return true;
      }
      return false;
    }
    
    addObserver(selector, callback, options = {}) {
      const targetElement = selector ? 
        document.querySelector(selector) : 
        document.body;
      
      if (!targetElement) return null;
      
      const observer = new MutationObserver(callback);
      const observerOptions = {
        childList: true,
        subtree: true,
        attributes: true,
        ...options
      };
      
      observer.observe(targetElement, observerOptions);
      return observer;
    }
    
    cleanup() {
      // Disconnect all observers
      this.observers.forEach(observer => observer.disconnect());
      this.observers.clear();
      
      if (this.messageListener) {
        chrome.runtime.onMessage.removeListener(this.messageListener);
        this.messageListener = null;
      }
      
      this.isInitialized = false;
      console.log('🧹 DOM Controller cleaned up');
    }
  }
  
  // Expose DOM Controller
  window.DOMController = new DOMController();
  
  console.log('✅ DOMController loaded');
})();