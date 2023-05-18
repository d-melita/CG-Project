/* 
* Transformer Project
* CG 2022/2023
* Diogo Melita ist199202
* João Rocha ist199256
*/

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var active_camera, scene, renderer;
var cameras = [];

var geometry, material, mesh;

var trailer, transformer, inferiorBody, superiorBody, leftArm, rightArm, head, feet;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(10));

    // set the scene background with light color
    scene.background = new THREE.Color(0xccf7ff);

    createTrailer(0, 0, -10);
    createTransformer(0, 0, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    const cameras = [];
  
    function createOrthographicCamera(left, right, top, bottom, position) {
      const camera = new THREE.OrthographicCamera(
        left, right, top, bottom, 1, 100
      );
      camera.position.copy(position);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      return camera;
    }
  
    function createPerspectiveCamera(fov, aspect, near, far, position) {
      const camera = new THREE.PerspectiveCamera(
        fov, aspect, near, far
      );
      camera.position.copy(position);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      return camera;
    }
  
    // Top Orthographic Camera
    cameras.push(
      createOrthographicCamera(-30, 30, 30, -30, new THREE.Vector3(0, 20, 0))
    );
  
    // Side Orthographic Camera
    cameras.push(
      createOrthographicCamera(-30, 30, 30, -30, new THREE.Vector3(20, 0, 0))
    );
  
    // Front Orthographic Camera
    cameras.push(
      createOrthographicCamera(-30, 30, 30, -30, new THREE.Vector3(0, 0, 20))
    );
  
    // Isometric Orthographic Camera
    cameras.push(
      createOrthographicCamera(-30, 30, 30, -30, new THREE.Vector3(20, 20, 20))
    );
  
    // Perspective Camera
    cameras.push(
      createPerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100, new THREE.Vector3(20, 20, 20))
    );
  
    return cameras;
}

function switchCamera(camera) {
    active_camera = camera;
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createBox(obj, x, y, z, length, height, width, color) {
    'use strict';

    geometry = new THREE.BoxGeometry(length, height, width);
    material = new THREE.MeshBasicMaterial({ color: color, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWheel(obj, x, y, z, top, bottom, height) {
    'use strict';

    geometry = new THREE.CylinderGeometry(top, bottom, height, 32);
    geometry.rotateX(Math.PI/2);
    geometry.rotateY(Math.PI/2);
    material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createTrailer(x, y, z) {
    'use strict';

    trailer = new THREE.Object3D();

    createBox(trailer, 0, 6.5, 12, 8, 5, 24, 0xffffff); // trailer top
    createBox(trailer, 0, 2.5, 19, 6, 3, 10, 0xa8a8a8); // trailer base
    addWheel(trailer, -3.5, 1.5, 17.5, 1.5, 1.5, 1);
    addWheel(trailer, 3.5, 1.5, 17.5, 1.5, 1.5, 1);
    addWheel(trailer, -3.5, 1.5, 21.5, 1.5, 1.5, 1);
    addWheel(trailer, 3.5, 1.5, 21.5, 1.5, 1.5, 1);
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
    renderer.render(scene, active_camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    createScene();
    cameras = createCameras();
    active_camera = cameras[3];

    render(active_camera);

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    render();

    requestAnimationFrame(animate);

}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        active_camera.aspect = window.innerWidth / window.innerHeight;

        active_camera.updateProjectionMatrix();
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
            switchCamera(cameras[0]);
            break;
        case 50: // 2
            switchCamera(cameras[1]);
            break;
        case 51: // 3
            switchCamera(cameras[2]);
            break;
        case 52: // 4
            switchCamera(cameras[3]);
            break;
        case 53: // 5
            switchCamera(cameras[4]);
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