/**
 * Springfield Property Investment Checklist
 * Interactive checklist functionality for property investors
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fetch the checklist data
    fetch('./js/checklist_structure.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            initializeChecklist(data.checklist);
        })
        .catch(error => {
            console.error('Error loading checklist data:', error);
            document.getElementById('checklist-container').innerHTML = `
                <div class="error-message">
                    <h3>Unable to load checklist data</h3>
                    <p>Please try refreshing the page or contact support if the problem persists.</p>
                </div>
            `;
        });
});

/**
 * Initialize the checklist with the provided data
 * @param {Object} checklistData - The checklist data from JSON
 */
function initializeChecklist(checklistData) {
    const container = document.getElementById('checklist-container');
    
    // Create the checklist header
    const header = document.createElement('div');
    header.className = 'checklist-header';
    header.innerHTML = `
        <h2>${checklistData.title}</h2>
        <p>${checklistData.description}</p>
        <div class="checklist-progress">
            <div class="progress-bar">
                <div class="progress" id="checklist-progress-bar"></div>
            </div>
            <div class="progress-text">
                <span id="completed-items">0</span> of <span id="total-items">0</span> items completed
            </div>
        </div>
    `;
    container.appendChild(header);
    
    // Create categories
    let totalItems = 0;
    checklistData.categories.forEach(category => {
        totalItems += category.items.length;
        
        const categoryElement = document.createElement('div');
        categoryElement.className = 'checklist-category';
        categoryElement.id = `category-${category.id}`;
        
        categoryElement.innerHTML = `
            <h3 class="checklist-title">${category.title}</h3>
            <p class="checklist-description">${category.description}</p>
            <div class="checklist-items" id="items-${category.id}"></div>
        `;
        
        container.appendChild(categoryElement);
        
        // Create items for this category
        const itemsContainer = document.getElementById(`items-${category.id}`);
        category.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'checklist-item';
            itemElement.id = `item-${item.id}`;
            
            // Check if this item has dependencies
            let isDisabled = false;
            if (item.dependencies && item.dependencies.length > 0) {
                isDisabled = true;
            }
            
            // Create resources HTML if available
            let resourcesHtml = '';
            if (item.resources && item.resources.length > 0) {
                resourcesHtml = `
                    <div class="checklist-resources">
                        <strong>Resources:</strong>
                        ${item.resources.map(resource => `
                            <a href="${resource.url}" class="checklist-resource" data-type="${resource.type}">
                                ${resource.title}
                            </a>
                        `).join('')}
                    </div>
                `;
            }
            
            itemElement.innerHTML = `
                <input type="checkbox" class="checklist-checkbox" id="checkbox-${item.id}" 
                    ${item.completed ? 'checked' : ''} 
                    ${isDisabled ? 'disabled' : ''} 
                    data-item-id="${item.id}">
                <div class="checklist-content">
                    <h4 class="checklist-item-title">${item.title}</h4>
                    <p class="checklist-item-description">${item.description}</p>
                    ${resourcesHtml}
                    ${isDisabled ? `
                        <div class="checklist-dependencies">
                            <small>Complete the following items first:</small>
                            <ul>
                                ${item.dependencies.map(depId => `<li data-dependency="${depId}"></li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
            
            itemsContainer.appendChild(itemElement);
        });
    });
    
    // Update the total items count
    document.getElementById('total-items').textContent = totalItems;
    
    // Add event listeners to checkboxes
    document.querySelectorAll('.checklist-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const itemId = this.getAttribute('data-item-id');
            updateItemStatus(itemId, this.checked);
            updateProgress();
            updateDependencies();
        });
    });
    
    // Fill in dependency names
    updateDependencyLabels(checklistData);
    
    // Initialize progress
    updateProgress();
    // Load saved state after rendering checklist
    loadChecklistState();
    
    // Attach Save button event listener after rendering - use setTimeout to ensure DOM is ready
    setTimeout(() => {
        const saveButton = document.getElementById('save-checklist');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                saveChecklistState();
                // Show toast notification
                const toast = document.getElementById('toast-notification');
                if (toast) {
                    toast.style.display = 'block';
                    toast.style.opacity = '1';
                    setTimeout(() => {
                        toast.style.opacity = '0';
                        setTimeout(() => { toast.style.display = 'none'; }, 400);
                    }, 1800);
                }
            });
        }
    }, 100);
}

/**
 * Update the labels for dependencies
 * @param {Object} checklistData - The checklist data
 */
function updateDependencyLabels(checklistData) {
    // Create a map of item IDs to titles
    const itemTitles = {};
    checklistData.categories.forEach(category => {
        category.items.forEach(item => {
            itemTitles[item.id] = item.title;
        });
    });
    
    // Update dependency labels
    document.querySelectorAll('[data-dependency]').forEach(element => {
        const depId = element.getAttribute('data-dependency');
        element.textContent = itemTitles[depId] || depId;
    });
}

/**
 * Update the status of an item
 * @param {string} itemId - The ID of the item
 * @param {boolean} completed - Whether the item is completed
 */
function updateItemStatus(itemId, completed) {
    // In a real application, this would update the server
    // For now, we'll just update the UI
    const item = document.getElementById(`item-${itemId}`);
    if (completed) {
        item.classList.add('completed');
    } else {
        item.classList.remove('completed');
    }
    
    // Save to localStorage for persistence
    saveChecklistState();
}

/**
 * Update the progress bar and counter
 */
function updateProgress() {
    const totalItems = document.querySelectorAll('.checklist-checkbox').length;
    const completedItems = document.querySelectorAll('.checklist-checkbox:checked').length;
    
    document.getElementById('completed-items').textContent = completedItems;
    
    const progressBar = document.getElementById('checklist-progress-bar');
    const progressPercentage = (completedItems / totalItems) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    
    // Update color based on progress
    if (progressPercentage < 30) {
        progressBar.style.backgroundColor = '#e74c3c'; // Red
    } else if (progressPercentage < 70) {
        progressBar.style.backgroundColor = '#f39c12'; // Orange
    } else {
        progressBar.style.backgroundColor = '#27ae60'; // Green
    }
}

/**
 * Update the status of dependent items
 */
function updateDependencies() {
    // Get all items with dependencies
    document.querySelectorAll('.checklist-dependencies').forEach(depElement => {
        const itemElement = depElement.closest('.checklist-item');
        const checkbox = itemElement.querySelector('.checklist-checkbox');
        
        // Check if all dependencies are completed
        const dependencies = Array.from(depElement.querySelectorAll('[data-dependency]'))
            .map(el => el.getAttribute('data-dependency'));
        
        const allDependenciesCompleted = dependencies.every(depId => {
            const depCheckbox = document.querySelector(`#checkbox-${depId}`);
            return depCheckbox && depCheckbox.checked;
        });
        
        // Enable/disable the checkbox based on dependencies
        checkbox.disabled = !allDependenciesCompleted;
        
        if (allDependenciesCompleted) {
            depElement.innerHTML = '<small>All prerequisites completed</small>';
        }
    });
}

/**
 * Save the current state of the checklist to localStorage
 */
function saveChecklistState() {
    const state = {};
    document.querySelectorAll('.checklist-checkbox').forEach(checkbox => {
        const itemId = checkbox.getAttribute('data-item-id');
        state[itemId] = checkbox.checked;
    });
    
    localStorage.setItem('springfieldChecklistState', JSON.stringify(state));
}

/**
 * Load the saved state of the checklist from localStorage
 */
function loadChecklistState() {
    const savedState = localStorage.getItem('springfieldChecklistState');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            Object.entries(state).forEach(([itemId, checked]) => {
                const checkbox = document.querySelector(`#checkbox-${itemId}`);
                if (checkbox) {
                    checkbox.checked = checked;
                    // Directly update UI for completed state
                    const item = document.getElementById(`item-${itemId}`);
                    if (item) {
                        if (checked) {
                            item.classList.add('completed');
                        } else {
                            item.classList.remove('completed');
                        }
                    }
                }
            });
            updateProgress();
            updateDependencies();
        } catch (error) {
            console.error('Error loading saved checklist state:', error);
        }
    }
}

/**
 * Reset the checklist to its initial state
 */
function resetChecklist() {
    document.querySelectorAll('.checklist-checkbox').forEach(checkbox => {
        checkbox.checked = false;
        const itemId = checkbox.getAttribute('data-item-id');
        updateItemStatus(itemId, false);
    });
    
    updateProgress();
    updateDependencies();
    localStorage.removeItem('springfieldChecklistState');
}

// Add reset button functionality
document.addEventListener('DOMContentLoaded', function() {
    const resetButton = document.getElementById('reset-checklist');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset the checklist? All progress will be lost.')) {
                resetChecklist();
            }
        });
    }
});