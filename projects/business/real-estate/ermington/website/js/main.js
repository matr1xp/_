/**
 * Main JavaScript for Ermington Property Flipping Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Interactive Checklist Functionality
    initializeChecklist();
    
    // Initialize Charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
        initializeCharts();
    }
    
    // Initialize ROI Calculator
    initializeROICalculator();
});

/**
 * Initialize the interactive checklist functionality
 */
function initializeChecklist() {
    const checklistItems = document.querySelectorAll('.checklist-checkbox');
    
    // If no checklist items found, return early
    if (!checklistItems.length) return;
    
    // Load saved checklist state from localStorage
    loadChecklistState();
    
    // Add event listeners to checklist items
    checklistItems.forEach(item => {
        item.addEventListener('change', function() {
            const listItem = this.closest('.checklist-item');
            if (this.checked) {
                listItem.classList.add('completed');
            } else {
                listItem.classList.remove('completed');
            }
            
            // Update section progress if on checklist page
            const section = this.closest('.checklist-section');
            if (section) {
                updateSectionProgress(section);
            }
            
            // Update overall progress if on checklist page
            if (document.getElementById('overall-progress')) {
                updateOverallProgress();
            }
            
            // Save checklist state to localStorage
            saveChecklistState();
        });
    });
    
    // Initialize section counters if on checklist page
    const sections = document.querySelectorAll('.checklist-section');
    if (sections.length) {
        sections.forEach(section => {
            const total = section.querySelectorAll('.checklist-checkbox').length;
            const totalElement = section.querySelector('.section-total');
            if (totalElement) {
                totalElement.textContent = total;
            }
        });
        
        // Update all progress indicators
        updateAllProgress();
    }
}

/**
 * Save the current state of the checklist to localStorage
 */
function saveChecklistState() {
    const checklistItems = document.querySelectorAll('.checklist-checkbox');
    const checklistState = {};
    
    checklistItems.forEach((item, index) => {
        checklistState[item.id || `item-${index}`] = item.checked;
    });
    
    localStorage.setItem('ermingtonChecklistState', JSON.stringify(checklistState));
}

/**
 * Load the saved checklist state from localStorage
 */
function loadChecklistState() {
    const savedState = localStorage.getItem('ermingtonChecklistState');
    
    if (savedState) {
        const checklistState = JSON.parse(savedState);
        const checklistItems = document.querySelectorAll('.checklist-checkbox');
        
        checklistItems.forEach((item, index) => {
            const itemId = item.id || `item-${index}`;
            if (checklistState[itemId]) {
                item.checked = true;
                item.closest('.checklist-item').classList.add('completed');
            }
        });
    }
}

/**
 * Reset the checklist to its initial state
 */
function resetChecklist() {
    const checklistItems = document.querySelectorAll('.checklist-checkbox');
    
    checklistItems.forEach(item => {
        item.checked = false;
        item.closest('.checklist-item').classList.remove('completed');
    });
    
    // Clear saved state
    localStorage.removeItem('ermingtonChecklistState');
    
    // Update all progress indicators if on checklist page
    if (document.getElementById('overall-progress')) {
        updateAllProgress();
    }
}

/**
 * Update progress for a specific section
 */
function updateSectionProgress(section) {
    const total = section.querySelectorAll('.checklist-checkbox').length;
    const completed = section.querySelectorAll('.checklist-checkbox:checked').length;
    
    const completedElement = section.querySelector('.section-completed');
    const totalElement = section.querySelector('.section-total');
    
    if (completedElement) completedElement.textContent = completed;
    if (totalElement) totalElement.textContent = total;
}

/**
 * Update overall progress across all sections
 */
function updateOverallProgress() {
    const total = document.querySelectorAll('.checklist-checkbox').length;
    const completed = document.querySelectorAll('.checklist-checkbox:checked').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const completedElement = document.getElementById('completed-count');
    const totalElement = document.getElementById('total-count');
    const percentageElement = document.getElementById('progress-percentage');
    const progressBar = document.getElementById('overall-progress');
    
    if (completedElement) completedElement.textContent = completed;
    if (totalElement) totalElement.textContent = total;
    if (percentageElement) percentageElement.textContent = percentage + '%';
    if (progressBar) progressBar.style.width = percentage + '%';
}

/**
 * Update all progress indicators
 */
function updateAllProgress() {
    document.querySelectorAll('.checklist-section').forEach(section => {
        updateSectionProgress(section);
    });
    updateOverallProgress();
}

/**
 * Initialize charts using Chart.js
 */
function initializeCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js is not loaded. Charts will not be rendered.');
        return;
    }
    
    // Price Distribution Chart
    const priceDistributionChart = document.getElementById('priceDistributionChart');
    if (priceDistributionChart) {
        const ctx = priceDistributionChart.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['$750k-$1M', '$1M-$1.5M', '$1.5M-$2M', '$2M-$2.5M', '$2.5M+'],
                datasets: [{
                    label: 'Number of Properties',
                    data: [1, 2, 5, 2, 0],
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Properties'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Price Range'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Property Price Distribution in Ermington'
                    }
                }
            }
        });
    }
    
    // Price Trends Chart
    const priceTrendsChart = document.getElementById('priceTrendsChart');
    if (priceTrendsChart) {
        const ctx = priceTrendsChart.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4', '2024 Q1', '2024 Q2'],
                datasets: [{
                    label: 'Median House Price',
                    data: [1850000, 1875000, 1890000, 1905000, 1920000, 1950000],
                    borderColor: 'rgba(52, 152, 219, 1)',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Price (AUD)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Quarter'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Median House Price Trends in Ermington'
                    }
                }
            }
        });
    }
    
    // ROI by Renovation Type Chart
    const roiByRenovationChart = document.getElementById('roiByRenovationChart');
    if (roiByRenovationChart) {
        const ctx = roiByRenovationChart.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Kitchen', 'Bathroom', 'Bedroom Addition', 'Open Plan Living', 'Outdoor Living', 'Façade'],
                datasets: [{
                    label: 'Average ROI (%)',
                    data: [95, 85, 90, 80, 70, 65],
                    backgroundColor: [
                        'rgba(231, 76, 60, 0.7)',
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(46, 204, 113, 0.7)',
                        'rgba(155, 89, 182, 0.7)',
                        'rgba(241, 196, 15, 0.7)',
                        'rgba(52, 73, 94, 0.7)'
                    ],
                    borderColor: [
                        'rgba(231, 76, 60, 1)',
                        'rgba(52, 152, 219, 1)',
                        'rgba(46, 204, 113, 1)',
                        'rgba(155, 89, 182, 1)',
                        'rgba(241, 196, 15, 1)',
                        'rgba(52, 73, 94, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Return on Investment (%)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Average ROI by Renovation Type'
                    }
                }
            }
        });
    }
}

/**
 * Initialize the ROI calculator
 */
function initializeROICalculator() {
    // Check if we're on the business strategy page
    const roiResult = document.getElementById('roi-result');
    if (!roiResult) return;
    
    // Find the calculate button
    const calculateButtons = document.querySelectorAll('[onclick*="calculateROI"]');
    if (calculateButtons.length) {
        // Remove the inline onclick attribute and add proper event listener
        calculateButtons.forEach(button => {
            button.removeAttribute('onclick');
            button.addEventListener('click', calculateROI);
        });
    }
}

/**
 * Calculate estimated ROI based on user inputs
 */
function calculateROI() {
    const purchasePrice = parseFloat(document.getElementById('purchase-price').value) || 0;
    const renovationCost = parseFloat(document.getElementById('renovation-cost').value) || 0;
    const holdingCosts = parseFloat(document.getElementById('holding-costs').value) || 0;
    const estimatedSalePrice = parseFloat(document.getElementById('estimated-sale-price').value) || 0;
    
    const totalInvestment = purchasePrice + renovationCost + holdingCosts;
    const profit = estimatedSalePrice - totalInvestment;
    const roi = (profit / totalInvestment) * 100;
    
    const resultElement = document.getElementById('roi-result');
    if (resultElement) {
        if (isNaN(roi) || !isFinite(roi)) {
            resultElement.textContent = 'Please enter valid numbers in all fields.';
        } else {
            resultElement.innerHTML = `
                <div class="result-item">
                    <strong>Total Investment:</strong> $${totalInvestment.toLocaleString()}
                </div>
                <div class="result-item">
                    <strong>Estimated Profit:</strong> $${profit.toLocaleString()}
                </div>
                <div class="result-item">
                    <strong>Return on Investment:</strong> ${roi.toFixed(2)}%
                </div>
            `;
        }
    }
}

/**
 * Filter properties based on search criteria
 * Note: This function is included for completeness but may not be used in the current website
 */
function filterProperties() {
    const searchInput = document.getElementById('property-search');
    const propertyType = document.getElementById('property-type');
    const priceRange = document.getElementById('price-range');
    const propertyCards = document.querySelectorAll('.property-card');
    
    if (!searchInput || !propertyCards.length) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = propertyType ? propertyType.value : 'all';
    const selectedPrice = priceRange ? priceRange.value : 'all';
    
    propertyCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const type = card.dataset.type;
        const price = parseInt(card.dataset.price);
        
        let typeMatch = selectedType === 'all' || type === selectedType;
        let priceMatch = true;
        
        if (selectedPrice !== 'all') {
            const [min, max] = selectedPrice.split('-').map(Number);
            priceMatch = (price >= min && (!max || price <= max));
        }
        
        const searchMatch = title.includes(searchTerm);
        
        if (typeMatch && priceMatch && searchMatch) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}