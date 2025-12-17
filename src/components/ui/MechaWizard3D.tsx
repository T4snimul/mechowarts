import { useRef, useMemo, Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles, Trail, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Mouse and touch tracking hook
function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setMouse({
          x: (touch.clientX / window.innerWidth) * 2 - 1,
          y: -(touch.clientY / window.innerHeight) * 2 + 1,
        });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setMouse({
          x: (touch.clientX / window.innerWidth) * 2 - 1,
          y: -(touch.clientY / window.innerHeight) * 2 + 1,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return mouse;
}

// Camera controller that follows mouse
function CameraController({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const { camera } = useThree();
  const targetX = useRef(0);
  const targetY = useRef(0);

  useFrame(() => {
    targetX.current += (mouseX * 0.5 - targetX.current) * 0.05;
    targetY.current += (mouseY * 0.3 - targetY.current) * 0.05;

    const radius = 4;
    const baseY = 1.5;

    camera.position.x = Math.sin(targetX.current) * radius;
    camera.position.y = baseY + targetY.current * 0.5;
    camera.position.z = Math.cos(targetX.current) * radius;

    camera.lookAt(0, 0.8, 0);
  });

  return null;
}

// Robot Arm Component
function RobotArm() {
  const armRef = useRef<THREE.Group>(null);
  const jointRef = useRef<THREE.Mesh>(null);
  const wandRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (armRef.current) {
      armRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.5) * 0.1;
    }
    if (jointRef.current) {
      jointRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.7) * 0.15;
    }
    if (wandRef.current) {
      wandRef.current.rotation.z = Math.sin(clock.elapsedTime * 2) * 0.3;
      wandRef.current.rotation.x = Math.cos(clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group ref={armRef} position={[0, -0.5, 0]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.3, 16]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0, 0.6, 0]}>
        <capsuleGeometry args={[0.15, 0.8, 8, 16]} />
        <meshStandardMaterial color="#6B7280" metalness={0.7} roughness={0.3} />
      </mesh>

      <mesh ref={jointRef} position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#06B6D4" metalness={0.5} roughness={0.3} emissive="#0891B2" emissiveIntensity={0.3} />
      </mesh>

      <mesh position={[0, 1.7, 0]}>
        <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
        <meshStandardMaterial color="#6B7280" metalness={0.7} roughness={0.3} />
      </mesh>

      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#06B6D4" metalness={0.5} roughness={0.3} emissive="#0891B2" emissiveIntensity={0.3} />
      </mesh>

      <group ref={wandRef} position={[0, 2.3, 0]}>
        <mesh position={[-0.08, 0.1, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.05, 0.2, 0.05]} />
          <meshStandardMaterial color="#4B5563" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.08, 0.1, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.05, 0.2, 0.05]} />
          <meshStandardMaterial color="#4B5563" metalness={0.7} roughness={0.3} />
        </mesh>
        <MagicWand />
      </group>
    </group>
  );
}

function MagicWand() {
  const sparkRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (sparkRef.current) {
      sparkRef.current.intensity = 2 + Math.sin(clock.elapsedTime * 5) * 1;
    }
  });

  return (
    <group position={[0, 0.35, 0]}>
      <mesh>
        <cylinderGeometry args={[0.02, 0.03, 0.5, 8]} />
        <meshStandardMaterial color="#78350F" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.025, 0.1, 8]} />
        <meshStandardMaterial color="#92400E" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#FCD34D" emissive="#F59E0B" emissiveIntensity={2} transparent opacity={0.9} />
      </mesh>
      <pointLight ref={sparkRef} position={[0, 0.3, 0]} color="#F59E0B" intensity={2} distance={3} />
      <Trail width={0.5} length={4} color="#F59E0B" attenuation={(t) => t * t}>
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
      </Trail>
    </group>
  );
}

function Gears() {
  const gear1Ref = useRef<THREE.Mesh>(null);
  const gear2Ref = useRef<THREE.Mesh>(null);
  const gear3Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (gear1Ref.current) gear1Ref.current.rotation.z = clock.elapsedTime * 0.5;
    if (gear2Ref.current) gear2Ref.current.rotation.z = -clock.elapsedTime * 0.7;
    if (gear3Ref.current) gear3Ref.current.rotation.z = clock.elapsedTime * 0.6;
  });

  const gearShape = useMemo(() => {
    const shape = new THREE.Shape();
    const teeth = 12;
    const innerRadius = 0.3;
    const outerRadius = 0.4;

    for (let i = 0; i < teeth; i++) {
      const angle = (i / teeth) * Math.PI * 2;
      const nextAngle = ((i + 0.5) / teeth) * Math.PI * 2;
      const nextNextAngle = ((i + 1) / teeth) * Math.PI * 2;

      if (i === 0) {
        shape.moveTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
      }

      shape.lineTo(Math.cos(nextAngle) * outerRadius, Math.sin(nextAngle) * outerRadius);
      shape.lineTo(Math.cos(nextAngle) * innerRadius, Math.sin(nextAngle) * innerRadius);
      shape.lineTo(Math.cos(nextNextAngle) * innerRadius, Math.sin(nextNextAngle) * innerRadius);
      shape.lineTo(Math.cos(nextNextAngle) * outerRadius, Math.sin(nextNextAngle) * outerRadius);
    }

    return shape;
  }, []);

  const extrudeSettings = { depth: 0.08, bevelEnabled: false };

  return (
    <group>
      <mesh ref={gear1Ref} position={[-0.8, 0.5, -0.5]}>
        <extrudeGeometry args={[gearShape, extrudeSettings]} />
        <meshStandardMaterial color="#4B5563" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.8, 0.5, -0.46]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#06B6D4" metalness={0.6} roughness={0.3} emissive="#0891B2" emissiveIntensity={0.2} />
      </mesh>
      <mesh ref={gear2Ref} position={[1, 1, -0.3]} scale={0.7}>
        <extrudeGeometry args={[gearShape, extrudeSettings]} />
        <meshStandardMaterial color="#6B7280" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh ref={gear3Ref} position={[-0.5, 2, 0.3]} scale={0.5} rotation={[Math.PI / 4, 0, 0]}>
        <extrudeGeometry args={[gearShape, extrudeSettings]} />
        <meshStandardMaterial color="#9CA3AF" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function MagicOrb() {
  const orbRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (orbRef.current) {
      orbRef.current.rotation.y = clock.elapsedTime * 0.3;
      orbRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={orbRef} position={[0.8, 1.8, 0.5]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <MeshDistortMaterial color="#8B5CF6" distort={0.3} speed={3} roughness={0.1} metalness={0.3} emissive="#7C3AED" emissiveIntensity={0.5} />
      </mesh>
    </Float>
  );
}

function CircuitLines() {
  const points1 = useMemo(() => [
    new THREE.Vector3(-1.5, -0.5, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(-0.5, 0, 0.3),
    new THREE.Vector3(0, 0.5, 0),
  ], []);

  const points2 = useMemo(() => [
    new THREE.Vector3(1.5, -0.3, 0.2),
    new THREE.Vector3(1, 0.2, 0),
    new THREE.Vector3(0.5, 0.5, -0.2),
  ], []);

  return (
    <group>
      <Line points={points1} color="#06B6D4" />
      <Line points={points2} color="#06B6D4" />
      {[[-1.5, -0.5, 0], [-1, 0, 0], [1.5, -0.3, 0.2], [0.5, 0.5, -0.2]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#06B6D4" emissive="#0891B2" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Line({ points, color }: { points: THREE.Vector3[]; color: string }) {
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial attach="material" color={color} />
    </line>
  );
}

function Scene({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <>
      <CameraController mouseX={mouseX} mouseY={mouseY} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#8B5CF6" />
      <pointLight position={[0, 3, 2]} intensity={0.5} color="#06B6D4" />
      <Environment preset="city" />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <group>
          <RobotArm />
          <Gears />
          <MagicOrb />
          <CircuitLines />
        </group>
      </Float>

      <Sparkles count={50} scale={4} size={2} speed={0.4} color="#F59E0B" opacity={0.6} />
      <Sparkles count={30} scale={4} size={1.5} speed={0.3} color="#8B5CF6" opacity={0.5} />
    </>
  );
}

function Loader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
    </div>
  );
}

function ErrorFallback({ onReload, mouseX, mouseY }: { onReload: () => void; mouseX: number; mouseY: number }) {
  // Calculate subtle movement based on mouse position
  const offsetX = mouseX * 15;
  const offsetY = mouseY * 15;
  const rotateX = mouseY * 10;
  const rotateY = mouseX * 10;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-xl overflow-hidden relative">
      {/* Animated 2D fallback that follows cursor */}
      <div
        className="relative transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${offsetX}px, ${offsetY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        {/* Main magical orb */}
        <div className="relative">
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-500/30 blur-2xl animate-pulse"
            style={{ animationDuration: '3s' }}
          />

          {/* Main orb */}
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 via-indigo-500 to-purple-700 shadow-2xl shadow-purple-500/50">
            {/* Inner glow */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-400/50 to-transparent" />

            {/* Gear icon in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="text-5xl"
                style={{
                  animation: 'spin 8s linear infinite',
                  filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.8))',
                }}
              >
                ⚙️
              </div>
            </div>

            {/* Sparkle accents */}
            <div className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>✨</div>
            <div className="absolute -bottom-1 -left-1 text-xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}>⚡</div>
            <div className="absolute top-0 left-1/4 text-lg animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>🔮</div>
          </div>

          {/* Orbiting wand */}
          <div
            className="absolute -right-8 top-1/2 text-3xl"
            style={{
              animation: 'float 4s ease-in-out infinite',
            }}
          >
            🪄
          </div>
        </div>
      </div>

      <p className="text-gray-500 dark:text-gray-400 text-center mt-4">
        <span className="block text-lg font-medium mb-1">The magic fizzled out...</span>
        <span className="text-sm opacity-75">But this enchanted orb still works!</span>
      </p>
      <button
        onClick={onReload}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Try 3D Again
      </button>

      {/* CSS keyframes for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-15deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

interface MechaWizard3DProps {
  className?: string;
}

export function MechaWizard3D({ className = '' }: MechaWizard3DProps) {
  const mouse = useMousePosition();
  const [key, setKey] = useState(0);
  const [hasError, setHasError] = useState(false);

  const handleReload = useCallback(() => {
    setHasError(false);
    setKey((prev) => prev + 1);
  }, []);

  if (hasError) {
    return (
      <div className={`w-full h-full relative ${className}`} style={{ minHeight: '400px' }}>
        <ErrorFallback onReload={handleReload} mouseX={mouse.x} mouseY={mouse.y} />
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative ${className}`} style={{ minHeight: '400px' }}>
      <Suspense fallback={<Loader />}>
        <Canvas
          key={key}
          camera={{ position: [0, 1.5, 4], fov: 50, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
          onError={() => setHasError(true)}
        >
          <Scene mouseX={mouse.x} mouseY={mouse.y} />
        </Canvas>
      </Suspense>
      <button
        onClick={handleReload}
        className="absolute bottom-2 right-2 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors opacity-50 hover:opacity-100"
        title="Reload 3D Model"
      >
        <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
}
