import React, { useRef, useEffect, useState } from 'react';

interface Node {
  baseX: number;
  baseY: number;
  z: number; // 0.3 = distant, 0.6 = mid, 1.0 = near
  radius: number;
  color: string;
  speedX: number;
  speedY: number;
  phaseX: number;
  phaseY: number;
  amplitudeX: number;
  amplitudeY: number;
}

interface Pulse {
  sourceIdx: number;
  targetIdx: number;
  progress: number;
  speed: number;
}

export const DepthNodeNetwork: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // Responsive node count (75 on mobile, 140 on desktop)
    const nodeCount = isMobile ? 65 : 130;
    const maxConnectionDist = isMobile ? 80 : 105;

    // Palette: Gold, Light Gold, Ivory
    const palette = ['#C9A24B', '#E5CB86', '#F6F1E4'];

    const nodes: Node[] = [];

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Initialize nodes distributed in an architectural arch spanning right 2/3
    for (let i = 0; i < nodeCount; i++) {
      // Parameter t across the arch from -0.1 to 1.15
      const t = (i / (nodeCount - 1)) * 1.25 - 0.1;
      // Parabolic catenary arch
      const archY = (1.2 - Math.pow(t - 0.55, 2) * 2.8) * 0.42;

      // Assign depth layer (30% deep, 45% mid, 25% foreground)
      const randZ = Math.random();
      const z = randZ > 0.7 ? 1.0 : randZ > 0.3 ? 0.65 : 0.35;

      // Position relative to width and height
      const baseX = (0.28 + t * 0.75 + (Math.random() - 0.5) * 0.18) * width;
      const baseY = (0.55 - archY + (Math.random() - 0.5) * 0.32) * height;

      const color =
        z === 1.0
          ? palette[1] // Light gold foreground
          : z > 0.5
          ? palette[0] // Primary gold midground
          : Math.random() > 0.5 ? palette[0] : palette[2];

      nodes.push({
        baseX,
        baseY,
        z,
        radius: (1.2 + z * 1.6) * (Math.random() * 0.4 + 0.8),
        color,
        speedX: (0.3 + Math.random() * 0.4) * 0.001,
        speedY: (0.25 + Math.random() * 0.35) * 0.001,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        amplitudeX: 8 + z * 10,
        amplitudeY: 6 + z * 8,
      });
    }

    // Occasional restrained travelling pulses
    const pulses: Pulse[] = [
      { sourceIdx: 12, targetIdx: 18, progress: 0.1, speed: 0.006 },
      { sourceIdx: 34, targetIdx: 42, progress: 0.5, speed: 0.008 },
      { sourceIdx: 68, targetIdx: 75, progress: 0.8, speed: 0.005 },
    ];

    // Mouse parallax tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile || isReducedMotion) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseRef.current.targetX = (e.clientX - cx) / cx;
      mouseRef.current.targetY = (e.clientY - cy) / cy;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Intersection observer to pause offscreen
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    const handleVis = () => {
      if (document.hidden) setIsVisible(false);
      else setIsVisible(true);
    };
    document.addEventListener('visibilitychange', handleVis);

    let startTime = performance.now();

    // Render Loop
    const render = (now: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const elapsed = isReducedMotion ? 0 : now - startTime;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      const mouseShiftX = mouseRef.current.x * 24;
      const mouseShiftY = mouseRef.current.y * 16;

      // 1. Calculate current 2D positions with drift and depth parallax
      const currentPositions: { x: number; y: number; z: number }[] = [];
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const driftX = isReducedMotion ? 0 : Math.sin(elapsed * n.speedX + n.phaseX) * n.amplitudeX;
        const driftY = isReducedMotion ? 0 : Math.cos(elapsed * n.speedY + n.phaseY) * n.amplitudeY;
        const parallaxX = mouseShiftX * n.z;
        const parallaxY = mouseShiftY * n.z;

        currentPositions.push({
          x: n.baseX + driftX + parallaxX,
          y: n.baseY + driftY + parallaxY,
          z: n.z,
        });
      }

      // 2. Draw connecting lines between nearby points
      for (let i = 0; i < nodes.length; i++) {
        const p1 = currentPositions[i];
        let connectionCount = 0;

        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = currentPositions[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDist && connectionCount < 3) {
            const avgZ = (p1.z + p2.z) * 0.5;
            const distRatio = 1 - dist / maxConnectionDist;
            const alpha = distRatio * 0.24 * avgZ;

            ctx.strokeStyle = `rgba(201, 162, 75, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.75 * avgZ;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            connectionCount++;
          }
        }
      }

      // 3. Draw travelling light pulses
      if (!isReducedMotion) {
        for (let p = 0; p < pulses.length; p++) {
          const pulse = pulses[p];
          pulse.progress += pulse.speed;
          if (pulse.progress >= 1) {
            pulse.progress = 0;
            pulse.sourceIdx = Math.floor(Math.random() * (nodes.length - 10));
            pulse.targetIdx = (pulse.sourceIdx + 3 + Math.floor(Math.random() * 5)) % nodes.length;
          }

          const s = currentPositions[pulse.sourceIdx];
          const t = currentPositions[pulse.targetIdx];
          if (s && t) {
            const px = s.x + (t.x - s.x) * pulse.progress;
            const py = s.y + (t.y - s.y) * pulse.progress;
            const pulseAlpha = Math.sin(pulse.progress * Math.PI) * 0.65;

            // Subtle gold pulse glow
            const radGrad = ctx.createRadialGradient(px, py, 0, px, py, 6);
            radGrad.addColorStop(0, `rgba(229, 203, 134, ${pulseAlpha})`);
            radGrad.addColorStop(1, 'rgba(201, 162, 75, 0)');

            ctx.fillStyle = radGrad;
            ctx.beginPath();
            ctx.arc(px, py, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 4. Draw nodes with depth-based sizes and subtle halos
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const p = currentPositions[i];
        const alpha = 0.35 + n.z * 0.55;

        // Foreground nodes get a soft subtle gold aura
        if (n.z > 0.8) {
          ctx.fillStyle = `rgba(201, 162, 75, 0.15)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, n.radius * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = n.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVis);
      observer.disconnect();
    };
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};
