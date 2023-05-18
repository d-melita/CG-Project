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

var trailer, transformer, inferiorBody, leftArm, rightArm, head, feet;

var armsShift = 0, feetRotation = 0, legsRotation = 0, headRotation = 0;
var armsMinShift = 0, armsMaxShift = 2, armsShiftSpeed = 0.04;
var feetMinRotation = 0, feetMaxRotation = Math.PI, feetRotationSpeed = 0.04;
var legsMinRotation = 0, legsMaxRotation = Math.PI/2, legsRotationSpeed = 0.02;
var headMinRotation = -Math.PI, headMaxRotation = 0, headRotationSpeed = 0.04;

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

var keys = {};

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
    window.addEventListener("keyup", onKeyUp);
}

////////////
/* UPDATE */
////////////

function update(){
    'use strict';

    for (const [key, val] of Object.entries(keys)) {
        val.call();
    }
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

    update();
    render();

    requestAnimationFrame(animate);

}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(20));
    scene.background = new THREE.Color(BACKGROUND_COLOR);

    addTrailer(0, 0, -10);
    addTransformer(0, -Y_LEG, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function getOrthographicCamera(pos_x, pos_y, pos_z) {
  const camera = new THREE.OrthographicCamera(-30, 30, 30, -30, 1, 100);
  camera.position.set(pos_x, pos_y, pos_z);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  return camera
}

function getTopCamera() {
  return getOrthographicCamera(0, 30, 0);
}

function getSideCamera() {
  return getOrthographicCamera(30, 0, 0);
}

function getFrontCamera() {
  return getOrthographicCamera(0, 0, 30);
}

function getIsometricCamera() {
  return getOrthographicCamera(30, 30, 30);
}

function getPerspectiveCamera() {
  const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 100
  );
  camera.position.set(30, 30, 30);
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

function addCylinder(obj, x, y, z, radius, height, rotation_axis, rotation_degree, color) {
    'use strict';

    var geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    switch (rotation_axis) {
      case 'x':
        geometry.rotateX(rotation_degree);
        break;
      case 'y':
        geometry.rotateY(rotation_degree);
        break;
      case 'z':
        geometry.rotateZ(rotation_degree);
        break;
      default:
        break;
    }
    var material = new THREE.MeshBasicMaterial({color: color, wireframe: false});
    var cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.set(x, y, z);
    obj.add(cylinder);
}

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

    var wheel = new THREE.Object3D();

    addCylinder(wheel, x, y, z, WHEEL_RADIUS, WHEEL_HEIGHT, 'z', Math.PI/2, BLACK);

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
    var x_mult;
    if (left) x_mult = 1; else x_mult = -1;

    addBox(leg, 0, 0, 0, X_LEG, Y_LEG, Z_LEG, BLUE);
    addWheel(leg, x_mult * (X_LEG/2 + WHEEL_HEIGHT/2), BACK_WHEEL_OFFSET, WHEEL_RADIUS - Z_LEG/2);
    addWheel(leg, x_mult * (X_LEG/2 + WHEEL_HEIGHT/2), MIDDLE_WHEEL_OFFSET, WHEEL_RADIUS - Z_LEG/2);

    leg.position.set(x_mult * X_LEG/2, 0, 0);

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

function addAntennas(obj) {
    'use strict';

    var antennas = new THREE.Object3D();

    addBox(antennas, X_HEAD/2 - X_ANTENNA/2, Y_HEAD/2, Z_HEAD/2, X_ANTENNA, Y_ANTENNA, Z_ANTENNA, BLUE);
    addBox(antennas, - X_HEAD/2 + X_ANTENNA/2, Y_HEAD/2, Z_HEAD/2, X_ANTENNA, Y_ANTENNA, Z_ANTENNA, BLUE);

    antennas.position.set(0, Y_HEAD/2 + Y_ANTENNA/2, 0);
    obj.add(antennas);
}

function addEyes(obj) {
    'use strict';

    var eyes = new THREE.Object3D();

    addCylinder(eyes, X_HEAD/4, 3*Y_HEAD/4, Z_HEAD, EYE_RADIUS, 0, 'x', Math.PI/2, BLUE);
    addCylinder(eyes, -X_HEAD/4, 3*Y_HEAD/4, Z_HEAD, EYE_RADIUS, 0, 'x', Math.PI/2, BLUE);

    obj.add(eyes);
}

function addHead(obj) {
    'use strict';

    head = new THREE.Object3D();

    addBox(head, 0, Y_HEAD/2, Z_HEAD/2, X_HEAD, Y_HEAD, Z_HEAD, RED);
    addAntennas(head);
    addEyes(head);

    head.position.set(0, Y_CHEST/2, -Z_CHEST/2);
    obj.add(head);
}

function addArm(obj, left) {
    'use strict';

    var arm = new THREE.Object3D();
    var x_mult; if(left) x_mult = 1; else x_mult = -1;

    addBox(arm, 0, 0, 0, X_ARM, Y_ARM, Z_ARM, RED);
    addBox(arm, x_mult * (X_ARM/2 - X_FOREARM/2), -Y_ARM/2 - Y_FOREARM/2, - Z_ARM/2 + Z_FOREARM/2, X_FOREARM, Y_FOREARM, Z_FOREARM, RED)
    addCylinder(arm, 0, ESCAPE_OFFSET, - Z_ARM/2 - ESCAPE_RADIUS, ESCAPE_RADIUS, ESCAPE_HEIGHT, '', 0, GREY);

    arm.position.set(x_mult * (X_CHEST/2 - X_ARM/2), 0, - Z_CHEST/2 - Z_ARM/2);
    obj.add(arm);

    return arm;
}

function addArms(obj) {
    'use strict';

    var arms = new THREE.Object3D();
    leftArm = addArm(arms, true);
    rightArm = addArm(arms, false);

    obj.add(arms);
}

function addChest(obj) {
    'use strict';

    var chest = new THREE.Object3D();

    addArms(chest);
    addHead(chest);
    addBox(chest, 0, 0, 0, X_CHEST, Y_CHEST, Z_CHEST, RED);

    chest.position.set(0, Y_ABDOMEN + Y_CHEST/2, Z_CHEST/2);
    obj.add(chest);
}

function addAbdomen(obj) {
    'use strict';

    var abdomen = new THREE.Object3D();

    addBox(abdomen, 0, Y_ABDOMEN/2, Z_ABDOMEN/2, X_ABDOMEN, Y_ABDOMEN, Z_ABDOMEN, RED);

    obj.add(abdomen);
}

function addWaist(obj) {
    'use strict';

    var waist = new THREE.Object3D();

    addBox(waist, 0, 0, 0, X_WAIST, Y_WAIST, Z_WAIST, GREY);
    addWheel(waist, X_WAIST/2 - WHEEL_HEIGHT/2, - Y_WAIST + WHEEL_RADIUS, - Z_WAIST/2 - WHEEL_RADIUS);
    addWheel(waist, - X_WAIST/2 + WHEEL_HEIGHT/2, - Y_WAIST + WHEEL_RADIUS, - Z_WAIST/2 - WHEEL_RADIUS);

    waist.position.set(0, - Y_WAIST/2, Z_CHEST - Z_WAIST/2);
    obj.add(waist);
}

function addSuperiorBody(obj) {
    'use strict';

    var superiorBody = new THREE.Object3D();

    addWaist(superiorBody);
    addAbdomen(superiorBody);
    addChest(superiorBody);

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

    function onLeftKeyDown() { trailer.position.x -= 0.1; }
    function onRightKeyDown() { trailer.position.x += 0.1; }
    function onUpKeyDown() { trailer.position.z += 0.1; }
    function onDownKeyDown() { trailer.position.z -= 0.1; }

    function onQKeyDown() { 
        if (feetRotation < feetMaxRotation) {
            feetRotation += feetRotationSpeed;
            feet.rotateX(feetRotationSpeed); 
        }
    }
    function onAKeyDown() { 
        if (feetRotation > feetMinRotation) {
            feetRotation -= feetRotationSpeed;
            feet.rotateX(-feetRotationSpeed);
        }
    }
    function onWKeyDown() { 
        if (legsRotation < legsMaxRotation) {
            legsRotation += legsRotationSpeed;
            inferiorBody.rotateX(legsRotationSpeed); 
        }
    }
    function onSKeyDown() { 
        if (legsRotation > legsMinRotation) {
            legsRotation -= legsRotationSpeed;
            inferiorBody.rotateX(-legsRotationSpeed);
        }
    }
    function onEKeyDown() { 
        if (armsShift < armsMaxShift) {
            armsShift += armsShiftSpeed;
            leftArm.position.x += armsShiftSpeed;
            rightArm.position.x -= armsShiftSpeed;
        }
    }
    function onDKeyDown() {
        if (armsShift > armsMinShift) {
            armsShift -= armsShiftSpeed;
            leftArm.position.x -= armsShiftSpeed;
            rightArm.position.x += armsShiftSpeed;
        }
    }
    function onRKeyDown() { 
        if (headRotation < headMaxRotation) {
            headRotation += headRotationSpeed;
            head.rotateX(headRotationSpeed); 
        }
    }
    function onFKeyDown() { 
        if (headRotation > headMinRotation) {
            headRotation -= headRotationSpeed;
            head.rotateX(-headRotationSpeed);
        }
    }

    switch (e.keyCode) {

        // switch cameras
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
            break;

        // case arrow keys: move trailer
        case 37: // left arrow
            keys[37] = onLeftKeyDown;
            break;
        case 38: // up arrow
            keys[38] = onUpKeyDown;
            break;
        case 39: // right arrow
            keys[39] = onRightKeyDown;
            break;
        case 40: // down arrow
            keys[40] = onDownKeyDown;
            break;

        // case letters: transition between truck and transformer
        case 81: // Q
            keys[81] = onQKeyDown;
            break;
        case 65: // A
            keys[65] = onAKeyDown;
            break;
        case 87: // W
            keys[87] = onWKeyDown;
            break;
        case 83: // S
            keys[83] = onSKeyDown;
            break;
        case 69: // E
            keys[69] = onEKeyDown;
            break;
        case 68: // D
            keys[68] = onDKeyDown;
            break;
        case 82: // R
            keys[82] = onRKeyDown;
            break;
        case 70: // F
            keys[70] = onFKeyDown;
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

    delete keys[e.keyCode];
}
