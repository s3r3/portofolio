// components/SplashScreen.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls, Points, PointMaterial, Box } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";

interface SplashScreenProps {
  onComplete: () => void;
}

function RotatingTextRing({
  text,
  radius,
  fontSize,
  y,
  delay = 0,
  exitDelay = 0,
  fontWeight = "normal",
  direction = "right",
  spacing = 10,
}: {
  text: string;
  radius: number;
  fontSize: number;
  y: number;
  delay?: number;
  exitDelay?: number;
  fontWeight?: "normal" | "bold";
  direction?: "left" | "right";
  spacing?: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const chars = text.split("");
  const speed = direction === "left" ? -0.01 : 0.01;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += speed;
    }
  });

  useEffect(() => {
    if (groupRef.current) {
      gsap.fromTo(
        groupRef.current.position,
        { y: y - 5 },
        {
          y: y,
          ease: "power4.out",
          duration: 1.5,
          delay,
        }
      );
    }
  }, [y, delay]);

  return (
    <group ref={groupRef} position={[0, y, 0]}>
      {chars.map((char, i) => {
        const angle = (i / chars.length) * Math.PI * -2 * spacing;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <Text
            key={i}
            position={[x, 0, z]}
            rotation={[0, -100, 0]}
            fontSize={fontSize}
            fontWeight={fontWeight}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {char}
          </Text>
  );
      })}
    </group>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null!);
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const particles = Array.from({ length: 1000 }, () => ({
    position: new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    ),
  }));
  return (
    <Points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(
            particles.flatMap((particle) => [
              particle.position.x,
              particle.position.y,
              particle.position.z,
            ])
          )}
          count={particles.length}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial size={0.05} color="#000000" />
    </Points>
  );
}

function AnimatedBox() {
  const boxRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (boxRef.current) {
      boxRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      boxRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Box ref={boxRef} args={[2, 2, 2]}>
      <meshStandardMaterial attach="material" color="hotpink" />
    </Box>
  );
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const container = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to({}, {
        duration: 3,
        ease: "power1.inOut",
        onUpdate: function () {
          const p = Math.round((this.progress() as number) * 100);
          setProgress(p);
        },
        onComplete: () => {
          gsap.to(container.current, {
            opacity: 0,
            duration: 0.8,
            delay: 1.2,
            onComplete: onComplete,
          });
        },
      });
    }, container);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={container}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <div className="w-[500px] h-[500px]">
        <Canvas camera={{ position: [0, 0, 20] }}>
          <ambientLight intensity={1} />
          <OrbitControls enableZoom={false} enablePan={false} />
          <Particles />
          <AnimatedBox />
          <RotatingTextRing
            text="• MUHAMMAD • FARID •"
            radius={9}
            fontSize={1.3}
            y={1}
            delay={0.2}
            fontWeight="bold"
            direction="left"
            spacing={0.4}
          />
          <RotatingTextRing
            text="UX/UI • BRANDING • PRODUCT • "
            radius={4}
            fontSize={0.4}
            y={-1.5}
            delay={0.5}
            direction="left"
            spacing={0.3}
          />
          <Text
            fontSize={0.6}
            color="black"
            anchorX="center"
            anchorY="middle"
            position={[0, -4, 0]}
          >
            {progress}%
          </Text>
        </Canvas>
      </div>
    </div>
  );
}
