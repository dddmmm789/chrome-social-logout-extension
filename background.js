let logs = [];

function log(...args) {
  console.log(...args);
  logs.push(args.map(arg => JSON.stringify(arg)).join(' '));
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  log("Message received in background:", request);
  if (request.action === "triggerLogout") {
    chrome.tabs.query({}, (tabs) => {
      log("Number of tabs found:", tabs.length);
      tabs.forEach((tab) => {
        log("Tab URL:", tab.url || "undefined");
        if (tab.url && tab.url.match(/facebook\.com|twitter\.com|instagram\.com|linkedin\.com/)) {
          log("Sending logout message to tab:", tab.id, tab.url);
          chrome.tabs.sendMessage(tab.id, { action: "logout" }, (response) => {
            if (chrome.runtime.lastError) {
              log("Error sending message to tab:", chrome.runtime.lastError);
            } else {
              log("Message sent successfully to tab:", tab.id);
            }
          });
        }
      });
    });
  } else if (request.action === "getLogs") {
    sendResponse({logs: logs.join('\n')});
    logs = []; // Clear logs after sending
  }
  return true; // Indicates that the response will be sent asynchronously
});