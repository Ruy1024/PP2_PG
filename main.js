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

// FUNÇÃO PARA CRIAR O FUNDO DE ESTRELAS
function createStarfield() {
  const starVertices = []
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 200
    const y = (Math.random() - 0.5) * 200
    const z = (Math.random() - 0.5) * 200
    starVertices.push(x, y, z)
  }
  const starGeometry = new THREE.BufferGeometry()
  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
  )
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.15,
    sizeAttenuation: true,
    transparent: true,
  })
  const stars = new THREE.Points(starGeometry, starMaterial)
  backgroundScene.add(stars)
}
createStarfield()

// INSTRUÇÃO DE INTERAÇÃO NA TELA

const instructionDiv = document.createElement("div")
instructionDiv.style.position = "absolute"
instructionDiv.style.bottom = "20px"
instructionDiv.style.width = "100%"
instructionDiv.style.textAlign = "center"
instructionDiv.style.color = "white"
instructionDiv.style.fontFamily = "monospace"
instructionDiv.style.fontSize = "16px"
instructionDiv.style.zIndex = "100"
instructionDiv.style.pointerEvents = "none"
instructionDiv.innerHTML = "Pressione a tecla 'C' para trocar de câmera"
document.body.appendChild(instructionDiv)

// CÂMERAS

const backgroundCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
const cameraPerspectiva = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
cameraPerspectiva.position.z = 10
cameraPerspectiva.name = "Perspectiva"

const aspect = window.innerWidth / window.innerHeight
const frustumSize = 15
const cameraOrtografica = new THREE.OrthographicCamera(
  (frustumSize * aspect) / -2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  frustumSize / -2,
  0.1,
  100
)
cameraOrtografica.position.y = 12
cameraOrtografica.lookAt(scene.position)
cameraOrtografica.name = "Ortográfica (Topo)"
const cameraOrtograficaLado = new THREE.OrthographicCamera(
  (frustumSize * aspect) / -2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  frustumSize / -2,
  0.1,
  100
)

cameraOrtograficaLado.position.set(12, 6, 0)
cameraOrtograficaLado.lookAt(scene.position)
cameraOrtograficaLado.name = "Ortográfica (Lateral)"

// OBJETOS 3D

// Objeto 1: Cubo com Textura
const textureLoader = new THREE.TextureLoader()
const minhaTextura = textureLoader.load("assets/terra.jfif")
const materialCubo = new THREE.MeshBasicMaterial({ map: minhaTextura })
const geometriaCubo = new THREE.BoxGeometry(1, 1, 1)
const cubo = new THREE.Mesh(geometriaCubo, materialCubo)
cubo.scale.set(1.5, 1.5, 1.5)
cubo.position.set(-3, 0, 0)
scene.add(cubo)

// OBJETO ADICIONAL: LUA ORBITANDO O CUBO
const geometriaLua = new THREE.SphereGeometry(0.3, 16, 16)
const materialLua = new THREE.MeshStandardMaterial({
  color: 0xeeeeee,
  roughness: 0.8,
})
const lua = new THREE.Mesh(geometriaLua, materialLua)
cubo.add(lua) // Adiciona a lua como filha do cubo

// Objeto 2: Esfera com Shader
const shaderUniforms = {
  u_time: { value: 0.0 },
  u_color: { value: new THREE.Color(0xff0000) },
}
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
   `,
})
const geometriaEsfera = new THREE.SphereGeometry(1, 32, 32)
const esfera = new THREE.Mesh(geometriaEsfera, materialShader)
esfera.scale.set(1.2, 1.2, 1.2)
esfera.position.set(0, 1, 1)
scene.add(esfera)

// Objeto 3: Saturno com Movimento
const materialSaturno = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
const saturno = new THREE.Group()
const geometriaPlaneta = new THREE.SphereGeometry(0.8, 32, 32)
const planeta = new THREE.Mesh(geometriaPlaneta, materialSaturno)
saturno.add(planeta)
const geometriaAneis = new THREE.RingGeometry(1, 1.6, 64)
const aneis = new THREE.Mesh(geometriaAneis, materialSaturno)
aneis.rotation.x = Math.PI / 2
saturno.add(aneis)
saturno.position.set(3, 2, -2)
scene.add(saturno)

// Objeto 4: Foguete Orbital
const foguete = new THREE.Group()
const materialCorpo = new THREE.MeshStandardMaterial({
  color: 0xcccccc,
  metalness: 0.8,
  roughness: 0.4,
})
const geometriaCorpo = new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16)
const corpo = new THREE.Mesh(geometriaCorpo, materialCorpo)
foguete.add(corpo)
const materialNariz = new THREE.MeshStandardMaterial({
  color: 0xff4500,
  metalness: 0.5,
  roughness: 0.5,
})
const geometriaNariz = new THREE.ConeGeometry(0.2, 0.5, 16)
const nariz = new THREE.Mesh(geometriaNariz, materialNariz)
nariz.position.y = 0.6 + 0.25
foguete.add(nariz)
const materialAsa = new THREE.MeshStandardMaterial({
  color: 0xff4500,
  metalness: 0.5,
  roughness: 0.5,
})
const geometriaAsa = new THREE.BoxGeometry(0.8, 0.3, 0.05)
for (let i = 0; i < 3; i++) {
  const asa = new THREE.Mesh(geometriaAsa, materialAsa)
  const angulo = (i / 3) * Math.PI * 2
  asa.position.y = -0.4
  asa.position.x = Math.cos(angulo) * 0.15
  asa.position.z = Math.sin(angulo) * 0.15
  asa.rotation.y = angulo
  foguete.add(asa)
}
foguete.scale.set(0.8, 0.8, 0.8)
scene.add(foguete)

// ====================ALTERAR NO FINAL DO PROJETO===========================
//tudo pra baixo olhar novamente no final
// INTERAÇÃO E LOOP DE ANIMAÇÃO

// Array para troca de câmeras
const cameras = [cameraPerspectiva, cameraOrtografica, cameraOrtograficaLado]
let cameraAtualIndex = 0
let activeCamera = cameras[cameraAtualIndex]

// Event listener para a tecla 'C'
window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "c") {
    cameraAtualIndex = (cameraAtualIndex + 1) % cameras.length
    activeCamera = cameras[cameraAtualIndex]
    console.log(`Câmera trocada para: ${activeCamera.name}`)
  }
})

// Relógio para  animação
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const elapsedTime = clock.getElapsedTime()

  // Interação da lua orbitando o cubo
  cubo.rotation.y = elapsedTime * 0.2
  const moonOrbitalRadius = 1.2
  const moonOrbitalSpeed = 1.5
  lua.position.x = Math.sin(elapsedTime * moonOrbitalSpeed) * moonOrbitalRadius
  lua.position.z = Math.cos(elapsedTime * moonOrbitalSpeed) * moonOrbitalRadius

  // Animação do Saturno
  saturno.rotation.x = elapsedTime * 0.5
  saturno.rotation.y = elapsedTime * 0.3

  shaderUniforms.u_time.value = elapsedTime

  backgroundCamera.quaternion.copy(activeCamera.quaternion)

  renderer.clear()
  renderer.render(backgroundScene, backgroundCamera)
  renderer.clearDepth()
  renderer.render(scene, activeCamera)
}

window.addEventListener("resize", () => {
  const newAspect = window.innerWidth / window.innerHeight

  backgroundCamera.aspect = newAspect
  backgroundCamera.updateProjectionMatrix()

  cameraPerspectiva.aspect = newAspect
  cameraPerspectiva.updateProjectionMatrix()

  cameraOrtografica.left = (frustumSize * newAspect) / -2
  cameraOrtografica.right = (frustumSize * newAspect) / 2
  cameraOrtografica.updateProjectionMatrix()

  cameraOrtograficaLado.left = (frustumSize * newAspect) / -2
  cameraOrtograficaLado.right = (frustumSize * newAspect) / 2
  cameraOrtograficaLado.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
})

animate()
