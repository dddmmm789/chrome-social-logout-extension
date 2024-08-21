let logoutResults = [];
const socialNetworks = [
  {url: "https://www.facebook.com", domains: ["facebook.com"], name: "Facebook"},
  {url: "https://www.linkedin.com", domains: ["linkedin.com"], name: "LinkedIn"},
  {url: "https://www.instagram.com", domains: ["instagram.com"], name: "Instagram"},
  {url: "https://web.whatsapp.com", domains: ["web.whatsapp.com"], name: "WhatsApp"},
  {url: "https://accounts.google.com", domains: ["google.com", "youtube.com", "gmail.com"], name: "Google"}
];

function startLogoutProcess() {
  logoutResults = []; // Reset results
  socialNetworks.forEach(createOrFocusTab);
  
  // Set a timeout for the entire process
  setTimeout(showFinalPage, 15000); // 15 seconds timeout
}

function createOrFocusTab(network) {
  chrome.tabs.query({url: network.domains.map(domain => `*://*.${domain}/*`)}, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.update(tabs[0].id, {active: true}, (tab) => {
        setTimeout(() => initiateLogout(tab, network), 2000);
      });
    } else {
      chrome.tabs.create({url: network.url, active: false}, (tab) => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
          if (tabId === tab.id && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            setTimeout(() => initiateLogout(tab, network), 2000);
          }
        });
      });
    }
  });
}

function initiateLogout(tab, network) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: performLogout,
    args: [network.name]
  }, (injectionResults) => {
    if (chrome.runtime.lastError) {
      logoutResults.push({ site: network.name, success: false });
    } else if (injectionResults && injectionResults[0] && injectionResults[0].result) {
      logoutResults.push({ site: network.name, success: true });
    } else {
      logoutResults.push({ site: network.name, success: false });
    }
  });
}

function showFinalPage() {
  chrome.tabs.create({ url: 'https://twitter.com', active: true }, (tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['final.js']
    }, () => {
      chrome.tabs.sendMessage(tab.id, { action: "showResults", results: logoutResults });
    });
  });
}

function performLogout(siteName) {
  console.log(`Attempting to log out from ${siteName}`);
  
  switch(siteName) {
    case "Facebook":
      return logoutFacebook();
    case "LinkedIn":
      return logoutLinkedIn();
    case "Instagram":
      return logoutInstagram();
    case "WhatsApp":
      return logoutWhatsApp();
    case "Google":
      return logoutGoogle();
    default:
      console.warn(`No specific logout method for ${siteName}`);
      return false;
  }
}

function logoutFacebook() {
  const logoutButton = document.querySelector('div[data-nocookies="true"] a[href*="logout.php"]');
  if (logoutButton) {
    logoutButton.click();
    return true;
  }
  return false;
}

function logoutLinkedIn() {
  const navButton = document.querySelector('button[aria-label="Open the Me menu"]');
  if (navButton) {
    navButton.click();
    setTimeout(() => {
      const signOutLink = document.querySelector('a[href*="logout"]');
      if (signOutLink) {
        signOutLink.click();
        return true;
      }
    }, 1000);
  }
  return false;
}

function logoutInstagram() {
  const profileButton = document.querySelector('span[role="link"]:has(img[alt*="profile picture"])');
  if (profileButton) {
    profileButton.click();
    setTimeout(() => {
      const logoutButton = document.querySelector('button:contains("Log Out")');
      if (logoutButton) {
        logoutButton.click();
        return true;
      }
    }, 1000);
  }
  return false;
}

function logoutWhatsApp() {
  const menuButton = document.querySelector('div[aria-label="Menu"]');
  if (menuButton) {
    menuButton.click();
    setTimeout(() => {
      const logoutButton = document.querySelector('div[aria-label="Log out"]');
      if (logoutButton) {
        logoutButton.click();
        return true;
      }
    }, 1000);
  }
  return false;
}

function logoutGoogle() {
  const accountButton = document.querySelector('a[aria-label="Google Account"]');
  if (accountButton) {
    accountButton.click();
    setTimeout(() => {
      const signOutButton = document.querySelector('a[href*="Logout"]');
      if (signOutButton) {
        signOutButton.click();
        return true;
      }
    }, 1000);
  }
  return false;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "triggerLogout") {
    startLogoutProcess();
    sendResponse({status: "Logout process initiated"});
  }
  return true;
});