/** 로그인 화면에 쓰는 꽃다발 일러스트. 외부 이미지 없이 인라인 SVG 로 그린다. */
export default function Bouquet({ className = 'h-40 w-40' }: { className?: string }) {
  const petals = [
    { cx: 60, cy: 42, r: 13, fill: '#F9A8D4' },
    { cx: 84, cy: 34, r: 11, fill: '#FBCFE8' },
    { cx: 40, cy: 34, r: 11, fill: '#FBCFE8' },
    { cx: 72, cy: 58, r: 12, fill: '#F472B6' },
    { cx: 46, cy: 58, r: 12, fill: '#FBCFE8' },
    { cx: 96, cy: 54, r: 9, fill: '#F9A8D4' },
    { cx: 26, cy: 52, r: 9, fill: '#F9A8D4' },
    { cx: 60, cy: 72, r: 10, fill: '#EC4899' },
  ];

  return (
    <svg viewBox="0 0 120 140" className={className} role="img" aria-label="꽃다발">
      {/* 줄기 */}
      <path d="M60 78 L48 118 M60 78 L60 120 M60 78 L72 118" stroke="#86EFAC" strokeWidth="3" strokeLinecap="round" />
      {/* 잎 */}
      <ellipse cx="40" cy="82" rx="13" ry="7" fill="#BBF7D0" transform="rotate(-25 40 82)" />
      <ellipse cx="80" cy="82" rx="13" ry="7" fill="#BBF7D0" transform="rotate(25 80 82)" />
      {/* 꽃송이 */}
      {petals.map((p) => (
        <circle key={`${p.cx}-${p.cy}`} cx={p.cx} cy={p.cy} r={p.r} fill={p.fill} />
      ))}
      {petals.slice(0, 5).map((p) => (
        <circle key={`c-${p.cx}`} cx={p.cx} cy={p.cy} r={p.r / 3} fill="#FFF7ED" />
      ))}
      {/* 포장지 */}
      <path d="M40 90 L60 128 L80 90 Z" fill="#FCE7F3" />
      {/* 리본 */}
      <path d="M52 100 q8 -6 16 0 q-8 8 -16 0Z" fill="#EC4899" />
      <circle cx="60" cy="100" r="3.5" fill="#DB2777" />
    </svg>
  );
}
