/*
 * File:         main.js
 * Created Date: 2021-06-20
 * Author:       Brian Lucas
 * Purpose:      
 * -----
 * Last Modified: Tue Jun 22 2021
 * HISTORY:
 * Date        Comments
 * 2021-06-22  Normalize mouse coords
 * 2021-06-22  Add mouse listener
 */

import { OrbitControls } from './lib/OrbitControls.js';
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

const colors = []

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
  planeMesh.geometry.setAttribute('color', 
  new THREE.BufferAttribute(new Float32Array(colors), 
  3));
}

const raycaster = new THREE.Raycaster();
const mouse = {
  x: undefined,
  y: undefined
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
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.geometry.setAttribute('color', 
  new THREE.BufferAttribute(new Float32Array(colors), 
  3));

scene.add(planeMesh);

console.log(planeMesh.geometry.attributes.position.array);

const {array} = planeMesh.geometry.attributes.position

for (let i = 0; i < array.length; i+= 3) {
 
  array[i + 2] = array[i + 2] + Math.random()

}

for (let i = 0; i < array.length / 3; i++) {
  
  colors.push(0, 0, 1);

}





const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 4);

scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, -4);

scene.add(backLight);

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 5);
controls.update();


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planeMesh);
  controls.update();
}

animate();

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -((event.clientY / innerHeight) * 2 - 1);
})