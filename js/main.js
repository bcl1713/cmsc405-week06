/*
 * File:         main.js
 * Created Date: 2021-06-22
 * Author:       Brian Lucas
 * Purpose:
 * -----
 * Last Modified: Thu Jun 24 2021
 * HISTORY:
 * Date        Comments
 * 2021-06-23  Create the scene and mouse listener
 */

// import "./style.css";
import * as THREE from "./lib/three.module.js";
import { OrbitControls } from "./lib/OrbitControls.js";
import * as dat from './lib/dat.gui.module.js';

const gui = new dat.GUI;

const world = {
  camera: {
    distance: 30000
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
  1.0,
  innerWidth / innerHeight,
  0.1,
  10000000
);
gui.add(world.camera, "distance", 6, 2000000);

const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  logarithmicDepthBuffer: true });
renderer.setSize(innerWidth, innerHeight);

// Add controls
const controls = new OrbitControls(camera, renderer.domElement);

// Add the renderer to the page
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

const sunMesh = new THREE.Mesh(
  new THREE.SphereGeometry(700, 100, 100),
  new THREE.MeshBasicMaterial({
    map: loader.load("textures/sun.jpg"),
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
    map: loader.load("textures/moon.jpg"),
    shininess: 0
  })
)

const earthMesh = new THREE.Mesh(
  new THREE.SphereGeometry(6.3781, 100, 100),
  new THREE.MeshPhongMaterial({
    map: loader.load("textures/earth.jpg"),
    shininess: 0
  })
);

let sateliteOrbit = [];

const sateliteMesh = new THREE.Mesh(
  new THREE.CylinderGeometry(.15, .15, .31, 100, 100),
  new THREE.MeshPhongMaterial({
    color: 0x777777,
    shininess: 128
  })
)

const sateliteGroup = new THREE.Group();
const satelites = new Array(11);
for (let i = 0; i < 11; i++) {
  satelites[i] = new THREE.Mesh(
    new THREE.CylinderGeometry(.015, .015, .031, 100, 100),
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
    map: loader.load('textures/halo.jpg'),
    shininess: 128
  }));
halo.scale.set(1, 1, 4);

scene.add(halo);

sunMesh.position.z = -150000;

scene.add(sunMesh);

scene.add(moonMesh);

scene.add(earthMesh);

scene.add(sateliteGroup);

let frame = 0;



function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  sunMesh.rotation.y += 0.0005;
  earthMesh.rotation.y = frame;
  moonMesh.rotation.y = frame / 28;
  moonMesh.position.set(Math.sin(frame/28) * 384, 0, Math.cos(frame/28) * 384);
  sateliteGroup.rotation.y = frame / 2;
  halo.rotation.z = frame / 16;
  camera.position.x = (Math.sin(frame / 10) * world.camera.distance);
  camera.position.z = (Math.cos(frame / 10) * world.camera.distance);
  camera.position.y = (Math.cos(frame / 10) * 200);
  camera.lookAt(0, 0, 0);
  world.camera.distance = (Math.sin(frame / 5) * 9000) + 9800;
  console.log(world.camera.distance);
  frame+=.00625
}

animate();

addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = (event.clientY / innerWidth) * -2 + 1;
});
