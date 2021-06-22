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
const world = {
  plane: {
    width: 2,
    height: 2,
    widthSegments: 10,
    heightSegments: 10
  }
}
gui.add(world.plane, 'width', 1, 20).onChange((generatePlane));

gui.add(world.plane, 'height', 1, 20).onChange((generatePlane));

gui.add(world.plane, 'widthSegments', 1, 20).onChange((generatePlane));

gui.add(world.plane, 'heightSegments', 1, 20).onChange((generatePlane));

function generatePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width, 
    world.plane.height, 
    world.plane.widthSegments, 
    world.plane.heightSegments);
  const {array} = planeMesh.geometry.attributes.position

  for (let i = 0; i < array.length; i+= 3) {
    array[i + 2] = array[i + 2] + Math.random()
  }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width, 
  world.plane.height, 
  world.plane.widthSegments, 
  world.plane.heightSegments);
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

const backLight = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, -5);

scene.add(backLight);

const controls = new OrbitControls(camera, render.domElement);
camera.position.set(0, 20, 100);
controls.update();


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

animate();