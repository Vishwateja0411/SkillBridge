import React from 'react';

interface AuthBridgeArtProps {
  className?: string;
  roleMode?: 'freelancer' | 'business';
}

export const AuthBridgeArt: React.FC<AuthBridgeArtProps> = ({
  className = '',
  roleMode = 'freelancer',
}) => {
  return (
    <div
      className={`relative w-full max-w-[460px] pointer-events-none select-none overflow-visible ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 460 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible animate-bridge-drift"
      >
        <defs>
          <linearGradient id="goldRoadway" x1="40" y1="210" x2="420" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C9A24B" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#E5CB86" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C9A24B" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="flowPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A24B" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#E5CB86" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="apexGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E5CB86" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#C9A24B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0B3D2E" stopOpacity="0" />
          </radialGradient>

          <filter id="goldGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient apex aura */}
        <circle cx="230" cy="82" r="32" fill="url(#apexGlowGrad)" className="animate-pulse-slow" />

        {/* Baseline roadway */}
        <line
          x1="40"
          y1="210"
          x2="420"
          y2="210"
          stroke="url(#goldRoadway)"
          strokeWidth="1.5"
        />

        {/* Primary structural suspension arch */}
        <path
          d="M 40 210 Q 230 40 420 210"
          stroke="#C9A24B"
          strokeWidth="1.6"
          strokeOpacity="0.5"
          fill="none"
        />

        {/* Animated golden light beam flowing across the arch */}
        <path
          d="M 40 210 Q 230 40 420 210"
          stroke="url(#flowPulseGrad)"
          strokeWidth="2.8"
          strokeDasharray="90 320"
          className="animate-beam-flow"
          filter="url(#goldGlow)"
          fill="none"
        />

        {/* Inner concentric arch */}
        <path
          d="M 90 210 Q 230 110 370 210"
          stroke="#C9A24B"
          strokeWidth="1"
          strokeOpacity="0.25"
          strokeDasharray="4 3"
          fill="none"
        />

        {/* Vertical and diagonal tension cables with gentle breathing */}
        <line x1="140" y1="210" x2="140" y2="128" stroke="#C9A24B" strokeOpacity="0.28" strokeWidth="0.8" />
        <line x1="230" y1="210" x2="230" y2="82" stroke="#C9A24B" strokeOpacity="0.45" strokeWidth="1.2" />
        <line x1="320" y1="210" x2="320" y2="128" stroke="#C9A24B" strokeOpacity="0.28" strokeWidth="0.8" />

        {/* Webbing truss lines */}
        <line x1="40" y1="210" x2="140" y2="128" stroke="#C9A24B" strokeOpacity="0.2" strokeWidth="0.75" />
        <line x1="140" y1="128" x2="230" y2="82" stroke="#C9A24B" strokeOpacity="0.3" strokeWidth="0.85" />
        <line x1="230" y1="82" x2="320" y2="128" stroke="#C9A24B" strokeOpacity="0.3" strokeWidth="0.85" />
        <line x1="320" y1="128" x2="420" y2="210" stroke="#C9A24B" strokeOpacity="0.2" strokeWidth="0.75" />

        {/* Baseline nodes */}
        <circle cx="40" cy="210" r="3.5" fill="#E5CB86" />
        <circle cx="230" cy="210" r="3.5" fill="#E5CB86" />
        <circle cx="420" cy="210" r="3.5" fill="#E5CB86" />

        {/* Intermediate arch nodes with subtle pulsing rings */}
        <circle cx="140" cy="128" r="4" fill="#E5CB86" />
        <circle cx="140" cy="128" r="8" fill="#C9A24B" fillOpacity="0.2" className="animate-node-pulse" />

        <circle cx="320" cy="128" r="4" fill="#E5CB86" />
        <circle cx="320" cy="128" r="8" fill="#C9A24B" fillOpacity="0.2" className="animate-node-pulse" />

        {/* Apex crown node with expanding radiant aura */}
        <circle cx="230" cy="82" r="12" fill="#C9A24B" fillOpacity="0.2" className="animate-ping-slow" />
        <circle cx="230" cy="82" r="6" fill="#E5CB86" filter="url(#goldGlow)" />
        <circle cx="230" cy="82" r="2.5" fill="#FFFFFF" />

        {/* Ambient floating constellation nodes with gentle twinkling */}
        <circle cx="185" cy="58" r="2.2" fill="#E5CB86" className="animate-twinkle" />
        <circle cx="280" cy="68" r="2" fill="#E5CB86" className="animate-twinkle-delay-1" />
        <circle cx="95" cy="155" r="1.8" fill="#C9A24B" className="animate-twinkle-delay-2" />
        <circle cx="365" cy="155" r="1.8" fill="#C9A24B" className="animate-twinkle" />
        <circle cx="230" cy="140" r="1.5" fill="#E5CB86" fillOpacity="0.6" />
      </svg>
    </div>
  );
};
