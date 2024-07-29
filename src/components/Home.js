import * as THREE from 'three';
import { useEffect, useRef } from 'react'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export default function Home() {
    const refContainer = useRef(null);

    useEffect(() => {

        // scene setup
        var scene = new THREE.Scene();
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        refContainer.current && refContainer.current.appendChild( renderer.domElement );

        const light = new THREE.AmbientLight( 0xffffff, 10 ); 
        scene.add(light)

        var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = 10;

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        window.addEventListener('pointermove', onPointerMove);
        var moveBack = false;
        window.addEventListener('mouseout', () => { moveBack = true; })
        window.addEventListener('mouseover', () => { moveBack = false; })

        window.addEventListener('resize', () => {
            window.location.reload();
        });

        const fontLoader = new FontLoader();
        const gltfLoader = new GLTFLoader();


        // functions
        function onPointerMove(event) {
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
        }
        function distance(object1, object2) {
            return Math.sqrt(
                Math.pow(object1.position.x - object2.position.x, 2) +
                Math.pow(object1.position.y - object2.position.y, 2) +
                Math.pow(object1.position.z - object2.position.z, 2)
            );
        }
        function glideToPosition(object, targetPosition, speed) {
            // Calculate the direction vector from the current position to the target position
            let direction = {
                x: targetPosition.x - object.position.x,
                y: targetPosition.y - object.position.y,
                z: targetPosition.z - object.position.z
            };
            
            // Calculate the distance to the target
            let distance = Math.sqrt(direction.x ** 2 + direction.y ** 2 + direction.z ** 2);
            
            // If the distance is less than the speed, move directly to the target position
            if (distance < speed) {
                object.position.x = targetPosition.x;
                object.position.y = targetPosition.y;
                object.position.z = targetPosition.z;
                return;
            }
            
            // Normalize the direction vector
            direction.x /= distance;
            direction.y /= distance;
            direction.z /= distance;
            
            // Scale the direction vector by the speed
            direction.x *= speed;
            direction.y *= speed;
            direction.z *= speed;
            
            // Update the object's position
            object.position.x += direction.x;
            object.position.y += direction.y;
            object.position.z += direction.z;
        }


        // scene object initialization
        let text;
        fontLoader.load( "/fonts/helvetiker_regular.typeface.json", function (font) {
            const textGeo = new TextGeometry( "Shawn Pana", {
                font: font,
                size: 0.5,
                height: 0.01,
            } );  
            const textMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
            const mesh = new THREE.Mesh( textGeo, textMaterial );
            mesh.position.set( 4.5, 0, 2 );
            mesh.rotation.y = Math.PI/2;
            scene.add( mesh );
            text = mesh;
        });

        let loadedModel;
        gltfLoader.load('/models/model.glb', (gltf) => {
            loadedModel = gltf.scene;
            loadedModel.position.set(0, -5, 0);
            scene.add(loadedModel);
        });


        // animation
        const sensitivity = 9.5;
        var animate = function () {
            requestAnimationFrame(animate);
            raycaster.setFromCamera(pointer, camera);
            camera.lookAt(scene.position);

            if (loadedModel) {
                if (moveBack) {
                    loadedModel.rotation.y = Math.abs(loadedModel.rotation.y) < 0.01 ? 0 : loadedModel.rotation.y * 0.1;
                    loadedModel.rotation.z = Math.abs(loadedModel.rotation.z) < 0.01 ? 0 : loadedModel.rotation.z * 0.1;
                    glideToPosition(loadedModel, {x:2, y:loadedModel.position.y, z:loadedModel.position.z}, 1.5);

                    // shake the model
                    loadedModel.position.x = 2 + Math.random()*0.1;
                    loadedModel.position.y = -5 + Math.random()*0.1;
                    loadedModel.position.z = Math.random()*0.1;
                }
                else{
                    if (loadedModel.position.x > 0) {
                        loadedModel.position.x = loadedModel.position.x * 0.35;
                        loadedModel.rotation.y = loadedModel.rotation.y * 0.5;
                        loadedModel.rotation.z = loadedModel.rotation.z * 0.5;
                    }
                    loadedModel.rotation.y = pointer.x * (window.innerWidth / window.innerHeight) * (1/distance(camera, loadedModel)) * sensitivity/(window.innerWidth / window.innerHeight);
                    loadedModel.rotation.z = pointer.y * (window.innerHeight / window.innerWidth) * (1/distance(camera, loadedModel)) * sensitivity;
                    moveBack = false;
                }
            }
            if ( text ) {
                if (moveBack){
                    glideToPosition(text, {x:6, y:0, z:2}, 1.5);
                }
                else{
                    glideToPosition(text, {x:-5, y: 4.5, z: 8}, 1.5);
                }
            }
            renderer.render(scene, camera);
        };
        animate();

    }, []);

    return (
        <div ref={refContainer}></div>
    )
}