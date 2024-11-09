// app/components/globe/points.jsx
import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

import { toSphereCoordinates } from '~/components/globe/utils/utils';
import { config, groups, elements } from '~/components/globe/utils/config';
import grid from '~/components/globe/data/grid';


const Points = ({ grid }) => {
    const pointsRef = useRef(null);
    const radius = config.sizes.globe + config.sizes.globe * config.scale.points;

    useEffect(() => {
        const positionArray = [];
        const sizeArray = [];
        const colorsArray = [];
        const color = new THREE.Color();

        for (let i = 0; i < grid.length; i++) {
            const { lat, lon } = grid[i];
            const { x, y, z } = toSphereCoordinates(lat, lon, radius);

            positionArray.push(-x, -y, -z);
            sizeArray.push(config.sizes.globeDotSize);

            color.set(config.colors.globeDotColor);
            color.toArray(colorsArray, i * 3);
        }

        const positions = new Float32Array(positionArray);
        const colors = new Float32Array(colorsArray);
        const sizes = new Float32Array(sizeArray);

        const geometry = new THREE.BufferGeometry();
        const material = new THREE.PointsMaterial({
            color: config.colors.globeDotColor,
            size: config.sizes.globeDotSize
        });

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const points = new THREE.Points(geometry, material);
        pointsRef.current = points;

        // Ajout des points à la scène
        groups.points = new THREE.Group();
        groups.points.name = 'Points';
        groups.points.add(points);
        elements.globePoints = points;

        // Nettoyage lors du démontage
        return () => {
            groups.points.remove(points);
        };
    }, [grid, radius]);

    return null; // Aucun rendu visuel nécessaire, les points sont ajoutés à la scène Three.js
};

export default Points;
