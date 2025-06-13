/**
 * European Winter Adventure - Travel Itinerary Website
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initItineraryToggle();
    initTabSystem();
    initGalleryFilters();
    initMap();
    initPrintFunction();
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });
    }
}

/**
 * Itinerary Day Toggle Functionality
 */
function initItineraryToggle() {
    const dayHeaders = document.querySelectorAll('.day-header');
    const expandAllBtn = document.querySelector('.expand-all');
    const collapseAllBtn = document.querySelector('.collapse-all');
    
    // Individual day toggle
    dayHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const toggleBtn = this.querySelector('.toggle-btn');
            
            content.classList.toggle('active');
            toggleBtn.classList.toggle('active');
            
            // Accessibility
            const expanded = content.classList.contains('active');
            toggleBtn.setAttribute('aria-expanded', expanded);
        });
    });
    
    // Expand all functionality
    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', function() {
            const dayContents = document.querySelectorAll('.day-content');
            const toggleBtns = document.querySelectorAll('.toggle-btn');
            
            dayContents.forEach(content => {
                content.classList.add('active');
            });
            
            toggleBtns.forEach(btn => {
                btn.classList.add('active');
                btn.setAttribute('aria-expanded', true);
            });
        });
    }
    
    // Collapse all functionality
    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', function() {
            const dayContents = document.querySelectorAll('.day-content');
            const toggleBtns = document.querySelectorAll('.toggle-btn');
            
            dayContents.forEach(content => {
                content.classList.remove('active');
            });
            
            toggleBtns.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', false);
            });
        });
    }
}

/**
 * Tab System for Practical Information
 */
function initTabSystem() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Add active class to current button and corresponding pane
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Gallery Filter System
 */
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to current button
            this.classList.add('active');
            
            // Filter gallery items
            const filter = this.getAttribute('data-filter');
            filterGalleryItems(filter);
        });
    });
}

/**
 * Filter Gallery Items by Category
 * @param {string} filter - The category to filter by
 */
function filterGalleryItems(filter) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        if (filter === 'all' || item.classList.contains(filter)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Print Functionality
 */
function initPrintFunction() {
    const printButtons = document.querySelectorAll('.print-btn');
    
    printButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.print();
        });
    });
}

/**
 * Dynamically load gallery images
 * This function would be used when actual images are available
 * @param {Array} images - Array of image objects with src, alt, and category properties
 */
function loadGalleryImages(images) {
    const galleryContainer = document.querySelector('.gallery-container');
    if (!galleryContainer) return;
    
    // Clear placeholder notice
    galleryContainer.innerHTML = '';
    
    // Add each image to the gallery
    images.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${image.category}`;
        
        galleryItem.innerHTML = `
            <img src="${image.src}" alt="${image.alt}">
            <div class="gallery-item-caption">
                <h4>${image.title}</h4>
                <p>${image.location}</p>
            </div>
        `;
        
        galleryContainer.appendChild(galleryItem);
    });
}

/**
 * Smooth scrolling for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Skip for print button
        if (this.classList.contains('print-btn')) return;
        
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Handle window resize events
 */
window.addEventListener('resize', function() {
    // Reset mobile menu on window resize
    const navLinks = document.querySelector('.nav-links');
    if (window.innerWidth > 768 && navLinks) {
        navLinks.classList.remove('active');
    }
});