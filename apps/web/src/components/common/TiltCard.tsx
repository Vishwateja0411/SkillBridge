import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // default 4 degrees
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 4,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isTouch, setIsTouch] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 22 };
  const rawRotX = useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rawRotY = useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const rotateX = useSpring(rawRotX, springConfig);
  const rotateY = useSpring(rawRotY, springConfig);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTouch || shouldReduceMotion) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setSpotlight({
      x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
      y: Math.round(((e.clientY - rect.top) / rect.height) * 100),
      active: true,
    });
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setSpotlight((prev) => ({ ...prev, active: false }));
  };

  if (shouldReduceMotion || isTouch) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        perspective: 1000,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
    >
      {/* Subtle radial gold spotlight */}
      {spotlight.active && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[12px] transition-opacity duration-200 z-10"
          style={{
            background: `radial-gradient(300px circle at ${spotlight.x}% ${spotlight.y}%, rgba(201, 162, 75, 0.08), transparent 70%)`,
          }}
        />
      )}
      {children}
    </motion.div>
  );
};
