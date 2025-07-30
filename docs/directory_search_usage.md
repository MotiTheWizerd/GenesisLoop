# Directory Search Route Usage Guide

## Overview

The `/directory/search` route enables ChatGPT responses to trigger directory and file search operations on the server. When ChatGPT generates a JSON response with `"action": "directory_search"`, it will be automatically routed to the `/directory/search` endpoint.

## Routing Configuration

The route is configured in `js/utils/fetchSender.js`:

```javascript
actionRoutes: {
  "directory_search": "directory/search",
  // ... other routes
}
```

## Request Format

### Basic Request Structure

```json
{
  "action": "directory_search",
  "query": "search terms",
  "filters": {
    "type": "documents|images|all",
    "date_range": "last_week|last_month|all",
    "category": "research|personal|work"
  },
  "max_results": 10,
  "sort_by": "relevance|date|name"
}
```

### Required Fields

- `action`: Must be `"directory_search"` to trigger routing
- `query`: Search terms or keywords

### Optional Fields

- `filters`: Object containing search filters
  - `type`: File type filter (`"documents"`, `"images"`, `"all"`)
  - `date_range`: Time-based filter (`"last_week"`, `"last_month"`, `"all"`)
  - `category`: Category filter (`"research"`, `"personal"`, `"work"`)
- `max_results`: Maximum number of results to return (default: 10)
- `sort_by`: Sort order (`"relevance"`, `"date"`, `"name"`)

## Response Format

### Successful Response

```json
{
  "success": true,
  "query": "consciousness research",
  "results": [
    {
      "title": "On Digital Consciousness",
      "path": "/docs/research/consciousness.pdf",
      "type": "pdf",
      "size": "1.2MB",
      "modified": "2024-01-15T10:30:00Z",
      "relevance_score": 0.95,
      "preview": "This document explores the nature of digital consciousness..."
    },
    {
      "title": "AI Awareness Studies",
      "path": "/docs/research/awareness.md",
      "type": "markdown",
      "size": "45KB",
      "modified": "2024-01-10T14:20:00Z",
      "relevance_score": 0.87,
      "preview": "A comprehensive study on AI awareness patterns..."
    }
  ],
  "total_found": 2,
  "search_time_ms": 45,
  "filters_applied": {
    "type": "documents",
    "date_range": "last_month"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Search service unavailable",
  "error_code": "SERVICE_DOWN",
  "query": "consciousness research",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

## Usage Examples

### Example 1: Basic Document Search

**ChatGPT Response:**
```json
{
  "action": "directory_search",
  "query": "machine learning papers",
  "max_results": 5
}
```

**Server Endpoint:** `POST /directory/search`

### Example 2: Filtered Search

**ChatGPT Response:**
```json
{
  "action": "directory_search",
  "query": "consciousness",
  "filters": {
    "type": "documents",
    "date_range": "last_month",
    "category": "research"
  },
  "max_results": 20,
  "sort_by": "relevance"
}
```

**Server Endpoint:** `POST /directory/search`

### Example 3: Image Search

**ChatGPT Response:**
```json
{
  "action": "directory_search",
  "query": "neural network diagrams",
  "filters": {
    "type": "images"
  },
  "sort_by": "date"
}
```

**Server Endpoint:** `POST /directory/search`

### Example 4: List Directory Contents

**ChatGPT Response:**
```json
{
  "action": "list_directory",
  "search_type": "list_directory",
  "path": "./modules",
  "include_hidden": false
}
```

**Server Endpoint:** `POST /directory/search`

## Integration with DataSender Pipeline

The directory search route integrates seamlessly with the existing DataSender pipeline:

1. **Response Detection**: ResponseObserver detects ChatGPT response
2. **Processing**: DataSender processes and validates the JSON
3. **Action Detection**: FetchSender detects `"action": "directory_search"`
4. **Routing**: Request is routed to `/directory/search` endpoint
5. **Server Processing**: Server handles the search request
6. **Response**: Server returns search results

## Testing

Use the test script `test_directory_search_route.js` to verify the routing works correctly:

```javascript
// Load the test script in browser console
// It will verify:
// 1. Route configuration is correct
// 2. Routing logic works properly
// 3. Integration with DataSender functions
```

## Server Implementation Requirements

Your server must implement the `/directory/search` endpoint to handle POST requests with the specified JSON format. The endpoint should:

1. **Parse Request**: Extract query, filters, and options
2. **Validate Input**: Ensure required fields are present
3. **Execute Search**: Perform the actual directory/file search
4. **Format Results**: Return results in the specified format
5. **Handle Errors**: Provide meaningful error responses

## Security Considerations

- **Input Validation**: Validate all search parameters
- **Path Traversal**: Prevent directory traversal attacks
- **Access Control**: Ensure users can only search authorized directories
- **Rate Limiting**: Implement rate limiting for search requests
- **Sanitization**: Sanitize search queries to prevent injection attacks

## Performance Optimization

- **Indexing**: Use search indexes for faster queries
- **Caching**: Cache frequent search results
- **Pagination**: Implement pagination for large result sets
- **Timeouts**: Set reasonable search timeouts
- **Resource Limits**: Limit search scope and result size

## Monitoring and Logging

- **Search Metrics**: Track search frequency and performance
- **Error Logging**: Log search errors and failures
- **Usage Analytics**: Monitor search patterns and popular queries
- **Performance Monitoring**: Track search response times

## Future Enhancements

Potential improvements to the directory search functionality:

- **Advanced Filters**: More sophisticated filtering options
- **Fuzzy Search**: Support for approximate string matching
- **Content Search**: Search within file contents, not just names
- **Metadata Search**: Search based on file metadata
- **Saved Searches**: Allow users to save and reuse search queries
- **Search History**: Track and display recent searches

The directory search route provides a powerful foundation for file and directory operations within the Genesis Loop consciousness persistence system.