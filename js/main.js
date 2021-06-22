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



// const gui = new dat.GUI();
const world = {
  light: {
    intensity: 1
  },
  plane: {
    width: 25,
    height: 25,
    widthSegments: 25,
    heightSegments: 25
  }
}
// gui.add(world.light, 'intensity', 0, 5).onChange((changeLights));

// gui.add(world.plane, 'width', 1, 500).onChange((generatePlane));

// gui.add(world.plane, 'height', 1, 500).onChange((generatePlane));

// gui.add(world.plane, 'widthSegments', 1, 20).onChange((generatePlane));

// gui.add(world.plane, 'heightSegments', 1, 20).onChange((generatePlane));

const colors = []

function changeLights() {
  console.log(light);
  light.intensity = world.light.intensity;
}

function generatePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width, 
    world.plane.height, 
    world.plane.widthSegments, 
    world.plane.heightSegments);
  const {array} = planeMesh.geometry.attributes.position
  const randomValues = []
  for (let i = 0; i < array.length; i++) {
    if (i % 3 == 0) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];

      array[i] = x + ((Math.random() - 0.5) * 0.5) * .2;
      array[i + 1] = y + ((Math.random() - 0.5) * 0.5 * .2);
      array[i + 2] = z + ((Math.random() - 0.5) * 0.5 * .2);
    }

    randomValues.push(Math.random() * Math.PI * 2)
  }

  planeMesh.geometry.attributes.position.randomValues = randomValues
  planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array

  const colors = []
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4);
  }

  planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
 
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
scene.add(planeMesh);
generatePlane();

const light = new THREE.DirectionalLight(0xffffff, world.light.intensity);
light.position.set(0, -1, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, world.light.intensity);
backLight.position.set(0, 0, -1);
scene.add(backLight);

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 50);
controls.update();

let frame = 0;
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse, camera);
  frame += 0.01;

  const {
    array,
    originalPosition,
    randomValues
  } = planeMesh.geometry.attributes.position
  for (let i = 0; i < array.length; i += 3) {
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.0001;
    array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.00001;
  }
  planeMesh.geometry.attributes.position.needsUpdate = true

  const intersects = raycaster.intersectObject(planeMesh);

  if (intersects.length > 0) {
    intersects[0].object.geometry.attributes.color.setX(intersects[0].face.a, 0.1);
    intersects[0].object.geometry.attributes.color.setY(intersects[0].face.a, 0.5);
    intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.a, 1.0);
    
    intersects[0].object.geometry.attributes.color.setX(intersects[0].face.b, 0.1);
    intersects[0].object.geometry.attributes.color.setY(intersects[0].face.b, 0.5);
    intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.b, 1.0);
    
    intersects[0].object.geometry.attributes.color.setX(intersects[0].face.c, 0.1);
    intersects[0].object.geometry.attributes.color.setY(intersects[0].face.c, 0.5);
    intersects[0].object.geometry.attributes.color.setZ(intersects[0].face.c, 1.0);

    intersects[0].object.geometry.attributes.color.needsUpdate = true
  }

  controls.update();
}

animate();

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -((event.clientY / innerHeight) * 2 - 1);
})