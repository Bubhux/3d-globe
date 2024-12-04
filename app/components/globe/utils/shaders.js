// app/components/globe/shaders.js

export const shaders = {
	atmosphere: {},
	globe: {},
	dot: {}
}

// Shader de sommet pour le globe
shaders.globe.vertexShader = `
	// Variables pour les données interpolées envoyées au shader de fragment
	varying vec3 vNormal;
	varying vec2 vUv;

	void main() {
		// Calcul de la position du vertex dans l'espace de projection
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		// Normalisation et transmission de la normale du vertex
		vNormal = normalize( normalMatrix * normal );

		// Transmission des coordonnées UV du vertex
		vUv = uv;
	}
`

// Shader de fragment pour le globe
shaders.globe.fragmentShader = `
	// Uniforme pour la texture du globe
	uniform sampler2D texture;

	// Variables interpolées depuis le shader de sommet
	varying vec3 vNormal;
	varying vec2 vUv;

	void main() {
		// Extraction des couleurs de la texture selon les UV
		vec3 diffuse = texture2D( texture, vUv ).xyz;

		// Calcul de l'intensité pour l'effet atmosphérique en fonction de l'orientation de la normale
		float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );

		// Calcul de la couleur d'atmosphère
		vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );

		// Fusion de la couleur diffuse et de l'atmosphère
		gl_FragColor = vec4( diffuse + atmosphere, 1.0 );
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
