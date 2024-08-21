function sendLogoutMessage(tabId, url, retries = 3) {
  chrome.tabs.sendMessage(tabId, { action: "logout" }, (response) => {
    if (chrome.runtime.lastError) {
      console.log("Error sending message to tab:", chrome.runtime.lastError);
      if (retries > 0) {
        console.log("Retrying in 1 second...");
        setTimeout(() => sendLogoutMessage(tabId, url, retries - 1), 1000);
      }
    } else {
      console.log("Message sent successfully to tab:", tabId);
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in background:", request);
  if (request.action === "triggerLogout") {
    chrome.tabs.query({}, (tabs) => {
      console.log("Number of tabs found:", tabs.length);
      tabs.forEach((tab) => {
        console.log("Tab URL:", tab.url || "undefined");
        if (tab.url && tab.url.match(/facebook\.com|twitter\.com|instagram\.com|linkedin\.com/)) {
          console.log("Sending logout message to tab:", tab.id, tab.url);
          sendLogoutMessage(tab.id, tab.url);
        }
      });
    });
  }
});
