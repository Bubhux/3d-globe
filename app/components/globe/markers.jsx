// app/components/globe/markers.jsx
import * as THREE from 'three';

import { toSphereCoordinates } from './utils/utils';
import { config, groups, elements } from '~/components/globe/utils/config';

import Marker from './Marker';


class Markers extends THREE.Group {
    constructor(props) {
        super(props);
        const { countries = [], markerRadius = 2 } = props;

        this.countries = countries;
        this.radius = config.sizes.globe + config.sizes.globe * config.scale.markers;

        this.markerGeometry = new THREE.SphereGeometry(markerRadius, 15, 15);
        this.markerMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0.8,
        });

        this.markers = new THREE.Group();
        this.markers.name = 'GlobeMarkers';
        groups.markers = this.markers;

        this.create();
    }

    create() {
        if (!Array.isArray(this.countries)) {
            console.error("Countries is not an array:", this.countries);
            return;
        }

        const allCoords = [];

        for (let country of this.countries) {
            if (country.latitude && country.longitude) {
                const lat = +country.latitude;
                const lng = +country.longitude;

                const cords = toSphereCoordinates(lat, lng, this.radius);
                allCoords.push(cords);

                const marker = new Marker({
                    textColor: 'white',
                    pointColor: this.markerMaterial.color.getHex(),
                    glowColor: this.markerMaterial.color.getHex(),
                    cords: cords,
                    label: country.name,
                    geometry: this.markerGeometry,
                    material: this.markerMaterial
                });

                this.markers.add(marker.getGroup());
                elements.markers.push(marker);
            }
        }

        groups.globe.add(this.markers);
    }

    render() {
        return null;
    }
}

export default Markers;