function updateLogs(logs) {
    const logContainer = document.getElementById('logContainer');
    logContainer.textContent = logs.join('\n');
}

chrome.runtime.sendMessage({action: "getLogs"}, function(response) {
    if (response && response.logs) {
        updateLogs(response.logs);
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateLogs") {
        updateLogs(request.logs);
    }
});