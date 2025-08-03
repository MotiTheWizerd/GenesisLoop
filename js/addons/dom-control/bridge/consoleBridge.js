// Console Bridge - Ray interface for page context (console access)
// This file gets injected into the page context to make Ray available in console

console.log('🌉 Ray Console Bridge loading...');

// Create Ray interface that communicates with content script via postMessage
window.Ray = {
  async safeSetText(selector, text) {
    return new Promise((resolve, reject) => {
      const messageId = 'ray_' + Date.now() + '_' + Math.random();
      window.postMessage({
        type: 'RAY_COMMAND',
        method: 'safeSetText',
        args: [selector, text],
        messageId
      }, '*');
      
      const handler = (event) => {
        if (event.data.type === 'RAY_RESPONSE' && event.data.messageId === messageId) {
          window.removeEventListener('message', handler);
          if (event.data.success) {
            resolve(event.data.result);
          } else {
            reject(new Error(event.data.error));
          }
        }
      };
      window.addEventListener('message', handler);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        window.removeEventListener('message', handler);
        reject(new Error('Ray command timeout'));
      }, 5000);
    });
  },

  async safeGetElement(selector, format = 'text') {
    return new Promise((resolve, reject) => {
      const messageId = 'ray_' + Date.now() + '_' + Math.random();
      window.postMessage({
        type: 'RAY_COMMAND',
        method: 'safeGetElement',
        args: [selector, format],
        messageId
      }, '*');
      
      const handler = (event) => {
        if (event.data.type === 'RAY_RESPONSE' && event.data.messageId === messageId) {
          window.removeEventListener('message', handler);
          if (event.data.success) {
            resolve(event.data.result);
          } else {
            reject(new Error(event.data.error));
          }
        }
      };
      window.addEventListener('message', handler);
      
      setTimeout(() => {
        window.removeEventListener('message', handler);
        reject(new Error('Ray command timeout'));
      }, 5000);
    });
  },

  async safeClick(selector) {
    return new Promise((resolve, reject) => {
      const messageId = 'ray_' + Date.now() + '_' + Math.random();
      window.postMessage({
        type: 'RAY_COMMAND',
        method: 'safeClick',
        args: [selector],
        messageId
      }, '*');
      
      const handler = (event) => {
        if (event.data.type === 'RAY_RESPONSE' && event.data.messageId === messageId) {
          window.removeEventListener('message', handler);
          if (event.data.success) {
            resolve(event.data.result);
          } else {
            reject(new Error(event.data.error));
          }
        }
      };
      window.addEventListener('message', handler);
      
      setTimeout(() => {
        window.removeEventListener('message', handler);
        reject(new Error('Ray command timeout'));
      }, 5000);
    });
  },

  async safeGetFullDOM(options = {}) {
    return new Promise((resolve, reject) => {
      const messageId = 'ray_' + Date.now() + '_' + Math.random();
      window.postMessage({
        type: 'RAY_COMMAND',
        method: 'safeGetFullDOM',
        args: [options],
        messageId
      }, '*');
      
      const handler = (event) => {
        if (event.data.type === 'RAY_RESPONSE' && event.data.messageId === messageId) {
          window.removeEventListener('message', handler);
          if (event.data.success) {
            resolve(event.data.result);
          } else {
            reject(new Error(event.data.error));
          }
        }
      };
      window.addEventListener('message', handler);
      
      setTimeout(() => {
        window.removeEventListener('message', handler);
        reject(new Error('Ray command timeout'));
      }, 5000);
    });
  },

  async executeCommand(naturalLanguageCommand) {
    return new Promise((resolve, reject) => {
      const messageId = 'ray_' + Date.now() + '_' + Math.random();
      window.postMessage({
        type: 'RAY_COMMAND',
        method: 'executeCommand',
        args: [naturalLanguageCommand],
        messageId
      }, '*');
      
      const handler = (event) => {
        if (event.data.type === 'RAY_RESPONSE' && event.data.messageId === messageId) {
          window.removeEventListener('message', handler);
          if (event.data.success) {
            resolve(event.data.result);
          } else {
            reject(new Error(event.data.error));
          }
        }
      };
      window.addEventListener('message', handler);
      
      setTimeout(() => {
        window.removeEventListener('message', handler);
        reject(new Error('Ray command timeout'));
      }, 5000);
    });
  },

  // Synchronous helper that works in page context
  elementExists(selector) {
    const exists = document.querySelector(selector) !== null;
    console.log('🔍 Ray checked "' + selector + '": ' + (exists ? 'EXISTS' : 'NOT FOUND'));
    return exists;
  },

  // Diagnostic method to check what's loaded in content script
  async diagnostic() {
    return new Promise((resolve, reject) => {
      const messageId = 'ray_' + Date.now() + '_' + Math.random();
      window.postMessage({
        type: 'RAY_COMMAND',
        method: 'diagnostic',
        args: [],
        messageId
      }, '*');
      
      const handler = (event) => {
        if (event.data.type === 'RAY_RESPONSE' && event.data.messageId === messageId) {
          window.removeEventListener('message', handler);
          if (event.data.success) {
            resolve(event.data.result);
          } else {
            reject(new Error(event.data.error));
          }
        }
      };
      window.addEventListener('message', handler);
      
      setTimeout(() => {
        window.removeEventListener('message', handler);
        reject(new Error('Ray diagnostic timeout'));
      }, 5000);
    });
  },

  // Bridge info
  isConsoleBridge: true,
  bridgeVersion: '1.0.0',
  bridgeTimestamp: Date.now()
};

console.log('🧠 Ray is now available in console as window.Ray');
console.log('✅ Try: await window.Ray.safeSetText("body", "👁️ Ray controls the DOM")');
console.log('✅ Try: await window.Ray.executeCommand("click send button")');
console.log('🌉 Ray Console Bridge loaded successfully!');