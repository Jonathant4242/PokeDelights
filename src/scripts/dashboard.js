document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the logged-in user data from localStorage
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const userFirstNameSpan = document.getElementById('user-first-name');
    const form = document.getElementById('dashboard-form');

    // Check if user data is available
    if (user) {
        // Display the user's first name in the welcome message
        userFirstNameSpan.textContent = user.firstName;

        // Pre-fill the form fields with the user's data
        form['first-name'].value = user.firstName;
        form['last-name'].value = user.lastName;
        form['email'].value = user.email;
        form['address'].value = user.address;
        form['card-number'].value = user.creditCard.cardNumber;
        form['expire-date'].value = user.creditCard.expireDate;
        form['cvv'].value = user.creditCard.cvv;
    } else {
        // If no user data is found, alert the user and redirect to the login page
        alert('No user data found. Please log in.');
        window.location.href = './login.html';
    }

    // Handle form submission to update user information
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Update the user object with the new values from the form
        user.firstName = form['first-name'].value;
        user.lastName = form['last-name'].value;
        user.email = form['email'].value;
        user.address = form['address'].value;
        user.creditCard.cardNumber = form['card-number'].value;
        user.creditCard.expireDate = form['expire-date'].value;
        user.creditCard.cvv = form['cvv'].value;

        // Save the updated user data back to localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        localStorage.setItem('user_' + user.email, JSON.stringify(user));
        alert('Information updated successfully!');
    });

    // Display the user's saved cakes, if any
    const savedCakesContainer = document.getElementById('saved-cakes');
    if (user.savedCakes.length > 0) {
        user.savedCakes.forEach((cake, index) => {
            const cakeDiv = document.createElement('div');
            cakeDiv.textContent = `Cake ${index + 1}: ${JSON.stringify(cake)}`;
            savedCakesContainer.appendChild(cakeDiv);
        });
    } else {
        // If no cakes are saved, display a message
        savedCakesContainer.textContent = 'No saved cakes.';
    }
});

// Function to handle user logout
function logout() {
    // Remove the logged-in user data from localStorage
    localStorage.removeItem('loggedInUser');
    // Redirect to the homepage
    window.location.href = './index.html';
}
