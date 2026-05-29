"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import { Points, Group, PointLight } from "three";
import { useReducedMotion } from "framer-motion";
import Bottle from "./Bottle";

function Particles({ reduce }: { reduce: boolean }) {
  const count = 80;
  const pointsRef = useRef<Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 7;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (reduce || !pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.04;
    pointsRef.current.rotation.x += delta * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#cd853f" size={0.025} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function DynamicLights({ reduce }: { reduce: boolean }) {
  const keyRef = useRef<PointLight>(null);
  const fillRef = useRef<PointLight>(null);

  useFrame((state) => {
    if (reduce) return;
    const t = state.clock.elapsedTime;
    if (keyRef.current) keyRef.current.intensity = 55 + Math.sin(t * 1.2) * 8;
    if (fillRef.current) fillRef.current.intensity = 18 + Math.sin(t * 0.7 + 1) * 5;
  });

  return (
    <>
      <ambientLight color="#2a1505" intensity={1.5} />
      <pointLight ref={keyRef} color="#cd853f" intensity={55} distance={14} position={[2, 3, 3]} />
      <pointLight ref={fillRef} color="#b06010" intensity={18} distance={10} position={[-3, 0, 2]} />
      <pointLight color="#f0c060" intensity={30} distance={9} position={[0, -2, -3]} />
    </>
  );
}

function ParallaxGroup({ reduce, children }: { reduce: boolean; children: React.ReactNode }) {
  const groupRef = useRef<Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduce) return;
    function handleMouse(e: MouseEvent) {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [reduce]);

  useFrame((_, delta) => {
    if (reduce || !groupRef.current) return;
    const lerpFactor = 1 - Math.pow(0.05, delta);
    target.current.x += (mouse.current.x - target.current.x) * lerpFactor;
    target.current.y += (mouse.current.y - target.current.y) * lerpFactor;
    groupRef.current.rotation.y = target.current.x * 0.25;
    groupRef.current.rotation.x = target.current.y * 0.10;
  });

  return <group ref={groupRef}>{children}</group>;
}

function HeroScene({ reduce }: { reduce: boolean }) {
  return (
    <>
      <DynamicLights reduce={reduce} />
      <ParallaxGroup reduce={reduce}>
        <Float
          speed={reduce ? 0 : 1.4}
          rotationIntensity={reduce ? 0 : 0.08}
          floatIntensity={reduce ? 0 : 0.35}
          floatingRange={[-0.08, 0.08]}
        >
          <Bottle />
        </Float>
        <Particles reduce={reduce} />
      </ParallaxGroup>
      <ContactShadows position={[0, -1.65, 0]} opacity={0.35} scale={4} blur={2.5} far={3} color="#cd853f" />
    </>
  );
}

export default function AzaharaHero() {
  const reduce = useReducedMotion() ?? false;
  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <HeroScene reduce={reduce} />
    </Canvas>
  );
}
