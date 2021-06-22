/*
 * File:         main.js
 * Created Date: 2021-06-20
 * Author:       Brian Lucas
 * Purpose:      
 * -----
 * Last Modified: Tue Jun 22 2021
 * HISTORY:
 * Date        Comments
 */

import * as THREE from './lib/three.module.js';
import * as dat from './lib/dat.gui.module.js';

const gui = new dat.GUI();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000, 
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

scene.add(planeMesh);

console.log(planeMesh.geometry.attributes.position.array);

const {array} = planeMesh.geometry.attributes.position

for (let i = 0; i < array.length; i+= 3) {
 
  array[i + 2] = array[i + 2] + Math.random()

}

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 5);

scene.add(light);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();