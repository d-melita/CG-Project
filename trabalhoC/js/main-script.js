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

var camera, scene, renderer, controls, perspective_camera;
var skyVar, skyScene, skyTexture, skyCamera;
var grass, grassScene, grassTexture, grassCamera;

var axesHelper;
var house, ovni, moon, tree, skyDome;

var ambientLight, spotLight, moonDirectionalLight;
var pointLights = [];
var materials = [];
var grassMesh = [];
var skyMesh = [];

const WHITE = new THREE.Color(0xffffff), BLACK = new THREE.Color(0x000000), BLUE = new THREE.Color(0x0000ff), RED = new THREE.Color(0xff0000), DARK_RED = new THREE.Color(0x960909), GREY = new THREE.Color(0x909090), BROWN = new THREE.Color(0x9c4f0c), GREEN = new THREE.Color(0x07820d), ORANGE = new THREE.Color(0xfc5203), PURPLE = new THREE.Color(0xa32cc4), YELLOW = new THREE.Color(0xf5e105);

const skyColors = [PURPLE, BLUE, BLUE, PURPLE];
const grassColors = [GREEN, GREEN, GREEN, GREEN];
const flowerColors = [WHITE, YELLOW, PURPLE, BLUE];
const numberOfStars = 500, numberOfFlowers = 200, starRadius = 0.01, flowerRadius = 0.05;

const OVNI_HEIGHT = 30;
const MOON_HEIGHT = 40, MOON_Z = 15, MOON_RADIUS = 4;
const HOUSE_Y = 4.5; // due to the heightmap, we need to put the house a bit higher so it doesnt get cropped
const TREE_Y = 5.5, TREE_Z = 30, numOfTrees = 10;
var trees = [];

const standardScale = 1;
const cockpitRadius = 2, ovniCockpitY = 1.5;
const ovniBodyRadius = 1, onviBodyScaleX = 6, ovniBodyScaleY = 1.5, ovniBodyScaleZ = 6;
const ovniBaseRadius = 2, ovniBaseHeight = 2, ovniBaseY = -1.5;
const onviLightsX = 4, ovniLightsRadius = 1, onviLightsY = -0.5; //ovniLightsY = 2-1-1.5;

var movementVector = new THREE.Vector3(0, 0, 0);
const MOVEMENT_SPEED = 15;

var clock = new THREE.Clock();
var elapsedTime;

var keys = {};

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
        grassMesh[i].position.set(Math.random() * 20, 0, Math.random() * 20);
    }
    delete keys[49];
}

function on2KeyDown() { // 2 key
    for (var i = 0; i < skyMesh.length; i++) {
        skyMesh[i].position.set(Math.random() * 20, 0, Math.random() * 20);
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
    moonDirectionalLight.visible = !moonDirectionalLight.visible;
    delete keys[68];
}

function update(){
    'use strict';

    movementVector.set(0, 0, 0);

    for (const [key, val] of Object.entries(keys))
        val.call();

    for (const [key, val] of Object.entries(keys))
        val.call();

    ovni.rotateY(0.05);
    ovni.position.add(movementVector);
    spotLight.target.position.set(ovni.position.x, 0, ovni.position.z);
}

/////////////
/* DISPLAY */
/////////////

function render() {
    'use strict';
    renderer.setRenderTarget(grassTexture);
    renderer.render(grassScene, grassCamera);
    renderer.setRenderTarget(null);

    renderer.setRenderTarget(skyTexture);
    renderer.render(skyScene, skyCamera);
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
    addHouse(0, HOUSE_Y, 0);
    addOVNI(0, OVNI_HEIGHT, 0);
    addMoon(0, MOON_HEIGHT, MOON_Z);
    addTrees();
}

function plane() {
    'use strict';

    grassScene = new THREE.Scene();
    grassTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});

    generateTexture(grass, grassScene, grassTexture, grassColors);
    createPlane();
}

function sky() {
    'use strict';

    skyScene = new THREE.Scene();
    skyTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});

    generateTexture(skyVar, skyScene, skyTexture, skyColors);
    createSkyDome();
}

function generateTexture(obj, newScene, newTexture, colors) {

    const geometry = new THREE.BufferGeometry();
    const positions = [0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0].map((n) => n  * 20);
    const indices = [0, 1, 2, 2, 3, 0];
    colors = colors.flatMap((color) => [color.r, color.g, color.b,]);
  
    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  
    const material = new THREE.MeshBasicMaterial({vertexColors: true,});
  
    obj = new THREE.Mesh(geometry, material);
    obj.position.set(0, 0, 0);
    newScene.add(obj);

    let newCamera = getPerspectiveCamera(25, newTexture.width / newTexture.height, 0.1, 1000000, obj.position.x+10, obj.position.y+20, obj.position.z+10, 10, 0, 10);

    // weird if statement, doesnt work if I set an argument called camera - it works tho
    if (newScene == grassScene) {
        grassCamera = newCamera;
        newScene.add(grassCamera);
        addExtra(obj, numberOfFlowers, flowerRadius, flowerColors, newScene, grassMesh);
    }
    else if (newScene == skyScene) {
        skyCamera = newCamera;
        newScene.add(skyCamera);
        addExtra(obj, numberOfStars, starRadius, [WHITE], newScene, skyMesh);
    }
}

function addExtra(obj, numObjects, radius, colors, scene, meshArray) { // add stars or flowers
    'use strict';

    for (let i = 0; i < numObjects; i++) {
        var newObject = new THREE.SphereGeometry(radius, 32); 
        var newObjectMaterial = new THREE.MeshBasicMaterial({color: colors[Math.floor(Math.random() * colors.length)]});
        var newObjectMesh = new THREE.Mesh(newObject, newObjectMaterial);
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
    camera = getPerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000, 40, 40, 40, 0, 0, 0);

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

function createDirectionalLight(obj) {
    'use strict';
    // add directional light to moon
    moonDirectionalLight = new THREE.DirectionalLight(YELLOW, 0.8);
    moonDirectionalLight.position.set(0, 0, 0);
    moonDirectionalLight.target.position.set(0, 0, 0);
    obj.add(moonDirectionalLight);
}

function createSpotLight(obj, x, y, z) {
    'use strict';

    // add spot light to ovni
    spotLight = new THREE.SpotLight(0xffffff, 1, 100, 0.5, 1);
    spotLight.position.set(x, y, z);
    obj.add(spotLight);
    var spotLightTarget = new THREE.Object3D();
    spotLightTarget.position.set(obj.position.x, 0, obj.position.z);
    spotLight.target = spotLightTarget;
    obj.add(spotLightTarget);
    scene.add(spotLightTarget);
}

function createPontualLight(obj, x, y, z) {
    'use strict';

    const light = new THREE.PointLight(0xffffff, 1, 30);
    light.position.set(x, y, z);
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

    var geometry = new THREE.SphereGeometry(100, 32, 32);
    var material = new THREE.MeshBasicMaterial({
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

function addElipse(obj, x, y, z, radius, color, xScale, yScale, zScale) {
    'use strict';

    var geometry = new THREE.SphereGeometry(radius, 32, 32);
    var material = new THREE.MeshBasicMaterial({color: color, wireframe: false});
    var sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(x, y, z);
    obj.scale.set(xScale, yScale, zScale);
    obj.add(sphere);
    materials.push(material);
}

function addCockpit(obj, x, y, z) {
    'use strict';

    var cockpit = new THREE.Object3D();
    addElipse(cockpit, 0, 0, 0, cockpitRadius, WHITE, standardScale, standardScale, standardScale);

    cockpit.position.set(x, y, z);
    obj.add(cockpit);

}

function addBody(obj, x, y, z) {
    'use strict';

    var body = new THREE.Object3D();
    addElipse(body, 0, 0, 0, ovniBodyRadius, BLACK, onviBodyScaleX, ovniBodyScaleY, ovniBodyScaleZ); // main body

    body.position.set(x, y, z);
    obj.add(body);

}

function addBase(obj, x, y, z) {
    'use strict';

    var base = new THREE.Object3D();

    addCylinder(base, 0, 0, 0, ovniBaseRadius, ovniBaseHeight, '', 0, WHITE);
    base.position.set(x, y, z);
    obj.add(base);
}

function addLights(obj, x, y, z) {
    'use strict';

    var rotation = Math.PI/4

    for (var i = 0; i < 8; i++){
        var light = new THREE.Object3D();

        addElipse(light, onviLightsX, 0, 0, ovniLightsRadius, BLUE, standardScale, standardScale, standardScale);

        light.rotateY(rotation*i);
        light.position.set(x, y, z);
        createPontualLight(light, 0, 0, 0);
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
    createSpotLight(ovni, 0, 0, 0);
    scene.add(ovni);
}


function addGeometry(obj, x, y, z, vertices, indexs, color) {
    'use strict';
    
    var geometry = new THREE.Object3D();
    var bufferTexture = new THREE.BufferGeometry();
    
    bufferTexture.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    bufferTexture.setIndex(indexs);
    bufferTexture.computeVertexNormals();
    let material = new THREE.MeshBasicMaterial({color: color, wireframe: false});
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
    var verticesWalls = [
        0, 0, 0,
        0, 0, 16,
        6, 0, 0,
        6, 0, 16,
        0, 8, 0,
        0, 8, 16,
        6, 8, 0,
        6, 8, 16,
        // door
        6, 0, 4,
        6, 0, 6,
        6, 4, 4,
        6, 4, 6,
        // window 1
        6, 3, 7,
        6, 3, 9,
        6, 6, 7,
        6, 6, 9,
        // window 2
        6, 3, 13,
        6, 3, 15,
        6, 6, 13,
        6, 6, 15,
    ];
    const indexsWalls = [
        0, 1, 2, 2, 3, 1,
        0, 1, 5, 0, 5, 4,
        0, 4, 6, 0, 6, 2,
        1, 3, 7, 1, 7, 5,
        6, 10, 2, 10, 8, 2,
        11, 10, 14, 11, 14, 12,
        9, 11, 12, 14, 10, 6,
        15, 14, 6, 7, 15, 6,
        18, 15, 7, 7, 19, 18,
        7, 3, 19, 3, 17, 19,
        3, 16, 17, 3, 9, 16,
        9, 13, 16, 9, 12, 13,
        16, 13, 15, 16, 15, 18
    ];

    const doorWindowsIndexs = [
        9, 8, 10, 9, 10, 11,
        13, 12, 14, 13, 14, 15,
        17, 16, 18, 17, 18, 19
    ]

    addGeometry(house, 0, 0, 0, verticesWalls, indexsWalls, WHITE);
    addGeometry(house, 0, 0, 0, verticesWalls, doorWindowsIndexs, BLUE);

    var verticesRoof = [
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

    moon = new THREE.Object3D();
    var geometry = new THREE.SphereGeometry(MOON_RADIUS, 32, 32);
    var material = new THREE.MeshStandardMaterial({color: YELLOW, wireframe: false, emissive: YELLOW, emissiveIntensity: 0.5});
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, 0);
    moon.add(sphere);
    materials.push(material);
    moon.position.set(x, y, z);
    createDirectionalLight(moon);
    scene.add(moon);
}

function addLeaves(obj, x, y, z) {
    'use strict';

    var leaves = new THREE.Object3D();
    addElipse(leaves, 0, 0, 0, 1, GREEN, 2, 1, 4);

    leaves.position.set(x, y, z);
    obj.add(leaves);
}

function addTrunks(obj, x, y, z) {
    'use strict';

    var trunk = new THREE.Object3D();
    var trunk1 = new THREE.Object3D();
    var trunk2 = new THREE.Object3D();
    var trunks = new THREE.Object3D();
    addCylinder(trunk, 0, 0, 0, 1, 3, '', 0, BROWN); // base trunk
    addCylinder(trunk1, 0, 3.2, 1.3, 1, 5.2, 'x', Math.PI/4, BROWN);
    addCylinder(trunk2, 0, 4.2, -2, 1, 7, 'x', -Math.PI/4, BROWN);
    addLeaves(trunk1, 0, 5, 3);
    addLeaves(trunk2, 0, 7, -4);
    trunks.add(trunk1);
    trunks.add(trunk2);
    trunks.rotateY(Math.random()*Math.PI*2);
    trunk.add(trunks);

    trunk.position.set(x, y, z);
    obj.add(trunk);
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

//////////////////////
/* CHECK COLLISIONS */
//////////////////////

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
