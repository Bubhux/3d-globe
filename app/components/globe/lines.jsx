// app/components/globe/lines.jsx
import * as THREE from 'three';

import { getCountry } from '~/components/globe/data/processing';
import { getSplineFromCoords } from '~/components/globe/utils/utils';
import { MeshLine, MeshLineMaterial } from '~/components/globe/libs/THREE.MeshLine';
import { config, groups, elements, countries } from '~/components/globe/utils/config';

import connectionsData from '~/components/globe/data/connections';
import countriesData from '~/components/globe/data/countries';

import Dots from './dots';


class Lines extends THREE.Group {
    constructor() {
        super();
        this.countries = Object.keys(connectionsData.connections);
        this.total = this.countries.length;
        this.name = 'Lines';

        if (!groups.lines) {
            groups.lines = new THREE.Group();
        }

        this.create();
        this.animate();
        this.createDots();
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
    }

    createDots() {
        if (!groups.lineDots) {
            groups.lineDots = new THREE.Group();
        }
        const lineDots = new Dots();
        groups.lineDots.add(lineDots);

        if (groups.globe) {
            groups.globe.add(groups.lineDots);
        } else {
            console.warn("Class Lines function createDots groups.globe is not defined");
        }
    }

    animate() {
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
        const { connections } = connectionsData;
        const { countries } = countriesData;

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
    }
}


class Line {
    constructor(start, end) {
        const { globe } = config.sizes;
        const { markers } = config.scale;

        this.start = start;
        this.end = end;
        this.radius = globe + globe * markers;

        this.curve = this.createCurve();

        this.geometry = new THREE.BufferGeometry();
        const points = this.curve.getPoints(200);
        this.geometry.setFromPoints(points);
        this.material = this.createMaterial();

        this.line = new MeshLine();
        this.line.setGeometry(this.geometry);

        this.mesh = new THREE.Mesh(this.line.geometry, this.material);
        this.mesh._path = points;
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
        const material = new MeshLineMaterial({
            color: config.colors.globeLines,
            transparent: true,
            opacity: 0.45,
        });

        return material;
    }
}

export default Lines;
