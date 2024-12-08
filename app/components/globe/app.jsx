// app/components/globe/app.jsx
import * as THREE from 'three';
import React, { Component } from 'react';
import { OrbitControls } from 'three-stdlib';
import dat from 'dat.gui';


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

        // Configure les contrôles
        this.controls.enableDamping = true;    // Active le damping (amortissement) pour une expérience de contrôle plus fluide
        this.controls.dampingFactor = 0.1;     // Augmente le facteur d'amortissement pour plus de fluidité
        this.controls.rotateSpeed = 0.25;      // Augmente la vitesse de rotation du globe
        this.controls.enableZoom = true;       // Permet le zoom
        this.controls.enablePan = true;        // Permet le déplacement latéral
        this.controls.enableRotate = true;     // Active la rotation par défaut

        // Limites de zoom
        this.controls.minDistance = 50;        // Distance minimale
        this.controls.maxDistance = 1550;      // Distance maximale

        // Rotation verticale illimitée
        this.controls.minPolarAngle = 0;        // Permet de regarder directement vers le bas
        this.controls.maxPolarAngle = Math.PI;  // Permet de regarder directement vers le haut

        // Rotation horizontale illimitée
        this.controls.minAzimuthAngle = -Infinity; // Rotation sans limite à gauche
        this.controls.maxAzimuthAngle = Infinity;  // Rotation sans limite à droite

        // Écouteurs d'événements pour la souris
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.renderer.domElement.addEventListener('mouseleave', this.onMouseLeave.bind(this));

        this.isMouseDown = false; // Pour détecter le mouvement de la souris
        this.lastMouseX = 0;
        this.lastMouseY = 0;

        this.renderer.domElement.addEventListener('mousedown', (event) => {
            if (event.button === 0) { // Vérifie que le bouton gauche est enfoncé
                this.isMouseDown = true;
                this.lastMouseX = event.clientX;
                this.lastMouseY = event.clientY;
            }
        });

        this.renderer.domElement.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
    }

    onMouseMove(event) {
        if (this.isMouseDown) {
            const deltaX = event.clientX - this.lastMouseX; // Déplacement horizontal
            const deltaY = event.clientY - this.lastMouseY; // Déplacement vertical

            // Ajustement de la rotation
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Mouvements horizontaux (gauche/droite) : rotation autour de l'axe Y
                this.camera.rotation.y -= deltaX * 0.01; // Augmente ce coefficient pour plus de sensibilité
            } else {
                // Mouvements verticaux (haut/bas) : rotation autour de l'axe X
                this.camera.rotation.x -= deltaY * 0.01; // Augmente ce coefficient pour plus de sensibilité
                this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x)); // Limite pour éviter l'inversion
            }

            // Mettre à jour la position de la souris
            this.lastMouseX = event.clientX;
            this.lastMouseY = event.clientY;
        }
    }

    onMouseLeave() {
        this.isMouseDown = false; // Arrête la rotation lorsque la souris quitte la zone
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
