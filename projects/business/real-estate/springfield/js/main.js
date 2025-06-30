/**
 * Springfield Real Estate Investment Guide
 * Main JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (nav && nav.classList.contains('active') && !event.target.closest('nav') && event.target !== mobileMenuBtn) {
            nav.classList.remove('active');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                }
                
                // Scroll to target
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation highlighting
    highlightActiveNavItem();
    window.addEventListener('scroll', debounce(highlightActiveNavItem, 100));
    
    // Initialize charts if they exist on the page
    initializeCharts();
});

/**
 * Highlight the active navigation item based on scroll position
 */
function highlightActiveNavItem() {
    // Get current scroll position
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    
    // Get all sections with IDs
    const sections = document.querySelectorAll('section[id]');
    
    // Find the current section
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - document.querySelector('header').offsetHeight;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSection = '#' + section.id;
        }
    });
    
    // Highlight the corresponding nav item
    document.querySelectorAll('nav a').forEach(navItem => {
        navItem.classList.remove('active');
        if (navItem.getAttribute('href') === currentSection) {
            navItem.classList.add('active');
        }
    });
}

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Initialize charts on the page if Chart.js is available
 */
function initializeCharts() {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.log('Chart.js not loaded, skipping chart initialization');
        return;
    }
    
    // Set default chart options
    Chart.defaults.font.family = "'Open Sans', Arial, sans-serif";
    Chart.defaults.color = '#333';
    
    // Initialize specific charts if their containers exist
    initializePriceTrendsChart();
    initializeRentalYieldChart();
    initializeGrowthRateChart();
    initializePopulationGrowthChart();
    initializeInvestmentScenariosChart();
    initializeNeighborhoodComparisonChart();
}

/**
 * Initialize the property price trends chart
 */
function initializePriceTrendsChart() {
    const chartContainer = document.getElementById('price-trends-chart');
    if (!chartContainer) return;
    
    // In a real application, this data would come from an API or database
    // For this example, we're using the data from our research
    const ctx = chartContainer.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
            datasets: [
                {
                    label: 'Houses',
                    data: [650000, 700000, 750000, 780000, 800000, 823500],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Units',
                    data: [450000, 480000, 510000, 550000, 587500, 615000],
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Springfield Property Price Trends (2020-2025)',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-AU', {
                                    style: 'currency',
                                    currency: 'AUD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    title: {
                        display: true,
                        text: 'Median Price (AUD)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    });
}

/**
 * Initialize the rental yield comparison chart
 */
function initializeRentalYieldChart() {
    const chartContainer = document.getElementById('rental-yield-chart');
    if (!chartContainer) return;
    
    const ctx = chartContainer.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Springfield Houses', 'Springfield Lakes Houses', 'Springfield Lakes Units'],
            datasets: [{
                label: 'Rental Yield (%)',
                data: [4.09, 4.07, 4.52],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(155, 89, 182, 0.7)',
                    'rgba(39, 174, 96, 0.7)'
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(155, 89, 182, 1)',
                    'rgba(39, 174, 96, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Rental Yield Comparison',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 6,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Rental Yield (%)'
                    }
                }
            }
        }
    });
}

/**
 * Initialize the growth rate comparison chart
 */
function initializeGrowthRateChart() {
    const chartContainer = document.getElementById('growth-rate-chart');
    if (!chartContainer) return;
    
    const ctx = chartContainer.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Springfield Houses', 'Springfield Units', 'Queensland Average', 'National Average'],
            datasets: [{
                label: 'Annual Growth Rate (%)',
                data: [6.8, 23.68, 4.5, 4.0],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(39, 174, 96, 0.7)',
                    'rgba(155, 89, 182, 0.7)',
                    'rgba(231, 76, 60, 0.7)'
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(39, 174, 96, 1)',
                    'rgba(155, 89, 182, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Annual Growth Rate Comparison',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Annual Growth Rate (%)'
                    }
                }
            }
        }
    });
}

/**
 * Initialize the population growth chart
 */
function initializePopulationGrowthChart() {
    const chartContainer = document.getElementById('population-growth-chart');
    if (!chartContainer) return;
    
    const ctx = chartContainer.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'Springfield Lakes Population',
                data: [15440, 16795, 18270, 19870, 21600, 23514, 25600, 27142, 27942],
                borderColor: 'rgba(52, 152, 219, 1)',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Springfield Lakes Population Growth',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Population'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    });
}

/**
 * Initialize the investment scenarios chart
 */
function initializeInvestmentScenariosChart() {
    const chartContainer = document.getElementById('investment-scenarios-chart');
    if (!chartContainer) return;
    
    const ctx = chartContainer.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Year 1', 'Year 3', 'Year 5', 'Year 7', 'Year 10'],
            datasets: [
                {
                    label: 'House Investment',
                    data: [823500, 938000, 1068000, 1216000, 1450000],
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Unit Investment',
                    data: [615000, 760000, 940000, 1162000, 1550000],
                    backgroundColor: 'rgba(39, 174, 96, 0.7)',
                    borderColor: 'rgba(39, 174, 96, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Investment Value Projection',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-AU', {
                                    style: 'currency',
                                    currency: 'AUD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    title: {
                        display: true,
                        text: 'Property Value (AUD)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Investment Period'
                    }
                }
            }
        }
    });
}

/**
 * Initialize the neighborhood comparison chart
 */
function initializeNeighborhoodComparisonChart() {
    const chartContainer = document.getElementById('neighborhood-comparison-chart');
    if (!chartContainer) return;
    
    const ctx = chartContainer.getContext('2d');
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Property Value',
                'Rental Yield',
                'Growth Rate',
                'Schools',
                'Transport',
                'Shopping',
                'Parks'
            ],
            datasets: [
                {
                    label: 'Springfield Central',
                    data: [9, 7, 8, 9, 10, 10, 8],
                    fill: true,
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
                },
                {
                    label: 'Springfield Lakes',
                    data: [8, 8, 9, 8, 7, 7, 9],
                    fill: true,
                    backgroundColor: 'rgba(39, 174, 96, 0.2)',
                    borderColor: 'rgba(39, 174, 96, 1)',
                    pointBackgroundColor: 'rgba(39, 174, 96, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(39, 174, 96, 1)'
                },
                {
                    label: 'Springfield Rise',
                    data: [7, 9, 10, 7, 6, 6, 10],
                    fill: true,
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    borderColor: 'rgba(155, 89, 182, 1)',
                    pointBackgroundColor: 'rgba(155, 89, 182, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(155, 89, 182, 1)'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Neighborhood Comparison (Score out of 10)',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 10
                }
            }
        }
    });
}