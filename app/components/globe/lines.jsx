// app/components/globe/lines.jsx
import * as THREE from 'three';
import { MeshLine, MeshLineMaterial } from '~/components/globe/libs/THREE.MeshLine.js';

import { config, groups, elements, countries } from '~/components/globe/utils/config';
import { getCountry } from '~/components/globe/data/processing';
import { getSplineFromCoords } from '~/components/globe/utils/utils';
import connectionsData from '~/components/globe/data/connections.js';
import gridData from '~/components/globe/data/grid.js';
import countriesData from '~/components/globe/data/countries.js';

import Dots from './dots';


class Lines extends THREE.Group {
    constructor() {
        super();
        this.countries = Object.keys(connectionsData.connections);
        this.total = this.countries.length;
        this.name = 'Lines';

        if (!groups.lines) {
            groups.lines = new THREE.Group();
            //console.log("Lines constructor group added to globe:", groups.lines);
        }

        elements.lines = [];
        this.create();
        this.animate();
        this.createDots();
        //console.log('Class Lines constructor', connectionsData.connections);
    }

    changeCountry() {
        //console.log('Class Lines function changeCountry called');
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
        //console.log('Class Lines function createDots called');
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
        //console.log('Class Lines function animate called');
        if (!countries.selected) {
            this.select();
        }

        this.interval = setInterval(() => this.changeCountry(), countries.interval);
    }

    select() {
        //console.log('Class Lines function select called');
        const next = this.countries[countries.index];
        //console.log('Next Country:', next);
        const selected = groups.lines.getObjectByName(next);
        //console.log('Selected Country:', selected);
        countries.selected = selected;
        countries.selected.visible = true;
    }

    create() {
        //console.log('Class Lines function create called');
        const { connections } = connectionsData;
        const { countries } = countriesData;
        //console.log('Connections Data function create "connections":', connections);
        //console.log('Connections Data function create "countries":', countries);

        for (let i in connections) {
            const start = getCountry(i, countries);
            //console.log('Start Country:', start);
            const group = new THREE.Group();
            group.name = i;

            for (let j in connections[i]) {
                const end = connections[i][j];
                const line = new Line(start, end);
                elements.lines.push(line.mesh);
                group.add(line.mesh);
                //console.log('Line created:', line.mesh);
            }

            group.visible = false;
            groups.lines.add(group);
            //console.log("Lines function create group added to globe:", groups.lines);
            //console.log('Elements lines populated:', elements.lines);
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
        //console.log('Class Line function createCurve called');
        const { start, end, mid1, mid2 } = getSplineFromCoords(
            this.start.latitude,
            this.start.longitude,
            this.end.latitude,
            this.end.longitude,
            this.radius
        );
        //console.log('Creating curve from', start, 'to', end);
        //console.log('Curve points:', start, mid1, mid2, end);

        return new THREE.CubicBezierCurve3(start, mid1, mid2, end);
    }

    createMaterial() {
        //console.log('Class Line function createMaterial called');
        const material = new MeshLineMaterial({
            color: config.colors.globeLines,
            transparent: true,
            opacity: 0.45,
        });
        //console.log('Material created:', material);
        return material;
    }
}

export default Lines;
