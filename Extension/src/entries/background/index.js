chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;

  // Lấy danh sách các key cấu hình nhạy cảm cần cập nhật lập tức
  const criticalKeys = ["language", "locale"]; // Thay đổi key đúng với storage của project bạn

  const hasCriticalChange = criticalKeys.some((key) =>
    Object.prototype.hasOwnProperty.call(changes, key),
  );

  if (hasCriticalChange) {
    const languageChange = changes.language || changes.locale;

    // Truy vấn các tab YouTube đang hoạt động để gửi tín hiệu (Non-blocking)
    chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
      tabs.forEach((tab) => {
        if (!tab.id) return;

        // Gửi thông điệp xuống Content Script thay vì reload cả trang
        chrome.tabs
          .sendMessage(tab.id, {
            action: "YTWEAK_LOCALE_CHANGED",
            payload: {
              newValue: languageChange?.newValue,
              oldValue: languageChange?.oldValue,
            },
          })
          .catch(() => {
            // Bắt lỗi khi tab chưa load xong Content Script hoặc đã bị hủy
            // Tránh làm crash Background script
          });
      });
    });
  }
});
