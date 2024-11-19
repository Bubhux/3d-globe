// app/components/globe/points.jsx
import { THREE } from '~/components/globe/utils/three';
import React, { useEffect } from 'react';
import { fabric } from 'fabric';

import { toSphereCoordinates } from '~/components/globe/utils/utils';
import { config, groups, elements } from '~/components/globe/utils/config';


const Points = ({ grid, scene }) => {
    useEffect(() => {
        const total = grid.length;
        const radius = config.sizes.globe + config.sizes.globe * config.scale.points;

        const sizeArray = [];
        const positionArray = [];
        const colorsArray = [];

        const pointsGroup = new THREE.Group();
        pointsGroup.name = 'Points';
        groups.points = pointsGroup;

        const createPoints = () => {
            const color = new THREE.Color();

            for (let i = 0; i < total; i++) {
                const { lat, lon } = grid[i];
                const { x, y, z } = toSphereCoordinates(lat, lon, radius);

                positionArray.push(-x, -y, -z);
                sizeArray.push(config.sizes.pointSize);

                color.set(config.colors.pointColor);
                color.toArray(colorsArray, i * 3);
            }

            const positions = new Float32Array(positionArray);
            const colors = new Float32Array(colorsArray);
            const sizes = new Float32Array(sizeArray);

            const texture = new THREE.Texture(createTexture());
            const geometry = new THREE.BufferGeometry();
            const material = new THREE.PointsMaterial({
                color: config.colors.globeDotColor,
                size: config.sizes.globeDotSize,
            });

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            const points = new THREE.Points(geometry, material);
            pointsGroup.add(points);
            elements.globePoints = points;
        };

        const updateColor = (col) => {
            const color = new THREE.Color();

            for (let i = 0; i < total; i++) {
                color.set(col);
                color.toArray(colorsArray, i * 3);
            }

            const colorsArray = new Float32Array(colorsArray);
            const colors = new THREE.BufferAttribute(colorsArray, 3);
            pointsGroup.children[0].geometry.attributes.customColor = colors;
            pointsGroup.children[0].geometry.attributes.customColor.needsUpdate = true;
        };

        const createTexture = () => {
            const radius = 60;
            const element = document.createElement('canvas');
            const canvas = new fabric.Canvas(element);

            canvas.setHeight(radius);
            canvas.setWidth(radius);

            const rect = new fabric.Rect({
                width: radius,
                height: radius,
                fill: 'white',
            });

            const circle = new fabric.Circle({
                radius: radius / 2 - 2,
                fill: 'blue',
                left: 1,
                top: 1,
            });

            canvas.add(rect);
            canvas.add(circle);
            return element;
        };

        createPoints();
        scene.add(pointsGroup);

        return () => {
            scene.remove(pointsGroup);
        };
    }, [grid, scene]);

    return null; // Ce composant ne rend rien lui-même
};

export default Points;
