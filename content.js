let contentLogs = [];

function contentLog(...args) {
  console.log(...args);
  contentLogs.push(args.join(' '));
}

contentLog("Content script loaded for:", window.location.hostname);

function performLogout() {
  contentLog("Attempting logout for:", window.location.hostname);
  
  const logoutUrls = {
    "facebook.com": "https://www.facebook.com/logout.php",
    "linkedin.com": "https://www.linkedin.com/m/logout",
    "twitter.com": "https://twitter.com/logout",
    "x.com": "https://twitter.com/logout",
    "instagram.com": "https://www.instagram.com/accounts/logout/",
    "web.whatsapp.com": "https://web.whatsapp.com/logout"
  };

  const domain = Object.keys(logoutUrls).find(domain => window.location.hostname.includes(domain));
  
  if (domain) {
    const logoutUrl = logoutUrls[domain];
    contentLog("Navigating to logout URL:", logoutUrl);
    window.location.href = logoutUrl;
  } else {
    contentLog("No logout URL found for this domain");
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  contentLog("Message received in content script:", request);
  if (request.action === "logout") {
    performLogout();
    sendResponse({status: "Logout attempt initiated", logs: contentLogs});
  }
  return true; // Indicates that the response will be sent asynchronously
});

// Notify background script that content script is loaded
chrome.runtime.sendMessage({action: "contentScriptLoaded", url: window.location.href});