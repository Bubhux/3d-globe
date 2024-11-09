// app/components/globe/markers.jsx
import * as THREE from 'three';
import React, { useEffect } from 'react';
import { toSphereCoordinates } from './utils/utils';
import { config, groups, elements } from '~/components/globe/utils/config';

import { toSphereCoordinates } from './utils/utils';
import Marker from './Marker';


const Markers = ({ countries, markerRadius = 2 }) => {
    useEffect(() => {
        const radius = config.sizes.globe + config.sizes.globe * config.scale.markers;

        // Initialisation des groupes et matériaux pour les marqueurs
        const markerGeometry = new THREE.SphereGeometry(markerRadius, 15, 15);
        const markerMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0.8,
        });

        groups.markers = new THREE.Group();
        groups.markers.name = 'GlobeMarkers';

        // Création des marqueurs
        createMarkers(countries, markerGeometry, markerMaterial, radius);

        return () => {
            // Nettoyage : retire les marqueurs de la scène
            elements.markers.forEach(marker => marker.removeFromScene());
        };
    }, [countries, markerRadius]);

    const createMarkers = (countries, markerGeometry, markerMaterial, radius) => {
        countries.forEach(country => {
            if (country.latitude && country.longitude) {
                const lat = +country.latitude;
                const lng = +country.longitude;
                const cords = toSphereCoordinates(lat, lng, radius);
                const marker = new Marker(markerMaterial, markerGeometry, country.name, cords);
                groups.markers.add(marker);
                elements.markers.push(marker);
            }
        });
    };

    return null; // Ce composant ne rend rien, il gère uniquement la logique des marqueurs
};

export default Markers;
