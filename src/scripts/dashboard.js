document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const userFirstNameSpan = document.getElementById('user-first-name');
    const form = document.getElementById('dashboard-form');

    if (user) {
        userFirstNameSpan.textContent = user.firstName;
        form['first-name'].value = user.firstName;
        form['last-name'].value = user.lastName;
        form['email'].value = user.email;
        form['address'].value = user.address;
        form['card-number'].value = user.creditCard.cardNumber;
        form['expire-date'].value = user.creditCard.expireDate;
        form['cvv'].value = user.creditCard.cvv;
    } else {
        alert('No user data found. Please log in.');
        window.location.href = './login.html';
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        user.firstName = form['first-name'].value;
        user.lastName = form['last-name'].value;
        user.email = form['email'].value;
        user.address = form['address'].value;
        user.creditCard.cardNumber = form['card-number'].value;
        user.creditCard.expireDate = form['expire-date'].value;
        user.creditCard.cvv = form['cvv'].value;

        localStorage.setItem('loggedInUser', JSON.stringify(user));
        localStorage.setItem(user.email, JSON.stringify(user));
        alert('Information updated successfully!');
    });

    // Display saved cakes if any
    const savedCakesContainer = document.getElementById('saved-cakes');
    if (user.savedCakes.length > 0) {
        user.savedCakes.forEach((cake, index) => {
            const cakeDiv = document.createElement('div');
            cakeDiv.textContent = `Cake ${index + 1}: ${JSON.stringify(cake)}`;
            savedCakesContainer.appendChild(cakeDiv);
        });
    } else {
        savedCakesContainer.textContent = 'No saved cakes.';
    }
});

function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = './index.html';
}
