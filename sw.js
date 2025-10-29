const CACHE_NAME = 'dynamic-button-dashboard-v11';

// 安裝事件 - 快速安裝，不預快取檔案
self.addEventListener('install', event => {
  console.log('Service Worker 安裝中...');
  self.skipWaiting();
});

// 啟動事件 - 清除所有快取，確保總是獲取最新內容
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('刪除快取:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('Service Worker 已啟動 - 無快取模式');
      return self.clients.claim();
    })
  );
});

// 網路請求事件 - 總是從網路獲取最新內容
self.addEventListener('fetch', event => {
  // 直接從網路獲取，不使用快取
  event.respondWith(
    fetch(event.request).catch(error => {
      console.log('網路請求失敗:', event.request.url, error);
      // 如果網路失敗，返回一個錯誤頁面或者重新拋出錯誤
      throw error;
    })
  );
});
