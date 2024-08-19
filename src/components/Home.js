import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { isMobile } from 'react-device-detect';
import Lanyard from './Mobile'

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
            else if (object.name === "linkedin"){
                window.open('https://www.linkedin.com/in/shawnpana', '_blank');
            }
            else if (object.name === "instagram"){
                window.open('https://www.instagram.com/shawnpana/', '_blank');
            }
        }
    };

    useEffect(() => {
        // scene setup
        document.body.style.overflow = 'hidden';
        var scene = new THREE.Scene();
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        refContainer.current && refContainer.current.appendChild( renderer.domElement );
        var clock = new THREE.Clock();
        const light = new THREE.AmbientLight( 0xffffff, 10 ); 
        scene.add(light)
        var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;
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
        function calculateBounds(z, camera){
            var min = new THREE.Vector2();
            var max = new THREE.Vector2();
            camera.getViewBounds(Math.abs(z - camera.position.z), min, max) 
            return {min, max};
        }

        // const skyGeometry = new THREE.SphereGeometry( 500, 60, 30 );
        // // invert the geometry on the x-axis so that all of the faces point inward
        // skyGeometry.scale( - 1, 1, 1 );
        // const skyTexture = new THREE.TextureLoader().load( '/textures/2294472375_24a3b8ef46_o.jpg' );
        // skyTexture.colorSpace = THREE.SRGBColorSpace;
        // const skyMaterial = new THREE.MeshBasicMaterial( { map: skyTexture } );
        // const sky = new THREE.Mesh( skyGeometry, skyMaterial );
        // scene.add( sky );

        // scene object initialization
        let loadedModel;
        var modelOriginalPosition = {x:0, y:-1.5, z:7};
        let loadedModelBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        gltfLoader.load('/models/shawnfullbodyglb.glb', (gltf) => {
            loadedModel = gltf.scene;
            loadedModel.position.set(modelOriginalPosition.x, modelOriginalPosition.y, modelOriginalPosition.z);
            scene.add(loadedModel);

            const loadedModelBBHelper = new THREE.Box3Helper(loadedModelBB, 0xff0000);
            scene.add(loadedModelBBHelper);
            loadedModelBBHelper.visible = false;


            // loadedModel.traverse((child) => {
            //     if (child.isBone) {
            //         console.log(child.name);
            //     }
            // });
        });
        if (loadedModel){
            frontObjectsPosition = loadedModel.position.z + 1
        }

        let headerPosition = new THREE.Vector3();
        let nameText;
        let nameTextDim = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        let nameTextBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        var headerSize = 0.5;
        if (isMobile){
            headerSize = 0.4;
        }
        fontLoader.load( "/fonts/helvetiker_regular.typeface.json", function (font) {
            const textGeo = new TextGeometry( "Shawn Pana", {
                font: font,
                size: headerSize,
                depth: 0.01,
            } );  
            const textMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
            const mesh = new THREE.Mesh( textGeo, textMaterial );
            scene.add( mesh );
            nameText = mesh;

            const nameTextBBHelper = new THREE.Box3Helper(nameTextBB, 0xff0000);
            scene.add(nameTextBBHelper);
            nameTextBBHelper.visible = false;

            textGeo.computeBoundingBox();
            nameTextDim = new THREE.Box3(textGeo.boundingBox.min, textGeo.boundingBox.max)

            var min = new THREE.Vector2();
            var max = new THREE.Vector2();
            camera.getViewBounds(Math.abs(nameText.position.z - camera.position.z), min, max) 
            headerPosition.x = min.x;
            headerPosition.y = max.y - nameTextDim.max.y;
            headerPosition.z = nameText.position.z;

            console.log(nameTextDim.max.x);
            console.log(max.x-min.x);

            mesh.position.set(headerPosition.x, headerPosition.y, headerPosition.z);
        });
        if (nameText){
            nameText.position.x = headerPosition.x
            nameText.position.y = headerPosition.y
            nameText.position.z = nameText.position.z
        }

        var frontObjectsPosition = 0;

        const resumeBounds = calculateBounds(frontObjectsPosition, camera);
        const resumeOriginalPosition = {x:resumeBounds.min.x, y:resumeBounds.min.y, z:frontObjectsPosition};
        var texture = new THREE.TextureLoader().load('/textures/resume.png');
        const x = 11/1.6
        var geometry = new THREE.BoxGeometry(8.5/x, 11/x, 0.1/x);
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


        const linkedinBounds = calculateBounds(frontObjectsPosition, camera);
        const linkedinOriginalPosition = {x:linkedinBounds.min.x, y:linkedinBounds.min.y, z:frontObjectsPosition};
        var texture = new THREE.TextureLoader().load('/textures/linkedin.png');
        var geometry = new THREE.BoxGeometry(1, 1, 0.1);
        var material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        var linkedin = new THREE.Mesh(geometry, material);
        linkedin.position.set(linkedinOriginalPosition.x, linkedinOriginalPosition.y, linkedinOriginalPosition.z);
        scene.add(linkedin);
        linkedin.name = 'linkedin';
        const clickLinkedin = (event) => clickHandler(event, raycaster, pointer, camera, linkedin);
        window.addEventListener('click', clickLinkedin);
        
        // icons
        const instagramBounds = calculateBounds(frontObjectsPosition, camera);
        const instagramOriginalPosition = {x:instagramBounds.min.x, y:instagramBounds.min.y, z:frontObjectsPosition};
        var texture = new THREE.TextureLoader().load('/textures/instagram.png');
        var geometry = new THREE.BoxGeometry(1, 1, 0.1);
        var material = new THREE.MeshBasicMaterial({
            // color: 0x000000,
            map: texture,
            side: THREE.DoubleSide
        });
        var instagram = new THREE.Mesh(geometry, material);
        instagram.position.set(instagramOriginalPosition.x, instagramOriginalPosition.y, instagramOriginalPosition.z);
        scene.add(instagram);
        instagram.name = 'instagram';
        const clickInstagram = (event) => clickHandler(event, raycaster, pointer, camera, instagram);
        window.addEventListener('click', clickInstagram);

        const heartBounds = calculateBounds(frontObjectsPosition, camera);
        const heartOriginalPosition = {x:heartBounds.min.x, y:heartBounds.min.y, z:frontObjectsPosition};
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
        // TODO: add a function to handle the generation of icons(?)


        // cycle through titles
        const titles = ["Software Engineer", "Web Developer", "Musician", "3D Artist", "Lover", "Philosopher", "Creator", "Innovator", "Dreamer", "Educator", "2nd Year Undergraduate", "Student at UC San Diego", "Seeking Internship Opportunities"];
        let currentTitle;
        let titleText;
        var titleTextBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        function loadTitle(){
            fontLoader.load( "/fonts/helvetiker_regular.typeface.json", function (font) {
                const textGeo = new TextGeometry( currentTitle, {
                    font: font,
                    size: headerSize/2,
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
        // probably the most questionable think I've done in this project


        // fucking around with async/await
        function resolveAfter2Seconds() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve('poop');
                }, 2000);
            });
        }
        async function asyncCall() {
            console.log('calling');
            const result = await resolveAfter2Seconds();
            console.log(result);
        // Expected output: "resolved"  
        }
        asyncCall();     


        // handle mobile/desktop scrolling
        let startY = 0;
        let currentY = 0;
        // if (isMobile){
        //     window.addEventListener('touchstart', function(e) {
        //         startY = e.touches[0].clientY;
        //     });
        //     window.addEventListener('touchmove', function(e) {
        //         currentY = e.touches[0].clientY;
        //         let deltaY = startY - currentY;

        //         camera.position.y -= deltaY/100 * 0.1;
        //         // loadedModel.position.z += deltaY/100 * 0.005;
        //         // loadedModel.position.y -= deltaY/100 * 0.005;

        //         if (camera.position.y > 0) {
        //             camera.position.y = 0;
        //         } else if (camera.position.y < -2) {
        //             camera.position.y = -2;
        //         }

        //         // if (loadedModel.position.z > modelOriginalPosition.z) {
        //         //     loadedModel.position.z = modelOriginalPosition.z;
        //         // }
        //         // else if (loadedModel.position.z < -2) {
        //         //     loadedModel.position.z = -2;
        //         // }

        //         // if (loadedModel.position.y > modelOriginalPosition.y) {
        //         //     loadedModel.position.y = modelOriginalPosition.y;
        //         // }
        //         // else if (loadedModel.position.y < -5) {
        //         //     loadedModel.position.y = -5;
        //         // }

        //         // Update startY for continuous movement
        //         startY = currentY;
        //     });
        //     window.addEventListener('touchend', function() {
        //         startY = 0;
        //         currentY = 0;
        //     });
        // }
        // else{
        //     window.addEventListener('mousewheel', function(e){
        //         camera.position.y += e.deltaY/100 * 0.1;

        //         loadedModel.translateY(e.deltaY/100 * 0.1);
        //         loadedModel.translateX(e.deltaY/100 * 0.1);
        //         // loadedModel.translateZ(e.deltaY/100 * 0.1);
        //         // loadedModel.position.y += e.deltaY/100 * 0.1;
        //         // loadedModel.position.x += e.deltaY/100 * 0.1;

        //         if (loadedModel.position > modelOriginalPosition){
        //             loadedModel.position = modelOriginalPosition;
        //         }

        //         if (camera.position.y > 0){
        //             camera.position.y = 0;
        //         }
        //         else if (camera.position.y < -2){
        //             camera.position.y = -2;
        //         }

        //     });
        // }
        // Define the scroll range and the model's target positions
        const scrollRange = 2; // The range of camera movement (from 0 to -2)
        const modelPositionTop = modelOriginalPosition; // Position when at the top
        const modelPositionBottom = { x: -1, y: -4, z: modelOriginalPosition.z + 1 }; // Position when scrolled all the way down

        if (isMobile) {
            window.addEventListener('touchstart', function(e) {
                startY = e.touches[0].clientY;
            });

            window.addEventListener('touchmove', function(e) {
                currentY = e.touches[0].clientY;
                let deltaY = startY - currentY;

                // Update camera position
                camera.position.y -= deltaY / 100 * 0.1;

                // Clamp the camera position
                if (camera.position.y > 0) {
                    camera.position.y = 0;
                } else if (camera.position.y < -scrollRange) {
                    camera.position.y = -scrollRange;
                }

                // Calculate the scroll ratio (0 at top, 1 at bottom)
                let scrollRatio = (camera.position.y - 0) / -scrollRange;

                // Interpolate the model's position based on the scroll ratio
                loadedModel.position.x = modelPositionTop.x + scrollRatio * (modelPositionBottom.x - modelPositionTop.x);
                loadedModel.position.y = modelPositionTop.y + scrollRatio * (modelPositionBottom.y - modelPositionTop.y);
                loadedModel.position.z = modelPositionTop.z + scrollRatio * (modelPositionBottom.z - modelPositionTop.z);

                // Update startY for continuous movement
                startY = currentY;
            });

            window.addEventListener('touchend', function() {
                startY = 0;
                currentY = 0;
            });
        } else {
            window.addEventListener('mousewheel', function(e) {
                // Update camera position
                camera.position.y += e.deltaY / 100 * 0.1;

                // Clamp the camera position
                if (camera.position.y > 0) {
                    camera.position.y = 0;
                } else if (camera.position.y < -scrollRange) {
                    camera.position.y = -scrollRange;
                }

                // Calculate the scroll ratio (0 at top, 1 at bottom)
                let scrollRatio = (camera.position.y - 0) / -scrollRange;

                // Interpolate the model's position based on the scroll ratio
                loadedModel.position.x = modelPositionTop.x + scrollRatio * (modelPositionBottom.x - modelPositionTop.x);
                loadedModel.position.y = modelPositionTop.y + scrollRatio * (modelPositionBottom.y - modelPositionTop.y);
                loadedModel.position.z = modelPositionTop.z + scrollRatio * (modelPositionBottom.z - modelPositionTop.z);
            });
        }




        // animation
        const sensitivity = 9.5;
        var animate = function () {
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            raycaster.setFromCamera(pointer, camera);

            if (loadedModel) {
                loadedModel.getObjectByName('spine005').lookAt(mousePosition.x, mousePosition.y, loadedModel.position.z+1);
                loadedModel.getObjectByName('spine006').lookAt(mousePosition.x, mousePosition.y, loadedModel.position.z+1);
                loadedModelBB.setFromObject(loadedModel);
            }

            if ( nameText ) {
                nameTextBB.setFromObject(nameText);
            }

            if (titleText){
                if (titleTextBB.intersectsBox(nameTextBB)){
                    titleText.position.y -= 0.1;
                }
                titleTextBB.setFromObject(titleText);
            }

            if (resume){
                if (raycaster.intersectObject(resume).length > 0){
                    console.log('intersecting');
                }
                else{
                    glideToPosition(resume, resumeOriginalPosition, 0.5);
                }

                resume.position.x = resumeBounds.max.x/2;
                resume.position.y = 0;

                resume.rotation.y = t;
                
            }
            if (heartModel){
                heartModel.position.x = heartBounds.min.x/2;
                heartModel.position.y = 0;

                heartModel.rotation.y = t;
                heartModelBB.setFromObject(heartModel);
            }

            // TODO: figure out icon positioning
            if (linkedin){
                linkedin.position.x = headerPosition.x + nameTextDim.max.x - 1;
                linkedin.position.y = headerPosition.y - 1;
            }
            if (instagram){
                instagram.position.x = headerPosition.x + nameTextDim.max.x;
                instagram.position.y = headerPosition.y - 1;
            }
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            window.removeEventListener('click', clickResume);
            window.removeEventListener('click', clickHeart);
            window.removeEventListener('click', clickLinkedin);
            window.removeEventListener('click', clickInstagram);
        };

    }, []);

    // if (!isMobile){
        return (
            <div ref={refContainer}></div>
        )
    // }
    // else{
    //     return (
    //         <Lanyard />
    //     )
    // }
}
