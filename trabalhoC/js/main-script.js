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

var axesHelper;
var house, ovni, moon, tree;

var spotLight;
var pointLights = [];

var materials = [];

const WHITE = 0xffffff, BLACK = 0x000000, BLUE = 0x004bc4, RED = 0xff0000, DARK_RED = 0x960909, GREY = 0x909090, BACKGROUND_COLOR = 0xccf7ff;
const BROWN = 0x9c4f0c; GREEN = 0x07820d; ORANGE = 0xfc5203;

var movementVector = new THREE.Vector3(0, 0, 0);
const MOVEMENT_SPEED = 15;

var clock = new THREE.Clock();
var elapsedTime;

var conversion_keys = {}, non_conversion_keys = {};

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

    camera = createCamera();
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
    camera = perspective_camera;
}

function on6KeyDown() { // 6 key
    for (var i = 0; i < materials.length; i++) {
        materials[i].wireframe = !materials[i].wireframe;
    }
    delete non_conversion_keys[54];
}

function onHKeyDown() { // H key
    axesHelper.visible = !axesHelper.visible;
    delete non_conversion_keys[72];
}

function onPKeyDown() { // P key - turn on/off point light
    for (var i = 0; i < pointLights.length; i++) {
        pointLights[i].visible = !pointLights[i].visible;
    }
    delete non_conversion_keys[80];
}

function onSKeyDown() { // S key - turn on/off spot light
    spotLight.visible = !spotLight.visible;
    delete non_conversion_keys[83];
}

function update(){
    'use strict';

    movementVector.set(0, 0, 0);

    for (const [key, val] of Object.entries(non_conversion_keys))
        val.call();

    for (const [key, val] of Object.entries(conversion_keys))
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
    scene.background = new THREE.Color(BACKGROUND_COLOR);
    createSky();
    createPlane();
    addHouse();
    addOVNI(0, 20, 0);
    addMoon(0, 35, 15);
    addTree(0, 1.5, 30);
}

function createPlane() {
    'use strict';

    const loader = new THREE.TextureLoader();
    const displacementMap = loader.load('./textures/heightmap.png');

    const material = new THREE.MeshStandardMaterial({
        color: 0x808080,
        displacementMap: displacementMap,
        displacementScale: 0.5,
    });

    const geometry = new THREE.PlaneGeometry(100, 100, 100, 100);

    const plane = new THREE.Mesh(geometry, material);

    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.5;
    
    scene.add(plane);
}

function createSky() {
    const geometry = new THREE.BufferGeometry();
  
    const positions = [0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0].map(
      (n) => n  * 100
    );
  
    const indices = [0, 1, 2, 2, 3, 0];
  
    const blue = new THREE.Color(0x0000ff);
    const purple = new THREE.Color(0xa32cc4);
    const colors = [purple, blue, blue, purple].flatMap((color) => [
      color.r,
      color.g,
      color.b,
    ]);
  
    geometry.setIndex(indices);
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.computeVertexNormals();
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  
    const material = new THREE.MeshBasicMaterial({
      vertexColors: true,
    });
  
    const sky = new THREE.Mesh(geometry, material);
    sky.position.set(0, 0, 0);
  
    scene.add(sky);
  }

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCamera() {
    'use strict';
    perspective_camera = getPerspectiveCamera();

    controls = new THREE.OrbitControls(perspective_camera, renderer.domElement);
    controls.update();

    return perspective_camera;
}

function getPerspectiveCamera() {
    const camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 100
    );
    camera.position.set(40, 40, 40);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    return camera;
  }

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createLight(obj, x, y, z) {
    'use strict';

    // add spot light to ovni
    spotLight = new THREE.SpotLight(0xffffff, 1, 100, 0.5, 1);
    spotLight.position.set(x, y, z);
    obj.add(spotLight);
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
    addElipse(cockpit, 0, 0, 0, 2, WHITE, 1, 1, 1); // cockpit

    cockpit.position.set(x, y, z);
    obj.add(cockpit);

}

function addBody(obj, x, y, z) {
    'use strict';

    var body = new THREE.Object3D();
    addElipse(body, 0, 0, 0, 1, BLACK, 6, 1.5, 6); // main body

    body.position.set(x, y, z);
    obj.add(body);

}

function addBase(obj, x, y, z) {
    'use strict';

    var base = new THREE.Object3D();

    addCylinder(base, 0, 0, 0, 2, 2, '', 0, WHITE);
    base.position.set(x, y, z);
    obj.add(base);
}

function addLights(obj, x, y, z) {
    'use strict';

    var rotation = Math.PI/4

    for (var i = 0; i < 8; i++){
        var light = new THREE.Object3D();

        addElipse(light, 4, 0, 0, 1, BLUE, 1, 1, 1);

        light.rotateY(rotation*i);
        light.position.set(x, y, z);
        createPontualLight(light, 0, 0, 0);
        obj.add(light);
    }
}

function addOVNI(x, y, z) {
    'use strict';

    ovni = new THREE.Object3D();

    addCockpit(ovni, 0, 1.5, 0);
    addBody(ovni, 0, 0, 0);
    addBase(ovni, 0, -1.5, 0);
    addLights(ovni, 0, 2-1-1.5, 0);

    ovni.position.set(x, y + 3.5, z);
    createLight(ovni, 0, 0, 0);
    var spotLightTarget = new THREE.Object3D();
    spotLightTarget.position.set(ovni.position.x, 0, ovni.position.z);
    spotLight.target = spotLightTarget;
    ovni.add(spotLightTarget);
    scene.add(spotLightTarget);
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

function addWindowsAndDoor(obj) {
    'use strict';
    var vertices = [];

    var doorVertices = [
        6, 0, 4,
        6, 0, 6,
        6, 4, 4,
        6, 4, 6,
    ];
    vertices.push(...doorVertices);

    var window1Vertices = [
        6, 3, 1,
        6, 3, 3,
        6, 6, 1,
        6, 6, 3, 
    ];
    vertices.push(...window1Vertices);

    var window2Vertices = [
        6, 3, 7,
        6, 3, 9,
        6, 6, 7,
        6, 6, 9,
    ];
    vertices.push(...window2Vertices);

    var window3Vertices = [
        6, 3, 10,
        6, 3, 12,
        6, 6, 10,
        6, 6, 12,
    ];
    vertices.push(...window3Vertices);

    var window4Vertices = [
        6, 3, 13,
        6, 3, 15,
        6, 6, 13,
        6, 6, 15,
    ];
    vertices.push(...window4Vertices);

    var indexs = [
        0, 1, 2, 1, 3, 2,
    ];

    for (var i = 0; i < 5; i++) {
        addGeometry(obj, 0, 0, 0, vertices.slice(i*12, i*12 + 12), indexs, BLUE);
    }   
}

function addHouse() {
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
    ];
    const indexsWalls = [
        0, 1, 2, 1, 3, 2,
        0, 2, 4, 2, 6, 4,
        2, 3, 6, 3, 7, 6,
        4, 6, 5, 6, 7, 5,
        0, 4, 1, 4, 5, 1,
        1, 5, 3, 5, 7, 3,
        3, 7, 2, 7, 6, 2
    ];

    addGeometry(house, 0, 0, 0, verticesWalls, indexsWalls, WHITE);
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
    addWindowsAndDoor(house);
    scene.add(house);
}

function addRoof(obj) {
    'use strict';

    var roof = new THREE.Object3D();
    addBox(roof, 0, 5, 0, 6, 2, 16, RED);
    //roof.rotateZ(Math.PI / 4); 
    obj.add(roof);
}

function addMoon(x, y, z) {
    'use strict';

    moon = new THREE.Object3D();
    addElipse(moon, 0, 0, 0, 4, WHITE, 1, 1, 1);
    moon.position.set(x, y, z);
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
    addCylinder(trunk, 0, 0, 0, 1, 3, '', 0, BROWN); // base trunk
    addCylinder(trunk, 0, 3.2, 1.3, 1, 5.2, 'x', Math.PI/4, BROWN);
    addCylinder(trunk, 0, 4.2, -2, 1, 7, 'x', -Math.PI/4, BROWN);

    trunk.position.set(x, y, z);
    obj.add(trunk);
}

function addTree(x, y, z) {
    'use strict';

    tree = new THREE.Object3D();
    addTrunks(tree, 0, 0, 0);
    addLeaves(tree, 0, 5, 3);
    addLeaves(tree, 0, 7, -4);
    tree.position.set(x, y, z);
    scene.add(tree);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////

function checkCollision(obj1, obj2){
    'use strict';

    return obj1.max.x >= obj2.min.x && obj1.min.x <= obj2.max.x &&
        obj1.max.y >= obj2.min.y && obj1.min.y <= obj2.max.y &&
        obj1.max.z >= obj2.min.z && obj1.min.z <= obj2.max.z;
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

        // wireframe toggle
        case 54: // 6
            non_conversion_keys[54] = on6KeyDown;
            break;

        case 72: // H
            non_conversion_keys[72] = onHKeyDown;
            break;

        case 80: // P
            non_conversion_keys[80] = onPKeyDown;
            break;
        
        case 83: // S
            non_conversion_keys[83] = onSKeyDown;
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
