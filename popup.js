// Popup script for Genesis Loop extension
document.addEventListener('DOMContentLoaded', function() {
  // Set up the view responses button
  const viewResponsesBtn = document.getElementById('view-responses');
  if (viewResponsesBtn) {
    viewResponsesBtn.addEventListener('click', function() {
      // Query the active tab to get access to the content script
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // Send a message to the content script
        chrome.tabs.sendMessage(tabs[0].id, {action: "getResponses"}, function(response) {
          if (response && response.responses) {
            // Create a simple display of responses
            alert(`Latest responses (${response.responses.length}):\n\n` + 
                  response.responses.map((r, i) => 
                    `${i+1}. [${r.timestamp}]\n${r.text.substring(0, 100)}...`
                  ).join('\n\n'));
          } else {
            alert('No responses recorded yet.');
          }
        });
      });
    });
  }
});