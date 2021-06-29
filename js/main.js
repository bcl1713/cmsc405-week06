/*
 * File:         main.js
 * Created Date: 2021-06-22
 * Author:       Brian Lucas
 * Purpose:
 * -----
 * Last Modified: Tue Jun 29 2021
 * HISTORY:
 * Date        Comments
 * 2021-06-23  Create the scene and mouse listener
 */

// import "./lib/style.css";
import * as THREE from "./lib/three.module.js";
// import { OrbitControls } from "./lib/OrbitControls.js";
import * as dat from './lib/dat.gui.module.js';

const gui = new dat.GUI;

let maxfov = 1
let minfov = 0.1
let minCameraDistance = 2500;
let maxCameraDistance = 30000;

const world = {
  camera: {
    animation: true,
    distance: maxCameraDistance,
    fov: 1
  }
}

// Create a mouse object
const mouse = {
  x: undefined,
  y: undefined,
};

// Create the scene and camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  world.camera.fov,
  innerWidth / innerHeight,
  0.1,
  10000000
);

const animationToggle = gui.add(world.camera, "animation");
const distanceSlider = gui.add(world.camera, "distance", 6, 2000000).listen();
const fovSlider = gui.add(world.camera, "fov", 0.1, 180).listen();

const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  logarithmicDepthBuffer: true });
renderer.setSize(innerWidth, innerHeight);

// Add controls
// const controls = new OrbitControls(camera, renderer.domElement);

// Add the renderer to the page
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

const sunMesh = new THREE.Mesh(
  new THREE.SphereGeometry(700, 100, 100),
  new THREE.MeshBasicMaterial({
    map: loader.load('./js/textures/sun.jpg'),
  })
);

const sunLight = new THREE.PointLight (0xffffff, 2);
sunLight.position.set(0, 0, -150000);
scene.add (sunLight);

const ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);


const moonMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1.7381, 100, 100),
  new THREE.MeshPhongMaterial({
    map: loader.load("./js/textures/moon.jpg"),
    shininess: 0
  })
)

const earthMesh = new THREE.Mesh(
  new THREE.SphereGeometry(6.3781, 100, 100),
  new THREE.MeshPhongMaterial({
    map: loader.load("./js/textures/earth.jpg"),
    shininess: 0
  })
);

// let sateliteOrbit = [];

// const sateliteMesh = new THREE.Mesh(
//   new THREE.CylinderGeometry(1.5, 1.5, 3.1, 100, 100),
//   new THREE.MeshPhongMaterial({
//     color: 0x777777,
//     shininess: 128
//   })
// )

const sateliteGroup = new THREE.Group();
const satelites = new Array(11);
for (let i = 0; i < 11; i++) {
  satelites[i] = new THREE.Mesh(
    new THREE.CylinderGeometry(.15, .15, .31, 100, 100),
    new THREE.MeshPhongMaterial({
      color: 0x777777,
      shininess: 128
    }));
  satelites[i].position.set(Math.sin((i * 2 * Math.PI)/11) * 7, 0, Math.cos((i * 2 * Math.PI)/11) * 7);
  sateliteGroup.add(satelites[i]);
}

const halo = new THREE.Mesh(
  new THREE.TorusGeometry(24, 1, 100, 100),
  new THREE.MeshPhongMaterial({
    map: loader.load('./js/textures/halo.jpg'),
    shininess: 128
  }));
halo.scale.set(1, 1, 4);

scene.add(halo);

sunMesh.position.z = -150000;

scene.add(sunMesh);

scene.add(moonMesh);

scene.add(earthMesh);

scene.add(sateliteGroup);

camera.position.set(0, 0, world.camera.distance);

let frame = 0;
let frameStep = 0.003125;
let initialAnimation = true;
let initialPause = 2;
let initialAnimationLength = 4;



camera.fov = maxfov;
camera.updateProjectionMatrix();


function animate() {
  requestAnimationFrame(animate);
  if (world.camera.animation) {
    renderer.render(scene, camera);

    sunMesh.rotation.y += 0.0005;
    earthMesh.rotation.y = frame;
    moonMesh.rotation.y = frame / 28;
    moonMesh.position.set(Math.sin(frame/28) * 384, 0, Math.cos(frame/28) * 384);
    sateliteGroup.rotation.y = frame / 2;
    halo.rotation.z = frame / 16;
    
    if (frame >= initialPause) {
    
      if (initialAnimation == true) {
        let time = (frame - initialPause);
        let t = frame - initialPause
        let b = maxfov;
        let c = minfov - maxfov;
        let d = initialAnimationLength;
        world.camera.fov = quadraticEasing(time, maxfov, minfov, initialAnimationLength);
        camera.position.y = quadraticEasing(time, 0, 200, initialAnimationLength);
        camera.lookAt(0, 0, 0);
        camera.fov = world.camera.fov;
        camera.updateProjectionMatrix();
        if (time >= initialAnimationLength) {
          initialAnimation = false;
        }
        
      } else {
      
        let cameraFrame = frame - initialAnimationLength - initialPause;
        console.log(world.camera.distance);
        camera.fov = world.camera.fov;
        world.camera.distance = Math.cos(cameraFrame / 3) * ((maxCameraDistance - minCameraDistance) / 2) + ((maxCameraDistance - minCameraDistance) / 2) + minCameraDistance;
        camera.position.x = (Math.sin(cameraFrame / 4) * world.camera.distance);
        camera.position.z = (Math.cos(cameraFrame / 4) * world.camera.distance);
        camera.position.y = (Math.cos(cameraFrame) * 200);

        camera.lookAt(0, 0, 0);
      
      }
    }

    frame+=frameStep;
  }
}

function easeInOutQuad (t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

function quadraticEasing(time, startValue, endValue, duration) {
  let expectedChange = endValue - startValue
  
  time /= duration / 2;
  if (time < 1) {
    return expectedChange / 2 * time * time + startValue;
  }

  time--;
  return -expectedChange / 2 * (time * (time -2) - 1) + startValue
}

animate();

addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = (event.clientY / innerWidth) * -2 + 1;
});
