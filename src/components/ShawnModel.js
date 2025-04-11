// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// const ShawnModel = () => {
//   const mountRef = useRef(null);

//   useEffect(() => {
//     // 1. Setup scene, camera, and renderer
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color('#000000');

//     const width = mountRef.current.clientWidth;
//     const height = mountRef.current.clientHeight;
//     const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

//     // Adjust camera position to get the desired view of the model
//     camera.position.set(0, 1, 3.5);

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(width, height);
//     camera.aspect = width / height;
//     camera.updateProjectionMatrix();

//     mountRef.current.appendChild(renderer.domElement);

//     // 2. Add lights to the scene
//     const ambientLight = new THREE.AmbientLight(0xffffff, 1);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(5, 10, 7.5);
//     scene.add(directionalLight);

//     // 3. Load the GLB model
//     const loader = new GLTFLoader();
//     loader.load(
//       '/models/shawnfullbodyglb.glb', // Ensure the model file exists at this path in public/models/
//       (gltf) => {
//         const model = gltf.scene;
//         scene.add(model);

//         // Adjust model position and scale for optimal display
//         model.position.set(0, -0.2, 0);
//         model.scale.set(1.2, 1.2, 1.2);
//       },
//       undefined,
//       (error) => {
//         console.error('An error occurred while loading the model:', error);
//       }
//     );

//     // 4. Setup dragging for manual rotation
//     let isDragging = false;
//     let previousX = 0;
//     const rotationSpeed = 0.005; // Adjust sensitivity as needed

//     const onPointerDown = (event) => {
//       isDragging = true;
//       // Support both mouse events and touch events
//       previousX = event.clientX || (event.touches && event.touches[0].clientX);
//     };

//     const onPointerMove = (event) => {
//       if (!isDragging) return;
//       const currentX = event.clientX || (event.touches && event.touches[0].clientX);
//       const deltaX = currentX - previousX;
//       previousX = currentX;
//       // Adjust the scene rotation by the pointer movement delta
//       scene.rotation.y += deltaX * rotationSpeed;
//     };

//     const onPointerUp = () => {
//       isDragging = false;
//     };

//     // Add the pointer event listeners to the mount container
//     const currentMount = mountRef.current;
//     currentMount.addEventListener('pointerdown', onPointerDown);
//     currentMount.addEventListener('pointermove', onPointerMove);
//     currentMount.addEventListener('pointerup', onPointerUp);
//     // Also listen to pointer cancellation (e.g., pointer leaving the area)
//     currentMount.addEventListener('pointerleave', onPointerUp);

//     // 5. Animation loop with auto-rotation when not dragging
//     const animate = () => {
//       requestAnimationFrame(animate);
//       if (!isDragging) {
//         scene.rotation.y += 0.01; // Auto-rotate when not interacting
//       }
//       renderer.render(scene, camera);
//     };
//     animate();

//     // 6. Cleanup on component unmount
//     return () => {
//       currentMount.removeEventListener('pointerdown', onPointerDown);
//       currentMount.removeEventListener('pointermove', onPointerMove);
//       currentMount.removeEventListener('pointerup', onPointerUp);
//       currentMount.removeEventListener('pointerleave', onPointerUp);
//       renderer.dispose();
//       if (currentMount.contains(renderer.domElement)) {
//         currentMount.removeChild(renderer.domElement);
//       }
//     };
//   }, []);

//   return (
//         <div
//         style={{
//             width: '100%',
//             height: '100%',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             cursor: 'grab',
//         }}
//         ref={mountRef}
//         />
//   );
// };

// export default ShawnModel;

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // 3. Load the GLB model
    const loader = new GLTFLoader();
    loader.load(
      '/models/shawnfullbodyglb.glb', // Ensure the model file exists at this path in public/models/
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Adjust model position and scale for optimal display
        model.position.set(0, -0.2, 0);
        model.scale.set(1.2, 1.2, 1.2);
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the model:', error);
      }
    );

    // 4. Setup dragging for manual rotation with velocity
    let isDragging = false;
    let previousX = 0;
    let velocity = 0;
    const rotationSpeed = 0.005; // Adjust sensitivity as needed
    const autoRotation = 0.01;   // Constant auto-rotation amount
    const friction = 0.95;       // Friction factor to gradually reduce velocity

    const onPointerDown = (event) => {
      isDragging = true;
      // Support both mouse and touch events
      previousX = event.clientX || (event.touches && event.touches[0].clientX);
    };

    const onPointerMove = (event) => {
      if (!isDragging) return;
      const currentX = event.clientX || (event.touches && event.touches[0].clientX);
      const deltaX = currentX - previousX;
      previousX = currentX;
      // Update the velocity based on the pointer movement
      velocity = deltaX * rotationSpeed;
      // Rotate the scene by the delta amount during dragging
      scene.rotation.y += deltaX * rotationSpeed;
    };

    const onPointerUp = () => {
      isDragging = false;
      // When dragging stops, the current velocity remains and will be applied during the animate loop
    };

    // Add the pointer event listeners to the mount container
    const currentMount = mountRef.current;
    currentMount.addEventListener('pointerdown', onPointerDown);
    currentMount.addEventListener('pointermove', onPointerMove);
    currentMount.addEventListener('pointerup', onPointerUp);
    currentMount.addEventListener('pointerleave', onPointerUp);

    // 5. Animation loop with inertia and auto-rotation when not dragging
    const animate = () => {
      requestAnimationFrame(animate);
      if (!isDragging) {
        // Apply any residual velocity plus a constant auto-rotation
        scene.rotation.y += velocity + autoRotation;
        // Reduce the velocity over time for a smooth, natural deceleration
        velocity *= friction;
      }
      renderer.render(scene, camera);
    };
    animate();

    // 6. Cleanup on component unmount
    return () => {
      currentMount.removeEventListener('pointerdown', onPointerDown);
      currentMount.removeEventListener('pointermove', onPointerMove);
      currentMount.removeEventListener('pointerup', onPointerUp);
      currentMount.removeEventListener('pointerleave', onPointerUp);
      renderer.dispose();
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'grab',
      }}
      ref={mountRef}
    />
  );
};

export default ShawnModel;
