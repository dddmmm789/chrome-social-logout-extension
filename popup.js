document.getElementById('logoutButton').addEventListener('click', () => {
  console.log("Logout button clicked");
  chrome.runtime.sendMessage({ action: "triggerLogout" }, (response) => {
    console.log("Response from background:", response);
  });
});

document.getElementById('getLogs').addEventListener('click', () => {
  chrome.runtime.sendMessage({action: "getLogs"}, (response) => {
    console.log("Logs received:", response);
    const logsArea = document.getElementById('logsArea');
    if (response && response.logs) {
      logsArea.textContent = response.logs;
    } else {
      logsArea.textContent = "No logs available";
    }
  });
});
