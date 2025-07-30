(function() {
  'use strict';
  
  // DOM Retriever - Handles DOM content extraction
  class DOMRetriever {
    constructor() {
      this.isInitialized = false;
      this.messageListener = null;
    }
    
    initialize() {
      if (this.isInitialized) {
        console.log('🔄 DOM Retriever already initialized');
        return;
      }
      
      this.setupMessageListener();
      this.isInitialized = true;
      console.log('✅ DOM Retriever initialized');
    }
    
    setupMessageListener() {
      this.messageListener = (request, sender, sendResponse) => {
        if (request.action === "getDOM") {
          try {
            const domContent = this.extractDOM(request.options || {});
            sendResponse({ 
              success: true, 
              dom: domContent,
              timestamp: Date.now()
            });
          } catch (error) {
            console.error('❌ Error extracting DOM:', error);
            sendResponse({ 
              success: false, 
              error: error.message 
            });
          }
        }
      };
      
      chrome.runtime.onMessage.addListener(this.messageListener);
    }
    
    extractDOM(options = {}) {
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
        content = this.removeStyles(content);
      }
      
      if (!includeScripts) {
        content = this.removeScripts(content);
      }
      
      return content;
    }
    
    removeStyles(html) {
      return html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                .replace(/style\s*=\s*"[^"]*"/gi, '');
    }
    
    removeScripts(html) {
      return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    }
    
    // Direct DOM extraction method (can be called programmatically)
    getDOM(options = {}) {
      return this.extractDOM(options);
    }
    
    // Get specific element content
    getElement(selector, format = 'outerHTML') {
      return this.extractDOM({ selector, format });
    }
    
    // Get page metadata
    getPageInfo() {
      return {
        title: document.title,
        url: window.location.href,
        domain: window.location.hostname,
        timestamp: Date.now(),
        readyState: document.readyState
      };
    }
    
    cleanup() {
      if (this.messageListener) {
        chrome.runtime.onMessage.removeListener(this.messageListener);
        this.messageListener = null;
      }
      this.isInitialized = false;
      console.log('🧹 DOM Retriever cleaned up');
    }
  }
  
  // Expose DOM Retriever
  window.DOMRetriever = new DOMRetriever();
  
  console.log('✅ DOMRetriever loaded');
})();