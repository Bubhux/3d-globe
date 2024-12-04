// app/components/globe/main.jsx
import React, { useEffect, useRef, useState } from 'react';

import App from './app';
import Globe from './globe';
import Lines from './lines';
import Marker from './marker';
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
    //console.log("Main component loaded");
    const [controls, setControls] = useState({ changed: true });
    const [data, setData] = useState({ grid: [], countries: [], connections: [] });
    const [isLoading, setIsLoading] = useState(true);
    const appRef = useRef();

    useEffect(() => {
        if (!appRef.current) {
            appRef.current = new App({ setup, animate, preload });
            //console.log("App instance created:", app);
            window.onresize = appRef.current.handleResize;
        }

        return () => {
            if (appRef.current && appRef.current.guiRef) {
                appRef.current.guiRef.destroy();
            }
            window.onload = null;
            window.onresize = null;
        };
    }, []);

    const preload = async () => {
        try {
            //console.log("Preloading data...");
            const loadedData = {
                grid: gridData.grid,
                countries: countriesData.countries,
                connections: getCountries(connectionsData.connections, countriesData.countries),
            };

            setData(loadedData);
            //console.log("Preloading completed successfully", loadedData);
            return true;
        } catch (error) {
            //console.error("Error during preloading:", error);
            setData({ error });
            return false;
        }//
    };

    const setup = (app) => {
        //console.log("Setting up app...");
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

        //console.log("Controllers initialized", controllers);

        app.camera.position.z = config.sizes.globe * 2.85;
        app.camera.position.y = config.sizes.globe * 0;
        app.controls.enableDamping = true;
        app.controls.dampingFactor = 0.05;
        app.controls.rotateSpeed = 0.07;

        groups.globe = new THREE.Group();
        groups.globe.name = 'Globe';

        const globeInstance = new Globe();
        const globeObject = globeInstance.getObject3D();
        if (globeObject) {
            groups.globe.add(globeObject);
        } else {
            console.error("globeObject is not initialized");
        }

        const points = new Points(gridData);
        if (points && points.points) {
            groups.globe.add(points.points);
        } else {
            console.error("points are not initialized");
        }

        const markers = new Markers(countriesData);
        if (markers && markers.markers) {
            groups.globe.add(markers.markers);
        } else {
            console.error("markers are not initialized");
        }

        const lines = new Lines({ connections: connectionsData.connections });
        if (lines) {
            groups.globe.add(lines);
        } else {
            console.error("lines are not initialized");
        }

        app.scene.add(groups.globe);

        //console.log("Globe group:", groups.globe);
        //console.log("Groups:", groups);
        //console.log("Scene setup completed");
    };

    const animate = (app) => {
        //console.log("Animating app...");
        if (controls.changed) {
            const updateMaterial = (element, property, value) => {
                if (element) {
                    element.material[property] = value;
                }
            };

            const updateVisibility = (elements, visible) => {
                elements.forEach(element => {
                    if (element) element.visible = visible;
                });
            };

            if (elements.globePoints) {
                updateMaterial(elements.globePoints, 'size', config.sizes.globeDotSize);
                elements.globePoints.material.color.set(config.colors.globeDotColor);
            }

            if (elements.globe) {
                elements.globe.scale.set(config.scale.globeScale, config.scale.globeScale, config.scale.globeScale);
            } else {
                console.error("Globe is not initialized.");
            }

            if (elements.lines) {
                elements.lines.forEach(line => {
                    line.material.color.set(config.colors.globeLines);
                });
                //console.log("Elements lines:", elements.lines);
            }

            updateVisibility(elements.markerLabel, config.display.markerLabel);
            updateVisibility(elements.markerPoint, config.display.markerPoint);

            setControls(prevControls => ({ ...prevControls, changed: false }));
        }

        if (elements.lineDots) {
            elements.lineDots.forEach(dot => {
                if (dot && dot.material) {
                    dot.material.color.set(config.colors.globeLinesDots);
                    dot.animate();
                }
            });
        }

        if (elements.markers && elements.markers.length) {
            elements.markers.forEach(marker => {
                if (marker instanceof Marker) {
                    if (marker.point && marker.point.material) {
                        marker.point.material.color.set(config.colors.globeMarkerColor);
                    }
                    if (marker.glow && marker.glow.material) {
                        marker.glow.material.color.set(config.colors.globeMarkerGlow);
                    }
                    if (marker.label && marker.label.material) {
                        marker.label.material.map.needsUpdate = true;
                    }
                    marker.animateGlow && marker.animateGlow();
                }
            });
        }

        // Vérifie si globe est initialisé et journalise une erreur si non
        if (!groups.globe) {
            //console.error("groups.globe is not initialized.");
        } else {
            // Ajoute atmosphere et lines à globe si elles sont initialisées
            groups.globe.add(groups.atmosphere || new THREE.Group());
            groups.globe.add(groups.lines || new THREE.Group());

            // Vérifie l'initialisation de renderer et globe avant de continuer
            if (!app.renderer) {
                //console.error("Renderer is not initialized.");
            }
        }

        if (animations.rotateGlobe) {
            groups.globe.rotation.y -= 0.0025;
        }

        app.renderer.render(app.scene, app.camera);
    };

    useEffect(() => {
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

    if (data.error) {
        return <div>Error loading data: {data.error.message}</div>;
    }

    return (
        <div className="app-wrapper">
            {isLoading && <div>Loading main.jsx...</div>}
            <Globe
                scene={appRef.current?.scene}
                setIsLoading={setIsLoading}
                loader={new THREE.TextureLoader()}
            />
            <ul className="markers"></ul>
        </div>
    );
};

export default Index;
