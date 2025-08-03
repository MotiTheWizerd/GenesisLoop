# Web Scrape Routing Guide

## Overview
The web scrape routing system enables automatic routing of scraping requests to the `/web/scrape` endpoint based on the action type in your JSON structure.

## How It Works

### Action Detection
The FetchSender automatically detects scraping actions and routes them appropriately:

1. **Direct Action Detection**: Looks for `"action": "scrape"` or `"action": "web_scrape"`
2. **Task Array Detection**: Checks if `task` array contains a single scraping action
3. **Route Mapping**: Maps to `http://localhost:8000/web/scrape`

### Supported Action Names
- `scrape` - Primary action name for web scraping
- `web_scrape` - Alternative action name for web scraping

## JSON Format Examples

### Direct Scrape Action Format
```json
{
  "action": "scrape",
  "url": "https://example.com",
  "options": {
    "extract_text": true,
    "extract_links": false,
    "extract_images": true,
    "wait_for_load": true,
    "timeout": 30000
  },
  "assigned_by": "ray",
  "execute_immediately": true,
  "self_destruct": true
}
```
Routes directly to `/web/scrape`

### Alternative Naming Format
```json
{
  "action": "web_scrape",
  "url": "https://example.com/article",
  "options": {
    "extract_text": true,
    "follow_redirects": true,
    "user_agent": "custom-agent"
  },
  "assigned_by": "ray"
}
```
Also routes to `/web/scrape`

### Task Array Format (Single Scrape)
```json
{
  "task": [
    {
      "action": "scrape",
      "url": "https://example.com/page",
      "options": {
        "extract_text": true,
        "extract_metadata": true
      },
      "assigned_by": "ray"
    }
  ],
  "assigned_by": "ray",
  "execute_immediately": true,
  "self_destruct": true
}
```
Routes to `/web/scrape` (single action optimization)

### Multiple Scrape Tasks Format
```json
{
  "task": [
    {
      "action": "scrape",
      "url": "https://example.com/page1",
      "assigned_by": "ray"
    },
    {
      "action": "scrape", 
      "url": "https://example.com/page2",
      "assigned_by": "ray"
    }
  ],
  "assigned_by": "ray",
  "execute_immediately": true
}
```
Routes to `/tasks` (multiple actions require task processing)

## Endpoint Routing Logic

### Priority 1: Task Field Detection
If JSON contains a `task` field:
- **Single scrape action**: Routes to `/web/scrape`
- **Multiple actions**: Routes to `/tasks`
- **Mixed actions**: Routes to `/tasks`

### Priority 2: Direct Action Detection  
If JSON contains an `action` field:
- **scrape**: Routes to `/web/scrape`
- **web_scrape**: Routes to `/web/scrape`
- **Other actions**: Routes to their specific endpoints

### Priority 3: Default Routing
If no task or action field detected:
- Routes to default endpoint (`http://localhost:8000/`)

## Expected Server Endpoint

Your server should handle:
```
POST /web/scrape
Content-Type: application/json

{
  "action": "scrape",
  "url": "https://example.com",
  "options": {
    "extract_text": true,
    "extract_links": false,
    "wait_for_load": true
  },
  "assigned_by": "ray",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Common Scrape Options

### Text Extraction
```json
{
  "extract_text": true,
  "extract_metadata": true,
  "clean_html": true
}
```

### Link and Media Extraction
```json
{
  "extract_links": true,
  "extract_images": true,
  "extract_videos": false
}
```

### Loading and Timing Options
```json
{
  "wait_for_load": true,
  "timeout": 30000,
  "delay_before_scrape": 2000
}
```

### Request Configuration
```json
{
  "follow_redirects": true,
  "user_agent": "Mozilla/5.0 (compatible; WebScraper/1.0)",
  "headers": {
    "Accept": "text/html,application/xhtml+xml"
  }
}
```

## Testing

### Browser Console Test
Run the test script in browser console:
```javascript
// Load the test file: test_web_scrape_routing.js
// It will automatically test all routing scenarios
```

### Expected Console Output
```
🕷️ Web Scrape Routing Test Suite Starting...
✅ FetchSender is available
🗺️ Current action routes: {...}
🎯 Test Case 1: Direct scrape action format
🎉 SUCCESS: Direct scrape routed to /web/scrape endpoint!
🎯 Test Case 2: web_scrape action format  
🎉 SUCCESS: Web scrape routed to /web/scrape endpoint!
🎯 Test Case 3: Scrape action within task array
🎉 SUCCESS: Scrape task routed to /web/scrape endpoint!
🎯 Test Case 4: Multiple scrape actions in task array
🎉 SUCCESS: Multiple scrape tasks routed to /tasks endpoint (correct behavior)!
✅ Web Scrape Routing Test Suite Complete!
```

## Troubleshooting

### Route Not Working
1. Check if FetchSender is loaded: `typeof window.FetchSender`
2. Verify action routes: `window.FetchSender.getActionRoutes()`
3. Check console for routing messages
4. Ensure JSON structure matches expected format

### Server Not Receiving Requests
1. Verify server is running on `localhost:8000`
2. Check server logs for incoming requests
3. Verify `/web/scrape` endpoint exists
4. Check CORS configuration if needed

### Action Not Routing Correctly
1. Ensure action name is exactly `"scrape"` or `"web_scrape"`
2. Check for typos in action field
3. Verify JSON structure is valid
4. Test with the provided test script

## Integration Examples

### Basic Scraping Request
```javascript
const scrapeRequest = {
  action: "scrape",
  url: "https://example.com",
  options: {
    extract_text: true,
    extract_links: true
  },
  assigned_by: "ray"
};

window.FetchSender.sendJSON(scrapeRequest);
```

### Advanced Scraping with Options
```javascript
const advancedScrapeRequest = {
  action: "web_scrape",
  url: "https://news.example.com/article",
  options: {
    extract_text: true,
    extract_metadata: true,
    extract_images: false,
    wait_for_load: true,
    timeout: 45000,
    clean_html: true,
    follow_redirects: true
  },
  assigned_by: "ray",
  execute_immediately: true
};

window.FetchSender.sendJSON(advancedScrapeRequest);
```

The routing system will automatically handle the request and send it to the appropriate `/web/scrape` endpoint on your server.