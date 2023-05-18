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

var trailer;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(10));

    // set the scene background with light color
    scene.background = new THREE.Color(0xccf7ff);

    createTrailer(0, 0, 0);
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

function addTrailerBase(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(6, 3, 10);
    material = new THREE.MeshBasicMaterial({ color: 0xa8a8a8, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTrailerTop(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(8, 5, 24);
    material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTrailerPart(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(2, 1, 1);
    material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWheel(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
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

    addTrailerTop(trailer, 0, 6.5, 12);
    addTrailerBase(trailer, 0, 2.5, 19);
    addWheel(trailer, -3.5, 1.5, 17.5);
    addWheel(trailer, 3.5, 1.5, 17.5);
    addWheel(trailer, -3.5, 1.5, 21.5);
    addWheel(trailer, 3.5, 1.5, 21.5);
    addTrailerPart(trailer, 0, 3.5, 0.5);

    trailer.rotateY(Math.PI);
    
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