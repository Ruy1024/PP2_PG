import * as THREE from "three"

// CONFIGURAÇÃO BÁSICA (CENA, RENDERIZADOR)

const scene = new THREE.Scene()
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 10, 7.5)
scene.add(directionalLight)

const backgroundScene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.autoClear = false
document.body.appendChild(renderer.domElement)
