function createOverlay(results) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 9999;
        max-width: 300px;
        font-family: Arial, sans-serif;
    `;

    const successfulLogouts = results.filter(result => result.success);
    
    let content = `
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <img src="${chrome.runtime.getURL('icon128.png')}" alt="PrivacyPanic Logo" style="width: 32px; height: 32px; margin-right: 10px;">
            <h2 style="margin: 0;">PrivacyPanic Results</h2>
        </div>
    `;

    if (successfulLogouts.length > 0) {
        content += '<h3>Successfully logged out from:</h3><ul>';
        successfulLogouts.forEach(result => {
            content += `<li>${result.site}</li>`;
        });
        content += '</ul>';
    } else {
        content += '<p>No successful logouts recorded.</p>';
    }

    content += `
        <h3>X.com - Manual logout required:</h3>
        <ol>
            <li>Click on the "More" (...) button in the left sidebar</li>
            <li>Click on "Log out" at the bottom of the menu</li>
            <li>Confirm the logout if prompted</li>
        </ol>
        <button id="close-overlay" style="background: #1E90FF; color: white; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer; border-radius: 5px;">Close</button>
    `;

    overlay.innerHTML = content;
    document.body.appendChild(overlay);

    document.getElementById('close-overlay').addEventListener('click', function() {
        overlay.remove();
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showResults") {
        createOverlay(request.results);
    }
});