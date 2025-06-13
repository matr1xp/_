/**
 * Initialize Interactive Map
 */
function initMap() {
    // Check if map container exists
    const mapContainer = document.getElementById('trip-map');
    if (!mapContainer) return;
    
    // Initialize map centered on Europe
    const map = L.map('trip-map').setView([48.8566, 2.3522], 5);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);
    
    // Define locations with their coordinates and colors
    const locations = [
        { name: "London", country: "UK", coords: [51.5074, -0.1278], color: '#c0392b' },
        { name: "Paris", country: "France", coords: [48.8566, 2.3522], color: '#2980b9' },
        { name: "Milan", country: "Italy", coords: [45.4642, 9.1900], color: '#27ae60' },
        { name: "Venice", country: "Italy", coords: [45.4408, 12.3155], color: '#27ae60' },
        { name: "Florence", country: "Italy", coords: [43.7696, 11.2558], color: '#27ae60' },
        { name: "Rome", country: "Italy", coords: [41.9028, 12.4964], color: '#27ae60' }
    ];
    
    // Add markers for each location
    locations.forEach(location => {
        const marker = L.circleMarker(location.coords, {
            radius: 8,
            fillColor: location.color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        
        marker.bindPopup(`<b>${location.name}</b><br>${location.country}`);
    });
    
    // Create route lines between locations
    const routeCoordinates = [
        [51.5074, -0.1278], // London
        [48.8566, 2.3522],  // Paris
        [45.4642, 9.1900],  // Milan
        [45.4408, 12.3155], // Venice
        [43.7696, 11.2558], // Florence
        [41.9028, 12.4964]  // Rome
    ];
    
    const routeLine = L.polyline(routeCoordinates, {
        color: '#3498db',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10',
        lineJoin: 'round'
    }).addTo(map);
    
    // Add attractions as star markers
    const attractions = [
        { name: "British Museum", coords: [51.5194, -0.1269], country: "UK" },
        { name: "London Eye", coords: [51.5033, -0.1195], country: "UK" },
        { name: "Tower of London", coords: [51.5081, -0.0759], country: "UK" },
        { name: "Harry Potter Studio", coords: [51.6905, -0.4192], country: "UK" },
        { name: "Eiffel Tower", coords: [48.8584, 2.2945], country: "France" },
        { name: "Louvre Museum", coords: [48.8606, 2.3376], country: "France" },
        { name: "Notre-Dame Cathedral", coords: [48.8530, 2.3499], country: "France" },
        { name: "Arc de Triomphe", coords: [48.8738, 2.2950], country: "France" },
        { name: "Disneyland Paris", coords: [48.8722, 2.7758], country: "France" },
        { name: "Milan Cathedral", coords: [45.4641, 9.1919], country: "Italy" },
        { name: "St. Mark's Square", coords: [45.4341, 12.3388], country: "Italy" },
        { name: "Florence Duomo", coords: [43.7731, 11.2566], country: "Italy" },
        { name: "Colosseum", coords: [41.8902, 12.4922], country: "Italy" },
        { name: "Trevi Fountain", coords: [41.9009, 12.4833], country: "Italy" }
    ];
    
    attractions.forEach(attraction => {
        let color;
        if (attraction.country === "UK") color = '#c0392b';
        else if (attraction.country === "France") color = '#2980b9';
        else color = '#27ae60';
        
        const marker = L.marker(attraction.coords, {
            icon: L.divIcon({
                html: `<i class="fas fa-star" style="color: ${color};"></i>`,
                className: 'attraction-marker',
                iconSize: [20, 20]
            })
        }).addTo(map);
        
        marker.bindPopup(`<b>${attraction.name}</b><br>${attraction.country}`);
    });
    
    // Fit map bounds to show all locations
    map.fitBounds(routeCoordinates);
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMap();
});