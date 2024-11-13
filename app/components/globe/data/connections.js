// app/components/globe/data/connections.js
import countriesData from './countries';
import { getCountries } from './processing';

const data = {};
data.connections = {
    "Colombia": [
        "Ecuador",
        "Cuba",
        "Mexico",
        "Peru",
        "Venezuela, RB",
        "Guyana",
        "United States"
    ],
    "South Sudan": [
        "Nigeria",
        "Sudan",
        "Kenya",
        "Uganda",
        "Zambia",
        "Malawi",
        "Ethiopia",
        "Somalia",
        "Madagascar",
        "Yemen, Rep."
    ]
};

// Référence aux pays importés depuis countries.js
data.countries = countriesData.countries;

// Appel à getCountries avec les connexions et les pays
data.connections = getCountries(data.connections, data.countries);

export default data;
