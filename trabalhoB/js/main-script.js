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

const WHITE = 0xffffff, BLACK = 0x000000, BLUE = 0x004bc4, RED = 0xff0000, GREY = 0x909090, BACKGROUND_COLOR = 0xccf7ff;

const WHEEL_RADIUS = 1.5, WHEEL_HEIGHT = 1;
const X_TIGHT = 1, Y_TIGHT = 3, Z_TIGHT = 1;
const X_LEG = 3, Y_LEG = 10, Z_LEG = 2;
const BACK_WHEEL_OFFSET = -3.5, MIDDLE_WHEEL_OFFSET = 0.5;
const X_FOOT = 3, Y_FOOT = 2, Z_FOOT = 2;
const X_ABDOMEN = 4, Y_ABDOMEN = 1, Z_ABDOMEN = 4;
const X_CHEST = 8, Y_CHEST = 6, Z_CHEST = 4;
const X_WAIST = 8, Y_WAIST = 2, Z_WAIST = 1;
const X_ARM = 3, Y_ARM = 6, Z_ARM = 2;
const X_FOREARM = 2, Y_FOREARM = 1, Z_FOREARM = 6;
const ESCAPE_RADIUS = 0.5, ESCAPE_HEIGHT = 4, ESCAPE_OFFSET = 2;
const X_HEAD = 2, Y_HEAD = 2, Z_HEAD = 2;
const EYE_RADIUS = 0.25;
const X_ANTENNA = 0.5, Y_ANTENNA = 0.5, Z_ANTENNA = 0.5;

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
    scene.background = new THREE.Color(BACKGROUND_COLOR);

    addTrailer(0, 0, -10);
    addTransformer(0, 0, 0);
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

function addBox(obj, x, y, z, length, height, width, color) {
    'use strict';

    var geometry = new THREE.BoxGeometry(length, height, width);
    var material = new THREE.MeshBasicMaterial({color: color, wireframe: false});
    var box = new THREE.Mesh(geometry, material);

    box.position.set(x, y, z);
    obj.add(box);
}

function addWheel(obj, x, y, z) {
    'use strict';

    var geometry = new THREE.CylinderGeometry(
      WHEEL_RADIUS, WHEEL_RADIUS, WHEEL_HEIGHT, 32
    );
    geometry.rotateZ(Math.PI/2);
    var material = new THREE.MeshBasicMaterial({color: BLACK, wireframe: false});
    var wheel = new THREE.Mesh(geometry, material);

    wheel.position.set(x, y, z);
    obj.add(wheel);
}

function addFeet(obj) {
    'use strict';

    feet = new THREE.Object3D();

    addBox(feet, X_FOOT/2, Y_FOOT/2, Z_FOOT/2, X_FOOT, Y_FOOT, Z_FOOT, BLUE);
    addBox(feet, -X_FOOT/2, Y_FOOT/2, Z_FOOT/2, X_FOOT, Y_FOOT, Z_FOOT, BLUE);

    feet.position.set(0, -Y_LEG/2, Z_LEG/2);
    obj.add(feet);
}

function addLeg(obj, left) {
    'use strict';

    var leg = new THREE.Object3D();

      addBox(leg, 0, 0, 0, X_LEG, Y_LEG, Z_LEG, BLUE);
    if (left) {
      addWheel(leg, X_LEG/2 + WHEEL_HEIGHT/2, -3.5, WHEEL_RADIUS - Z_LEG/2);
      addWheel(leg, X_LEG/2 + WHEEL_HEIGHT/2, 0.5, WHEEL_RADIUS - Z_LEG/2);

      leg.position.set(X_LEG/2, 0, 0);
    } else {
      addWheel(leg, - X_LEG/2 - WHEEL_HEIGHT/2, -3.5, WHEEL_RADIUS - Z_LEG/2);
      addWheel(leg, - X_LEG/2 - WHEEL_HEIGHT/2, 0.5, WHEEL_RADIUS - Z_LEG/2);

      leg.position.set(-X_LEG/2, 0, 0);
    }

    obj.add(leg);
}

function addLegs(obj) {
    'use strict';

    var legs = new THREE.Object3D();

    addLeg(legs, true);
    addLeg(legs, false);

    obj.add(legs);
}

function addLegsAndFeet(obj) {
    'use strict';

    var legsAndFeet = new THREE.Object3D();

    addLegs(legsAndFeet);
    addFeet(legsAndFeet);

    legsAndFeet.position.set(0, - Y_TIGHT - Y_LEG/2, Z_LEG/2);
    obj.add(legsAndFeet);
}

function addTights(obj) {
    'use strict';

    var tights = new THREE.Object3D();

    addBox(tights, -X_TIGHT/2, 0, 0, X_TIGHT, Y_TIGHT, Z_TIGHT, GREY);
    addBox(tights, X_TIGHT/2, 0, 0, X_TIGHT, Y_TIGHT, Z_TIGHT, GREY);

    tights.position.set(0, -Y_TIGHT/2, Z_TIGHT/2);
    obj.add(tights);
}

function addInferiorBody(obj) {
    'use strict';

    inferiorBody = new THREE.Object3D();

    addTights(inferiorBody);
    addLegsAndFeet(inferiorBody);

    inferiorBody.position.set(0, Y_LEG + Y_TIGHT, 0);
    obj.add(inferiorBody);
}

function addAbdomen() {}

function addSuperiorBody(obj) {
    'use strict';

    superiorBody = new THREE.Object3D();

    addAbdomen();

    superiorBody.position.set(0, Y_LEG + Y_TIGHT, 0);
    obj.add(superiorBody);
}

function addTransformer(x, y, z) {
    'use strict';

    transformer = new THREE.Object3D();

    addInferiorBody(transformer);
    addSuperiorBody(transformer);

    transformer.position.set(x, y, z);
    scene.add(transformer);
}

function addTrailer(x, y, z) {
    'use strict';

    trailer = new THREE.Object3D();

    addBox(trailer, 0, 6.5, -12, 8, 5, 24, WHITE); // trailer top
    addBox(trailer, 0, 2.5, -19, 6, 3, 10, GREY); // trailer base

    addWheel(trailer, -3.5, 1.5, -17.5);
    addWheel(trailer, 3.5, 1.5, -17.5);
    addWheel(trailer, -3.5, 1.5, -21.5);
    addWheel(trailer, 3.5, 1.5, -21.5);

    addBox(trailer, 0, 3.5, -0.5, 2, 1, 1, BLACK); // trailer hitch

    scene.add(trailer);

    trailer.position.x = x;
    trailer.position.y = y;
    trailer.position.z = z;
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
