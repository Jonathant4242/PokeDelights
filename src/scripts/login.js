document.addEventListener('DOMContentLoaded', () => {
    // Registration form handler
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Collect user data from the registration form
            const user = {
                firstName: this['first-name'].value,
                lastName: this['last-name'].value,
                email: this['email'].value,
                address: this['address'].value,
                creditCard: {
                    cardNumber: this['card-number'].value,
                    expireDate: this['expire-date'].value,
                    cvv: this['cvv'].value
                },
                savedCakes: [] // Initialize with an empty array
            };
            
            // Store user data in localStorage
            localStorage.setItem('user_' + user.email, JSON.stringify(user));
            alert('Registration successful!');
            
            // Redirect to the dashboard page after successful registration
            window.location.href = './dashboard.html';
        });
    }

    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Collect login data from the login form
            const email = this['email'].value;
            const password = this['password'].value;
            
            // Retrieve stored user data from localStorage
            const storedUser = JSON.parse(localStorage.getItem('user_' + email));
            
            // Check if stored user exists and password matches
            if (storedUser && password === 'password') { // For simplicity, checking against a static password
                localStorage.setItem('loggedInUser', JSON.stringify(storedUser));
                alert('Login successful!');
                window.location.href = './dashboard.html';
            } else {
                alert('Invalid email or password.');
            }
        });
    }

    // Handle logout functionality
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();
            // Remove logged-in user data from localStorage
            localStorage.removeItem('loggedInUser');
            window.location.href = './index.html';
        });
    }

    // Display the correct navigation links based on login status
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const loginLink = document.getElementById('login-link');
    const dashboardLink = document.getElementById('dashboard-link');

    if (loggedInUser) {
        // Hide the login link and show the dashboard and logout links
        if (loginLink) loginLink.style.display = 'none';
        if (dashboardLink) dashboardLink.style.display = 'inline';
        if (logoutLink) logoutLink.style.display = 'inline';
    } else {
        // Show the login link and hide the dashboard and logout links
        if (loginLink) loginLink.style.display = 'inline';
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'none';
    }
});
