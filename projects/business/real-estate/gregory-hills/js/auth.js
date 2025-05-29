// Password protection for Gregory Hills real estate pages
const PASSWORD = 'nodramas23';

function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('gregoryHillsAuth');
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

    button.onclick = () => {
        if (input.value === PASSWORD) {
            sessionStorage.setItem('gregoryHillsAuth', 'true');
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
    loginContainer.appendChild(loginForm);
    document.body.appendChild(loginContainer);
}

// Check authentication when page loads
document.addEventListener('DOMContentLoaded', checkAuth); 