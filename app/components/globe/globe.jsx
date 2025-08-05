// app/components/globe/globe.jsx
import * as THREE from 'three';
import { Component } from 'react';

import { shaders } from '~/components/globe/utils/shaders';
import { config, elements, groups } from '~/components/globe/utils/config';
import { NoiseGenerator } from '~/components/globe/libs/perlin-noise.js';

import mapTexture from '~/components/globe/textures/map_indexed.png';
import mapTextureClouds from '~/components/globe/textures/earth_clouds.png';


class Globe extends Component {
    constructor(props) {
        super(props);
        this.radius = config.sizes.globe;
        this.group = new THREE.Group();
        this.noiseGenerator = new NoiseGenerator();
        this.noiseTexture = null;
        this.globeMaterial = null;
        this.earthTexture = null;
        this.earthTextureClouds = null;
        this.animationId = null;
    }

    /** Méthode pour charger toutes les textures nécessaires */
    loadTextures() {
        const textureLoader = new THREE.TextureLoader();

        return Promise.all([
            new Promise((resolve, reject) => {
                textureLoader.load(
                    mapTexture,
                    (texture) => {
                        this.earthTexture = texture;
                        resolve();
                    },
                    undefined,
                    reject
                );
            }),
            new Promise((resolve, reject) => {
                textureLoader.load(
                    mapTextureClouds,
                    (texture) => {
                        this.earthTextureClouds = texture;
                        resolve();
                    },
                    undefined,
                    reject
                );
            }),
        ]);
    }

    /** Prépare les éléments 3D après chargement des textures */
    setup(scene) {
        if (!this.earthTexture || !this.earthTextureClouds) {
            console.warn("Textures non chargées !");
            return;
        }

        this.initGlobe();
        this.initAtmosphere();
        this.initEarthTexture();
        this.initEarthTextureClouds();

        if (scene) {
            scene.add(groups.globe);
        }

        this.animate();
    }

    /** Nettoyage à la destruction */
    componentWillUnmount() {
        if (this.props.scene) {
            this.props.scene.remove(groups.globe);
        }
        cancelAnimationFrame(this.animationId);
    }

    /** Boucle d’animation (atmosphère pulsante) */
    animate() {
        const time = performance.now() * 0.001;

        if (this.noiseTexture) this.updateNoiseTexture(time);

        if (this.globeMaterial?.uniforms?.time) {
            this.globeMaterial.uniforms.time.value = time;
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /** Renvoie l’objet 3D du globe */
    getObject3D() {
        return this.group;
    }

    /** Crée le globe principal avec shader */
    initGlobe() {
        const geometry = new THREE.SphereGeometry(this.radius, 64, 64);
        this.globeMaterial = this.createGlobeMaterial();

        const globe = new THREE.Mesh(geometry, this.globeMaterial);
        const scale = config.scale.globeScale;
        globe.scale.set(scale, scale, scale);
        elements.globe = globe;

        groups.map = new THREE.Group();
        groups.map.name = 'Map';
        groups.map.add(globe);

        groups.globe = new THREE.Group();
        groups.globe.name = 'Globe';
        groups.globe.add(groups.map);
    }

    /** Ajoute la sphère atmosphérique */
    initAtmosphere() {
        const atmosphereMaterial = this.createGlobeAtmosphere();
        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(this.radius, 64, 64),
            atmosphereMaterial
        );

        atmosphere.scale.set(1.4, 1.4, 1.4);
        atmosphereMaterial.depthTest = false;

        elements.atmosphere = atmosphere;

        groups.atmosphere = new THREE.Group();
        groups.atmosphere.name = 'Atmosphere';
        groups.atmosphere.add(atmosphere);

        groups.globe.add(groups.atmosphere);
    }

    /** Applique la texture de la Terre */
    initEarthTexture() {
        const geometry = new THREE.SphereGeometry(this.radius + 0.1, 64, 64);
        const material = new THREE.MeshBasicMaterial({
            map: this.earthTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.2,
        });

        this.earthTexture.offset.set(-0.029, 0.002);
        const earthMap = new THREE.Mesh(geometry, material);

        groups.earthMapGeometry = new THREE.Group();
        groups.earthMapGeometry.name = 'Earth map';

        elements.earthMap = earthMap;
        groups.earthMapGeometry.add(earthMap);
        groups.globe.add(groups.earthMapGeometry);

        elements.earthMap.visible = config.display.earthMap;
    }

    /** Applique la texture des nuages */
    initEarthTextureClouds() {
        const geometry = new THREE.SphereGeometry(this.radius + 0.1, 64, 64);
        const material = new THREE.MeshBasicMaterial({
            map: this.earthTextureClouds,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.1,
        });

        const earthClouds = new THREE.Mesh(geometry, material);

        groups.earthMapCloudsGeometry = new THREE.Group();
        groups.earthMapCloudsGeometry.name = 'Earth map clouds';

        elements.earthMapClouds = earthClouds;
        groups.earthMapCloudsGeometry.add(earthClouds);
        groups.globe.add(groups.earthMapCloudsGeometry);

        elements.earthMapClouds.visible = config.display.earthMapClouds;
    }

    /** Shader pour la Terre */
    createGlobeMaterial() {
        return new THREE.ShaderMaterial({
            uniforms: { texture: { value: this.earthTexture } },
            vertexShader: shaders.globe.vertexShader,
            fragmentShader: shaders.globe.fragmentShader,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });
    }

    /** Shader pour l’atmosphère */
    createGlobeAtmosphere() {
        this.noiseTexture = this.generateNoiseTexture(performance.now() * 0.001);
        return new THREE.ShaderMaterial({
            uniforms: {
                noiseTexture: { value: this.noiseTexture },
                opacity: { value: 0.9 },
                time: { value: 0 },
            },
            vertexShader: shaders.atmosphere.vertexShader,
            fragmentShader: shaders.atmosphere.fragmentShader,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true,
        });
    }

    /** Texture bruitée pour l’atmosphère */
    generateNoiseTexture(time) {
        const size = 256;
        const data = new Uint8Array(size * size * 4);
        const noiseScale = 0.01;
        const z = 0.5;

        const centerX = size / 2;
        const centerY = size / 2;
        const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                const normalizedDistance = distance / maxDistance;
                const pulseEffect = 0.5 + 0.5 * Math.sin(time * 3 + normalizedDistance * 20);

                const noiseValue = this.noiseGenerator.simplex3(x * noiseScale, y * noiseScale, z);
                const value = (noiseValue + 1) * 0.5;
                const colorValue = Math.floor(value * 255 * pulseEffect);

                const index = (x + y * size) * 4;
                data[index] = Math.min(colorValue * 1.0 + 100, 255);
                data[index + 1] = Math.min(colorValue * 0.9 + 40, 255);
                data[index + 2] = Math.min(colorValue * 1.2, 255);
                data[index + 3] = 255;
            }
        }

        const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
        texture.needsUpdate = true;
        return texture;
    }

    /** Mise à jour de la texture bruitée */
    updateNoiseTexture(time) {
        const size = 256;
        const data = new Uint8Array(size * size * 4);
        const noiseScale = 0.1;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const normalizedDistance = Math.sqrt((x - size / 2) ** 2 + (y - size / 2) ** 2) / (size / 2);
                const pulseEffect = 0.5 + 0.5 * Math.sin(time * 2 + normalizedDistance * 5);

                const noiseValue = this.noiseGenerator.simplex3(x * noiseScale, y * noiseScale, 0.5);
                const value = (noiseValue + 1) * 0.5;
                const colorValue = Math.floor(value * 255 * pulseEffect);

                const index = (x + y * size) * 4;
                data[index] = Math.min(colorValue * 0.7 + 80, 255);
                data[index + 1] = Math.min(colorValue * 0.5 + 20, 255);
                data[index + 2] = Math.min(colorValue * 0.9, 255);
                data[index + 3] = 255;
            }
        }

        this.noiseTexture.image.data.set(data);
        this.noiseTexture.needsUpdate = true;
    }

    render() {
        return null;
    }
}

export default Globe;