// checklist.js - Interactive checklist functionality for real estate investment in Gregory Hills

document.addEventListener('DOMContentLoaded', function() {
    // Load the checklist data from JSON
    loadChecklistData();
    
    // Add event listeners for checklist interactions
    setupEventListeners();
});

// Function to load checklist data from JSON file
async function loadChecklistData() {
    try {
        const response = await fetch('../research/updated_checklist_items.json');
        if (!response.ok) {
            throw new Error('Failed to load checklist data');
        }
        const checklistData = await response.json();
        
        // Generate the checklist HTML
        generateChecklistHTML(checklistData);
        
        // Initialize the checklist state
        initializeChecklist();
    } catch (error) {
        console.error('Error loading checklist data:', error);
        // If we can't load the data, use the existing HTML structure
        initializeChecklist();
    }
}

// Function to generate checklist HTML from JSON data
function generateChecklistHTML(data) {
    const checklistContainer = document.querySelector('.checklist-container');
    if (!checklistContainer) return;
    
    // Clear existing content
    checklistContainer.innerHTML = '';
    
    // Loop through each phase
    data.phases.forEach(phase => {
        // Create phase container
        const phaseElement = document.createElement('div');
        phaseElement.className = 'checklist-phase';
        phaseElement.id = `phase-${phase.id}`;
        
        // Loop through each category in the phase
        phase.categories.forEach(category => {
            // Create category container
            const categoryElement = document.createElement('div');
            categoryElement.className = 'checklist-category';
            categoryElement.id = `category-${category.id}`;
            
            // Create category header
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header category-toggle';
            
            // Create category title
            const categoryTitle = document.createElement('h3');
            categoryTitle.className = 'category-title';
            categoryTitle.innerHTML = `<i class="${phase.icon}"></i> ${category.name}`;
            
            // Create category progress
            const categoryProgress = document.createElement('div');
            categoryProgress.className = 'category-progress';
            
            const progressBarContainer = document.createElement('div');
            progressBarContainer.className = 'progress-bar-container';
            
            const progressBar = document.createElement('div');
            progressBar.className = 'category-progress-bar';
            
            const progressText = document.createElement('span');
            progressText.className = 'category-progress-text';
            progressText.textContent = `0/${category.items.length} (0%)`;
            
            // Assemble category progress
            progressBarContainer.appendChild(progressBar);
            categoryProgress.appendChild(progressBarContainer);
            categoryProgress.appendChild(progressText);
            
            // Assemble category header
            categoryHeader.appendChild(categoryTitle);
            categoryHeader.appendChild(categoryProgress);
            
            // Create items container
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'checklist-items';
            
            // Loop through each item in the category
            category.items.forEach(item => {
                // Create item element
                const itemElement = document.createElement('div');
                itemElement.className = 'checklist-item';
                itemElement.dataset.priority = item.priority || 'medium';
                
                // Create checkbox
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = item.id;
                
                // Create label
                const label = document.createElement('label');
                label.htmlFor = item.id;
                label.textContent = item.text;
                
                // Create details section
                const details = document.createElement('div');
                details.className = 'item-details';
                
                // Add priority indicator
                const priorityBadge = document.createElement('span');
                priorityBadge.className = `priority-badge ${item.priority || 'medium'}`;
                priorityBadge.textContent = item.priority ? item.priority.charAt(0).toUpperCase() + item.priority.slice(1) : 'Medium';
                
                // Add estimated time if available
                if (item.estimatedTime) {
                    const timeEstimate = document.createElement('span');
                    timeEstimate.className = 'time-estimate';
                    timeEstimate.innerHTML = `<i class="fas fa-clock"></i> ${item.estimatedTime}`;
                    details.appendChild(timeEstimate);
                }
                
                // Add help text if available
                if (item.helpText) {
                    const helpText = document.createElement('p');
                    helpText.className = 'help-text';
                    helpText.textContent = item.helpText;
                    details.appendChild(helpText);
                }
                
                // Add resource links if available
                if (item.resources && item.resources.length > 0) {
                    const resourcesContainer = document.createElement('div');
                    resourcesContainer.className = 'resources';
                    resourcesContainer.innerHTML = '<strong>Resources:</strong> ';
                    
                    item.resources.forEach((resource, index) => {
                        const link = document.createElement('a');
                        link.href = resource;
                        link.textContent = `Resource ${index + 1}`;
                        link.target = '_blank';
                        resourcesContainer.appendChild(link);
                        
                        if (index < item.resources.length - 1) {
                            resourcesContainer.appendChild(document.createTextNode(', '));
                        }
                    });
                    
                    details.appendChild(resourcesContainer);
                }
                
                // Assemble item
                itemElement.appendChild(checkbox);
                itemElement.appendChild(label);
                itemElement.appendChild(priorityBadge);
                itemElement.appendChild(details);
                
                // Add to items container
                itemsContainer.appendChild(itemElement);
            });
            
            // Assemble category
            categoryElement.appendChild(categoryHeader);
            categoryElement.appendChild(itemsContainer);
            
            // Add to phase container
            phaseElement.appendChild(categoryElement);
        });
        
        // Add to checklist container
        checklistContainer.appendChild(phaseElement);
    });
    
    // Expand the first category by default
    const firstCategory = checklistContainer.querySelector('.checklist-category');
    if (firstCategory) {
        firstCategory.classList.add('expanded');
    }
}

// Function to initialize the checklist from stored data or defaults
function initializeChecklist() {
    // Try to load saved checklist state from localStorage
    const savedChecklist = localStorage.getItem('gregoryHillsInvestmentChecklist');
    
    if (savedChecklist) {
        // If we have saved data, restore it
        const checklistData = JSON.parse(savedChecklist);
        restoreChecklistState(checklistData);
    } else {
        // Otherwise, set up with default state (all unchecked)
        const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
    
    // Update progress indicators
    updateProgress();
}

// Function to restore checklist state from saved data
function restoreChecklistState(checklistData) {
    // For each saved item, find the corresponding checkbox and set its state
    checklistData.forEach(item => {
        const checkbox = document.querySelector(`#${item.id}`);
        if (checkbox) {
            checkbox.checked = item.checked;
            
            // If checked, also add the completed class to the parent
            if (item.checked) {
                checkbox.closest('.checklist-item').classList.add('completed');
            }
        }
    });
}

// Function to set up event listeners
function setupEventListeners() {
    // Add event listeners to all checkboxes
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Toggle the completed class on the parent element
            this.closest('.checklist-item').classList.toggle('completed', this.checked);
            
            // Save the current state
            saveChecklistState();
            
            // Update progress indicators
            updateProgress();
        });
    });
    
    // Add event listener for reset button
    const resetButton = document.getElementById('reset-checklist');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset your progress?')) {
                resetChecklist();
            }
        });
    }
    
    // Add event listeners for category toggles
    const categoryToggles = document.querySelectorAll('.category-toggle');
    categoryToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            // Toggle the expanded class on the category
            this.closest('.checklist-category').classList.toggle('expanded');
        });
    });
    
    // Add event listeners for filter buttons
    setupFilterListeners();
}

// Function to set up filter listeners
function setupFilterListeners() {
    // Priority filters
    const priorityFilters = document.querySelectorAll('.priority-filter');
    if (priorityFilters) {
        priorityFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                const priority = this.dataset.priority;
                
                // Toggle active class on filter buttons
                priorityFilters.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter items
                filterItemsByPriority(priority);
            });
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('checklist-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterItemsBySearch(searchTerm);
        });
    }
}

// Function to filter items by priority
function filterItemsByPriority(priority) {
    const items = document.querySelectorAll('.checklist-item');
    
    items.forEach(item => {
        if (priority === 'all' || item.dataset.priority === priority) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Function to filter items by search term
function filterItemsBySearch(searchTerm) {
    const items = document.querySelectorAll('.checklist-item');
    
    items.forEach(item => {
        const label = item.querySelector('label').textContent.toLowerCase();
        const helpText = item.querySelector('.help-text')?.textContent.toLowerCase() || '';
        
        if (label.includes(searchTerm) || helpText.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Function to save the current state of the checklist
function saveChecklistState() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const checklistData = [];
    
    checkboxes.forEach(checkbox => {
        checklistData.push({
            id: checkbox.id,
            checked: checkbox.checked
        });
    });
    
    localStorage.setItem('gregoryHillsInvestmentChecklist', JSON.stringify(checklistData));
}

// Function to reset the checklist
function resetChecklist() {
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('.checklist-item').classList.remove('completed');
    });
    
    // Clear saved data
    localStorage.removeItem('gregoryHillsInvestmentChecklist');
    
    // Update progress indicators
    updateProgress();
}

// Function to update progress indicators
function updateProgress() {
    // Calculate overall progress
    const totalItems = document.querySelectorAll('.checklist-item input[type="checkbox"]').length;
    const completedItems = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
    const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    // Update the progress bar
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.setAttribute('aria-valuenow', progressPercentage);
    }
    
    // Update the progress text
    const progressText = document.getElementById('progress-text');
    if (progressText) {
        progressText.textContent = `${completedItems} of ${totalItems} tasks completed (${progressPercentage}%)`;
    }
    
    // Update category progress
    updateCategoryProgress();
}

// Function to update progress for each category
function updateCategoryProgress() {
    const categories = document.querySelectorAll('.checklist-category');
    
    categories.forEach(category => {
        const categoryItems = category.querySelectorAll('.checklist-item input[type="checkbox"]');
        const categoryCompletedItems = category.querySelectorAll('.checklist-item input[type="checkbox"]:checked');
        
        const categoryTotal = categoryItems.length;
        const categoryCompleted = categoryCompletedItems.length;
        const categoryPercentage = categoryTotal > 0 ? Math.round((categoryCompleted / categoryTotal) * 100) : 0;
        
        // Update the category progress bar
        const categoryProgressBar = category.querySelector('.category-progress-bar');
        if (categoryProgressBar) {
            categoryProgressBar.style.width = `${categoryPercentage}%`;
        }
        
        // Update the category progress text
        const categoryProgressText = category.querySelector('.category-progress-text');
        if (categoryProgressText) {
            categoryProgressText.textContent = `${categoryCompleted}/${categoryTotal} (${categoryPercentage}%)`;
        }
    });
}

// Function to export checklist as PDF
function exportChecklistAsPDF() {
    // Create a new jsPDF instance
    const { jsPDF } = window.jspdf;
    
    if (typeof jsPDF === 'undefined') {
        // If jsPDF is not available, load it dynamically
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = function() {
            // Once loaded, try again
            exportChecklistAsPDF();
        };
        document.head.appendChild(script);
        alert('Preparing PDF export functionality...');
        return;
    }
    
    // Create PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Gregory Hills Investment Checklist', 20, 20);
    
    // Add date
    const today = new Date();
    doc.setFontSize(12);
    doc.text(`Generated on: ${today.toLocaleDateString()}`, 20, 30);
    
    // Add progress summary
    const totalItems = document.querySelectorAll('.checklist-item input[type="checkbox"]').length;
    const completedItems = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
    const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    doc.text(`Overall Progress: ${completedItems} of ${totalItems} tasks completed (${progressPercentage}%)`, 20, 40);
    
    // Add checklist items
    let y = 50;
    
    // Get all categories
    const categories = document.querySelectorAll('.checklist-category');
    
    categories.forEach(category => {
        // Add category title
        const categoryTitle = category.querySelector('.category-title').textContent;
        doc.setFontSize(16);
        doc.text(categoryTitle, 20, y);
        y += 10;
        
        // Get all items in this category
        const items = category.querySelectorAll('.checklist-item');
        
        items.forEach(item => {
            // Check if we need a new page
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            
            // Get item details
            const checkbox = item.querySelector('input[type="checkbox"]');
            const label = item.querySelector('label').textContent;
            const isChecked = checkbox.checked;
            
            // Add checkbox status and label
            doc.setFontSize(12);
            doc.text(`${isChecked ? '☑' : '☐'} ${label}`, 25, y);
            y += 7;
        });
        
        y += 5;
    });
    
    // Save the PDF
    doc.save('gregory-hills-investment-checklist.pdf');
}

// Function to share checklist via email
function shareChecklistViaEmail() {
    // Get the checklist data
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    let emailBody = 'Gregory Hills Investment Checklist Progress:\n\n';
    
    // Get all categories
    const categories = document.querySelectorAll('.checklist-category');
    
    categories.forEach(category => {
        // Add category title
        const categoryTitle = category.querySelector('.category-title').textContent;
        emailBody += `\n${categoryTitle}\n`;
        emailBody += ''.padStart(categoryTitle.length, '-') + '\n';
        
        // Get all items in this category
        const items = category.querySelectorAll('.checklist-item');
        
        items.forEach(item => {
            // Get item details
            const checkbox = item.querySelector('input[type="checkbox"]');
            const label = item.querySelector('label').textContent;
            const isChecked = checkbox.checked;
            
            // Add checkbox status and label
            emailBody += `${isChecked ? '✓' : '□'} ${label}\n`;
        });
    });
    
    // Add summary
    const totalItems = document.querySelectorAll('.checklist-item input[type="checkbox"]').length;
    const completedItems = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
    const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    emailBody += `\nOverall Progress: ${completedItems} of ${totalItems} tasks completed (${progressPercentage}%)\n`;
    emailBody += '\nGenerated from Gregory Hills Investment Guide: https://gregoryhillsinvestment.com';
    
    // Create the mailto link
    const mailtoLink = `mailto:?subject=My Gregory Hills Investment Checklist&body=${encodeURIComponent(emailBody)}`;
    
    // Open the email client
    window.location.href = mailtoLink;
}