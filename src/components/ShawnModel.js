import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const ShawnModel = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // 1. Setup scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000');

    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );

    // Adjust camera position to bring it closer to the model
    camera.position.set(0, 1, 3); // Changed Z from 5 to 3 for a closer view

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
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
      '/models/realistic_human_heart.glb', // Update your model path if needed
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Adjust model position and scale
        model.position.set(0, 1.1, 0); // Slight upward adjustment
        model.scale.set(1.5, 1.5, 1.5);   // Increase scale for better visibility
        // Model offsets

// Camera can be closer/further
camera.position.set(0, 1, 3.5);

      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the model:', error);
      }
    );

    // 4. Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
        scene.rotation.y += 0.01; // Rotate the entire scene

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
      style={{ width: '100%', height: '300px' }} // Adjust container size as needed
      ref={mountRef}
    />
  );
};

export default ShawnModel;
