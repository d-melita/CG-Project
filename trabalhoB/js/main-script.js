/* 
* Trabalho B - Transformer
* CG 2022/2023
* Diogo Melita ist199202
* João Rocha ist199256
* Grupo 33 - Alameda
* Média de horas de trabalho: 10h
*/

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;

var trailer, trailerHitch;
var transformer, inferiorBody, leftArm, rightArm, head, feet;

var materials = [];

const frustumSize = 50;

var armsShift = 2, feetRotation = 0, legsRotation = 0, headRotation = 0;
const ARMS_MIN_SHIFT = 0, ARMS_MAX_SHIFT = 2, ARMS_SHIFT_SPEED = 5;
const FEET_MIN_ROTATION = 0, FEET_MAX_ROTATION = Math.PI, FEET_ROTATION_SPEED = 5;
const LEGS_MIN_ROTATION = 0, LEGS_MAX_ROTATION = Math.PI/2, LEGS_ROTATION_SPEED = 2;
const HEAD_MIN_ROTATION = -Math.PI, HEAD_MAX_ROTATION = 0, HEAD_ROTATION_SPEED = 5;

const WHITE = 0xffffff, BLACK = 0x000000, BLUE = 0x004bc4, RED = 0xff0000, DARK_RED = 0x960909, GREY = 0x909090, BACKGROUND_COLOR = 0xccf7ff;

const Z_TRANSFORMER_POSITION = 10;
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
const EYE_HEIGHT = 0.01;
const X_ANTENNA = 0.5, Y_ANTENNA = 0.5, Z_ANTENNA = 0.5;
const Z_TRAILER_INITIAL_POSITION = -10;
const X_TRAILER_TOP = 8, Y_TRAILER_TOP = 5, Z_TRAILER_TOP = 24;
const X_TRAILER_HITCH = 2, Y_TRAILER_HITCH = 1, Z_TRAILER_HITCH = 1;
const X_TRAILER_BOTTOM = 6, Y_TRAILER_BOTTOM = 3, Z_TRAILER_BOTTOM = 10;
const TRAILER_BACK_WHEEL_POSITION = -17.5, TRAILER_MIDDLE_WHEEL_POSITION = -21.5;

var movementVector = new THREE.Vector3(0, 0, 0);
const MOVEMENT_SPEED = 15;

var trailerState = 'detached';
const TRAILER_CONNECTION = new THREE.Vector3(0, 2*WHEEL_RADIUS + Y_TRAILER_HITCH/2, Z_TRANSFORMER_POSITION - Y_TIGHT - Z_TRAILER_HITCH);
const TRAILER_CONNECTION_SPEED = 0.1;

var conversion_keys = {}, non_conversion_keys = {};
var clock = new THREE.Clock();
var elapsedTime;

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

function onLeftKeyDown() { movementVector.x -= MOVEMENT_SPEED * elapsedTime; }
function onRightKeyDown() { movementVector.x += MOVEMENT_SPEED * elapsedTime; }
function onUpKeyDown() { movementVector.z += MOVEMENT_SPEED * elapsedTime; }
function onDownKeyDown() { movementVector.z -= MOVEMENT_SPEED * elapsedTime; }

function onQKeyDown() { // Q key
    let rotate = Math.min(FEET_ROTATION_SPEED * elapsedTime, FEET_MAX_ROTATION - feetRotation);
    feetRotation += rotate;
    feet.rotateX(rotate); 
}
function onAKeyDown() { // A key
    let rotate = Math.min(FEET_ROTATION_SPEED * elapsedTime, feetRotation - FEET_MIN_ROTATION);
    feetRotation -= rotate;
    feet.rotateX(-rotate);
}
function onWKeyDown() { // W key
    let rotate = Math.min(LEGS_ROTATION_SPEED * elapsedTime, LEGS_MAX_ROTATION - legsRotation);
    legsRotation += rotate;
    inferiorBody.rotateX(rotate); 
}
function onSKeyDown() { // S key
    let rotate = Math.min(LEGS_ROTATION_SPEED * elapsedTime, legsRotation - LEGS_MIN_ROTATION);
    legsRotation -= rotate;
    inferiorBody.rotateX(-rotate);
}
function onEKeyDown() { // E key
    let shift = Math.min(ARMS_SHIFT_SPEED * elapsedTime, ARMS_MAX_SHIFT - armsShift);
    armsShift += shift;
    leftArm.position.x += shift;
    rightArm.position.x -= shift;
}
function onDKeyDown() { // D key
    let shift = Math.min(ARMS_SHIFT_SPEED * elapsedTime, armsShift - ARMS_MIN_SHIFT);
    armsShift -= shift;
    leftArm.position.x -= shift;
    rightArm.position.x += shift;
}
function onRKeyDown() { // R key
    let rotate = Math.min(HEAD_ROTATION_SPEED * elapsedTime, HEAD_MAX_ROTATION - headRotation);
    headRotation += rotate;
    head.rotateX(rotate); 
}
function onFKeyDown() { // F key
    let rotate = Math.min(HEAD_ROTATION_SPEED * elapsedTime, headRotation - HEAD_MIN_ROTATION);
    headRotation -= rotate;
    head.rotateX(-rotate);
}

function on1KeyDown() { // 1 key
    switchCamera(getTopCamera());
}
function on2KeyDown() { // 2 key
    switchCamera(getSideCamera());
}
function on3KeyDown() { // 3 key
    switchCamera(getFrontCamera());
}
function on4KeyDown() { // 4 key
    switchCamera(getIsometricCamera());
}
function on5KeyDown() { // 5 key
    switchCamera(getPerspectiveCamera());
}
function on6KeyDown() { // 6 key
    for (var i = 0; i < materials.length; i++) {
        materials[i].wireframe = !materials[i].wireframe;
    }
    delete non_conversion_keys[54];
}

function update(){
    'use strict';

    movementVector.set(0, 0, 0);

    for (const [key, val] of Object.entries(non_conversion_keys))
        val.call();

    handleCollisions();
    if (trailerState == 'attaching') return;

    for (const [key, val] of Object.entries(conversion_keys))
        val.call();
    trailer.position.add(movementVector);
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
    elapsedTime = clock.getDelta();
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

    addTrailer(0, 0, Z_TRAILER_INITIAL_POSITION);
    addTransformer(0, -Y_LEG, Z_TRANSFORMER_POSITION);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function getOrthographicCamera(pos_x, pos_y, pos_z) {
  const aspect = window.innerWidth / window.innerHeight;
  const camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 100);
  camera.position.set(pos_x, pos_y, pos_z);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  return camera;
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
    materials.push(material);
}

function addBox(obj, x, y, z, length, height, width, color) {
    'use strict';

    var geometry = new THREE.BoxGeometry(length, height, width);
    var material = new THREE.MeshBasicMaterial({color: color, wireframe: false});
    var box = new THREE.Mesh(geometry, material);

    box.position.set(x, y, z);
    obj.add(box);
    materials.push(material);
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
    addWheel(leg, 
        x_mult * (X_LEG/2 + WHEEL_HEIGHT/2), BACK_WHEEL_OFFSET, WHEEL_RADIUS - Z_LEG/2
    );
    addWheel(leg, 
        x_mult * (X_LEG/2 + WHEEL_HEIGHT/2), MIDDLE_WHEEL_OFFSET, WHEEL_RADIUS - Z_LEG/2
    );

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

    addBox(antennas, 
        X_HEAD/2 - X_ANTENNA/2, Y_HEAD/2, Z_HEAD/2, 
        X_ANTENNA, Y_ANTENNA, Z_ANTENNA, 
    BLUE);
    addBox(antennas, 
        - X_HEAD/2 + X_ANTENNA/2, Y_HEAD/2, Z_HEAD/2, 
        X_ANTENNA, Y_ANTENNA, Z_ANTENNA, 
    BLUE);

    antennas.position.set(0, Y_HEAD/2 + Y_ANTENNA/2, 0);
    obj.add(antennas);
}

function addEyes(obj) {
    'use strict';

    var eyes = new THREE.Object3D();

    addCylinder(eyes, X_HEAD/4, 3*Y_HEAD/4, Z_HEAD, EYE_RADIUS, EYE_HEIGHT, 'x', Math.PI/2, BLUE);
    addCylinder(eyes, -X_HEAD/4, 3*Y_HEAD/4, Z_HEAD, EYE_RADIUS, EYE_HEIGHT, 'x', Math.PI/2, BLUE);

    obj.add(eyes);
}

function addHead(obj) {
    'use strict';

    head = new THREE.Object3D();

    addBox(head, 0, Y_HEAD/2, Z_HEAD/2, X_HEAD, Y_HEAD, Z_HEAD, DARK_RED);
    addAntennas(head);
    addEyes(head);

    head.position.set(0, Y_CHEST/2, -Z_CHEST/2);
    obj.add(head);
}

function addArm(obj, left) {
    'use strict';

    var arm = new THREE.Object3D();
    var x_mult; if(left) x_mult = 1; else x_mult = -1;

    addBox(arm, 0, 0, 0, X_ARM, Y_ARM, Z_ARM, DARK_RED);
    addBox(arm, 
        x_mult * (X_ARM/2 - X_FOREARM/2), -Y_ARM/2 - Y_FOREARM/2, - Z_ARM/2 + Z_FOREARM/2, 
        X_FOREARM, Y_FOREARM, Z_FOREARM, 
    DARK_RED)
    addCylinder(arm, 
        0, ESCAPE_OFFSET, - Z_ARM/2 - ESCAPE_RADIUS, 
        ESCAPE_RADIUS, ESCAPE_HEIGHT, 
    '', 0, GREY);

    arm.position.set(x_mult * (armsShift + X_CHEST/2 - X_ARM/2), 0, - Z_CHEST/2 - Z_ARM/2);
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

    addBox(abdomen, 
        0, Y_ABDOMEN/2, Z_ABDOMEN/2, 
        X_ABDOMEN, Y_ABDOMEN, Z_ABDOMEN, 
    RED);

    obj.add(abdomen);
}

function addWaist(obj) {
    'use strict';

    var waist = new THREE.Object3D();

    addBox(waist, 0, 0, 0, X_WAIST, Y_WAIST, Z_WAIST, GREY);
    addWheel(waist, 
        X_WAIST/2 - WHEEL_HEIGHT/2, - Y_WAIST + WHEEL_RADIUS, - Z_WAIST/2 - WHEEL_RADIUS
    );
    addWheel(waist, 
        - X_WAIST/2 + WHEEL_HEIGHT/2, - Y_WAIST + WHEEL_RADIUS, - Z_WAIST/2 - WHEEL_RADIUS
    );

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

    // Vectors for AABB Box
    transformer.min = new THREE.Vector3();
    transformer.max = new THREE.Vector3();

    transformer.position.set(x, y, z);
    scene.add(transformer);
}

function addTrailerHitch(obj) {
    'use strict';

    trailerHitch = new THREE.Object3D();

    addBox(trailerHitch, 0, 0, 0, X_TRAILER_HITCH, Y_TRAILER_HITCH, Z_TRAILER_HITCH, BLACK);

    trailerHitch.position.set( 0, 1 + Y_TRAILER_BOTTOM - Y_TRAILER_HITCH/2, -Z_TRAILER_HITCH/2);
    obj.add(trailerHitch);
}

function addTrailer(x, y, z) {
    'use strict';

    trailer = new THREE.Object3D();

    addBox(trailer, 
        0, 1 + Y_TRAILER_BOTTOM + Y_TRAILER_TOP/2, -Z_TRAILER_TOP/2, 
        X_TRAILER_TOP, Y_TRAILER_TOP, Z_TRAILER_TOP, 
    WHITE);
    addBox(trailer, 
        0, 1 + Y_TRAILER_BOTTOM/2, - Z_TRAILER_TOP + Z_TRAILER_BOTTOM/2, 
        X_TRAILER_BOTTOM, Y_TRAILER_BOTTOM, Z_TRAILER_BOTTOM, 
    GREY);
    addTrailerHitch(trailer);

    addWheel(trailer, 
        - X_TRAILER_BOTTOM/2 - WHEEL_HEIGHT/2, WHEEL_RADIUS, TRAILER_MIDDLE_WHEEL_POSITION
    );
    addWheel(trailer, 
        X_TRAILER_BOTTOM/2 + WHEEL_HEIGHT/2, WHEEL_RADIUS, TRAILER_MIDDLE_WHEEL_POSITION
    );
    addWheel(trailer, 
        - X_TRAILER_BOTTOM/2 - WHEEL_HEIGHT/2, WHEEL_RADIUS, TRAILER_BACK_WHEEL_POSITION
    );
    addWheel(trailer, 
        X_TRAILER_BOTTOM/2 + WHEEL_HEIGHT/2, WHEEL_RADIUS, TRAILER_BACK_WHEEL_POSITION
    );

    // Vectors for AABB Box
    trailer.min = new THREE.Vector3();
    trailer.max = new THREE.Vector3();

    trailer.position.set(x, y, z);
    scene.add(trailer);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////

function checkTruckMode() { // check if transformer is in truck mode
    'use strict';

    var THRESHOLD = 0.05;
    return Math.abs(headRotation - HEAD_MIN_ROTATION) < THRESHOLD &&
           Math.abs(feetRotation - FEET_MAX_ROTATION) < THRESHOLD &&
           Math.abs(legsRotation - LEGS_MAX_ROTATION) < THRESHOLD &&
           Math.abs(armsShift - ARMS_MIN_SHIFT) < THRESHOLD;
}

function checkTrailerPositioned() {
    'use strict';

    var trailerHitchPosition = new THREE.Vector3();
    trailerHitch.getWorldPosition(trailerHitchPosition);
    return trailerHitchPosition.distanceTo(TRAILER_CONNECTION) == 0;
}

function checkCollision(obj1, obj2){
    'use strict';

    return obj1.max.x >= obj2.min.x && obj1.min.x <= obj2.max.x &&
        obj1.max.y >= obj2.min.y && obj1.min.y <= obj2.max.y &&
        obj1.max.z >= obj2.min.z && obj1.min.z <= obj2.max.z;
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////

function moveTrailerToConnection() {
    'use strict';

    var trailerHitchPosition = new THREE.Vector3();
    trailerHitch.getWorldPosition(trailerHitchPosition);

    movementVector.addScaledVector(trailerHitchPosition, -1);
    movementVector.add(TRAILER_CONNECTION);

    let THRESHOLD = 0.05;
    if (trailerHitchPosition.distanceTo(TRAILER_CONNECTION) >= THRESHOLD) {
        movementVector.multiplyScalar(TRAILER_CONNECTION_SPEED)
    }

    trailer.position.add(movementVector);
}

function updateAABBBox(obj, x_min, y_min, z_min, x_max, y_max, z_max) {
    'use strict';

    obj.getWorldPosition(obj.min);
    obj.min.add(new THREE.Vector3(x_min, y_min, z_min));

    obj.getWorldPosition(obj.max);
    obj.max.add(new THREE.Vector3(x_max, y_max, z_max));
}

function updateAABBBoxes() {
    'use strict';

    updateAABBBox(trailer, 
        -X_TRAILER_TOP/2, 0, -Z_TRAILER_TOP,
        X_TRAILER_TOP/2, 1 + Y_TRAILER_BOTTOM + Y_TRAILER_TOP, 0
    );

    updateAABBBox(transformer, 
        - X_CHEST/2, Y_LEG, - Y_TIGHT - Y_LEG - Y_FOOT, 
        X_CHEST/2, Y_LEG + 2*WHEEL_RADIUS + Y_FOREARM + Y_CHEST, 2*WHEEL_RADIUS + Z_WAIST
    );
    var vec = new THREE.Vector3();
    transformer.getWorldPosition(vec);
}

function handleCollisions(){
    'use strict';

    if (!checkTruckMode()) return;

    updateAABBBoxes();

    if (trailerState == 'detached' && checkCollision(trailer, transformer)) {
        trailerState = 'attaching';
    } else if (trailerState == 'attaching' && checkTrailerPositioned()) {
        trailerState = 'attached';
    } else if (trailerState == 'attached' && !checkCollision(trailer, transformer)) {
        trailerState = 'detached';
    } else if (trailerState == 'attaching') {
        moveTrailerToConnection();
    }
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

    switch (e.keyCode) {

        // switch cameras
        case 49: // 1
            non_conversion_keys[49] = on1KeyDown;
            break;
        case 50: // 2
            non_conversion_keys[50] = on2KeyDown;
            break;
        case 51: // 3
            non_conversion_keys[51] = on3KeyDown;
            break;
        case 52: // 4
            non_conversion_keys[52] = on4KeyDown;
            break;
        case 53: // 5
            non_conversion_keys[53] = on5KeyDown;
            break;
        case 54: // 6
            non_conversion_keys[54] = on6KeyDown;
            break;

        // case arrow conversion_keys: move trailer
        case 37: // left arrow
            conversion_keys[37] = onLeftKeyDown;
            break;
        case 38: // up arrow
            conversion_keys[38] = onUpKeyDown;
            break;
        case 39: // right arrow
            conversion_keys[39] = onRightKeyDown;
            break;
        case 40: // down arrow
            conversion_keys[40] = onDownKeyDown;
            break;

        // case letters: transition between truck and transformer
        case 81: // Q
            conversion_keys[81] = onQKeyDown;
            break;
        case 65: // A
            conversion_keys[65] = onAKeyDown;
            break;
        case 87: // W
            conversion_keys[87] = onWKeyDown;
            break;
        case 83: // S
            conversion_keys[83] = onSKeyDown;
            break;
        case 69: // E
            conversion_keys[69] = onEKeyDown;
            break;
        case 68: // D
            conversion_keys[68] = onDKeyDown;
            break;
        case 82: // R
            conversion_keys[82] = onRKeyDown;
            break;
        case 70: // F
            conversion_keys[70] = onFKeyDown;
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

    delete conversion_keys[e.keyCode];
    delete non_conversion_keys[e.keyCode];
}
