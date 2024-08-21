let logs = [];

function log(...args) {
  console.log(...args);
  logs.push(args.map(arg => JSON.stringify(arg)).join(' '));
}

function sendLogoutMessage(tabId, url, retries = 3) {
  chrome.tabs.sendMessage(tabId, { action: "logout" }, (response) => {
    if (chrome.runtime.lastError) {
      log("Error sending message to tab:", chrome.runtime.lastError.message);
      if (retries > 0) {
        log("Retrying in 1 second...");
        setTimeout(() => sendLogoutMessage(tabId, url, retries - 1), 1000);
      }
    } else {
      log("Message sent successfully to tab:", tabId);
    }
  });
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
          sendLogoutMessage(tab.id, tab.url);
        }
      });
    });
  } else if (request.action === "getLogs") {
    log("Sending logs");
    sendResponse({logs: logs.join('\n')});
    logs = []; // Clear logs after sending
  }
  return true; // Indicates that the response will be sent asynchronously
});

log("Background script loaded");
