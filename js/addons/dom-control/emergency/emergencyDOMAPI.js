(function() {
  'use strict';
  
  // Emergency DOM API - Minimal working implementation for Ray's self-repair
  function createEmergencyDOMAPI() {
    return {
      // Core retrieval method
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
          case 'outerHTML': content = targetElement.outerHTML; break;
          case 'innerHTML': content = targetElement.innerHTML; break;
          case 'text': content = targetElement.textContent || targetElement.innerText; break;
          default: content = targetElement.outerHTML;
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
          source: 'emergency'
        };
      },
      
      // Core element retrieval
      async getElement(selector, format = 'outerHTML') {
        return this.getFullDOM({ selector, format });
      },
      
      // Basic manipulation
      async setText(selector, text) {
        const element = document.querySelector(selector);
        if (!element) throw new Error(`Element not found: ${selector}`);
        element.textContent = text;
        return { success: true, result: 'Text updated', timestamp: Date.now(), source: 'emergency' };
      },
      
      async setHTML(selector, html) {
        const element = document.querySelector(selector);
        if (!element) throw new Error(`Element not found: ${selector}`);
        element.innerHTML = html;
        return { success: true, result: 'HTML updated', timestamp: Date.now(), source: 'emergency' };
      },
      
      async clickElement(selector) {
        const element = document.querySelector(selector);
        if (!element) throw new Error(`Element not found: ${selector}`);
        element.click();
        return { success: true, result: 'Element clicked', timestamp: Date.now(), source: 'emergency' };
      },
      
      // Utility methods
      elementExists(selector) {
        return document.querySelector(selector) !== null;
      },
      
      getAllElements(selector) {
        return Array.from(document.querySelectorAll(selector));
      },
      
      async getPageInfo() {
        return {
          success: true,
          title: document.title,
          url: window.location.href,
          domain: window.location.hostname,
          timestamp: Date.now(),
          readyState: document.readyState,
          source: 'emergency'
        };
      },
      
      // Emergency status indicator
      isEmergencyAPI: true,
      emergencyVersion: '1.0.0',
      emergencyTimestamp: Date.now()
    };
  }
  
  // Inject Emergency DOM API function for Ray
  window.injectEmergencyDOMAPI = function() {
    console.log('🚨 Emergency DOM API injection initiated...');
    
    try {
      // Create and inject the emergency API
      window.DOMAPI = createEmergencyDOMAPI();
      
      // Log successful injection
      console.log('✅ Emergency DOMAPI restored via injectEmergencyDOMAPI()');
      console.log('🔧 Emergency API active - limited functionality available');
      
      // Test the emergency API
      window.DOMAPI.getElement('title', 'text').then(result => {
        console.log('🧪 Emergency API test successful:', result.dom);
      }).catch(error => {
        console.log('⚠️ Emergency API test failed:', error.message);
      });
      
      return true;
    } catch (error) {
      console.log('❌ Emergency DOM API injection failed:', error.message);
      return false;
    }
  };
  
  console.log('✅ Emergency DOM API injector loaded');
  
})();