'use client';

import { useEffect, useRef, useState } from 'react';
import { loadKakaoMaps, isKakaoEnabled } from '@/lib/kakao/loader';
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

export default function KakaoMap({
  center,
  markers = [],
  radiusM,
  onMarkerClick,
  className = 'h-64 w-full',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isKakaoEnabled) return;
    let cancelled = false;

    loadKakaoMaps()
      .then((kakao) => {
        if (!kakao || cancelled || !containerRef.current) return;

        const map = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(center.lat, center.lng),
          level: radiusM ? Math.max(3, Math.round(Math.log2(radiusM / 100)) + 1) : 4,
        });

        new kakao.maps.Marker({
          map,
          position: new kakao.maps.LatLng(center.lat, center.lng),
        });

        if (radiusM) {
          new kakao.maps.Circle({
            map,
            center: new kakao.maps.LatLng(center.lat, center.lng),
            radius: radiusM,
            strokeWeight: 1,
            strokeColor: '#db2777',
            strokeOpacity: 0.6,
            fillColor: '#db2777',
            fillOpacity: 0.06,
          });
        }

        markers.forEach((m) => {
          const marker = new kakao.maps.Marker({
            map,
            position: new kakao.maps.LatLng(m.lat, m.lng),
            title: m.label,
          });
          if (onMarkerClick) {
            kakao.maps.event.addListener(marker, 'click', () => onMarkerClick(m.id));
          }
        });
      })
      .catch((e: Error) => !cancelled && setError(e.message));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center.lat, center.lng, radiusM, markers]);

  if (!isKakaoEnabled || error) {
    return (
      <FallbackMap
        center={center}
        markers={markers}
        radiusM={radiusM}
        onMarkerClick={onMarkerClick}
        className={className}
        notice={error ?? '카카오 지도 키가 없어 간이 지도로 표시합니다.'}
      />
    );
  }

  return <div ref={containerRef} className={`${className} rounded-xl bg-gray-100`} />;
}

/** 카카오 키가 없을 때 쓰는 좌표 기반 간이 뷰. */
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
