/* 
* Trabalho C - Transformer
* CG 2022/2023
* Diogo Melita ist199202
* João Rocha ist199256
* Grupo 33 - Alameda
* Média de horas de trabalho: 
*/

/* We can toggle the axis helper using the 'H' key */

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

let camera, scene, renderer, controls, perspective_camera;
let skyVar, skyScene, skyTexture, skyCamera;
let grass, grassScene, grassTexture, grassCamera;

let axesHelper;
let house, ovni, moon, tree, skyDome;

let ambientLight, spotLight, directionalLight;
let pointLights = [];
let materials = [];
let grassMesh = [];
let skyMesh = [];

const WHITE = new THREE.Color(0xffffff), BLACK = new THREE.Color(0x000000), BLUE = new THREE.Color(0x0000ff), RED = new THREE.Color(0xff0000), DARK_RED = new THREE.Color(0x960909), GREY = new THREE.Color(0x909090), BROWN = new THREE.Color(0x9c4f0c), GREEN = new THREE.Color(0x07820d), ORANGE = new THREE.Color(0xfc5203), PURPLE = new THREE.Color(0xa32cc4), YELLOW = new THREE.Color(0xf5e105);

const skyColors = [PURPLE, BLUE, BLUE, PURPLE];
const grassColors = [GREEN, GREEN, GREEN, GREEN];
const flowerColors = [WHITE, YELLOW, PURPLE, BLUE];
const numberOfStars = 500, numberOfFlowers = 200, starRadius = 0.01, flowerRadius = 0.05;

const PLANE_SIZE = 20, DOME_SIZE = 20;
const OVNI_HEIGHT = 30, OVNI_ROTATION_SPEED = 0.05;
const MOON_HEIGHT = 40, MOON_Z = 15, MOON_RADIUS = 4;
const HOUSE_Y = 4.5; // due to the heightmap, we need to put the house a bit higher so it doesnt get cropped
const TREE_Y = 5.5, TREE_Z = 30, numOfTrees = 10;
var trees = [];

const standardScale = 1;
const cockpitRadius = 2, ovniCockpitY = 1.5;
const onviBodyScaleX = 6, ovniBodyScaleY = 1.5, ovniBodyScaleZ = 6;
const ovniBaseRadius = 2, ovniBaseHeight = 2, ovniBaseY = -1.5;
const onviLightsX = 4, ovniLightsRadius = 1, onviLightsY = -0.5; //ovniLightsY = 2-1-1.5;

let movementVector = new THREE.Vector3(0, 0, 0);
const MOVEMENT_SPEED = 15;

let clock = new THREE.Clock();
let elapsedTime;

let keys = {};

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    document.body.appendChild( VRButton.createButton( renderer ) );
    renderer.xr.enabled = true;

    createScene();
    createCamera();
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

function on1KeyDown() { // 1 key
    for (var i = 0; i < grassMesh.length; i++) {
        grassMesh[i].position.set(Math.random() * PLANE_SIZE, 0, Math.random() * PLANE_SIZE);
    }
    delete keys[49];
}

function on2KeyDown() { // 2 key
    for (var i = 0; i < skyMesh.length; i++) {
        skyMesh[i].position.set(Math.random() * DOME_SIZE, 0, Math.random() * DOME_SIZE);
    }
    delete keys[50];
}

function on6KeyDown() { // 6 key
    for (var i = 0; i < materials.length; i++) {
        materials[i].wireframe = !materials[i].wireframe;
    }
    delete keys[54];
}

function onHKeyDown() { // H key
    axesHelper.visible = !axesHelper.visible;
    delete keys[72];
}

function onPKeyDown() { // P key - turn on/off point light
    for (var i = 0; i < pointLights.length; i++) {
        pointLights[i].visible = !pointLights[i].visible;
    }
    delete keys[80];
}

function onSKeyDown() { // S key - turn on/off spot light
    spotLight.visible = !spotLight.visible;
    delete keys[83];
}

function onDKeyDown() { // D key - turn on/off moondirectional light
    directionalLight.visible = !directionalLight.visible;
    delete keys[68];
}

function update(){
    'use strict';

    movementVector.set(0, 0, 0);

    for (const [key, val] of Object.entries(keys))
        val.call();

    ovni.rotateY(OVNI_ROTATION_SPEED);
    ovni.position.add(movementVector);
    spotLight.target.position.set(ovni.position.x, 0, ovni.position.z);
}

/////////////
/* DISPLAY */
/////////////

function render() {
    'use strict';

    renderer.setRenderTarget(grassTexture);
    renderer.render(grassScene, grassCamera, grassTexture);
    renderer.setRenderTarget(null);

    renderer.setRenderTarget(skyTexture);
    renderer.render(skyScene, skyCamera, skyTexture);
    renderer.setRenderTarget(null);

    //renderer.render(skyScene, skyCamera);
    //renderer.render(grassScene, grassCamera);
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

    axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);

    plane();
    sky();

    createAmbientLight();
    createDirectionalLight();

    addHouse(0, HOUSE_Y, 0);
    addOVNI(0, OVNI_HEIGHT, 0);
    addMoon(0, MOON_HEIGHT, MOON_Z);
    addTrees();
}

function plane() {
    'use strict';

    grassScene = new THREE.Scene();
    grassTexture = new THREE.WebGLRenderTarget(
        window.innerWidth, window.innerHeight, 
        { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter}
    );

    grass = generateTexture(grass, grassScene, grassTexture, grassColors, PLANE_SIZE);

    grassCamera = getPerspectiveCamera(
        25, grassTexture.width / grassTexture.height, 0.1, 1000000, 
        10, 20, 10, 10, 0, 10
    );
    grassScene.add(grassCamera);

    addExtra(grass, numberOfFlowers, flowerRadius, flowerColors, grassScene, grassMesh);
    createPlane();
}

function sky() {
    'use strict';

    skyScene = new THREE.Scene();
    skyTexture = new THREE.WebGLRenderTarget(
        window.innerWidth, window.innerHeight, 
        { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter}
    );

    skyVar = generateTexture(skyVar, skyScene, skyTexture, skyColors, DOME_SIZE);

    skyCamera = getPerspectiveCamera(
        25, skyTexture.width / skyTexture.height, 0.1, 1000000, 
        10, 20, 10, 10, 0, 10
    );
    skyScene.add(skyCamera);

    addExtra(skyVar, numberOfStars, starRadius, [WHITE], skyScene, skyMesh);
    createSkyDome();
}

function generateTexture(obj, newScene, newTexture, colors, textureSize) {

    const geometry = new THREE.BufferGeometry();
    const positions = [
        0, 0, 0, 
        0, 0, 1, 
        1, 0, 1, 
        1, 0, 0
    ].map((n) => n*textureSize);
    const indices = [
        0, 1, 2, 
        2, 3, 0
    ];
    colors = colors.flatMap((color) => [color.r, color.g, color.b,]);
  
    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  
    const material = new THREE.MeshBasicMaterial({vertexColors: true,});
  
    obj = new THREE.Mesh(geometry, material);
    newScene.add(obj);

    return obj;
}

// add stars or flowers
function addExtra(obj, numObjects, radius, colors, scene, meshArray) {
    'use strict';

    for (let i = 0; i < numObjects; i++) {
        let newObject = new THREE.SphereGeometry(radius, 32, 32);
        let newObjectMaterial = new THREE.MeshBasicMaterial(
            {color: colors[Math.floor(Math.random() * colors.length)]}
        );
        let newObjectMesh = new THREE.Mesh(newObject, newObjectMaterial);

        newObjectMesh.position.set(Math.random() * 20, 0, Math.random() * 20);

        obj.add(newObjectMesh);
        scene.add(newObjectMesh);
        meshArray.push(newObjectMesh);
    }
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCamera() {
    'use strict';
    camera = getPerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000000, 40, 40, 40, 0, 0, 0
    );

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();
}

function getPerspectiveCamera(fov, aspect, near, far, x, y, z, lookX, lookY, lookZ) {
    const camera = new THREE.PerspectiveCamera(
        fov, aspect, near, far
    );
    camera.position.set(x, y, z);
    camera.lookAt(new THREE.Vector3(lookX, lookY, lookZ));
    return camera;
  }

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createAmbientLight() {
    'use strict';
    ambientLight = new THREE.AmbientLight(WHITE, 0.5);
    scene.add(ambientLight);
}

function createDirectionalLight() {
    'use strict';
    directionalLight = new THREE.DirectionalLight(WHITE, 0.8);
    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);
}

function createSpotLight(obj) {
    'use strict';

    spotLight = new THREE.SpotLight(WHITE, 1, 100, 0.5, 1);
    obj.add(spotLight);

    let spotLightTarget = new THREE.Object3D(obj.position.x, 0, obj.position.z);
    spotLight.target = spotLightTarget;
    scene.add(spotLightTarget);
}

function createPointLight(obj) {
    'use strict';

    const light = new THREE.PointLight(WHITE, 1, 30);
    obj.add(light);
    pointLights.push(light);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createPlane() {
    'use strict';

    const loader = new THREE.TextureLoader();
    const displacementMap = loader.load('./textures/heightmap.png');

    const material = new THREE.MeshStandardMaterial({
        displacementMap: displacementMap,
        displacementScale: 20,
        side: THREE.DoubleSide,
        map: grassTexture.texture
    });

    const geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2; // make it horizontal
    scene.add(plane);
    materials.push(material);
}

function createSkyDome() {
    'use strict';

    let geometry = new THREE.SphereGeometry(100, 32, 32);
    let material = new THREE.MeshBasicMaterial({
        map: skyTexture.texture,
        side: THREE.BackSide
    });
    skyDome = new THREE.Mesh(geometry, material);
    skyDome.position.set(0, 0, 0);
    scene.add(skyDome);
    materials.push(material);
}

function addCylinder(obj, x, y, z, radius, height, rotation_axis, rotation_degree, color) {
    'use strict';

    let geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
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
    let material = new THREE.MeshStandardMaterial({color: color, wireframe: false});
    let cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.set(x, y, z);
    obj.add(cylinder);
    materials.push(material);
}

function addSphere(obj, x, y, z, radius, color) {
    'use strict';

    let geometry = new THREE.SphereGeometry(radius, 32, 32);
    let material = new THREE.MeshStandardMaterial({color: color, wireframe: false});
    let sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(x, y, z);
    obj.add(sphere);
    materials.push(material);
}

function addElipse(obj, x, y, z, xScale, yScale, zScale, color) {
    'use strict';

    addSphere(obj, x, y, z, 1, color);
    obj.scale.set(xScale, yScale, zScale);
}

function addCockpit(obj, x, y, z) {
    'use strict';

    let cockpit = new THREE.Object3D();
    addSphere(cockpit, 0, 0, 0, cockpitRadius, WHITE);

    cockpit.position.set(x, y, z);
    obj.add(cockpit);
}

function addBody(obj, x, y, z) {
    'use strict';

    let body = new THREE.Object3D();
    addElipse(body, 0, 0, 0, onviBodyScaleX, ovniBodyScaleY, ovniBodyScaleZ, BLACK); // main body

    body.position.set(x, y, z);
    obj.add(body);

}

function addBase(obj, x, y, z) {
    'use strict';

    let base = new THREE.Object3D();

    addCylinder(base, 0, 0, 0, ovniBaseRadius, ovniBaseHeight, '', 0, WHITE);
    createSpotLight(base);

    base.position.set(x, y, z);
    obj.add(base);
}

function addLights(obj, x, y, z) {
    'use strict';

    const NUMBER_LIGHTS = 8;

    let rotation = (2*Math.PI)/NUMBER_LIGHTS;

    for (var i = 0; i < NUMBER_LIGHTS; i++){
        let light = new THREE.Object3D();

        addSphere(light, onviLightsX, 0, 0, ovniLightsRadius, BLUE);
        createPointLight(light);

        light.rotateY(rotation*i);
        light.position.set(x, y, z);
        obj.add(light);
    }
}

function addOVNI(x, y, z) {
    'use strict';

    ovni = new THREE.Object3D();

    addCockpit(ovni, 0, ovniCockpitY, 0);
    addBody(ovni, 0, 0, 0);
    addBase(ovni, 0, ovniBaseY, 0);
    addLights(ovni, 0, onviLightsY, 0);

    ovni.position.set(x, y, z);
    scene.add(ovni);
}


function addGeometry(obj, x, y, z, vertices, indexs, color) {
    'use strict';
    
    let geometry = new THREE.Object3D();
    let bufferTexture = new THREE.BufferGeometry();
    bufferTexture.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    bufferTexture.setIndex(indexs);
    bufferTexture.computeVertexNormals();
    let material = new THREE.MeshStandardMaterial({color: color, wireframe: false});
    let mesh = new THREE.Mesh(bufferTexture, material);

    mesh.position.set(x, y, z);
    materials.push(material);
    geometry.add(mesh);
    obj.add(geometry);
}

function addHouse(x, y, z) {
    'use strict';
    // create house using polygon mesh
    house = new THREE.Object3D();

    let verticesWalls = [
        0, 0, 0,
        0, 0, 16,
        6, 0, 0,
        6, 0, 16,
        0, 8, 0,
        0, 8, 16,
        6, 8, 0,
        6, 8, 16,
        // door
        6, 0, 3,
        6, 0, 5,
        6, 4, 3,
        6, 4, 5,
        // window 1
        6, 3, 7,
        6, 3, 9,
        6, 6, 7,
        6, 6, 9,
        // window 2
        6, 3, 12,
        6, 3, 14,
        6, 6, 12,
        6, 6, 14,
    ];
    const indexsWalls = [
        0, 1, 2,
        2, 3, 1,
        0, 1, 5,
        0, 5, 4,
        0, 4, 6,
        0, 6, 2,
        1, 3, 7,
        1, 7, 5,
        6, 10, 2,
        10, 8, 2,
        11, 10, 14,
        11, 14, 12,
        9, 11, 12,
        14, 10, 6,
        15, 14, 6,
        7, 15, 6,
        18, 15, 7,
        7, 19, 18,
        7, 3, 19,
        3, 17, 19,
        3, 16, 17,
        3, 9, 16,
        9, 13, 16,
        9, 12, 13,
        16, 13, 15, 
        16, 15, 18
    ];

    const doorWindowsIndexs = [
        9, 8, 10,
        9, 10, 11,
        13, 12, 14,
        13, 14, 15,
        17, 16, 18, 
        17, 18, 19
    ]

    addGeometry(house, 0, 0, 0, verticesWalls, indexsWalls, WHITE);
    addGeometry(house, 0, 0, 0, verticesWalls, doorWindowsIndexs, BLUE);

    let verticesRoof = [
        0, 8, 0,
        0, 8, 16,
        6, 8, 0,
        6, 8, 16,
        3, 10, 8
    ];
    const indexsRoof = [
        0, 1, 4,
        1, 3, 4,
        3, 2, 4,
        2, 0, 4,
    ];
    addGeometry(house, 0, 0, 0, verticesRoof, indexsRoof, ORANGE);
    house.position.set(x, y, z);
    scene.add(house);
}

function addMoon(x, y, z) {
    'use strict';

    let geometry = new THREE.SphereGeometry(MOON_RADIUS, 32, 32);
    let material = new THREE.MeshStandardMaterial({
        color: YELLOW, wireframe: false, emissive: YELLOW, emissiveIntensity: 0.8
    });
    moon = new THREE.Mesh(geometry, material);

    materials.push(material);
    moon.position.set(x, y, z);
    scene.add(moon);
}

function addLeaves(obj, x, y, z) {
    'use strict';

    let leaves = new THREE.Object3D();
    addElipse(leaves, 0, 0, 0, 2, 1, 4, GREEN);

    leaves.position.set(x, y, z);
    obj.add(leaves);
}

function addTrunks(obj, x, y, z) {
    'use strict';

    var baseTrunk = new THREE.Object3D();
    var trunk1 = new THREE.Object3D();
    var trunk2 = new THREE.Object3D();
    var topTrunks = new THREE.Object3D();

    addCylinder(baseTrunk, 0, 0, 0, 1, 3, '', 0, BROWN);
    addCylinder(trunk1, 0, 3.2, 1.3, 1, 5.2, 'x', Math.PI/4, BROWN);
    addCylinder(trunk2, 0, 4.2, -2, 1, 7, 'x', -Math.PI/4, BROWN);
    addLeaves(trunk1, 0, 5, 3);
    addLeaves(trunk2, 0, 7, -4);

    topTrunks.add(trunk1);
    topTrunks.add(trunk2);
    topTrunks.rotateY(Math.random()*Math.PI*2);
    baseTrunk.add(topTrunks);

    baseTrunk.position.set(x, y, z);
    obj.add(baseTrunk);
}

function addTree(x, y, z, size) {
    'use strict';

    tree = new THREE.Object3D();

    addTrunks(tree, 0, 0, 0, size);

    tree.scale.set(1, size, 1);
    tree.position.set(x, y, z);
    scene.add(tree);
    trees.push(tree);
}

function addTrees() {
    'use strict';

    for (let i = 0; i < numOfTrees; i++) {
        let x = Math.random() * 100 - 50;
        let z = Math.random() * 100 - 50;
        let size = Math.random() + 1;
        addTree(x, TREE_Y, z, size);
    }
    // TODO check if trees colide with each other, with the house and if they are to close to the border
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

        // number keys: change scenery
        case 49: // 1
            keys[49] = on1KeyDown;
            break;
        case 50: // 2
            keys[50] = on2KeyDown;
            break;

        // regular keys: change lights
        case 80: // P
            keys[80] = onPKeyDown;
            break;
        case 83: // S
            keys[83] = onSKeyDown;
            break;
        case 68: // D
            keys[68] = onDKeyDown;
            break;

        // case arrow keys: move ovni
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

        // extra keys: toggle wireframe and axis helper
        case 54: // 6
            keys[54] = on6KeyDown;
            break;
        case 72: // H
            keys[72] = onHKeyDown;
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
