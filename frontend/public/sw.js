self.addEventListener('install', function (event) {
  console.log('Service Worker 설치 완료');
});

self.addEventListener('fetch', function (event) {
  // 캐시 전략을 원한다면 여기서 정의 가능
});
