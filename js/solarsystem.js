/*
 * File:         solarsystem.js
 * Created Date: 2021-06-22
 * Author:       Brian Lucas
 * Purpose:      Create a Three.js Solar System
 * -----
 * Last Modified: Tue Jun 22 2021
 * HISTORY:
 * Date        Comments
 */

import { OrbitControls } from "./lib/OrbitControls.js";
import * as THREE from './lib/three.module.js';
import * as dat from './lib/dat.gui.module.js';

const gui = new dat.GUI();
const world = {
  sun: {
    radius: 700000,
    intensity: 1
  },
  mercury: {
    radius: 2400,
    orbit: 57909227,
    siderialPeriod: 87.97,
    day: 58.646
  }
}

const scaleFactor = 0.0001;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 10000)
const renderer = new THREE.WebGLRenderer( {antialias: true} );

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight); 

const sunGeometry = new THREE.SphereGeometry(world.sun.radius / scaleFactor);
const sunMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);

const controls = new OrbitControls (camera, renderer.domElement);

camera.position.set(0, 0, 50);
controls.update();

let frame = 0;
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  frame += 1;
  controls.update();
}

animate();
