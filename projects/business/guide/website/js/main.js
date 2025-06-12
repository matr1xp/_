/**
 * Australian Business Guide - Main JavaScript
 * Handles interactive elements for the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Toggle aria-expanded attribute for accessibility
            const expanded = navLinks.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', expanded);
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active') && 
            !event.target.closest('.main-nav')) {
            navLinks.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileMenuToggle) {
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
            }
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for fixed header
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to current section in navigation
    function highlightCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.nav-links a');
        
        if (sections.length && navItems.length) {
            // Get current scroll position
            let scrollPosition = window.scrollY + 100; // Adding offset for header
            
            // Check each section to see if it's in view
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    // Remove active class from all nav items
                    navItems.forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    // Add active class to corresponding nav item
                    const activeNavItem = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                    if (activeNavItem) {
                        activeNavItem.classList.add('active');
                    }
                }
            });
        }
    }
    
    // Call highlightCurrentSection on scroll
    window.addEventListener('scroll', highlightCurrentSection);
    
    // Call it once on page load
    highlightCurrentSection();

    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                question.addEventListener('click', () => {
                    // Toggle current item
                    const isOpen = item.classList.contains('active');
                    
                    // Close all items first (for accordion behavior)
                    faqItems.forEach(faqItem => {
                        faqItem.classList.remove('active');
                        const faqAnswer = faqItem.querySelector('.faq-answer');
                        if (faqAnswer) {
                            faqAnswer.style.maxHeight = null;
                        }
                    });
                    
                    // Open current item if it was closed
                    if (!isOpen) {
                        item.classList.add('active');
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                });
            }
        });
    }

    // Business Structure Tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length && tabContents.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to current button and content
                button.classList.add('active');
                document.querySelector(`.tab-content[data-tab="${targetTab}"]`).classList.add('active');
            });
        });
        
        // Activate first tab by default
        if (tabButtons[0] && tabContents[0]) {
            tabButtons[0].classList.add('active');
            tabContents[0].classList.add('active');
        }
    }

    // Form validation for contact or feedback forms
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Add error message if it doesn't exist
                    let errorMsg = field.parentNode.querySelector('.error-message');
                    if (!errorMsg) {
                        errorMsg = document.createElement('span');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'This field is required';
                        field.parentNode.appendChild(errorMsg);
                    }
                } else {
                    field.classList.remove('error');
                    const errorMsg = field.parentNode.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                    
                    // Email validation
                    if (field.type === 'email' && !validateEmail(field.value)) {
                        isValid = false;
                        field.classList.add('error');
                        
                        let errorMsg = field.parentNode.querySelector('.error-message');
                        if (!errorMsg) {
                            errorMsg = document.createElement('span');
                            errorMsg.className = 'error-message';
                            errorMsg.textContent = 'Please enter a valid email address';
                            field.parentNode.appendChild(errorMsg);
                        }
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
        
        // Clear error on input
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
                const errorMsg = this.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            });
        });
    }
    
    // Email validation helper function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Print-friendly functionality
    const printButtons = document.querySelectorAll('.print-button');
    if (printButtons.length) {
        printButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                window.print();
            });
        });
    }

    // Glossary term tooltips
    const glossaryTerms = document.querySelectorAll('.glossary-term');
    if (glossaryTerms.length) {
        glossaryTerms.forEach(term => {
            term.addEventListener('mouseenter', function() {
                const tooltip = this.querySelector('.term-tooltip');
                if (tooltip) {
                    tooltip.style.display = 'block';
                }
            });
            
            term.addEventListener('mouseleave', function() {
                const tooltip = this.querySelector('.term-tooltip');
                if (tooltip) {
                    tooltip.style.display = 'none';
                }
            });
        });
    }

    // Interactive pros and cons
    const proConToggles = document.querySelectorAll('.pro-con-toggle');
    if (proConToggles.length) {
        proConToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const target = this.getAttribute('data-target');
                const proConSection = document.querySelector(target);
                
                if (proConSection) {
                    proConSection.classList.toggle('show-all');
                    
                    // Update button text
                    if (proConSection.classList.contains('show-all')) {
                        this.textContent = 'Show Less';
                    } else {
                        this.textContent = 'Show More';
                    }
                }
            });
        });
    }

    // Quick Start Guide interactive steps
    const quickStartSteps = document.querySelectorAll('.quick-start-step');
    if (quickStartSteps.length) {
        quickStartSteps.forEach((step, index) => {
            step.addEventListener('click', function() {
                this.classList.toggle('expanded');
                
                // Auto-scroll to next step when current one is clicked
                if (this.classList.contains('expanded') && quickStartSteps[index + 1]) {
                    setTimeout(() => {
                        const headerHeight = document.querySelector('.site-header').offsetHeight;
                        const nextStepPosition = quickStartSteps[index + 1].getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                        
                        window.scrollTo({
                            top: nextStepPosition,
                            behavior: 'smooth'
                        });
                    }, 300);
                }
            });
        });
    }
});