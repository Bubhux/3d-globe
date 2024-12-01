// app/components/globe/data/connections.js
import countriesData from './countries';
import { getCountries } from './processing';

const data = {};

data.connections = {
    "France": [
        "United States",
        "China",
        "Paraguay",
        "Malaysia",
        "Chad",
        "Madagascar",
        "Japan",
        "Greenland",
        "Mexico",
        "Antarctica",
        "Caribbean",
        "Canada",
        "South Korea"
    ],
    "United States": [
        "France",
        "China",
        "Paraguay",
        "Malaysia",
        "Chad",
        "Madagascar",
        "Japan",
        "Greenland",
        "Mexico",
        "Antarctica",
        "Caribbean",
        "Canada",
        "South Korea"
    ],
    "China": [
        "France",
        "United States",
        "Paraguay",
        "Malaysia",
        "Chad",
        "Madagascar",
        "Japan",
        "Greenland",
        "Mexico",
        "Antarctica",
        "Caribbean",
        "Canada",
        "South Korea"
    ],
    "Paraguay": [
        "France",
        "United States",
        "China",
        "Malaysia",
        "Chad",
        "Madagascar",
        "Japan",
        "Greenland",
        "Mexico",
        "Antarctica",
        "Caribbean",
        "Canada",
        "South Korea"
    ],
    "Malaysia": [
        "France",
        "United States",
        "China",
        "Paraguay",
        "Chad",
        "Madagascar",
        "Japan",
        "Greenland",
        "Mexico",
        "Antarctica",
        "Caribbean",
        "Canada",
        "South Korea"
    ],
    "Chad": [
        "France",
        "United States",
        "China",
        "Paraguay",
        "Malaysia",
        "Madagascar",
        "Japan",
        "Greenland",
        "Mexico",
        "Antarctica",
        "Caribbean",
        "Canada",
        "South Korea"
    ],
    "Madagascar": [
        "France",
        "United States",
        "China",
        "Paraguay",
        "Malaysia",
        "Chad",
        "Japan",
        "Greenland",
        "Mexico",
        "Antarctica",
        "Caribbean",
        "Canada",
        "South Korea"
    ],
    "Japan": [
        "France",
        "United States",
        "China",
        "Paraguay",
        "Malaysia",
        "Chad",
        "Madagascar",
        "Greenland",
        "Mexico",
        "Antarctica",
        "Caribbean",
        "Canada",
        "South Korea"
    ],
    "Greenland": [
        "France",
        "United States",
        "China",
        "Paraguay",
        "Malaysia",
        "Chad",
        "Madagascar",
        "Japan",
        "Mexico",
        "Antarctica",
        "Caribbean",
        "Canada",
        "South Korea"
    ],
    "Mexico": [
        "France",
        "United States",
        "China",
        "Paraguay",
        "Malaysia",
        "Chad",
        "Madagascar",
        "Japan",
        "Greenland",
        "Antarctica",
        "Caribbean",
        "Canada",
        "South Korea"
    ],
    "Antarctica": [
        "France",
        "United States",
        "China",
        "Paraguay",
        "Malaysia",
        "Chad",
        "Madagascar",
        "Japan",
        "Greenland",
        "Mexico",
        "Caribbean",
        "Canada",
        "South Korea"
    ],
    "Caribbean": [
        "France",
        "United States",
        "China",
        "Paraguay",
        "Malaysia",
        "Chad",
        "Madagascar",
        "Japan",
        "Greenland",
        "Mexico",
        "Antarctica",
        "Canada",
        "South Korea"
    ],
    "Canada": [
        "France",
        "United States",
        "China",
        "Paraguay",
        "Malaysia",
        "Chad",
        "Madagascar",
        "Japan",
        "Greenland",
        "Mexico",
        "Antarctica",
        "Caribbean",
        "South Korea"
    ],
    "South Korea": [
        "France",
        "United States",
        "China",
        "Paraguay",
        "Malaysia",
        "Chad",
        "Madagascar",
        "Japan",
        "Greenland",
        "Mexico",
        "Antarctica",
        "Caribbean",
        "Canada"
    ]
};

data.countries = countriesData.countries;

//console.log("Initial connections:", data.connections);
data.connections = getCountries(data.connections, data.countries);
//console.log("Processed connections:", data.connections);

export default data;
