// app/components/globe/utils/config.js
export const config = {
	urls: {
		globeTexture: '/app/components/globe/textures/earth_day.jpg',
		pointTexture: '/app/components/globe/img/disc.png'
	},
	sizes: {
		globe: 200,
		globeDotSize: 1
	},
	scale: {
		points: 0.025,
		markers: 0.025,
		globeScale: 0.1
	},
	rotation: {
		globe: 0.001
	},
	colors: {
		globeDotColor: 'rgb(129,129,129)',
		globeMarkerColor: 'rgb(143, 216, 216)',
		globeMarkerGlow: 'rgb(255, 255, 255)',
		globeLines: 'rgb(182,182,182)',
		globeLinesDots: 'rgb(148, 148, 233)'
	},
	display: {
		points: true,
		map: true,
		lines: true,
		lineDots: true,
		markers: true,
		markerLabel: true,
		markerPoint: true,
		atmosphere: true,
		earthMap: true,
		earthMapClouds: true
	},
	dots: {
		total: 30
	}
};

export const elements = {
	globe: null,
	atmosphere: null,
	globePoints: null,
	lineDots: [],
	markers: [],
	markerLabel: [],
	markerPoint: [],
	lines: [],
	earthMap: null,
	earthMapClouds: null
};

export const textures = {
	markerLabels: []
}

export const groups = {
	map: null,
	main: null,
	globe: null,
	lines: null,
	points: null,
	markers: null,
	atmosphere: null,
	lineDots: null,
	earthMap: null,
	earthMapClouds: null
};

export const countries = {
	interval: 20000,
	selected: null,
	index: 0
};

export const animations = {
	rotateGlobe: true
};