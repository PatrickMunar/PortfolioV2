import './style.css'
// import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import gsap from 'gsap'
import { BufferGeometry } from 'three'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import normalFragmentShader from './shaders/normalFragment.glsl'
import Scrollbar from 'smooth-scrollbar';
import ScrollToPlugin from "gsap/ScrollToPlugin";

// Clear Scroll Memory
window.history.scrollRestoration = 'manual'

// Scroll Triggers
gsap.registerPlugin(ScrollTrigger)

// 3rd party library setup:
const bodyScrollBar = Scrollbar.init(document.querySelector('#bodyScrollbar'), { damping: 0.1, delegateTo: document });

// Tell ScrollTrigger to use these proxy getter/setter methods for the "body" element: 
ScrollTrigger.scrollerProxy('#bodyScrollbar', {
  scrollTop(value) {
    if (arguments.length) {
      bodyScrollBar.scrollTop = value; // setter
    }
    return bodyScrollBar.scrollTop;    // getter
  },
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  }
});

// when the smooth scroller updates, tell ScrollTrigger to update() too: 
bodyScrollBar.addListener(ScrollTrigger.update);

// -----------------------------------------------------------------
/**
 * Base
 */

// Canvas
const mainCanvas = document.querySelector('.mainCanvas')
const navBar = document.querySelector('.navBar')
const loadingPage = document.querySelector('.loadingPage')

bodyScrollBar.addListener(({ offset }) => {  
    mainCanvas.style.top = offset.y + 'px';
    navBar.style.top = offset.y + 'px';
    loadingPage.style.top = offset.y + 'px';
 
});

bodyScrollBar.track.xAxis.element.remove()

// Scenes
const mainScene = new THREE.Scene()

/**
 * Loaders
 */
// Loading Manager
document.body.style.overflowY = 'hidden'
document.body.style.overflowX = 'hidden'
const loadPercent = document.querySelector('.loadPercent')
let loadProgress = 0

const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
        setTimeout(() => {
            setTimeout(() => {
                helloSequence()
                spinRightWall()

                loadingPage.style.display = 'none'
                window.history.scrollRestoration = 'manual'
                document.body.style.overflowY = 'scroll'
                document.body.style.overflowX = 'hidden'

                bodyScrollBar.scrollTo(0, 0)
            }, 100)
        }, 2500)
        setTimeout(() => {
            document.querySelector('#emoji').innerText = '😀'
        }, 1000)
    },
    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {
        loadProgress = (itemsLoaded/itemsTotal)
        gsap.to('#allDone', {x: loadProgress * window.innerWidth})
        gsap.to('#allDoneText', {x: loadProgress * - window.innerWidth})
        loadPercent.innerText = (loadProgress*100).toFixed(1) + ' %'
        gsap.to(loadPercent, {fontSize: (loadProgress * 0.5) + 0.5 +'rem'})
    }
)

// Hello Sequence 
const helloSequence = () => {
    gsap.fromTo('.hello', {opacity: 0, x: -20}, {duration: 1, delay: 1, opacity: 1, x: 0})
    gsap.fromTo('.I', {opacity: 0}, {duration: 1, delay: 2.5, opacity: 1})
    gsap.fromTo('.am', {opacity: 0, x: 20}, {duration: 1, delay: 3, opacity: 1, x: 0})
    gsap.fromTo('.botLanding', {opacity: 0, y: 20}, {duration: 1, delay: 5, opacity: 1, y: 0})
    setTimeout(() => {
        flickerText()
    }, 7000)
}

// EnvMap
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg'
])


// Texture loader
const textureLoader = new THREE.TextureLoader(loadingManager)
const pictures = []
pictures[0] = textureLoader.load('./images/Creativity.png')
pictures[1] = textureLoader.load('./images/PSolve.png')
pictures[2] = textureLoader.load('./images/Coding.png')

const carouselPics = []
carouselPics[0] = textureLoader.load('./images/Flagle.png')
carouselPics[1] = textureLoader.load('./images/Gabito.png')
carouselPics[2] = textureLoader.load('./images/LDR.png')
carouselPics[3] = textureLoader.load('./images/Nacho.png')
carouselPics[4] = textureLoader.load('./images/Shaders.png')
carouselPics[5] = textureLoader.load('./images/Portfolio.png')

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

// Font Loader
const fontLoader = new FontLoader()

// 3D Models
const scaleFactor = 0.05

// Landing Page Models
let P = new THREE.Group
let A = new THREE.Group
let T = new THREE.Group
let R = new THREE.Group
let I = new THREE.Group
let C = new THREE.Group
let K = new THREE.Group
let nameGroup = new THREE.Group
let leftNameWall = new THREE.Group
let leftNameWallPosition = new THREE.Group
let rightNameWall = new THREE.Group
let rightNameWallPosition = new THREE.Group
let landingModels = new THREE.Group

P.position.set(-105*0.025, 0, -105*0.025)
A.position.set(-70*0.025, 0, -70*0.025)
T.position.set(-35*0.025, 0, -35*0.025)
R.position.set(0, 0, 0)
I.position.set(35*0.025, 0, 35*0.025)
C.position.set(70*0.025, 0, 70*0.025)
K.position.set(105*0.025, 0, 105*0.025)

nameGroup.add(P)
nameGroup.add(A)
nameGroup.add(T)
nameGroup.add(R)
nameGroup.add(I)
nameGroup.add(C)
nameGroup.add(K)

// leftNameWallPosition.position.y = -1+30+ 15*0.025
leftNameWallPosition.position.x = - 5

// rightNameWallPosition.position.y = -1+30+ 15*0.025
rightNameWallPosition.position.z = - 5

// nameGroup.position.y = -1+30
nameGroup.rotation.y = Math.PI*90/180
leftNameWallPosition.rotation.y = Math.PI*90/180
rightNameWallPosition.rotation.y = Math.PI*90/180

mainScene.add(nameGroup)
leftNameWallPosition.add(leftNameWall)
leftNameWallPosition.position.y = 0.375
mainScene.add(leftNameWallPosition)
rightNameWallPosition.add(rightNameWall)
rightNameWallPosition.position.y = 0.375
mainScene.add(rightNameWallPosition)

landingModels.add(nameGroup)
landingModels.add(leftNameWallPosition)
landingModels.add(rightNameWallPosition)

landingModels.rotation.y = - Math.PI/4
landingModels.rotation.x = Math.PI/5
landingModels.position.y = 4
mainScene.add(landingModels)

// Room Models
let allObjects = new THREE.Group
let bottomBedframeGroup = new THREE.Group
let topBedframeGroup = new THREE.Group
let topDrawer = new THREE.Group
let midDrawer = new THREE.Group
let botDrawer = new THREE.Group
let staticStairsGroup = new THREE.Group
let wallsandfloor = new THREE.Group
let laptopGroup = new THREE.Group
let screenGroup = new THREE.Group
let mousepad = new THREE.Group
let footballGroup = new THREE.Group
let skateboardGroup = new THREE.Group
let chessboardGroup = new THREE.Group
let hookbase = new THREE.Group
let sablayGroup = new THREE.Group
let switchGroup = new THREE.Group
let joyConGroup = new THREE.Group
let switchDock = new THREE.Group
let switchScreen = new THREE.Group
let headphoneGroup = new THREE.Group
let DBGroup = new THREE.Group
let chair = new THREE.Group
let kunai = new THREE.Group
let spoolGroup = new THREE.Group
let printerStatic = new THREE.Group
let printerPlate = new THREE.Group
let printerTip = new THREE.Group
let staticBook = new THREE.Group
let movingBook = new THREE.Group
let cube = new THREE.Group
let tvBase = new THREE.Group
let tvScreen = new THREE.Group
let curtains = new THREE.Group
let curtainsScale = new THREE.Group
let pokeball = new THREE.Group
let caseGroup = new THREE.Group
let container = new THREE.Group
let cup = new THREE.Group
let drawingPad = new THREE.Group
let pencil = new THREE.Group
let wallet = new THREE.Group
let whiteChess = new THREE.Group
let blackChess = new THREE.Group

let lotus = new THREE.Group
let lotusOrb = new THREE.Group
let contactCube = new THREE.Group

allObjects.add(bottomBedframeGroup)
allObjects.add(topBedframeGroup)
allObjects.add(topDrawer)
allObjects.add(midDrawer)
allObjects.add(botDrawer)
allObjects.add(staticStairsGroup)
allObjects.add(wallsandfloor)
allObjects.add(laptopGroup)
allObjects.add(screenGroup)
allObjects.add(mousepad)
allObjects.add(footballGroup)
allObjects.add(skateboardGroup)
allObjects.add(chessboardGroup)
allObjects.add(hookbase)
allObjects.add(sablayGroup)
allObjects.add(switchGroup)
allObjects.add(joyConGroup)
allObjects.add(switchDock)
allObjects.add(switchScreen)
allObjects.add(headphoneGroup)
allObjects.add(DBGroup)
allObjects.add(chair)
allObjects.add(kunai)
allObjects.add(spoolGroup)
allObjects.add(printerStatic)
allObjects.add(printerPlate)
allObjects.add(printerTip)
allObjects.add(staticBook)
allObjects.add(movingBook)
allObjects.add(cube)
allObjects.add(tvBase)
allObjects.add(tvScreen)
allObjects.add(curtains)
allObjects.add(curtainsScale)
allObjects.add(pokeball)
allObjects.add(caseGroup)
allObjects.add(container)
allObjects.add(cup)
allObjects.add(drawingPad)
allObjects.add(pencil)
allObjects.add(wallet)
allObjects.add(whiteChess)
allObjects.add(blackChess)

mainScene.add(lotus)

allObjects.position.set (0,3.75-10,0)
allObjects.scale.set (0.75,0.75,0.75)
allObjects.rotation.set(Math.PI/6, -Math.PI/4, 0)
mainScene.add(allObjects)

// Group Repositions for Phase 1
footballGroup.position.set(1.9,2.8,-1.9)
footballGroup.rotation.z = - Math.PI*40/180
footballGroup.rotation.y = - Math.PI*60/180
skateboardGroup.rotation.z = Math.PI
skateboardGroup.position.y = 6.1*scaleFactor
skateboardGroup.position.z = 1.5
skateboardGroup.position.x = 1.5
DBGroup.position.set(-2.25+2.5*scaleFactor,2.65,-1.75)
DBGroup.rotation.y = Math.PI*90/180
chair.position.set(-32.5*scaleFactor, 23*scaleFactor, -20*scaleFactor)
chair.rotation.y = Math.PI*30/180
kunai.position.set(4.5*scaleFactor, -0.25*scaleFactor, 4*scaleFactor)
spoolGroup.position.set(-38*scaleFactor, 14.25*scaleFactor, 49.3*scaleFactor)
cube.position.set(-1,2.7,-2.15)
chessboardGroup.position.set(-15*scaleFactor,-28.5*scaleFactor,70*scaleFactor)
whiteChess.position.set(-15*scaleFactor,-28.5*scaleFactor,70*scaleFactor)
blackChess.position.set(-15*scaleFactor,-28.5*scaleFactor,70*scaleFactor)
switchGroup.position.set(15*scaleFactor, 0, 10*scaleFactor)
switchDock.position.set(15*scaleFactor, 0, 10*scaleFactor)
joyConGroup.position.set(15*scaleFactor, 0, 10*scaleFactor)
switchScreen.position.set(15*scaleFactor, 0, 10*scaleFactor)
tvBase.position.set(0*scaleFactor, 0, 0)
tvScreen.position.set(0*scaleFactor, 0, 0)
bottomBedframeGroup.position.set(2.5*scaleFactor, 0, 0)
topBedframeGroup.position.set(2.5*scaleFactor, 0, 0)
movingBook.position.set(2.5*scaleFactor,0,0)
staticBook.position.set(2.5*scaleFactor,0,0)
headphoneGroup.position.set(2.5*scaleFactor,0,0)
laptopGroup.position.set(2.5*scaleFactor,0,0)
screenGroup.position.set(2.5*scaleFactor,0,0)
mousepad.position.set(2.5*scaleFactor,0,0)
caseGroup.position.set(2.5*scaleFactor,0,0)
sablayGroup.position.set(0,-4*0.025,0)
hookbase.position.set(0,-4*0.025,0)
pokeball.position.set(2.5*scaleFactor,2*0.025,0)
container.position.set(2.5*scaleFactor,0,0)
cup.position.set(2.5*scaleFactor,0,0)
wallet.position.set(2.5*scaleFactor,0,0)

// Lotus Positions
lotus.rotation.z = -Math.PI/12
lotus.rotation.x = Math.PI/3
lotus.rotation.y = Math.PI/4
// lotus.position.set(0,-17.5,0)
const lotusGroup = new THREE.Group
lotusGroup.position.set(-3,-15.5,0)
lotusGroup.add(lotus)
mainScene.add(lotusGroup)

lotus.add(lotusOrb)

const addOrb = () => {
    lotusOrb.position.z = 0
}

const removeOrb = () => {
    lotusOrb.position.z = -100000
}

// Contact Cube Positions
mainScene.add(contactCube)
contactCube.position.set(-5,-50.5,0)
contactCube.rotation.y = Math.PI/8

// Phase 0 GLTFLoader
gltfLoader.load(
    'LeftNameWall.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.025,0.025,0.025)

        leftNameWall.add(obj.scene)
        // obj.scene.castShadow = true
        // obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
    }
)

gltfLoader.load(
    'RightNameWall.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.025,0.025,0.025)

        rightNameWall.add(obj.scene)
        // obj.scene.castShadow = true
        // obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
    }
)

gltfLoader.load(
    'P.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.025,0.025,0.025)

        // 
        P.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        // obj.scene.children[0].receiveShadow = true
    }
)

gltfLoader.load(
    'A.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.025,0.025,0.025)


        // 
        A.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        // obj.scene.children[0].receiveShadow = true
    }
)

gltfLoader.load(
    'T.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.025,0.025,0.025)


        // 
        T.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        // obj.scene.children[0].receiveShadow = true
    }
)

gltfLoader.load(
    'R.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.025,0.025,0.025)


        // 
        R.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        // obj.scene.children[0].receiveShadow = true
    }
)

gltfLoader.load(
    'I.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.025,0.025,0.025)


        // 
        I.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        // obj.scene.children[0].receiveShadow = true
    }
)

gltfLoader.load(
    'C.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.025,0.025,0.025)


        // 
        C.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        // obj.scene.children[0].receiveShadow = true
    }
)

gltfLoader.load(
    'K.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.025,0.025,0.025)


        // 
        K.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        // obj.scene.children[0].receiveShadow = true
    }
)

// Lotus Models

gltfLoader.load(
    'LotusPetals.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.12,0.12,0.12)

        // 
        lotus.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
        obj.scene.children[0].material.color = new THREE.Color(0xf3f3f3)
    }
)

gltfLoader.load(
    'LotusOrb.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.12,0.12,0.12)

        // 
        lotusOrb.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
        obj.scene.children[0].material.color = new THREE.Color(0xff0000)
        obj.scene.children[0].material.envMap = environmentMap
        obj.scene.children[0].material.envMapIntensity = 2
    }
)

// Contact Cube
gltfLoader.load(
    'ContactCube.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        contactCube.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
        obj.scene.children[1].castShadow = true
        obj.scene.children[1].receiveShadow = true
        obj.scene.children[1].frustumCulled = false
        obj.scene.children[2].castShadow = true
        obj.scene.children[2].receiveShadow = true
        obj.scene.children[2].frustumCulled = false
        obj.scene.children[3].castShadow = true
        obj.scene.children[3].receiveShadow = true
        obj.scene.children[3].frustumCulled = false
        obj.scene.children[4].castShadow = true
        obj.scene.children[4].receiveShadow = true
        obj.scene.children[4].frustumCulled = false
    }
)

// GLTF Loader for Phase 1

gltfLoader.load(
    'Wallet.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        wallet.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'Pencil.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        pencil.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false

    }
)

gltfLoader.load(
    'DrawingPad.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        drawingPad.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'Cup.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        cup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'RandomBox.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        container.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'Container.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        container.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'Case.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        caseGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
        obj.scene.children[1].castShadow = true
        obj.scene.children[1].receiveShadow = true
        obj.scene.children[1].frustumCulled = false
    }
)

gltfLoader.load(
    'PokeBall.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        pokeball.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
        obj.scene.children[1].castShadow = true
        obj.scene.children[1].receiveShadow = true
        obj.scene.children[1].frustumCulled = false
        obj.scene.children[2].castShadow = true
        obj.scene.children[2].receiveShadow = true
        obj.scene.children[2].frustumCulled = false
    }
)

gltfLoader.load(
    'CurtainsScale.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        curtainsScale.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'CurtainsLeft.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        curtains.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'Curtains.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        curtains.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'TVScreen.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        tvScreen.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'TVBase.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        tvBase.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
        obj.scene.children[1].castShadow = true
        obj.scene.children[1].receiveShadow = true
        obj.scene.children[1].frustumCulled = false
    }
)

gltfLoader.load(
    'CubeBlack.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        cube.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
        obj.scene.children[1].castShadow = true
        obj.scene.children[1].receiveShadow = true
        obj.scene.children[1].frustumCulled = false
        obj.scene.children[2].castShadow = true
        obj.scene.children[2].receiveShadow = true
        obj.scene.children[2].frustumCulled = false
        obj.scene.children[3].castShadow = true
        obj.scene.children[3].receiveShadow = true
        obj.scene.children[3].frustumCulled = false
        obj.scene.children[4].castShadow = true
        obj.scene.children[4].receiveShadow = true
        obj.scene.children[4].frustumCulled = false
        obj.scene.children[5].castShadow = true
        obj.scene.children[5].receiveShadow = true
        obj.scene.children[5].frustumCulled = false
        obj.scene.children[6].castShadow = true
        obj.scene.children[6].receiveShadow = true
        obj.scene.children[6].frustumCulled = false
    }
)

gltfLoader.load(
    'MovingBook.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        movingBook.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
        obj.scene.children[1].castShadow = true
        obj.scene.children[1].receiveShadow = true
        obj.scene.children[1].frustumCulled = false
    }
)

gltfLoader.load(
    'StaticBook.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        staticBook.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
        obj.scene.children[1].castShadow = true
        obj.scene.children[1].receiveShadow = true
        obj.scene.children[1].frustumCulled = false
        obj.scene.children[2].castShadow = true
        obj.scene.children[2].receiveShadow = true
        obj.scene.children[2].frustumCulled = false
        obj.scene.children[3].castShadow = true
        obj.scene.children[3].receiveShadow = true
        obj.scene.children[3].frustumCulled = false
        obj.scene.children[4].castShadow = true
        obj.scene.children[4].receiveShadow = true
        obj.scene.children[4].frustumCulled = false
        obj.scene.children[5].castShadow = true
        obj.scene.children[5].receiveShadow = true
        obj.scene.children[5].frustumCulled = false
        obj.scene.children[6].castShadow = true
        obj.scene.children[6].receiveShadow = true
        obj.scene.children[6].frustumCulled = false
    }
)

gltfLoader.load(
    'PrinterTip.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        printerTip.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'PrinterPlate.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        printerPlate.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'PrinterStatic.glb',
    (obj) => {
        
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        printerStatic.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
        obj.scene.children[1].castShadow = true
        obj.scene.children[1].receiveShadow = true
        obj.scene.children[1].frustumCulled = false
    }
)

gltfLoader.load(
    'Fillament.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        spoolGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'PLASpool.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        spoolGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'KunaiBase.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        kunai.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'KunaiHandle.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        kunai.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'Chair.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        chair.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'DBSphere.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        DBGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'DBStar.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        DBGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'HeadphoneFoam.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        headphoneGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'HeadphoneBase.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        headphoneGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'SwitchDock.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        switchDock.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'BlackSwitchButtons.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        joyConGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'BlueJoyCon.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        joyConGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'RedJoyCon.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        joyConGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)


gltfLoader.load(
    'SwitchScreen.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        switchScreen.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)


gltfLoader.load(
    'SwitchBlack.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        switchGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'Sablay.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        sablayGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'HookBase.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        hookbase.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'BlackChess.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        blackChess.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'WhiteChess.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        whiteChess.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'ChessBoard.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        chessboardGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'ChessBoardLight.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        chessboardGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'DarkTiles.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        chessboardGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'LightTIles.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        chessboardGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'Board.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        skateboardGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'Trucks.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        skateboardGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].frustumCulled = false
        // obj.scene.children[0].receiveShadow = true
    }
)

gltfLoader.load(
    'Wheels.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        skateboardGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'Griptape.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        skateboardGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'Laces.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        footballGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'Football.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        footballGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'MousePad.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        mousepad.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'TopLaptop.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
        laptopGroup.add(obj.scene)
    }
)

gltfLoader.load(
    'BottomLaptop.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        laptopGroup.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'Screen.glb',
    (obj) => {
       
        // obj.scene.traverse((child) => {
        //     child.material = offLaptopMaterial
        // })

        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)
        

        // 
        // obj.scene.castShadow = true
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
        screenGroup.add(obj.scene)

    }
)

gltfLoader.load(
    'WoodFloor.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        wallsandfloor.add(obj.scene)
        // obj.scene.castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)


gltfLoader.load(
    'WhiteMats.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        staticStairsGroup.add(obj.scene)
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'WhiteDrawerTop.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        topDrawer.add(obj.scene)
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'WhiteDrawerMiddle.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        midDrawer.add(obj.scene)
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'WhiteDrawerBottom.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        botDrawer.add(obj.scene)
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'TopWhiteBedframe.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        topBedframeGroup.add(obj.scene)
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'TopBlackBedframe.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        topBedframeGroup.add(obj.scene)
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false

    }
)

gltfLoader.load(
    'RedWalls.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        wallsandfloor.add(obj.scene)
        obj.scene.castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'Pillow.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        topBedframeGroup.add(obj.scene)
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'BottomWhiteBedframe.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        bottomBedframeGroup.add(obj.scene)
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)

gltfLoader.load(
    'BottomBlackBedframe.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        bottomBedframeGroup.add(obj.scene)
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false

    }
)

gltfLoader.load(
    'BlackStairs.glb',
    (obj) => {
       
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        staticStairsGroup.add(obj.scene)
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false
    }
)


gltfLoader.load(
    'Bed.glb',
    (obj) => {
        mainScene.add(obj.scene)
        obj.scene.scale.set(0.05,0.05,0.05)

        // 
        topBedframeGroup.add(obj.scene)
        obj.scene.children[0].castShadow = true
        obj.scene.children[0].receiveShadow = true
        obj.scene.children[0].frustumCulled = false

    }
)

// Drawer Objects
const cubeGeometry = new THREE.BoxBufferGeometry(0.3, 0.3, 0.3)
const cubeMaterial = new THREE.MeshNormalMaterial({
    
})
const cubeDrawer = new THREE.Mesh(cubeGeometry, cubeMaterial)
cubeDrawer.position.set(1.9, 0.25 + 2, -1.9)
topDrawer.add(cubeDrawer)

const sphereGeometry = new THREE.TetrahedronGeometry(0.3)
const sphereMaterial = new THREE.MeshNormalMaterial({
    
})
const sphereDrawer = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphereDrawer.position.set(1.9, -0.5 + 2, -1.25)
midDrawer.add(sphereDrawer)

const torusGeometry = new THREE.TorusGeometry(0.15, 0.1, 16, 100)
const torusMaterial = new THREE.MeshNormalMaterial({
    
})
const torusDrawer = new THREE.Mesh(torusGeometry, torusMaterial)
torusDrawer.position.set(1.9, -1.25 + 2, -0.65)
botDrawer.add(torusDrawer)

// Lighting
const directionalLights = new THREE.Group
let opacities = {
    room: 0,
    walls: 1,
    mainAmb: 0.1,
    roomAmb: 0
}

const leftDirectionalLight = new THREE.DirectionalLight(0xff0000, opacities.walls)
leftDirectionalLight.castShadow = true
leftDirectionalLight.shadow.mapSize.x = 1024*4
leftDirectionalLight.shadow.mapSize.y = 1024*4
leftDirectionalLight.shadow.camera.near = 5
leftDirectionalLight.shadow.camera.far = 20
leftDirectionalLight.shadow.normalBias = 0.05
leftDirectionalLight.position.set(0, 0, -10)
leftDirectionalLight.target.position.set(0,4,0)
mainScene.add(leftDirectionalLight.target)
mainScene.add(leftDirectionalLight)

const rightDirectionalLight = new THREE.DirectionalLight(0xffffff, opacities.walls)
rightDirectionalLight.castShadow = true
rightDirectionalLight.shadow.mapSize.x = 1024*4
rightDirectionalLight.shadow.mapSize.y = 1024*4
rightDirectionalLight.shadow.camera.near = 5
rightDirectionalLight.shadow.camera.far = 100
rightDirectionalLight.shadow.normalBias = 0.05
rightDirectionalLight.position.set(10, 0, 0)
rightDirectionalLight.target.position.set(0,4,0)
mainScene.add(rightDirectionalLight.target)
mainScene.add(rightDirectionalLight)

directionalLights.add(leftDirectionalLight)
directionalLights.add(rightDirectionalLight)
directionalLights.rotation.y = -Math.PI
mainScene.add(directionalLights)
nameGroup.add(directionalLights)

const mainAmbientLight = new THREE.AmbientLight(0x000000, opacities.mainAmb)
mainScene.add(mainAmbientLight)

const roomAmbientLight = new THREE.AmbientLight(0xaaaaaa, opacities.roomAmb)
mainScene.add(roomAmbientLight)

const roomPointLight = new THREE.PointLight(0xaaaabb, opacities.room)
roomPointLight.castShadow = true
roomPointLight.shadow.mapSize.x = 1024*4
roomPointLight.shadow.mapSize.y = 1024*4
roomPointLight.shadow.camera.near = 5
roomPointLight.shadow.camera.far = 50
roomPointLight.shadow.normalBias = 0.1
mainScene.add(roomPointLight)

/**
 * Sizes
 */
const sizes = {
    width: 0,
    height: 0,
}

let zoomFactor = 1

const savedSizes = {
    width: 0,
    height: 0,
}

if (window.innerHeight > window.innerWidth) {
    zoomFactor = 3
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    savedSizes.width = sizes.height
    savedSizes.height = sizes.width
}
else {
    zoomFactor = 1
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    savedSizes.width = sizes.width
    savedSizes.height = sizes.height
}

const renderers = []
window.addEventListener('resize', () => {  
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    if (window.innerHeight > window.innerWidth) {
        // sizes.width = savedSizes.height
        // sizes.height = savedSizes.width
        zoomFactor = 3
            // Update mainCamera
        mainCamera.aspect = sizes.width / sizes.height
        mainCamera.position.z = 10*zoomFactor
        // mainCamera.fov = 465;
        renderers[0].setSize(sizes.width, sizes.height)
        renderers[0].setPixelRatio(Math.min(window.devicePixelRatio, 2))
        mainCamera.updateProjectionMatrix();
    }
    else {
        // sizes.width = savedSizes.width
        // sizes.height = savedSizes.height
        zoomFactor = 1
            // Update mainCamera
        mainCamera.position.z = 10*zoomFactor
        mainCamera.aspect = sizes.width / sizes.height
        mainCamera.fov = 45;
        renderers[0].setSize(sizes.width, sizes.height)
        renderers[0].setPixelRatio(Math.min(window.devicePixelRatio, 2))
        mainCamera.updateProjectionMatrix();
    }
})

// Camera
const mainCamera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
mainCamera.position.set(0, 5, 10*zoomFactor)
mainCamera.fov = 45;
mainCamera.updateProjectionMatrix();
mainScene.add(mainCamera)
mainCamera.add(roomPointLight)
roomPointLight.position.set(-10, 10, 10)

/**
 * Renderer
 */
let rendererCount = 0
const makeRenderer = (x) => {
    const renderer = new THREE.WebGLRenderer({
        canvas: x,
        antialias: true,
        alpha: true
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.CineonToneMapping
    renderers[rendererCount] = renderer
    rendererCount++
}
makeRenderer(mainCanvas)
// makeRenderer(roomCanvas)

// Raycaster
const mainRaycaster = new THREE.Raycaster()

// Scroll
const sectionDistance = 10

window.addEventListener('scroll', () => {
    bodyScrollBar.scrollTop = bodyScrollBar.scrollTop
})

// Mouse
const mouse = {x: 0, y:0}
const mainMouse = {x: 0, y:0}

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
    mainMouse.x = mouse.x
    mainMouse.y = mouse.y
    // // Cursor Follower
    // gsap.to('.cursorFollower', {x: event.clientX - 100, y: event.clientY - 100})
})

// Parallax Camera Group
const mainCameraGroup = new THREE.Group
mainCameraGroup.add(mainCamera)
mainScene.add(mainCameraGroup)

// GSAP Animations
let isAnimationPlaying = false

let isPRotated = false
let isARotated = false
let isTRotated = false
let isRRotated = false
let isIRotated = false
let isCRotated = false
let isKRotated = false

const animateP = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.set(P.rotation, {y: P.rotation.y})
    if (isPRotated == false) {
        gsap.to(P.rotation, {duration: 1, delay: 0, y: P.rotation.y + Math.PI*90/180})
        isPRotated = true
    }
    else {
        gsap.to(P.rotation, {duration: 1, delay: 0, y: P.rotation.y - Math.PI*90/180})
        isPRotated = false
    }
}

const animateA = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.set(A.rotation, {y: A.rotation.y})
    if (isARotated == false) {
        gsap.to(A.rotation, {duration: 1, delay: 0, y: A.rotation.y + Math.PI*90/180})
        isARotated = true
    }
    else {
        gsap.to(A.rotation, {duration: 1, delay: 0, y: A.rotation.y - Math.PI*90/180})
        isARotated = false
    }
}

const animateT = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.set(T.rotation, {y: T.rotation.y})
    if (isTRotated == false) {
        gsap.to(T.rotation, {duration: 1, delay: 0, y: T.rotation.y + Math.PI*90/180})
        isTRotated = true
    }
    else {
        gsap.to(T.rotation, {duration: 1, delay: 0, y: T.rotation.y - Math.PI*90/180})
        isTRotated = false
    }
}

const animateR = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.set(R.rotation, {y: R.rotation.y})
    if (isRRotated == false) {
        gsap.to(R.rotation, {duration: 1, delay: 0, y: R.rotation.y + Math.PI*90/180})
        isRRotated = true
    }
    else {
        gsap.to(R.rotation, {duration: 1, delay: 0, y: R.rotation.y - Math.PI*90/180})
        isRRotated = false
    }
}

const animateI = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.set(I.rotation, {y: I.rotation.y})
    if (isIRotated == false) {
        gsap.to(I.rotation, {duration: 1, delay: 0, y: I.rotation.y + Math.PI*90/180})
        isIRotated = true
    }
    else {
        gsap.to(I.rotation, {duration: 1, delay: 0, y: I.rotation.y - Math.PI*90/180})
        isIRotated = false
    }
}

const animateC = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.set(C.rotation, {y: C.rotation.y})
    if (isCRotated == false) {
        gsap.to(C.rotation, {duration: 1, delay: 0, y: C.rotation.y + Math.PI*90/180})
        isCRotated = true
    }
    else {
        gsap.to(C.rotation, {duration: 1, delay: 0, y: C.rotation.y - Math.PI*90/180})
        isCRotated = false
    }
}

const animateK = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.set(K.rotation, {y: K.rotation.y})
    if (isKRotated == false) {
        gsap.to(K.rotation, {duration: 1, delay: 0, y: K.rotation.y + Math.PI*90/180})
        isKRotated = true
    }
    else {
        gsap.to(K.rotation, {duration: 1, delay: 0, y: K.rotation.y - Math.PI*90/180})
        isKRotated = false
    }
}

const spinLeftWall = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.set(leftNameWall.rotation, {x: leftNameWall.rotation.x, y: 0, z: 0})
    gsap.to(leftNameWall.rotation, {duration: 1, x: Math.PI + leftNameWall.rotation.x})

    if (isPRotated == true) {
        gsap.to(P.rotation, {duration: 1, delay: 0, y: P.rotation.y - Math.PI*90/180})
        isPRotated = false
    }
    if (isARotated == true) {
        gsap.to(A.rotation, {duration: 1, delay: 0, y: A.rotation.y - Math.PI*90/180})
        isARotated = false
    }
    if (isTRotated == true) {
        gsap.to(T.rotation, {duration: 1, delay: 0, y: T.rotation.y - Math.PI*90/180})
        isTRotated = false
    }
    if (isRRotated == true) {
        gsap.to(R.rotation, {duration: 1, delay: 0, y: R.rotation.y - Math.PI*90/180})
        isRRotated = false
    }
    if (isIRotated == true) {
        gsap.to(I.rotation, {duration: 1, delay: 0, y: I.rotation.y - Math.PI*90/180})
        isIRotated = false
    }
    if (isCRotated == true) {
        gsap.to(C.rotation, {duration: 1, delay: 0, y: C.rotation.y - Math.PI*90/180})
        isCRotated = false
    }
    if (isKRotated == true) {
        gsap.to(K.rotation, {duration: 1, delay: 0, y: K.rotation.y - Math.PI*90/180})
        isKRotated = false
    }
}

const spinRightWall = () => {
    isAnimationPlaying = true

    gsap.set(rightNameWall.rotation, {x: rightNameWall.rotation.x, y: 0, z: 0})
    gsap.to(rightNameWall.rotation, {duration: 1, z: Math.PI + rightNameWall.rotation.x})

    bobbleP = false
    bobbleK = false
    chaosName()
}

let bobbleP = false
let bobbleK = false

const chaosName = () => {
    isAnimationPlaying = true
    isPRotated = true
    isARotated = true
    isTRotated = true
    isRRotated = true
    isIRotated = true
    isCRotated = true
    isKRotated = true
    gsap.to(P.position, {x: Math.random()*1-3, y: Math.random()*4-2, z: Math.random()*1-3})
    gsap.to(P.rotation, {x: Math.random()*Math.PI*2, y: Math.random()*Math.PI*2, z: Math.random()*Math.PI*2})
    
    gsap.to(A.position, {x: Math.random()*1-2, y: Math.random()*4-2, z: Math.random()*1-2})
    gsap.to(A.rotation, {x: Math.random()*Math.PI*2, y: Math.random()*Math.PI*2, z: Math.random()*Math.PI*2})
    
    gsap.to(T.position, {x: Math.random()*1-1, y: Math.random()*4-2, z: Math.random()*1-1})
    gsap.to(T.rotation, {x: Math.random()*Math.PI*2, y: Math.random()*Math.PI*2, z: Math.random()*Math.PI*2})
    
    gsap.to(R.position, {x: Math.random()*1-0, y: Math.random()*4-2, z: Math.random()*1-0})
    gsap.to(R.rotation, {x: Math.random()*Math.PI*2, y: Math.random()*Math.PI*2, z: Math.random()*Math.PI*2})
    
    gsap.to(I.position, {x: Math.random()*1+1, y: Math.random()*4-2, z: Math.random()*1+1})
    gsap.to(I.rotation, {x: Math.random()*Math.PI*2, y: Math.random()*Math.PI*2, z: Math.random()*Math.PI*2})
    
    gsap.to(C.position, {x: Math.random()*1+2, y: Math.random()*4-2, z: Math.random()*1+2})
    gsap.to(C.rotation, {x: Math.random()*Math.PI*2, y: Math.random()*Math.PI*2, z: Math.random()*Math.PI*2})
    
    gsap.to(K.position, {x: Math.random()*1+3, y: Math.random()*4-2, z: Math.random()*1+3})
    gsap.to(K.rotation, {x: Math.random()*Math.PI*2, y: Math.random()*Math.PI*2, z: Math.random()*Math.PI*2})

    setTimeout(() => {
        gsap.to(P.position, {duration: 1, x: -105*0.025, y: 0, z: -105*0.025})
        gsap.to(P.rotation, {duration: 1, x: 0, y: Math.PI/2, z: 0})
        setTimeout(() => {
            bobbleP = true
        }, 1000)
    
        gsap.to(A.position, {duration: 1, delay: 0.25, x: -70*0.025, y: 0, z: -70*0.025})
        gsap.to(A.rotation, {duration: 1, delay: 0.25, x: 0, y: Math.PI/2, z: 0})
    
        gsap.to(T.position, {duration: 1, delay: 0.5, x: -35*0.025, y: 0, z: -35*0.025})
        gsap.to(T.rotation, {duration: 1, delay: 0.5, x: 0, y: Math.PI/2, z: 0})
    
        gsap.to(R.position, {duration: 1, delay: 0.75, x: 0, y: 0, z: 0})
        gsap.to(R.rotation, {duration: 1, delay: 0.75, x: 0, y: Math.PI/2, z: 0})
    
        gsap.to(I.position, {duration: 1, delay: 1, x: 35*0.025, y: 0, z: 35*0.025})
        gsap.to(I.rotation, {duration: 1, delay: 1, x: 0, y: Math.PI/2, z: 0})
    
        gsap.to(C.position, {duration: 1, delay: 1.25, x: 70*0.025, y: 0, z: 70*0.025})
        gsap.to(C.rotation, {duration: 1, delay: 1.25, x: 0, y: Math.PI/2, z: 0})
    
        gsap.to(K.position, {duration: 1, delay: 1.5, x: 105*0.025, y: 0, z: 105*0.025})
        gsap.to(K.rotation, {duration: 1, delay: 1.5, x: 0, y: Math.PI/2, z: 0})
        setTimeout(() => {
            bobbleK = true
            spinLeftWall()
        }, 2500)
    }, 2000)
}

let isTopDrawerOut = false
let isMidDrawerOut = false
let isBotDrawerOut = false

const topDrawerOut = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    if (isTopDrawerOut == false) {
        gsap.to(topDrawer.position, {duration: 1, delay: 0, z: 13*scaleFactor})
        isTopDrawerOut = true
    }

    else if (isTopDrawerOut == true) {
        gsap.to(topDrawer.position, {duration: 1, delay: 0, z: 0})
        isTopDrawerOut = false
    }
}

const midDrawerOut = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    
    if (isMidDrawerOut == false) {
        gsap.to(midDrawer.position, {duration: 1, delay: 0, z: 13*scaleFactor})
        isMidDrawerOut = true
    }

    else if (isMidDrawerOut == true) {
        gsap.to(midDrawer.position, {duration: 1, delay: 0, z: 0})
        isMidDrawerOut = false
    }
}

const botDrawerOut = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    
    if (isBotDrawerOut == false) {
        gsap.to(botDrawer.position, {duration: 1, delay: 0, z: 13*scaleFactor})
        isBotDrawerOut = true
    }

    else if (isBotDrawerOut == true) {
        gsap.to(botDrawer.position, {duration: 1, delay: 0, z: 0})
        isBotDrawerOut = false
    }
}

const lightLaptop = () => {
    // hideOthers(0)
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)
 
    screenGroup.children[0].children[0].material.emissive.r = 1
    screenGroup.children[0].children[0].material.emissive.g = 1
    screenGroup.children[0].children[0].material.emissive.b = 1

    setTimeout(() => {
        screenGroup.children[0].children[0].material.emissive.r = 0
        screenGroup.children[0].children[0].material.emissive.g = 0
        screenGroup.children[0].children[0].material.emissive.b = 0
    }, 1000)
    isLaptopOn = true
}

const floatFootball = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.set(footballGroup.rotation, {z: - Math.PI*40/180, x: 0})
    gsap.to(footballGroup.position, {ease: 'Power3.easeOut', duration: 0.75, delay: 0, y: 4})
    gsap.to(footballGroup.position, {ease: 'Power3.easeIn', duration: 0.75, delay: 0.75, y: 2.8})

    gsap.to(footballGroup.rotation, {ease: 'Power3.easeOut',duration: 0.5, delay: 0, x: - Math.PI*45/180})
    gsap.to(footballGroup.rotation, {duration: 1.4, delay: 0, z: Math.PI*2*4 - Math.PI*40/180})
    gsap.to(footballGroup.rotation, {ease: 'Power1.easeIn', duration: 0.5, delay: 0.5, x: Math.PI*45/180})
 
    gsap.to(footballGroup.rotation, {ease: 'Power1.easeInOut', duration: 0.25, delay: 1.4, x: 0})
}

const flipBoard = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)
    
    gsap.set(skateboardGroup.rotation, {z: Math.PI, y: 0})
    gsap.to(skateboardGroup.position, {ease: 'Power1.easeOut', duration: 0.6, delay: 0, y: 1})
    gsap.to(skateboardGroup.rotation, {ease: 'Power0.easeNone', duration: 1, delay: 0.05, z: Math.PI*2 + Math.PI, y: Math.PI*2})
    gsap.to(skateboardGroup.position, {ease: 'Power1.easeIn', duration: 0.45, delay: 0.5, y: 6.1*scaleFactor})
}

const switchJump = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.to(joyConGroup.position, {ease: 'Power1.easeOut', duration: 1, delay: 0, y: 0.5})
    gsap.to(joyConGroup.position, {ease: 'Power1.easeIn', duration: 0.5, delay: 1, y: 0})
    gsap.to(switchGroup.position, {ease: 'Power1.easeOut', duration: 0.5, delay: 0.5, y: 0.5})
    gsap.to(switchGroup.position, {ease: 'Power1.easeIn', duration: 0.5, delay: 1, y: 0})
    gsap.to(switchScreen.position, {ease: 'Power1.easeOut', duration: 0.5, delay: 0.5, y: 0.5})
    gsap.to(switchScreen.position, {ease: 'Power1.easeIn', duration: 0.5, delay: 1, y: 0})

    setTimeout(() => {
        switchScreen.children[0].children[0].material.emissive.r = 1
        switchScreen.children[0].children[0].material.emissive.g = 1
        switchScreen.children[0].children[0].material.emissive.b = 1
    }, 850)

    setTimeout(() => {
        switchScreen.children[0].children[0].material.emissive.r = 0
        switchScreen.children[0].children[0].material.emissive.g = 0
        switchScreen.children[0].children[0].material.emissive.b = 0
    }, 1450)

}

const printerAnim = () => {
    // hideOthers(2)
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.to(printerPlate.position, {ease: 'Power1.easeOut', duration: 1, delay: 0, x: 0.4})
    gsap.to(printerPlate.position, {ease: 'Power1.easeIn', duration: 1, delay: 1, x: 0})
    gsap.to(printerTip.position, {ease: 'Power1.easeOut', duration: 1, delay: 0, z: -0.6})
    gsap.to(printerTip.position, {ease: 'Power1.easeIn', duration: 1, delay: 1, z: 0})
    gsap.to(spoolGroup.rotation, {ease: 'Power1.easeOut', duration: 1, delay: 0, x: - Math.PI*120/180})
    gsap.to(spoolGroup.rotation, {ease: 'Power1.easeIn', duration: 1, delay: 1, x: 0})

}

let isCurtainOpen = false

const scaleCurtains = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    if (isCurtainOpen == true) {
        gsap.to(curtainsScale.children[0].children[0].scale, {ease: 'Power1.easeOut', duration: 1, delay: 0, x: 1})
        gsap.to(curtainsScale.children[0].children[0].position, {ease: 'Power1.easeOut', duration: 1, delay: 0, z: 0})
        isCurtainOpen = false
    }

    else if (isCurtainOpen == false) {
        gsap.to(curtainsScale.children[0].children[0].scale, {ease: 'Power1.easeOut', duration: 1, delay: 0, x: 0.5})
        gsap.to(curtainsScale.children[0].children[0].position, {ease: 'Power1.easeOut', duration: 1, delay: 0, z: -17.5})
        isCurtainOpen = true
    }
}

const moveBook = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.to(movingBook.position, {ease: 'Power1.easeOut', duration: 1, delay: 0, z: 2*scaleFactor})
    gsap.to(movingBook.position, {ease: 'Power1.easeOut', duration: 1, delay: 1, z: 0})
}

const tvOpen = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    tvScreen.children[0].children[0].material.emissive.r = 1
    tvScreen.children[0].children[0].material.emissive.g = 1
    tvScreen.children[0].children[0].material.emissive.b = 1

    setTimeout(() => {
        tvScreen.children[0].children[0].material.emissive.r = 0
        tvScreen.children[0].children[0].material.emissive.g = 0
        tvScreen.children[0].children[0].material.emissive.b = 0
    }, 1000)
}


const chessJump = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.to(whiteChess.position, {ease: 'Power1.easeOut', duration: 0.5, delay: 0, y: -28.5*scaleFactor + 0.5})
    gsap.to(whiteChess.position, {ease: 'Power1.easeIn', duration: 0.5, delay: 0.5, y: -28.5*scaleFactor})

    setTimeout(() => {
        
        gsap.to(blackChess.position, {ease: 'Power1.easeOut', duration: 0.5, delay: 0, y: -28.5*scaleFactor + 0.5})
        gsap.to(blackChess.position, {ease: 'Power1.easeIn', duration: 0.5, delay: 0.5, y: -28.5*scaleFactor})
    
    }, 500)
}

const pencilJump = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.to(drawingPad.position, {ease: 'Power1.easeOut', duration: 0.5, delay: 0, y: 0.5})
    gsap.to(drawingPad.position, {ease: 'Power1.easeIn', duration: 0.5, delay: 0.5, y: 0})

    gsap.to(pencil.position, {ease: 'Power1.easeOut', duration: 0.5, delay: 0, y: 0.5, x: 0.1})
    gsap.to(pencil.position, {ease: 'Power1.easeIn', duration: 0.5, delay: 0.5, y: 0, x: 0})
}

const objectsJump = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.to(pokeball.position, {ease: 'Power1.easeOut', duration: 0.5, delay: 0, y: 2*0.025 + 0.2})
    gsap.to(pokeball.position, {ease: 'Power1.easeIn', duration: 0.5, delay: 0.5, y: 2*0.025})

    gsap.to(kunai.position, {ease: 'Power1.easeOut', duration: 0.5, delay: 0.5, y: 0.5, y: -0.25*scaleFactor + 0.2})
    gsap.to(kunai.position, {ease: 'Power1.easeIn', duration: 0.5, delay: 1, y: 0, y: -0.25*scaleFactor})

    gsap.to(DBGroup.position, {ease: 'Power1.easeOut', duration: 0.5, delay: 1, y: 0.5, y: 2.65 + 0.2})
    gsap.to(DBGroup.position, {ease: 'Power1.easeIn', duration: 0.5, delay: 1.5, y: 0, y: 2.65})
}

const spinBed = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    if (isBedUp == false) {
        gsap.to(topBedframeGroup.position, {ease: 'Power1.easeOut', duration: 1, delay: 0, y: 2})
        setTimeout(() => {
            isBedUp = true
        },1000)
    }
    else {
        gsap.to(topBedframeGroup.position, {ease: 'Power1.easeIn', duration: 1, delay: 0, y: 0})
        isBedUp = false
    }
}

const sablaySqueeze = () => {
    // hideOthers(1)
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.to(sablayGroup.scale, {ease: 'Power1.easeOut', duration: 0.15, delay: 0, y: 1.25})
    gsap.to(sablayGroup.position, {ease: 'Power1.easeOut', duration: 0.15, delay: 0, y: -4*0.025 - 1.05})

    gsap.to(sablayGroup.scale, {ease: 'Power1.easeOut', duration: 0.5, delay: 0.15, y: 0.8})
    gsap.to(sablayGroup.position, {ease: 'Power1.easeOut', duration: 0.5, delay: 0.15, y: 0.75})

    gsap.to(sablayGroup.scale, {ease: 'Power1.easeIn', duration: 0.35, delay: 0.65, y: 1})
    gsap.to(sablayGroup.position, {ease: 'Power1.easeIn', duration: 0.35, delay: 0.65, y: -4*0.025})

}

const cubeJump = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.to(cube.position, {ease: 'Power1.easeOut', duration: 0.5, delay: 0, y: 2.7 + 0.1})
    gsap.to(cube.rotation, {ease: 'Power1.easeOut', duration: 0.75, delay: 0, x: cube.rotation.x + Math.PI*2, y: cube.rotation.y + Math.PI*2})
    gsap.to(cube.position, {ease: 'Power1.easeIn', duration: 0.5, delay: 0.5, y: 2.7})

}

const headphoneJump = () => {
    isAnimationPlaying = true
    setTimeout(() => {
        isAnimationPlaying = false
    }, 1000)

    gsap.to(headphoneGroup.position, {ease: 'Power1.easeOut', duration: 0.5, delay: 0, y: 0.5})
    gsap.to(headphoneGroup.position, {ease: 'Power1.easeIn', duration: 0.5, delay: 0.5, y: 0})

}

 // RayCasting
let isLaptopOn = true
let isBedUp = false

let sitePhase = 'HOME'

let spinBox = false
let spinCount = 0 

const spinBoxAnim = () => {
    // Boxes Spin
    spinBox = true
    setTimeout(() => {
        spinBox = false
    }, 1000)
    for (let i = 0; i < boxesArray.length; i++) {
        if (i%2 == 0) {
            if (spinCount%3 == 0) {
                gsap.to(boxesArray[i].rotation, {duration: 1, x: boxesArray[i].rotation.x + Math.PI/2})
            }
            else if (spinCount%3 == 1) {
                gsap.to(boxesArray[i].rotation, {duration: 1, z: boxesArray[i].rotation.z + Math.PI/2})
            }
            else {
                gsap.to(boxesArray[i].rotation, {duration: 1, y: boxesArray[i].rotation.y + Math.PI/2})
            }
        }
        else {
            if (spinCount%3 == 1) {
                gsap.to(boxesArray[i].rotation, {duration: 1, x: boxesArray[i].rotation.x - Math.PI/2})
            }
            else if (spinCount%3 == 2) {
                gsap.to(boxesArray[i].rotation, {duration: 1, z: boxesArray[i].rotation.z - Math.PI/2})
            }
            else {
                gsap.to(boxesArray[i].rotation, {duration: 1, y: boxesArray[i].rotation.y - Math.PI/2})
            }
        }
    }
    spinCount++
}

window.addEventListener('click', () => {
    spinBoxAnim()

    // Raycasts
    if (isAnimationPlaying == false && noClicks == false) {
        if (firstCurrentIntersect) {
            // Contact Cube
            if (firstCurrentIntersect.object == contactCube.children[0].children[0] || firstCurrentIntersect.object == contactCube.children[0].children[1] || firstCurrentIntersect.object == contactCube.children[0].children[2] || firstCurrentIntersect.object == contactCube.children[0].children[3] || firstCurrentIntersect.object == contactCube.children[0].children[4] || firstCurrentIntersect.object == contactCube.children[0].children[5]) {
                spinContactCube()

                firstCurrentIntersect = null
            }
            // Landing
            else if (firstCurrentIntersect.object == P.children[0].children[0]) {
                animateP()

                firstCurrentIntersect = null
            }
            else if (firstCurrentIntersect.object == A.children[0].children[0]) {
                animateA()

                firstCurrentIntersect = null
            }
            else if (firstCurrentIntersect.object == T.children[0].children[0]) {
                animateT()

                firstCurrentIntersect = null
            }
            else if (firstCurrentIntersect.object == R.children[0].children[0]) {
                animateR()

                firstCurrentIntersect = null
            }
            else if (firstCurrentIntersect.object == I.children[0].children[0]) {
                animateI()

                firstCurrentIntersect = null
            }
            else if (firstCurrentIntersect.object == C.children[0].children[0]) {
                animateC()

                firstCurrentIntersect = null
            }
            else if (firstCurrentIntersect.object == K.children[0].children[0]) {
                animateK()

                firstCurrentIntersect = null
            }
            else if (firstCurrentIntersect.object == rightNameWall.children[0].children[0]) {
                spinRightWall()

                firstCurrentIntersect = null
            }
            else if (firstCurrentIntersect.object == leftNameWall.children[0].children[0]) {
                spinLeftWall()
                colorChange()

                firstCurrentIntersect = null
            }
        }

        if (currentIntersect) {
            if (currentIntersect.object == laptopGroup.children[0].children[0] || currentIntersect.object == laptopGroup.children[1].children[0] || currentIntersect.object == screenGroup.children[0].children[0]) {
                lightLaptop()
                chooseItem(0)
                changeDescription(1)
                isLaptopOn = true
            }
            if (isLaptopOn == true) {
                if (currentIntersect.object == topBedframeGroup.children[0].children[0] || currentIntersect.object == topBedframeGroup.children[1].children[0] || currentIntersect.object == topBedframeGroup.children[2].children[0] || currentIntersect.object == topBedframeGroup.children[3].children[0]) {
                    spinBed()

                    currentIntersect = null
                }
                else if (currentIntersect.object == topDrawer.children[0].children[0] || currentIntersect.object == topDrawer.children[1].children[0]) {
                    topDrawerOut()

                    currentIntersect = null
                }
                else if (currentIntersect.object == midDrawer.children[0].children[0] || currentIntersect.object == midDrawer.children[1].children[0]) {
                    midDrawerOut()

                    currentIntersect = null
                }
                else if (currentIntersect.object == botDrawer.children[0].children[0] || currentIntersect.object == botDrawer.children[1].children[0]) {
                    botDrawerOut()

                    currentIntersect = null
                }
                else if (currentIntersect.object == footballGroup.children[0].children[0] || currentIntersect.object == footballGroup.children[1].children[0]) {
                    floatFootball()
                    chooseItem(7)
                    changeDescription(8)
                    currentIntersect = null
                }
                else if (currentIntersect.object == skateboardGroup.children[0].children[0] || currentIntersect.object == skateboardGroup.children[1].children[0] || currentIntersect.object == skateboardGroup.children[2].children[0] ||currentIntersect.object == skateboardGroup.children[3].children[0]) {
                    flipBoard()
                    chooseItem(9)
                    changeDescription(10)
                    currentIntersect = null
                }
                else if (currentIntersect.object == sablayGroup.children[0].children[0] || currentIntersect.object == sablayGroup.children[0].children[1] || currentIntersect.object == sablayGroup.children[0].children[2] || currentIntersect.object == sablayGroup.children[0].children[3] || currentIntersect.object == sablayGroup.children[0].children[4] || currentIntersect.object == sablayGroup.children[0].children[5] || currentIntersect.object == sablayGroup.children[0].children[6] || currentIntersect.object == sablayGroup.children[0].children[7] ) {
                    sablaySqueeze()
                    chooseItem(2)
                    changeDescription(3)
                    currentIntersect = null
                }
                else if (currentIntersect.object == switchGroup.children[0].children[0] || currentIntersect.object == switchScreen.children[0].children[0] || currentIntersect.object == joyConGroup.children[0].children[0] || currentIntersect.object == joyConGroup.children[1].children[0] || currentIntersect.object == joyConGroup.children[2].children[0] || currentIntersect.object == switchDock.children[0].children[0]) {
                    switchJump()
                    chooseItem(4)
                    changeDescription(5)
                    currentIntersect = null
                }
                else if (currentIntersect.object == headphoneGroup.children[0].children[0] || currentIntersect.object == headphoneGroup.children[1].children[0]) {
                    headphoneJump()
                    chooseItem(6)
                    changeDescription(7)
                    currentIntersect = null
                }

                else if (currentIntersect.object == spoolGroup.children[0].children[0] || currentIntersect.object == spoolGroup.children[1].children[0]|| currentIntersect.object == printerStatic.children[0].children[0] || currentIntersect.object == printerStatic.children[0].children[1] || currentIntersect.object == printerPlate.children[0].children[0] || currentIntersect.object == printerTip.children[0].children[0]) {
                    printerAnim()
                    chooseItem(1)
                    changeDescription(2)
                    currentIntersect = null
                }

                else if (currentIntersect.object == curtainsScale.children[0].children[0]) {
                    scaleCurtains()

                    currentIntersect = null
                }

                else if (currentIntersect.object == staticBook.children[0].children[0] || currentIntersect.object == staticBook.children[0].children[1] || currentIntersect.object == staticBook.children[0].children[2] || currentIntersect.object == staticBook.children[0].children[3] || currentIntersect.object == staticBook.children[0].children[4] || currentIntersect.object == staticBook.children[0].children[5] || currentIntersect.object == staticBook.children[0].children[6]) {
                    moveBook()

                    currentIntersect = null
                }

                else if (currentIntersect.object == tvBase.children[0].children[0] || currentIntersect.object == tvScreen.children[0].children[0]) {
                    tvOpen()
                    chooseItem(5)
                    changeDescription(6)
                    currentIntersect = null
                }

                else if (currentIntersect.object == whiteChess.children[0].children[0] || currentIntersect.object == blackChess.children[0].children[0] || currentIntersect.object == chessboardGroup.children[0].children[0] || currentIntersect.object == chessboardGroup.children[1].children[0] || currentIntersect.object == chessboardGroup.children[2].children[0] || currentIntersect.object == chessboardGroup.children[3].children[0]) {
                    chessJump()
                    chooseItem(8)
                    changeDescription(9)
                    currentIntersect = null
                }

                else if (currentIntersect.object == drawingPad.children[0].children[0] || currentIntersect.object == drawingPad.children[0].children[1] || currentIntersect.object == drawingPad.children[0].children[2] || currentIntersect.object == pencil.children[0].children[0]) {
                    pencilJump()
                    chooseItem(3)
                    changeDescription(4)
                    currentIntersect = null
                }

                else if (currentIntersect.object == kunai.children[0].children[0] || currentIntersect.object == kunai.children[1].children[0] || currentIntersect.object == pokeball.children[0].children[0] || currentIntersect.object == pokeball.children[0].children[1] || currentIntersect.object == pokeball.children[0].children[2] || currentIntersect.object == DBGroup.children[0].children[0]  || currentIntersect.object == DBGroup.children[1].children[0] ) {
                    objectsJump()

                    currentIntersect = null
                }

                else if (currentIntersect.object == cube.children[0].children[0] || currentIntersect.object == cube.children[0].children[1] || currentIntersect.object == cube.children[0].children[2] || currentIntersect.object == cube.children[0].children[3] || currentIntersect.object == cube.children[0].children[4] || currentIntersect.object == cube.children[0].children[5] || currentIntersect.object == cube.children[0].children[6] ) {
                    cubeJump()

                    currentIntersect = null
                }
            }
        }
    }
})

// Portfolio Section
// Picture Parameters
const parameters = {
    widthFactor: 16,
    heightFactor: 9,
    amplitudeFactor: 0.5,
    speedFactor: 1,
}

const waveClickParameters = {
    waveFrequency: 2,
    waveAmplitude: 0.25
}

const planeSize = {
    width: 32*parameters.widthFactor,
    height: 32*parameters.heightFactor,
}

// Carousel Objects
const carouselGroup = new THREE.Group
const carouselViewGroup = new THREE.Group

// Picture Meshes
const c1geometry = new THREE.PlaneGeometry(parameters.widthFactor * 0.225, parameters.heightFactor * 0.225, planeSize.width, planeSize.height)

// Material
const c1material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: normalFragmentShader,
    uniforms: {
        uFrequency: {value: 3},
        uTime: {value: 0},
        uOscillationFrequency: {value: 2},
        uColor: {value: new THREE.Color('#000000')},
        uTexture: { value: carouselPics[0] },
        uAmplitude: {value: waveClickParameters.waveAmplitude},
        uGo: { value: 0 },
    },
    transparent: true,
    side: THREE.DoubleSide,
})

const c2material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: normalFragmentShader,
    uniforms: {
        uFrequency: {value: 3},
        uTime: {value: 0},
        uOscillationFrequency: {value: 2},
        uColor: {value: new THREE.Color('#000000')},
        uTexture: { value: carouselPics[1] },
        uAmplitude: {value: waveClickParameters.waveAmplitude},
        uGo: { value: 0 },
    },
    transparent: true,
    side: THREE.DoubleSide,
})

const c3material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: normalFragmentShader,
    uniforms: {
        uFrequency: {value: 3},
        uTime: {value: 0},
        uOscillationFrequency: {value: 2},
        uColor: {value: new THREE.Color('#000000')},
        uTexture: { value: carouselPics[2] },
        uAmplitude: {value: waveClickParameters.waveAmplitude},
        uGo: { value: 0 },
    },
    transparent: true,
    side: THREE.DoubleSide,
})

const c4material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: normalFragmentShader,
    uniforms: {
        uFrequency: {value: 3},
        uTime: {value: 0},
        uOscillationFrequency: {value: 2},
        uColor: {value: new THREE.Color('#000000')},
        uTexture: { value: carouselPics[3] },
        uAmplitude: {value: waveClickParameters.waveAmplitude},
        uGo: { value: 0 },
    },
    transparent: true,
    side: THREE.DoubleSide,
})

const c5material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: normalFragmentShader,
    uniforms: {
        uFrequency: {value: 3},
        uTime: {value: 0},
        uOscillationFrequency: {value: 2},
        uColor: {value: new THREE.Color('#000000')},
        uTexture: { value: carouselPics[4] },
        uAmplitude: {value: waveClickParameters.waveAmplitude},
        uGo: { value: 0 },
    },
    transparent: true,
    side: THREE.DoubleSide,
})

const c6material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: normalFragmentShader,
    uniforms: {
        uFrequency: {value: 3},
        uTime: {value: 0},
        uOscillationFrequency: {value: 2},
        uColor: {value: new THREE.Color('#000000')},
        uTexture: { value: carouselPics[5]},
        uAmplitude: {value: waveClickParameters.waveAmplitude},
        uGo: { value: 0 },
    },
    transparent: true,
    side: THREE.DoubleSide,
})

const carouselRadius = 6

// Picture Mesh 1
const carouselMesh1Group = new THREE.Group
let carouselMesh1 = new THREE.Mesh(c1geometry, c1material)
carouselMesh1.position.set(0,0,0)
carouselMesh1Group.add(carouselMesh1)
carouselMesh1Group.position.set(0,0,carouselRadius)
carouselMesh1.frustumCulled = false
carouselGroup.add(carouselMesh1Group)

// Picture Mesh 2
const carouselMesh2Group = new THREE.Group
let carouselMesh2 = new THREE.Mesh(c1geometry, c2material)
carouselMesh2.position.set(0,0,0)
carouselMesh2Group.add(carouselMesh2)
carouselMesh2Group.position.set(0,-carouselRadius*Math.sin(Math.PI/3),carouselRadius*Math.cos(Math.PI/3))
carouselMesh2.frustumCulled = false
carouselGroup.add(carouselMesh2Group)

// Picture Mesh 3
const carouselMesh3Group = new THREE.Group
let carouselMesh3 = new THREE.Mesh(c1geometry, c3material)
carouselMesh3.position.set(0,0,0)
carouselMesh3Group.add(carouselMesh3)
carouselMesh3Group.position.set(0,-carouselRadius*Math.sin(Math.PI/3),-carouselRadius*Math.cos(Math.PI/3))
carouselMesh3.frustumCulled = false
carouselGroup.add(carouselMesh3Group)

// Picture Mesh 4
const carouselMesh4Group = new THREE.Group
let carouselMesh4 = new THREE.Mesh(c1geometry, c4material)
carouselMesh4.position.set(0,0,0)
carouselMesh4Group.add(carouselMesh4)
carouselMesh4Group.position.set(0,0,-carouselRadius)
carouselMesh4.frustumCulled = false
carouselGroup.add(carouselMesh4Group)

// Picture Mesh 5
const carouselMesh5Group = new THREE.Group
let carouselMesh5 = new THREE.Mesh(c1geometry, c5material)
carouselMesh5.position.set(0,0,0)
carouselMesh5Group.add(carouselMesh5)
carouselMesh5Group.position.set(0,carouselRadius*Math.sin(Math.PI/3),-carouselRadius*Math.cos(Math.PI/3))
carouselMesh5.frustumCulled = false
carouselGroup.add(carouselMesh5Group)

// Picture Mesh 6
const carouselMesh6Group = new THREE.Group
let carouselMesh6 = new THREE.Mesh(c1geometry, c6material)
carouselMesh6.position.set(0,0,0)
carouselMesh6Group.add(carouselMesh6)
carouselMesh6Group.position.set(0,carouselRadius*Math.sin(Math.PI/3),carouselRadius*Math.cos(Math.PI/3))
carouselMesh6.frustumCulled = false
carouselGroup.add(carouselMesh6Group)

carouselGroup.position.set(0,0,0)
carouselViewGroup.add(carouselGroup)
carouselViewGroup.position.set(4.5,-45,0)
carouselViewGroup.rotation.y = -Math.PI/6
mainScene.add(carouselViewGroup)

// Boxes
let boxLineGroup = new THREE.Group

const boxesArray = []
const boxTotal = 30*80
let boxCount = 0
let iBox = 0
let jBox = 0
const boxColors = [0xf3f3f3, 0xff0000]
let diffBoxes = []
let diffBoxCount = 0
let normalBoxes = []
let normalBoxCount = 0

// Box
const makeBox = (i, j) => {
    const boxGeometry = new THREE.BoxGeometry( 0.7, 0.7, 0.7 )
    const boxEdges = new THREE.EdgesGeometry( boxGeometry )
    const colorChance = Math.floor(Math.random()*11)
    let boxColor = boxColors[0]
    if (colorChance == 0) {
        boxColor = boxColors[1]
    } 
    const boxLine = new THREE.LineSegments( boxEdges, new THREE.LineBasicMaterial( {
        color: boxColor,
        linewidth: 1
    } ) )
    boxesArray[boxCount] = boxLine
    if (colorChance == 0) {
        diffBoxes[diffBoxCount] = boxLine
        diffBoxCount++
    }
    else {
        normalBoxes[normalBoxCount] = boxLine
        normalBoxCount++
    }
    boxLine.position.set(-30 + i*5, -85 + j*5 + 5, -10)
    boxLineGroup.add( boxLine )

    if (i < 29) {
        i++
    }
    else {
        i = 0
        j++
    }
    
    if (boxCount < boxTotal - 1) {
        boxCount++
        makeBox(i,j)
    }
}


makeBox(iBox, jBox)
mainCameraGroup.add(boxLineGroup)
mainScene.add(boxLineGroup)


/**
 * Animate
 */
const clock = new THREE.Clock()
let firstCurrentIntersect = null
let currentIntersect = null
let noClicks = false

let extraMeshRotation = 0
let waveMeshIndex = 0

let prevTime = 0
let floatTime = 0

let scrollIndex = bodyScrollBar.scrollTop/window.innerHeight

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Drawer Objects
    torusDrawer.rotation.x += 0.013
    torusDrawer.rotation.y += 0.04
    torusDrawer.rotation.z += 0.057
    sphereDrawer.rotation.x += 0.013
    sphereDrawer.rotation.y += 0.04
    sphereDrawer.rotation.z += 0.057
    cubeDrawer.rotation.x += 0.013
    cubeDrawer.rotation.y += 0.04
    cubeDrawer.rotation.z += 0.057

    // Contact Cube
    contactCube.position.y = Math.sin(elapsedTime*0.75) * 0.1 - 60
    contactCube.rotation.x = Math.sin(elapsedTime) * 0.05
    contactCube.rotation.z = Math.cos(elapsedTime) * 0.05
    
    // Lotus
    lotus.rotation.y +=0.005
    lotusOrb.position.y = Math.sin(elapsedTime) * 0.2
    
    if (bodyScrollBar.scrollTop >= window.innerHeight*2.5) {
        addOrb()
    }
    else if (bodyScrollBar.scrollTop < window.innerHeight*2.5){
        removeOrb()
    }

    // Camera
    if (bodyScrollBar.scrollTop < window.innerHeight*4) {
        mainCamera.position.y = 5 - bodyScrollBar.scrollTop / sizes.height * sectionDistance
    }

    scrollIndex = bodyScrollBar.scrollTop/window.innerHeight

    extraMeshRotation = (Math.sin(scrollIndex*Math.PI*2)) * - Math.PI*10/180

    carouselMesh1Group.rotation.x = -carouselGroup.rotation.x - extraMeshRotation 
    carouselMesh2Group.rotation.x = -carouselGroup.rotation.x - extraMeshRotation
    carouselMesh3Group.rotation.x = -carouselGroup.rotation.x - extraMeshRotation
    carouselMesh4Group.rotation.x = -carouselGroup.rotation.x - extraMeshRotation
    carouselMesh5Group.rotation.x = -carouselGroup.rotation.x - extraMeshRotation
    carouselMesh6Group.rotation.x = -carouselGroup.rotation.x - extraMeshRotation

    // 
    if (isBedUp == true) {
        if (prevTime == 0) {
            prevTime = elapsedTime
        }
        floatTime = elapsedTime - prevTime
        topBedframeGroup.position.y = Math.sin(floatTime)*0.1 + 2
    }
    else {
        prevTime = 0
        floatTime = 0
    }

    // Parallax
    const parallaxX = mouse.x * 0.025
    const parallaxY = -mouse.y * 0.025

    mainCameraGroup.position.y += ( -parallaxY - mainCameraGroup.position.y )
    mainCameraGroup.position.x += ( parallaxX - mainCameraGroup.position.x )
    
    if (spinBox == false) {
        for (let i = 0; i < boxesArray.length; i++) {
            boxesArray[i].rotation.y = parallaxX*2
            boxesArray[i].rotation.x = parallaxY*2
        }
    }

    carouselMesh1.rotation.y = parallaxX
    carouselMesh1.rotation.x = parallaxY
    carouselMesh2.rotation.x = parallaxY
    carouselMesh2.rotation.y = parallaxX
    carouselMesh3.rotation.y = parallaxX
    carouselMesh3.rotation.x = parallaxY
    carouselMesh4.rotation.y = parallaxX
    carouselMesh4.rotation.x = parallaxY
    carouselMesh5.rotation.y = parallaxX
    carouselMesh5.rotation.x = parallaxY
    carouselMesh6.rotation.y = parallaxX
    carouselMesh6.rotation.x = parallaxY

    // Lights
    roomPointLight.intensity = opacities.room
    leftDirectionalLight.intensity = opacities.walls
    rightDirectionalLight.intensity = opacities.walls
    mainAmbientLight.intensity = opacities.mainAmb
    roomAmbientLight.intensity = opacities.roomAmb

    // Site Phases
    if (isPhaseChanging == false) {
        if (bodyScrollBar.scrollTop == 0) {
            sitePhase = 'HOME'
            currentTab(0)
        }
        else if (bodyScrollBar.scrollTop > window.innerHeight*0 && bodyScrollBar.scrollTop <= window.innerHeight*1) {
            sitePhase = 'ROOM'
            currentTab(1)
        }
        else if (bodyScrollBar.scrollTop > window.innerHeight*1 && bodyScrollBar.scrollTop <= window.innerHeight*3) {
            sitePhase = 'SKILLS'
            currentTab(2)
        }
        else if (bodyScrollBar.scrollTop > window.innerHeight*3 && bodyScrollBar.scrollTop <= window.innerHeight*9) {
            sitePhase = 'PORT'
            currentTab(3)
        }
        else if (bodyScrollBar.scrollTop > window.innerHeight*9 && bodyScrollBar.scrollTop <= window.innerHeight*10) {
            sitePhase = 'CONTACT'
            currentTab(4)
        }
    
    }
    // Renders
    renderers[0].render(mainScene, mainCamera)
    mainRaycaster.setFromCamera(mainMouse, mainCamera)

    // Landing Scene
    if (bobbleP == true) {
        P.position.z = - Math.sin(elapsedTime*2) * 0.05 - 105*0.025
    }
    if (bobbleK == true) {
        K.position.z = Math.sin(elapsedTime*2) * 0.05 + 105*0.025
    }

//  Phase 0 RayCasting
    const firstTestBox = [P, A, T, R, I, C, K, rightNameWall, leftNameWall, contactCube]
    const firstIntersects = mainRaycaster.intersectObjects(firstTestBox)

    for (const firstIntersect of firstIntersects) {
    }

    if (firstIntersects.length) {
        if (firstCurrentIntersect === null) {
            firstCurrentIntersect = firstIntersects[0]
            document.body.style.cursor ='pointer'
        }
    }
    else {
        if (firstCurrentIntersect) {
            firstCurrentIntersect = null
            document.body.style.cursor ='default'
        }
        firstCurrentIntersect = null
    }

    const testBox = [topBedframeGroup, topDrawer, midDrawer, botDrawer, laptopGroup, screenGroup, footballGroup, skateboardGroup, sablayGroup, switchGroup, joyConGroup, switchDock, headphoneGroup, spoolGroup, printerStatic, printerPlate, printerTip, curtainsScale, staticBook, tvBase, tvScreen, whiteChess, blackChess, chessboardGroup, drawingPad, pencil, kunai, pokeball, DBGroup, cube]
    const intersects = mainRaycaster.intersectObjects(testBox)

    for (const intersect of intersects) {
    }

    if (intersects.length) {
        if (currentIntersect === null) {
            currentIntersect = intersects[0]
            document.body.style.cursor ='pointer'
        }
    }
    else {
        if (currentIntersect) {
            currentIntersect = null
            document.body.style.cursor ='default'
        }
        currentIntersect = null
    }

    // Render

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    // setTimeout(() => {
    //     window.requestAnimationFrame(tick)

    // }, 1000/240)
}

// Other Animations
const flickerText = () => {
    const randomTime = Math.random()*0.5 + 0.5
    const randomOpacity = Math.random()*0.05 + 0.05
    gsap.to('.flicker', {duration: randomTime, opacity: randomOpacity})
    setTimeout(() => {
        flickerText()
    }, randomTime*1000)
}

// Scroll Animations
const lettersArray = [P, A, T, R, I, C, K, leftNameWall, rightNameWall]

for (let i = 0; i < lettersArray.length; i++) {
    gsap.to(lettersArray[i].position , {
        scrollTrigger: {
            trigger: '#landingSection',
            start: () =>  window.innerHeight*1 + ' bottom',
            end: () =>  window.innerHeight*1 + ' top',
            snap: 1,
            scrub: true,
            // pin: false,
            // markers: false
        },
        y: lettersArray[i].position.y + Math.random()*20,
        ease: 'none',
    })
}

gsap.fromTo(allObjects.rotation , {y: -Math.PI/4 + Math.PI}, {
    scrollTrigger: {
        trigger: '#landingSection',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    y: -Math.PI/4 + Math.PI*2,
    ease: 'none',
})

gsap.to('#landingSection' , {
    scrollTrigger: {
        trigger: '#landingSection',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    ease: 'none',
})

gsap.to(opacities , {
    scrollTrigger: {
        trigger: '#landingSection',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    room: 1,
    walls: 0,
    mainAmb: 0,
    roomAmb: 1,
    ease: 'none',
})

gsap.to('#roomSection', {
    scrollTrigger: {
        trigger: '#roomSection',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    ease: 'none',
})

const listItems = ['#tech', '#threeD', '#ed', '#draw', '#game', '#mns', '#music', '#ff', '#chess', '#skate']

for (let i = 0; i < listItems.length; i++) {
    gsap.fromTo(listItems[i], {x: -200}, {
        scrollTrigger: {
            trigger: '#roomSection',
            start: () =>  window.innerHeight*0 + ' bottom',
            end: () =>  window.innerHeight*0 + ' top',
            snap: 1,
            scrub: i*0.5,
            // pin: false,
            // markers: false
        },
        x: 0,
        ease: 'none',
    })
}

gsap.to('.roomDescription', {
    scrollTrigger: {
        trigger: '#roomSection',
        start: () =>  window.innerHeight*0 + ' bottom',
        end: () =>  window.innerHeight*0 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    opacity: 1,
    ease: 'none',
})

gsap.fromTo(carouselViewGroup.position, {y: -45}, {
    scrollTrigger: {
        trigger: '#portfolioSection',
        start: () =>  window.innerHeight*0 + ' bottom',
        end: () =>  window.innerHeight*0 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    y: -35,
})

gsap.to('.middleScrollDiv' , {
    scrollTrigger: {
        trigger: '#extraSection',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        scrub: true,
        pin: false,
        anticipatepin: false,
        markers: false
    },
    y: window.innerHeight,
    ease: 'none',
})

gsap.fromTo('.sideSliderTextSize' , {opacity: 0}, {
    scrollTrigger: {
        trigger: '.middleScrollDiv',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        pin: false,
        anticipatepin: false,
        // markers: false
    },
    opacity: 1,
    ease: 'none',
})

gsap.to('#scrollTop1' , {
    scrollTrigger: {
        trigger: '.middleScrollDiv',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        pin: false,
        anticipatepin: false,
        // markers: false
    },
    y: -0.8/2*window.innerHeight,
    ease: 'none',
})

gsap.to('#scrollTop2' , {
    scrollTrigger: {
        trigger: '.middleScrollDiv',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        // snap: 1,
        scrub: true,
        pin: false,
        anticipatepin: false,
        // markers: false
    },
    y: -0.6/2*window.innerHeight,
    ease: 'none',
})

gsap.to('#scrollTop3' , {
    scrollTrigger: {
        trigger: '.middleScrollDiv',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        // snap: 1,
        scrub: true,
        pin: false,
        anticipatepin: false,
        // markers: false
    },
    y: -0.4/2*window.innerHeight,
    ease: 'none',
})

gsap.to('#scrollTop4' , {
    scrollTrigger: {
        trigger: '.middleScrollDiv',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        // snap: 1,
        scrub: true,
        pin: false,
        anticipatepin: false,
        // markers: false
    },
    y: -0.2/2*window.innerHeight,
    ease: 'none',
})

gsap.to('#scrollBottom1' , {
    scrollTrigger: {
        trigger: '.middleScrollDiv',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        // snap: 1,
        scrub: true,
        pin: false,
        anticipatepin: false,
        // markers: false
    },
    y: 0.2/2*window.innerHeight,
    ease: 'none',
})

gsap.to('#scrollBottom2' , {
    scrollTrigger: {
        trigger: '.middleScrollDiv',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        // snap: 1,
        scrub: true,
        pin: false,
        anticipatepin: false,
        // markers: false
    },
    y: 0.4/2*window.innerHeight,
    ease: 'none',
})

gsap.to('#scrollBottom3' , {
    scrollTrigger: {
        trigger: '.middleScrollDiv',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        // snap: 1,
        scrub: true,
        pin: false,
        anticipatepin: false,
        // markers: false
    },
    y: 0.6/2*window.innerHeight,
    ease: 'none',
})

gsap.to('#scrollBottom4' , {
    scrollTrigger: {
        trigger: '.middleScrollDiv',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        // snap: 1,
        scrub: true,
        pin: false,
        anticipatepin: false,
        // markers: false
    },
    y: 0.8/2*window.innerHeight,
    ease: 'none',
})

gsap.fromTo('.topSliderText' , {x: -window.innerWidth}, {
    scrollTrigger: {
        trigger: '.middleScrollDiv',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*2 + ' top',
        // snap: 1,
        scrub: true,
        // pin: false,
        anticipatepin: false,
        // markers: false
    },
    x: window.innerWidth,
    ease: 'none',
})

gsap.fromTo('.botSliderText' , {x: window.innerWidth}, {
    scrollTrigger: {
        trigger: '.middleScrollDiv',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*2 + ' top',
        // snap: 1,
        scrub: true,
        // pin: false,
        anticipatepin: false,
        // markers: false
    },
    x: -window.innerWidth,
    ease: 'none',
})

gsap.to('#portfolioSection' , {
    scrollTrigger: {
        trigger: '#portfolioSection',
        start: () =>  window.innerHeight*0 + ' bottom',
        end: () =>  window.innerHeight*0 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    ease: 'none',
})

// Lotus
gsap.to(lotusGroup.position, {x: -3, y: -15.5, z: 0})

gsap.fromTo(lotusGroup.position , {x: -3, y: -15.5, z: 0}, {
    scrollTrigger: {
        trigger: '#extraSection',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    y: -25.5,
    x: 3.5,
    // ease: 'none',
})

gsap.to(lotusGroup.rotation , {
    scrollTrigger: {
        trigger: '#extraSection',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    y: Math.PI*2
    // ease: 'none',
})

gsap.fromTo(lotusGroup.position , {y: -25.5, x: 3.5, z: 0}, {
    scrollTrigger: {
        trigger: '#extraSection',
        start: () =>  window.innerHeight*2 + ' bottom',
        end: () =>  window.innerHeight*2 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    y: -35.5,
    x: 0,
    z: -5
    // ease: 'none',
})

gsap.to(lotusGroup.rotation , {
    scrollTrigger: {
        trigger: '#extraSection',
        start: () =>  window.innerHeight*2 + ' bottom',
        end: () =>  window.innerHeight*2 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    y: Math.PI*2
    // ease: 'none',
})

gsap.to(lotusGroup.rotation , {
    scrollTrigger: {
        trigger: '#contactSection',
        start: () =>  window.innerHeight*0 + ' bottom',
        end: () =>  window.innerHeight*0 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    y: -Math.PI,
    x: Math.PI*0.9,
    z: Math.PI
    // ease: 'none',
})

gsap.fromTo(lotusGroup.position , {y: -35.5, x: 0, z: -5}, {
    scrollTrigger: {
        trigger: '#contactSection',
        start: () =>  window.innerHeight*0 + ' bottom',
        end: () =>  window.innerHeight*0 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    y: -52.5,
    x: -2.5,
    z: 0
    // ease: 'none',
})

gsap.fromTo(lotusGroup.position , {y: -52.5, x: -2.5, z: 0}, {
    scrollTrigger: {
        trigger: '#contactSection',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    y: -62.5,
    x: 2.5,
    z: 0
})

gsap.to(lotusGroup.rotation , {
    scrollTrigger: {
        trigger: '#contactSection',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    y: Math.PI,
    x: Math.PI*0.9,
    z: Math.PI
    // ease: 'none',
})

const extraRotation = 0
gsap.to(carouselGroup.rotation, {x: 0})
// Rotation 1
gsap.to(carouselGroup.rotation, {
    scrollTrigger: {
        trigger: '#entry1',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    x: -Math.PI/3 + extraRotation
})

gsap.fromTo('#underline1', {transform: 'scaleX(0)'}, {
    scrollTrigger: {
        trigger: '#entry1',
        start: () =>  window.innerHeight*0 + ' bottom',
        end: () =>  window.innerHeight*0 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    transform: 'scaleX(1)'
})

gsap.fromTo(carouselGroup.rotation, {x: -Math.PI/3}, {
    scrollTrigger: {
        trigger: '#entry2',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    x: -Math.PI/3*2 + extraRotation
})

gsap.fromTo('#underline2', {transform: 'scaleX(0)'}, {
    scrollTrigger: {
        trigger: '#entry2',
        start: () =>  window.innerHeight*0 + ' bottom',
        end: () =>  window.innerHeight*0 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    transform: 'scaleX(1)'
})

gsap.fromTo(carouselGroup.rotation, {x: -Math.PI/3*2}, {
    scrollTrigger: {
        trigger: '#entry3',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    x: -Math.PI/3*3 + extraRotation
})

gsap.fromTo('#underline3', {transform: 'scaleX(0)'}, {
    scrollTrigger: {
        trigger: '#entry3',
        start: () =>  window.innerHeight*0 + ' bottom',
        end: () =>  window.innerHeight*0 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    transform: 'scaleX(1)'
})

gsap.fromTo(carouselGroup.rotation, {x: -Math.PI/3*3}, {
    scrollTrigger: {
        trigger: '#entry4',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    x: -Math.PI/3*4 + extraRotation
})

gsap.fromTo('#underline4', {transform: 'scaleX(0)'}, {
    scrollTrigger: {
        trigger: '#entry4',
        start: () =>  window.innerHeight*0 + ' bottom',
        end: () =>  window.innerHeight*0 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    transform: 'scaleX(1)'
})

gsap.fromTo(carouselGroup.rotation, {x: -Math.PI/3*4}, {
    scrollTrigger: {
        trigger: '#entry5',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    x: -Math.PI/3*5 + extraRotation
})

gsap.fromTo('#underline5', {transform: 'scaleX(0)'}, {
    scrollTrigger: {
        trigger: '#entry5',
        start: () =>  window.innerHeight*0 + ' bottom',
        end: () =>  window.innerHeight*0 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    transform: 'scaleX(1)'
})

gsap.fromTo('#underline6', {transform: 'scaleX(0)'}, {
    scrollTrigger: {
        trigger: '#entry6',
        start: () =>  window.innerHeight*0 + ' bottom',
        end: () =>  window.innerHeight*0 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    transform: 'scaleX(1)'
})

gsap.fromTo(mainCamera.position, {y: -35}, {
    scrollTrigger: {
        trigger: '#contactSection',
        start: () =>  window.innerHeight*0 + ' bottom',
        end: () =>  window.innerHeight*0 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    y: -50
})

gsap.fromTo(mainCamera.position, {y: -50}, {
    scrollTrigger: {
        trigger: '#contactSection',
        start: () =>  window.innerHeight*1 + ' bottom',
        end: () =>  window.innerHeight*1 + ' top',
        snap: 1,
        scrub: true,
        // pin: false,
        // markers: false
    },
    y: -60
})

gsap.to('.yellowGum', {
    scrollTrigger: {
        trigger: '#contactSection',
        start: () =>  window.innerHeight*1.01 + ' bottom',
        end: () =>  window.innerHeight*1.11 + ' bottom',
        scrub: true,
        // pin: false,
        // markers: false
    },
    opacity: 0
})

gsap.to('.blueGum', {
    scrollTrigger: {
        trigger: '#contactSection',
        start: () =>  window.innerHeight*1.11 + ' bottom',
        end: () =>  window.innerHeight*1.21 + ' bottom',
        scrub: true,
        // pin: false,
        // markers: false
    },
    opacity: 0
})

gsap.to('.redGum', {
    scrollTrigger: {
        trigger: '#contactSection',
        start: () =>  window.innerHeight*1.21 + ' bottom',
        end: () =>  window.innerHeight*1.31 + ' bottom',
        scrub: true,
        // pin: false,
        // markers: false
    },
    opacity: 0
})

// List Animations
const descriptionDiv = ['#default', '#techDesc', '#threeDDesc', '#edDesc', '#drawDesc', '#gameDesc', '#mnsDesc', '#musicDesc', '#ffDesc', '#chessDesc', '#skateDesc']
let currentList = -1

const changeDescription = (x) => {
    if (currentList !== x) {
        for (let i = 0; i < descriptionDiv.length; i++) {
            if (i == x) {
                document.querySelector(descriptionDiv[i]).classList.remove('hidden')
                gsap.fromTo('.topDescription', {x: 20}, {duration: 0.5, x: 0})
                gsap.fromTo('.botDescription', {x: -20}, {duration: 0.5, x: 0})
            }
            else {
                document.querySelector(descriptionDiv[i]).classList.add('hidden')    
            }
        }
        currentList = x
    }
}

const chooseItem = (x) => {
    for (let i = 0; i < listItems.length; i++) {
        if (i == x) {
            document.querySelector(listItems[i]).classList.add('chosen')
        }
        else {
            document.querySelector(listItems[i]).classList.remove('chosen')
        }
    }
}

for (let i = 0; i < listItems.length; i++) {
    document.querySelector(listItems[i]).addEventListener('mouseenter', () => {
        gsap.to(listItems[i], {duration: 0.5, transform: 'scale(1.25) translateX(1rem)'})
    })
    document.querySelector(listItems[i]).addEventListener('mouseleave', () => {
        gsap.to(listItems[i], {duration: 0.5, transform: 'scale(1) translateX(0)'})
    })
    document.querySelector(listItems[i]).addEventListener('click', () => {
        changeDescription(i+1)
        chooseItem(i)
        if (isAnimationPlaying == false){
            if (i == 0) {
                lightLaptop()
            }
            else if (i == 1) {
                printerAnim()
            }
            else if (i == 2) {
                sablaySqueeze()
            }
            else if (i == 3) {
                pencilJump()
            }
            else if (i == 4) {
                switchJump()
            }
            else if (i == 5) {
                tvOpen()
            }
            else if (i == 6) {
                headphoneJump()
            }
            else if (i == 7) {
                floatFootball()
            }
            else if (i == 8) {
                chessJump()
            }
            else if (i == 9) {
                flipBoard()
            }
        }
    })
}

gsap.registerPlugin(ScrollToPlugin)

// NavBar
let isPhaseChanging = false
const navTabsArray = ['#nav1','#nav2','#nav3','#nav4','#nav5']

const currentTab = (x) => {
    for (let i = 0; i < navTabsArray.length; i++) {
        if (i == x) {
            document.querySelector(navTabsArray[i]).classList.add('currentTab')
        }
        else {
            document.querySelector(navTabsArray[i]).classList.remove('currentTab')
        }
    }
}

const navTabs = document.querySelectorAll('.navTabs')

for (let i = 0; i < navTabs.length; i++) {
    navTabs[i].addEventListener('click', () => {
        currentTab(i)
        if (i == 0) {
            bodyScrollBar.scrollTo(0, 0)
        }
        else if (i == 1) {
            bodyScrollBar.scrollTo(0, window.innerHeight*1)
        }
        else if (i == 2) {
            bodyScrollBar.scrollTo(0, window.innerHeight*2)
        }
        else if (i == 3) {
            bodyScrollBar.scrollTo(0, window.innerHeight*10)
            bodyScrollBar.scrollTo(0, window.innerHeight*4)
        }
        else if (i == 4) {
            bodyScrollBar.scrollTo(0, window.innerHeight*10)
        }
        isPhaseChanging = true
        setTimeout(() => {
            isPhaseChanging = false
        }, 1000)
    })
}

// Link
const contactSection = document.querySelector('#finalSection')
let emailText = document.querySelector('#emailText')

emailText.addEventListener('mouseenter', () => {
    emailText.style.backgroundColor = normalColorArray[colorChangeIndex][0]
    emailText.style.color = normalColorArray[colorChangeIndex][1]
    emailText.innerText = 'rptmunar@gmail.com'
})

emailText.addEventListener('mouseleave', () => {
    emailText.innerText = 'Wanna talk?'
    emailText.style.backgroundColor = 'transparent'
    emailText.style.color = 'black'
    setTimeout(() => {
        spinContactCube()
    }, 1000)
})

// Contact Cube Anim
const contactSectionArray = [
    "<a target=”_blank” href='mailto:rptmunar@gmail.com' class='link' tabindex='-1' id='emailText'>Let's talk.</a>",
    "<a target=”_blank” href='https://github.com/PatrickMunar' class='link' tabindex='-1' id='emailText'>Browse more projects.</a>",
    "<a target=”_blank” href='https://www.linkedin.com/in/rptmunar/' class='link' tabindex='-1' id='emailText'>You can reach me here.</a>",
    "<a target=”_blank” href='https://twitter.com/LilRuii' class='link' tabindex='-1' id='emailText'>Here, too.</a>"
]

let contactIndex  = 0

const contactChanges = [
    ['rptmunar@gmail.com', "Let's talk."],
    ['github.com/PatrickMunar', 'Browse more projects.'],
    ['linkedin.com/in/rptmunar', 'You can reach me here.'],
    ['twitter.com/LilRuii', 'Here, too.'],
]

let isCCSpinning = false

const spinContactCube = () => {
    if (isCCSpinning == false) {
        isCCSpinning = true
        if (contactIndex < 3) {
            contactIndex++
        }
        else {
            contactIndex = 0
        }
    
        gsap.to(contactCube.rotation, {duration: 1, y: -Math.PI/2 + contactCube.rotation.y})
        noClicks = true
    
        contactSection.innerHTML = contactSectionArray[contactIndex]
    
        emailText = document.querySelector('#emailText')

        emailText.style.borderColor = normalColorArray[colorChangeIndex][1]
        emailText.style.boxShadow = '-5px 5px 1px' + normalColorArray[colorChangeIndex][1] +''

        emailText.addEventListener('mouseenter', () => {
            emailText.style.backgroundColor = normalColorArray[colorChangeIndex][0]
            emailText.style.color = normalColorArray[colorChangeIndex][1]
            emailText.innerText = contactChanges[contactIndex][0]
        })
    
        emailText.addEventListener('mouseleave', () => {
            emailText.innerText = contactChanges[contactIndex][1]
            emailText.style.backgroundColor = 'transparent'
            emailText.style.color = 'black'
            setTimeout(() => {
                spinContactCube()
            }, 1000)
        })
    
        setTimeout(() => {
            noClicks = false
            isCCSpinning = false
        }, 1000)
    }
}

const threeColorArray = [
[new THREE.Color(0xff0000), new THREE.Color(0xf3f3f3)],
[new THREE.Color(0x5B84B1), new THREE.Color(0xFC766A)],
[new THREE.Color(0xF4DF4E), new THREE.Color(0x949398)],
[new THREE.Color(0xF95700), new THREE.Color(0x00A4CC)],
[new THREE.Color(0xADEFD1), new THREE.Color(0x00203F)],
[new THREE.Color(0x97BC62), new THREE.Color(0x2C5F2D)]
]

const normalColorArray = [
['#ff0000', '#000000'],
['#5B84B1', '#FC766A'],
['#F4DF4E', '#949398'],
['#F95700', '#00A4CC'],
['#ADEFD1', '#00203F'],
['#97BC62', '#2C5F2D']
]

const underlines = document.querySelectorAll('.portNameUnderline')
const scrollTops = document.querySelectorAll('.scrollTop')
const scrollBottoms = document.querySelectorAll('.scrollBottom')
const dashes = document.querySelectorAll('.dash')
const linkProjects = document.querySelectorAll('.linkProject')
const links = document.querySelectorAll('.link')

let colorChangeIndex = 0

// Color Change
const colorChange = () => {
    if (colorChangeIndex < threeColorArray.length - 1) {
        colorChangeIndex++
    }
    else {
        colorChangeIndex = 0
    }

    leftDirectionalLight.color = threeColorArray[colorChangeIndex][0]
    rightDirectionalLight.color = threeColorArray[colorChangeIndex][1]
    lotusOrb.children[0].children[0].material.color = threeColorArray[colorChangeIndex][0]
    lotus.children[1].children[0].material.color = threeColorArray[colorChangeIndex][1]
    for (let i = 0; i < diffBoxes.length; i++) {
        diffBoxes[i].material.color = threeColorArray[colorChangeIndex][0]
    }
    // for (let i = 0; i < normalBoxes.length; i++) {
    //     normalBoxes[i].material.color = threeColorArray[colorChangeIndex][1]
    // }

    for (let j = 0; j < underlines.length; j++) {
        underlines[j].style.backgroundColor = normalColorArray[colorChangeIndex][0]
        underlines[j].style.borderColor = normalColorArray[colorChangeIndex][0]
    }
    for (let j = 0; j < scrollTops.length; j++) {
        scrollTops[j].style.textShadow = '2px 2px 1px '+ normalColorArray[colorChangeIndex][0] +', 2px -2px 1px '+ normalColorArray[colorChangeIndex][0] +', -2px -2px 1px '+ normalColorArray[colorChangeIndex][0] +', -2px 2px 1px '+ normalColorArray[colorChangeIndex][0] +''
    }
    for (let j = 0; j < scrollBottoms.length; j++) {
        scrollBottoms[j].style.textShadow = '2px 2px 1px '+ normalColorArray[colorChangeIndex][1] +', 2px -2px 1px '+ normalColorArray[colorChangeIndex][1] +', -2px -2px 1px '+ normalColorArray[colorChangeIndex][1] +', -2px 2px 1px '+ normalColorArray[colorChangeIndex][1] +''
    }
    for (let j = 0; j < dashes.length; j++) {
        dashes[j].style.color = normalColorArray[colorChangeIndex][0]
    }
    for (let j = 0; j < linkProjects.length; j++) {
        linkProjects[j].style.borderColor = normalColorArray[colorChangeIndex][1]
        linkProjects[j].style.boxShadow = '-5px 5px 1px' + normalColorArray[colorChangeIndex][1] +''
    }
    emailText.style.borderColor = normalColorArray[colorChangeIndex][1]
    emailText.style.boxShadow = '-5px 5px 1px' + normalColorArray[colorChangeIndex][1] +''
}

for (let j = 0; j < linkProjects.length; j++) {
    linkProjects[j].addEventListener('mouseenter', () => {
        linkProjects[j].style.backgroundColor = normalColorArray[colorChangeIndex][0]
        linkProjects[j].style.color = normalColorArray[colorChangeIndex][1]
    })
    linkProjects[j].addEventListener('mouseleave', () => {
        linkProjects[j].style.backgroundColor = 'transparent'
        linkProjects[j].style.color = 'black'
    })
}

// Tick
tick()