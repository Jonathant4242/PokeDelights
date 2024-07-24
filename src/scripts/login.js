document.addEventListener('DOMContentLoaded', () => {
    // Registration form handler
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
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
            
            localStorage.setItem('user_' + user.email, JSON.stringify(user));
            alert('Registration successful!');
            
            window.location.href = './dashboard.html';
        });
    }

    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = this['email'].value;
            const password = this['password'].value;
            
            const storedUser = JSON.parse(localStorage.getItem('user_' + email));
            
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
            localStorage.removeItem('loggedInUser');
            window.location.href = './index.html';
        });
    }

    // Display the correct navigation links based on login status
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const loginLink = document.getElementById('login-link');
    const dashboardLink = document.getElementById('dashboard-link');

    if (loggedInUser) {
        if (loginLink) loginLink.style.display = 'none';
        if (dashboardLink) dashboardLink.style.display = 'inline';
        if (logoutLink) logoutLink.style.display = 'inline';
    } else {
        if (loginLink) loginLink.style.display = 'inline';
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'none';
    }
});
