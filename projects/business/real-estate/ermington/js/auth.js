// Password protection for Ermington real estate pages
import { CONFIG } from './config.js';

const PASSWORD = 'nodramas77';
const AUTH_COOKIE_NAME = 'ermington_paid_access';

// Disable right-click
function disableRightClick() {
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
}

function setAuthCookie() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 365); // 365 days from now
    document.cookie = `${AUTH_COOKIE_NAME}=true; expires=${expiryDate.toUTCString()}; path=/`;
}

function checkAuth() {
    // Skip authentication for index.html
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        return;
    }

    // Check for auth cookie
    const hasAuthCookie = document.cookie.split(';').some(c => c.trim().startsWith(`${AUTH_COOKIE_NAME}=`));
    const isAuthenticated = sessionStorage.getItem('ermingtonAuth') || hasAuthCookie;
    
    if (!isAuthenticated) {
        showLoginForm();
    }
}

function showLoginForm() {
    // Hide all content
    document.body.innerHTML = '';
    
    // Create login form
    const loginContainer = document.createElement('div');
    loginContainer.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f5f5f5;
        font-family: Arial, sans-serif;
    `;

    const loginForm = document.createElement('div');
    loginForm.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
    `;

    const title = document.createElement('h2');
    title.textContent = 'Protected Content';
    title.style.marginBottom = '1rem';

    const input = document.createElement('input');
    input.type = 'password';
    input.placeholder = 'Enter password';
    input.style.cssText = `
        padding: 0.5rem;
        margin: 0.5rem 0;
        width: 200px;
        border: 1px solid #ddd;
        border-radius: 4px;
    `;

    const button = document.createElement('button');
    button.textContent = 'Login';
    button.style.cssText = `
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 0.5rem;
    `;

    const errorMsg = document.createElement('p');
    errorMsg.style.color = 'red';
    errorMsg.style.display = 'none';

    // Create PayPal button container
    const paypalContainer = document.createElement('div');
    paypalContainer.id = 'paypal-button-container';
    paypalContainer.style.marginTop = '1rem';

    button.onclick = () => {
        if (input.value === PASSWORD) {
            sessionStorage.setItem('ermingtonAuth', 'true');
            window.location.reload();
        } else {
            errorMsg.textContent = 'Incorrect password';
            errorMsg.style.display = 'block';
        }
    };

    loginForm.appendChild(title);
    loginForm.appendChild(input);
    loginForm.appendChild(button);
    loginForm.appendChild(errorMsg);
    loginForm.appendChild(paypalContainer);
    loginContainer.appendChild(loginForm);
    document.body.appendChild(loginContainer);

    // Add PayPal script
    const paypalScript = document.createElement('script');
    paypalScript.src = `${CONFIG.PAYPAL.SDK_URL}?client-id=${CONFIG.PAYPAL.CLIENT_ID}&currency=${CONFIG.PAYPAL.CURRENCY}&components=${CONFIG.PAYPAL.COMPONENTS}`;
    
    paypalScript.onload = () => {
        if (window.paypal) {
            paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'pay'
                },
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: `${CONFIG.PAYPAL.AMOUNT}`
                            }
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        // Set the auth cookie
                        setAuthCookie();
                        // Also set session storage for immediate access
                        sessionStorage.setItem('ermingtonAuth', 'true');
                        // Show success message
                        alert('Thank you for your purchase! You now have access to all content for 365 days.');
                        // Reload the page to show the content
                        window.location.reload();
                    });
                },
                onError: function(err) {
                    console.error('PayPal Error:', err);
                    alert('There was an error processing your payment. Please try again.');
                }
            }).render('#paypal-button-container')
            .catch(function(error) {
                console.error('PayPal Button Render Error:', error);
                paypalContainer.innerHTML = '<p style="color: red;">Error loading PayPal button. Please refresh the page.</p>';
            });
        } else {
            console.error('PayPal SDK failed to load');
            paypalContainer.innerHTML = '<p style="color: red;">Error loading PayPal. Please refresh the page.</p>';
        }
    };

    paypalScript.onerror = () => {
        console.error('Failed to load PayPal SDK');
        paypalContainer.innerHTML = '<p style="color: red;">Error loading PayPal. Please refresh the page.</p>';
    };

    document.body.appendChild(paypalScript);
}

// Check authentication when page loads
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    disableRightClick();
}); 