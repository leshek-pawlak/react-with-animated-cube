/* eslint vars-on-top: */
/* eslint no-unused-vars: */
/* eslint no-undef: */
/* eslint wrap-iife: */

var container, camera, scene, renderer, cube
var targetRotationX = -0.72
var targetRotationY = 0.50
var targetRotationXOnMouseDown = 0
var targetRotationYOnMouseDown = 0
var mouseX = 0
var mouseY = 0
var mouseXOnMouseDown = 0
var mouseYOnMouseDown = 0
var windowHalfX = window.innerWidth / 2
var windowHalfY = window.innerHeight / 2

var init = function() {
    container = document.createElement('div')
    document.getElementById('cubeAnimation').appendChild(container)

    var info = document.createElement('div')
    info.style.position = 'absolute'
    info.style.top = '10px'
    info.style.width = '100%'
    info.style.textAlign = 'center'
    info.innerHTML = 'Drag to spin the cube'
    container.appendChild(info)

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.y = 100
    camera.position.z = 500

    scene = new THREE.Scene()

    // Cube
    var geometry = new THREE.BoxGeometry(300, 300, 300)
    var textureLoader = new THREE.TextureLoader()

    var texture = [textureLoader.load('http://lesyek.usermd.net/bitnoise.png'), textureLoader.load('http://lesyek.usermd.net/brandedme.png'), textureLoader.load('http://lesyek.usermd.net/codepen.png'), textureLoader.load('http://lesyek.usermd.net/github.png'), textureLoader.load('http://lesyek.usermd.net/linkedin.png'), textureLoader.load('http://lesyek.usermd.net/twitter.png')]

    var materials = []
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

    document.addEventListener('mousedown', onDocumentMouseDown, false)
    document.addEventListener('touchstart', onDocumentTouchStart, false)
    document.addEventListener('touchmove', onDocumentTouchMove, false)

    window.addEventListener('resize', onWindowResize, false)
}

var onWindowResize = function() {
    windowHalfX = window.innerWidth / 2
    windowHalfY = window.innerHeight / 2

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
}

var onDocumentMouseDown = function(event) {
    event.preventDefault()
    document.addEventListener('mousemove', onDocumentMouseMove, false)
    document.addEventListener('mouseup', onDocumentMouseUp, false)
    document.addEventListener('mouseout', onDocumentMouseOut, false)

    mouseXOnMouseDown = event.clientX - windowHalfX
    mouseYOnMouseDown = event.clientY - windowHalfY
    targetRotationXOnMouseDown = targetRotationX
    targetRotationYOnMouseDown = targetRotationY
}

var onDocumentMouseMove = function(event) {
    mouseX = event.clientX - windowHalfX
    mouseY = event.clientY - windowHalfY
    targetRotationX = targetRotationXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02
    targetRotationY = targetRotationYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.02
}

var onDocumentMouseUp = function(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false)
    document.removeEventListener('mouseup', onDocumentMouseUp, false)
    document.removeEventListener('mouseout', onDocumentMouseOut, false)
}

var onDocumentMouseOut = function(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false)
    document.removeEventListener('mouseup', onDocumentMouseUp, false)
    document.removeEventListener('mouseout', onDocumentMouseOut, false)
}

var onDocumentTouchStart = function(event) {
    if (event.touches.length === 1) {
        event.preventDefault()
        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX
        mouseYOnMouseDown = event.touches[0].pageY - windowHalfY
        targetRotationXOnMouseDown = targetRotationX
        targetRotationYOnMouseDown = targetRotationY
    }
}

var onDocumentTouchMove = function(event) {
    if (event.touches.length === 1) {
        event.preventDefault()
        mouseX = event.touches[0].pageX - windowHalfX
        mouseY = event.touches[0].pageY - windowHalfY
        targetRotationX = targetRotationXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05
        targetRotationY = targetRotationYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.05
    }
}

var animate = function() {
    requestAnimationFrame(animate)
    render()
}

var render = function() {
    cube.rotation.y += (targetRotationX - cube.rotation.y) * 0.05
    cube.rotation.x += (targetRotationY - cube.rotation.x) * 0.05
    renderer.render(scene, camera)
}(function() {
    init()
    animate()
})()
