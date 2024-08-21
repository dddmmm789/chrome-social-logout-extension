document.getElementById('logoutButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "triggerLogout"});
    window.close();
  });
  
  document.getElementById('viewLogs').addEventListener('click', function() {
    chrome.tabs.create({url: 'log.html'});
  });