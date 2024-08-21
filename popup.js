document.getElementById('logoutButton').addEventListener('click', () => {
  console.log("Logout button clicked");
  chrome.runtime.sendMessage({ action: "triggerLogout" }, (response) => {
    console.log("Response from background:", response);
  });
});

document.getElementById('getLogs').addEventListener('click', () => {
  chrome.runtime.sendMessage({action: "getLogs"}, (response) => {
    console.log("Logs received:", response);
    if (response && response.logs) {
      document.getElementById('logsArea').textContent = response.logs;
    } else {
      document.getElementById('logsArea').textContent = "No logs available";
    }
  });
});
