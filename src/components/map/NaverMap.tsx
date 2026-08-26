'use client';

import { useEffect, useRef, useState } from 'react';
import { loadNaverMaps, isNaverMapEnabled } from '@/lib/naver/loader';
import type { Coords } from '@/types';

export type MapMarker = Coords & {
  id: string;
  label?: string;
  highlight?: boolean;
};

type Props = {
  center: Coords;
  markers?: MapMarker[];
  radiusM?: number;
  onMarkerClick?: (id: string) => void;
  className?: string;
};

/** 반경이 화면에 들어오도록 줌 레벨을 고른다. 네이버는 숫자가 클수록 확대된다. */
function zoomForRadius(radiusM?: number) {
  if (!radiusM) return 15;
  return Math.min(16, Math.max(10, Math.round(15 - Math.log2(radiusM / 1000))));
}

export default function NaverMap({
  center,
  markers = [],
  radiusM,
  onMarkerClick,
  className = 'h-64 w-full',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  // 마커 배열은 렌더마다 새로 만들어지므로 내용으로 비교한다.
  const markerKey = markers.map((m) => `${m.id}:${m.highlight ? 1 : 0}`).join(',');

  useEffect(() => {
    if (!isNaverMapEnabled) return;
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any = null;

    loadNaverMaps()
      .then((naver) => {
        if (!naver || cancelled || !containerRef.current) return;

        const position = new naver.maps.LatLng(center.lat, center.lng);
        map = new naver.maps.Map(containerRef.current, {
          center: position,
          zoom: zoomForRadius(radiusM),
        });

        new naver.maps.Marker({ map, position });

        if (radiusM) {
          new naver.maps.Circle({
            map,
            center: position,
            radius: radiusM,
            strokeWeight: 1,
            strokeColor: '#db2777',
            strokeOpacity: 0.6,
            fillColor: '#db2777',
            fillOpacity: 0.06,
          });
        }

        markers.forEach((m) => {
          const marker = new naver.maps.Marker({
            map,
            position: new naver.maps.LatLng(m.lat, m.lng),
            title: m.label,
          });
          if (onMarkerClick) {
            naver.maps.Event.addListener(marker, 'click', () => onMarkerClick(m.id));
          }
        });
      })
      .catch((e: Error) => !cancelled && setError(e.message));

    return () => {
      cancelled = true;
      map?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center.lat, center.lng, radiusM, markerKey]);

  if (!isNaverMapEnabled || error) {
    return (
      <FallbackMap
        center={center}
        markers={markers}
        radiusM={radiusM}
        onMarkerClick={onMarkerClick}
        className={className}
        notice={error ?? '네이버 지도 키가 없어 간이 지도로 표시합니다.'}
      />
    );
  }

  return <div ref={containerRef} className={`${className} overflow-hidden rounded-xl bg-gray-100`} />;
}

/** 지도 키가 없을 때 쓰는 좌표 기반 간이 뷰. */
function FallbackMap({
  center,
  markers,
  radiusM,
  onMarkerClick,
  className,
  notice,
}: Props & { notice: string }) {
  const span = (radiusM ?? 1500) * 1.25;
  // 위도 1도 ≈ 111km, 경도는 위도에 따라 축소된다.
  const mPerLat = 111_000;
  const mPerLng = 111_000 * Math.cos((center.lat * Math.PI) / 180);

  const toPercent = (m: MapMarker) => ({
    left: 50 + ((m.lng - center.lng) * mPerLng * 50) / span,
    top: 50 - ((m.lat - center.lat) * mPerLat * 50) / span,
  });

  return (
    <div
      className={`${className} relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50`}
    >
      <div className="absolute inset-0 [background-image:linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

      {radiusM && (
        <div
          className="absolute rounded-full border border-pink-400/60 bg-pink-500/5"
          style={{
            left: '50%',
            top: '50%',
            width: `${(radiusM / span) * 100}%`,
            height: `${(radiusM / span) * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="h-3.5 w-3.5 rounded-full border-2 border-white bg-pink-600 shadow" />
      </div>

      {markers?.map((m) => {
        const { left, top } = toPercent(m);
        if (left < 0 || left > 100 || top < 0 || top > 100) return null;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onMarkerClick?.(m.id)}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${left}%`, top: `${top}%` }}
            title={m.label}
          >
            <span
              className={`block h-2.5 w-2.5 rounded-full border border-white shadow ${
                m.highlight ? 'bg-emerald-600' : 'bg-gray-400'
              }`}
            />
          </button>
        );
      })}

      <p className="absolute bottom-1.5 left-2 right-2 z-10 truncate text-[10px] text-gray-500">
        {notice}
      </p>
    </div>
  );
}
