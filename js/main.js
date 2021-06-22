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

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

console.log(scene);
console.log(camera);
console.log(renderer);

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);