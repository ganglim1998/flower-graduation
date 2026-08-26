/** 네이버 지도 SDK 를 한 번만 로드한다. 클라이언트 ID 가 없으면 null 을 반환한다. */
let loadPromise: Promise<typeof window.naver | null> | null = null;

export const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ?? '';
export const isNaverMapEnabled = NAVER_MAP_CLIENT_ID.length > 0;

export function loadNaverMaps(): Promise<typeof window.naver | null> {
  if (!isNaverMapEnabled) return Promise.resolve(null);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    if (window.naver?.maps) return resolve(window.naver);

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`;
    script.async = true;
    script.onload = () => resolve(window.naver);
    script.onerror = () =>
      reject(
        new Error('네이버 지도를 불러오지 못했습니다. 클라이언트 ID 와 웹 서비스 URL 등록을 확인하세요.')
      );
    document.head.appendChild(script);
  });

  return loadPromise;
}
