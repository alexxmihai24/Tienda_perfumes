"use client";

import { useRef } from "react";
import { Group } from "three";

interface BottleProps {
  color?: string;
}

export default function Bottle({ color }: BottleProps) {
  const groupRef = useRef<Group>(null);
  const glassColor = color ?? "#1a0e05";

  return (
    <group ref={groupRef}>
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.60, 2.20, 64, 1, false]} />
        <meshPhysicalMaterial
          color={glassColor}
          transmission={0.65}
          ior={1.52}
          thickness={0.90}
          roughness={0.15}
          metalness={0}
          attenuationColor="#cd853f"
          attenuationDistance={0.8}
          transparent={true}
          opacity={0.92}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh castShadow position={[0, 1.12, 0]}>
        <cylinderGeometry args={[0.28, 0.50, 0.48, 48, 1, false]} />
        <meshPhysicalMaterial
          color={glassColor}
          transmission={0.65}
          ior={1.52}
          thickness={0.70}
          roughness={0.15}
          metalness={0}
          attenuationColor="#cd853f"
          attenuationDistance={0.8}
          transparent={true}
          opacity={0.92}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh castShadow position={[0, 1.44, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.32, 32, 1, false]} />
        <meshPhysicalMaterial
          color={glassColor}
          transmission={0.60}
          ior={1.52}
          thickness={0.50}
          roughness={0.12}
          metalness={0}
          attenuationColor="#cd853f"
          attenuationDistance={0.8}
          transparent={true}
          opacity={0.94}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh castShadow position={[0, 1.85, 0]}>
        <cylinderGeometry args={[0.30, 0.30, 0.55, 32, 1, false]} />
        <meshPhysicalMaterial
          color="#cd853f"
          metalness={1}
          roughness={0.25}
          envMapIntensity={1.5}
        />
      </mesh>
      <mesh castShadow position={[0, 2.125, 0]}>
        <sphereGeometry args={[0.30, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshPhysicalMaterial
          color="#cd853f"
          metalness={1}
          roughness={0.25}
          envMapIntensity={1.5}
        />
      </mesh>
      <mesh castShadow position={[0, 1.60, 0]}>
        <cylinderGeometry args={[0.265, 0.265, 0.06, 32, 1, false]} />
        <meshPhysicalMaterial
          color="#f0b060"
          metalness={1}
          roughness={0.18}
          envMapIntensity={1.8}
        />
      </mesh>
      <mesh castShadow position={[0, -1.16, 0]}>
        <cylinderGeometry args={[0.62, 0.58, 0.12, 48, 1, false]} />
        <meshPhysicalMaterial
          color="#cd853f"
          metalness={0.90}
          roughness={0.22}
          envMapIntensity={1.4}
        />
      </mesh>
    </group>
  );
}
