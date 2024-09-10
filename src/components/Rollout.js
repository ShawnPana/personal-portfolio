import * as THREE from 'three';
import { useEffect, useRef } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import ReactGA from 'react-ga4';

export default function Rollout() {
    const refContainer = useRef(null);

    useEffect(() => {
        // scene setup
        document.body.style.overflow = 'hidden';
        var scene = new THREE.Scene();
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        refContainer.current && refContainer.current.appendChild( renderer.domElement );
        var clock = new THREE.Clock();

        ReactGA.initialize('G-GSRJQ6Y41W');

        const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
        directionalLight.position.set(0, 2, -2);
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 3);
        directionalLight2.position.set(0, 0, 5);
        scene.add(directionalLight);
        scene.add(directionalLight2);

        var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;

        var gltfLoader = new GLTFLoader();

        // add a rotating cube
        var modelOriginalPosition = {x:0, y:-10, z:-2};
        let shawn;
        let shawnBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        gltfLoader.load('/models/shawnfullbodyglb.glb', (gltf) => {
            shawn = gltf.scene;
            scene.add(shawn);
            shawn.scale.set(6, 6, 6);
            shawn.position.set(modelOriginalPosition.x, modelOriginalPosition.y, modelOriginalPosition.z);

            const shawnBBHelper = new THREE.Box3Helper(shawnBB, 0xff0000);
            scene.add(shawnBBHelper);
            shawnBBHelper.visible = false;

            shawn.name = 'shawn';
        });

        var animate = function () {
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            if (shawn) {
                shawn.rotation.y = Math.sin(t) * 0.1;
                shawn.getObjectByName('spine005').rotation.y = Math.sin(t) * 0.2;
                shawn.getObjectByName('spine006').rotation.y = Math.sin(t) * 0.2;
                shawn.getObjectByName('spine005').rotation.z = Math.sin(t) * 0.2;
                shawn.getObjectByName('spine006').rotation.z = Math.sin(t) * 0.2;
                shawnBB.setFromObject(shawn);
            }

            renderer.render(scene, camera);
        };

        return () => {
            animate();
        };

    }, []);

    return (
        <div ref={refContainer}></div>
    )
}
