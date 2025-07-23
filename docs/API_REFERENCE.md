# API Reference

This document provides detailed information about the APIs used and exposed by the Genesis Loop Browser Extension.

## Extension APIs

### Background Script API

#### `background.initialize()`
Initializes the background script and sets up event listeners.

**Parameters:** None

**Returns:** `Promise<void>`

---

#### `background.handleMessage(message, sender, sendResponse)`
Handles incoming messages from content scripts and popup.

**Parameters:**
- `message` (Object): The message object
- `sender` (Object): Information about the message sender
- `sendResponse` (Function): Function to send a response

**Returns:** `boolean` - `true` if response is asynchronous

---

### Content Script API

#### `content.injectScripts(tabId)`
Injects necessary scripts into the current tab.

**Parameters:**
- `tabId` (number): The ID of the target tab

**Returns:** `Promise<void>`

---

## Storage API

### `storage.get(key)`
Retrieves data from extension storage.

**Parameters:**
- `key` (string): The storage key

**Returns:** `Promise<any>` - The stored value

---

### `storage.set(key, value)`
Stores data in extension storage.

**Parameters:**
- `key` (string): The storage key
- `value` (any): The value to store

**Returns:** `Promise<void>`

---

## Message Types

### `GET_STATE`
Requests the current extension state.

**Request:**
```typescript
{
  type: 'GET_STATE'
}
```

**Response:**
```typescript
{
  state: object // Current extension state
}
```

### `UPDATE_SETTINGS`
Updates extension settings.

**Request:**
```typescript
{
  type: 'UPDATE_SETTINGS',
  payload: {
    // Settings object
  }
}
```

**Response:**
```typescript
{
  success: boolean,
  error?: string
}
```

## Browser Permissions

The extension requires the following permissions:

- `activeTab`: To interact with the current tab
- `storage`: To save user preferences
- `scripting`: To inject content scripts
- `tabs`: To manage browser tabs

## Error Handling

All API calls return a standardized response format:

```typescript
{
  success: boolean,
  data?: any,
  error?: {
    code: string,
    message: string,
    details?: any
  }
}
```

## Versioning

API versioning follows Semantic Versioning (SemVer) 2.0.0:
- MAJOR version for incompatible API changes
- MINOR version for added functionality in a backward-compatible manner
- PATCH version for backward-compatible bug fixes

## Deprecation Policy

- Deprecated APIs will be marked with `@deprecated` JSDoc tag
- Deprecated APIs will be supported for at least one major version
- Migration guides will be provided for breaking changes
