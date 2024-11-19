// app/components/globe/app.jsx
import { THREE } from '~/components/globe/utils/three';
import React, { Component } from 'react';
import OrbitControls from 'three-orbitcontrols';
import Stats from 'stats.js';
import TrackballControls from '~/components/globe/utils/controls';


let dat;

class App extends Component {
    constructor(props) {
        super(props);
        this.preload = props.preload;
        this.animate = props.animate;
        this.setup = props.setup;
        this.stats = null;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.orbitControls = null;
        this.trackballControls = null;
        this.cancelAnimationFrameId = null;
        this.gui = null;

        window.app = this;
    }

    async componentDidMount() {
        if (typeof window !== 'undefined') {
            dat = await import('dat.gui');
        }

        this.initScene();
        this.initRenderer();
        this.initCamera();
        this.initControls();
        this.initStats();

        try {
            if (this.preload) {
                await this.preload();
            }
        } catch (error) {
            console.error("Error during preload:", error);
        }

        this.initRender();
        this.update();

        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        if (this.cancelAnimationFrameId) {
            cancelAnimationFrame(this.cancelAnimationFrameId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.gui) {
            this.gui.destroy();
        }
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
        // Initialiser OrbitControls
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.25;

        // Initialiser TrackballControls
        this.trackballControls = new TrackballControls(this.camera, this.renderer.domElement);
        this.trackballControls.rotateSpeed = 1.0;
        this.trackballControls.zoomSpeed = 1.2;
        this.trackballControls.panSpeed = 0.8;
    }

    initStats = () => {
        this.stats = new Stats();
        this.stats.setMode(0);
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.right = '10px';
        this.stats.domElement.style.bottom = '10px';
        document.body.appendChild(this.stats.domElement);
    }

    initRender = () => {
        this.setup(this);
    }

    update = () => {
        this.animate(this);
        this.stats.update();

        // Mettre à jour les deux contrôles
        this.orbitControls.update();
        this.trackballControls.update();

        this.renderer.render(this.scene, this.camera);
        this.cancelAnimationFrameId = requestAnimationFrame(this.update);
    }

    handleResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    addControlGui = (callback) => {
        if (dat) {
            this.gui = new dat.GUI();
            callback(this.gui);
        }
    }

    render() {
        return null;
    }
}

export default App;
