// app/components/globe/main.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Globe from './globe';
import Lines from './Lines'; // Importez votre classe Lines
import Markers from './Markers'; // Importez votre classe Markers
import Points from './Points'; // Importez votre classe Points


const Main = () => {
    const [controls, setControls] = useState({});
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true); // Nouvel état pour le chargement
    const appRef = useRef(null);
    
    useEffect(() => {
        const app = new App({ setup, animate, preload });
        appRef.current = app;

        const loadData = async () => {
            await preload(); // Charge les données
            setup(appRef.current); // Configure après le chargement
            setIsLoading(false); // Indique que le chargement est terminé
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
            // Vous pouvez décommenter et utiliser ces lignes selon vos besoins
            // const gridUrl = '../assets/data/grid.json';
            // const gridRes = await fetch(gridUrl);
            // const grid = await gridRes.json();
            // data.grid = grid;

            // const countryUrl = '../assets/data/countries.json';
            // const countryRes = await fetch(countryUrl);
            // const countries = await countryRes.json();
            // data.countries = countries;

            // const connectionsUrl = '../assets/data/connections.json';
            // const connectionsRes = await fetch(connectionsUrl);
            // const connections = await connectionsRes.json();
            // data.connections = getCountries(connections, countries);    

            setData(data); // Met à jour l'état avec les données chargées
            return true;
        } catch (error) {
            console.log(error);
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
                setControls(prevControls => ({ ...prevControls, changed: true }));
            });
        });

        app.camera.position.z = config.sizes.globe * 2.85;
        app.camera.position.y = config.sizes.globe * 0;
        app.controls.enableDamping = true;
        app.controls.dampingFactor = 0.05;
        app.controls.rotateSpeed = 0.07;

        const groups = { main: new THREE.Group() };
        groups.main.name = 'Main';

        const globe = new Globe();
        groups.main.add(globe);

        const points = new Points(data.grid);
        groups.globe.add(groups.points);

        const markers = new Markers(data.countries);
        groups.globe.add(groups.markers);

        const lines = new Lines();
        groups.globe.add(groups.lines);

        app.scene.add(groups.main);
    };

    const animate = (app) => {
        if (controls.changed) {
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
            groups.globe.rotation.y -= 0.0025;
        }
    };

    useEffect(() => {
        // Appeler animate sur chaque frame avec une méthode comme requestAnimationFrame
        const animateLoop = () => {
            animate(appRef.current);
            requestAnimationFrame(animateLoop);
        };

        animateLoop();

        return () => {
            // Cleanup si nécessaire
        };
    }, []);

    // Rendu conditionnel pour le chargement
    if (isLoading) {
        return <div>Loading...</div>; // Affiche un loader pendant le chargement
    }

    return (
        <div id="canvas-container"></div>
    );
};

export default Main;