import * as THREE from 'three';
import { useEffect, useRef } from 'react'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

export default function Tree() {
    const refContainer = useRef(null);
    
    useEffect(() => {
        // scene setup
        document.body.style.overflow = 'hidden';
        var scene = new THREE.Scene();
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        refContainer.current && refContainer.current.appendChild( renderer.domElement );
        var clock = new THREE.Clock();
        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        scene.add(ambientLight);
        var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 35;
        var gltfLoader = new GLTFLoader();
        const fontLoader = new FontLoader();

        let model;
        gltfLoader.load('/models/ps1testtt5.glb', (gltf) => {
            model = gltf.scene;
            scene.add(model);
            model.position.set(-17.6206, -11.1618, -7.03967);
        });

        let nameText;
        fontLoader.load( "/fonts/helvetiker_regular.typeface.json", function (font) {
            const textGeo = new TextGeometry( "organregistry.org", {
                font: font,
                size: 1,
                depth: 0.01,
            } );  
            const textMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
            const mesh = new THREE.Mesh( textGeo, textMaterial );
            scene.add( mesh );
            nameText = mesh;
        });

        let mixer;
        let hands;
        gltfLoader.load('/models/hands.glb', (gltf) => {
            hands = gltf.scene;
            scene.add(hands);
            hands.scale.set(6, 6, 6);

            mixer = new THREE.AnimationMixer(hands);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
        });

        var animate = function () {
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            if (mixer) {
                mixer.update(0);
                mixer.setTime(5);
            }
            if (hands){
                hands.position.x = camera.position.x;
                hands.position.y = camera.position.y;
                hands.position.z = camera.position.z;
                hands.rotation.y = camera.rotation.y + Math.PI;
            }

            renderer.render(scene, camera);
        };
        animate();


        return () => {
            renderer.dispose();
            scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) object.material.dispose();
            });
        };
    }, []);

    return (
        <div ref={refContainer}></div>
    )
}
