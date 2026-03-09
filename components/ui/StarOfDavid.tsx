'use client';

interface StarOfDavidProps {
  size?: number;
  color?: string;
  className?: string;
}

export const StarOfDavid = ({
  size = 24,
  color = '#ffd700',
  className,
}: StarOfDavidProps) => {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.38;

  const triangle = (rotation: number): string => {
    const points: [number, number][] = [
      [cx + r * Math.cos((rotation - 90) * (Math.PI / 180)), cy + r * Math.sin((rotation - 90) * (Math.PI / 180))],
      [cx + r * Math.cos((rotation + 30) * (Math.PI / 180)), cy + r * Math.sin((rotation + 30) * (Math.PI / 180))],
      [cx + r * Math.cos((rotation + 150) * (Math.PI / 180)), cy + r * Math.sin((rotation + 150) * (Math.PI / 180))],
    ];
    return points.map(([x, y]) => `${x},${y}`).join(' ');
  };

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      className={className}
      aria-label="Star of David"
    >
      <polygon
        points={triangle(0)}
        fill="none"
        stroke={color}
        strokeWidth={s * 0.06}
      />
      <polygon
        points={triangle(180)}
        fill="none"
        stroke={color}
        strokeWidth={s * 0.06}
      />
    </svg>
  );
};
