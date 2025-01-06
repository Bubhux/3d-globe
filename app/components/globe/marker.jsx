// app/components/globe/marker.jsx
import * as THREE from 'three';
import { Component } from 'react';
import { fabric } from 'fabric';

import { config, elements, groups, textures } from '~/components/globe/utils/config';


class Marker extends Component {
    constructor(props) {
        super(props);
        const {
            material,
            geometry,
            label,
            cords,
            textColor = 'white',
        } = props;

        this.isAnimating = false;

        this.textColor = textColor;
        this.pointColor = new THREE.Color(config.colors.globeMarkerColor);
        this.glowColor = new THREE.Color(config.colors.globeMarkerGlow);

        this.groupRef = new THREE.Group();
        this.groupRef.name = 'Marker';

        this.labelText = label;
        this.cords = cords;
        this.material = material;
        this.geometry = geometry;

        this.createLabel();
        this.createPoint();
        this.createGlow();
        this.setPosition();
    }

    componentDidMount() {
        groups.markers.add(this.groupRef);
    }

    componentWillUnmount() {
        groups.markers.remove(this.groupRef);
    }

    componentDidUpdate(prevProps) {
        if (this.props.cords !== prevProps.cords) {
            this.setPosition();
        }

        if (this.props.geometry !== prevProps.geometry || this.props.material !== prevProps.material) {
            if (!this.point) {
                this.createPoint();
            }
            if (!this.glow) {
                this.createGlow();
            }
        }
    }

    createLabel() {
        const text = this.createText();
        const texture = new THREE.Texture(text);
        texture.minFilter = THREE.LinearFilter;
        textures.markerLabels.push(texture);

        texture.needsUpdate = true;

        const material = new THREE.SpriteMaterial({ map: texture, depthTest: false });
        this.label = new THREE.Sprite(material);
        this.label.scale.set(40, 20, 1);
        this.label.center.x = 0.25;
        this.label.translateY(2);

        this.groupRef.add(this.label);
        elements.markerLabel.push(this.label);
    }

    createPoint() {
        this.point = new THREE.Mesh(this.props.geometry, new THREE.MeshBasicMaterial({
            color: this.pointColor,
            transparent: true,
            opacity: 0.8,
        }));

        this.point.material.color.set(this.pointColor);
        this.groupRef.add(this.point);
        elements.markerPoint.push(this.point);
    }

    createGlow() {
        const glowMaterial = this.props.material.clone();
        this.glow = new THREE.Mesh(this.props.geometry, glowMaterial);
        this.glow.material.color.set(this.glowColor);
        this.glow.material.opacity = 0.6;
        this.groupRef.add(this.glow);
        elements.markerPoint.push(this.glow);
    }

    animateGlow() {
        if (!this.isAnimating) {
            if (Math.random() > 0.99) {
                this.isAnimating = true;
            }
        } else if (this.isAnimating) {
            this.glow.scale.x += 0.025;
            this.glow.scale.y += 0.025;
            this.glow.scale.z += 0.025;
            this.glow.material.opacity -= 0.005;

            if (this.glow.scale.x >= 4) {
                this.glow.scale.x = 1;
                this.glow.scale.y = 1;
                this.glow.scale.z = 1;
                this.glow.material.opacity = 0.6;
                this.glow.isAnimating = false;
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

        const text = new fabric.Text(this.labelText, {
            left: 0,
            top: 0,
            fill: this.textColor,
            fontFamily: 'Open Sans',
        });

        canvas.add(text);
        return element;
    }

    getGroup() {
        return this.groupRef;
    }

    render() {
        return null;
    }
}

export default Marker;
