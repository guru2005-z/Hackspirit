import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ScrollingTreeData {
  id: number;
  x: number;
  z: number;
  color: string;
  height: number;
  radius: number;
}

// Neon Wireframe Pine Tree / Tower Component
function WireframeTree({
  position,
  color,
  height,
  radius,
  rotationY = 0,
}: {
  position: [number, number, number];
  color: string;
  height: number;
  radius: number;
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Outer Glowing Wireframe Cone */}
      <mesh>
        <coneGeometry args={[radius, height, 4, 3, true]} />
        <meshBasicMaterial color={color} wireframe={true} transparent opacity={0.9} />
      </mesh>
      
      {/* Inner slightly smaller cone for depth */}
      <mesh scale={[0.85, 0.85, 0.85]}>
        <coneGeometry args={[radius, height, 4, 3, true]} />
        <meshBasicMaterial color={color} wireframe={true} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// Twinkling Space Stars Background
function Stars() {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors, sizes] = useMemo(() => {
    const count = 950;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    
    const starColors = [
      new THREE.Color("#ffffff"), // Pure white
      new THREE.Color("#e0f2fe"), // Cool light blue
      new THREE.Color("#f0fdfa"), // Ice teal
      new THREE.Color("#faf5ff"), // Soft purple
      new THREE.Color("#fef3c7"), // Soft warm amber
    ];

    for (let i = 0; i < count; i++) {
      // Distribute stars spherically around the scene
      const theta = Math.random() * Math.PI;
      const phi = Math.random() * Math.PI * 2;
      const radius = 25 + Math.random() * 20;

      pos[i * 3] = Math.sin(theta) * Math.cos(phi) * radius;
      pos[i * 3 + 1] = Math.cos(theta) * radius + 2.0; // keep above grid
      pos[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * radius - 12;

      // Choose a random star color
      const colorChosen = starColors[Math.floor(Math.random() * starColors.length)];
      col[i * 3] = colorChosen.r;
      col[i * 3 + 1] = colorChosen.g;
      col[i * 3 + 2] = colorChosen.b;

      // Layered sizes: combines thin (0.04) and thick (0.26) stars
      sz[i] = 0.04 + Math.random() * 0.22;
    }
    return [pos, col, sz];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Slow night-sky orbital rotations
    pointsRef.current.rotation.y = time * 0.007;
    pointsRef.current.rotation.x = time * 0.003;

    // Twinkling effect: oscillate sizes slightly
    const geometry = pointsRef.current.geometry;
    const sizeAttr = geometry.attributes.size;
    if (sizeAttr) {
      const arr = sizeAttr.array as Float32Array;
      for (let i = 0; i < arr.length; i++) {
        arr[i] = sizes[i] * (0.65 + Math.sin(time * 3.5 + i * 0.4) * 0.35);
      }
      sizeAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors={true}
        size={0.16}
        sizeAttenuation={true}
        transparent
        opacity={0.85}
      />
    </points>
  );
}

// Scene controller managing scrolling grid, central tower bunch, and flowing side trees
function SceneContent() {
  const gridRef = useRef<THREE.GridHelper>(null);
  const centralGroupRef = useRef<THREE.Group>(null);
  const scrollingGroupRef = useRef<THREE.Group>(null);

  const speed = 7.6; // scrolling speed of the grid and side trees
  const gridCellSpacing = 2.0; // grid size / divisions
  const forestLength = 30; // Z depth for side trees

  const neonColors = ["#f97316", "#a855f7", "#00f0ff", "#14b8a6", "#3b82f6", "#eab308"];

  // 1. Tightly grouped central towers sitting on the horizon (Bunch)
  const centralTowers = useMemo(() => {
    return [
      { id: 0, x: 0, z: -13.0, color: "#3b82f6", height: 3.4, radius: 1.05 },     // Center - Tall Royal Blue
      { id: 1, x: -1.2, z: -12.5, color: "#a855f7", height: 2.8, radius: 0.85 },  // Left-Center - Violet
      { id: 2, x: 1.2, z: -12.5, color: "#f97316", height: 2.5, radius: 0.75 },   // Right-Center - Orange
      { id: 3, x: -2.2, z: -13.4, color: "#eab308", height: 2.0, radius: 0.65 },  // Far Left - Yellow/Gold
      { id: 4, x: 2.2, z: -13.4, color: "#14b8a6", height: 2.2, radius: 0.70 }    // Far Right - Teal
    ];
  }, []);

  // 2. Side-scrolling trees that fly past on the left and right (Flow)
  const scrollingTowers = useMemo(() => {
    const arr: ScrollingTreeData[] = [];
    const count = 10;

    for (let i = 0; i < count; i++) {
      const isLeft = i % 2 === 0;
      // Distribute x positions strictly outside the center grid path
      const x = isLeft
        ? -3.8 - Math.random() * 4.5
        : 3.8 + Math.random() * 4.5;
      
      const z = (Math.random() - 0.8) * forestLength; // distribute from camera to horizon
      const color = neonColors[i % neonColors.length];
      const height = 2.0 + Math.random() * 1.8;
      const radius = 0.65 + Math.random() * 0.5;

      arr.push({ id: i, x, z, color, height, radius });
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // A. Scroll infinite grid (Ground Flow)
    if (gridRef.current) {
      gridRef.current.position.z = (time * speed) % gridCellSpacing;
    }

    // B. Animate central towers in place (Y-rotation & vertical float - Central Bunch Flow)
    if (centralGroupRef.current) {
      const children = centralGroupRef.current.children;
      for (let i = 0; i < centralTowers.length; i++) {
        const tower = centralTowers[i];
        const mesh = children[i] as THREE.Group;
        if (!mesh) continue;

        // Slow spin
        mesh.rotation.y = time * 0.16 + tower.id * 0.45;
        
        // Gentle vertical breathe
        mesh.position.y = -3.2 + tower.height / 2 + Math.sin(time * 1.5 + tower.id * 0.6) * 0.12;
      }
    }

    // C. Scroll side towers towards the camera (Side Flow)
    if (scrollingGroupRef.current) {
      const children = scrollingGroupRef.current.children;
      for (let i = 0; i < scrollingTowers.length; i++) {
        const tower = scrollingTowers[i];
        const mesh = children[i] as THREE.Group;
        if (!mesh) continue;

        tower.z += speed * delta;

        // Wrap side tower back to horizon if it passes behind the camera
        if (tower.z > 6.0) {
          tower.z = -forestLength;
          // Randomize side position slightly for organic variety
          const isLeft = i % 2 === 0;
          tower.x = isLeft
            ? -3.8 - Math.random() * 4.5
            : 3.8 + Math.random() * 4.5;
        }

        mesh.position.z = tower.z;
        mesh.position.x = tower.x;
        mesh.position.y = -3.2 + tower.height / 2 + Math.sin(time * 0.5 + tower.id) * 0.05; // slight organic sway
        mesh.rotation.y = time * 0.1 + tower.id * 0.3; // slow rotation as they fly past
      }
    }

    // D. Camera tilt parallax guided by mouse coordinates
    const targetCamX = state.mouse.x * 1.25;
    const targetCamY = state.mouse.y * 0.85;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY, 0.04);
    state.camera.lookAt(0, -0.8 + state.mouse.y * 1.2, -12);
  });

  return (
    <>
      <Stars />

      {/* Cyber Grid Plane on the ground */}
      <gridHelper
        ref={gridRef}
        args={[80, 40, "#00f0ff", "#083344"]}
        position={[0, -3.2, 0]}
      />

      {/* 1. Central grouped towers (Bunch) */}
      <group ref={centralGroupRef}>
        {centralTowers.map((t) => (
          <WireframeTree
            key={`central-${t.id}`}
            position={[t.x, -3.2 + t.height / 2, t.z]}
            color={t.color}
            height={t.height}
            radius={t.radius}
          />
        ))}
      </group>

      {/* 2. Side scrolling towers (Flow) */}
      <group ref={scrollingGroupRef}>
        {scrollingTowers.map((t) => (
          <WireframeTree
            key={`scroll-${t.id}`}
            position={[t.x, -3.2 + t.height / 2, t.z]}
            color={t.color}
            height={t.height}
            radius={t.radius}
          />
        ))}
      </group>
    </>
  );
}

// Fallback spinner during canvas lazy initialization
const CanvasLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-[#070512]">
    <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
  </div>
);

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-[#070512] overflow-hidden pointer-events-none">
      {/* 3D WebGL Canvas */}
      <Suspense fallback={<CanvasLoader />}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5.0], fov: 60 }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: false,
          }}
          className="w-full h-full animate-fade-in"
        >
          <SceneContent />
        </Canvas>
      </Suspense>

      {/* Synthwave sky color gradient overlay (Deep purple top to teal/cyan bottom horizon) */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, rgba(13, 6, 20, 0.94) 0%, rgba(13, 6, 20, 0.8) 40%, rgba(3, 10, 22, 0.6) 70%, rgba(8, 26, 46, 0.3) 100%)",
        }}
      />
    </div>
  );
}
