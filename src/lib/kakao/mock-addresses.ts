/**
 * 카카오 REST API 키가 없을 때 쓰는 목 주소 데이터.
 * 좌표는 강남/서초 일대 근사값이며, 키를 넣으면 실제 API 응답으로 대체된다.
 */
import type { AddressResult } from '@/types';

export const MOCK_ADDRESSES: AddressResult[] = [
  { address: '서울 강남구 논현로 501', placeName: '논현동 일대', lat: 37.5085, lng: 127.0335 },
  { address: '서울 강남구 학동로 100', placeName: '학동사거리', lat: 37.5140, lng: 127.0320 },
  { address: '서울 강남구 테헤란로 152', placeName: '역삼역 부근', lat: 37.5000, lng: 127.0365 },
  { address: '서울 강남구 도곡로 401', placeName: '도곡동 일대', lat: 37.4915, lng: 127.0435 },
  { address: '서울 강남구 삼성로 610', placeName: '삼성동 일대', lat: 37.5140, lng: 127.0520 },
  { address: '서울 서초구 서초대로 320', placeName: '서초역 부근', lat: 37.4915, lng: 127.0075 },
  { address: '서울 서초구 반포대로 58', placeName: '반포동 일대', lat: 37.4955, lng: 127.0100 },
  { address: '서울 서초구 신반포로 176', placeName: '고속터미널 부근', lat: 37.5045, lng: 127.0045 },
];

export function searchMockAddresses(query: string): AddressResult[] {
  const q = query.trim();
  if (!q) return [];
  return MOCK_ADDRESSES.filter(
    (a) => a.address.includes(q) || a.placeName?.includes(q)
  );
}
