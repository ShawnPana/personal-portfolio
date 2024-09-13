import * as THREE from 'three';
import { useEffect, useRef } from 'react'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export default function Tree() {
    const refContainer = useRef(null);
    
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        var scene = new THREE.Scene();
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        refContainer.current && refContainer.current.appendChild( renderer.domElement );
        var clock = new THREE.Clock();
        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        scene.add(ambientLight);
        var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 50;
        const manager = new THREE.LoadingManager();
        const gltfLoader = new GLTFLoader(manager);
        const fontLoader = new FontLoader(manager);
        const controls = new PointerLockControls(camera, document.body);
        scene.add(controls.getObject());
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
                default:
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
                default:
                    break;
            }
        };
        document.addEventListener( 'keydown', onKeyDown );
        document.addEventListener( 'keyup', onKeyUp );
        const lockControls = () => {
            controls.lock();
        };
        document.addEventListener('click', lockControls);
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
        window.addEventListener('resize', () => { window.location.reload(); });


        let model;
        let treeMixer;
        gltfLoader.load('/models/ps1testtt5.glb', (gltf) => {
            model = gltf.scene;

            // Compute the bounding box of the model
            const box = new THREE.Box3().setFromObject(model);

            // Calculate the center of the bounding box
            const center = new THREE.Vector3();
            box.getCenter(center);

            // Translate the model so its origin is at (0, 0, 0)
            model.position.sub(center);

            scene.add(model);

            treeMixer = new THREE.AnimationMixer(model);
            for (let i = 0; i < gltf.animations.length; i++) {
                const action = treeMixer.clipAction(gltf.animations[i]);
                action.play();
            }
        });

        let text;
        fontLoader.load("/fonts/helvetiker_regular.typeface.json", function (font) {
            const textGeo = new TextGeometry("organregistry.org", {
                font: font,
                size: 1,
                depth: 0.01,
            });
        
            // Compute the bounding box of the text geometry
            textGeo.computeBoundingBox();
        
            // Get the center of the bounding box
            const boundingBox = textGeo.boundingBox;
            const centerX = (boundingBox.max.x - boundingBox.min.x) / 2;
            const centerY = (boundingBox.max.y - boundingBox.min.y) / 2;
            const centerZ = (boundingBox.max.z - boundingBox.min.z) / 2;
        
            // Translate the geometry to center it
            textGeo.translate(-centerX, -centerY, -centerZ);
        
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const mesh = new THREE.Mesh(textGeo, textMaterial);
        
            // Set position of the mesh in the scene
            
            mesh.position.set(8, -0.25, 10);
            scene.add(mesh);
        
            text = mesh;
        });
        
        let mixer;
        let hands;
        gltfLoader.load('/models/hands.glb', (gltf) => {
            hands = gltf.scene;
            hands.rotation.y = Math.PI;
            // camera.add(hands);
            // scene.add(camera);
            hands.scale.set(6, 6, 6);

            mixer = new THREE.AnimationMixer(hands);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
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

                // mixer.update(delta);
            }
            if (treeMixer) {
                // treeMixer.update(0);
                // treeMixer.setTime(0);
                

                treeMixer.update(delta);
            }
            if (text){
                text.lookAt(camera.position);
            }

            renderer.render(scene, camera);
        };

        manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
            console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
            document.getElementById('loadingOverlay').style.display = 'block';
        };

        manager.onLoad = function ( ) {
            document.getElementById('loadingOverlay').style.opacity = 0;
            document.getElementById('loadingOverlay').style.transition = 'opacity 1s';
            animate();
            scene.visible = true;
        };

        manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
            console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };

        manager.onError = function ( url ) {
            console.log( 'There was an error loading ' + url );
        };

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
            window.removeEventListener('resize', () => { window.location.reload(); });
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
        <div ref={refContainer}>
            {
                <div
                    id="loadingOverlay"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        color: '#fff',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '2rem',
                        zIndex: 10,
                    }}
                >
                    loading...  
                </div>
            }
          </div>
    )
}
