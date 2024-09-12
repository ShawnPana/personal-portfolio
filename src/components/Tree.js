import * as THREE from 'three';
import { useEffect, useRef } from 'react'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

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

        // PointerLockControls setup
        const controls = new PointerLockControls(camera, document.body);
        scene.add(controls.getObject());

        // Movement setup
        let moveForward = false;
        let moveBackward = false;
        let moveLeft = false;
        let moveRight = false;
        
        const velocity = new THREE.Vector3();
        const direction = new THREE.Vector3();

        const onKeyDown = function ( event ) {
            switch ( event.code ) {
                case 'KeyW':
                    moveForward = true;
                    break;
                case 'KeyA':
                    moveLeft = true;
                    break;
                case 'KeyS':
                    moveBackward = true;
                    break;
                case 'KeyD':
                    moveRight = true;
                    break;
            }
        };

        const onKeyUp = function ( event ) {
            switch ( event.code ) {
                case 'KeyW':
                    moveForward = false;
                    break;
                case 'KeyA':
                    moveLeft = false;
                    break;
                case 'KeyS':
                    moveBackward = false;
                    break;
                case 'KeyD':
                    moveRight = false;
                    break;
            }
        };

        document.addEventListener( 'keydown', onKeyDown );
        document.addEventListener( 'keyup', onKeyUp );

        // Lock and unlock controls
        const lockControls = () => {
            controls.lock();
        };
        document.addEventListener('click', lockControls);

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

        const keys = { w: false, a: false, s: false, d: false };
        const moveSpeed = 0.1;

        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() in keys) {
                keys[e.key.toLowerCase()] = true;
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.key.toLowerCase() in keys) {
                keys[e.key.toLowerCase()] = false;
            }
        });

        var animate = function () {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();

            if ( controls.isLocked === true ) {

                if (keys.w) controls.moveForward(moveSpeed);
                if (keys.s) controls.moveForward(-moveSpeed);
                if (keys.a) controls.moveRight(-moveSpeed);
                if (keys.d) controls.moveRight(moveSpeed);

                velocity.x -= velocity.x * 10.0 * delta;
                velocity.z -= velocity.z * 10.0 * delta;

                direction.z = Number( moveForward ) - Number( moveBackward );
                direction.x = Number( moveRight ) - Number( moveLeft );
                direction.normalize(); // this ensures consistent movements in all directions

                if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
                if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

                controls.moveRight( - velocity.x * delta );
                controls.moveForward( - velocity.z * delta );
            }

            if (mixer) {
                mixer.update(0);
                mixer.setTime(5);
            }
            if (hands){
                hands.position.copy(controls.getObject().position);
                hands.rotation.y = controls.getObject().rotation.y + Math.PI;
                hands.rotation.x = controls.getObject().rotation.x;
            }

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            window.removeEventListener('keydown', (e) => {
                if (e.key.toLowerCase() in keys) {
                    keys[e.key.toLowerCase()] = true;
                }
            });
            window.removeEventListener('keyup', (e) => {
                if (e.key.toLowerCase() in keys) {
                    keys[e.key.toLowerCase()] = false;
                }
            });
            document.removeEventListener('click', lockControls);
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
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
