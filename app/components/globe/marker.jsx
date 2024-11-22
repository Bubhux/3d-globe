// app/components/globe/marker.jsx
import * as THREE from 'three';
import React, { Component, createRef } from 'react';
import { fabric } from 'fabric';
import { config, elements, groups, textures } from '~/components/globe/utils/config';


class Marker extends Component {
    constructor(props) {
        super(props);
        const { options = {} } = props;
        this.pointColor = options.pointColor || config.colors.globeMarkerColor;
        this.glowColor = options.glowColor || config.colors.globeMarkerGlow;

        this.groupRef = new THREE.Group();
        this.groupRef.name = 'Marker';
    }

    componentDidMount() {
        const { cords, geometry, material } = this.props;

        const point = new THREE.Mesh(geometry, material);
        const glowMaterial = new THREE.MeshBasicMaterial({ color: this.glowColor, transparent: true, opacity: 0.5 });
        const glow = new THREE.Mesh(geometry, glowMaterial);

        point.position.set(-cords.x, cords.y, -cords.z);
        glow.position.set(-cords.x, cords.y, -cords.z);

        this.groupRef.add(point);
        this.groupRef.add(glow);

        //console.log(this.groupRef.children);
        groups.markers.add(this.groupRef);
    }

    getGroup() {
        return this.groupRef;
    }

    componentWillUnmount() {
        groups.markers.remove(this.groupRef);
    }

    componentDidUpdate(prevProps) {
        if (this.props.cords !== prevProps.cords) {
            this.setPosition();
        }
        if (this.props.geometry !== prevProps.geometry || this.props.material !== prevProps.material) {
            this.createPoint(new THREE.Color(this.pointColor));
            this.createGlow(new THREE.Color(this.glowColor));
        }
    }

    startAnimation() {
        this.isAnimating = true;
        this.animate();
    }

    stopAnimation() {
        this.isAnimating = false;
    }

    animate() {
        if (this.isAnimating) {
            this.animateGlow();
            requestAnimationFrame(this.animate.bind(this));
        }
    }

    createLabel() {
        const text = this.createText();
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
    }

    createPoint(pointColorThree) {
        const point = new THREE.Mesh(this.props.geometry, this.props.material);
        point.material.color.set(pointColorThree);
        return point;
    }

    createGlow(glowColorThree) {
        const glowMaterial = this.props.material.clone();
        const glow = new THREE.Mesh(this.props.geometry, glowMaterial);
        glow.material.color.set(glowColorThree);
        glow.material.opacity = 0.6;
        return glow;
    }

    animateGlow() {
        if (this.glowRef.current && this.isAnimating) {
            this.glowRef.current.scale.x += 0.025;
            this.glowRef.current.scale.y += 0.025;
            this.glowRef.current.scale.z += 0.025;
            this.glowRef.current.material.opacity -= 0.005;

            if (this.glowRef.current.scale.x >= 4) {
                this.glowRef.current.scale.set(1, 1, 1);
                this.glowRef.current.material.opacity = 0.6;
                this.stopAnimation();
            }
        }
    }

    setPosition() {
        const { x, y, z } = this.props.cords;
        this.groupRef.position.set(-x, y, -z);
    }

    createText() {
        const element = document.createElement('canvas');
        const canvas = new fabric.Canvas(element);

        const text = new fabric.Text(this.props.label, {
            left: 0,
            top: 0,
            fill: this.textColor,
            fontFamily: 'Open Sans',
        });

        canvas.add(text);
        return element;
    }

    render() {
        return null;
    }
}

export default Marker;
