// app/components/globe/main.jsx
import React, { useEffect, useRef, useState } from 'react';

import App from './app';
import Globe from './globe';
import Lines from './lines';
import Markers from './markers';
import Points from './points';

import gridData from '~/components/globe/data/grid.js';
import countriesData from '~/components/globe/data/countries.js';
import connectionsData from '~/components/globe/data/connections.js';

import * as THREE from 'three';
import { getCountries } from '~/components/globe/data/processing';
import { config, elements, groups, animations } from '~/components/globe/utils/config';
import "./main.module.css"


const Index = () => {
    const [controls, setControls] = useState({ changed: false });
    const [data, setData] = useState({ grid: [], countries: [], connections: [] });
    const [isLoading, setIsLoading] = useState(true);
    const appRef = useRef();

    useEffect(() => {
        appRef.current = new App({ setup, animate, preload });
        appRef.current.init();
        window.onresize = appRef.current.handleResize;

        return () => {
            window.onload = null;
            window.onresize = null;
        };
    }, []);

    const preload = async () => {
        try {
            const loadedData = {
                grid: gridData.grid,
                countries: countriesData.countries,
                connections: getCountries(connectionsData.connections, countriesData.countries),
            };

            setData(loadedData);
            return true;
        } catch (error) {
            console.error("Error during preloading:", error);
            setData({ error });
            return false;
        }
    };

    const setup = (app) => {
        const controllers = [];

        app.addControlGui(gui => {
            const colorFolder = gui.addFolder('Colors');
            controllers.push(colorFolder.addColor(config.colors, 'globeDotColor'));
            controllers.push(colorFolder.addColor(config.colors, 'globeMarkerColor'));
            controllers.push(colorFolder.addColor(config.colors, 'globeMarkerGlow'));
            controllers.push(colorFolder.addColor(config.colors, 'globeLines'));
            controllers.push(colorFolder.addColor(config.colors, 'globeLinesDots'));

            const sizeFolder = gui.addFolder('Sizes');
            controllers.push(sizeFolder.add(config.sizes, 'globeDotSize', 1, 5));
            controllers.push(sizeFolder.add(config.scale, 'globeScale', 0.1, 1));

            const displayFolder = gui.addFolder('Display');
            controllers.push(displayFolder.add(config.display, 'map'));
            controllers.push(displayFolder.add(config.display, 'points'));
            controllers.push(displayFolder.add(config.display, 'markers'));
            controllers.push(displayFolder.add(config.display, 'markerLabel'));
            controllers.push(displayFolder.add(config.display, 'markerPoint'));

            const animationsFolder = gui.addFolder('Animations');
            controllers.push(animationsFolder.add(animations, 'rotateGlobe'));

            sizeFolder.open();
        });

        controllers.forEach(controller => {
            controller.onChange(() => {
                setControls(prevControls => ({ ...prevControls, changed: false }));

            });
        });

        app.camera.position.z = config.sizes.globe * 2.85;
        app.camera.position.y = config.sizes.globe * 0;
        app.controls.enableDamping = true;
        app.controls.dampingFactor = 0.05;
        app.controls.rotateSpeed = 0.07;

        const globe = new Globe({ scene: app.scene, setIsLoading, loader });
        groups.main = new THREE.Group();
        groups.main.name = 'Main';
        groups.main.add(globe);

        const points = new Points(data.grid);
        groups.globe.add(points);

        const markers = new Markers(data.countries);
        groups.globe.add(markers);

        const lines = new Lines();
        groups.globe.add(lines);

        app.scene.add(groups.main);
    };

    const animate = (app) => {
        if (controls.changed) {
            if (elements.globePoints) {
                elements.globePoints.material.size = config.sizes.globeDotSize;
                elements.globePoints.material.color.set(config.colors.globeDotColor);
            }

            if (elements.globe) {
                elements.globe.scale.set(
                    config.scale.globeScale,
                    config.scale.globeScale,
                    config.scale.globeScale
                );
            }

            if (elements.lines) {
                for (let i = 0; i < elements.lines.length; i++) {
                    const line = elements.lines[i];
                    line.material.color.set(config.colors.globeLines);
                }
            }

            groups.map.visible = config.display.map;
            groups.markers.visible = config.display.markers;
            groups.points.visible = config.display.points;

            for (let i = 0; i < elements.markerLabel.length; i++) {
                const label = elements.markerLabel[i];
                label.visible = config.display.markerLabel;
            }

            for (let i = 0; i < elements.markerPoint.length; i++) {
                const point = elements.markerPoint[i];
                point.visible = config.display.markerPoint;
            }

            controls.changed = false
        }

        if (elements.lineDots) {
            for (let i = 0; i < elements.lineDots.length; i++) {
                const dot = elements.lineDots[i];
                dot.material.color.set(config.colors.globeLinesDots);
                dot.animate();
            }
        }

        if (elements.markers) {
            for (let i = 0; i < elements.markers.length; i++) {
                const marker = elements.markers[i];
                marker.point.material.color.set(config.colors.globeMarkerColor);
                marker.glow.material.color.set(config.colors.globeMarkerGlow);
                marker.label.material.map.needsUpdate = true;
                marker.animateGlow();
            }
        }

        if (animations.rotateGlobe) {
            groups.globe.rotation.y -= 0.0025;
        }
    };

    return (
        <div className="app-wrapper">
            {isLoading && <div>Loading...</div>}
            <ul className="markers"></ul>
        </div>
    );
};

export default Index;
