chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;

  chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
    tabs.forEach((tab) => chrome.tabs.reload(tab.id));
  });
});
