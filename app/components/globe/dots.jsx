// app/components/globe/dots.jsx
import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import { config, groups, countries } from '~/components/globe/utils/config';


class Dot {
    constructor() {
        this.radius = 2;
        this.segments = 32;
        this.rings = 32;

        this.geometry = new THREE.SphereGeometry(this.radius, this.segments, this.rings);
        this.material = new THREE.MeshBasicMaterial({ color: config.colors.globeLinesDots });
        this.material.transparent = true;
        this.material.opacity = 0.65;

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.visible = false;

        this._path = null;
        this._pathIndex = 0;
    }

    assignToLine() {
        if (countries.selected) {
            const lines = countries.selected.children;
            const index = Math.floor(Math.random() * lines.length);
            const line = lines[index];
            this._path = line._path;
        }
    }

    animate() {
        if (!this._path) {
            if (Math.random() > 0.99) {
                this.assignToLine();
                this._pathIndex = 0;
            }
        } else if (this._path && this._pathIndex < this._path.length - 1) {
            if (!this.mesh.visible) {
                this.mesh.visible = true;
            }

            const { x, y, z } = this._path[this._pathIndex];
            this.mesh.position.set(x, y, z);
            this._pathIndex++;
        } else {
            this.mesh.visible = false;
            this._path = null;
        }
    }
}

const Dots = ({ scene }) => {
    const total = config.dots.total;
    const frameId = useRef();

    useEffect(() => {
        groups.lineDots = new THREE.Group();
        groups.lineDots.name = 'LineDots';
        scene.add(groups.lineDots);

        createDots();

        const animate = () => {
            groups.lineDots.children.forEach(dot => dot.animate());
            frameId.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (groups.lineDots.parent) {
                groups.lineDots.parent.remove(groups.lineDots);
            }
            cancelAnimationFrame(frameId.current);
        };
    }, [scene]);

    const createDots = () => {
        for (let i = 0; i < total; i++) {
            const dot = new Dot();
            groups.lineDots.add(dot.mesh);
            elements.lineDots.push(dot);
        }
    };

    return null; // Le rendu se fait avec Three.js, rien à afficher ici
};

export default Dots;
