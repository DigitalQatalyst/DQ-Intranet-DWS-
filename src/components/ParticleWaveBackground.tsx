import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleWaveBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 8, 20);
    camera.lookAt(0, 0, 0);

    // Wave layer factory
    const createWave = (
      segments: number,
      particleSize: number,
      color: number,
      opacity: number,
      zOffset: number
    ) => {
      const geometry = new THREE.PlaneGeometry(50, 50, segments, segments);
      const positions = geometry.attributes.position.array as Float32Array;
      const originalPositions = new Float32Array(positions.length);
      originalPositions.set(positions);

      const material = new THREE.PointsMaterial({
        color,
        size: particleSize,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });

      const points = new THREE.Points(geometry, material);
      points.rotation.x = -Math.PI / 3; // -60deg perspective
      points.position.z = zOffset;

      return { points, geometry, originalPositions };
    };

    // Layer 1 — Coral/Orange (front, fastest)
    const layer1 = createWave(200, 0.08, 0xe85d4a, 0.8, 0);
    // Layer 2 — Purple (mid, medium)
    const layer2 = createWave(200, 0.05, 0x9b6ba8, 0.5, -5);
    // Layer 3 — Deep Blue (back, slowest)
    const layer3 = createWave(200, 0.04, 0x4361ee, 0.3, -10);

    scene.add(layer1.points);
    scene.add(layer2.points);
    scene.add(layer3.points);

    let time = 0;
    let animId: number;

    const animateLayer = (
      positions: Float32Array,
      original: Float32Array,
      freqX: number,
      freqY: number,
      freqXY: number,
      timeMultX: number,
      timeMultY: number,
      timeMultXY: number,
      ampA: number,
      ampB: number,
      ampC: number
    ) => {
      const count = positions.length / 3;
      for (let i = 0; i < count; i++) {
        const x = original[i * 3];
        const y = original[i * 3 + 1];
        positions[i * 3 + 2] =
          Math.sin(x * freqX + time * timeMultX) * ampA +
          Math.sin(y * freqY + time * timeMultY) * ampB +
          Math.sin((x + y) * freqXY + time * timeMultXY) * ampC;
      }
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.008;

      // Layer 1 — coral, fastest
      const pos1 = layer1.geometry.attributes.position.array as Float32Array;
      animateLayer(pos1, layer1.originalPositions, 0.3, 0.3, 0.2, 1, 1.2, 0.8, 1.5, 1.5, 2.0);
      layer1.geometry.attributes.position.needsUpdate = true;

      // Layer 2 — purple, medium
      const pos2 = layer2.geometry.attributes.position.array as Float32Array;
      animateLayer(pos2, layer2.originalPositions, 0.25, 0.25, 0.15, 0.7, 0.9, 0.6, 1.8, 1.8, 2.2);
      layer2.geometry.attributes.position.needsUpdate = true;

      // Layer 3 — blue, slowest
      const pos3 = layer3.geometry.attributes.position.array as Float32Array;
      animateLayer(pos3, layer3.originalPositions, 0.2, 0.2, 0.12, 0.5, 0.6, 0.4, 2.0, 2.0, 2.5);
      layer3.geometry.attributes.position.needsUpdate = true;

      // Gentle camera sway
      camera.position.x = Math.sin(time * 0.2) * 2;

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      layer1.geometry.dispose();
      layer2.geometry.dispose();
      layer3.geometry.dispose();
      (layer1.points.material as THREE.Material).dispose();
      (layer2.points.material as THREE.Material).dispose();
      (layer3.points.material as THREE.Material).dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
      aria-hidden="true"
    />
  );
};

export default ParticleWaveBackground;
