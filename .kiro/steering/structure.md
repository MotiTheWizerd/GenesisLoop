# Project Structure & Organization

## Directory Structure
```
/
├── .kiro/                  # Kiro AI assistant configuration
│   └── steering/           # Steering rules for AI assistance
├── icons/                  # Extension icon assets
│   ├── extension_icon_16x16.png
│   ├── extension_icon_48x48.png
│   └── extension_icon_128x128.png
├── js/                     # JavaScript modules (modular architecture)
│   ├── components/         # UI and functional components
│   │   ├── MessageSender.js    # Handles sending messages to ChatGPT
│   │   ├── ToggleButton.js     # Creates and manages the toggle button
│   │   └── MessageLoop.js      # Manages the response-driven message loop
│   └── utils/              # Utility functions and helpers
│       ├── dom-utils/          # Modular DOM manipulation utilities
│       │   ├── index.js            # Main entry point - aggregates all DOM utilities
│       │   ├── responseObserver.js # Advanced response detection and monitoring
│       │   ├── elementFinder.js    # Robust UI element location with fallbacks
│       │   └── debugUtils.js       # Comprehensive debugging and analysis tools
│       ├── constants.js        # Application constants and configuration
│       ├── responseTracker.js  # Response storage and tracking system
│       └── dependencyLoader.js # Smart dependency management with retries
├── content.js              # Main content script injected into ChatGPT pages
├── manifest.json           # Extension manifest configuration (Manifest V3)
├── popup.html              # Extension popup UI
└── README.md               # Project documentation
```

## Key Files & Modules

### Core Files
- **manifest.json**: Defines extension metadata, permissions, script loading order
- **content.js**: Main orchestrator that initializes all components
- **popup.html**: Extension popup UI for viewing responses

### JavaScript Architecture

#### Components (`js/components/`)
- **MessageSender.js**: Handles message composition and sending to ChatGPT
- **ToggleButton.js**: Creates and manages the automation toggle button
- **MessageLoop.js**: Manages the response-driven message loop with timing

#### Utilities (`js/utils/`)
- **constants.js**: Application-wide constants and configuration
- **responseTracker.js**: Response storage, tracking, and retrieval system
- **dependencyLoader.js**: Smart dependency management with retry logic

#### DOM Utilities (`js/utils/dom-utils/`)
- **index.js**: Main aggregator that combines all DOM utilities into DOMUtils
- **responseObserver.js**: Advanced ChatGPT response detection using MutationObserver
- **elementFinder.js**: Robust UI element location with multiple fallback strategies
- **debugUtils.js**: Debugging tools for UI analysis and troubleshooting

## Code Organization Principles

### Modular Architecture
- **Single Responsibility**: Each module has one clear purpose
- **Loose Coupling**: Modules communicate through well-defined interfaces
- **High Cohesion**: Related functionality is grouped together
- **Dependency Injection**: Dependencies are loaded and managed centrally

### Loading Pattern
- **IIFE Pattern**: Uses Immediately Invoked Function Expressions for browser compatibility
- **Global Exposure**: Modules attach to `window` object for cross-module communication
- **Dependency Management**: Smart loading with retries and fallbacks
- **Script Order**: Manifest defines proper loading sequence

### Error Handling
- **Graceful Degradation**: System continues working even if non-critical components fail
- **Fallback Mechanisms**: Multiple strategies for critical operations
- **Comprehensive Logging**: Detailed console output for debugging
- **Retry Logic**: Automatic retries for transient failures

## Naming Conventions
- **Files**: lowercase with hyphens (kebab-case) for directories, camelCase for JS files
- **Variables/Functions**: camelCase in JavaScript
- **Constants**: UPPER_SNAKE_CASE for application constants
- **Modules**: PascalCase when attached to window object
- **CSS Classes**: kebab-case (if CSS is added)

## Development Guidelines

### Adding New Modules
1. Create module using IIFE pattern
2. Expose functionality via `window.ModuleName`
3. Add to manifest.json in correct loading order
4. Update dependencyLoader.js if it's a critical dependency
5. Add logging for successful module loading

### Module Template
```javascript
(function() {
  'use strict';
  
  function myFunction() {
    // Implementation
  }
  
  // Expose module
  window.MyModule = {
    myFunction: myFunction
  };
  
  console.log('✅ MyModule loaded');
})();
```

### Testing New Features
1. Update extension in chrome://extensions/
2. Reload ChatGPT page
3. Check console for loading messages
4. Verify functionality works as expected
5. Test error scenarios and fallbacks