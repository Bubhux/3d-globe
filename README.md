![Static Badge](/static/badges/JavaScript.svg)   

![Static Badge](/static/badges/React.svg)   
![Static Badge](/static/badges/Vite.svg)   
![Static Badge](/static/badges/Tailwind.svg)   

![Static Badge](/static/badges/Remix.svg)   
![Static Badge](/static/badges/Three.svg)   

![Static Badge](/static/badges/Node.svg)   
![Static Badge](/static/badges/Npm.svg)   


<div id="top"></div>

## Menu   

1. **[Informations générales](#informations-générales)**   
2. **[Interface de l'application](#interface-application)**   
3. **[Accès à la démonstration en ligne](#lien-application)**   
4. **[Liste pré-requis](#liste-pre-requis)**   
5. **[Lancement de l'application](#lancement-application)**   
6. **[Informations importantes sur les différents fichiers et dossiers](#informations-importantes)**   
7. **[Auteur et contact](#auteur-contact)**   

### Projet globe 3D

- Développement d'un globe 3D interactif sous la forme d'un compposant pour être utiliser dans **React**.    

- Utilisation de **React**, **Vite.js** et **Remix**.   
- Utilisation de **Three.js** et de **Tailwind CSS**.   
  &nbsp;   

- Le panneau de configuration **app.addControlGui** (si il est décommenté dans le fichier ``main.jsx`` ➔ ([main.jsx](app/components/globe)))   
  permet de modifier les paramètres suivants.   
  &nbsp;

    - ``globeDotColor`` : Permet de changer la couleurs des **Dots**   
    - ``globeMarkerColor`` : Permet de changer la couleurs des **Marker**   
    - ``globeMarkerGlow`` : Permet de changer la couleurs des **Markers**   
    - ``globeLines`` : Permet de changer la couleurs des **Lines**   
    - ``globeLinesDots`` : Permet de changer la couleurs des **LinesDots**   
      &nbsp;

    - ``globeDotSize`` : Permet de changer la taille des **Dots**   
    - ``globeScale`` : Permet de changer la taille du **globe**   
      &nbsp;

    - ``map`` : Permet de désactiver la **map**   
    - ``points`` : Permet de désactiver les **points**   
    - ``markers`` : Permet de désactiver les **markes**   
    - ``markerLabel`` : Permet de désactiver les **markerLabel**   
    - ``markerPoint`` : Permet de désactiver les **markerPoint**   
    - ``atmosphere`` : Permet de désactiver **l'atmosphere**   
      &nbsp;
  
- Vous pouvez modifier les différentes textures pour le globe disponible dans le dossier ``textures``.   
  &nbsp;

  - ``earth_dark.jpg`` ➔ ([Fichier earth_dark.jpg](/app/components/globe/textures/earth_dark.jpg))   
  - ``earth_day.jpg`` ➔ ([Fichier earth_day.jpg](/app/components/globe/textures/earth_day.jpg))   
  - ``earth_night.jpg`` ➔ ([Fichier earth_night.jpg](/app/components/globe/textures/earth_night.jpg))   
  - ``map_indexed.png`` ➔ ([Fichier map_indexed.png](/app/components/globe/textures/map_indexed.png))   
  - ``map_outline.png`` ➔ ([Fichier map_outline.png](/app/components/globe/textures/map_outline.png))   
    &nbsp;

- Une texture pour les nuages est disponible dans le dossier ``textures``.   
  &nbsp;

  - ``clouds.jpg`` ➔ ([Fichier clouds.jpg](/app/components/globe/textures/clouds.jpg)) 
    &nbsp;

- Ensuite il faudra modifier le fichier ``globe.jsx`` ➔ ([Fichier globe.jsx](/app/components/globe/globe.jsx))   

```jsx
// app/components/globe/globe.jsx
import * as THREE from 'three';
import { Component } from 'react';

import { shaders } from '~/components/globe/utils/shaders';
import { config, elements, groups } from '~/components/globe/utils/config';
import { NoiseGenerator } from '~/components/globe/libs/perlin-noise.js';

import mapTexture from '~/components/globe/textures/map_indexed.png'; // Modifier ici le choix de la texture
import mapTextureClouds from '~/components/globe/textures/clouds.jpg';
```   
&nbsp;

- Vous pouvez paramétrer les diverses options du globe dans le fichier ``config.js``.
  &nbsp;

  - ``config.js`` ➔ ([config.js](/app/components/globe/utils/config.js))   

--------------------------------------------------------------------------------------------------------------------------------

<div id="interface-application"></div>
<a href="#top" style="float: right;">Retour en haut 🡅</a>

### Interface de l'application   

- L'application est exécutée dans une page web.   

<div style="display: flex; justify-content: flex-start; margin: 20px 0;">
    <div style="border: 1px solid #8d8d8d; border-radius: 5px; padding: 10px; padding-bottom: 2px; display: inline-block; margin-right: 10px; margin-left: 20px;">
        <img src="/static/img/screen_globe.png" alt="Screen globe" style="width: 1200px; height: auto;">
    </div>
</div>

--------------------------------------------------------------------------------------------------------------------------------

<div id="lien-application"></div>
<a href="#top" style="float: right;">Retour en haut 🡅</a>

### Accès à la démonstration en ligne   

- Vous pouvez accéder à une démonstration de l'application via **Cloudflare**.   
- En utilisant le lien suivant ➔ [Lien de l'application en ligne](https://9d86095e.globe-7xi.pages.dev/)   

--------------------------------------------------------------------------------------------------------------------------------

<div id="liste-pre-requis"></div>
<a href="#top" style="float: right;">Retour en haut 🡅</a>

### Liste pré-requis   

- Aucun pré-requis n'est nécessaire.   

- Application conçue avec les technologies suivantes :   
  &nbsp;   

  - **React** ``v18.2.0`` ➔ [Documentation React](https://fr.react.dev/)   
  - **Vitejs** ``v5.4.10`` ➔ [Documentation Vitejs](https://vitejs.dev/)   
  - **Remix** ``v2.13.1`` ➔ [Documentation Remix](https://remix.run/)   
  - **Three.js** ``v0.169.0`` ➔ [Documentation Three.js](https://threejs.org/)   
  - **Node.js** ``v.20.9.0`` ➔ [Documentation Node.js](https://nodejs.org/fr)   
  - **Npm** ``v10.8.1`` ➔ [Documentation et téléchargement de Npm](https://www.npmjs.com/)   
  - **Tailwind CSS** ``v3.4.4`` ➔ [Documentation Tailwind CSS](https://tailwindcss.com/)   
  - **VSCode** ``v1.85.2`` ➔ [Documentation et téléchargement de VSCode](https://code.visualstudio.com/)   
  - **Chrome** ``v.126.0.6478.114`` & **Firefox** ``v.127.0``     
  - **Windows 10** ``Professionnel``   

--------------------------------------------------------------------------------------------------------------------------------

<div id="lancement-application"></div>
<a href="#top" style="float: right;">Retour en haut 🡅</a>

### Lancement de l'application   

- Pour lancer l'application.   

#### 1. Installer *Node.js* (inclut *npm*)   

  - Si **Node.js** n'est pas encore installé sur votre machine, il peut être téléchargé ici ➔ [Téléchargement Node.js](https://nodejs.org/fr)   
  - Cela installera :   
    - À la fois les dépendances de production (comme **react** et **react-dom**)   
    - Et les dépendances de développement (comme **Vite**, **Three.js**, etc.)   
  &nbsp;   

#### 2. Installer les dépendances   

  - Dans un terminal exécuter la commande suivante dans le répertoire du projet.   
  - Cela installera toutes les dépendances spécifiées dans le fichier ``package.json`` ➔ ([package.json](package.json)).   

```bash   
$ npm install
```   

- Pour lancer le projet en mode développement.   
- Cela permettra d'accéder a la page ➔ http://localhost:5173/   

```bash
$ npm run dev
```   

>_**Note navigateur :** Les tests ont était fait sur **Firefox** et **Google Chrome**._  

--------------------------------------------------------------------------------------------------------------------------------

<div id="informations-importantes"></div>
<a href="#top" style="float: right;">Retour en haut 🡅</a>

### Informations importantes sur les différents fichiers et dossiers   

#### Les dossiers components   

  - Contient le dossier du composant **globe** avec les différents fichiers nécessaire pour l'application.   

    - ``components`` ➔ ([components](/app/components))     

#### Le dossier globe   

  - Le dossier contient les fichiers **React**.   

    - ``main.jsx`` ➔ ([main.jsx](/app/components/globe/main.jsx))   
    - ``app.jsx`` ➔ ([app.jsx](/app/components/globe/app.jsx))   
    - ``globe.jsx`` ➔ ([globe.jsx](/app/components/globe/globe.jsx))   
    - ``dots.jsx`` ➔ ([dots.jsx](/app/components/globe/dots.jsx))   
    - ``lines.jsx`` ➔ ([lines.jsx](/app/components/globe/lines.jsx))   
    - ``marker.jsx`` ➔ ([marker.jsx](/app/components/globe/marker.jsx))   
    - ``markers.jsx`` ➔ ([markers.jsx](/app/components/globe/markers.jsx))   
    - ``points.jsx`` ➔ ([points.jsx](/app/components/globe/points.jsx))   

#### Le dossier routes   

  - Le dossier contient la route princiaple pour l'application **React**.   

    - ``home.jsx`` ➔ ([home.jsx](/app/routes/home/home.jsx))   

#### Les dossier utils, data   

  - Le dossier **utils** contient le fichier **config.js** ou sont sauvegardés les paramètres de configuration du globe.   

    - Fichier **config.js**
        - ``config.js`` ➔ ([config.js](/app/components/globe/utils/config.js))    
        &nbsp;

  - Le dossier **data** contient les fichiers **connections.js** nécessaires pour la configuration du globe.   

    - Dossier **data**
        - ``connections.js`` ➔ ([connections.js](/app/components/globe/data/connections.js))   
        - ``countries.js`` ➔ ([countries.js](/app/components/globe/data/countries.js))   
        - ``grid.js`` ➔ ([grid.js](/app/components/globe/data/grid.js))   
        - ``processing.js`` ➔ ([processing.js](/app/components/globe/data/processing.js))   
        - ``countries.all.json`` ➔ ([countries.all.json](/app/components/globe/data/countries.all.json))    
        &nbsp;

    - Le fichier **main.module.css** regroupe les styles **CSS** pour l'application.   
        - ``main.module.css`` ➔ ([main.module.css](/app/components/globe/main.module.css))  

#### Le dossier static

  - Dossier qui contient les images, les badges pour le **README.md**.   

      - ``static`` ➔ ([badges](/static/badges))   
      - ``static`` ➔ ([img](/static/img))   

--------------------------------------------------------------------------------------------------------------------------------

<div id="auteur-contact"></div>
<a href="#top" style="float: right;">Retour en haut 🡅</a>

### Auteur et contact   

Pour toute information supplémentaire, vous pouvez me contacter.   
**Bubhux:** bubhuxpaindepice@gmail.com   
