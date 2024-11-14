// app/components/globe/data/connections.js
import countriesData from './countries';
import { getCountries } from './processing';

const data = {};

data.connections = {"Colombia":["Ecuador","Cuba","Mexico","Peru","Venezuela, RB","Guyana","United States"],"South Sudan":["Nigeria","Sudan","Kenya","Uganda","Zambia","Malawi","Ethiopia","Somalia","Madagascar","Yemen, Rep."],"India":["Pakistan","Kazakhstan","Maldives","Sri Lanka","Vietnam","Thailand"],"Thailand":["Singapore","Indonesia","Nepal","Vietnam","Sri Lanka","Cambodia","Pakistan"],"Panama":["Cuba","Mexico","Ecuador","Colombia","Peru","Venezuela, RB","United States"],"Fiji":["Tuvalu","Nauru","Kiribati","Tonga","New Caledonia","New Zealand"]}

// Référence aux pays importés depuis countries.js
data.countries = countriesData.countries;

// Appel à getCountries avec les connexions et les pays
data.connections = getCountries(data.connections, data.countries);

export default data;
