// app/components/globe/globe.jsx
import React, { Component } from 'react';
import { shaders } from '~/components/globe/utils/shaders';
import { config, elements, groups } from '~/components/globe/utils/config';
import * as THREE from 'three';
import { NoiseGenerator } from '~/components/globe/libs/perlin-noise.js';


class Globe extends Component {
    constructor(props) {
        super(props);
        this.radius = config.sizes.globe;
        this.mesh = null;
        this.group = new THREE.Group();
        this.noiseGenerator = new NoiseGenerator();
        this.noiseTexture = null;
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

        // Lance l'animation
        this.animate();
    }

    componentWillUnmount() {
        if (this.props.scene) {
            this.props.scene.remove(groups.globe);
        }
        cancelAnimationFrame(this.animationId); // Nettoie l'animation
    }

    animate() {
        const time = performance.now() * 0.001; // Temps en secondes

        if (this.noiseTexture) {
            this.updateNoiseTexture(time); // Mettre à jour la texture de bruit
        }

        this.animationId = requestAnimationFrame(() => this.animate());
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
        this.noiseTexture = this.generateNoiseTexture(performance.now() * 0.001);

        return new THREE.ShaderMaterial({
            uniforms: {
                noiseTexture: { value: this.noiseTexture },
                opacity: { value: 0.5 } // Ajuste l'opacité pour le halo
            },
            vertexShader: shaders.atmosphere.vertexShader,
            fragmentShader: shaders.atmosphere.fragmentShader,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true,
        });
    }

    generateNoiseTexture(time) {
        const size = 256;
        const data = new Uint8Array(size * size * 4);
        const noiseScale = 0.15; // Augmente la fréquence du bruit pour un effet granuleux
        const z = 0.5;

        const centerX = size / 2;
        const centerY = size / 2;
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                // Calculer la distance du pixel au centre
                const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                const normalizedDistance = distance / maxDistance; // Normaliser la distance entre 0 et 1

                // Oscillation temporelle pour effet de pulsation
                const pulseEffect = 0.5 + 0.5 * Math.sin(time * 2 + normalizedDistance * 5); // Effet de pulsation

                // Augmente l'effet de bruit basé sur la distance
                const noiseValue = this.noiseGenerator.simplex3(x * noiseScale, y * noiseScale, z);
                const value = (noiseValue + 1) * 0.5; // Normaliser entre 0 et 1
                const colorValue = Math.floor(value * 255 * pulseEffect); // Applique l'effet de pulsation

                const index = (x + y * size) * 4;
                // Accentue le bleu ciel et réduire l'intensité des autres couleurs
                data[index] = Math.min(colorValue * 0.7 + 80, 255);  // R : Accentuer le bleu
                data[index + 1] = Math.min(colorValue * 0.5 + 20, 255); // G : Légère réduction
                data[index + 2] = Math.min(colorValue * 0.9, 255); // B : Accentue le bleu
                data[index + 3] = 255; // Opaque
            }
        }

        const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
        texture.needsUpdate = true;

        return texture;
    }

    updateNoiseTexture(time) {
        const size = 256;
        const data = new Uint8Array(size * size * 4);
        const noiseScale = 0.15; // Assure que cela correspond à ce qui a été utilisé lors de la création

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const normalizedDistance = Math.sqrt((x - size / 2) ** 2 + (y - size / 2) ** 2) / (size / 2);
                const pulseEffect = 0.5 + 0.5 * Math.sin(time * 2 + normalizedDistance * 5);

                const noiseValue = this.noiseGenerator.simplex3(x * noiseScale, y * noiseScale, 0.5);
                const value = (noiseValue + 1) * 0.5; // Normaliser entre 0 et 1
                const colorValue = Math.floor(value * 255 * pulseEffect);

                const index = (x + y * size) * 4;
                data[index] = Math.min(colorValue * 0.7 + 80, 255);  // R
                data[index + 1] = Math.min(colorValue * 0.5 + 20, 255); // G
                data[index + 2] = Math.min(colorValue * 0.9, 255); // B
                data[index + 3] = 255; // Opaque
            }
        }

        this.noiseTexture.image.data.set(data); // Mettre à jour les données de la texture
        this.noiseTexture.needsUpdate = true; // Marque la texture pour mise à jour
    }

    render() {
        return null;
    }
}

export default Globe;
