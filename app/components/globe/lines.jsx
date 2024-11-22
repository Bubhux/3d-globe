// app/components/globe/lines.jsx
import * as THREE from 'three';
import React from 'react';
import { MeshLine, MeshLineMaterial } from 'three.meshline';

import { config, groups, elements, countries } from '~/components/globe/utils/config';
import { getCountry } from '~/components/globe/data/processing';
import { getSplineFromCoords } from '~/components/globe/utils/utils';
import connectionsData from '~/components/globe/data/connections.js';
import gridData from '~/components/globe/data/grid.js';
import countriesData from '~/components/globe/data/countries.js';

import Dots from './dots';


class Lines extends THREE.Object3D {
    constructor(props) {
        super(props);
        const { connections } = connectionsData;
        this.countries = Object.keys(connections);
        this.total = this.countries.length;
        console.log('Countries:', this.countries);

        this.group = new THREE.Group();
        this.group.name = 'Lines';

        this.create = this.create.bind(this);
        this.animate = this.animate.bind(this);
        this.changeCountry = this.changeCountry.bind(this);
        this.select = this.select.bind(this);
        this.createDots = this.createDots.bind(this);
        console.log('Connections Lines Data constructor:', connections);
        console.log('connectionsData:', connectionsData);
        console.log('countriesData:', countriesData);
    }

    changeCountry() {
        countries.index++;

        if (countries.index >= this.total) {
            countries.index = 0;
        }

        if (countries.selected) {
            countries.selected.visible = false;
        }

        this.select();

        groups.lineDots.children = [];
        elements.lineDots = [];
        this.createDots();
        const connections = connectionsData.connections;
        console.log('Function changeCountry:', connections);
    }

    createDots() {
        const lineDots = new Dots();
        groups.globe.add(groups.lineDots);
    }

    animate() {
        console.log('Animate function called');
        if (!countries.selected) {
            this.select();
        }

        this.interval = setInterval(() => this.changeCountry(), countries.interval);
    }

    select() {
        const next = this.countries[countries.index];
        const selected = groups.lines.getObjectByName(next);
        countries.selected = selected;
        countries.selected.visible = true;
    }

    create() {
        const { connections, countries } = connectionsData;
        console.log('Connections Data function create:', connections);

        for (let i in connections) {
            const start = getCountry(i, countries);
            console.log('Start country:', start);
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
    }
}


class Line extends THREE.Object3D {
    constructor(start, end) {
        super();
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
        console.log('Line mesh created:', this.mesh);
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
