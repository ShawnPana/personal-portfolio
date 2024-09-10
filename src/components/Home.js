import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { isMobile } from 'react-device-detect';
import Hammer from 'hammerjs';
import ReactGA from 'react-ga4';

export default function Home() {
    const refContainer = useRef(null);
    const [scene, setScene] = useState(null);
    const [camera, setCamera] = useState(null);
    const [raycaster] = useState(new THREE.Raycaster());
    const [pointer] = useState(new THREE.Vector2());
    const interactiveObjects = useRef([]);

    if (isMobile) {
        ReactGA.event({
            category: 'User',
            action: 'Accessed from mobile'
        });
    }
    else{
        ReactGA.event({
            category: 'User',
            action: 'Accessed from computer'
        });
    }
    
    // Click handler function defined outside of useEffect
    const clickHandler = (event, raycaster, pointer, camera, object) => {
        event.preventDefault();

        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster.intersectObject(object);
        
        if (intersects.length > 0) {
            switch (object.name) {
                case "resume":
                    window.open('/textures/resume.png', '_blank');
                    ReactGA.event({
                        category: 'User',
                        action: 'Viewed resume from computer'
                    });
                    break;
                case "heart":
                    window.open('https://organregistry.org/', '_blank');
                    ReactGA.event({
                        category: 'User',
                        action: 'Viewed organregistry.org from computer'
                    });
                    break;
                case "linkedin":
                    window.open('https://www.linkedin.com/in/shawnpana', '_blank');
                    ReactGA.event({
                        category: 'User',
                        action: 'Viewed linkedin from computer'
                    });
                    break;
                case "shawn":
                    window.open('/music/song_4.mp3', '_blank');
                    ReactGA.event({
                        category: 'User',
                        action: 'Viewed Draped from computer'
                    });
                    break;
                default:
                    console.log("No valid object clicked.");
                    break;
            }
        }
    };

    function handleObjectClick(object) {
        switch (object.name) {
            case "resume":
                window.open('/textures/resume.png', '_blank');
                ReactGA.event({
                    category: 'User',
                    action: 'Viewed resume from mobile'
                });
                break;
            case "linkedin":
                window.open('https://www.linkedin.com/in/shawnpana', '_blank');
                ReactGA.event({
                    category: 'User',
                    action: 'Viewed linkedin from mobile'
                });
                break;
            case "heart":
                window.open('https://organregistry.org/', '_blank');
                ReactGA.event({
                    category: 'User',
                    action: 'Viewed organregistry.org from mobile'
                });
                break;
            case "shawn":
                window.open('/music/song_4.mp3', '_blank');
                ReactGA.event({
                    category: 'User',
                    action: 'Viewed Draped from mobile'
                });
                break;
            default:
                console.log("No valid object clicked.");
                break;
        }
    }

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
        setCamera(camera);
        camera.position.z = 10;
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        var moveBack = false;
        const target = new THREE.Object3D();
        const intersectionPoint = new THREE.Vector3();
        const planeNormal = new THREE.Vector3();
        const plane = new THREE.Plane();
        const mousePosition = new THREE.Vector2();

        const hammer = new Hammer(refContainer.current);


        function handlePan(event) {
            pointer.x = (event.center.x / window.innerWidth) * 2 - 1;
            pointer.y = -(event.center.y / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
        }

        function handleTap(event) {
            console.log("tap")
            pointer.x = (event.center.x / window.innerWidth) * 2 - 1;
            pointer.y = -(event.center.y / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(interactiveObjects, true);
    
            if (intersects.length > 0) {
                const object = intersects[0].object;
                handleObjectClick(object);
            }
        }

        if (isMobile){
            hammer.on('pan', handlePan);
            hammer.on('tap', handleTap);
        }
        else{
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('mouseout', () => { moveBack = true; })
            window.addEventListener('mouseover', () => { moveBack = false; })
            window.addEventListener('mousemove', (event) => {
                mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
                mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
                planeNormal.copy(camera.position).normalize();
                plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
                raycaster.setFromCamera(mousePosition, camera);
                raycaster.ray.intersectPlane(plane, intersectionPoint);
                target.position.set(intersectionPoint.x, intersectionPoint.y, 2);
            });
        }
        window.addEventListener('resize', () => { window.location.reload(); });

        const fontLoader = new FontLoader();
        const manager = new THREE.LoadingManager();
        const gltfLoader = new GLTFLoader(manager);

        scene.visible = false;

        // functions
        function onPointerMove(event) {
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
        }
        function calculateBounds(z, camera){
            var min = new THREE.Vector2();
            var max = new THREE.Vector2();
            camera.getViewBounds(Math.abs(z - camera.position.z), min, max) 
            return {min, max};
        }

        // scene object initialization
        const loadedModelBounds = calculateBounds(0, camera);
        var modelOriginalPosition = {x:0, y:-10, z:-2};
        let loadedModel;
        let loadedModelBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        gltfLoader.load('/models/shawnfullbodyglb.glb', (gltf) => {
            loadedModel = gltf.scene;
            scene.add(loadedModel);
            loadedModel.scale.set(6, 6, 6);
            loadedModel.position.set(modelOriginalPosition.x, modelOriginalPosition.y, modelOriginalPosition.z);

            const loadedModelBBHelper = new THREE.Box3Helper(loadedModelBB, 0xff0000);
            scene.add(loadedModelBBHelper);
            loadedModelBBHelper.visible = false;

            loadedModel.name = 'shawn';

            // loadedModel.traverse((child) => {
            //     if (child.isBone) {
            //         console.log(child.name);
            //     }
            // });
        });
        const clickShawn = (event) => clickHandler(event, raycaster, pointer, camera, loadedModel);
        window.addEventListener('click', clickShawn);
        if (loadedModel){
            frontObjectsPosition = loadedModel.position.z + 1
        }

        let liminalSpace;
        gltfLoader.load('/models/a_liminal_space.glb', (gltf) => {
            liminalSpace = gltf.scene;
            scene.add(liminalSpace);
            liminalSpace.scale.set(10, 10, 10);
            liminalSpace.position.set(0, -13, 0);
        });


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
        let scale;
        if (isMobile){
            scale = 1;
        }
        else{
            scale = 2;
        }
        var geometry = new THREE.BoxGeometry(scale*8.5/x, scale*11/x, scale*0.1/x);
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
        let linkedin;
        let linkedinModelBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        gltfLoader.load('/models/linkedin_3d.glb', (gltf) => {
            linkedin = gltf.scene;
            linkedin.position.set(linkedinOriginalPosition.x, linkedinOriginalPosition.y, linkedinOriginalPosition.z);
            scene.add(linkedin); 

            const linkedinModelBBHelper = new THREE.Box3Helper(linkedinModelBB, 0xff0000);
            scene.add(linkedinModelBBHelper);
            linkedinModelBBHelper.visible = false;

            linkedin.name = 'linkedin';
        });
        const clickLinkedin = (event) => clickHandler(event, raycaster, pointer, camera, linkedin);
        window.addEventListener('click', clickLinkedin);

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
        // function resolveAfter2Seconds() {
        //     return new Promise((resolve) => {
        //         setTimeout(() => {
        //             resolve('poop');
        //         }, 2000);
        //     });
        // }
        // async function asyncCall() {
        //     console.log('calling');
        //     const result = await resolveAfter2Seconds();
        //     console.log(result);
        // // Expected output: "resolved"  
        // }
        // asyncCall();

        // handle mobile/desktop scrolling
        // let startY = 0;
        // let currentY = 0;
        // const scrollRange = 2; // The range of camera movement (from 0 to -2)
        // const modelPositionTop = modelOriginalPosition; // Position when at the top
        // const modelPositionBottom = { x: -1, y: -4, z: modelOriginalPosition.z + 1 }; // Position when scrolled all the way down
        // if (isMobile) {
        //     window.addEventListener('touchstart', function(e) {
        //         startY = e.touches[0].clientY;
        //     });

        //     window.addEventListener('touchmove', function(e) {
        //         currentY = e.touches[0].clientY;
        //         let deltaY = startY - currentY;

        //         // Update camera position
        //         camera.position.y -= deltaY / 100 * 0.1;

        //         // Clamp the camera position
        //         if (camera.position.y > 0) {
        //             camera.position.y = 0;
        //         } else if (camera.position.y < -scrollRange) {
        //             camera.position.y = -scrollRange;
        //         }

        //         // Calculate the scroll ratio (0 at top, 1 at bottom)
        //         let scrollRatio = (camera.position.y - 0) / -scrollRange;

        //         // Interpolate the model's position based on the scroll ratio
        //         loadedModel.position.x = modelPositionTop.x + scrollRatio * (modelPositionBottom.x - modelPositionTop.x);
        //         loadedModel.position.y = modelPositionTop.y + scrollRatio * (modelPositionBottom.y - modelPositionTop.y);
        //         loadedModel.position.z = modelPositionTop.z + scrollRatio * (modelPositionBottom.z - modelPositionTop.z);

        //         // Update startY for continuous movement
        //         startY = currentY;
        //     });

        //     window.addEventListener('touchend', function() {
        //         startY = 0;
        //         currentY = 0;
        //     });
        // } else {
        //     window.addEventListener('mousewheel', function(e) {
        //         // Update camera position
        //         camera.position.y += e.deltaY / 100 * 0.1;

        //         // Clamp the camera position
        //         if (camera.position.y > 0) {
        //             camera.position.y = 0;
        //         } else if (camera.position.y < -scrollRange) {
        //             camera.position.y = -scrollRange;
        //         }

        //         // Calculate the scroll ratio (0 at top, 1 at bottom)
        //         let scrollRatio = (camera.position.y - 0) / -scrollRange;

        //         // Interpolate the model's position based on the scroll ratio
        //         loadedModel.position.x = modelPositionTop.x + scrollRatio * (modelPositionBottom.x - modelPositionTop.x);
        //         loadedModel.position.y = modelPositionTop.y + scrollRatio * (modelPositionBottom.y - modelPositionTop.y);
        //         loadedModel.position.z = modelPositionTop.z + scrollRatio * (modelPositionBottom.z - modelPositionTop.z);
        //     });
        // }

        // add everything to scene

        // animation
        const sensitivity = 9.5;
        var animate = function () {
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            raycaster.setFromCamera(pointer, camera);

            if (loadedModel) {
                if(isMobile){
                    loadedModel.rotation.y = Math.sin(t) * 0.1;
                    loadedModel.getObjectByName('spine005').rotation.y = Math.sin(t) * 0.2;
                    loadedModel.getObjectByName('spine006').rotation.y = Math.sin(t) * 0.2;
                    loadedModel.getObjectByName('spine005').rotation.z = Math.sin(t) * 0.2;
                    loadedModel.getObjectByName('spine006').rotation.z = Math.sin(t) * 0.2;
                }
                else{
                    loadedModel.getObjectByName('spine005').lookAt(mousePosition.x, mousePosition.y, loadedModel.position.z+1);
                    loadedModel.getObjectByName('spine006').lookAt(mousePosition.x, mousePosition.y, loadedModel.position.z+1);
                }
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
                resume.position.x = resumeBounds.max.x/2;
                resume.position.y = 0;

                resume.rotation.y = t;
                resume.position.y = Math.sin(t) * 0.1;
                
            }
            if (heartModel){
                if (!isMobile){
                    heartModel.scale.set(2, 2, 2);
                }
                heartModel.position.x = heartBounds.min.x/2;
                heartModel.position.y = 0;

                heartModel.rotation.y = t;
                heartModel.position.y = Math.sin(t) * 0.1;
                heartModelBB.setFromObject(heartModel);
            }

            if (linkedin){
                const widthOfLinkedIn = linkedinModelBB.max.x - linkedinModelBB.min.x;
                linkedin.position.x = linkedinBounds.max.x - widthOfLinkedIn;
                linkedin.position.y = linkedinBounds.min.y;
                linkedin.position.z = frontObjectsPosition;
                linkedinModelBB.setFromObject(linkedin);

            }
            renderer.render(scene, camera);
        };

        manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
            console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };

        manager.onLoad = function ( ) {
            animate();
            scene.visible = true;
        };

        manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
            console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };

        manager.onError = function ( url ) {
            console.log( 'There was an error loading ' + url );
        };

        scene.traverse((child) => {
            if (child.isMesh) {
                interactiveObjects.current.push(child);
            }
        });

        return () => {
            window.removeEventListener('click', clickResume);
            window.removeEventListener('click', clickHeart);
            window.removeEventListener('click', clickLinkedin);
            window.removeEventListener('click', clickShawn);
            hammer.off('pan', handlePan);
            hammer.off('tap', handleTap);
            hammer.destroy();
        };

    }, []);

    return (
        <div ref={refContainer}></div>
    )
}
