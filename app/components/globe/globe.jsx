// app/components/globe/globe.jsx
import * as THREE from 'three';
import { useEffect } from 'react';
import { shaders } from '~/components/globe/utils/shaders';
import { config, elements, groups } from '~/components/globe/utils/config';


const Globe = ({ isLoading, setIsLoading }) => { // Récupére les props
    const radius = config.sizes.globe;

    useEffect(() => {
        const geometry = new THREE.SphereGeometry(radius, 64, 64);

        // Création du groupe Globe
        groups.globe = new THREE.Group();
        groups.globe.name = 'Globe';

        initGlobe(geometry);
        // Initialiser l'atmosphère ici si nécessaire

        return () => {
            // Nettoyage si nécessaire
            if (groups.globe.parent) {
                groups.globe.parent.remove(groups.globe);
            }
        };
    }, [radius]);

    const initGlobe = (geometry) => {
        const scale = config.scale.globeScale;
        const globeMaterial = createGlobeMaterial(); // Utilise le matériel
        const globe = new THREE.Mesh(geometry, globeMaterial);
        globe.scale.set(scale, scale, scale);
        elements.globe = globe;

        // Création du groupe Map
        groups.map = new THREE.Group();
        groups.map.name = 'Map';

        groups.map.add(globe);
        groups.globe.add(groups.map);
    };

    const initAtmosphere = () => {
        const atmosphereMaterial = createGlobeAtmosphere();
        const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 64), atmosphereMaterial);
        atmosphere.scale.set(1.2, 1.2, 1.2);
        elements.atmosphere = atmosphere;

        // Création du groupe Atmosphère
        groups.atmosphere = new THREE.Group();
        groups.atmosphere.name = 'Atmosphere';

        groups.atmosphere.add(atmosphere);
        groups.globe.add(groups.atmosphere);
    };

    const createGlobeMaterial = () => {
        const loader = new THREE.TextureLoader(); // Instancie le loader ici
        const texture = loader.load('null', () => {
            setIsLoading(false); // Appele setIsLoading une fois la texture chargée
        }, undefined, (error) => {
            console.error('Erreur de chargement de la texture', error);
        });

        return new THREE.ShaderMaterial({
            uniforms: { texture: { value: texture } },
            vertexShader: shaders.globe.vertexShader,
            fragmentShader: shaders.globe.fragmentShader,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });
    };

    const createGlobeAtmosphere = () => {
        return new THREE.ShaderMaterial({
            vertexShader: shaders.atmosphere.vertexShader,
            fragmentShader: shaders.atmosphere.fragmentShader,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true,
            uniforms: {},
        });
    };

    return null; // Le rendu se fait avec Three.js, rien à afficher ici
};

export default Globe;