# Development Guide

This guide provides information for developers working on the Genesis Loop Browser Extension.

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm (v6+) or yarn
- Chrome, Firefox, or Edge browser for development

### Setup
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd GenesisLoopBrowserExtension
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Build the extension:
   ```bash
   npm run build
   # or
   yarn build
   ```

## Development Workflow

### Running in Development Mode
```bash
npm run dev
# or
yarn dev
```

This will start the development server with hot-reloading for:
- Content scripts
- Background scripts
- Popup/Options pages

### Code Style
- Follow [Standard JS](https://standardjs.com/) style guide
- Use ES6+ syntax
- 2-space indentation
- Single quotes for strings
- Semicolons at the end of statements

### Git Workflow
1. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. Push your changes and create a pull request

## Testing

### Running Tests
```bash
npm test
# or
yarn test
```

### Test Structure
- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/`
- E2E tests: `tests/e2e/`

## Debugging

### Chrome/Edge
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `dist` directory
4. Use Chrome DevTools for debugging

### Firefox
1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `manifest.json` from the `dist` directory

## Building for Production
```bash
npm run build
# or
yarn build
```

The production build will be created in the `dist` directory.

## Submitting Changes
1. Ensure all tests pass
2. Update documentation if needed
3. Create a pull request with a clear description of changes
