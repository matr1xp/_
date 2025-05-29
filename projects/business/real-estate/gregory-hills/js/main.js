// main.js - Main JavaScript functionality for Gregory Hills Real Estate Investment Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');
    
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
    
    // Initialize dynamic data elements
    updateDynamicData();
    
    // Initialize tooltips
    initTooltips();
});

// Function to initialize smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Get the header height for offset
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                
                // Calculate the target position with offset
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Function to update dynamic data elements
function updateDynamicData() {
    // Update market data elements
    updateMarketData();
    
    // Update current year in copyright
    updateCopyright();
}

// Function to update market data elements
function updateMarketData() {
    // Get all elements with data-market attribute
    const marketDataElements = document.querySelectorAll('[data-market]');
    
    // Market data values from research
    const marketData = {
        'median-price': '$1,007,500',
        'annual-growth': '8.3%',
        'days-on-market': '27',
        'rental-yield': '3.66%',
        'entry-level': '$885,000',
        'high-end': '$1,320,000',
        'quarterly-growth': '3.86%',
        'properties-sold': '177',
        'rental-price': '$700'
    };
    
    // Update each element with the corresponding data
    marketDataElements.forEach(element => {
        const dataKey = element.getAttribute('data-market');
        if (marketData[dataKey]) {
            element.textContent = marketData[dataKey];
        }
    });
}

// Function to update copyright year
function updateCopyright() {
    const copyrightElements = document.querySelectorAll('.footer-bottom p');
    
    copyrightElements.forEach(element => {
        if (element.textContent.includes('©')) {
            // Keep the current year (2025) as specified in the task
            element.textContent = element.textContent.replace(/\d{4}/, '2025');
        }
    });
}

// Function to initialize tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.getAttribute('data-tooltip');
        
        // Add tooltip to element
        element.appendChild(tooltip);
        
        // Add event listeners
        element.addEventListener('mouseenter', function() {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        });
        
        element.addEventListener('mouseleave', function() {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });
    });
}

// Function to handle form submissions
function handleFormSubmit(event, formId) {
    event.preventDefault();
    
    const form = document.getElementById(formId);
    if (!form) return;
    
    // Get form data
    const formData = new FormData(form);
    const formDataObj = {};
    
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    // Validate form data
    const isValid = validateFormData(formDataObj);
    
    if (isValid) {
        // Show success message
        showFormMessage(form, 'success', 'Form submitted successfully!');
        
        // Reset form
        form.reset();
    } else {
        // Show error message
        showFormMessage(form, 'error', 'Please fill in all required fields correctly.');
    }
}

// Function to validate form data
function validateFormData(data) {
    // Check for required fields
    for (const key in data) {
        if (data[key] === '' && document.querySelector(`[name="${key}"][required]`)) {
            return false;
        }
    }
    
    // Check email format if present
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return false;
    }
    
    return true;
}

// Function to show form message
function showFormMessage(form, type, message) {
    // Remove any existing message
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Add message to form
    form.appendChild(messageElement);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}