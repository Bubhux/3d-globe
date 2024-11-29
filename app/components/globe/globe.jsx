// app/components/globe/globe.jsx
import React, { Component } from 'react';
import { shaders } from '~/components/globe/utils/shaders';
import { config, elements, groups } from '~/components/globe/utils/config';
import * as THREE from 'three';


class Globe extends Component {
    constructor(props) {
        super(props);
        this.radius = config.sizes.globe;
        this.mesh = null;
        this.group = new THREE.Group();
        this.noiseGenerator = new NoiseGenerator();
    }

    componentDidMount() {
        const geometry = new THREE.SphereGeometry(this.radius, 64, 64);
        groups.globe = new THREE.Group();
        groups.globe.name = 'Globe';

        this.initGlobe(geometry);
        this.initAtmosphere();

        if (this.props.scene) {
            this.props.scene.add(groups.globe);
        }
    }

    componentWillUnmount() {
        if (this.props.scene) {
            this.props.scene.remove(groups.globe);
        }
    }

    init() {
        const geometry = new THREE.SphereGeometry(this.radius, 64, 64);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.group.add(this.mesh);
    }

    getObject3D() {
        return this.group;
    }

    initGlobe(geometry) {
        const scale = config.scale.globeScale;
        const globeMaterial = this.createGlobeMaterial();
        const globe = new THREE.Mesh(geometry, globeMaterial);
        globe.scale.set(scale, scale, scale);
        elements.globe = globe;

        groups.map = new THREE.Group();
        groups.map.name = 'Map';

        groups.map.add(globe);
        groups.globe.add(groups.map);
    }

    initAtmosphere() {
        const atmosphereMaterial = this.createGlobeAtmosphere();
        const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(this.radius, 64, 64), atmosphereMaterial);
        atmosphere.scale.set(1.2, 1.2, 1.2);
        elements.atmosphere = atmosphere;

        groups.atmosphere = new THREE.Group();
        groups.atmosphere.name = 'Atmosphere';

        groups.atmosphere.add(atmosphere);
        groups.globe.add(groups.atmosphere);
        console.log("Function initAtmosphere:", groups.globe);
    }

    createGlobeMaterial() {
        const texture = this.props.loader.load(
            config.urls.globeTexture,
            () => this.props.setIsLoading(false),
            undefined,
            (error) => {
                console.error('Erreur de chargement de la texture', error);
                this.props.setIsLoading(false);
            }
        );

        return new THREE.ShaderMaterial({
            uniforms: { texture: { value: texture } },
            vertexShader: shaders.globe.vertexShader,
            fragmentShader: shaders.globe.fragmentShader,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });
    }

    createGlobeAtmosphere() {
        console.log('Class Globe function createGlobeAtmosphere called');

        // Créer une texture de bruit de Perlin
        const noiseTexture = this.generateNoiseTexture();

        return new THREE.ShaderMaterial({
            uniforms: {
                noiseTexture: { value: noiseTexture },
                opacity: { value: 0.5 } // Ajuste l'opacité pour le halo
            },
            vertexShader: shaders.atmosphere.vertexShader,
            fragmentShader: shaders.atmosphere.fragmentShader,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true,
        });
    }

    generateNoiseTexture() {
        console.log('Class Globe function generateNoiseTexture called');
        const size = 256; // Taille de la texture
        const data = new Uint8Array(size * size * 4);
        const noiseScale = 0.5; // Ajuste l'échelle du bruit

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const value = this.noiseGenerator.simplex2(x * noiseScale, y * noiseScale);
                const colorValue = Math.floor((value + 1) * 128); // Normalise le bruit à [0, 255]

                const index = (x + y * size) * 4;
                data[index] = colorValue;     // R
                data[index + 1] = colorValue; // G
                data[index + 2] = colorValue; // B
                data[index + 3] = 255;        // A
            }
        }

        const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
        texture.needsUpdate = true;

        return texture;
    }

    render() {
        return null;
    }
}

export default Globe;
