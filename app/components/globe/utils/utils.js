// app/components/globe/utils/utils.js
import * as THREE from 'three';
import * as d3 from 'd3';


// Constantes
const GLOBE_RADIUS = 200; // Rayon du globe
const CURVE_MIN_ALTITUDE = 20; // Altitude minimale de la courbe
const CURVE_MAX_ALTITUDE = 200; // Altitude maximale de la courbe
const DEGREE_TO_RADIAN = Math.PI / 180; // Conversion de degrés en radians

// Convertir des degrés en radians
const toRadians = (degrees) => degrees * DEGREE_TO_RADIAN;

// Convertis la latitude et la longitude en coordonnées 3D sur une sphère
function toSphereCoordinates(lat, lng, scale) {
    const phi = toRadians(90 - lat);
    const theta = toRadians(180 - lng);
    return {
        x: scale * Math.sin(phi) * Math.cos(theta),
        y: scale * Math.cos(phi),
        z: scale * Math.sin(phi) * Math.sin(theta),
    };
}

// Calcul les coordonnées de la courbe entre deux points
function returnCurveCoordinates(latitudeA, longitudeA, latitudeB, longitudeB, size) {
    const start = toSphereCoordinates(latitudeA, longitudeA, size);
    const end = toSphereCoordinates(latitudeB, longitudeB, size);

    const midPoint = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2,
        z: (start.z + end.z) / 2,
    };

    const distance = Math.sqrt(
        Math.pow(end.x - start.x, 2) +
        Math.pow(end.y - start.y, 2) +
        Math.pow(end.z - start.z, 2)
    );

    const multipleVal = (distance ** 2) / (midPoint.x ** 2 + midPoint.y ** 2 + midPoint.z ** 2) * 0.7;

    return {
        start,
        mid: {
            x: midPoint.x + multipleVal * midPoint.x,
            y: midPoint.y + multipleVal * midPoint.y,
            z: midPoint.z + multipleVal * midPoint.z,
        },
        end,
    };
}

// Fonction clamp pour restreindre un nombre dans une plage
function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}

// Convertis la latitude et la longitude en position de type THREE.js Vector3
function coordinateToPosition(lat, lng, radius) {
    const phi = toRadians(90 - lat);
    const theta = toRadians(180 - lng);

    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        -radius * Math.sin(phi) * Math.sin(theta)
    );
}

// Obtiens les coordonnées de la courbe à partir de deux coordonnées géographiques
function getSplineFromCoords(latitudeA, longitudeA, latitudeB, longitudeB, size) {
    const start = coordinateToPosition(latitudeA, longitudeA, size);
    const end = coordinateToPosition(latitudeB, longitudeB, size);

    // Calcul l'altitude
    const altitude = clamp(start.distanceTo(end) * 0.45, CURVE_MIN_ALTITUDE, CURVE_MAX_ALTITUDE);

    // Interpolation pour trouver les points de contrôle de la courbe
    const interpolate = d3.geoInterpolate([longitudeA, latitudeA], [longitudeB, latitudeB]);
    const midCoord1 = interpolate(0.25);
    const midCoord2 = interpolate(0.75);
    const mid1 = coordinateToPosition(midCoord1[1], midCoord1[0], GLOBE_RADIUS + altitude);
    const mid2 = coordinateToPosition(midCoord2[1], midCoord2[0], GLOBE_RADIUS + altitude);

    return { start, end, mid1, mid2 };
}

// Exporte les fonctions pour une utilisation externe
export { toSphereCoordinates, returnCurveCoordinates, clamp, coordinateToPosition, getSplineFromCoords };

