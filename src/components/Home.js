import * as THREE from 'three';
import { useEffect, useRef } from 'react'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { isMobile } from 'react-device-detect';
import Lanyard from './Mobile'
import { click } from '@testing-library/user-event/dist/click';

export default function Home() {
    const refContainer = useRef(null);

    // Click handler function defined outside of useEffect
    const clickHandler = (event, raycaster, pointer, camera, object) => {
        // Update the raycaster with the mouse position
        raycaster.setFromCamera(pointer, camera);
        // Check for intersections
        if (raycaster.intersectObject(object).length > 0) {
            if (object.name === "resume"){
                window.open('/textures/resume.png', '_blank');
            }
            else if (object.name === "heart"){
                window.open('https://organregistry.org/', '_blank');
            }
        }

    };

    useEffect(() => {

        document.body.style.overflow = 'hidden';

        // scene setup
        var scene = new THREE.Scene();
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        refContainer.current && refContainer.current.appendChild( renderer.domElement );
        var clock = new THREE.Clock();
        const light = new THREE.AmbientLight( 0xffffff, 10 ); 
        scene.add(light)
        var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;
        function KeepWithinView (object, objectDim, camera) {
            console.log(objectDim)
            // var objectDim = new THREE.Vector3();
            // objectBB.getSize(objectDim);
            // console.log(objectDim)
            // console.log(objectBB)
            
            var min = new THREE.Vector2();
            var max = new THREE.Vector2();
            camera.getViewBounds(Math.abs(object.position.z - camera.position.z), min, max)

            // make a ball at the origin with the same z position
            // var ball = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), new THREE.MeshBasicMaterial({color: 0xff0000}));
            // ball.position.z = object.position.z;
            // scene.add(ball);

            // console.log(objectDim)
            
            glideToPosition(object, {x:min.x, y:max.y-objectDim.y, z:object.position.z}, 0.1);
            // glideToPosition(object, {x:0, y:0-objectDim.y, z:object.position.z}, 0.1);
        }
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        window.addEventListener('pointermove', onPointerMove);
        var moveBack = false;
        window.addEventListener('mouseout', () => { moveBack = true; })
        window.addEventListener('mouseover', () => { moveBack = false; })
        window.addEventListener('resize', () => { window.location.reload(); });
        const target = new THREE.Object3D();
        const intersectionPoint = new THREE.Vector3();
        const planeNormal = new THREE.Vector3();
        const plane = new THREE.Plane();
        const mousePosition = new THREE.Vector2();
        window.addEventListener('mousemove', (event) => {
            mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
            mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
            planeNormal.copy(camera.position).normalize();
            plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
            raycaster.setFromCamera(mousePosition, camera);
            raycaster.ray.intersectPlane(plane, intersectionPoint);
            target.position.set(intersectionPoint.x, intersectionPoint.y, 2);
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

        let headerPosition = new THREE.Vector3();

        // scene object initialization
        let nameText;
        let nameTextDim;
        let nameTextBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        fontLoader.load( "/fonts/helvetiker_regular.typeface.json", function (font) {
            const textGeo = new TextGeometry( "Shawn Pana", {
                font: font,
                size: 0.5,
                depth: 0.01,
            } );  
            const textMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
            const mesh = new THREE.Mesh( textGeo, textMaterial );
            scene.add( mesh );
            nameText = mesh;
            textGeo.computeBoundingBox();
            // console.log(textGeo.boundingBox)
            // console.log(textGeo.boundingBox.min)
            // console.log(textGeo.boundingBox.max)

            const nameTextBBHelper = new THREE.Box3Helper(nameTextBB, 0xff0000);
            scene.add(nameTextBBHelper);
            nameTextBBHelper.visible = false;

            nameTextDim = new THREE.Box3(textGeo.boundingBox.min, textGeo.boundingBox.max)
            console.log(nameTextDim.min, nameTextDim.max)

            var min = new THREE.Vector2();
            var max = new THREE.Vector2();
            camera.getViewBounds(Math.abs(nameText.position.z - camera.position.z), min, max) 
            headerPosition.x = min.x;
            headerPosition.y = max.y - nameTextDim.max.y;
            headerPosition.z = nameText.position.z;

            mesh.position.set(headerPosition.x, headerPosition.y, headerPosition.z);
        });
        if (nameText){
            nameText.position.x = headerPosition.x
            nameText.position.y = headerPosition.y
            nameText.position.z = nameText.position.z
        }
        // var nameTextBB = new BoundingBoxHelper(nameText, 0xff0000);


    

        // cycle through titles
        const titles = ["Software Engineer", "Web Developer", "Musician", "3D Artist", "Lover", "Philosopher", "Creator", "Innovator", "Dreamer", "Educator", "2nd Year Undergraduate", "Student at UC San Diego", "Seeking Internship Opportunities"];
        let currentTitle;
        let titleText;
        var titleTextBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        function loadTitle(){
            fontLoader.load( "/fonts/helvetiker_regular.typeface.json", function (font) {
                const textGeo = new TextGeometry( currentTitle, {
                    font: font,
                    size: 0.3,
                    depth: 0.01,
                } );  
                const textMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
                const mesh = new THREE.Mesh( textGeo, textMaterial );
                mesh.position.set(headerPosition.x, headerPosition.y, headerPosition.z);
                scene.add( mesh );
                titleText = mesh;

                const titleTextBBHelper = new THREE.Box3Helper(titleTextBB, 0xff0000);
                scene.add(titleTextBBHelper);
                titleTextBBHelper.visible = false;
            });
        }
        var index = 0;
        currentTitle = titles[index]
        titleText = loadTitle();
        setInterval(() => {
            scene.remove(titleText);
            index = (index + 1) % titles.length;
            currentTitle = titles[index];
            titleText = loadTitle(currentTitle);
        }, 1000);

        const resumeOriginalPosition = {x:13, y:-0.5, z:-20};
        var texture = new THREE.TextureLoader().load('/textures/resume.png');
        var geometry = new THREE.BoxGeometry(8.5, 11, 0.1);
        var material = new THREE.MeshBasicMaterial({ 
            map: texture,
            side: THREE.DoubleSide
         });
        var resume = new THREE.Mesh(geometry, material);
        resume.position.set(resumeOriginalPosition.x, resumeOriginalPosition.y, resumeOriginalPosition.z);
        scene.add(resume);
        resume.name = 'resume';

        const clickResume = (event) => clickHandler(event, raycaster, pointer, camera, resume);
        window.addEventListener('click', clickResume);

        

        let loadedModel;
        let head;
        // var modelOriginalPosition = {x:0, y:0, z:-150};
        var modelOriginalPosition = {x:0, y:-1.5, z:7};
        let loadedModelBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        gltfLoader.load('/models/shawnfullbodyglb.glb', (gltf) => {
            loadedModel = gltf.scene;
            loadedModel.position.set(modelOriginalPosition.x, modelOriginalPosition.y, modelOriginalPosition.z);
            scene.add(loadedModel);

            const loadedModelBBHelper = new THREE.Box3Helper(loadedModelBB, 0xff0000);
            scene.add(loadedModelBBHelper);
            loadedModelBBHelper.visible = false;

            gltf.scene.getObjectByName('forearm.L').rotation.x += Math.PI * .5;
        });

        const heartOriginalPosition = {x:-5, y:0, z:0};
        let heartModel;
        let heartModelBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        gltfLoader.load('/models/realistic_human_heart.glb', (gltf) => {
            heartModel = gltf.scene;
            heartModel.position.set(heartOriginalPosition.x, heartOriginalPosition.y, heartOriginalPosition.z);
            scene.add(heartModel);

            const heartModelBBHelper = new THREE.Box3Helper(heartModelBB, 0xff0000);
            scene.add(heartModelBBHelper);
            heartModelBBHelper.visible = false;

            heartModel.name = 'heart';
        });
        const clickHeart = (event) => clickHandler(event, raycaster, pointer, camera, heartModel);
        window.addEventListener('click', clickHeart);

        // animation
        const sensitivity = 9.5;
        var animate = function () {
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            raycaster.setFromCamera(pointer, camera);
            camera.lookAt(scene.position);
            if (loadedModel) {
                if (moveBack) {
                    // loadedModel.lookAt({x:-2, y:0, z:6});
                    loadedModel.position.x = 0
                    loadedModel.position.y = -1
                    loadedModel.position.x += Math.sin(t) * 0.5;
                    loadedModel.position.y += Math.cos(t) * 0.5;
                    // loadedModel.position.z += Math.sin(t) * 0.1;

                }
                else{
                    if (raycaster.intersectObject(resume).length > 0){
                        glideToPosition(loadedModel, {x:modelOriginalPosition.x+1, y:modelOriginalPosition.y, z:modelOriginalPosition.z}, 0.5);
                        loadedModel.lookAt(resume.position);
                    }
                    else{
                        glideToPosition(loadedModel, modelOriginalPosition, 1.5);
                    }
                    moveBack = false;
                    loadedModel.lookAt(target.position);
                }
                loadedModelBB.setFromObject(loadedModel);
            }
            if ( nameText ) {
                var min = new THREE.Vector2();
                var max = new THREE.Vector2();
                camera.getViewBounds(Math.abs(nameText.position.z - camera.position.z), min, max)     
                // if (moveBack){
                //     // KeepWithinView(nameText, nameTextDim, camera);
                //     glideToPosition(nameText, {x:min.x, y:max.y-nameTextDim.y, z:nameText.position.z}, 0.1);
                // }
                // else{
                //     // glideToPosition(nameText, headerPosition, 1.5);
                //     glideToPosition(nameText, {x:min.x, y:max.y-nameTextDim.y, z:nameText.position.z}, 0.1);
                // }
                // // nameTextBB.setFromObject(nameText);
                nameTextBB.setFromObject(nameText);
            }
            renderer.render(scene, camera);
            if (titleText){
                // titleTextBB.setFromObject(titleText);
                if (titleTextBB.intersectsBox(nameTextBB)){
                    titleText.position.y -= 0.1;
                }
                // if (moveBack) {
                //     glideToPosition(titleText, headerPosition, 1);
                // }
                titleTextBB.setFromObject(titleText);
            };

            if (resume){
                if (moveBack){
                    glideToPosition(resume, resumeOriginalPosition, 0.5);
                    resume.rotation.y += 0.01;
                }
                if (raycaster.intersectObject(resume).length > 0){
                    glideToPosition(resume, {x: resumeOriginalPosition.x-2, y: resumeOriginalPosition.y, z: resumeOriginalPosition.z+2}, 0.5);
                    resume.lookAt(camera.position);
                }
                else{
                    glideToPosition(resume, resumeOriginalPosition, 0.5);
                    if (loadedModel){
                        glideToPosition(loadedModel, modelOriginalPosition, 0.5);
                    }
                    resume.rotation.y = t;
                    resume.position.y = Math.sin(t)*0.5;
                }

            }
            if (heartModel){
                heartModel.rotation.y = t;
                heartModel.position.y = Math.sin(t)*0.1;
            }
        };
        animate();

        return () => {
            window.removeEventListener('click', clickResume);
            window.removeEventListener('click', clickHeart);
        };

    }, []);

    if (!isMobile){
        return (
            <div ref={refContainer}></div>
        )
    }
    else{
        return (
            <Lanyard />
        )
    }
}