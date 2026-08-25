/** 카카오 지도 SDK 를 한 번만 로드한다. JS 키가 없으면 null 을 반환한다. */
let loadPromise: Promise<typeof window.kakao | null> | null = null;

export const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? '';
export const isKakaoEnabled = KAKAO_JS_KEY.length > 0;

export function loadKakaoMaps(): Promise<typeof window.kakao | null> {
  if (!isKakaoEnabled) return Promise.resolve(null);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    if (window.kakao?.maps) return resolve(window.kakao);

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao));
    script.onerror = () =>
      reject(new Error('카카오 지도 SDK 를 불러오지 못했습니다. 앱 키와 도메인 등록을 확인하세요.'));
    document.head.appendChild(script);
  });

  return loadPromise;
}
