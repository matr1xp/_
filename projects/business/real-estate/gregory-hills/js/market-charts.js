// market-charts.js - Visualizations for Gregory Hills real estate market data

// Function to load the market data from JSON file
async function loadMarketData() {
    try {
        // Fix the path to point to the research directory
        const response = await fetch('/research/market_data.json');
        if (!response.ok) {
            // Fallback to relative path if the first attempt fails
            const fallbackResponse = await fetch('../research/market_data.json');
            if (!fallbackResponse.ok) {
                throw new Error('Failed to load market data');
            }
            return await fallbackResponse.json();
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading market data:', error);
        // If we can't load the data, use hardcoded data as fallback
        return getHardcodedMarketData();
    }
}

// Function to provide hardcoded market data as fallback
function getHardcodedMarketData() {
    return {
        "price_trends": {
            "historical": [
                {"year": "2023", "quarter": "Q1", "median_price": 930000},
                {"year": "2023", "quarter": "Q2", "median_price": 945000},
                {"year": "2023", "quarter": "Q3", "median_price": 960000},
                {"year": "2023", "quarter": "Q4", "median_price": 975000},
                {"year": "2024", "quarter": "Q1", "median_price": 990000},
                {"year": "2024", "quarter": "Q2", "median_price": 1007500},
                {"year": "2025", "quarter": "Q1", "median_price": 1010000}
            ],
            "projected": [
                {"year": "2025", "quarter": "Q2", "median_price": 1030000},
                {"year": "2025", "quarter": "Q3", "median_price": 1050000},
                {"year": "2025", "quarter": "Q4", "median_price": 1070000},
                {"year": "2026", "quarter": "Q1", "median_price": 1090000}
            ],
            "annual_growth_rate": 8.3,
            "quarterly_growth_rate": 3.86
        },
        "suburb_comparison": {
            "median_house_prices": [
                {"suburb": "Gregory Hills", "price": 1007500, "annual_growth": 8.3},
                {"suburb": "Gledswood Hills", "price": 1323500, "annual_growth": 7.77},
                {"suburb": "Oran Park", "price": 1075000, "annual_growth": 0.47},
                {"suburb": "Harrington Park", "price": 1150000, "annual_growth": 5.2}
            ],
            "days_on_market": [
                {"suburb": "Gregory Hills", "days": 27},
                {"suburb": "Gledswood Hills", "days": 32},
                {"suburb": "Oran Park", "days": 35},
                {"suburb": "Harrington Park", "days": 30}
            ],
            "rental_yield": [
                {"suburb": "Gregory Hills", "yield_percentage": 3.66},
                {"suburb": "Gledswood Hills", "yield_percentage": 3.45},
                {"suburb": "Oran Park", "yield_percentage": 3.52},
                {"suburb": "Harrington Park", "yield_percentage": 3.38}
            ]
        },
        "property_types": {
            "distribution": [
                {"type": "Separate Houses", "percentage": 96.7},
                {"type": "Medium Density", "percentage": 3.2},
                {"type": "Other", "percentage": 0.1}
            ],
            "current_listings": [
                {"type": "Houses", "count": 674},
                {"type": "House and Land Packages", "count": 184},
                {"type": "Apartments", "count": 12},
                {"type": "Other", "count": 2}
            ],
            "bedroom_performance": [
                {"bedrooms": 3, "median_price": 920000, "days_on_market": 25},
                {"bedrooms": 4, "median_price": 1050000, "days_on_market": 22},
                {"bedrooms": 5, "median_price": 1200000, "days_on_market": 30}
            ]
        },
        "demographics": {
            "age_groups": [
                {"age_range": "0-9", "percentage": 22},
                {"age_range": "10-19", "percentage": 12},
                {"age_range": "20-29", "percentage": 15},
                {"age_range": "30-39", "percentage": 25},
                {"age_range": "40-49", "percentage": 15},
                {"age_range": "50-59", "percentage": 7},
                {"age_range": "60+", "percentage": 4}
            ],
            "household_composition": [
                {"type": "Family Households", "percentage": 90.9},
                {"type": "Single-person Households", "percentage": 7.6},
                {"type": "Group Households", "percentage": 1.4}
            ],
            "income_distribution": [
                {"income_range": "$0-$999", "percentage": 5},
                {"income_range": "$1,000-$1,999", "percentage": 20},
                {"income_range": "$2,000-$2,999", "percentage": 40},
                {"income_range": "$3,000+", "percentage": 35}
            ]
        },
        "market_activity": {
            "total_properties": 4991,
            "properties_sold_last_12_months": 177,
            "current_listings": {
                "for_sale": 52,
                "for_rent": 27
            },
            "average_time_to_sell": 27,
            "price_range": {
                "entry_level": 885000,
                "median": 1007500,
                "high_end": 1320000
            }
        },
        "investment_metrics": {
            "rental_data": {
                "median_weekly_rent": 700,
                "rental_yield": 3.66,
                "vacancy_rate": 1.2
            },
            "renovation_potential": {
                "average_renovation_cost": 50000,
                "average_value_add_percentage": 15,
                "recommended_renovation_focus": [
                    "Kitchen modernization",
                    "Bathroom upgrades",
                    "Open plan living conversion",
                    "Outdoor entertainment areas",
                    "Energy efficiency improvements"
                ]
            }
        }
    };
}

// Function to create price trend chart
function createPriceTrendChart(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Extract data for chart
    const historicalData = data.price_trends.historical;
    const projectedData = data.price_trends.projected;
    
    // Prepare labels and datasets
    const labels = [
        ...historicalData.map(item => `${item.quarter} ${item.year}`),
        ...projectedData.map(item => `${item.quarter} ${item.year}`)
    ];
    
    const historicalPrices = historicalData.map(item => item.median_price);
    const projectedPrices = projectedData.map(item => item.median_price);
    
    // Fill historical data with null for projected period
    const historicalDataset = [
        ...historicalPrices,
        ...Array(projectedData.length).fill(null)
    ];
    
    // Fill projected data with null for historical period
    const projectedDataset = [
        ...Array(historicalData.length).fill(null),
        ...projectedPrices
    ];
    
    // Create chart
    const ctx = document.createElement('canvas');
    container.appendChild(ctx);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Historical Median Price',
                    data: historicalDataset,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.1,
                    borderWidth: 2
                },
                {
                    label: 'Projected Median Price',
                    data: projectedDataset,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderDash: [5, 5],
                    tension: 0.1,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Gregory Hills Median House Price Trends'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.raw !== null) {
                                return `$${context.raw.toLocaleString()}`;
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Median Price (AUD)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Function to create suburb comparison chart
function createSuburbComparisonChart(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Extract data for chart
    const suburbData = data.suburb_comparison.median_house_prices;
    
    // Prepare labels and datasets
    const labels = suburbData.map(item => item.suburb);
    const prices = suburbData.map(item => item.price);
    const growthRates = suburbData.map(item => item.annual_growth);
    
    // Create chart
    const ctx = document.createElement('canvas');
    container.appendChild(ctx);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Median House Price',
                    data: prices,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Annual Growth Rate (%)',
                    data: growthRates,
                    type: 'line',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Suburb Comparison - Median House Prices & Growth Rates'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const datasetLabel = context.dataset.label;
                            const value = context.raw;
                            if (datasetLabel.includes('Price')) {
                                return `${datasetLabel}: $${value.toLocaleString()}`;
                            } else {
                                return `${datasetLabel}: ${value.toFixed(2)}%`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Median Price (AUD)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Annual Growth Rate (%)'
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    });
}

// Function to create property type distribution chart
function createPropertyTypeChart(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Extract data for chart
    const propertyTypes = data.property_types.distribution;
    
    // Prepare labels and datasets
    const labels = propertyTypes.map(item => item.type);
    const percentages = propertyTypes.map(item => item.percentage);
    
    // Create chart
    const ctx = document.createElement('canvas');
    container.appendChild(ctx);
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: percentages,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Property Type Distribution in Gregory Hills'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label;
                            const value = context.raw;
                            return `${label}: ${value}%`;
                        }
                    }
                }
            }
        }
    });
}

// Function to create demographic chart
function createDemographicChart(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Extract data for chart
    const ageGroups = data.demographics.age_groups;
    
    // Prepare labels and datasets
    const labels = ageGroups.map(item => item.age_range);
    const percentages = ageGroups.map(item => item.percentage);
    
    // Create chart
    const ctx = document.createElement('canvas');
    container.appendChild(ctx);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Percentage of Population',
                data: percentages,
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Age Demographics in Gregory Hills'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            return `${value}% of population`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Percentage (%)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Initialize all charts when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    const marketData = await loadMarketData();
    if (!marketData) return;
    
    // Create charts if containers exist
    createPriceTrendChart(marketData, 'price-trend-chart');
    createSuburbComparisonChart(marketData, 'suburb-comparison-chart');
    createPropertyTypeChart(marketData, 'property-type-chart');
    createDemographicChart(marketData, 'demographic-chart');
});