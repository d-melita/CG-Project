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

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(10));

    // set the scene background with light color
    scene.background = new THREE.Color(0xccf7ff);
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
      createOrthographicCamera(-10, 10, 10, -10, new THREE.Vector3(0, 20, 0))
    );
  
    // Side Orthographic Camera
    cameras.push(
      createOrthographicCamera(-10, 10, 10, -10, new THREE.Vector3(20, 0, 0))
    );
  
    // Front Orthographic Camera
    cameras.push(
      createOrthographicCamera(-10, 10, 10, -10, new THREE.Vector3(0, 0, 20))
    );
  
    // Isometric Orthographic Camera
    cameras.push(
      createOrthographicCamera(-10, 10, 10, -10, new THREE.Vector3(20, 20, 20))
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