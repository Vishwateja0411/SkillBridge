import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BridgeSvgFallback } from './BridgeSvgFallback';

// Check WebGL availability safely
function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

interface BridgeMeshProps {
  pointCount: number;
  reducedMotion: boolean;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}

const BridgeMesh: React.FC<BridgeMeshProps> = ({ pointCount, reducedMotion, mouseRef }) => {
  const groupRef = useRef<THREE.Group>(null);
  const pulsePointsRef = useRef<THREE.Points>(null);

  // 1. Generate arched bridge points and connections ONCE
  const { positions, colors, linePositions, connectionPairs } = useMemo(() => {
    const pos: number[] = [];
    const cols: number[] = [];
    const colorPalette = [
      new THREE.Color('#C9A24B'), // Gold
      new THREE.Color('#E5CB86'), // Light Gold
      new THREE.Color('#F6F1E4'), // Ivory
    ];

    // Generate points along an architectural shallow arch spanning the right 2/3
    const rawPoints: THREE.Vector3[] = [];
    for (let i = 0; i < pointCount; i++) {
      // t ranges from -1.1 to 1.1 across the arch
      const t = (i / (pointCount - 1)) * 2.2 - 1.1;
      
      // Main catenary / parabolic arch with dual chords
      const isUpperChord = i % 2 === 0;
      const heightMultiplier = isUpperChord ? 1.35 : 0.85;
      const archY = Math.max(0, (1.25 - t * t * 0.95) * heightMultiplier) - 0.45;
      
      // Dispersion and 3D depth jitter
      const jitterX = (Math.sin(i * 12.3) * 0.12);
      const jitterY = (Math.cos(i * 7.7) * 0.12);
      const jitterZ = (Math.sin(i * 5.1) * 0.85);

      // Offset slightly to the right to frame the hero cards beautifully
      const x = t * 3.8 + 1.2 + jitterX;
      const y = archY + jitterY;
      const z = jitterZ;

      pos.push(x, y, z);
      rawPoints.push(new THREE.Vector3(x, y, z));

      // Color distribution (60% Gold, 30% Light Gold, 10% Ivory)
      const rand = Math.abs(Math.sin(i * 9.2));
      const col = rand > 0.4 ? colorPalette[0] : rand > 0.1 ? colorPalette[1] : colorPalette[2];
      cols.push(col.r, col.g, col.b);
    }

    // Connect close neighbors with thin structural lines
    const lineCoords: number[] = [];
    const pairs: [THREE.Vector3, THREE.Vector3][] = [];
    const maxDistance = 0.95;

    for (let i = 0; i < rawPoints.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < rawPoints.length; j++) {
        const d = rawPoints[i].distanceTo(rawPoints[j]);
        if (d < maxDistance && connections < 4) {
          lineCoords.push(
            rawPoints[i].x, rawPoints[i].y, rawPoints[i].z,
            rawPoints[j].x, rawPoints[j].y, rawPoints[j].z
          );
          pairs.push([rawPoints[i], rawPoints[j]]);
          connections++;
        }
      }
    }

    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(cols),
      linePositions: new Float32Array(lineCoords),
      connectionPairs: pairs,
    };
  }, [pointCount]);

  // Point geometry & Line geometry
  const pointsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  const linesGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    return geo;
  }, [linePositions]);

  // Pulse particles that travel along connection lines
  const pulseCount = 3;
  const pulsePositions = useMemo(() => new Float32Array(pulseCount * 3), [pulseCount]);
  const pulseGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
    return geo;
  }, [pulsePositions]);

  // Pulse animation tracking
  const pulseState = useRef<{ pairIndex: number; progress: number; speed: number }[]>([
    { pairIndex: 0, progress: 0, speed: 0.35 },
    { pairIndex: Math.floor(connectionPairs.length / 3), progress: 0.3, speed: 0.4 },
    { pairIndex: Math.floor((connectionPairs.length * 2) / 3), progress: 0.7, speed: 0.3 },
  ]);

  // Clean disposal on unmount
  useEffect(() => {
    return () => {
      pointsGeo.dispose();
      linesGeo.dispose();
      pulseGeo.dispose();
    };
  }, [pointsGeo, linesGeo, pulseGeo]);

  // Animation frame loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      // 1. Slow continuous rotation around Y axis (one full rotation every ~80 seconds)
      groupRef.current.rotation.y += delta * 0.075;

      // 2. Gentle mouse parallax
      const targetRotX = mouseRef.current.y * 0.05;
      const targetRotY = groupRef.current.rotation.y + mouseRef.current.x * 0.05;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);

      // 3. Update traveling light pulses
      if (connectionPairs.length > 0 && pulsePointsRef.current) {
        const posAttr = pulsePointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
        
        pulseState.current.forEach((p, idx) => {
          p.progress += delta * p.speed;
          if (p.progress >= 1) {
            p.progress = 0;
            p.pairIndex = (p.pairIndex + 7) % connectionPairs.length;
          }

          const pair = connectionPairs[p.pairIndex];
          if (pair) {
            const start = pair[0];
            const end = pair[1];
            const curX = THREE.MathUtils.lerp(start.x, end.x, p.progress);
            const curY = THREE.MathUtils.lerp(start.y, end.y, p.progress);
            const curZ = THREE.MathUtils.lerp(start.z, end.z, p.progress);

            posAttr.setXYZ(idx, curX, curY, curZ);
          }
        });
        posAttr.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Bridge Node Points */}
      <points geometry={pointsGeo}>
        <pointsMaterial
          size={0.065}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* 2. Thin Connecting Structural Lines */}
      <lineSegments geometry={linesGeo}>
        <lineBasicMaterial
          color="#C9A24B"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </lineSegments>

      {/* 3. Occasional Travelling Light Pulses */}
      {!reducedMotion && connectionPairs.length > 0 && (
        <points ref={pulsePointsRef} geometry={pulseGeo}>
          <pointsMaterial
            size={0.11}
            color="#E5CB86"
            transparent
            opacity={0.9}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
};

export const BridgeScene: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Check WebGL, device concurrency, and reduced motion
  const { reducedMotion, isMobile, shouldFallback } = useMemo(() => {
    const rm = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const lowPower = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency ?? 8) <= 4;
    return {
      reducedMotion: rm,
      isMobile: mobile,
      shouldFallback: mobile && lowPower,
    };
  }, []);

  useEffect(() => {
    if (!isWebGLSupported() || shouldFallback) {
      setHasWebGL(false);
      return;
    }

    // Intersection Observer to pause rendering when hero is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Visibility change (pause when tab hidden)
    const handleVis = () => {
      if (document.hidden) setIsVisible(false);
      else if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setIsVisible(rect.bottom > 0 && rect.top < window.innerHeight);
      }
    };
    document.addEventListener('visibilitychange', handleVis);

    // Subtle pointer parallax listener
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVis);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile, shouldFallback]);

  if (!hasWebGL || hasError) {
    return <BridgeSvgFallback className={className} />;
  }

  // Point count: 160 on desktop, 60 on mobile (60% reduction)
  const pointCount = isMobile ? 60 : 160;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
    >
      <Suspense fallback={<BridgeSvgFallback />}>
        <Canvas
          dpr={[1, 1.5]}
          frameloop={isVisible ? 'always' : 'never'}
          camera={{ position: [0, 0, 4.8], fov: 48 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'low-power',
          }}
          onCreated={({ gl, scene }) => {
            gl.setClearColor(0x000000, 0); // Transparent canvas
            scene.fog = new THREE.FogExp2('#0B3D2E', 0.12); // Subtle distance falloff to emerald
          }}
          onError={() => setHasError(true)}
          style={{ pointerEvents: 'none', width: '100%', height: '100%' }}
        >
          <BridgeMesh
            pointCount={pointCount}
            reducedMotion={reducedMotion}
            mouseRef={mouseRef}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default BridgeScene;
