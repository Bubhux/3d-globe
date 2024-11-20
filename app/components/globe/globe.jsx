// app/components/globe/globe.jsx
import { THREE } from '~/components/globe/utils/three';
import { useEffect, useRef } from 'react';
import { shaders } from '~/components/globe/utils/shaders';
import { config, elements, groups } from '~/components/globe/utils/config';


const Globe = ({ isLoading, setIsLoading, loader }) => {
    const radius = config.sizes.globe;
    const globeRef = useRef(null);

    useEffect(() => {
        const geometry = new THREE.SphereGeometry(radius, 64, 64);
        groups.globe = new THREE.Group();
        groups.globe.name = 'Globe';

        initGlobe(geometry);
        initAtmosphere();

        if (globeRef.current) {
            globeRef.current.add(groups.globe);
        } else {
            console.error("La référence globeRef n'est pas définie");
        }

        return () => {
            // Nettoyage si nécessaire
            if (groups.globe.parent) {
                groups.globe.parent.remove(groups.globe);
            }
        };
    }, [radius, loader, setIsLoading]);

    const initGlobe = (geometry) => {
        const scale = config.scale.globeScale;
        const globeMaterial = createGlobeMaterial();
        const globe = new THREE.Mesh(geometry, globeMaterial);
        globe.scale.set(scale, scale, scale);
        elements.globe = globe;

        // Création du groupe Map
        groups.map = new THREE.Group();
        groups.map.name = 'Map';

        groups.map.add(globe);
        groups.globe.add(groups.map);

        console.log("Globe initialized:", elements.globe);
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
        const texture = loader.load(config.urls.globeTexture, () => {
            setIsLoading(false);
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

    return (
        <div ref={globeRef}>
            {isLoading && <p>Loading globe.jsx...</p>}
        </div>
    );
};

export default Globe;