/* 
* Transformer Project
* CG 2022/2023
* Diogo Melita ist199202
* João Rocha ist199256
*/

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, scene, renderer;

var trailer, transformer, inferiorBody, superiorBody, leftArm, rightArm, head, feet;

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();

    camera = getIsometricCamera();
    render();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';

    renderer.render(scene, camera);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////

function animate() {
    'use strict';

    render();
    requestAnimationFrame(animate);

}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper(20));
    scene.background = new THREE.Color(0xccf7ff);

    createTrailer(0, 0, -10);
    createTransformer(0, 0, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function getOrthographicCamera(pos_x, pos_y, pos_z) {
  const camera = new THREE.OrthographicCamera(-30, 30, 30, -30, 1, 100);
  camera.position.copy(new THREE.Vector3(pos_x, pos_y, pos_z));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  return camera
}

function getTopCamera() {
  return getOrthographicCamera(0, 20, 0);
}

function getSideCamera() {
  return getOrthographicCamera(20, 0, 0);
}

function getFrontCamera() {
  return getOrthographicCamera(0, 0, 20);
}

function getIsometricCamera() {
  return getOrthographicCamera(20, 20, 20);
}

function getPerspectiveCamera() {
  const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 100
  );
  camera.position.copy(new THREE.Vector3(20, 20, 20));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  return camera;
}

function switchCamera(new_camera) {
  camera = new_camera;
}
  
/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createBox(obj, x, y, z, length, height, width, color) {
    'use strict';

    var geometry = new THREE.BoxGeometry(length, height, width);
    var material = new THREE.MeshBasicMaterial({ color: color, wireframe: false });
    var box = new THREE.Mesh(geometry, material);
    box.position.set(x, y, z);
    obj.add(box);
}

function addWheel(obj, x, y, z, radius, height) {
    'use strict';

    var geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    geometry.rotateZ(Math.PI/2);
    var material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: false });
    var wheel = new THREE.Mesh(geometry, material);
    wheel.position.set(x, y, z);
    obj.add(wheel);
}

function createTrailer(x, y, z) {
    'use strict';

    trailer = new THREE.Object3D();

    createBox(trailer, 0, 6.5, 12, 8, 5, 24, 0xffffff); // trailer top
    createBox(trailer, 0, 2.5, 19, 6, 3, 10, 0xa8a8a8); // trailer base

    addWheel(trailer, -3.5, 1.5, 17.5, 1.5, 1);
    addWheel(trailer, 3.5, 1.5, 17.5, 1.5, 1);
    addWheel(trailer, -3.5, 1.5, 21.5, 1.5, 1);
    addWheel(trailer, 3.5, 1.5, 21.5, 1.5, 1);

    createBox(trailer, 0, 3.5, 0.5, 2, 1, 1, 0x000000); // trailer hitch

    trailer.rotateY(Math.PI);
    
    scene.add(trailer);

    trailer.position.x = x;
    trailer.position.y = y;
    trailer.position.z = z;
}

function createLegs(obj) {
    'use strict';

    var legs = new THREE.Object3D();

    createBox(inferiorBody, -1.5, 5, 1, 3, 10, 2, 0x004bc4); //left leg
    createBox(inferiorBody, 1.5, 5, 1, 3, 10, 2, 0x004bc4); // right leg

    addWheel(legs, -3.5, 1.5, 1.5, 1.5, 1.5, 1); // left bottom wheel
    addWheel(legs, -3.5, 5.5, 1.5, 1.5, 1.5, 1); // left top wheel
    addWheel(legs, 3.5, 1.5, 1.5, 1.5, 1.5, 1); // right bottom wheel
    addWheel(legs, 3.5, 5.5, 1.5, 1.5, 1.5, 1); // right top wheel

    createBox(legs, -0.5, 11.5, 0.5, 1, 3, 1, 0x000000); // left leg tight
    createBox(legs, 0.5, 11.5, 0.5, 1, 3, 1, 0x000000); // right leg tight

    obj.add(legs);
}

function createFeet(obj) {
    'use strict';

    feet = new THREE.Object3D();

    createBox(inferiorBody, -1.5, 1, 3, 3, 2, 2, 0x004bc4); // left foot
    createBox(inferiorBody, 1.5, 1, 3, 3, 2, 2, 0x004bc4); // right foot

    obj.add(feet);
}

function createInferiorBody(obj) {
    'use strict';

    inferiorBody = new THREE.Object3D();

    createLegs(inferiorBody);
    createFeet(inferiorBody);

    obj.add(inferiorBody);
}

function createSuperiorBody(obj) {}

function createTransformer(x, y, z) {
    'use strict';

    transformer = new THREE.Object3D();

    createInferiorBody(transformer);
    createSuperiorBody(transformer);

    scene.add(transformer);
    transformer.position.x = x;
    transformer.position.y = y;
    transformer.position.z = z;
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////

function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////

function handleCollisions(){
    'use strict';

}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////

function onKeyDown(e) {
    'use strict';

    // switch between cameras
    switch (e.keyCode) {
        case 49: // 1
            switchCamera(getTopCamera());
            break;
        case 50: // 2
            switchCamera(getSideCamera());
            break;
        case 51: // 3
            switchCamera(getFrontCamera());
            break;
        case 52: // 4
            switchCamera(getIsometricCamera());
            break;
        case 53: // 5
            switchCamera(getPerspectiveCamera());
            break;
        case 54: // 6
            scene.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
        // case arrow keys: move trailer
        case 37: // left arrow
            trailer.position.x -= 0.1;
            break;
        case 38: // up arrow
            trailer.position.z += 0.1;
            break;
        case 39: // right arrow
            trailer.position.x += 0.1;
            break;
        case 40: // down arrow
            trailer.position.z -= 0.1;
            break;
        default:
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////

function onKeyUp(e){
    'use strict';

}
