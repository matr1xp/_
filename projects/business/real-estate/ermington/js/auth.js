// Password protection for Ermington real estate pages
import { CONFIG } from './config.js';

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Customize right-click menu to only show Print option
function customizeContextMenu() {
    document.addEventListener('contextmenu', (e) => {
        // Prevent the default context menu
        e.preventDefault();
        
        // Create custom context menu
        const contextMenu = document.createElement('div');
        contextMenu.style.cssText = `
            position: fixed;
            left: ${e.pageX}px;
            top: ${e.pageY}px;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
            padding: 5px 0;
            z-index: 1000;
        `;

        // Add Print option
        const printOption = document.createElement('div');
        printOption.textContent = 'Print...';
        printOption.style.cssText = `
            padding: 5px 20px;
            cursor: pointer;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        printOption.onmouseover = () => printOption.style.backgroundColor = '#f0f0f0';
        printOption.onmouseout = () => printOption.style.backgroundColor = 'white';
        printOption.onclick = () => {
            window.print();
            document.body.removeChild(contextMenu);
        };

        contextMenu.appendChild(printOption);
        document.body.appendChild(contextMenu);

        // Remove context menu when clicking elsewhere
        const removeMenu = (e) => {
            if (!contextMenu.contains(e.target)) {
                document.body.removeChild(contextMenu);
                document.removeEventListener('click', removeMenu);
            }
        };
        document.addEventListener('click', removeMenu);
    });
}

function setAuthCookie() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 365); // 365 days from now
    document.cookie = `${CONFIG.AUTH.COOKIE_NAME}=${CONFIG.AUTH.PASSWORD_HASH}; expires=${expiryDate.toUTCString()}; path=/`;
}

function checkAuth() {
    // Skip authentication for index.html
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        return;
    }

    // Check for auth cookie
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(c => c.trim().startsWith(`${CONFIG.AUTH.COOKIE_NAME}=`));
    const hasAuthCookie = authCookie && authCookie.split('=')[1] === CONFIG.AUTH.PASSWORD_HASH;
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

    const infoText = document.createElement('p');
    infoText.textContent = 'Please enter your password or purchase to continue.';
    infoText.style.cssText = `
        color: #666;
        margin-bottom: 1.5rem;
        font-size: 14px;
        text-align: center;
    `;

    const input = document.createElement('input');
    input.type = 'password';
    input.placeholder = 'Enter password';
    input.style.cssText = `
        padding: 0.5rem;
        margin: 0.5rem 0.5rem 0.5rem 0;
        width: 200px;
        border: 1px solid #ddd;
        border-radius: 4px;
        display: inline-block;
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
        margin: 0.5rem 0;
        display: inline-block;
        vertical-align: top;
    `;

    const errorMsg = document.createElement('p');
    errorMsg.style.color = 'red';
    errorMsg.style.display = 'none';

    // Create PayPal button container
    const paypalContainer = document.createElement('div');
    paypalContainer.id = 'paypal-button-container';
    paypalContainer.style.marginTop = '1rem';

    button.onclick = async () => {
        const userInput = input.value.trim();
        const inputHash = await hashPassword(userInput);
        if (inputHash === CONFIG.AUTH.PASSWORD_HASH) {
            sessionStorage.setItem('ermingtonAuth', 'true');
            window.location.reload();
        } else {
            errorMsg.textContent = 'Incorrect password';
            errorMsg.style.display = 'block';
        }
    };

    loginForm.appendChild(title);
    loginForm.appendChild(infoText);
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
    customizeContextMenu();
}); 
