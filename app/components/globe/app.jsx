// app/components/globe/app.jsx
import React, { Component } from 'react';
import { OrbitControls } from 'three-stdlib';
import Stats from 'stats.js';
import dat from 'dat.gui';
import * as THREE from 'three';


class App extends Component {
    constructor(props) {
        super(props);
        this.preload = props.preload;
        this.animate = props.animate;
        this.setup = props.setup;
        window.app = this;
        this.init();
    }

    init = async () => {
        this.initScene();
        this.initRenderer();
        this.initCamera();
        this.initControls();
        this.initStats();

        if (this.preload) {
            await this.preload();
        }

        this.render();
        this.update();
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

    initStats = () => {
        this.stats = new Stats();
        this.stats.setMode(0);
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.right = '10px';
        this.stats.domElement.style.bottom = '10px';
        document.body.appendChild(this.stats.domElement);
    }

    render = () => {
        this.setup(this);
    }

    update = () => {
        this.animate(this);
        this.stats.update();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.update);
    }

    addControlGui = callback => {
        var gui = new dat.GUI();
        callback(gui);
    }

    handleResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

export default App;
