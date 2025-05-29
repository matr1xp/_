// resources.js - Functionality for the resources page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize resources functionality
    initializeResources();
    
    // Set up event listeners
    setupEventListeners();
});

// Function to initialize resources
function initializeResources() {
    // Load saved bookmarks from localStorage
    loadBookmarks();
    
    // Initialize filter state
    initializeFilters();
}

// Function to set up event listeners
function setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.resource-filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter resources
            filterResources(this.dataset.filter);
        });
    });
    
    // Sort dropdown
    const sortSelect = document.getElementById('sort-resources');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortResources(this.value);
        });
    }
    
    // Search input
    const searchInput = document.getElementById('search-resources');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchResources(this.value);
        });
    }
    
    // Bookmark buttons
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleBookmark(this);
        });
    });
    
    // Category filter
    const categorySelect = document.getElementById('category-filter');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            filterByCategory(this.value);
        });
    }
}

// Function to filter resources by type
function filterResources(filterType) {
    const resources = document.querySelectorAll('.resource-item');
    
    resources.forEach(resource => {
        if (filterType === 'all') {
            resource.style.display = '';
        } else if (filterType === 'bookmarked') {
            const bookmarkBtn = resource.querySelector('.bookmark-btn');
            if (bookmarkBtn && bookmarkBtn.classList.contains('bookmarked')) {
                resource.style.display = '';
            } else {
                resource.style.display = 'none';
            }
        } else {
            const resourceType = resource.dataset.type;
            if (resourceType === filterType) {
                resource.style.display = '';
            } else {
                resource.style.display = 'none';
            }
        }
    });
}

// Function to filter resources by category
function filterByCategory(category) {
    const resources = document.querySelectorAll('.resource-item');
    
    resources.forEach(resource => {
        if (category === 'all') {
            resource.style.display = '';
        } else {
            const resourceCategory = resource.dataset.category;
            if (resourceCategory === category) {
                resource.style.display = '';
            } else {
                resource.style.display = 'none';
            }
        }
    });
}

// Function to sort resources
function sortResources(sortType) {
    const resourcesContainer = document.querySelector('.resources-grid');
    if (!resourcesContainer) return;
    
    const resources = Array.from(resourcesContainer.querySelectorAll('.resource-item'));
    
    // Sort resources based on sort type
    resources.sort((a, b) => {
        switch (sortType) {
            case 'name-asc':
                return a.dataset.name.localeCompare(b.dataset.name);
            case 'name-desc':
                return b.dataset.name.localeCompare(a.dataset.name);
            case 'rating-desc':
                return parseFloat(b.dataset.rating || 0) - parseFloat(a.dataset.rating || 0);
            case 'rating-asc':
                return parseFloat(a.dataset.rating || 0) - parseFloat(b.dataset.rating || 0);
            default:
                return 0;
        }
    });
    
    // Remove all resources from container
    resources.forEach(resource => resourcesContainer.removeChild(resource));
    
    // Add sorted resources back to container
    resources.forEach(resource => resourcesContainer.appendChild(resource));
}

// Function to search resources
function searchResources(searchTerm) {
    const resources = document.querySelectorAll('.resource-item');
    const term = searchTerm.toLowerCase();
    
    resources.forEach(resource => {
        const name = resource.dataset.name.toLowerCase();
        const description = resource.querySelector('.resource-description')?.textContent.toLowerCase() || '';
        const tags = resource.querySelectorAll('.resource-tag');
        
        let tagMatch = false;
        tags.forEach(tag => {
            if (tag.textContent.toLowerCase().includes(term)) {
                tagMatch = true;
            }
        });
        
        if (name.includes(term) || description.includes(term) || tagMatch) {
            resource.style.display = '';
        } else {
            resource.style.display = 'none';
        }
    });
}

// Function to toggle bookmark
function toggleBookmark(button) {
    // Toggle bookmarked class
    button.classList.toggle('bookmarked');
    
    // Update icon
    if (button.classList.contains('bookmarked')) {
        button.innerHTML = '<i class="fas fa-bookmark"></i>';
    } else {
        button.innerHTML = '<i class="far fa-bookmark"></i>';
    }
    
    // Save bookmarks to localStorage
    saveBookmarks();
}

// Function to save bookmarks to localStorage
function saveBookmarks() {
    const bookmarkedResources = [];
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn.bookmarked');
    
    bookmarkButtons.forEach(button => {
        const resourceId = button.closest('.resource-item').dataset.id;
        bookmarkedResources.push(resourceId);
    });
    
    localStorage.setItem('gregoryHillsBookmarkedResources', JSON.stringify(bookmarkedResources));
}

// Function to load bookmarks from localStorage
function loadBookmarks() {
    const savedBookmarks = localStorage.getItem('gregoryHillsBookmarkedResources');
    
    if (savedBookmarks) {
        const bookmarkedResources = JSON.parse(savedBookmarks);
        
        bookmarkedResources.forEach(resourceId => {
            const resource = document.querySelector(`.resource-item[data-id="${resourceId}"]`);
            if (resource) {
                const bookmarkBtn = resource.querySelector('.bookmark-btn');
                if (bookmarkBtn) {
                    bookmarkBtn.classList.add('bookmarked');
                    bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
                }
            }
        });
    }
}

// Function to initialize filters
function initializeFilters() {
    // Set 'all' filter as active by default
    const allFilterBtn = document.querySelector('.resource-filter-btn[data-filter="all"]');
    if (allFilterBtn) {
        allFilterBtn.classList.add('active');
    }
    
    // Set default sort option
    const sortSelect = document.getElementById('sort-resources');
    if (sortSelect) {
        sortSelect.value = 'name-asc';
    }
}

// Function to generate resource tags
function generateResourceTags() {
    const resources = document.querySelectorAll('.resource-item');
    
    resources.forEach(resource => {
        const tagsContainer = resource.querySelector('.resource-tags');
        if (!tagsContainer) return;
        
        // Clear existing tags
        tagsContainer.innerHTML = '';
        
        // Get tags from data attribute
        const tags = resource.dataset.tags?.split(',') || [];
        
        // Create tag elements
        tags.forEach(tag => {
            if (tag.trim()) {
                const tagElement = document.createElement('span');
                tagElement.className = 'resource-tag';
                tagElement.textContent = tag.trim();
                tagsContainer.appendChild(tagElement);
            }
        });
    });
}

// Call generateResourceTags when the page loads
document.addEventListener('DOMContentLoaded', function() {
    generateResourceTags();
});