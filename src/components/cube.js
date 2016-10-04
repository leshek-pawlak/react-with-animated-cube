/* eslint vars-on-top: */
/* eslint no-unused-vars: */
/* eslint no-undef: */
/* eslint wrap-iife: */

import THREE from 'three-canvas-renderer'

import bitnoisePng from '../images/bitnoise.png'
import brandedmePng from '../images/brandedme.png'
import codepenPng from '../images/codepen.png'
import githubPng from '../images/github.png'
import linkedinPng from '../images/linkedin.png'
import twitterPng from '../images/twitter.png'

var container, camera, scene, renderer, cube, raycaster, vector
var materials = []
var lastTouch = null
var mouse = { x: 0, y: 0 }
var mouseMouseDown = { x: 0, y: 0 }
var targetRotation = { x: -0.72, y: 0.50 }
var targetRotationMouseDown = { x: 0, y: 0 }
var windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
var links = [
    'http://bitnoi.se',
    'https://branded.me/leshek_pawlak',
    'http://codepen.io/leshek_pawlak',
    'https://github.com/leshek-pawlak',
    'https://www.linkedin.com/in/leszekpawlak',
    'https://twitter.com/leshek_pawlak',
]
var textures = [
    bitnoisePng,
    brandedmePng,
    codepenPng,
    githubPng,
    linkedinPng,
    twitterPng,
]

init()
animate()

function init() {
    container = document.createElement('div')
    document.body.appendChild(container)

    var info = document.createElement('div')
    info.style.position = 'absolute'
    info.style.top = '10px'
    info.style.width = '100%'
    info.style.textAlign = 'center'
    info.innerHTML = window.innerWidth < 768 ? '<p>Drag to spin the cube or select in ReactMaterialSelect</p><p>Double tap on the cube site to go to the page</p>' : '<p>Drag to spin the cube or select in ReactMaterialSelect</p><p>Double click on the cube site to go to the page</p>'
    container.appendChild(info)

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.y = 100
    camera.position.z = 500

    scene = new THREE.Scene()

    // Cube
    var geometry = window.innerWidth < 768 ? new THREE.BoxGeometry(150, 150, 150) : new THREE.BoxGeometry(300, 300, 300)
    var textureLoader = new THREE.TextureLoader()

    var texture = []
    for (var k = 0; k < textures.length; k++) {
        texture.push(textureLoader.load(textures[k]))
        links.push(textureLoader.load(textures[k]))
    }

    raycaster = new THREE.Raycaster()
    vector = new THREE.Vector2()

    for (var i = 0; i < 6; ++i) {
        materials[i] = new THREE.MeshBasicMaterial({
            map: texture[i],
        })
    }

    var faceMaterial = new THREE.MeshFaceMaterial(materials)

    cube = new THREE.Mesh(geometry, faceMaterial)
    cube.position.y = 150
    scene.add(cube)

    renderer = new THREE.CanvasRenderer()
    renderer.setClearColor(0xf0f0f0)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    document.addEventListener('dblclick', onCubeClick, false)
    document.addEventListener('mousedown', onDocumentMouseDown, false)

    document.addEventListener('touchstart', onDocumentTouchStart, false)
    document.addEventListener('touchmove', onDocumentTouchMove, false)
    document.addEventListener('touchend', onDocumentTouchEnd, false)

    window.addEventListener('resize', onWindowResize, false)
}

function onWindowResize() {
    windowHalf.x = window.innerWidth / 2
    windowHalf.y = window.innerHeight / 2

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
}

function onCubeClick(event) {
    if (event.touches[0]) {
        vector.x = (event.touches[0].pageX / window.innerWidth) * 2 - 1
        vector.y = - (event.touches[0].pageY / window.innerHeight) * 2 + 1
    } else {
        vector.x = (event.clientX / window.innerWidth) * 2 - 1
        vector.y = - (event.clientY / window.innerHeight) * 2 + 1
    }

    raycaster.setFromCamera(vector, camera)

    var intersects = raycaster.intersectObjects(scene.children)
    if (intersects.length === 1) {
        window.location.href = links[intersects[0].face.materialIndex]
    }
}

function onDocumentMouseDown(event) {
    event.preventDefault()

    document.addEventListener('mousemove', onDocumentMouseMove, false)
    document.addEventListener('mouseup', onDocumentMouseUp, false)
    document.addEventListener('mouseout', onDocumentMouseOut, false)

    mouseMouseDown.x = event.clientX - windowHalf.x
    mouseMouseDown.y = event.clientY - windowHalf.y

    targetRotationMouseDown.x = targetRotation.x
    targetRotationMouseDown.y = targetRotation.y
}

function onDocumentMouseMove(event) {
    mouse.x = event.clientX - windowHalf.x
    mouse.y = event.clientY - windowHalf.y

    targetRotation.x = targetRotationMouseDown.x + (mouse.x - mouseMouseDown.x) * 0.02
    targetRotation.y = targetRotationMouseDown.y + (mouse.y - mouseMouseDown.y) * 0.02
}

function onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false)
    document.removeEventListener('mouseup', onDocumentMouseUp, false)
    document.removeEventListener('mouseout', onDocumentMouseOut, false)
}

function onDocumentMouseOut(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false)
    document.removeEventListener('mouseup', onDocumentMouseUp, false)
    document.removeEventListener('mouseout', onDocumentMouseOut, false)
}

function onDocumentTouchStart(event) {
    if (event.touches.length === 1 && event.target.localName === 'div') {
        event.preventDefault()

        var now = new Date().getTime()
        var delta = lastTouch ? now - lastTouch : 0

        if (delta < 300 && delta > 30) {
            lastTouch = null
            onCubeClick(event)
        } else {
            mouseMouseDown.x = event.touches[0].pageX - windowHalf.x
            mouseMouseDown.y = event.touches[0].pageY - windowHalf.y

            targetRotationMouseDown.x = targetRotation.x
            targetRotationMouseDown.y = targetRotation.y
        }
    }
}

function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
        event.preventDefault()

        mouse.x = event.touches[0].pageX - windowHalf.x
        mouse.y = event.touches[0].pageY - windowHalf.y

        targetRotation.x = targetRotationMouseDown.x + (mouse.x - mouseMouseDown.x) * 0.02
        targetRotation.y = targetRotationMouseDown.y + (mouse.y - mouseMouseDown.y) * 0.02
    }
}

function onDocumentTouchEnd(event) {
    lastTouch = new Date().getTime()
}

function animate() {
    requestAnimationFrame(animate)
    render()
}

function render() {
    cube.rotation.y += (targetRotation.x - cube.rotation.y) * 0.05
    cube.rotation.x += (targetRotation.y - cube.rotation.x) * 0.05
    renderer.render(scene, camera)
}

export default function setTargetRotation(newTargetRotation) {
    targetRotation = newTargetRotation
}
