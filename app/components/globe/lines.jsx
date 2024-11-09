// app/components/globe/lines.jsx
import * as THREE from 'three';
import React, { useEffect, useState, useRef } from 'react';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { config, elements, groups, countries } from '~/components/globe/utils/config';

import { getSplineFromCoords } from '~/components/globe/utils/utils';
import Dots from './dots';



const Lines = () => {
    const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
    const groupRef = useRef(new THREE.Group());
    const intervalRef = useRef(null);
    const totalCountries = Object.keys(data.connections).length;

    useEffect(() => {
        groupRef.current.name = 'Lines';
        createLines();
        createDots();
        animate();

        return () => {
            clearInterval(intervalRef.current);
            if (countries.selected) {
                countries.selected.visible = false;
            }
        };
    }, [countries.interval, data.connections]);

    const animate = () => {
        if (!countries.selected) {
            select(currentCountryIndex);
        }
        intervalRef.current = setInterval(changeCountry, countries.interval);
    };

    const changeCountry = () => {
        setCurrentCountryIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % totalCountries;
            if (countries.selected && countries.selected.visible) {
                countries.selected.visible = false;
            }
            select(newIndex);
            groups.lineDots.children = [];
            elements.lineDots = [];
            createDots();
            return newIndex;
        });
    };

    const select = (index) => {
        const nextCountry = Object.keys(data.connections)[index];
        const selectedCountry = groups.lines.getObjectByName(nextCountry);
        countries.selected = selectedCountry;
        if (countries.selected) {
            countries.selected.visible = true;
        }
    };

    const createDots = () => {
        const lineDots = new Dots();
        groups.globe.add(groups.lineDots);
    };

    const createLines = () => {
        const { connections, countries } = data;

        for (let i in connections) {
            const start = getCountry(i, countries);
            const group = new THREE.Group();
            group.name = i;

            for (let j in connections[i]) {
                const end = connections[i][j];
                const line = new Line(start, end);
                elements.lines.push(line.mesh);
                group.add(line.mesh);
            }

            group.visible = false;
            groups.lines.add(group);
        }
    };

    return null; // Rendu WebGL, pas de rendu React standard.
};

class Line {
    constructor(start, end) {
        const { globe } = config.sizes;
        const { markers } = config.scale;

        this.start = start;
        this.end = end;
        this.radius = globe + globe * markers;

        this.curve = this.createCurve();

        this.geometry = new THREE.Geometry();
        this.geometry.vertices = this.curve.getPoints(200);
        this.material = this.createMaterial();

        this.line = new MeshLine();
        this.line.setGeometry(this.geometry);

        this.mesh = new THREE.Mesh(this.line.geometry, this.material);
        this.mesh._path = this.geometry.vertices;
    }

    createCurve() {
        const { start, end, mid1, mid2 } = getSplineFromCoords(
            this.start.latitude,
            this.start.longitude,
            this.end.latitude,
            this.end.longitude,
            this.radius
        );

        return new THREE.CubicBezierCurve3(start, mid1, mid2, end);
    }

    createMaterial() {
        return new MeshLineMaterial({
            color: config.colors.globeLines,
            transparent: true,
            opacity: 0.45
        });
    }
}

export default Lines;
