// app/components/globe/main.jsx
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';

import App from './app';
import Globe from './globe';
import Lines from './lines';
import Marker from './marker';
import Markers from './markers';
import Points from './points';

import gridData from '~/components/globe/data/grid';
import countriesData from '~/components/globe/data/countries';
import connectionsData from '~/components/globe/data/connections';

import { getCountries } from '~/components/globe/data/processing';
import { config, elements, groups, animations } from '~/components/globe/utils/config';

import styles from './main.module.css';


const Main = () => {
    const [controls, setControls] = useState({ changed: true });
    const [data, setData] = useState({ grid: [], countries: [], connections: [] });
    const [isLoading, setIsLoading] = useState(true);
    const appRef = useRef();
    const globeRef = useRef();
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

    useEffect(() => {
        if (!appRef.current) {
            appRef.current = new App({ setup, animate, preload });
            window.onresize = appRef.current.handleResize;
        }

        return () => {
            if (appRef.current?.guiRef) {
                appRef.current.guiRef.destroy();
            }
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

            // Charger toutes les textures du globe AVANT de faire le setup
            globeRef.current = new Globe();
            await globeRef.current.loadTextures();

            //await new Promise(resolve => setTimeout(resolve, 3000));

            setIsLoading(false);
            return true;
        } catch (error) {
            console.error('Erreur de chargement', error);
            setData({ error });
            setIsLoading(false);
            return false;
        }
    };

    const setup = (app) => {
        const controllers = [];
        // Panneau de configuration décommenter pour activer le panneau de configuration.
        {/* app.addControlGui(gui => {
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
            controllers.push(displayFolder.add(config.display, 'lines'));
            controllers.push(displayFolder.add(config.display, 'lineDots'));
            controllers.push(displayFolder.add(config.display, 'points'));
            controllers.push(displayFolder.add(config.display, 'markers'));
            controllers.push(displayFolder.add(config.display, 'markerLabel'));
            controllers.push(displayFolder.add(config.display, 'markerPoint'));
            controllers.push(displayFolder.add(config.display, 'atmosphere'));

            const animationsFolder = gui.addFolder('Animations');
            controllers.push(animationsFolder.add(animations, 'rotateGlobe'));

            sizeFolder.open();
        }); */}

        controllers.forEach(controller => {
            controller.onChange(() => {
                setControls(prevControls => ({ ...prevControls, changed: true }));

            });
        });

        app.camera.position.z = config.sizes.globe * 2.85;
        app.camera.position.y = config.sizes.globe * 0;

        groups.globe = new THREE.Group();
        groups.globe.name = 'Globe';

        // ⚠️ Injecter les objets 3D une fois les textures chargées
        if (globeRef.current) {
            globeRef.current.setup(app.scene);
        }

        const points = new Points(gridData);
        if (points) {
            groups.globe.add(points);
        }

        const markers = new Markers(countriesData);
        if (markers) {
            groups.globe.add(markers);
        }

        const lines = new Lines({ connections: connectionsData.connections });
        if (lines) {
            groups.globe.add(lines);
        }

        if (elements.atmosphere) {
            groups.globe.add(elements.atmosphere);
        }

        app.scene.add(groups.globe);
    };

    const animate = (app) => {
        if (controls.changed) {
            const updateMaterial = (element, property, value) => {
                if (element?.material) {
                    element.material[property] = value;
                }
            };

            const updateVisibility = (elementsList, visible) => {
                elementsList?.forEach(element => {
                    if (element) element.visible = visible;
                });
            };

            if (groups.lines) {
                groups.lines.visible = config.display.lines;
            }

            if (elements.lineDots && groups.lineDots) {
                groups.lineDots.visible = config.display.lineDots;
            }

            if (elements.atmosphere) {
                elements.atmosphere.visible = config.display.atmosphere;
            }

            if (elements.globePoints) {
                updateMaterial(elements.globePoints, 'size', config.sizes.globeDotSize);
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
                    if (line?.material) {
                        line.material.color.set(config.colors.globeLines);
                    }
                });
            }

            ['map', 'markers', 'points'].forEach((key, index) => {
                const group = [groups.map, groups.markers, groups.points][index];
                if (group) group.visible = config.display[key];
            });

            updateVisibility(elements.markerLabel, config.display.markerLabel);
            updateVisibility(elements.markerPoint, config.display.markerPoint);

            setControls(prev => ({ ...prev, changed: false }));
        }

        if (elements.lineDots) {
            elements.lineDots.forEach(dot => {
                if (dot?.material) {
                    dot.material.color.set(config.colors.globeLinesDots);
                    dot.animate();
                }
            });
        }

        if (elements.markers?.length) {
            elements.markers.forEach(marker => {
                if (marker instanceof Marker) {
                    marker.point?.material?.color.set(config.colors.globeMarkerColor);
                    marker.glow?.material?.color.set(config.colors.globeMarkerGlow);
                    if (marker.label?.material?.map) {
                        marker.label.material.map.needsUpdate = true;
                    }
                    marker.animateGlow?.();
                }
            });
        }

        if (!groups.globe) {
            console.error("groups.globe is not initialized.");
        } else {
            if (groups.atmosphere) groups.globe.add(groups.atmosphere);
            if (groups.lines) groups.globe.add(groups.lines);
            if (groups.markers) groups.globe.add(groups.markers);
            if (groups.points) groups.globe.add(groups.points);
            if (groups.map) groups.globe.add(groups.map);

            if (!app.renderer) {
                console.error("Renderer is not initialized.");
            }
        }

        if (groups.globe && animations.rotateGlobe) {
            groups.globe.rotation.y -= 0.0015;
        }

        if (app.renderer) {
            app.renderer.render(app.scene, app.camera);
        }
    };

    useEffect(() => {
        let animationId = requestAnimationFrame(function animateLoop() {
            if (appRef.current) animate(appRef.current);
            animationId = requestAnimationFrame(animateLoop);
        });

        return () => cancelAnimationFrame(animationId);
    }, []);

    if (data.error) {
        return <div>Error loading data: {data.error.message}</div>;
    }

    return (
        <div className="app-wrapper">
            {isLoading && !hasLoadedOnce && (
                <div className={`${styles.loaderWrapper} ${!isLoading ? styles.hidden : ''}`}>
                    <div className={styles.loader}></div>
                    <p className={styles.loaderMessage}>Loading ...</p>
                </div>
            )}
            <Globe
                scene={appRef.current?.scene}
                setIsLoading={setIsLoading}
                loader={new THREE.TextureLoader()}
            />
            <ul className="markers"></ul>
        </div>
    );
};

export default Main;