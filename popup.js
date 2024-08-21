document.getElementById('logoutButton').addEventListener('click', () => {
    console.log("Logout button clicked");
    chrome.runtime.sendMessage({ action: "triggerLogout" }, (response) => {
      console.log("Response from background:", response);
    });
  });
  
  document.getElementById('getLogs').addEventListener('click', () => {
    chrome.runtime.sendMessage({action: "getLogs"}, (response) => {
      console.log(response.logs);
      navigator.clipboard.writeText(response.logs).then(() => {
        alert("Logs copied to clipboard!");
      });
    });
  });