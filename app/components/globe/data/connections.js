// app/components/globe/data/connections.js
import countriesData from './countries';
import { getCountries } from './processing';

const data = {};

data.connections = { "Colombia": ["Ecuador", "Cuba", "Mexico", "Peru", "Venezuela, RB", "Guyana", "United States"], "South Sudan": ["Nigeria", "Sudan", "Kenya", "Uganda", "Zambia", "Malawi", "Ethiopia", "Somalia", "Madagascar", "Yemen, Rep."], "India": ["Pakistan", "Kazakhstan", "Maldives", "Sri Lanka", "Vietnam", "Thailand"], "Thailand": ["Singapore", "Indonesia", "Nepal", "Vietnam", "Sri Lanka", "Cambodia", "Pakistan"], "Panama": ["Cuba", "Mexico", "Ecuador", "Colombia", "Peru", "Venezuela, RB", "United States"], "Fiji": ["Tuvalu", "Nauru", "Kiribati", "Tonga", "New Caledonia", "New Zealand"] }

data.countries = countriesData.countries;

//console.log("Initial connections:", data.connections);
data.connections = getCountries(data.connections, data.countries);
//console.log("Processed connections:", data.connections);

export default data;
