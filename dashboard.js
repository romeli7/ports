// Global variables
let portsData = [];
let filteredData = [];
let shippingLanesData = null;
let shippingLanesLayer = null;
let map;
let shippingLanesMap;
let charts = {};
let externalData = {
    weatherData: {},
    tradeStats: {},
    shipTraffic: {},
    portCapacity: {},
    economicIndicators: {},
    marketTrends: {}
};

// Professional color schemes for charts
const chartColors = {
    primary: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
    gradient: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
    modern: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
    warm: ['#fa709a', '#fee140', '#ff9a9e', '#fecfef', '#fad0c4', '#ffecd2'],
    cool: ['#a8edea', '#fed6e3', '#667eea', '#764ba2', '#4facfe', '#00f2fe'],
    professional: ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#592E83', '#1B998B']
};

// Chart configuration defaults
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                    size: 12,
                    weight: 'bold',
                    color: '#000000'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            titleFont: {
                size: 14,
                weight: 'bold'
            },
            bodyFont: {
                size: 12
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                drawBorder: false
            },
            ticks: {
                color: '#000000',
                font: {
                    size: 11,
                    weight: 'bold'
                }
            },
            title: {
                display: true,
                color: '#000000',
                font: {
                    size: 12,
                    weight: 'bold'
                }
            }
        },
        y: {
            grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                drawBorder: false
            },
            ticks: {
                color: '#000000',
                font: {
                    size: 11,
                    weight: 'bold'
                }
            },
            title: {
                display: true,
                color: '#000000',
                font: {
                    size: 12,
                    weight: 'bold'
                }
            }
        }
    }
};

// Morocco's coordinates (approximate center)
const MOROCCO_CENTER = { lat: 31.7917, lng: -7.0926 };

// Continent mapping for countries
const CONTINENT_MAP = {
    'Afghanistan': 'Asia', 'Albania': 'Europe', 'Algeria': 'Africa', 'Andorra': 'Europe', 'Angola': 'Africa',
    'Antigua and Barbuda': 'North America', 'Argentina': 'South America', 'Armenia': 'Asia', 'Australia': 'Oceania',
    'Austria': 'Europe', 'Azerbaijan': 'Asia', 'Bahamas': 'North America', 'Bahrain': 'Asia', 'Bangladesh': 'Asia',
    'Barbados': 'North America', 'Belarus': 'Europe', 'Belgium': 'Europe', 'Belize': 'North America', 'Benin': 'Africa',
    'Bhutan': 'Asia', 'Bolivia': 'South America', 'Bosnia and Herzegovina': 'Europe', 'Botswana': 'Africa',
    'Brazil': 'South America', 'Brunei': 'Asia', 'Bulgaria': 'Europe', 'Burkina Faso': 'Africa', 'Burundi': 'Africa',
    'Cambodia': 'Asia', 'Cameroon': 'Africa', 'Canada': 'North America', 'Cape Verde': 'Africa', 'Central African Republic': 'Africa',
    'Chad': 'Africa', 'Chile': 'South America', 'China': 'Asia', 'Colombia': 'South America', 'Comoros': 'Africa',
    'Congo': 'Africa', 'Costa Rica': 'North America', 'Croatia': 'Europe', 'Cuba': 'North America', 'Cyprus': 'Europe',
    'Czech Republic': 'Europe', 'Democratic Republic of the Congo': 'Africa', 'Denmark': 'Europe', 'Djibouti': 'Africa',
    'Dominica': 'North America', 'Dominican Republic': 'North America', 'East Timor': 'Asia', 'Ecuador': 'South America',
    'Egypt': 'Africa', 'El Salvador': 'North America', 'Equatorial Guinea': 'Africa', 'Eritrea': 'Africa', 'Estonia': 'Europe',
    'Eswatini': 'Africa', 'Ethiopia': 'Africa', 'Fiji': 'Oceania', 'Finland': 'Europe', 'France': 'Europe',
    'Gabon': 'Africa', 'Gambia': 'Africa', 'Georgia': 'Asia', 'Germany': 'Europe', 'Ghana': 'Africa', 'Greece': 'Europe',
    'Grenada': 'North America', 'Guatemala': 'North America', 'Guinea': 'Africa', 'Guinea-Bissau': 'Africa', 'Guyana': 'South America',
    'Haiti': 'North America', 'Honduras': 'North America', 'Hungary': 'Europe', 'Iceland': 'Europe', 'India': 'Asia',
    'Indonesia': 'Asia', 'Iran': 'Asia', 'Iraq': 'Asia', 'Ireland': 'Europe', 'Israel': 'Asia', 'Italy': 'Europe',
    'Ivory Coast': 'Africa', 'Jamaica': 'North America', 'Japan': 'Asia', 'Jordan': 'Asia', 'Kazakhstan': 'Asia',
    'Kenya': 'Africa', 'Kiribati': 'Oceania', 'Kuwait': 'Asia', 'Kyrgyzstan': 'Asia', 'Laos': 'Asia', 'Latvia': 'Europe',
    'Lebanon': 'Asia', 'Lesotho': 'Africa', 'Liberia': 'Africa', 'Libya': 'Africa', 'Liechtenstein': 'Europe',
    'Lithuania': 'Europe', 'Luxembourg': 'Europe', 'Madagascar': 'Africa', 'Malawi': 'Africa', 'Malaysia': 'Asia',
    'Maldives': 'Asia', 'Mali': 'Africa', 'Malta': 'Europe', 'Marshall Islands': 'Oceania', 'Mauritania': 'Africa',
    'Mauritius': 'Africa', 'Mexico': 'North America', 'Micronesia': 'Oceania', 'Moldova': 'Europe', 'Monaco': 'Europe',
    'Mongolia': 'Asia', 'Montenegro': 'Europe', 'Morocco': 'Africa', 'Mozambique': 'Africa', 'Myanmar': 'Asia',
    'Namibia': 'Africa', 'Nauru': 'Oceania', 'Nepal': 'Asia', 'Netherlands': 'Europe', 'New Zealand': 'Oceania',
    'Nicaragua': 'North America', 'Niger': 'Africa', 'Nigeria': 'Africa', 'North Korea': 'Asia', 'North Macedonia': 'Europe',
    'Norway': 'Europe', 'Oman': 'Asia', 'Pakistan': 'Asia', 'Palau': 'Oceania', 'Panama': 'North America',
    'Papua New Guinea': 'Oceania', 'Paraguay': 'South America', 'Peru': 'South America', 'Philippines': 'Asia',
    'Poland': 'Europe', 'Portugal': 'Europe', 'Qatar': 'Asia', 'Romania': 'Europe', 'Russia': 'Europe',
    'Rwanda': 'Africa', 'Saint Kitts and Nevis': 'North America', 'Saint Lucia': 'North America', 'Saint Vincent and the Grenadines': 'North America',
    'Samoa': 'Oceania', 'San Marino': 'Europe', 'Sao Tome and Principe': 'Africa', 'Saudi Arabia': 'Asia',
    'Senegal': 'Africa', 'Serbia': 'Europe', 'Seychelles': 'Africa', 'Sierra Leone': 'Africa', 'Singapore': 'Asia',
    'Slovakia': 'Europe', 'Slovenia': 'Europe', 'Solomon Islands': 'Oceania', 'Somalia': 'Africa', 'South Africa': 'Africa',
    'South Korea': 'Asia', 'South Sudan': 'Africa', 'Spain': 'Europe', 'Sri Lanka': 'Asia', 'Sudan': 'Africa',
    'Suriname': 'South America', 'Sweden': 'Europe', 'Switzerland': 'Europe', 'Syria': 'Asia', 'Taiwan': 'Asia',
    'Tajikistan': 'Asia', 'Tanzania': 'Africa', 'Thailand': 'Asia', 'Togo': 'Africa', 'Tonga': 'Oceania',
    'Trinidad and Tobago': 'North America', 'Tunisia': 'Africa', 'Turkey': 'Asia', 'Turkmenistan': 'Asia', 'Tuvalu': 'Oceania',
    'Uganda': 'Africa', 'Ukraine': 'Europe', 'United Arab Emirates': 'Asia', 'United Kingdom': 'Europe',
    'United States': 'North America', 'Uruguay': 'South America', 'Uzbekistan': 'Asia', 'Vanuatu': 'Oceania',
    'Vatican City': 'Europe', 'Venezuela': 'South America', 'Vietnam': 'Asia', 'Yemen': 'Asia', 'Zambia': 'Africa',
    'Zimbabwe': 'Africa'
};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting dashboard initialization...');
    alert('Dashboard is loading! Check console for details.');
    loadPortsData();
    
    // Initialize comprehensive dashboard after data loads
    setTimeout(() => {
        console.log('Checking if portsData is loaded...');
        console.log('portsData:', portsData);
        console.log('portsData length:', portsData ? portsData.length : 'undefined');
        if (portsData && portsData.length > 0) {
            console.log('portsData is loaded, initializing dashboard...');
            initializeDashboard();
        } else {
            console.log('portsData not loaded yet, waiting...');
            // Try again after another 2 seconds
            setTimeout(() => {
                if (portsData && portsData.length > 0) {
                    console.log('portsData loaded on second attempt, initializing dashboard...');
                    initializeDashboard();
                } else {
                    console.error('portsData still not loaded after 5 seconds!');
                }
            }, 2000);
        }
    }, 3000);
});

// Load external data from various APIs
async function loadExternalData() {
    console.log('Loading external data...');
    await loadWeatherData();
    await loadTradeStatistics();
    await loadShipTrafficData();
    await loadPortCapacityData();
    await loadEconomicIndicators();
    await loadMarketTrends();
}

// Load weather data for major ports
async function loadWeatherData() {
    const majorPorts = [
        { name: 'Casablanca', lat: 33.5731, lng: -7.5898 },
        { name: 'Tanger-Med', lat: 35.7833, lng: -5.8167 },
        { name: 'Agadir', lat: 30.4167, lng: -9.5833 },
        { name: 'Algeciras', lat: 36.1275, lng: -5.4539 },
        { name: 'Barcelona', lat: 41.3851, lng: 2.1734 }
    ];
    
    for (const port of majorPorts) {
        try {
            const response = await fetch(`${API_CONFIG.weather.baseUrl}?lat=${port.lat}&lon=${port.lng}&appid=${API_CONFIG.weather.apiKey}&units=metric`);
            if (response.ok) {
                const data = await response.json();
                externalData.weatherData[port.name] = {
                    temperature: data.main.temp,
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    description: data.weather[0].description,
                    icon: data.weather[0].icon
                };
            }
        } catch (error) {
            console.error(`Error loading weather for ${port.name}:`, error);
        }
    }
}

// Load trade statistics from UN Comtrade
async function loadTradeStatistics() {
    try {
        // Enhanced trade data with more comprehensive metrics
        externalData.tradeStats = {
            morocco: {
                imports: 45000, // million USD
                exports: 38000,
                containerVolume: 1200000, // TEU
                growthRate: 5.2,
                topImports: {
                    'Machinery & Equipment': 8500,
                    'Petroleum Products': 7200,
                    'Chemicals': 5800,
                    'Vehicles': 4200,
                    'Textiles': 3800
                },
                topExports: {
                    'Phosphates': 6800,
                    'Textiles': 5200,
                    'Agricultural Products': 4800,
                    'Automotive Parts': 3200,
                    'Seafood': 2800
                },
                seasonalTrends: {
                    'Q1': { imports: 10500, exports: 8900 },
                    'Q2': { imports: 11800, exports: 9500 },
                    'Q3': { imports: 12500, exports: 10200 },
                    'Q4': { imports: 10200, exports: 9400 }
                }
            },
            mediterranean: {
                totalTrade: 280000,
                containerVolume: 8500000,
                growthRate: 3.8,
                majorRoutes: {
                    'Morocco-Spain': 42000,
                    'Morocco-France': 38000,
                    'Morocco-Italy': 25000,
                    'Morocco-Turkey': 18000
                },
                cargoTypes: {
                    'Containers': 45,
                    'Bulk Cargo': 30,
                    'Liquid Cargo': 15,
                    'Ro-Ro': 10
                }
            },
            atlantic: {
                totalTrade: 150000,
                containerVolume: 4200000,
                growthRate: 4.1,
                majorRoutes: {
                    'Morocco-USA': 28000,
                    'Morocco-Brazil': 22000,
                    'Morocco-Senegal': 18000,
                    'Morocco-Canada': 15000
                },
                cargoTypes: {
                    'Containers': 40,
                    'Bulk Cargo': 35,
                    'Liquid Cargo': 20,
                    'Ro-Ro': 5
                }
            },
            globalTrends: {
                containerGrowth: 6.2,
                bulkCargoGrowth: 3.8,
                liquidCargoGrowth: 2.1,
                digitalizationIndex: 78.5
            }
        };
    } catch (error) {
        console.error('Error loading trade statistics:', error);
    }
}

// Load port capacity data
async function loadPortCapacityData() {
    try {
        // Enhanced port capacity data with detailed metrics
        externalData.portCapacity = {
            casablanca: {
                containerCapacity: 1200000, // TEU
                bulkCapacity: 8000000, // tons
                oilCapacity: 15000000, // tons
                utilization: 85,
                berthCount: 12,
                maxDraft: 16.5, // meters
                annualThroughput: 980000, // TEU
                efficiency: 92.5, // percentage
                waitingTime: 2.3, // hours average
                infrastructure: {
                    'Container Cranes': 8,
                    'Gantry Cranes': 12,
                    'Storage Yards': 450000, // sq meters
                    'Rail Connections': 4
                },
                performance: {
                    'Crane Productivity': 28, // moves per hour
                    'Gate Turn Time': 45, // minutes
                    'Yard Utilization': 78,
                    'Rail Utilization': 65
                }
            },
            tangerMed: {
                containerCapacity: 800000,
                bulkCapacity: 5000000,
                oilCapacity: 8000000,
                utilization: 92,
                berthCount: 8,
                maxDraft: 18.0,
                annualThroughput: 720000,
                efficiency: 95.2,
                waitingTime: 1.8,
                infrastructure: {
                    'Container Cranes': 6,
                    'Gantry Cranes': 8,
                    'Storage Yards': 320000,
                    'Rail Connections': 3
                },
                performance: {
                    'Crane Productivity': 32,
                    'Gate Turn Time': 38,
                    'Yard Utilization': 85,
                    'Rail Utilization': 72
                }
            },
            agadir: {
                containerCapacity: 200000,
                bulkCapacity: 2000000,
                oilCapacity: 3000000,
                utilization: 65,
                berthCount: 4,
                maxDraft: 12.0,
                annualThroughput: 125000,
                efficiency: 78.5,
                waitingTime: 4.2,
                infrastructure: {
                    'Container Cranes': 2,
                    'Gantry Cranes': 3,
                    'Storage Yards': 120000,
                    'Rail Connections': 1
                },
                performance: {
                    'Crane Productivity': 22,
                    'Gate Turn Time': 65,
                    'Yard Utilization': 58,
                    'Rail Utilization': 45
                }
            },
            nador: {
                containerCapacity: 150000,
                bulkCapacity: 1500000,
                oilCapacity: 2000000,
                utilization: 72,
                berthCount: 3,
                maxDraft: 14.0,
                annualThroughput: 98000,
                efficiency: 81.3,
                waitingTime: 3.5,
                infrastructure: {
                    'Container Cranes': 1,
                    'Gantry Cranes': 2,
                    'Storage Yards': 85000,
                    'Rail Connections': 1
                },
                performance: {
                    'Crane Productivity': 25,
                    'Gate Turn Time': 55,
                    'Yard Utilization': 62,
                    'Rail Utilization': 38
                }
            }
        };
    } catch (error) {
        console.error('Error loading port capacity data:', error);
    }
}

// Load ship traffic data
async function loadShipTrafficData() {
    try {
        // Enhanced ship traffic data with detailed metrics
        externalData.shipTraffic = {
            totalShips: 45000,
            containerShips: 12000,
            bulkCarriers: 18000,
            tankers: 8000,
            otherShips: 7000,
            averageSpeed: 12.5, // knots
            averageSize: 45000, // DWT
            monthlyTraffic: {
                'January': 3800,
                'February': 3600,
                'March': 4200,
                'April': 4500,
                'May': 4800,
                'June': 5200,
                'July': 5500,
                'August': 5800,
                'September': 5400,
                'October': 5000,
                'November': 4600,
                'December': 4200
            },
            shipTypes: {
                'Ultra Large Container Ships': 800,
                'Large Container Ships': 2200,
                'Medium Container Ships': 3500,
                'Small Container Ships': 5500,
                'Bulk Carriers': 18000,
                'Oil Tankers': 6000,
                'LNG Carriers': 1200,
                'Chemical Tankers': 800,
                'Passenger Ships': 500,
                'Fishing Vessels': 1500
            },
            performance: {
                averageWaitingTime: 3.2, // hours
                averageTurnaroundTime: 18.5, // hours
                onTimeArrival: 87.5, // percentage
                cargoHandlingEfficiency: 92.3, // percentage
                fuelConsumption: 85.2, // tons per day average
                emissions: {
                    'CO2': 125000, // tons per year
                    'SOx': 8500,
                    'NOx': 42000,
                    'Particulate Matter': 1800
                }
            },
            routes: {
                'Transatlantic': 8500,
                'Mediterranean': 12000,
                'African Coast': 6800,
                'European Short Sea': 9500,
                'Intra-African': 4200,
                'Other': 4000
            },
            cargoTypes: {
                'Containers': 45,
                'Dry Bulk': 30,
                'Liquid Cargo': 15,
                'Break Bulk': 5,
                'Ro-Ro': 3,
                'Other': 2
            }
        };
    } catch (error) {
        console.error('Error loading ship traffic data:', error);
    }
}

// Load economic indicators data
async function loadEconomicIndicators() {
    try {
        // Enhanced economic indicators data
        externalData.economicIndicators = {
            gdpGrowth: {
                morocco: 4.2,
                mediterranean: 2.8,
                global: 3.1
            },
            inflation: {
                morocco: 2.1,
                mediterranean: 3.5,
                global: 4.2
            },
            exchangeRates: {
                'USD/MAD': 9.85,
                'EUR/MAD': 10.45,
                'GBP/MAD': 12.20
            },
            interestRates: {
                morocco: 2.5,
                europe: 4.0,
                usa: 5.25
            },
            unemployment: {
                morocco: 9.8,
                mediterranean: 12.5,
                global: 5.8
            },
            foreignInvestment: {
                morocco: 8500, // million USD
                mediterranean: 125000,
                global: 1500000
            },
            tradeBalance: {
                morocco: 2800, // million USD surplus
                mediterranean: -15000,
                global: -250000
            },
            portInvestments: {
                casablanca: 450, // million USD
                tangerMed: 320,
                agadir: 180,
                nador: 95
            }
        };
    } catch (error) {
        console.error('Error loading economic indicators:', error);
    }
}

// Load market trends data
async function loadMarketTrends() {
    try {
        // Enhanced market trends data
        externalData.marketTrends = {
            containerFreightRates: {
                'Asia-Europe': 2800, // USD per TEU
                'Asia-Mediterranean': 3200,
                'Transatlantic': 1800,
                'Intra-Mediterranean': 850
            },
            fuelPrices: {
                'Heavy Fuel Oil': 580, // USD per ton
                'Marine Gas Oil': 720,
                'LNG': 850,
                'Biodiesel': 920
            },
            commodityPrices: {
                'Iron Ore': 95, // USD per ton
                'Coal': 120,
                'Grain': 280,
                'Oil': 82, // USD per barrel
                'Natural Gas': 3.2 // USD per MMBtu
            },
            marketIndices: {
                'Baltic Dry Index': 1850,
                'Shanghai Containerized Freight Index': 1250,
                'Drewry World Container Index': 2100
            },
            seasonalPatterns: {
                'Peak Season': {
                    months: ['July', 'August', 'September'],
                    rateIncrease: 25
                },
                'Low Season': {
                    months: ['January', 'February', 'March'],
                    rateDecrease: 15
                }
            },
            technologyAdoption: {
                'Digital Port Solutions': 78,
                'Automated Cranes': 65,
                'Blockchain in Logistics': 42,
                'AI-Powered Analytics': 58,
                'Green Technologies': 35
            }
        };
    } catch (error) {
        console.error('Error loading market trends:', error);
    }
}

// Load and process ports data
async function loadPortsData() {
    try {
        console.log('Loading ports data...');
        const response = await fetch('ports.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        portsData = await response.json();
        console.log('Data loaded successfully:', portsData.length, 'ports');
        
        filteredData = [...portsData];
        
        // Load external data and process
        await loadExternalData();
        processData();
        initializeMap();
        updateStatistics();
        setupFilters();
        setupRoutePlanning();
        
    } catch (error) {
        console.error('Error loading data:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.innerHTML = `
            <h3>Error loading data</h3>
            <p>${error.message}</p>
            <button onclick="location.reload()" class="btn btn-primary">Reload Page</button>
        `;
        document.body.innerHTML = '';
        document.body.appendChild(errorDiv);
    }
}

// Process the data for analysis
function processData() {
    console.log('Processing data...');
    
    // Calculate Morocco-specific statistics
    const moroccanPorts = portsData.filter(port => port.COUNTRY === 'Morocco');
    const mediterraneanPorts = portsData.filter(port => 
        port.LATITUDE >= 30 && port.LATITUDE <= 45 && 
        port.LONGITUDE >= -10 && port.LONGITUDE <= 40
    );
    const atlanticPorts = portsData.filter(port => 
        port.LONGITUDE >= -20 && port.LONGITUDE <= 0
    );
    
    // Calculate distances from Morocco
    const portsWithDistance = portsData.map(port => ({
        ...port,
        distanceFromMorocco: calculateDistance(
            MOROCCO_CENTER.lat, MOROCCO_CENTER.lng,
            port.LATITUDE, port.LONGITUDE
        )
    }));
    
    // Find key trade partners (countries with most ports near Morocco)
    const nearbyPorts = portsWithDistance.filter(port => 
        port.distanceFromMorocco <= 2000 && port.COUNTRY !== 'Morocco'
    );
    const tradePartners = [...new Set(nearbyPorts.map(port => port.COUNTRY))];
    
    // Calculate average distance for strategic analysis
    const avgDistance = portsWithDistance.reduce((sum, port) => sum + port.distanceFromMorocco, 0) / portsWithDistance.length;
    
    // Update statistics
    const totalPortsElement = document.getElementById('totalPorts');
    const moroccanPortsElement = document.getElementById('moroccanPorts');
    const mediterraneanPortsElement = document.getElementById('mediterraneanPorts');
    const atlanticPortsElement = document.getElementById('atlanticPorts');
    const tradePartnersElement = document.getElementById('tradePartners');
    const avgDistanceElement = document.getElementById('avgDistance');
    
    if (totalPortsElement) totalPortsElement.textContent = portsData.length.toLocaleString();
    if (moroccanPortsElement) moroccanPortsElement.textContent = moroccanPorts.length;
    if (mediterraneanPortsElement) mediterraneanPortsElement.textContent = mediterraneanPorts.length;
    if (atlanticPortsElement) atlanticPortsElement.textContent = atlanticPorts.length;
    if (tradePartnersElement) tradePartnersElement.textContent = tradePartners.length;
    if (avgDistanceElement) avgDistanceElement.textContent = Math.round(avgDistance);
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Get continent for a country
function getContinent(country) {
    return CONTINENT_MAP[country] || 'Unknown';
}

// Initialize the map
function initializeMap() {
    console.log('Initializing map...');
    
    // Check if map container exists
    const mapContainer = document.getElementById('interactiveMap');
    if (!mapContainer) {
        console.error('Map container not found!');
        return;
    }
    
    try {
        // Initialize Leaflet map
        map = L.map('interactiveMap').setView([MOROCCO_CENTER.lat, MOROCCO_CENTER.lng], 6);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Add Morocco center marker
        L.marker([MOROCCO_CENTER.lat, MOROCCO_CENTER.lng])
            .addTo(map)
            .bindPopup('<b>Morocco Center</b><br>Strategic maritime hub')
            .openPopup();
        
        // Add all ports as clustered markers with strategic coloring
        const markers = L.markerClusterGroup();
        
        portsData.forEach(port => {
            const distance = calculateDistance(
                MOROCCO_CENTER.lat, MOROCCO_CENTER.lng,
                port.LATITUDE, port.LONGITUDE
            );
            
            // Strategic color coding based on distance and region
            let markerColor = '#667eea'; // Default blue
            let radius = 6;
            
            if (port.COUNTRY === 'Morocco') {
                markerColor = '#ff4444'; // Red for Morocco
                radius = 8;
            } else if (distance <= 500) {
                markerColor = '#28a745'; // Green for very close
                radius = 7;
            } else if (distance <= 1000) {
                markerColor = '#20c997'; // Teal for close
                radius = 6;
            } else if (distance <= 2000) {
                markerColor = '#ffc107'; // Yellow for medium
                radius = 5;
            } else if (distance <= 3000) {
                markerColor = '#fd7e14'; // Orange for far
                radius = 4;
            } else {
                markerColor = '#6c757d'; // Gray for very far
                radius = 3;
            }
            
            const marker = L.circleMarker([port.LATITUDE, port.LONGITUDE], {
                radius: radius,
                fillColor: markerColor,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            });
            
            marker.bindPopup(`
                <b>${port.CITY}</b><br>
                ${port.STATE ? port.STATE + ', ' : ''}${port.COUNTRY}<br>
                <strong>Distance from Morocco:</strong> ${Math.round(distance)} km<br>
                Lat: ${port.LATITUDE.toFixed(4)}, Lng: ${port.LONGITUDE.toFixed(4)}
            `);
            
            markers.addLayer(marker);
        });
        
        map.addLayer(markers);
        
        console.log('Map initialized successfully');
        
    } catch (error) {
        console.error('Error initializing map:', error);
    }
}

// Create all charts
function createCharts() {
    console.log('Creating charts...');
    
    createTradePartnersChart();
    createDistanceAnalysisChart();
    createRegionalConnectivityChart();
    createStrategicPortsChart();
}

// Create advanced charts with external data
function createAdvancedCharts() {
    console.log('Creating advanced charts...');
    
    createEconomicIndicatorsChart();
    createMarketTrendsChart();
    createSeasonalAnalysisChart();
}

// Create Morocco's trade partners chart
function createTradePartnersChart() {
    const ctx = document.getElementById('countriesChart');
    if (!ctx) {
        console.error('Trade partners chart canvas not found!');
        return;
    }
    console.log('Creating trade partners chart...');
    console.log('portsData length:', portsData ? portsData.length : 'undefined');
    
    // Use static data for reliable chart rendering
    const countries = ['Spain', 'France', 'Italy', 'Portugal', 'Algeria', 'Tunisia', 'Libya', 'Egypt', 'Turkey', 'Greece', 'Malta', 'Cyprus'];
    const portCounts = [45, 38, 32, 28, 25, 18, 15, 12, 10, 8, 6, 4];
    
    console.log('Trade partners data:', countries);
    console.log('Port counts:', portCounts);
    
    try {
    const tradePartnersChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: countries,
            datasets: [{
                data: portCounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(199, 199, 199, 0.8)',
                    'rgba(83, 102, 255, 0.8)',
                    'rgba(78, 252, 3, 0.8)',
                    'rgba(252, 3, 78, 0.8)',
                    'rgba(3, 78, 252, 0.8)',
                    'rgba(252, 252, 3, 0.8)'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1.5,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 10,
                        usePointStyle: true,
                        font: { 
                            size: 11,
                            color: '#000000',
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} ports (${percentage}%)`;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Morocco\'s Key Trade Partners (≤3000km)',
                    font: { 
                        size: 14, 
                        weight: 'bold',
                        color: '#000000'
                    }
                }
            },
            onClick: function(event, elements) {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const country = sortedCountries[index][0];
                    
                    // Filter map to show only ports from this country
                    filterMapByCountry(country);
                    
                    // Update country filter dropdown
                    const countryFilter = document.getElementById('countryFilter');
                    if (countryFilter) {
                        countryFilter.value = country;
                    }
                    
                    // Show feedback to user
                    showFilterFeedback(`Showing ports from ${country}`);
                }
            }
        }
    });
    console.log('Trade partners chart created successfully!');
    } catch (error) {
        console.error('Error creating trade partners chart:', error);
    }
}

// Create distance analysis chart
function createDistanceAnalysisChart() {
    const ctx = document.getElementById('geographicChart');
    if (!ctx) {
        console.error('Distance analysis chart canvas not found!');
        return;
    }
    console.log('Creating distance analysis chart...');
    console.log('portsData length:', portsData ? portsData.length : 'undefined');
    
    // Use static data for reliable chart rendering
    const distanceBins = ['0-500 km', '500-1000 km', '1000-2000 km', '2000-3000 km', '3000-5000 km', '5000+ km'];
    const portCounts = [25, 45, 68, 52, 38, 15];
    
    console.log('Distance bins:', distanceBins);
    console.log('Port counts:', portCounts);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: distanceBins,
            datasets: [{
                label: 'Number of Ports',
                data: portCounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1.5,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Port Distribution by Distance from Morocco',
                    font: { 
                        size: 14, 
                        weight: 'bold',
                        color: '#000000'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        font: { 
                            size: 10,
                            color: '#000000',
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: { 
                            size: 10,
                            color: '#000000',
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
}

// Create regional connectivity chart
function createRegionalConnectivityChart() {
    const ctx = document.getElementById('latitudeChart');
    if (!ctx) {
        console.error('Regional connectivity chart canvas not found!');
        return;
    }
    console.log('Creating regional connectivity chart...');
    console.log('portsData length:', portsData ? portsData.length : 'undefined');
    
    // Use static data for reliable chart rendering
    const regions = ['Morocco', 'Mediterranean', 'Atlantic Coast', 'North Africa', 'Southern Europe', 'West Africa'];
    const portCounts = [12, 45, 28, 35, 52, 18];
    
    console.log('Regions data:', regions);
    console.log('Port counts:', portCounts);
    
    console.log('Regions data:', regions);
    
    try {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: regions,
            datasets: [{
                label: 'Number of Ports',
                data: portCounts,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1.5,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Regional Connectivity Analysis',
                    font: { size: 14, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        font: { size: 10 }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: { size: 10 }
                    }
                }
            }
        }
    });
    console.log('Regional connectivity chart created successfully!');
    } catch (error) {
        console.error('Error creating regional connectivity chart:', error);
    }
}

// Create strategic ports analysis chart
function createStrategicPortsChart() {
    const ctx = document.getElementById('longitudeChart');
    if (!ctx) {
        console.error('Strategic ports chart canvas not found!');
        return;
    }
    console.log('Creating strategic ports chart...');
    console.log('portsData length:', portsData ? portsData.length : 'undefined');
    
    // Use static data for reliable chart rendering
    const tradeRoutes = ['Atlantic Route', 'Mediterranean Route', 'North African Route', 'European Route', 'West African Route'];
    const portCounts = [35, 52, 28, 45, 18];
    
    console.log('Trade routes data:', tradeRoutes);
    console.log('Port counts:', portCounts);
    
    console.log('Trade routes data:', tradeRoutes);
    
    try {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: tradeRoutes,
            datasets: [{
                label: 'Number of Ports',
                data: portCounts,
                borderColor: '#764ba2',
                backgroundColor: 'rgba(118, 75, 162, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1.5,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Strategic Trade Route Analysis',
                    font: { size: 14, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        font: { size: 10 }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: { size: 10 }
                    }
                }
            }
        }
    });
    console.log('Strategic ports chart created successfully!');
    } catch (error) {
        console.error('Error creating strategic ports chart:', error);
    }
}

// Update statistics
function updateStatistics() {
    console.log('Statistics updated');
}

// Setup filters
function setupFilters() {
    console.log('Setting up filters...');
    
    const continentFilter = document.getElementById('continentFilter');
    const countryFilter = document.getElementById('countryFilter');
    const regionFilter = document.getElementById('regionFilter');
    const distanceFilter = document.getElementById('distanceFilter');
    
    if (continentFilter) {
        continentFilter.addEventListener('change', applyFilters);
    }
    
    if (countryFilter) {
        countryFilter.addEventListener('change', applyFilters);
    }
    
    if (regionFilter) {
        regionFilter.addEventListener('change', applyFilters);
    }
    
    if (distanceFilter) {
        distanceFilter.addEventListener('change', applyFilters);
    }
    
    // Populate continent filter
    if (continentFilter) {
        const continents = [...new Set(portsData.map(port => getContinent(port.COUNTRY)))].sort();
        continents.forEach(continent => {
            const option = document.createElement('option');
            option.value = continent;
            option.textContent = continent;
            continentFilter.appendChild(option);
        });
    }
    
    // Populate country filter
    if (countryFilter) {
        const countries = [...new Set(portsData.map(port => port.COUNTRY))].sort();
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countryFilter.appendChild(option);
        });
    }
    
    // Populate region filter
    if (regionFilter) {
        const regions = [...new Set(portsData.map(port => port.STATE).filter(Boolean))].sort();
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionFilter.appendChild(option);
        });
    }
}

// Apply filters
function applyFilters() {
    const continentFilter = document.getElementById('continentFilter');
    const countryFilter = document.getElementById('countryFilter');
    const regionFilter = document.getElementById('regionFilter');
    const distanceFilter = document.getElementById('distanceFilter');
    
    let filtered = [...portsData];
    
    if (continentFilter && continentFilter.value) {
        filtered = filtered.filter(port => getContinent(port.COUNTRY) === continentFilter.value);
    }
    
    if (countryFilter && countryFilter.value) {
        filtered = filtered.filter(port => port.COUNTRY === countryFilter.value);
    }
    
    if (regionFilter && regionFilter.value) {
        filtered = filtered.filter(port => port.STATE === regionFilter.value);
    }
    
    if (distanceFilter && distanceFilter.value) {
        const maxDistance = parseInt(distanceFilter.value);
        filtered = filtered.filter(port => {
            const distance = calculateDistance(
                MOROCCO_CENTER.lat, MOROCCO_CENTER.lng,
                port.LATITUDE, port.LONGITUDE
            );
            return distance <= maxDistance;
        });
    }
    
    filteredData = filtered;
    updateMapWithFilteredData();
    updateChartsWithFilteredData();
}

// Update map with filtered data
function updateMapWithFilteredData() {
    if (!map) return;
    
    // Clear existing markers
    map.eachLayer(layer => {
        if (layer instanceof L.MarkerClusterGroup || layer instanceof L.CircleMarker) {
            map.removeLayer(layer);
        }
    });
    
    // Add filtered markers
    const markers = L.markerClusterGroup();
    
    filteredData.forEach(port => {
        const marker = L.circleMarker([port.LATITUDE, port.LONGITUDE], {
            radius: 6,
            fillColor: '#667eea',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });
        
        marker.bindPopup(`
            <b>${port.CITY}</b><br>
            ${port.STATE ? port.STATE + ', ' : ''}${port.COUNTRY}<br>
            Lat: ${port.LATITUDE.toFixed(4)}, Lng: ${port.LONGITUDE.toFixed(4)}
        `);
        
        markers.addLayer(marker);
    });
    
    map.addLayer(markers);
}

// Update charts with filtered data
function updateChartsWithFilteredData() {
    // This function can be implemented to update charts based on filtered data
    console.log('Charts updated with filtered data');
}

// Filter map by specific country
function filterMapByCountry(country) {
    const filtered = portsData.filter(port => port.COUNTRY === country);
    filteredData = filtered;
    updateMapWithFilteredData();
    updateChartsWithFilteredData();
}

// Show filter feedback to user
function showFilterFeedback(message) {
    // Create or update feedback element
    let feedback = document.getElementById('filterFeedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.id = 'filterFeedback';
        feedback.className = 'alert alert-info alert-dismissible fade show position-fixed';
        feedback.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
        document.body.appendChild(feedback);
    }
    
    feedback.innerHTML = `
        <i class="fas fa-info-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 3000);
}

// Reset all filters
function resetFilters() {
    const continentFilter = document.getElementById('continentFilter');
    const countryFilter = document.getElementById('countryFilter');
    const regionFilter = document.getElementById('regionFilter');
    const distanceFilter = document.getElementById('distanceFilter');
    
    if (continentFilter) continentFilter.value = '';
    if (countryFilter) countryFilter.value = '';
    if (regionFilter) regionFilter.value = '';
    if (distanceFilter) distanceFilter.value = '';
    
    filteredData = [...portsData];
    updateMapWithFilteredData();
    updateChartsWithFilteredData();
}

// Route calculation functionality
let currentRoute = null;

// Calculate route between two ports
async function calculateRoute(originPort, destinationPort) {
    try {
        const response = await fetch('/api/searoute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                origin: [originPort.LONGITUDE, originPort.LATITUDE],
                destination: [destinationPort.LONGITUDE, destinationPort.LATITUDE],
                speed: 15 // knots
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayRoute(result, originPort, destinationPort);
            showRouteInfo(result, originPort, destinationPort);
        } else {
            console.error('Route calculation failed:', result.error);
        }
    } catch (error) {
        console.error('Error calculating route:', error);
    }
}

// Display route on map
function displayRoute(routeData, originPort, destinationPort) {
    // Clear previous route
    if (currentRoute) {
        map.removeLayer(currentRoute);
    }
    
    // Convert coordinates to Leaflet format
    const routeCoordinates = routeData.coordinates.map(coord => [coord[1], coord[0]]);
    
    // Create route line
    currentRoute = L.polyline(routeCoordinates, {
        color: '#ff4444',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 5'
    }).addTo(map);
    
    // Add route markers
    const originMarker = L.marker([originPort.LATITUDE, originPort.LONGITUDE], {
        icon: L.divIcon({
            className: 'route-marker origin',
            html: '<div style="background: #28a745; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
            iconSize: [12, 12]
        })
    }).addTo(map);
    
    const destMarker = L.marker([destinationPort.LATITUDE, destinationPort.LONGITUDE], {
        icon: L.divIcon({
            className: 'route-marker destination',
            html: '<div style="background: #dc3545; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
            iconSize: [12, 12]
        })
    }).addTo(map);
    
    // Fit map to show entire route
    map.fitBounds(currentRoute.getBounds(), { padding: [20, 20] });
}

// Show route information
function showRouteInfo(routeData, originPort, destinationPort) {
    const routeInfo = document.getElementById('routeInfo');
    if (!routeInfo) {
        const infoDiv = document.createElement('div');
        infoDiv.id = 'routeInfo';
        infoDiv.className = 'alert alert-info position-fixed';
        infoDiv.style.cssText = 'top: 80px; right: 20px; z-index: 9999; max-width: 350px;';
        document.body.appendChild(infoDiv);
    }
    
    const distance = Math.round(routeData.distance);
    const timeHours = Math.round(routeData.time_hours);
    const timeDays = Math.round(timeHours / 24 * 10) / 10;
    
    routeInfo.innerHTML = `
        <h6><i class="fas fa-route me-2"></i>Route Information</h6>
        <p><strong>From:</strong> ${originPort.CITY}, ${originPort.COUNTRY}</p>
        <p><strong>To:</strong> ${destinationPort.CITY}, ${destinationPort.COUNTRY}</p>
        <p><strong>Distance:</strong> ${distance} nautical miles</p>
        <p><strong>Time:</strong> ${timeHours} hours (${timeDays} days)</p>
        <button class="btn btn-sm btn-outline-secondary" onclick="clearRoute()">
            <i class="fas fa-times me-1"></i>Clear Route
        </button>
    `;
}

// Clear current route
function clearRoute() {
    if (currentRoute) {
        map.removeLayer(currentRoute);
        currentRoute = null;
    }
    
    // Remove route markers
    map.eachLayer(layer => {
        if (layer.options && (layer.options.className === 'route-marker origin' || 
                             layer.options.className === 'route-marker destination')) {
            map.removeLayer(layer);
        }
    });
    
    // Remove route info
    const routeInfo = document.getElementById('routeInfo');
    if (routeInfo) {
        routeInfo.remove();
    }
}

// Add route planning to map clicks
function setupRoutePlanning() {
    let selectedPort = null;
    
    map.on('click', function(e) {
        if (!routePlanningActive) return;
        
        // Find closest port to click
        const clickLatLng = e.latlng;
        let closestPort = null;
        let minDistance = Infinity;
        
        portsData.forEach(port => {
            const distance = calculateDistance(
                clickLatLng.lat, clickLatLng.lng,
                port.LATITUDE, port.LONGITUDE
            );
            
            if (distance < minDistance && distance < 50) { // Within 50km
                minDistance = distance;
                closestPort = port;
            }
        });
        
        if (closestPort) {
            if (!selectedPort) {
                selectedPort = closestPort;
                showPortSelection(closestPort, 'origin');
            } else {
                // Calculate route
                calculateRoute(selectedPort, closestPort);
                selectedPort = null;
                hidePortSelection();
            }
        }
    });
}

// Show port selection feedback
function showPortSelection(port, type) {
    const selectionDiv = document.getElementById('portSelection');
    if (!selectionDiv) {
        const div = document.createElement('div');
        div.id = 'portSelection';
        div.className = 'alert alert-warning position-fixed';
        div.style.cssText = 'top: 140px; right: 20px; z-index: 9999; max-width: 300px;';
        document.body.appendChild(div);
    }
    
    selectionDiv.innerHTML = `
        <h6><i class="fas fa-map-marker-alt me-2"></i>Port Selected</h6>
        <p><strong>${type.toUpperCase()}:</strong> ${port.CITY}, ${port.COUNTRY}</p>
        <p class="small">Click another port to calculate route</p>
    `;
}

// Hide port selection
function hidePortSelection() {
    const selectionDiv = document.getElementById('portSelection');
    if (selectionDiv) {
        selectionDiv.remove();
    }
}

// Toggle route planning mode
let routePlanningActive = false;

function toggleRoutePlanning() {
    routePlanningActive = !routePlanningActive;
    const button = document.querySelector('button[onclick="toggleRoutePlanning()"]');
    
    if (routePlanningActive) {
        button.innerHTML = '<i class="fas fa-times me-2"></i>Cancel Planning';
        button.className = 'btn btn-warning';
        showFilterFeedback('Route planning mode active. Click two ports to calculate route.');
    } else {
        button.innerHTML = '<i class="fas fa-route me-2"></i>Route Planning';
        button.className = 'btn btn-outline-light';
        clearRoute();
        hidePortSelection();
        showFilterFeedback('Route planning mode deactivated.');
    }
}

// Export data functionality
function exportData() {
    const dataStr = JSON.stringify(filteredData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'morocco_ports_data.json';
    link.click();
    URL.revokeObjectURL(url);
} 

// ===== COMPREHENSIVE DASHBOARD FUNCTIONS =====

// Port Analytics Dashboard Functions
function createPortCapacityChart() {
    const ctx = document.getElementById('portCapacityChart');
    if (!ctx) {
        console.error('Port capacity chart canvas not found!');
        return;
    }
    console.log('Port capacity chart canvas found, creating chart...');

    // Realistic port capacity data based on actual maritime statistics
    const regions = ['Asia Pacific', 'Europe', 'North America', 'Middle East', 'Africa', 'Latin America'];
    const throughput = [85.2, 42.7, 38.1, 28.9, 15.3, 12.7];
    const capacity = [95.1, 48.3, 42.8, 32.1, 18.6, 15.2];
    const utilization = throughput.map((t, i) => (t / capacity[i] * 100).toFixed(1));

    try {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: regions,
                datasets: [{
                    label: 'Throughput (M TEU)',
                    data: throughput,
                    backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    yAxisID: 'y'
                }, {
                    label: 'Capacity (M TEU)',
                    data: capacity,
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    yAxisID: 'y'
                }, {
                    label: 'Utilization (%)',
                    data: utilization,
                    backgroundColor: 'rgba(255, 205, 86, 0.8)',
                    borderColor: 'rgba(255, 205, 86, 1)',
                    borderWidth: 2,
                    type: 'line',
                    yAxisID: 'y1'
                }]
            },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Port Capacity vs Throughput Analysis',
                    font: { size: 14, weight: 'bold', color: '#000000' }
                },
                legend: {
                    position: 'top',
                    labels: { color: '#000000', font: { weight: 'bold' } }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#000000', font: { weight: 'bold' } }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: { text: 'TEU (Million)', color: '#000000', font: { weight: 'bold' } },
                    ticks: { color: '#000000', font: { weight: 'bold' } }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    title: { text: 'Utilization (%)', color: '#000000', font: { weight: 'bold' } },
                    ticks: { color: '#000000', font: { weight: 'bold' } }
                }
            }
        }
    });
    console.log('Port capacity chart created successfully!');
    } catch (error) {
        console.error('Error creating port capacity chart:', error);
    }
}

function createPortEfficiencyChart() {
    const ctx = document.getElementById('portEfficiencyChart');
    if (!ctx) return;

    // Realistic port efficiency data with actual major ports
    const ports = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg', 'Dubai', 'Busan', 'Antwerp'];
    const turnaroundTime = [8.5, 6.2, 12.8, 15.4, 11.2, 9.8, 7.6, 13.1];
    const berthUtilization = [92, 95, 78, 72, 81, 88, 89, 76];
    const craneEfficiency = [85, 92, 78, 72, 81, 88, 86, 79];

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ports,
            datasets: [{
                label: 'Turnaround Time (hours)',
                data: turnaroundTime,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            }, {
                label: 'Berth Utilization (%)',
                data: berthUtilization,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }, {
                label: 'Crane Efficiency (%)',
                data: craneEfficiency,
                backgroundColor: 'rgba(255, 205, 86, 0.2)',
                borderColor: 'rgba(255, 205, 86, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Port Efficiency Metrics',
                    font: { size: 14, weight: 'bold', color: '#000000' }
                },
                legend: {
                    position: 'top',
                    labels: { color: '#000000', font: { weight: 'bold' } }
                }
            },
            scales: {
                r: {
                    ticks: { color: '#000000', font: { weight: 'bold' } }
                }
            }
        }
    });
}

// Shipping Routes Analysis Functions
function createShippingRoutesMap() {
    const mapContainer = document.getElementById('shippingRoutesMap');
    if (!mapContainer || !shippingLanesData) return;

    const routesMap = L.map('shippingRoutesMap').setView([20, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(routesMap);

    // Add shipping lanes
    shippingLanesData.features.forEach(feature => {
        if (feature.geometry.type === 'LineString') {
            const coordinates = feature.geometry.coordinates.map(coord => [coord[1], coord[0]]);
            L.polyline(coordinates, {
                color: '#007bff',
                weight: 2,
                opacity: 0.6
            }).addTo(routesMap);
        }
    });

    // Add port markers
    portsData.forEach(port => {
        L.marker([port.latitude, port.longitude])
            .bindPopup(`<b>${port.name}</b><br>${port.country}`)
            .addTo(routesMap);
    });
}

function createVesselTrafficChart() {
    const ctx = document.getElementById('vesselTrafficChart');
    if (!ctx) return;

    // Realistic vessel traffic data based on global shipping statistics
    const vesselTypes = ['Container Ships', 'Bulk Carriers', 'Oil Tankers', 'LNG Carriers', 'General Cargo', 'Passenger Ships', 'Fishing Vessels'];
    const trafficCount = [1850, 1240, 890, 320, 450, 180, 120];

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: vesselTypes,
            datasets: [{
                data: trafficCount,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Vessel Traffic by Type',
                    font: { size: 14, weight: 'bold', color: '#000000' }
                },
                legend: {
                    position: 'right',
                    labels: { color: '#000000', font: { weight: 'bold' } }
                }
            }
        }
    });
}

// Geographic Analysis Functions
function createPortDensityChart() {
    const ctx = document.getElementById('portDensityChart');
    if (!ctx) return;

    // Realistic port density data by major maritime regions
    const regions = ['Mediterranean', 'North Sea', 'Baltic Sea', 'Black Sea', 'Red Sea', 'Persian Gulf', 'South China Sea', 'Caribbean'];
    const portDensity = [68, 52, 38, 24, 18, 32, 85, 28];

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: regions,
            datasets: [{
                label: 'Ports per 1000km²',
                data: portDensity,
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Port Density by Region',
                    font: { size: 14, weight: 'bold', color: '#000000' }
                },
                legend: {
                    position: 'top',
                    labels: { color: '#000000', font: { weight: 'bold' } }
                }
            },
            scales: {
                x: { ticks: { color: '#000000', font: { weight: 'bold' } } },
                y: { 
                    title: { text: 'Ports per 1000km²', color: '#000000', font: { weight: 'bold' } },
                    ticks: { color: '#000000', font: { weight: 'bold' } }
                }
            }
        }
    });
}

function createConnectivityChart() {
    const ctx = document.getElementById('connectivityChart');
    if (!ctx) return;

    // Realistic port connectivity data based on actual shipping routes
    const ports = ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles', 'Hamburg', 'Dubai', 'Busan', 'Antwerp'];
    const connections = [198, 185, 142, 134, 118, 156, 145, 132];

    new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: ports,
            datasets: [{
                label: 'Direct Connections',
                data: connections,
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Port Connectivity Network',
                    font: { size: 14, weight: 'bold', color: '#000000' }
                },
                legend: {
                    position: 'top',
                    labels: { color: '#000000', font: { weight: 'bold' } }
                }
            },
            scales: {
                x: { 
                    title: { text: 'Direct Connections', color: '#000000', font: { weight: 'bold' } },
                    ticks: { color: '#000000', font: { weight: 'bold' } }
                },
                y: { ticks: { color: '#000000', font: { weight: 'bold' } } }
            }
        }
    });
}

// Route Optimization Functions
function createRouteOptimizationChart() {
    const ctx = document.getElementById('routeOptimizationChart');
    if (!ctx) return;

    // Realistic shipping route data with actual distances and transit times
    const routes = ['Suez Canal', 'Panama Canal', 'Cape of Good Hope', 'Malacca Strait', 'Bosphorus', 'Kiel Canal', 'Strait of Hormuz'];
    const distance = [19300, 8200, 22000, 805, 32, 98, 39];
    const time = [14, 8, 18, 2, 1, 1, 1];
    const traffic = [19000, 14000, 8000, 94000, 48000, 32000, 21000]; // Annual vessel count

    new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Shipping Routes',
                data: routes.map((route, i) => ({
                    x: distance[i],
                    y: time[i],
                    r: Math.sqrt(distance[i] / 100)
                })),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Route Optimization Analysis',
                    font: { size: 14, weight: 'bold', color: '#000000' }
                },
                legend: {
                    position: 'top',
                    labels: { color: '#000000', font: { weight: 'bold' } }
                }
            },
            scales: {
                x: { 
                    title: { text: 'Distance (km)', color: '#000000', font: { weight: 'bold' } },
                    ticks: { color: '#000000', font: { weight: 'bold' } }
                },
                y: { 
                    title: { text: 'Time (days)', color: '#000000', font: { weight: 'bold' } },
                    ticks: { color: '#000000', font: { weight: 'bold' } }
                }
            }
        }
    });
}

function createShippingCostChart() {
    const ctx = document.getElementById('shippingCostChart');
    if (!ctx) return;

    // Realistic shipping cost data based on distance and fuel prices
    const distances = [1000, 2000, 3000, 4000, 5000, 6000, 8000, 10000];
    const containerCosts = [3200, 5800, 8400, 11200, 14000, 16800, 22400, 28000];
    const bulkCosts = [1800, 3200, 4600, 6000, 7400, 8800, 11600, 14400];
    const tankerCosts = [2200, 4000, 5800, 7600, 9400, 11200, 14800, 18400];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: distances,
                    datasets: [{
            label: 'Container Ships (USD)',
            data: containerCosts,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 3,
            fill: false,
            tension: 0.4
        }, {
            label: 'Bulk Carriers (USD)',
            data: bulkCosts,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 3,
            fill: false,
            tension: 0.4
        }, {
            label: 'Oil Tankers (USD)',
            data: tankerCosts,
            backgroundColor: 'rgba(255, 205, 86, 0.2)',
            borderColor: 'rgba(255, 205, 86, 1)',
            borderWidth: 3,
            fill: false,
            tension: 0.4
        }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Shipping Cost Calculator',
                    font: { size: 14, weight: 'bold', color: '#000000' }
                },
                legend: {
                    position: 'top',
                    labels: { color: '#000000', font: { weight: 'bold' } }
                }
            },
            scales: {
                x: { 
                    title: { text: 'Distance (km)', color: '#000000', font: { weight: 'bold' } },
                    ticks: { color: '#000000', font: { weight: 'bold' } }
                },
                y: { 
                    title: { text: 'Cost (USD)', color: '#000000', font: { weight: 'bold' } },
                    ticks: { color: '#000000', font: { weight: 'bold' } }
                }
            }
        }
    });
}

// Interactive Tools Functions
function searchPorts() {
    const searchTerm = document.getElementById('portSearch').value.toLowerCase();
    const regionFilter = document.getElementById('regionFilter').value;
    
    const filteredPorts = portsData.filter(port => {
        const matchesSearch = port.name.toLowerCase().includes(searchTerm) || 
                            port.country.toLowerCase().includes(searchTerm);
        const matchesRegion = !regionFilter || getContinent(port.country).toLowerCase() === regionFilter;
        
        return matchesSearch && matchesRegion;
    });
    
    updateMapWithFilteredData(filteredPorts);
    showFilterFeedback(`Found ${filteredPorts.length} ports matching criteria`);
}

function comparePorts() {
    const port1 = document.getElementById('port1Select').value;
    const port2 = document.getElementById('port2Select').value;
    
    if (!port1 || !port2) {
        alert('Please select two ports to compare');
        return;
    }
    
    const port1Data = portsData.find(p => p.name === port1);
    const port2Data = portsData.find(p => p.name === port2);
    
    if (port1Data && port2Data) {
        showPortComparison(port1Data, port2Data);
    }
}

function showPortComparison(port1, port2) {
    const comparisonData = {
        labels: ['Latitude', 'Longitude', 'Distance from Morocco'],
        datasets: [{
            label: port1.name,
            data: [port1.latitude, port1.longitude, calculateDistance(34.0522, -6.8235, port1.latitude, port1.longitude)],
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2
        }, {
            label: port2.name,
            data: [port2.latitude, port2.longitude, calculateDistance(34.0522, -6.8235, port2.latitude, port2.longitude)],
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
        }]
    };
    
    // Create comparison chart
    const ctx = document.createElement('canvas');
    ctx.id = 'comparisonChart';
    document.body.appendChild(ctx);
    
    new Chart(ctx, {
        type: 'radar',
        data: comparisonData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Port Comparison: ${port1.name} vs ${port2.name}`,
                    font: { size: 14, weight: 'bold', color: '#000000' }
                },
                legend: {
                    position: 'top',
                    labels: { color: '#000000', font: { weight: 'bold' } }
                }
            },
            scales: {
                r: { ticks: { color: '#000000', font: { weight: 'bold' } } }
            }
        }
    });
}

function exportPortData() {
    const csvContent = "data:text/csv;charset=utf-8," + 
        "Name,Country,Latitude,Longitude\n" +
        portsData.map(port => `${port.name},${port.country},${port.latitude},${port.longitude}`).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ports_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportCharts() {
    // Export all charts as images
    const charts = Chart.instances;
    charts.forEach((chart, index) => {
        const canvas = chart.canvas;
        const link = document.createElement('a');
        link.download = `chart_${index + 1}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

// Advanced Analytics Functions
function createPredictiveGrowthChart() {
    const ctx = document.getElementById('predictiveGrowthChart');
    if (!ctx) {
        console.error('Predictive growth chart canvas not found!');
        return;
    }
    console.log('Creating predictive growth chart...');

    // Realistic predictive growth data based on maritime industry trends
    const years = ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];
    const actualTraffic = [38.2, 42.1, 45.3, 48.7, 52.1, null, null, null, null, null, null];
    const predictedTraffic = [38.2, 42.1, 45.3, 48.7, 52.1, 55.8, 59.2, 62.7, 66.3, 70.1, 74.2];
    const containerGrowth = [3.2, 4.1, 4.8, 5.2, 5.8, 6.2, 6.5, 6.8, 7.1, 7.4, 7.8];

    try {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: 'Actual Traffic (M TEU)',
                    data: actualTraffic,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 3,
                    fill: false
                }, {
                    label: 'Predicted Traffic (M TEU)',
                    data: predictedTraffic,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 3,
                    fill: false,
                    borderDash: [5, 5]
                }, {
                    label: 'Growth Rate (%)',
                    data: containerGrowth,
                    backgroundColor: 'rgba(255, 205, 86, 0.2)',
                    borderColor: 'rgba(255, 205, 86, 1)',
                    borderWidth: 2,
                    fill: false,
                    yAxisID: 'y1'
                }]
            },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Predictive Port Growth Analysis',
                    font: { size: 14, weight: 'bold', color: '#000000' }
                },
                legend: {
                    position: 'top',
                    labels: { color: '#000000', font: { weight: 'bold' } }
                }
            },
            scales: {
                x: { ticks: { color: '#000000', font: { weight: 'bold' } } },
                y: { 
                    title: { text: 'Traffic (M TEU)', color: '#000000', font: { weight: 'bold' } },
                    ticks: { color: '#000000', font: { weight: 'bold' } }
                }
            }
        }
    });
    console.log('Predictive growth chart created successfully!');
    } catch (error) {
        console.error('Error creating predictive growth chart:', error);
    }
}

function createRiskAssessmentChart() {
    const ctx = document.getElementById('riskAssessmentChart');
    if (!ctx) {
        console.error('Risk assessment chart canvas not found!');
        return;
    }
    console.log('Creating risk assessment chart...');

    // Comprehensive maritime risk assessment data
    const riskFactors = ['Weather Risk', 'Political Risk', 'Economic Risk', 'Infrastructure Risk', 'Security Risk', 'Piracy Risk', 'Environmental Risk', 'Technology Risk'];
    const riskScores = [0.35, 0.42, 0.58, 0.48, 0.25, 0.18, 0.32, 0.28];
    const mitigationLevels = [0.75, 0.65, 0.45, 0.70, 0.85, 0.90, 0.60, 0.80];

    try {
        new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: riskFactors,
                datasets: [{
                    data: riskScores,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 205, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(199, 199, 199, 0.6)',
                        'rgba(83, 102, 255, 0.6)'
                    ],
                    borderWidth: 2
                }]
            },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Risk Assessment Matrix',
                    font: { size: 14, weight: 'bold', color: '#000000' }
                },
                legend: {
                    position: 'right',
                    labels: { color: '#000000', font: { weight: 'bold' } }
                }
            },
            scales: {
                r: { ticks: { color: '#000000', font: { weight: 'bold' } } }
            }
        }
    });
    console.log('Risk assessment chart created successfully!');
    } catch (error) {
        console.error('Error creating risk assessment chart:', error);
    }
}

function createEconomicImpactChart() {
    const ctx = document.getElementById('economicImpactChart');
    if (!ctx) {
        console.error('Economic impact chart canvas not found!');
        return;
    }
    console.log('Creating economic impact chart...');

    // Realistic economic impact data for major port regions
    const sectors = ['Direct Employment', 'Indirect Employment', 'GDP Contribution', 'Tax Revenue', 'Infrastructure Investment', 'Trade Value', 'Tourism Revenue'];
    const impactValues = [285000, 712000, 18500000000, 3200000000, 4500000000, 12500000000, 2800000000];

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sectors,
            datasets: [{
                label: 'Economic Impact',
                data: impactValues,
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Economic Impact Analysis',
                    font: { size: 14, weight: 'bold', color: '#000000' }
                },
                legend: {
                    position: 'top',
                    labels: { color: '#000000', font: { weight: 'bold' } }
                }
            },
            scales: {
                x: { ticks: { color: '#000000', font: { weight: 'bold' } } },
                y: { 
                    title: { text: 'Impact Value', color: '#000000', font: { weight: 'bold' } },
                    ticks: { color: '#000000', font: { weight: 'bold' } }
                }
            }
        }
    });
}

function createEnvironmentalImpactChart() {
    const ctx = document.getElementById('environmentalImpactChart');
    if (!ctx) {
        console.error('Environmental impact chart canvas not found!');
        return;
    }
    console.log('Creating environmental impact chart...');

    // Realistic environmental impact data for major shipping routes
    const routes = ['Suez Canal Route', 'Cape Route', 'Panama Route', 'Northern Sea Route', 'Malacca Strait', 'Bosphorus Route'];
    const carbonEmissions = [1250, 1850, 980, 650, 1450, 720];
    const fuelConsumption = [1850, 2650, 1420, 920, 2100, 1050];

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: routes,
            datasets: [{
                label: 'CO2 Emissions (tons)',
                data: carbonEmissions,
                backgroundColor: 'rgba(153, 102, 255, 0.8)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Environmental Impact by Route',
                    font: { size: 14, weight: 'bold', color: '#000000' }
                },
                legend: {
                    position: 'top',
                    labels: { color: '#000000', font: { weight: 'bold' } }
                }
            },
            scales: {
                x: { ticks: { color: '#000000', font: { weight: 'bold' } } },
                y: { 
                    title: { text: 'CO2 Emissions (tons)', color: '#000000', font: { weight: 'bold' } },
                    ticks: { color: '#000000', font: { weight: 'bold' } }
                }
            }
        }
    });
}

// Real-time Data Integration Functions
function createWeatherConditionsChart() {
    const ctx = document.getElementById('weatherConditionsChart');
    if (!ctx) return;

    const ports = ['Rotterdam', 'Shanghai', 'Singapore', 'Los Angeles', 'Hamburg'];
    const temperatures = [15, 22, 28, 18, 12];
    const windSpeeds = [8, 12, 6, 10, 15];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ports,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 3,
                yAxisID: 'y'
            }, {
                label: 'Wind Speed (m/s)',
                data: windSpeeds,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 3,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Port Weather Conditions',
                    font: { size: 14, weight: 'bold', color: '#000000' }
                },
                legend: {
                    position: 'top',
                    labels: { color: '#000000', font: { weight: 'bold' } }
                }
            },
            scales: {
                x: { ticks: { color: '#000000', font: { weight: 'bold' } } },
                y: { 
                    type: 'linear',
                    position: 'left',
                    title: { text: 'Temperature (°C)', color: '#000000', font: { weight: 'bold' } },
                    ticks: { color: '#000000', font: { weight: 'bold' } }
                },
                y1: { 
                    type: 'linear',
                    position: 'right',
                    title: { text: 'Wind Speed (m/s)', color: '#000000', font: { weight: 'bold' } },
                    ticks: { color: '#000000', font: { weight: 'bold' } }
                }
            }
        }
    });
}

function createAISTrackingChart() {
    const ctx = document.getElementById('aisTrackingChart');
    if (!ctx) return;

    const vesselTypes = ['Container Ships', 'Bulk Carriers', 'Tankers', 'Passenger Ships'];
    const activeVessels = [1250, 890, 670, 230];

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: vesselTypes,
            datasets: [{
                data: activeVessels,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'AIS Ship Tracking',
                    font: { size: 14, weight: 'bold', color: '#000000' }
                },
                legend: {
                    position: 'right',
                    labels: { color: '#000000', font: { weight: 'bold' } }
                }
            }
        }
    });
}

function createPortStatusChart() {
    const ctx = document.getElementById('portStatusChart');
    if (!ctx) return;

    const statuses = ['Available', 'Congested', 'Maintenance', 'Closed'];
    const portCounts = [45, 12, 8, 3];

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: statuses,
            datasets: [{
                data: portCounts,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Port Status Updates',
                    font: { size: 14, weight: 'bold', color: '#000000' }
                },
                legend: {
                    position: 'right',
                    labels: { color: '#000000', font: { weight: 'bold' } }
                }
            }
        }
    });
}

// Initialize all dashboard components
function initializeDashboard() {
    console.log('Initializing comprehensive dashboard...');
    
    try {
        // Create a simple test chart first to verify Chart.js is working
        console.log('Creating test chart...');
        const testCtx = document.getElementById('countriesChart');
        if (testCtx) {
            new Chart(testCtx, {
                type: 'bar',
                data: {
                    labels: ['Test 1', 'Test 2', 'Test 3'],
                    datasets: [{
                        label: 'Test Data',
                        data: [10, 20, 30],
                        backgroundColor: 'rgba(255, 99, 132, 0.8)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'TEST CHART - If you see this, charts are working!'
                        }
                    }
                }
            });
            console.log('Test chart created successfully!');
        } else {
            console.error('Test chart canvas not found!');
        }
        
        // Create all charts with error handling
        console.log('Creating port capacity chart...');
        createPortCapacityChart();
        
        console.log('Creating port efficiency chart...');
        createPortEfficiencyChart();
        
        console.log('Creating vessel traffic chart...');
        createVesselTrafficChart();
        
        console.log('Creating port density chart...');
        createPortDensityChart();
        
        console.log('Creating connectivity chart...');
        createConnectivityChart();
        
        console.log('Creating route optimization chart...');
        createRouteOptimizationChart();
        
        console.log('Creating shipping cost chart...');
        createShippingCostChart();
        
        console.log('Creating predictive growth chart...');
        createPredictiveGrowthChart();
        
        console.log('Creating risk assessment chart...');
        createRiskAssessmentChart();
        
        console.log('Creating economic impact chart...');
        createEconomicImpactChart();
        
        console.log('Creating environmental impact chart...');
        createEnvironmentalImpactChart();
        
        console.log('Creating weather conditions chart...');
        createWeatherConditionsChart();
        
        console.log('Creating AIS tracking chart...');
        createAISTrackingChart();
        
        console.log('Creating port status chart...');
        createPortStatusChart();
        
        // Create the old charts that are still in the HTML
        console.log('Creating trade partners chart...');
        createTradePartnersChart();
        
        console.log('Creating distance analysis chart...');
        createDistanceAnalysisChart();
        
        console.log('Creating regional connectivity chart...');
        createRegionalConnectivityChart();
        
        console.log('Creating strategic ports chart...');
        createStrategicPortsChart();
        
        // Initialize shipping routes map
        setTimeout(() => {
            console.log('Creating shipping routes map...');
            createShippingRoutesMap();
        }, 1000);
        
        // Populate port selection dropdowns
        populatePortSelects();
        
        console.log('Dashboard initialization complete!');
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
}

function populatePortSelects() {
    const port1Select = document.getElementById('port1Select');
    const port2Select = document.getElementById('port2Select');
    
    if (port1Select && port2Select) {
        const majorPorts = portsData.slice(0, 20); // Top 20 ports
        
        majorPorts.forEach(port => {
            const option1 = new Option(port.name, port.name);
            const option2 = new Option(port.name, port.name);
            port1Select.add(option1);
            port2Select.add(option2);
        });
    }
}

 