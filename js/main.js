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
    Animation: true,
    CameraDistance: maxCameraDistance,
    FOV: 1,
    x: 0,
    y: 0,
    z: 0
  },
  lights: {
    AmbientColor: 0x444444,
    AmbientIntensity: 1,
    SunlightColor: 0xf5c379,
    SunlightIntensity: 2
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

const cameraFolder = gui.addFolder("Camera");

cameraFolder.add(world.camera, "Animation");
cameraFolder.add(world.camera, "FOV", minfov, maxfov).listen();
cameraFolder.add(world.camera, "x", -maxCameraDistance, maxCameraDistance).listen();
cameraFolder.add(world.camera, "y", -maxCameraDistance, maxCameraDistance).listen();
cameraFolder.add(world.camera, "z", -maxCameraDistance, maxCameraDistance).listen();

const lightFolder = gui.addFolder("Lights");

lightFolder.addColor(world.lights, "AmbientColor").listen();
lightFolder.add(world.lights, "AmbientIntensity", 0, 2).listen();
lightFolder.addColor(world.lights, "SunlightColor").listen();
lightFolder.add(world.lights, "SunlightIntensity", 0, 2).listen();


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

const sunLight = new THREE.PointLight (world.lights.SunlightColor, world.lights.SunlightIntensity);
sunLight.position.set(0, 0, -150000);
scene.add (sunLight);

const ambientLight = new THREE.AmbientLight(world.lights.AmbientColor);
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

const sateliteGroup = new THREE.Group();
const satelites = new Array(11);
for (let i = 0; i < 11; i++) {
  satelites[i] = new THREE.Mesh(
    new THREE.CylinderGeometry(.15, .15, .31, 100, 100),
    new THREE.MeshPhongMaterial({
      map: loader.load('./js/textures/sats.jpg'),
      shininess: 1
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

world.camera.x = 0;
world.camera.y = 0;
world.camera.z = world.camera.CameraDistance;
camera.position.set(world.camera.x, world.camera.y, world.camera.z);

let frame = 0;
let frameStep = 0.003125;
let initialAnimation = true;
let initialPause = 2;
let initialAnimationLength = 4;



camera.fov = world.camera.FOV;
camera.updateProjectionMatrix();


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (world.camera.Animation) {
    sunMesh.rotation.y += 0.0005;
    earthMesh.rotation.y = frame;
    moonMesh.rotation.y = frame / 28;
    moonMesh.position.set(Math.sin(frame/28) * 384, 0, Math.cos(frame/28) * 384);
    sateliteGroup.rotation.y = frame / 2;
    halo.rotation.z = frame / 2;
    
    if (frame >= initialPause) {
    
      if (initialAnimation == true) {
        let time = (frame - initialPause);
        let t = frame - initialPause
        let b = maxfov;
        let c = minfov - maxfov;
        let d = initialAnimationLength;
        world.camera.FOV = quadraticEasing(time, maxfov, minfov, initialAnimationLength);
        world.camera.y = quadraticEasing(time, 0, 200, initialAnimationLength);
        if (time >= initialAnimationLength) {
          initialAnimation = false;
        }
        
      } else {
      
        let cameraFrame = frame - initialAnimationLength - initialPause;
        console.log(world.camera.CameraDistance);
        world.camera.CameraDistance = Math.cos(cameraFrame / 3) * ((maxCameraDistance - minCameraDistance) / 2) + ((maxCameraDistance - minCameraDistance) / 2) + minCameraDistance;
        world.camera.x = (Math.sin(cameraFrame / 4) * world.camera.CameraDistance);
        world.camera.z = (Math.cos(cameraFrame / 4) * world.camera.CameraDistance);
        world.camera.y = (Math.cos(cameraFrame) * 200);
      
      }
    }

    frame+=frameStep;
  } 
  ambientLight.color.setHex(world.lights.AmbientColor);
  ambientLight.intensity = world.lights.AmbientIntensity;
  sunLight.color.setHex(world.lights.SunlightColor);
  sunLight.intensity = world.lights.SunlightIntensity;
  camera.position.set(world.camera.x, world.camera.y, world.camera.z);
  camera.lookAt(0, 0, 0);
  camera.fov = world.camera.FOV;
  camera.updateProjectionMatrix();
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
