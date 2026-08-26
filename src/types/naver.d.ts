declare global {
  interface Window {
    // 네이버 지도 SDK 는 공식 타입 선언을 제공하지 않는다.
    // 지도 생성/마커/원만 사용하므로 느슨하게 둔다.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    naver: any;
  }
}
export {};
