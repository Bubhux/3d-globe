// app/components/globe/marker.jsx
import { THREE } from '~/components/globe/utils/three';
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { config, elements, groups, textures } from '~/components/globe/utils/config';


const Marker = ({ material, geometry, label, cords, options = {} }) => {
    const { textColor = 'white', pointColor = config.colors.globeMarkerColor, glowColor = config.colors.globeMarkerGlow } = options;

    const groupRef = useRef(new THREE.Group());
    const [isAnimating, setIsAnimating] = useState(false);
    const glowRef = useRef(null);

    useEffect(() => {
        const group = groupRef.current;
        group.name = 'Marker';

        const pointColorThree = new THREE.Color(pointColor);
        const glowColorThree = new THREE.Color(glowColor);

        const labelSprite = createLabel();
        group.add(labelSprite);

        const point = createPoint(pointColorThree);
        group.add(point);

        const glow = createGlow(glowColorThree);
        group.add(glow);
        glowRef.current = glow;

        setPosition();

        groups.markers.add(group);

        return () => {
            groups.markers.remove(group);
        };
    }, [geometry, material, cords, pointColor, glowColor]);

    useEffect(() => {
        if (isAnimating) {
            const animate = () => {
                animateGlow();
                requestAnimationFrame(animate);
            };
            animate();
        }
    }, [isAnimating]);

    const createLabel = () => {
        const text = createText();
        const texture = new THREE.Texture(text);
        texture.minFilter = THREE.LinearFilter;
        textures.markerLabels.push(texture);

        const material = new THREE.SpriteMaterial({ map: texture, depthTest: false });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(40, 20, 1);
        sprite.center.x = 0.25;
        sprite.translateY(2);

        elements.markerLabel.push(sprite);
        return sprite;
    };

    const createPoint = (pointColorThree) => {
        const point = new THREE.Mesh(geometry, material);
        point.material.color.set(pointColorThree);
        elements.markerPoint.push(point);
        return point;
    };

    const createGlow = (glowColorThree) => {
        const glowMaterial = material.clone();
        const glow = new THREE.Mesh(geometry, glowMaterial);
        glow.material.color.set(glowColorThree);
        glow.material.opacity = 0.6;
        elements.markerPoint.push(glow);
        return glow;
    };

    const animateGlow = () => {
        if (glowRef.current && isAnimating) {
            glowRef.current.scale.x += 0.025;
            glowRef.current.scale.y += 0.025;
            glowRef.current.scale.z += 0.025;
            glowRef.current.material.opacity -= 0.005;

            if (glowRef.current.scale.x >= 4) {
                glowRef.current.scale.set(1, 1, 1);
                glowRef.current.material.opacity = 0.6;
                setIsAnimating(false);
            }
        }
    };

    const setPosition = () => {
        const { x, y, z } = cords;
        groupRef.current.position.set(-x, y, -z);
    };

    const createText = () => {
        const element = document.createElement('canvas');
        const canvas = new fabric.Canvas(element);

        const text = new fabric.Text(label, {
            left: 0,
            top: 0,
            fill: textColor,
            fontFamily: 'Open Sans',
        });

        canvas.add(text);
        return element;
    };

    return null; // Rendu WebGL, pas de rendu React standard.
};

export default Marker;
