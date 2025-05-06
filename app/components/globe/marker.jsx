// app/components/globe/marker.jsx
import * as THREE from 'three';

import { Component } from 'react';
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

    async createLabel() {
        try {
            // Crée un canvas pour générer une texture de texte
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            // Définir la taille du canvas en fonction de la longueur du texte
            const text = this.labelText;
            const fontSize = 48; // Taille de la police
            context.font = `${fontSize}px Open Sans`;
            const textWidth = context.measureText(text).width;
            canvas.width = textWidth;
            canvas.height = fontSize;

            // Dessine le texte sur le canvas
            context.font = `${fontSize}px Open Sans`;
            context.fillStyle = this.textColor;
            context.textBaseline = 'top';
            context.fillText(text, 0, 0);

            // Crée une texture à partir du canvas
            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;
            textures.needsUpdate = true;

            // Crée un matériau Sprite pour afficher la texture
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(spriteMaterial);

            // Ajuste l'échelle du sprite
            const scale = 0.1; // Ajuste l'échelle selon vos besoins
            sprite.scale.set(textWidth * scale, fontSize * scale, 1);

            // Positionne le sprite
            sprite.position.set(0, 9, 0); // Ajuste la position selon vos besoins

            // Ajoute le sprite au groupe
            this.groupRef.add(sprite);

            // Ajoute le label à la liste des éléments
            if (elements?.markerLabel) {
                elements.markerLabel.push(sprite);
            }
        } catch (error) {
            console.error("Error loading the font :", error);
        }
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
        console.log("Coordinates received :", this.props.cords);
        if (!this.props.cords || typeof this.props.cords !== 'object') {
            console.error("The coordinates are not valid :", this.props.cords);
            return;
        }
        const { x, y, z } = this.props.cords;
        this.groupRef.position.set(-x, y, -z);
    }

    getGroup() {
        return this.groupRef;
    }

    render() {
        return null;
    }
}

export default Marker;