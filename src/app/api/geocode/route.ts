import { NextResponse } from 'next/server';
import { searchMockAddresses } from '@/lib/kakao/mock-addresses';
import type { AddressResult } from '@/types';

const KEY = process.env.KAKAO_REST_API_KEY;

/**
 * query=... 이면 주소 -> 좌표, lat/lng 이면 좌표 -> 주소.
 * REST 키가 없으면 목 데이터로 응답한다.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const lat = params.get('lat');
  const lng = params.get('lng');

  if (lat && lng) return reverseGeocode(Number(lat), Number(lng));

  const query = params.get('query')?.trim() ?? '';
  if (!query) return NextResponse.json({ results: [], mock: !KEY });
  if (!KEY) return NextResponse.json({ results: searchMockAddresses(query), mock: true });

  const res = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`,
    { headers: { Authorization: `KakaoAK ${KEY}` }, cache: 'no-store' }
  );
  if (!res.ok) return failure();

  type KakaoAddressDoc = {
    address_name: string;
    x: string;
    y: string;
    road_address?: { address_name: string } | null;
    address?: { region_3depth_name?: string } | null;
  };

  const data = await res.json();
  const results: AddressResult[] = (data.documents ?? []).map((d: KakaoAddressDoc) => ({
    address: d.road_address?.address_name ?? d.address_name,
    placeName: d.address?.region_3depth_name,
    lat: Number(d.y),
    lng: Number(d.x),
  }));
  return NextResponse.json({ results, mock: false });
}

async function reverseGeocode(lat: number, lng: number) {
  if (!KEY) {
    return NextResponse.json({
      results: [{ address: `현재 위치 (${lat.toFixed(4)}, ${lng.toFixed(4)})`, lat, lng }],
      mock: true,
    });
  }

  const res = await fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
    { headers: { Authorization: `KakaoAK ${KEY}` }, cache: 'no-store' }
  );
  if (!res.ok) return failure();

  const data = await res.json();
  const doc = data.documents?.[0];
  const address = doc?.road_address?.address_name ?? doc?.address?.address_name ?? '현재 위치';
  return NextResponse.json({ results: [{ address, lat, lng }], mock: false });
}

function failure() {
  return NextResponse.json(
    { error: '주소 검색에 실패했습니다. 잠시 후 다시 시도해 주세요.' },
    { status: 502 }
  );
}
