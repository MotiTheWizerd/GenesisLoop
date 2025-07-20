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
├── content.js              # Content script injected into ChatGPT pages
├── manifest.json           # Extension manifest configuration
└── popup.html              # Extension popup UI
```

## Key Files
- **manifest.json**: Defines extension metadata, permissions, and behavior
- **content.js**: Main script that runs on ChatGPT pages to modify or enhance functionality
- **popup.html**: Simple UI that appears when clicking the extension icon

## Code Organization Principles
- **Separation of Concerns**:
  - Content script (content.js) handles page interaction and modification
  - Popup (popup.html) provides user interface and controls
  - Manifest (manifest.json) handles extension configuration

## Naming Conventions
- File names use lowercase with no spaces
- HTML/CSS follows standard web conventions
- JavaScript should use camelCase for variables and functions

## Future Structure Considerations
As the project grows, consider:
- Adding separate CSS files for styling
- Creating a dedicated `/js` directory for JavaScript modules
- Implementing a background script if persistent functionality is needed
- Adding unit tests in a `/tests` directory