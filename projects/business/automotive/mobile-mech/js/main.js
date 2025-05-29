/**
 * Mobile Auto-Repair Business in Sydney
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Initialize tabs if they exist
    initTabs();
    
    // Initialize accordions if they exist
    initAccordions();
    
    // Initialize the interactive checklist
    initChecklist();
    
    // Initialize charts if they exist
    initCharts();
});

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Change button icon based on menu state
            const icon = this.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('nav') && !event.target.closest('.mobile-menu-btn')) {
                navMenu.classList.remove('active');
                
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }
}

/**
 * Smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            const navMenu = document.querySelector('nav ul');
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        const headerHeight = document.querySelector('header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Tab functionality
 */
function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs');
    
    tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll('.tab-nav li button');
        const tabContents = container.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to current button and content
                this.classList.add('active');
                container.querySelector(`.tab-content[data-tab="${tabId}"]`).classList.add('active');
            });
        });
        
        // Activate first tab by default
        if (tabButtons.length > 0) {
            tabButtons[0].click();
        }
    });
}

/**
 * Accordion functionality
 */
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            
            // Toggle current accordion
            content.classList.toggle('active');
            
            // Update icon if it exists
            const icon = this.querySelector('i');
            if (icon) {
                if (content.classList.contains('active')) {
                    icon.className = 'fas fa-minus';
                } else {
                    icon.className = 'fas fa-plus';
                }
            }
        });
    });
}

/**
 * Interactive checklist functionality
 */
function initChecklist() {
    // Get all checklist items
    const checklistItems = document.querySelectorAll('.checklist-checkbox');
    const progressBar = document.getElementById('progress-bar');
    const completedCount = document.getElementById('completed-count');
    const completionPercentage = document.getElementById('completion-percentage');
    const saveButton = document.getElementById('save-progress');
    const resetButton = document.getElementById('reset-progress');
    
    // If checklist elements don't exist, return
    if (checklistItems.length === 0) return;
    
    // Initialize the checklist from localStorage if available
    initializeChecklistState();
    
    // Add event listeners to all checkboxes
    checklistItems.forEach(item => {
        item.addEventListener('change', function() {
            updateItemStatus(this);
            updateProgress();
        });
    });
    
    // Save progress button
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveProgress();
            showNotification('Progress saved successfully!', 'success');
        });
    }
    
    // Reset progress button
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                resetProgress();
                showNotification('Progress has been reset.', 'warning');
            }
        });
    }
    
    /**
     * Initialize the checklist from localStorage if available
     */
    function initializeChecklistState() {
        const savedProgress = localStorage.getItem('mobileAutoRepairChecklist');
        
        if (savedProgress) {
            const checkedItems = JSON.parse(savedProgress);
            
            checklistItems.forEach(item => {
                if (checkedItems.includes(item.id)) {
                    item.checked = true;
                    updateItemStatus(item);
                }
            });
        }
        
        updateProgress();
    }
    
    /**
     * Update the visual status of a checklist item
     */
    function updateItemStatus(checkbox) {
        const contentElement = checkbox.nextElementSibling;
        const titleElement = contentElement.querySelector('.checklist-item-title');
        
        if (checkbox.checked) {
            titleElement.classList.add('completed');
        } else {
            titleElement.classList.remove('completed');
        }
    }
    
    /**
     * Update the progress bar and statistics
     */
    function updateProgress() {
        if (!progressBar || !completedCount || !completionPercentage) return;
        
        const totalItems = checklistItems.length;
        const completedItems = Array.from(checklistItems).filter(item => item.checked).length;
        const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        
        progressBar.style.width = percentage + '%';
        completedCount.textContent = `${completedItems} of ${totalItems} tasks completed`;
        completionPercentage.textContent = `${percentage}%`;
        
        // Change progress bar color based on completion percentage
        if (percentage < 25) {
            progressBar.style.backgroundColor = '#e74c3c'; // Red
        } else if (percentage < 50) {
            progressBar.style.backgroundColor = '#f39c12'; // Orange
        } else if (percentage < 75) {
            progressBar.style.backgroundColor = '#3498db'; // Blue
        } else {
            progressBar.style.backgroundColor = '#27ae60'; // Green
        }
    }
    
    /**
     * Save progress to localStorage
     */
    function saveProgress() {
        const checkedItems = Array.from(checklistItems)
            .filter(item => item.checked)
            .map(item => item.id);
        
        localStorage.setItem('mobileAutoRepairChecklist', JSON.stringify(checkedItems));
    }
    
    /**
     * Reset all progress
     */
    function resetProgress() {
        localStorage.removeItem('mobileAutoRepairChecklist');
        
        checklistItems.forEach(item => {
            item.checked = false;
            updateItemStatus(item);
        });
        
        updateProgress();
    }
    
    /**
     * Show notification message
     */
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        
        // Set color based on type
        if (type === 'success') {
            notification.style.backgroundColor = '#27ae60';
            notification.style.color = 'white';
        } else if (type === 'warning') {
            notification.style.backgroundColor = '#f39c12';
            notification.style.color = 'white';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#e74c3c';
            notification.style.color = 'white';
        }
        
        // Add to document
        document.body.appendChild(notification);
        
        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add section navigation functionality
    const sectionLinks = document.querySelectorAll('nav ul li a');
    sectionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add category completion tracking
    const sections = document.querySelectorAll('.checklist-section');
    sections.forEach(section => {
        const sectionItems = section.querySelectorAll('.checklist-checkbox');
        
        sectionItems.forEach(item => {
            item.addEventListener('change', function() {
                updateSectionProgress(section);
            });
        });
        
        // Initialize section progress
        updateSectionProgress(section);
    });
    
    /**
     * Update the progress for a specific section
     */
    function updateSectionProgress(section) {
        const sectionItems = section.querySelectorAll('.checklist-checkbox');
        const totalItems = sectionItems.length;
        const completedItems = Array.from(sectionItems).filter(item => item.checked).length;
        
        // If section already has a progress indicator, update it
        let progressIndicator = section.querySelector('.section-progress');
        
        if (!progressIndicator) {
            // Create progress indicator
            progressIndicator = document.createElement('span');
            progressIndicator.className = 'section-progress';
            progressIndicator.style.marginLeft = '10px';
            progressIndicator.style.fontSize = '14px';
            progressIndicator.style.color = '#666';
            
            // Add it next to the section title
            const sectionTitle = section.querySelector('h3');
            if (sectionTitle) {
                sectionTitle.appendChild(progressIndicator);
            }
        }
        
        // Update the progress text
        progressIndicator.textContent = `(${completedItems}/${totalItems})`;
        
        // Update the color based on completion
        if (completedItems === totalItems && totalItems > 0) {
            progressIndicator.style.color = '#27ae60'; // Green for complete
        } else if (completedItems > 0) {
            progressIndicator.style.color = '#3498db'; // Blue for in progress
        } else {
            progressIndicator.style.color = '#666'; // Gray for not started
        }
    }
    
    // Auto-save progress when window is closed
    window.addEventListener('beforeunload', function() {
        saveProgress();
    });
    
    // Add search functionality for checklist
    const checklistContainer = document.querySelector('.checklist-container');
    if (checklistContainer) {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search checklist items...';
        searchInput.className = 'checklist-search';
        searchInput.style.padding = '10px';
        searchInput.style.margin = '0 0 20px 0';
        searchInput.style.width = '100%';
        searchInput.style.borderRadius = '5px';
        searchInput.style.border = '1px solid #ddd';
        
        // Insert search input before the first checklist section
        const firstSection = checklistContainer.querySelector('.checklist-section');
        if (firstSection) {
            firstSection.parentNode.insertBefore(searchInput, firstSection);
        }
        
        // Add search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // If search term is empty, show all items
            if (searchTerm === '') {
                checklistItems.forEach(item => {
                    item.closest('.checklist-item').style.display = 'flex';
                });
                
                // Show all section headers
                document.querySelectorAll('.checklist-section h3').forEach(header => {
                    header.style.display = 'block';
                });
                
                return;
            }
            
            // Hide all section headers initially
            document.querySelectorAll('.checklist-section h3').forEach(header => {
                header.style.display = 'none';
            });
            
            // Filter items based on search term
            checklistItems.forEach(item => {
                const itemContent = item.nextElementSibling;
                const itemTitle = itemContent.querySelector('.checklist-item-title').textContent.toLowerCase();
                const itemDescription = itemContent.querySelector('.checklist-item-description').textContent.toLowerCase();
                
                if (itemTitle.includes(searchTerm) || itemDescription.includes(searchTerm)) {
                    item.closest('.checklist-item').style.display = 'flex';
                    
                    // Show the section header for this item
                    const sectionHeader = item.closest('.checklist-section').querySelector('h3');
                    sectionHeader.style.display = 'block';
                } else {
                    item.closest('.checklist-item').style.display = 'none';
                }
            });
        });
    }
}

/**
 * Initialize charts if they exist
 * This is a placeholder for potential chart functionality
 */
function initCharts() {
    // This would be implemented if we were using a charting library
    // For now, we're using static images for charts
}

/**
 * Back to top button functionality
 */
function initBackToTopButton() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize back to top button
initBackToTopButton();