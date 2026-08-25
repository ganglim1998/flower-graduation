declare global {
  interface Window {
    // 카카오 지도 SDK 는 공식 타입 선언을 제공하지 않는다.
    // MVP 단계에서는 지도 생성/마커/원만 사용하므로 느슨하게 둔다.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}
export {};
