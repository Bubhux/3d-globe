// app/components/globe/shaders.js

export const shaders = {
	atmosphere: {},
	globe: {},
	dot: {},
	clouds: {}
}

// Shader de sommet pour le globe
shaders.globe.vertexShader = `
	// Variables pour les données interpolées envoyées au shader de fragment
	varying vec3 vNormal;
	varying vec2 vUv;

	void main() {
		// Calcul de la position du vertex dans l'espace de projection
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.01 );

		// Normalisation et transmission de la normale du vertex
		vNormal = normalize( normalMatrix * normal );

		// Transmission des coordonnées UV du vertex
		vUv = uv;
	}
`

// Shader de fragment pour le globe
shaders.globe.fragmentShader = `
	// Uniformes pour la texture du globe et le temps
	uniform sampler2D texture;
	uniform float time;

	// Variables interpolées depuis le shader de sommet
	varying vec3 vNormal;
	varying vec2 vUv;

	void main() {
		// Calcul de l'intensité pour l'effet de bord basé sur la normale
		float intensity = 1.2 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0));

		// S'assure que l'intensité ne soit pas négative
		intensity = max(intensity, 0.0);

		// Ajuste le seuil pour placer l'effet à l'extérieur
		float threshold = 0.8;
		float edge = smoothstep(threshold, threshold + 0.05, intensity);

		// Dégradé de couleur pour le halo (gris-blanc transparent)
		vec3 haloColor = mix(vec3(0.5), vec3(1.0), edge);
		float alpha = smoothstep(1.0, 0.1, edge) * (1.0 - edge); // Effet de fondu

		// Calcul du mouvement sur la surface
		float waveMovement = sin(vUv.y * 10.0 + time) * 0.05; // Mouvement de vague
		float gasMovement = (sin(time * 2.0 + vUv.x * 5.0) + 1.0) * 0.5; // Mouvement de gaz

		// Ajouter une pulsation
		float pulse = 0.1 * sin(time * 3.0) + 0.1; // Pulsation légère

		// Appliquer le mouvement au halo
		gl_FragColor = vec4(haloColor * alpha * pulse, alpha);
	}
`

// Shader de sommet pour l'atmosphère
shaders.atmosphere.vertexShader = `
	// Variable pour transmettre la normale au shader de fragment
	varying vec3 vNormal;

	void main() {
		// Normalisation et transmission de la normale du vertex
		vNormal = normalize( normalMatrix * normal );

		// Positionnement du vertex avec un léger décalage pour donner l'effet d'atmosphère
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.1 );
	}
`

// Shader de fragment pour l'atmosphère
shaders.atmosphere.fragmentShader = `
	// Variable interpolée depuis le shader de sommet
	varying vec3 vNormal;
	// Uniforme pour le temps, permettant des effets d'animation
	uniform float time;

	void main() {
		// Calcul de l'intensité pour un effet de halo atmosphérique
		float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 0.2)), 9.0);
		intensity = max(0.0, intensity);

		// Ajout d'un effet de vagues pour simuler un mouvement dynamique
		float waveEffect = 0.15 * sin(gl_FragCoord.x * 0.1 + (gl_FragCoord.y + time * 2.0) * 0.1);
		
		// Initialisation de la couleur de base de l'atmosphère
		vec4 color;
		if (intensity < 0.5) {
			// Couleur bleu ciel clair accentuée par un effet de vagues
			color = mix(vec4(0.6 + waveEffect, 0.9, 1.0, 1.0), vec4(0.8, 0.8, 4.5, 5.8), intensity * 2.0);
		} else {
			// Dégradé vers le blanc pur pour les intensités plus élevées
			color = mix(vec4(0.8, 0.8, 0.8, 1.0), vec4(1.0, 1.0, 1.0, 1.0), (intensity - 0.5) * 2.0);
		}

		// Application de l'intensité calculée à la couleur
		color *= intensity;

		// Ajustement de la transparence pour un fondu
		color.a = 1.0 - smoothstep(0.0, 0.5, intensity);

		gl_FragColor = color;
	}
`

// Shader de sommet pour les points (dots) sur le globe
shaders.dot.vertexShader = `
	// Attributs spécifiques aux points, incluant la taille et la couleur personnalisée
	attribute float size;
	attribute vec3 customColor;
	varying vec3 vColor;

	void main() {
		// Transmission de la couleur personnalisée au shader de fragment
		vColor = customColor;

		// Calcul de la position du point en espace caméra
		vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

		// Ajustement de la taille du point en fonction de la distance de la caméra
		gl_PointSize = size * ( 300.0 / -mvPosition.z );

		// Projection de la position en coordonnées d'écran
		gl_Position = projectionMatrix * mvPosition;
	}
`

// Shader de fragment pour les points (dots) sur le globe
shaders.dot.fragmentShader = `
	// Uniforme pour la couleur de base et la texture du point
	uniform vec3 color;
	uniform sampler2D pointTexture;

	// Couleur interpolée depuis le shader de sommet
	varying vec3 vColor;

	void main() {
		// Combinaison de la couleur de base et de la couleur personnalisée
		gl_FragColor = vec4( color * vColor, 1.0 );

		// Application de la texture du point pour donner un effet réaliste
		gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

		// Test alpha pour éliminer les fragments transparents indésirables
		if ( gl_FragColor.a < ALPHATEST ) discard;
	}
`

// Shader de sommet pour les nuages (clouds) sur le globe
shaders.clouds.vertexShader = `
	varying vec2 vUv;
	uniform float time;

	void main() {
		// Récupérer la position du vertex dans l'espace du modèle
		vec4 modelPosition = modelMatrix * vec4(position, 1.0);

		// Animation des nuages : Appliquer un mouvement de rotation autour du globe
		float angle = time * 0.02; // Vitesse de rotation
		mat4 rotationMatrix = mat4(
			vec4(cos(angle), 0.0, sin(angle), 0.0),
			vec4(0.0, 1.0, 0.0, 0.0),
			vec4(-sin(angle), 0.0, cos(angle), 0.0),
			vec4(0.0, 0.0, 0.0, 1.0)
		);

		// Appliquer la rotation sur la position
		modelPosition = rotationMatrix * modelPosition;

		// Passer les coordonnées UV au fragment shader
		vUv = uv;

		// Calculer la position finale en espace du monde
		vec4 worldPosition = modelMatrix * vec4(position, 1.0);

		// Calculer la position finale dans l'espace de la caméra
		vec4 viewPosition = viewMatrix * worldPosition;

		// Finalement, appliquer la projection pour obtenir les coordonnées écran
		gl_Position = projectionMatrix * viewPosition;
	}
`

// Shader de fragment pour les nuages (clouds) sur le globe
shaders.clouds.fragmentShader = `
	uniform sampler2D cloudTexture;
	varying vec2 vUv;

	void main() {
		// Appliquer un mouvement aux nuages en décalant les coordonnées UV
		vec2 uvOffset = vUv + vec2(0.1 * sin(vUv.y * 10.0), 0.1 * cos(vUv.x * 10.0)); // Mouvement sinusoïdal

		// Appliquer la texture des nuages
		vec4 cloudColor = texture2D(cloudTexture, uvOffset);

		// Contrôler l'opacité des nuages
		gl_FragColor = vec4(cloudColor.rgb, cloudColor.a * 0.1); // Faible opacité pour les nuages
	}
`