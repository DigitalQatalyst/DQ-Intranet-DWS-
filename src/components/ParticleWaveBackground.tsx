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

    // Wave geometry factory
    const createWave = (size: number, particleSize: number, color: number, opacity: number) => {
      const geometry = new THREE.PlaneGeometry(40, 40, size, size);
      const positions = geometry.attributes.position.array as Float32Array;
      // store original y for animation
      const originalY = new Float32Array(positions.length / 3);
      for (let i = 0; i < positions.length / 3; i++) {
        originalY[i] = positions[i * 3 + 1];
      }
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
      points.rotation.x = -Math.PI / 3; // -60deg
      return { points, geometry, originalY };
    };

    const wave1 = createWave(200, 0.08, 0x06b6d4, 0.8);
    const wave2 = createWave(150, 0.05, 0x3b82f6, 0.4);
    wave2.points.position.z = -5;

    scene.add(wave1.points);
    scene.add(wave2.points);

    let time = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.008;

      // Animate wave1
      const pos1 = wave1.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pos1.length / 3; i++) {
        const x = pos1[i * 3];
        const y = wave1.originalY[i];
        pos1[i * 3 + 2] =
          Math.sin(x * 0.3 + time) * 1.5 +
          Math.sin(y * 0.3 + time) * 1.5 +
          Math.sin((x + y) * 0.2 + time) * 2.5;
      }
      wave1.geometry.attributes.position.needsUpdate = true;

      // Animate wave2
      const pos2 = wave2.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pos2.length / 3; i++) {
        const x = pos2[i * 3];
        const y = wave2.originalY[i];
        pos2[i * 3 + 2] =
          Math.sin(x * 0.3 + time + 1) * 1.5 +
          Math.sin(y * 0.3 + time + 1) * 1.5 +
          Math.sin((x + y) * 0.2 + time + 1) * 2.0;
      }
      wave2.geometry.attributes.position.needsUpdate = true;

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
      wave1.geometry.dispose();
      wave2.geometry.dispose();
      (wave1.points.material as THREE.Material).dispose();
      (wave2.points.material as THREE.Material).dispose();
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
