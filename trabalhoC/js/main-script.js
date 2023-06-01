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

var camera, scene, renderer, controls;

var axesHelper;
var house, ovni;

var materials = [];

const frustumSize = 50;

const WHITE = 0xffffff, BLACK = 0x000000, BLUE = 0x004bc4, RED = 0xff0000, DARK_RED = 0x960909, GREY = 0x909090, BACKGROUND_COLOR = 0xccf7ff;

var movementVector = new THREE.Vector3(0, 0, 0);
const MOVEMENT_SPEED = 15;

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

    camera = createCamera();
    render();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}

////////////
/* UPDATE */
////////////

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

function update(){
    'use strict';

    //movementVector.set(0, 0, 0);

    for (const [key, val] of Object.entries(non_conversion_keys))
        val.call();

    //handleCollisions();
    //if (trailerState == 'attaching') return;

    for (const [key, val] of Object.entries(conversion_keys))
        val.call();
    //trailer.position.add(movementVector);
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
    //addHouse(0, 4, 0);
    addOVNI(0, 20, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCamera() {
    'use strict';
    var scene_camera = getPerspectiveCamera();

    controls = new THREE.OrbitControls(scene_camera, renderer.domElement);
    controls.update();
    return scene_camera;
}

function getPerspectiveCamera() {
    const camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 100
    );
    camera.position.set(30, 30, 30);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    return camera;
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
    scene.add(ovni);
}

function addHouse(x, y, z) {
    'use strict';

    house = new THREE.Object3D();
    addBox(house, 0, 0, 0, 6, 8, 16, WHITE); // main body
    addBox(house, 3, -2, -3, 0.001, 4, 2, BLACK); // door
    addBox(house, 3, 0, 6, 0.001, 3, 2, BLUE); // window 1
    addBox(house, 3, 0, 3, 0.001, 3, 2, BLUE); // window 2
    addBox(house, 3, 0, 0, 0.001, 3, 2, BLUE); // window 3
    addBox(house, 3, 0, -6, 0.001, 3, 2, BLUE); // window 4
    addBox(house, -1.5, 0, 8, 1, 3, 0.001, BLUE); // window 5
    addBox(house, 1.5, 0, 8, 1, 3, 0.001, BLUE); // window 6
    addRoof(house);
    house.position.set(x, y, z);
    scene.add(house);
}

function addRoof(obj) {
    'use strict';

    var roof = new THREE.Object3D();
    addBox(roof, 0, 5, 0, 6, 2, 16, RED);
    //roof.rotateZ(Math.PI / 4); 
    obj.add(roof);
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
