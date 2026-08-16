document.getElementById('scrape-detail').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: "scrape_detail" }, (response) => {
        handleResponse(response);
    });
});

document.getElementById('scrape-list').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: "scrape_list" }, (response) => {
        handleResponse(response);
    });
});

function handleResponse(response) {
    const statusEl = document.getElementById('status');
    if (response && response.success) {
        statusEl.textContent = `✅ ${response.message}`;
        statusEl.style.color = '#4ade80';
    } else if (response) {
        statusEl.textContent = `❌ ${response.error || 'Error desconocido'}`;
        statusEl.style.color = '#f87171';
    } else {
        statusEl.textContent = '⏱️ Procesando...';
    }
}
