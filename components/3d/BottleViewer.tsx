"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import { Group, PointLight } from "three";
import { useReducedMotion } from "framer-motion";
import Bottle from "./Bottle";

interface BottleViewerProps {
  color?: string;
}

function ViewerScene({ color, reduce }: { color?: string; reduce: boolean }) {
  const groupRef = useRef<Group>(null);
  const keyRef = useRef<PointLight>(null);
  const isInteracting = useRef(false);
  const idleT = useRef(0);

  useFrame((_, delta) => {
    idleT.current += delta;
    if (!groupRef.current) return;
    if (!isInteracting.current && !reduce) {
      groupRef.current.rotation.y += delta * 0.25;
    }
    if (keyRef.current) {
      keyRef.current.intensity = reduce ? 50 : 50 + Math.sin(idleT.current * 1.0) * 6;
    }
  });

  function handleStart() { isInteracting.current = true; }
  function handleEnd() { isInteracting.current = false; }

  return (
    <>
      <ambientLight color="#2a1505" intensity={1.4} />
      <pointLight ref={keyRef} color="#cd853f" intensity={50} distance={12} position={[2, 3, 3]} />
      <pointLight color="#b06010" intensity={20} distance={10} position={[-3, 1, 2]} />
      <pointLight color="#f0c060" intensity={25} distance={8} position={[0, -2, -2]} />

      <Environment preset="city" />

      <group ref={groupRef}>
        <Bottle color={color} />
      </group>

      <ContactShadows
        position={[0, -1.65, 0]}
        opacity={0.40}
        scale={4}
        blur={2.5}
        far={3}
        color="#cd853f"
      />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3.5}
        maxDistance={9}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.75}
        onStart={handleStart}
        onEnd={handleEnd}
        makeDefault
      />
    </>
  );
}

export default function BottleViewer({ color }: BottleViewerProps) {
  const reduce = useReducedMotion() ?? false;
  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      camera={{ position: [0, 0.5, 5.5], fov: 42 }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <ViewerScene color={color} reduce={reduce} />
    </Canvas>
  );
}
