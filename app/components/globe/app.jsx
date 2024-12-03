// app/components/globe/app.jsx
import React, { Component } from 'react';
import { OrbitControls } from 'three-stdlib';
import dat from 'dat.gui';
import * as THREE from 'three';


class App extends Component {
    constructor(props) {
        super(props);
        this.preload = props.preload;
        this.animate = props.animate;
        this.setup = props.setup;
        this.guiRef = null;
        this.init();
        window.app = this;
    }

    init = async () => {
        this.initScene();
        this.initRenderer();
        this.initCamera();
        this.initControls();

        if (this.preload) {
            await this.preload();
        }

        this.render();
        this.update();

        // Configure le resize dynamique dès le début
        window.addEventListener('resize', this.handleResize);
        this.handleResize();  // Appelle immédiatement pour la taille initiale
    }

    initScene = () => {
        this.scene = new THREE.Scene();
    }

    initRenderer = () => {
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setClearColor(0x000000, 1.0);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio * 1.5);
        this.renderer.shadowMap.enabled = true;
        this.renderer.antialias = true;
        document.body.appendChild(this.renderer.domElement);
    }

    initCamera = () => {
        this.ratio = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(60, this.ratio, 0.1, 10000);
        this.camera.lookAt(this.scene.position);
        this.camera.position.set(0, 15, 30);
    }

    initControls = () => {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    render = () => {
        this.setup(this);
    }

    update = () => {
        this.animate(this);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.update);
    }

    addControlGui = (callback) => {
        if (!this.guiRef) {
            this.guiRef = new dat.GUI();
            callback(this.guiRef);
        }
    }

    handleResize = () => {
        const aspectRatio = window.innerWidth / window.innerHeight;

        // Met à jour la caméra
        this.camera.aspect = aspectRatio;
        this.camera.updateProjectionMatrix();

        // Met à jour la taille du renderer avec le ratio dynamique
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight * 1.0;
        this.renderer.setSize(newWidth, newHeight);
    }

    componentWillUnmount() {
        // Supprime les écouteurs d'événements pour éviter les fuites mémoire
        window.removeEventListener('resize', this.handleResize);
    }
}

export default App;
