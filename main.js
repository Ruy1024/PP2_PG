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

// INSTRUÇÃO DE INTERAÇÃO NA TELA

const instructionDiv = document.createElement('div');
instructionDiv.style.position = 'absolute';
instructionDiv.style.bottom = '20px';
instructionDiv.style.width = '100%';
instructionDiv.style.textAlign = 'center';
instructionDiv.style.color = 'white';
instructionDiv.style.fontFamily = 'monospace';
instructionDiv.style.fontSize = '16px';
instructionDiv.style.zIndex = '100';
instructionDiv.style.pointerEvents = 'none';
instructionDiv.innerHTML = "Pressione a tecla 'C' para trocar de câmera";
document.body.appendChild(instructionDiv);

// CÂMERAS

const backgroundCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const cameraPerspectiva = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
cameraPerspectiva.position.z = 10;
cameraPerspectiva.name = "Perspectiva";

const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 15;
const cameraOrtografica = new THREE.OrthographicCamera(
    frustumSize * aspect / -2, frustumSize * aspect / 2,
    frustumSize / 2, frustumSize / -2,
    0.1, 100
);
cameraOrtografica.position.y = 12;
cameraOrtografica.lookAt(scene.position);
cameraOrtografica.name = "Ortográfica (Topo)";

cameraOrtograficaLado.position.set(12, 6, 0);
cameraOrtograficaLado.lookAt(scene.position);
cameraOrtograficaLado.name = "Ortográfica (Lateral)";

// OBJETOS 3D

// Objeto 1: Cubo com Textura
const textureLoader = new THREE.TextureLoader();
const minhaTextura = textureLoader.load('assets/terra.jfif');
const materialCubo = new THREE.MeshBasicMaterial({ map: minhaTextura });
const geometriaCubo = new THREE.BoxGeometry(1, 1, 1);
const cubo = new THREE.Mesh(geometriaCubo, materialCubo);
cubo.scale.set(1.5, 1.5, 1.5);
cubo.position.set(-3, 0, 0);
scene.add(cubo);

// Objeto 2: Esfera com Shader
const shaderUniforms = { u_time: { value: 0.0 }, u_color: { value: new THREE.Color(0xff0000) } };
const materialShader = new THREE.RawShaderMaterial({
    uniforms: shaderUniforms,
    vertexShader: `
    attribute vec3 position;
    attribute vec2 uv;
    
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    varying vec2 vUv;
   
    void main(){
    vUv=uv;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}
    `,
    fragmentShader: `precision mediump float;
    
    varying vec2 vUv;
    uniform float u_time;
    uniform vec3 u_color;
    
    void main(){
    float wave=sin(vUv.y*10.0+u_time*2.0)*0.5+0.5;
    
    vec3 finalColor=u_color*wave;
    gl_FragColor=vec4(finalColor,1.0);
    }
   `
});
const geometriaEsfera = new THREE.SphereGeometry(1, 32, 32);
const esfera = new THREE.Mesh(geometriaEsfera, materialShader);
esfera.scale.set(1.2, 1.2, 1.2);
esfera.position.set(0, 1, 1);
scene.add(esfera);
