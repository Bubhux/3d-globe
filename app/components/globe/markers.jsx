// app/components/globe/markers.jsx
import * as THREE from 'three';
import React, { Component } from 'react';
import { toSphereCoordinates } from './utils/utils';
import { config, groups, elements } from '~/components/globe/utils/config';

import Marker from './Marker';


class Markers extends Component {
    constructor(props) {
        super(props);
        const { countries = [], markerRadius = 2 } = props;

        this.countries = countries;
        this.radius = config.sizes.globe + config.sizes.globe * config.scale.markers;

        this.markerGeometry = new THREE.SphereGeometry(markerRadius, 15, 15);
        this.markerMaterial = new THREE.MeshBasicMaterial();
        this.markerMaterial.transparent = true;
        this.markerMaterial.opacity = 0.8;

        this.markers = new THREE.Group();
        this.markers.name = 'GlobeMarkers';
        groups.markers = this.markers;

        this.create();
    }

    create() {
        if (!Array.isArray(this.countries)) {
            //console.error("Countries is not an array:", this.countries);
            return;
        }

        for (let i = 0; i < this.countries.length; i++) {
            const country = this.countries[i];
            if (country.latitude && country.longitude) {
                const lat = +country.latitude;
                const lng = +country.longitude;

                const cords = toSphereCoordinates(lat, lng, this.radius);
                const marker = new Marker(this.markerMaterial, this.markerGeometry, country.name, cords);
                if (marker) {
                    //console.log("Marker created:", marker);
                    this.markers.add(marker.groupRef);
                    elements.markers.push(marker);
                } else {
                    //console.error("Failed to create marker for:", country);
                }
            }
        }
        groups.globe.add(this.markers);
    }

    render() {
        return null;
    }
}

export default Markers;
