/**
 * European Winter Adventure - Travel Itinerary Website
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    initMobileNav();
    
    // Accordion Functionality
    initAccordion();
    
    // Initialize Maps
    initMaps();
    
    // Initialize Weather Widgets
    initWeatherWidgets();
    
    // Initialize Budget Calculator
    initBudgetCalculator();
    
    // Initialize Printable Itinerary
    initPrintableItinerary();
    
    // Add animation on scroll
    initScrollAnimations();
    
    // Add accessibility features
    initAccessibility();
});

/**
 * Initialize Mobile Navigation
 */
function initMobileNav() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Toggle hamburger menu animation
            const bars = document.querySelectorAll('.bar');
            bars.forEach(bar => bar.classList.toggle('active'));
        });
        
        // Close mobile menu when clicking on a link
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navLinks.classList.remove('active');
                
                // Remove active class from hamburger menu
                const bars = document.querySelectorAll('.bar');
                bars.forEach(bar => bar.classList.remove('active'));
            });
        });
    }
}

/**
 * Initialize Accordion Functionality
 */
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Toggle active class on header
            this.classList.toggle('active');
            
            // Toggle content visibility
            const content = this.nextElementSibling;
            if (content.classList.contains('active')) {
                content.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                content.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
    
    // Open first accordion item by default in each section
    const destinations = document.querySelectorAll('.destination');
    destinations.forEach(destination => {
        const firstAccordionHeader = destination.querySelector('.accordion-header');
        const firstAccordionContent = destination.querySelector('.accordion-content');
        
        if (firstAccordionHeader && firstAccordionContent) {
            firstAccordionHeader.classList.add('active');
            firstAccordionContent.classList.add('active');
            firstAccordionContent.style.maxHeight = firstAccordionContent.scrollHeight + 'px';
        }
    });
}

/**
 * Initialize Maps using Leaflet
 */
function initMaps() {
    // Check if Leaflet is available
    if (typeof L !== 'undefined') {
        // Initialize the main interactive map
        initMainMap();
        
        // Initialize city-specific maps
        initCityMap('rome-map', [41.9028, 12.4964], 'Rome', [
            { name: 'Colosseum', coords: [41.8902, 12.4922], description: 'Ancient Roman amphitheater' },
            { name: 'Vatican Museums', coords: [41.9065, 12.4534], description: 'World-renowned art collection' },
            { name: 'Trevi Fountain', coords: [41.9009, 12.4833], description: 'Iconic Baroque fountain' },
            { name: 'Roman Forum', coords: [41.8925, 12.4853], description: 'Ancient city center' },
            { name: 'Pantheon', coords: [41.8986, 12.4769], description: 'Former Roman temple' }
        ]);
        
        initCityMap('paris-map', [48.8566, 2.3522], 'Paris', [
            { name: 'Eiffel Tower', coords: [48.8584, 2.2945], description: 'Iconic landmark' },
            { name: 'Louvre Museum', coords: [48.8606, 2.3376], description: 'World\'s largest art museum' },
            { name: 'Notre-Dame Cathedral', coords: [48.8530, 2.3499], description: 'Medieval Catholic cathedral' },
            { name: 'Montmartre', coords: [48.8867, 2.3431], description: 'Historic arts district' },
            { name: 'Tuileries Garden', coords: [48.8634, 2.3275], description: 'Christmas Market location' }
        ]);
        
        initCityMap('london-map', [51.5074, -0.1278], 'London', [
            { name: 'Tower of London', coords: [51.5081, -0.0759], description: 'Historic castle and fortress' },
            { name: 'Buckingham Palace', coords: [51.5014, -0.1419], description: 'Royal residence' },
            { name: 'Westminster Abbey', coords: [51.4994, -0.1276], description: 'Historic church' },
            { name: 'Hyde Park', coords: [51.5073, -0.1657], description: 'Winter Wonderland location' },
            { name: 'Covent Garden', coords: [51.5117, -0.1240], description: 'Shopping and entertainment' }
        ]);
    } else {
        console.error('Leaflet library not loaded');
    }
}

/**
 * Initialize the main interactive map
 */
function initMainMap() {
    const mapContainer = document.getElementById('interactive-map');
    
    if (mapContainer) {
        // Create the map centered on Europe
        const map = L.map('interactive-map').setView([48.8566, 10.3522], 4);
        
        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);
        
        // Add markers for each city
        const cities = [
            { name: 'Rome', coords: [41.9028, 12.4964], dates: 'December 15-20' },
            { name: 'Paris', coords: [48.8566, 2.3522], dates: 'December 21-26' },
            { name: 'London', coords: [51.5074, -0.1278], dates: 'December 27-31' }
        ];
        
        // Create a custom icon
        const cityIcon = L.icon({
            iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });
        
        // Add markers and connect them with a line
        const pathCoordinates = [];
        
        cities.forEach(city => {
            // Add marker
            L.marker(city.coords, { icon: cityIcon })
                .addTo(map)
                .bindPopup(`<strong>${city.name}</strong><br>${city.dates}`)
                .on('click', function() {
                    // Scroll to the corresponding section when marker is clicked
                    document.getElementById(city.name.toLowerCase()).scrollIntoView({ 
                        behavior: 'smooth' 
                    });
                });
            
            // Add coordinates to path
            pathCoordinates.push(city.coords);
        });
        
        // Draw path between cities
        const path = L.polyline(pathCoordinates, {
            color: '#4E84C4',
            weight: 3,
            opacity: 0.7,
            dashArray: '5, 10'
        }).addTo(map);
        
        // Fit map to show all markers
        map.fitBounds(path.getBounds(), { padding: [50, 50] });
    }
}

/**
 * Initialize city-specific maps
 */
function initCityMap(containerId, centerCoords, cityName, attractions) {
    const mapContainer = document.getElementById(containerId);
    
    if (mapContainer) {
        // Create the map centered on the city
        const map = L.map(containerId).setView(centerCoords, 13);
        
        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);
        
        // Create a custom icon
        const attractionIcon = L.icon({
            iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });
        
        // Add markers for attractions
        attractions.forEach(attraction => {
            L.marker(attraction.coords, { icon: attractionIcon })
                .addTo(map)
                .bindPopup(`<strong>${attraction.name}</strong><br>${attraction.description}`);
        });
    }
}

/**
 * Initialize Weather Widgets using OpenWeatherMap API
 */
function initWeatherWidgets() {
    const cities = [
        { id: 'rome-weather', name: 'Rome', coords: { lat: 41.9028, lon: 12.4964 } },
        { id: 'paris-weather', name: 'Paris', coords: { lat: 48.8566, lon: 2.3522 } },
        { id: 'london-weather', name: 'London', coords: { lat: 51.5074, lon: -0.1278 } }
    ];
    
    cities.forEach(city => {
        const widget = document.getElementById(city.id);
        if (widget) {
            createWeatherWidget(widget, city);
        }
    });
}

/**
 * Create a weather widget for a city
 */
function createWeatherWidget(container, city) {
    // Since we're creating a static website without backend API calls,
    // we'll use the research data to create weather widgets
    
    let weatherHTML = `
        <div class="weather-placeholder">
            <h4>${city.name} Weather in December</h4>
            <div class="weather-info">
    `;
    
    // Add city-specific weather information based on our research
    if (city.name === 'Rome') {
        weatherHTML += `
            <div class="weather-icon">
                <i class="fas fa-cloud-sun"></i>
            </div>
            <p><strong>Temperature Range:</strong> 4°C to 13°C (39°F to 56°F)</p>
            <p><strong>Rainfall:</strong> Average 96.5mm (3.8 inches)</p>
            <p><strong>Daylight:</strong> Approximately 9 hours per day</p>
            <p><strong>What to Expect:</strong> Mild winter temperatures with occasional rain. Overcast about 46% of the time.</p>
        `;
    } else if (city.name === 'Paris') {
        weatherHTML += `
            <div class="weather-icon">
                <i class="fas fa-cloud"></i>
            </div>
            <p><strong>Temperature Range:</strong> 1°C to 12°C (34°F to 53°F)</p>
            <p><strong>Rainfall:</strong> Approximately 52.5 mm (2.1 inches)</p>
            <p><strong>Daylight:</strong> 8.5 to 9 hours per day</p>
            <p><strong>What to Expect:</strong> Cold and predominantly cloudy. Overcast about 73% of the time.</p>
        `;
    } else if (city.name === 'London') {
        weatherHTML += `
            <div class="weather-icon">
                <i class="fas fa-cloud-rain"></i>
            </div>
            <p><strong>Temperature Range:</strong> 4°C to 10°C (39°F to 50°F)</p>
            <p><strong>Rainfall:</strong> 67.9-68 mm average</p>
            <p><strong>Daylight:</strong> 8-9 hours per day</p>
            <p><strong>What to Expect:</strong> Wet and chilly with rare snowfall. Mostly overcast about 72% of the time.</p>
        `;
    }
    
    weatherHTML += `
            </div>
        </div>
    `;
    
    container.innerHTML = weatherHTML;
}

/**
 * Initialize Budget Calculator
 */
function initBudgetCalculator() {
    // Get all the input elements
    const accommodationInputs = document.querySelectorAll('input[name^="rome-accommodation"], input[name^="paris-accommodation"], input[name^="london-accommodation"]');
    const transportInputs = document.querySelectorAll('input[name="rome-paris"], input[name="paris-london"], input[name="local-transport"]');
    const activitiesSlider = document.getElementById('activities-budget');
    const diningSlider = document.getElementById('dining-budget');
    const travelersInput = document.getElementById('travelers');
    const minusBtn = document.querySelector('.minus-btn');
    const plusBtn = document.querySelector('.plus-btn');
    
    // Get all the result elements
    const accommodationCost = document.getElementById('accommodation-cost');
    const transportationCost = document.getElementById('transportation-cost');
    const activitiesCost = document.getElementById('activities-cost');
    const diningCost = document.getElementById('dining-cost');
    const totalCost = document.getElementById('total-cost');
    const perPersonCost = document.getElementById('per-person-cost');
    
    // Base costs for activities and dining per level
    const activityCostPerLevel = 100; // €100 per level
    const diningCostPerLevel = 150; // €150 per level
    
    // Function to calculate and update the budget
    function updateBudget() {
        if (!accommodationCost || !transportationCost || !activitiesCost || !diningCost || !totalCost || !perPersonCost) {
            return;
        }
        
        // Get number of travelers
        const travelers = parseInt(travelersInput.value) || 1;
        
        // Calculate accommodation costs
        let accommodationTotal = 0;
        
        // Rome (5 nights)
        const romeAccommodation = document.querySelector('input[name="rome-accommodation"]:checked');
        if (romeAccommodation) {
            accommodationTotal += parseFloat(romeAccommodation.dataset.price) * 5;
        }
        
        // Paris (5 nights)
        const parisAccommodation = document.querySelector('input[name="paris-accommodation"]:checked');
        if (parisAccommodation) {
            accommodationTotal += parseFloat(parisAccommodation.dataset.price) * 5;
        }
        
        // London (5 nights)
        const londonAccommodation = document.querySelector('input[name="london-accommodation"]:checked');
        if (londonAccommodation) {
            accommodationTotal += parseFloat(londonAccommodation.dataset.price) * 5;
        }
        
        // Multiply by number of travelers (assuming shared rooms for 2 people)
        accommodationTotal = accommodationTotal * Math.ceil(travelers / 2);
        
        // Calculate transportation costs
        let transportationTotal = 0;
        
        // Rome to Paris
        const romeToParis = document.querySelector('input[name="rome-paris"]:checked');
        if (romeToParis) {
            transportationTotal += parseFloat(romeToParis.dataset.price) * travelers;
        }
        
        // Paris to London
        const parisToLondon = document.querySelector('input[name="paris-london"]:checked');
        if (parisToLondon) {
            transportationTotal += parseFloat(parisToLondon.dataset.price) * travelers;
        }
        
        // Local transportation
        const localTransport = document.querySelector('input[name="local-transport"]:checked');
        if (localTransport) {
            transportationTotal += parseFloat(localTransport.dataset.price) * travelers;
        }
        
        // Calculate activities costs based on slider value
        const activitiesLevel = parseInt(activitiesSlider.value);
        const activitiesTotal = activitiesLevel * activityCostPerLevel * travelers;
        
        // Calculate dining costs based on slider value
        const diningLevel = parseInt(diningSlider.value);
        const diningTotal = diningLevel * diningCostPerLevel * travelers;
        
        // Calculate total cost
        const total = accommodationTotal + transportationTotal + activitiesTotal + diningTotal;
        
        // Calculate per person cost
        const perPerson = total / travelers;
        
        // Update the display
        accommodationCost.textContent = `€${accommodationTotal.toLocaleString()}`;
        transportationCost.textContent = `€${transportationTotal.toLocaleString()}`;
        activitiesCost.textContent = `€${activitiesTotal.toLocaleString()}`;
        diningCost.textContent = `€${diningTotal.toLocaleString()}`;
        totalCost.textContent = `€${total.toLocaleString()}`;
        perPersonCost.textContent = `€${perPerson.toLocaleString()}`;
    }
    
    // Add event listeners to all inputs
    if (accommodationInputs) {
        accommodationInputs.forEach(input => {
            input.addEventListener('change', updateBudget);
        });
    }
    
    if (transportInputs) {
        transportInputs.forEach(input => {
            input.addEventListener('change', updateBudget);
        });
    }
    
    if (activitiesSlider) {
        activitiesSlider.addEventListener('input', updateBudget);
    }
    
    if (diningSlider) {
        diningSlider.addEventListener('input', updateBudget);
    }
    
    if (travelersInput) {
        travelersInput.addEventListener('input', updateBudget);
    }
    
    // Add event listeners to plus/minus buttons
    if (minusBtn && travelersInput) {
        minusBtn.addEventListener('click', function() {
            const currentValue = parseInt(travelersInput.value) || 1;
            if (currentValue > 1) {
                travelersInput.value = currentValue - 1;
                updateBudget();
            }
        });
    }
    
    if (plusBtn && travelersInput) {
        plusBtn.addEventListener('click', function() {
            const currentValue = parseInt(travelersInput.value) || 1;
            if (currentValue < 10) {
                travelersInput.value = currentValue + 1;
                updateBudget();
            }
        });
    }
    
    // Initialize the budget calculation
    updateBudget();
}

/**
 * Initialize Printable Itinerary
 */
function initPrintableItinerary() {
    const generatePdfBtn = document.getElementById('generate-pdf');
    const printItineraryBtn = document.getElementById('print-itinerary');
    const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
    
    // Function to update the preview based on selected options
    function updatePreview() {
        const showAccommodation = document.querySelector('input[name="print-accommodation"]').checked;
        const showTransportation = document.querySelector('input[name="print-transportation"]').checked;
        const showActivities = document.querySelector('input[name="print-activities"]').checked;
        const showContacts = document.querySelector('input[name="print-contacts"]').checked;
        const showMaps = document.querySelector('input[name="print-maps"]').checked;
        
        // Get the selected accommodation and transportation options from the budget calculator
        const romeAccommodation = document.querySelector('input[name="rome-accommodation"]:checked');
        const parisAccommodation = document.querySelector('input[name="paris-accommodation"]:checked;');
        const londonAccommodation = document.querySelector('input[name="london-accommodation"]:checked');
        
        const romeToParis = document.querySelector('input[name="rome-paris"]:checked');
        const parisToLondon = document.querySelector('input[name="paris-london"]:checked');
        
        // Update the preview content
        const accommodationSections = document.querySelectorAll('.print-accommodation');
        accommodationSections.forEach(section => {
            section.style.display = showAccommodation ? 'block' : 'none';
        });
        
        const transportationSections = document.querySelectorAll('.print-transportation');
        transportationSections.forEach(section => {
            section.style.display = showTransportation ? 'block' : 'none';
        });
        
        const dailySections = document.querySelectorAll('.print-daily');
        dailySections.forEach(section => {
            section.style.display = showActivities ? 'block' : 'none';
        });
        
        const contactsSection = document.querySelector('.print-section:last-child');
        if (contactsSection) {
            contactsSection.style.display = showContacts ? 'block' : 'none';
        }
        
        // Update accommodation details based on selection
        if (showAccommodation) {
            updateAccommodationDetails();
        }
        
        // Update transportation details based on selection
        if (showTransportation) {
            updateTransportationDetails();
        }
    }
    
    // Function to update accommodation details in the preview
    function updateAccommodationDetails() {
        const romeAccommodation = document.querySelector('input[name="rome-accommodation"]:checked');
        const parisAccommodation = document.querySelector('input[name="paris-accommodation"]:checked');
        const londonAccommodation = document.querySelector('input[name="london-accommodation"]:checked');
        
        const romeAccommodationSection = document.querySelector('.print-section:nth-child(1) .print-accommodation');
        const parisAccommodationSection = document.querySelector('.print-section:nth-child(2) .print-accommodation');
        const londonAccommodationSection = document.querySelector('.print-section:nth-child(3) .print-accommodation');
        
        if (romeAccommodation && romeAccommodationSection) {
            let accommodationType = "Budget Hotel/Hostel";
            if (romeAccommodation.value === "mid") {
                accommodationType = "Mid-range Hotel";
            } else if (romeAccommodation.value === "luxury") {
                accommodationType = "Luxury Hotel";
            }
            
            romeAccommodationSection.innerHTML = `
                <h3>Accommodation</h3>
                <p><strong>Type:</strong> ${accommodationType}</p>
                <p><strong>Price Range:</strong> €${romeAccommodation.dataset.price} per night</p>
                <p><strong>Check-in:</strong> December 15</p>
                <p><strong>Check-out:</strong> December 20</p>
            `;
        }
        
        if (parisAccommodation && parisAccommodationSection) {
            let accommodationType = "Budget Hotel/Hostel";
            if (parisAccommodation.value === "mid") {
                accommodationType = "Mid-range Hotel";
            } else if (parisAccommodation.value === "luxury") {
                accommodationType = "Luxury Hotel";
            }
            
            parisAccommodationSection.innerHTML = `
                <h3>Accommodation</h3>
                <p><strong>Type:</strong> ${accommodationType}</p>
                <p><strong>Price Range:</strong> €${parisAccommodation.dataset.price} per night</p>
                <p><strong>Check-in:</strong> December 21</p>
                <p><strong>Check-out:</strong> December 26</p>
            `;
        }
        
        if (londonAccommodation && londonAccommodationSection) {
            let accommodationType = "Budget Hotel/Hostel";
            if (londonAccommodation.value === "mid") {
                accommodationType = "Mid-range Hotel";
            } else if (londonAccommodation.value === "luxury") {
                accommodationType = "Luxury Hotel";
            }
            
            londonAccommodationSection.innerHTML = `
                <h3>Accommodation</h3>
                <p><strong>Type:</strong> ${accommodationType}</p>
                <p><strong>Price Range:</strong> €${londonAccommodation.dataset.price} per night</p>
                <p><strong>Check-in:</strong> December 27</p>
                <p><strong>Check-out:</strong> December 31</p>
            `;
        }
    }
    
    // Function to update transportation details in the preview
    function updateTransportationDetails() {
        const romeToParis = document.querySelector('input[name="rome-paris"]:checked');
        const parisToLondon = document.querySelector('input[name="paris-london"]:checked');
        
        const romeToParisSection = document.querySelector('.print-section:nth-child(2) .print-transportation');
        const parisToLondonSection = document.querySelector('.print-section:nth-child(3) .print-transportation');
        
        if (romeToParis && romeToParisSection) {
            let transportType = "";
            let details = "";
            
            if (romeToParis.value === "train") {
                transportType = "Train";
                details = "High-speed train service, 10-11 hours journey time";
            } else if (romeToParis.value === "flight") {
                transportType = "Flight";
                details = "Approximately 5 hours 15 minutes including airport procedures";
            } else if (romeToParis.value === "bus") {
                transportType = "Bus";
                details = "FlixBus service, 20+ hours journey time";
            }
            
            romeToParisSection.innerHTML = `
                <h3>Transportation from Rome</h3>
                <p><strong>Mode:</strong> ${transportType}</p>
                <p><strong>Details:</strong> ${details}</p>
                <p><strong>Date:</strong> December 20-21</p>
                <p><strong>Approximate Cost:</strong> €${romeToParis.dataset.price} per person</p>
            `;
        }
        
        if (parisToLondon && parisToLondonSection) {
            let transportType = "";
            let details = "";
            
            if (parisToLondon.value === "eurostar") {
                transportType = "Eurostar Train";
                details = "High-speed train from Paris Gare du Nord to London St. Pancras, 2 hours 20 minutes journey time";
            } else if (parisToLondon.value === "flight") {
                transportType = "Flight";
                details = "Approximately 3-4 hours including airport procedures";
            } else if (parisToLondon.value === "bus") {
                transportType = "Bus";
                details = "FlixBus service, approximately 7 hours journey time";
            }
            
            parisToLondonSection.innerHTML = `
                <h3>Transportation from Paris</h3>
                <p><strong>Mode:</strong> ${transportType}</p>
                <p><strong>Details:</strong> ${details}</p>
                <p><strong>Date:</strong> December 26-27</p>
                <p><strong>Approximate Cost:</strong> €${parisToLondon.dataset.price} per person</p>
            `;
        }
    }
    
    // Function to populate daily itinerary in the preview
    function populateDailyItinerary() {
        const romeDailySection = document.querySelector('.print-section:nth-child(1) .print-daily');
        const parisDailySection = document.querySelector('.print-section:nth-child(2) .print-daily');
        const londonDailySection = document.querySelector('.print-section:nth-child(3) .print-daily');
        
        // Rome daily itinerary
        if (romeDailySection) {
            romeDailySection.innerHTML = `
                <h3>Daily Itinerary</h3>
                <div class="print-day">
                    <h4>Day 1 (Dec 15)</h4>
                    <ul>
                        <li>Arrival at Rome Fiumicino Airport</li>
                        <li>Check-in at accommodation</li>
                        <li>Evening walk around the neighborhood</li>
                    </ul>
                </div>
                <div class="print-day">
                    <h4>Day 2 (Dec 16)</h4>
                    <ul>
                        <li>Morning: Visit the Colosseum and Roman Forum</li>
                        <li>Afternoon: Explore Palatine Hill</li>
                        <li>Evening: Dinner in Trastevere district</li>
                    </ul>
                </div>
                <div class="print-day">
                    <h4>Day 3 (Dec 17)</h4>
                    <ul>
                        <li>Morning: Vatican Museums and Sistine Chapel</li>
                        <li>Afternoon: St. Peter's Basilica</li>
                        <li>Evening: Christmas lights at Piazza Navona</li>
                    </ul>
                </div>
                <div class="print-day">
                    <h4>Day 4 (Dec 18)</h4>
                    <ul>
                        <li>Morning: Trevi Fountain and Spanish Steps</li>
                        <li>Afternoon: Shopping on Via del Corso</li>
                        <li>Evening: Visit Christmas Market at Piazza Navona</li>
                    </ul>
                </div>
                <div class="print-day">
                    <h4>Day 5 (Dec 19)</h4>
                    <ul>
                        <li>Morning: Pantheon and Piazza della Rotonda</li>
                        <li>Afternoon: Borghese Gallery (reservation required)</li>
                        <li>Evening: Farewell dinner in Rome</li>
                    </ul>
                </div>
                <div class="print-day">
                    <h4>Day 6 (Dec 20)</h4>
                    <ul>
                        <li>Morning: Check-out from accommodation</li>
                        <li>Travel to Paris</li>
                    </ul>
                </div>
            `;
        }
        
        // Paris daily itinerary
        if (parisDailySection) {
            parisDailySection.innerHTML = `
                <h3>Daily Itinerary</h3>
                <div class="print-day">
                    <h4>Day 7 (Dec 21)</h4>
                    <ul>
                        <li>Arrival in Paris</li>
                        <li>Check-in at accommodation</li>
                        <li>Evening: Seine River cruise to see Christmas lights</li>
                    </ul>
                </div>
                <div class="print-day">
                    <h4>Day 8 (Dec 22)</h4>
                    <ul>
                        <li>Morning: Eiffel Tower visit</li>
                        <li>Afternoon: Arc de Triomphe and Champs-Élysées</li>
                        <li>Evening: Christmas Market at Tuileries Garden</li>
                    </ul>
                </div>
                <div class="print-day">
                    <h4>Day 9 (Dec 23)</h4>
                    <ul>
                        <li>Morning: Louvre Museum</li>
                        <li>Afternoon: Musée d'Orsay</li>
                        <li>Evening: Dinner in Le Marais district</li>
                    </ul>
                </div>
                <div class="print-day">
                    <h4>Day 10 (Dec 24)</h4>
                    <ul>
                        <li>Morning: Notre-Dame Cathedral exterior</li>
                        <li>Afternoon: Sainte-Chapelle and Conciergerie</li>
                        <li>Evening: Christmas Eve dinner</li>
                    </ul>
                </div>
                <div class="print-day">
                    <h4>Day 11 (Dec 25)</h4>
                    <ul>
                        <li>Morning: Christmas Day - Montmartre and Sacré-Cœur</li>
                        <li>Afternoon: Relaxed walk through Saint-Germain-des-Prés</li>
                        <li>Evening: Christmas dinner</li>
                    </ul>
                </div>
                <div class="print-day">
                    <h4>Day 12 (Dec 26)</h4>
                    <ul>
                        <li>Morning: Check-out from accommodation</li>
                        <li>Travel to London</li>
                    </ul>
                </div>
            `;
        }
        
        // London daily itinerary
        if (londonDailySection) {
            londonDailySection.innerHTML = `
                <h3>Daily Itinerary</h3>
                <div class="print-day">
                    <h4>Day 13 (Dec 27)</h4>
                    <ul>
                        <li>Arrival in London</li>
                        <li>Check-in at accommodation</li>
                        <li>Evening: See Christmas lights on Oxford Street</li>
                    </ul>
                </div>
                <div class="print-day">
                    <h4>Day 14 (Dec 28)</h4>
                    <ul>
                        <li>Morning: Tower of London</li>
                        <li>Afternoon: Tower Bridge and Borough Market</li>
                        <li>Evening: Winter Wonderland in Hyde Park</li>
                    </ul>
                </div>
                <div class="print-day">
                    <h4>Day 15 (Dec 29)</h4>
                    <ul>
                        <li>Morning: British Museum</li>
                        <li>Afternoon: National Gallery</li>
                        <li>Evening: West End show</li>
                    </ul>
                </div>
                <div class="print-day">
                    <h4>Day 16 (Dec 30)</h4>
                    <ul>
                        <li>Morning: Westminster Abbey and Big Ben</li>
                        <li>Afternoon: Buckingham Palace and St. James's Park</li>
                        <li>Evening: Dinner in Covent Garden</li>
                    </ul>
                </div>
                <div class="print-day">
                    <h4>Day 17 (Dec 31)</h4>
                    <ul>
                        <li>Morning: Check-out from accommodation</li>
                        <li>Last-minute shopping at Harrods or Liberty</li>
                        <li>Evening: New Year's Eve celebration (optional)</li>
                        <li>Departure</li>
                    </ul>
                </div>
            `;
        }
    }
    
    // Add event listeners to checkboxes
    if (checkboxes) {
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updatePreview);
        });
    }
    
    // Add event listener to print button
    if (printItineraryBtn) {
        printItineraryBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Add event listener to generate PDF button
    if (generatePdfBtn) {
        generatePdfBtn.addEventListener('click', function() {
            alert('PDF generation would be implemented with a server-side solution. For this demo, please use the Print Directly option.');
        });
    }
    
    // Populate the daily itinerary
    populateDailyItinerary();
    
    // Initialize the preview
    updatePreview();
}

/**
 * Smooth Scrolling for Navigation Links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Calculate header height for offset
            const headerHeight = document.querySelector('.site-header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update active state in navigation
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

/**
 * Update active navigation link on scroll
 */
function initScrollAnimations() {
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('.site-header').offsetHeight;
            
            if (window.pageYOffset >= sectionTop - headerHeight - 100) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
        
        // Add animation to elements when they come into view
        const elements = document.querySelectorAll('.timeline-item, .detail-card, .destination-image, .day-plan, .accommodation-card, .transport-option, .activity-category, .transportation-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    });
}

/**
 * Initialize accessibility features
 */
function initAccessibility() {
    // Add skip to content link
    const header = document.querySelector('.site-header');
    if (header) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to content';
        document.body.insertBefore(skipLink, header);
    }
    
    // Add ARIA labels to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach(element => {
        if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
            if (element.textContent.trim()) {
                element.setAttribute('aria-label', element.textContent.trim());
            }
        }
    });
    
    // Ensure all images have alt text
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach(img => {
        img.alt = 'Travel image';
    });
    
    // Make sure form elements have labels
    const formElements = document.querySelectorAll('input, select, textarea');
    formElements.forEach(element => {
        if (!element.id) {
            const randomId = 'form-element-' + Math.random().toString(36).substr(2, 9);
            element.id = randomId;
        }
        
        if (!document.querySelector(`label[for="${element.id}"]`)) {
            const parentLabel = element.closest('label');
            if (!parentLabel) {
                const label = document.createElement('label');
                label.htmlFor = element.id;
                label.textContent = element.placeholder || element.name || 'Form field';
                element.parentNode.insertBefore(label, element);
            }
        }
    });
}