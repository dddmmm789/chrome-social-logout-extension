console.log("Content script loaded for:", window.location.hostname);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);
  if (request.action === "logout") {
    console.log("Attempting logout for:", window.location.hostname);
    if (window.location.hostname.includes("facebook.com")) {
      // Facebook logout
      console.log("Attempting Facebook logout");
      document.querySelector('a[data-testid="account_menu_button"]')?.click();
      setTimeout(() => {
        document.querySelector('div[data-nocookies="true"] a')?.click();
      }, 1000);
    } else if (window.location.hostname.includes("twitter.com")) {
      // Twitter logout
      console.log("Attempting Twitter logout");
      document.querySelector('a[data-testid="AccountSwitcher_Logout_Button"]')?.click();
    } else if (window.location.hostname.includes("instagram.com")) {
      // Instagram logout
      console.log("Attempting Instagram logout");
      document.querySelector('button._abn5')?.click();
      setTimeout(() => {
        document.querySelector('button._a9--._a9_1')?.click();
      }, 1000);
    } else if (window.location.hostname.includes("linkedin.com")) {
      // LinkedIn logout
      console.log("Attempting LinkedIn logout");
      document.querySelector('.global-nav__nav-link.global-nav__account-item')?.click();
      setTimeout(() => {
        document.querySelector('a[href*="logout"]')?.click();
      }, 1000);
    }
    sendResponse({status: "Logout attempt completed"});
  }
  return true; // Indicates that the response will be sent asynchronously
});