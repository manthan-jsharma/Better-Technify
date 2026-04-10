import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

// GLSL fragment shader for animated liquid effect (vivid orange, more liquid look)
const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec2 uMouse;
  varying vec2 vUv;

  // Simplex noise (2D) for more organic movement
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    // Move UVs for animation
    vec2 uv = vUv;
    float t = uTime * 0.18;
    // Mouse interaction: attract blobs toward mouse on hover
    float mouseDist = distance(uv, uMouse);
    float mouseEffect = exp(-mouseDist * 8.0); // Stronger near mouse

    // Larger, more liquid blobs
    float blob1 = noise(uv * 2.0 + t * 0.7 + uMouse * 2.5 * mouseEffect);
    float blob2 = noise(uv * 2.5 - t * 0.9 + 10.0 - uMouse * 2.0 * mouseEffect);
    float blob3 = noise(uv * 3.0 + t * 1.2 - 20.0 + uMouse * 3.0 * mouseEffect);
    float blobs = (blob1 + blob2 + blob3) / 3.0;

    // Softer, more blurred transitions for the blobs
    blobs = smoothstep(0.33, 0.77, blobs); // wider range for softer edge

    // Add some subtle movement and merging, with more blur
    float edge = smoothstep(0.36, 0.83, blobs + 0.2 * sin(t + uv.x * 2.0 + uv.y * 2.0));

    // Soft gradient overlay
    float grad = smoothstep(0.0, 1.0, uv.x) * 0.7 + smoothstep(0.0, 1.0, 1.0 - uv.y) * 0.3;

    // Blend between the base orange and a lighter orange for highlights
    vec3 base = uColor;
    vec3 highlight = mix(uColor, vec3(1.0, 0.6, 0.3), 0.7);
    vec3 color = mix(base, highlight, grad + edge * 0.9);

    // --- Extra blur: blend with color sampled at nearby UVs (soft glow)
    vec2 blurOffset = vec2(0.004, 0.004);
    float edgeBlur = smoothstep(0.36, 0.83, blobs + 0.2 * sin(t + (uv.x+blurOffset.x) * 2.0 + (uv.y+blurOffset.y) * 2.0));
    float gradBlur = smoothstep(0.0, 1.0, uv.x+blurOffset.x) * 0.7 + smoothstep(0.0, 1.0, 1.0 - (uv.y+blurOffset.y)) * 0.3;
    vec3 colorBlur = mix(base, highlight, gradBlur + edgeBlur * 0.9);
    color = mix(color, colorBlur, 0.45); // blend original with blurred version
    // --- END blur

    gl_FragColor = vec4(color, 1.0);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function LiquidMaterial({ mouse }: { mouse: [number, number] }) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  // Smooth interpolation for mouse
  const lastMouse = useRef<[number, number]>([0.5, 0.5]);
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      // Lerp mouse
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      lastMouse.current = [
        lerp(lastMouse.current[0], mouse[0], 0.08),
        lerp(lastMouse.current[1], mouse[1], 0.08),
      ];
      materialRef.current.uniforms.uMouse.value = new THREE.Vector2(
        lastMouse.current[0],
        lastMouse.current[1]
      );
    }
  });
  return (
    <shaderMaterial
      ref={materialRef}
      attach="material"
      args={[
        {
          uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color("#FF4502") }, // #FF4502
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          },
          vertexShader,
          fragmentShader,
        },
      ]}
    />
  );
}

const Shader: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className, style }) => {
  // Use SVG logical units for perfect fit
  const WIDTH = 1424;
  const HEIGHT = 534;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = React.useState<[number, number]>([0.5, 0.5]);
  const [hovered, setHovered] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  // On mount, check container size and set ready only when non-zero
  React.useLayoutEffect(() => {
    function checkSize() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setReady(true);
        } else {
          setReady(false);
        }
      }
    }
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // Mouse event handlers
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMouse([Math.min(Math.max(x, 0), 1), Math.min(Math.max(y, 0), 1)]);
  };
  const handlePointerEnter = () => setHovered(true);
  const handlePointerLeave = () => {
    setHovered(false);
    setMouse([0.5, 0.5]); // Reset to center
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
      onPointerMove={hovered ? handlePointerMove : undefined}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {ready && (
        <Canvas
          orthographic
          camera={{
            left: -WIDTH / 2,
            right: WIDTH / 2,
            top: HEIGHT / 2,
            bottom: -HEIGHT / 2,
            near: -1000,
            far: 1000,
            position: [0, 0, 10],
            zoom: 1,
          }}
          frameloop="always"
          dpr={[1, 2]}
          style={{ width: "100%", height: "100%" }}
        >
          <mesh position={[0, 0, 0]} scale={[1, 1, 1]}>
            <planeGeometry args={[WIDTH, HEIGHT, 64, 64]} />
            <LiquidMaterial mouse={mouse} />
          </mesh>
        </Canvas>
      )}
    </div>
  );
};

export default Shader;
