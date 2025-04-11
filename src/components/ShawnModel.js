import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const ShawnModel = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // 1. Setup scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000');

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    // Adjust camera position to get the desired view of the model
    camera.position.set(0, 1, 3.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    mountRef.current.appendChild(renderer.domElement);

    // 2. Add lights to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // 3. Load the GLB model
    const loader = new GLTFLoader();
    loader.load(
      '/models/realistic_human_heart.glb', // Ensure the model file exists at this path in public/models/
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Adjust model position and scale for optimal display
        model.position.set(0, 0.8, 0);
        model.scale.set(1.5, 1.5, 1.5);
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the model:', error);
      }
    );

    // 4. Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      // Optional: rotate the scene for dynamic effect
      scene.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // 5. Cleanup on component unmount
    const currentMount = mountRef.current;
    return () => {
      cancelAnimationFrame(animate);
      renderer.dispose();
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      style={{ width: '100%', height: '100%' }} // This should match .hero-right dimensions in CSS
      ref={mountRef}
    />
  );
};

export default ShawnModel;
