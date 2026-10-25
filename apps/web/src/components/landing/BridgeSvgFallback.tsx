import React from 'react';

export const BridgeSvgFallback: React.FC<{ className?: string }> = ({ className = '' }) => {
  // Pre-calculated arched node coordinates to render a clean, low-opacity bridge constellation
  const points = [
    { x: 50, y: 320, r: 2.5, color: '#C9A24B' },
    { x: 90, y: 280, r: 2, color: '#E5CB86' },
    { x: 140, y: 240, r: 3, color: '#C9A24B' },
    { x: 190, y: 200, r: 2.5, color: '#F6F1E4' },
    { x: 250, y: 170, r: 3, color: '#E5CB86' },
    { x: 310, y: 145, r: 2.5, color: '#C9A24B' },
    { x: 380, y: 130, r: 3.5, color: '#E5CB86' },
    { x: 450, y: 120, r: 4, color: '#F6F1E4' },
    { x: 520, y: 118, r: 3.5, color: '#C9A24B' },
    { x: 590, y: 125, r: 3, color: '#E5CB86' },
    { x: 660, y: 140, r: 3, color: '#C9A24B' },
    { x: 730, y: 165, r: 2.5, color: '#F6F1E4' },
    { x: 790, y: 195, r: 3, color: '#E5CB86' },
    { x: 840, y: 235, r: 2.5, color: '#C9A24B' },
    { x: 890, y: 275, r: 2, color: '#E5CB86' },
    { x: 930, y: 315, r: 2.5, color: '#C9A24B' },
    // Lower arch / depth struts
    { x: 120, y: 330, r: 2, color: '#C9A24B' },
    { x: 200, y: 270, r: 2.5, color: '#E5CB86' },
    { x: 300, y: 220, r: 2, color: '#C9A24B' },
    { x: 410, y: 190, r: 3, color: '#E5CB86' },
    { x: 530, y: 180, r: 3, color: '#F6F1E4' },
    { x: 650, y: 200, r: 2.5, color: '#C9A24B' },
    { x: 760, y: 240, r: 2, color: '#E5CB86' },
    { x: 850, y: 320, r: 2, color: '#C9A24B' },
  ];

  // Connecting lines
  const lines = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15],
    [16, 17], [17, 18], [18, 19], [19, 20], [20, 21], [21, 22], [22, 23],
    [1, 16], [2, 17], [3, 17], [4, 18], [5, 18], [6, 19], [7, 19], [8, 20], [9, 21], [10, 21], [11, 22], [12, 22], [13, 23]
  ];

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
    >
      <svg
        viewBox="0 0 1000 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover opacity-25"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Connection lines */}
        {lines.map(([start, end], idx) => (
          <line
            key={`l-${idx}`}
            x1={points[start].x}
            y1={points[start].y}
            x2={points[end].x}
            y2={points[end].y}
            stroke="#C9A24B"
            strokeWidth="0.75"
            strokeOpacity="0.4"
          />
        ))}

        {/* Nodes */}
        {points.map((pt, idx) => (
          <circle
            key={`p-${idx}`}
            cx={pt.x}
            cy={pt.y}
            r={pt.r}
            fill={pt.color}
            fillOpacity="0.85"
          />
        ))}
      </svg>
    </div>
  );
};
