/**
 * Dependency loader utility to ensure all scripts are properly loaded
 */
window.DependencyLoader = {
  maxRetries: 20,
  currentRetries: 0,
  
  /**
   * Check if all required dependencies are loaded
   * @returns {boolean} Whether all dependencies are loaded
   */
  checkDependencies: function() {
    // Critical dependencies that must be loaded
    const criticalDependencies = [
      'Constants',
      'DOMUtils',
      'MessageSender',
      'ToggleButton',
      'MessageLoop'
    ];
    
    // Optional dependencies (we have fallbacks)
    const optionalDependencies = [
      'ResponseTracker'
    ];
    
    const allDependencies = [...criticalDependencies, ...optionalDependencies];
    
    const missingCritical = criticalDependencies.filter(dep => typeof window[dep] === 'undefined');
    const missingOptional = optionalDependencies.filter(dep => typeof window[dep] === 'undefined');
    
    if (missingCritical.length > 0) {
      console.log(`⚠️ Missing critical dependencies (attempt ${this.currentRetries}/${this.maxRetries}):`, missingCritical.join(', '));
      
      if (missingOptional.length > 0) {
        console.log(`ℹ️ Missing optional dependencies:`, missingOptional.join(', '));
      }
      
      // Only log detailed info every 5 attempts to reduce spam
      if (this.currentRetries % 5 === 0) {
        console.log("📊 Detailed dependency status:");
        allDependencies.forEach(dep => {
          const status = typeof window[dep] !== 'undefined' ? '✅' : '❌';
          const type = criticalDependencies.includes(dep) ? '(critical)' : '(optional)';
          console.log(`  ${status} ${dep} ${type}: ${typeof window[dep]}`);
        });
      }
      return false;
    }
    
    if (missingOptional.length > 0) {
      console.log(`ℹ️ Optional dependencies missing (will use fallbacks):`, missingOptional.join(', '));
    }
    
    console.log("✅ All critical dependencies loaded successfully");
    this.currentRetries = 0; // Reset counter on success
    return true;
  },
  
  /**
   * Initialize the extension when all dependencies are loaded
   * @param {Function} callback Function to call when dependencies are loaded
   */
  waitForDependencies: function(callback) {
    if (this.checkDependencies()) {
      callback();
      return;
    }
    
    this.currentRetries++;
    
    if (this.currentRetries >= this.maxRetries) {
      console.error("❌ Max retries reached. Dependencies failed to load:");
      console.error("This might indicate a script loading issue or syntax error.");
      return;
    }
    
    console.log("⏳ Waiting for dependencies to load...");
    setTimeout(() => this.waitForDependencies(callback), 1000);
  }
};

console.log("✅ DependencyLoader loaded");