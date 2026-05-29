"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Group, PointLight } from "three";
import Bottle from "./Bottle";

export interface Story {
  label: string;
  heading: string[];
  body: string;
}

export const storyData: Story[] = [
  {
    label: "Ambre Noir",
    heading: ["El arte del", "oud profundo"],
    body: "Oud de Laos, ambar gris y sandalo de Mysore. Una composicion que evoluciona sobre la piel durante mas de doce horas.",
  },
  {
    label: "Santal Mystique",
    heading: ["Calidez", "envolvente"],
    body: "Sandalo de Mysore, cedro del Atlas y vainilla Bourbon. Sensorial y envolvente, permanece hasta el amanecer.",
  },
  {
    label: "Oud Imperial",
    heading: ["La firma de", "los ateliers"],
    body: "Oud de primera extraccion, rosa de Taif y nagarmotha. La composicion mas preciada de la casa.",
  },
];

function StoryBottle({ progress }: { progress: number }) {
  const groupRef = useRef<Group>(null);
  const keyRef = useRef<PointLight>(null);
  const localT = useRef(0);

  useFrame((_, delta) => {
    localT.current += delta;
    if (!groupRef.current) return;
    const targetY = progress * Math.PI * 4;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.08;
    groupRef.current.rotation.x = Math.sin(progress * Math.PI) * 0.18;
    groupRef.current.position.y = Math.sin(localT.current * 0.7) * 0.05;
    if (keyRef.current) {
      keyRef.current.intensity = 75 + Math.sin(localT.current * 1.1) * 10;
    }
  });

  return (
    <>
      <ambientLight color="#2a1505" intensity={1.2} />
      <pointLight ref={keyRef} color="#cd853f" intensity={75} distance={16} position={[3, 4, 4]} />
      <pointLight color="#804010" intensity={25} distance={10} position={[-4, 0, 3]} />
      <pointLight color="#f0a030" intensity={40} distance={9} position={[0, -3, -2]} />
      <group ref={groupRef} position={[1.5, 0, 0]}>
        <Bottle />
      </group>
      <ContactShadows position={[1.5, -1.65, 0]} opacity={0.28} scale={3.5} blur={2} far={3} color="#cd853f" />
    </>
  );
}

export function ScrollBottle({ progress }: { progress: number }) {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.5], fov: 38 }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "transparent" }}
    >
      <StoryBottle progress={progress} />
    </Canvas>
  );
}
