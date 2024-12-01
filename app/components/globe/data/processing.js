// app/components/globe/data/processing.js

// Select countries
export const SouthAmerica = [
    'Ecuador',
    'Colombia',
    'Paraguay',
    'Uruguay',
    'Guyana',
    'Venezuela, RB',
    'Peru',
    'Panama',
    'Cuba'
];

export const NorthAmerica = [
    'Mexico',
    'United States',
    'Greenland',
    'Iceland',
    'Canada'
]

export const Europe = [
    'Norway',
    'Greece',
    'Serbia',
    'Croatia',
    'Spain',
    'Portugal',
    'Germany',
    'Italy',
    'Ukraine',
    'Denmark',
    'Romania',
    'France'
]

export const Africa = [
    'Chad',
    'Nigeria',
    'Namibia',
    'Zambia',
    'South Sudan',
    'Somalia',
    'Uganda',
    'Kenya',
    'Malawi',
    'Comoros',
    'Madagascar',
    'Ethiopia',
    'Yemen, Rep.',
    'Sudan'
];

export const Asia = [
    'Pakistan',
    'India',
    'Nepal',
    'Kazakhstan',
    'Maldives',
    'Sri Lanka',
    'Mongolia',
    'Thailand',
    'Lao PDR',
    'Cambodia',
    'Vietnam',
    'Singapore',
    'Indonesia',
    'Japan',
    'China',
    'Malaysia',
    'Russia',
    'South Korea'
]

export const Rest = [
    'New Caledonia',
    'New Zealand',
    'Tonga',
    'Fiji',
    'Nauru',
    'Solomon Islands',
    'Kiribati',
    'Tuvalu',
    'Antarctica'
]

export const selected = [
    ...Asia,
    ...Africa,
    ...Europe,
    ...NorthAmerica,
    ...SouthAmerica,
    ...Rest
]


export function selectCountries(list, countries) {
    return list.map(name => {
        const country = countries.find(c => c.name === name);
        const { latitude, longitude } = country;
        return { name, latitude, longitude };
    })
}


// Connections
export const connections = {
    'Colombia': ['Ecuador', 'Cuba', 'Mexico', 'Peru', 'Venezuela, RB', 'Guyana', 'United States'],
    'South Sudan': ['Nigeria', 'Sudan', 'Kenya', 'Uganda', 'Zambia', 'Malawi', 'Ethiopia', 'Somalia', 'Madagascar', 'Yemen, Rep.'],
    'India': ['Pakistan', 'Kazakhstan', 'Maldives', 'Sri Lanka', 'Vietnam', 'Thailand'],
    'Thailand': ['Singapore', 'Indonesia', 'Nepal', 'Vietnam', 'Sri Lanka', 'Cambodia', 'Pakistan'],
    'Panama': ['Cuba', 'Mexico', 'Ecuador', 'Colombia', 'Peru', 'Venezuela, RB', 'United States'],
    'Fiji': ['Tuvalu', 'Nauru', 'Kiribati', 'Tonga', 'New Caledonia', 'New Zealand'],
    'France': ["Germany", "Spain", "Italy", "Norway"],
}

export function getCountries(connections, countries) {
    return Object.keys(connections).reduce((result, country) => {
        //console.log(`Processing country: ${country}`);
        //console.log(`Connections for ${country}:`, connections[country]);

        const countryConnections = connections[country].map(connection => {
            let connectionName;
            if (typeof connection === 'string') {
                connectionName = connection;
            } else if (typeof connection === 'object' && connection !== null && connection.name) {
                connectionName = connection.name;
            } else {
                //console.warn(`Expected a string or object with a name property, got:`, connection);
                return null;
            }

            const countryDetail = getCountry(connectionName, countries);
            //console.log(`Found connection: ${countryDetail ? countryDetail.name : 'not found'}`);
            return countryDetail;
        });

        //console.log(`Connections processed for ${country}:`, countryConnections);
        result[country] = countryConnections;
        return result;
    }, {});
}

export function getCountry(name, countries) {
    if (typeof name !== 'string') {
        //console.error(`Expected a string for country name, got:`, name);
        return null;
    }

    const normalizedName = name.trim().toLowerCase();
    //console.log(`Searching for country: ${normalizedName}`);
    const foundCountry = countries.find(country => country.name.trim().toLowerCase() === normalizedName);
    //console.log(foundCountry ? `Found: ${foundCountry.name}` : 'Not found');
    return foundCountry || null;
}
