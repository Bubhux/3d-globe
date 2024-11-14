// app/components/globe/main.jsx
import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';

import App from './app';
import Globe from './globe';
import Lines from './lines';
import Markers from './markers';
import Points from './points';

import gridData from '~/components/globe/data/grid.js';
import countriesData from '~/components/globe/data/countries.js';
import connectionsData from '~/components/globe/data/connections.js';
import { getCountries } from '~/components/globe/data/processing';
import { config, elements, groups, animations } from '~/components/globe/utils/config';
import "./main.module.css"


const Main = () => {
    console.log("Main component loaded");
    const [controls, setControls] = useState({});
    const [loadedData, setLoadedData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const appRef = useRef(null);
    const loader = new THREE.TextureLoader();

    useEffect(() => {
        const loadNoiseLibrary = async () => {
            // Chargement dynamique du fichier perlin-noise.js
            await import('./libs/perlin-noise.js');
            console.log("Perlin noise library loaded");
        };

        loadNoiseLibrary();

        console.log("App initialized");
        const app = new App({ setup, animate, preload });
        appRef.current = app;

        const loadData = async () => {
            console.log("Loading data...");
            const result = await preload();
            console.log("Preload result:", result);
            if (result) {
                setup(appRef.current);
                console.log("Data loaded and setup completed");
                setIsLoading(false);
            }
        };

        loadData();

        window.onload = app.init;
        window.onresize = app.handleResize;

        return () => {
            window.onload = null;
            window.onresize = null;
        };
    }, []);

    const preload = async () => {
        try {
            console.log("Preloading data...");
            // Vous pouvez décommenter et utiliser ces lignes selon vos besoins
            // Chargement des données
            loadedData.grid = gridData.grid;
            loadedData.countries = countriesData.countries;

            loadedData.connections = getCountries(connectionsData.connections, loadedData.countries);

            setLoadedData(loadedData);
            console.log("Preloading completed successfully", loadedData);
            return true;
        } catch (error) {
            console.error("Error during preloading:", error);
        }
    };

    const setup = (app) => {
        console.log("Setting up app...");
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
                setControls(prevControls => ({ ...prevControls, changed: true }));
            });
        });

        console.log("Controllers initialized", controllers);

        app.camera.position.z = config.sizes.globe * 2.85;
        app.camera.position.y = config.sizes.globe * 0;
        console.log("Camera position set");
        app.controls.enableDamping = true;
        app.controls.dampingFactor = 0.05;
        app.controls.rotateSpeed = 0.07;

        const groups = {
            main: new THREE.Group(),
            globe: new THREE.Group()
        };
        groups.main.name = 'Main';

        const globe = new Globe();
        groups.main.add(globe);

        console.log("Globe added to scene");

        const points = new Points(data.grid);
        groups.globe.add(groups.points);

        const markers = new Markers(data.countries);
        groups.globe.add(groups.markers);

        const lines = new Lines();
        groups.globe.add(groups.lines);

        app.scene.add(groups.main);

        console.log("Scene setup completed");
    };

    const animate = (app) => {
        console.log("Animating app...");
        if (controls.changed) {
            console.log("Controls have changed, updating elements...");
            // Logique de mise à jour des éléments
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
                elements.lines.forEach(line => {
                    line.material.color.set(config.colors.globeLines);
                });
            }

            groups.map.visible = config.display.map;
            groups.markers.visible = config.display.markers;
            groups.points.visible = config.display.points;

            elements.markerLabel.forEach(label => {
                label.visible = config.display.markerLabel;
            });

            elements.markerPoint.forEach(point => {
                point.visible = config.display.markerPoint;
            });

            setControls(prevControls => ({ ...prevControls, changed: false }));
        }

        // Logique d'animation
        if (elements.lineDots) {
            elements.lineDots.forEach(dot => {
                dot.material.color.set(config.colors.globeLinesDots);
                dot.animate();
            });
        }

        if (elements.markers) {
            elements.markers.forEach(marker => {
                marker.point.material.color.set(config.colors.globeMarkerColor);
                marker.glow.material.color.set(config.colors.globeMarkerGlow);
                marker.label.material.map.needsUpdate = true;
                marker.animateGlow();
            });
        }

        if (animations.rotateGlobe) {
            console.log("Rotating globe");
            groups.globe.rotation.y -= 0.0025;
        }
    };

    useEffect(() => {
        // Appel animate sur chaque frame avec une méthode comme requestAnimationFrame
        const animateLoop = () => {
            if (appRef.current) {
                animate(appRef.current);
            }
            requestAnimationFrame(animateLoop);
        };

        animateLoop();

        return () => {
            // Cleanup si nécessaire
        };
    }, []);

    // Rendu conditionnel pour le chargement
    if (isLoading) {
        console.log("Globe is loading...");
        return <div>Loading...</div>;
    }

    if (loadedData.countries) {
        console.log("Loaded countries data:", loadedData.countries);
    }

    if (data.error) {
        return <div>Error loading data: {data.error.message}</div>;
    }

    return (
        <div className="app-wrapper">
            <canvas ref={appRef}></canvas>
            <Globe loader={loader} />
            <Markers data={loadedData.countries} />
            <Lines data={loadedData.connections} />
            <Points data={loadedData.grid} />
            <ul className="markers">
                {loadedData.countries && loadedData.countries.map((country, index) => (
                    <li key={index} className="marker">{country.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Main;