import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';

export const Hero3DCardStack: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Pointer tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for natural tilt (max 8 deg)
  const springConfig = { stiffness: 150, damping: 24, mass: 0.8 };
  const rawRotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rawRotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  const rotateX = useSpring(rawRotateX, springConfig);
  const rotateY = useSpring(rawRotateY, springConfig);

  // Dynamic gold glow intensity
  const glowSpring = useSpring(0, { stiffness: 140, damping: 20 });

  // Spotlight position for radial gold reflection
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTouchDevice || shouldReduceMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Normalize coordinates from -0.5 to 0.5 relative to center
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
    glowSpring.set(Math.min(1, Math.sqrt(x * x + y * y) * 2.2));

    setSpotlight({
      x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
      y: Math.round(((e.clientY - rect.top) / rect.height) * 100),
    });
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    glowSpring.set(0);
    setSpotlight({ x: 50, y: 50 });
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full py-4 lg:py-6"
      style={{ perspective: 1200 }}
    >
      {/* 3D preserve-3d tilting stack */}
      <motion.div
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative flex flex-col"
      >
        {/* 1. Ivory Freelancer Card (Top Right, Z: 20px) */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: [0, -5, 0],
                }
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            transform: shouldReduceMotion ? 'none' : 'translateZ(20px)',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            boxShadow: '0 16px 36px -12px rgba(7, 42, 32, 0.7), 0 0 1px rgba(201, 162, 75, 0.25)',
          }}
          className="relative w-full max-w-[340px] sm:ml-auto z-10 bg-[#F6F1E4] border border-[#E5DFD0] rounded-[12px] p-4 text-[#0B3D2E] overflow-hidden"
        >
          {/* Radial Gold Spotlight Reflection */}
          {!shouldReduceMotion && (
            <div
              className="pointer-events-none absolute inset-0 rounded-[12px] transition-opacity duration-200"
              style={{
                background: `radial-gradient(350px circle at ${spotlight.x}% ${spotlight.y}%, rgba(201, 162, 75, 0.16), transparent 70%)`,
              }}
            />
          )}

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0B3D2E] text-[#F6F1E4] flex items-center justify-center font-serif text-base font-medium flex-shrink-0">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-base font-medium text-[#0B3D2E] leading-tight">
                Aarav Mehta
              </h3>
              <p className="text-[11px] text-[#4F6B5E] mt-0.5">Lead Product Designer</p>

              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] font-medium bg-[#EAE4D5] text-[#0B3D2E] px-2 py-0.5 rounded-[4px] border border-[#DDD5C3]">
                  UI/UX
                </span>
                <span className="text-[10px] font-medium bg-[#EAE4D5] text-[#0B3D2E] px-2 py-0.5 rounded-[4px] border border-[#DDD5C3]">
                  Figma
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#E5DFD0] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#0B3D2E] font-medium text-[11px]">
              <div className="w-3.5 h-3.5 border border-[#C9A24B] bg-[#C9A24B]/15 flex items-center justify-center rounded-[2px]">
                <Check className="w-2.5 h-2.5 text-[#C9A24B]" />
              </div>
              <span>Verified</span>
            </div>
            <span className="text-[#4F6B5E] text-[10px]">Sample data</span>
          </div>
        </motion.div>

        {/* 2. Elevated Emerald Project Card with Gold Border (Overlapping Mid-Left, Z: 50px) */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: [0, -6, 0],
                }
          }
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.2,
          }}
          style={{
            transform: shouldReduceMotion ? 'none' : 'translateZ(50px)',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            boxShadow: '0 20px 40px -12px rgba(7, 42, 32, 0.8), 0 0 16px rgba(201, 162, 75, 0.2)',
          }}
          className="relative w-full max-w-[320px] -mt-7 sm:-ml-4 z-20 bg-[#114A39]/95 backdrop-blur-sm border border-[#C9A24B] rounded-[12px] p-4 space-y-2.5 overflow-hidden"
        >
          {/* Subtle gold glow & reflection */}
          {!shouldReduceMotion && (
            <div
              className="pointer-events-none absolute inset-0 rounded-[12px] transition-opacity duration-200"
              style={{
                background: `radial-gradient(350px circle at ${spotlight.x}% ${spotlight.y}%, rgba(229, 203, 134, 0.16), transparent 70%)`,
              }}
            />
          )}

          <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
            OPEN PROJECT
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium text-[#F6F1E4] leading-snug">
              Redesign our onboarding
            </h3>
            <p className="text-[11px] text-[#BFD0C6] mt-0.5">3 milestones, 6 weeks</p>
          </div>

          {/* 3-segment milestone progress bar (Viewport Animated) */}
          <div className="pt-0.5">
            <div className="grid grid-cols-3 gap-1.5">
              <div className="h-1.5 rounded-full bg-[#1F5A46] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
                  className="h-full bg-[#C9A24B] rounded-full"
                />
              </div>
              <div className="h-1.5 rounded-full bg-[#1F5A46] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.55, ease: 'easeOut' }}
                  className="h-full bg-[#C9A24B] rounded-full"
                />
              </div>
              <div className="h-1.5 rounded-full bg-[#1F5A46]" title="Milestone 3: In Progress" />
            </div>
            <div className="flex justify-between text-[10px] text-[#9DB5A8] mt-1.5">
              <span>2 of 3 milestones funded</span>
              <span className="text-[#E5CB86] font-medium">Escrow Safe</span>
            </div>
          </div>
        </motion.div>

        {/* 3. Deep-Emerald Match Score Card (Overlapping Bottom-Right, Z: 80px) */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: [0, -5, 0],
                }
          }
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2.4,
          }}
          style={{
            transform: shouldReduceMotion ? 'none' : 'translateZ(80px)',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            boxShadow: '0 16px 36px -12px rgba(7, 42, 32, 0.75), 0 0 1px rgba(31, 90, 70, 0.6)',
          }}
          className="relative w-full max-w-[280px] -mt-5 sm:ml-auto z-30 bg-[#072A20]/95 backdrop-blur-sm border border-[#1F5A46] hover:border-[#2B6D56] rounded-[12px] p-3.5 flex items-center justify-between transition-colors duration-200 overflow-hidden"
        >
          {!shouldReduceMotion && (
            <div
              className="pointer-events-none absolute inset-0 rounded-[12px] transition-opacity duration-200"
              style={{
                background: `radial-gradient(300px circle at ${spotlight.x}% ${spotlight.y}%, rgba(201, 162, 75, 0.14), transparent 70%)`,
              }}
            />
          )}

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9DB5A8]">
              MATCH SCORE (DEMO)
            </div>
            <div className="font-serif text-4xl sm:text-5xl font-medium text-[#E5CB86] mt-1">
              92%
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block text-xs text-[#BFD0C6] border border-[#1F5A46] bg-[#114A39]/60 px-2.5 py-1 rounded-[4px]">
              Rule-based
            </span>
            <p className="text-[10px] text-[#9DB5A8] mt-1.5">Skills & experience match</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
