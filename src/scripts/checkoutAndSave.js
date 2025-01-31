document.addEventListener('DOMContentLoaded', () => {
    // Get references to various elements in the checkout form
    const purchaseButton = document.getElementById('purchase-button');
    const confirmPurchaseButton = document.getElementById('confirm-purchase-button');
    const checkoutSection = document.getElementById('checkout-section');
    const checkoutForm = document.getElementById('checkout-form');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // Event listener for purchase button
    purchaseButton.addEventListener('click', () => {
        if (loggedInUser) {
            // Pre-fill checkout form with user data if logged in
            checkoutForm['first-name'].value = loggedInUser.firstName;
            checkoutForm['last-name'].value = loggedInUser.lastName;
            checkoutForm['email'].value = loggedInUser.email;
            checkoutForm['address'].value = loggedInUser.address;
            checkoutForm['card-number'].value = loggedInUser.creditCard.cardNumber;
            checkoutForm['expiry-date'].value = loggedInUser.creditCard.expiryDate;
            checkoutForm['cvv'].value = loggedInUser.creditCard.cvv;
        }
        checkoutSection.style.display = 'block'; // Show checkout section
    });

    // Event listener for confirming purchase
    confirmPurchaseButton.addEventListener('click', () => {
        const order = {
            firstName: checkoutForm['first-name'].value,
            lastName: checkoutForm['last-name'].value,
            email: checkoutForm['email'].value,
            address: checkoutForm['address'].value,
            creditCard: {
                cardNumber: checkoutForm['card-number'].value,
                expiryDate: checkoutForm['expiry-date'].value,
                cvv: checkoutForm['cvv'].value
            },
            cake: JSON.parse(localStorage.getItem('currentCake')) // Get current cake from local storage
        };

        // Save order to localStorage or send to the server here
        alert('Purchase complete! Your cake is being prepared and shipped.');
        checkoutSection.style.display = 'none'; // Hide checkout section
    });

    // Event listener for saving custom cake
    const saveButton = document.querySelector('button[type="submit"]');
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        const currentCake = {
            base: document.getElementById('cake-base').value,
            primaryFrosting: document.getElementById('primary-frosting').value,
            secondaryFrosting: document.getElementById('secondary-frosting').value,
            font: document.getElementById('font').value,
            message: document.getElementById('message-short').value || document.getElementById('message-long').value,
            pokeball: document.getElementById('pokeball').value,
            stamps: Array.from(document.querySelectorAll('#pokemon-stamp input[type="checkbox"]:checked')).map(cb => cb.value)
        };

        localStorage.setItem('currentCake', JSON.stringify(currentCake)); // Save current cake to local storage

        if (loggedInUser) {
            // Save custom cake to user account if logged in
            loggedInUser.savedCakes.push(currentCake);
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            localStorage.setItem('user_' + loggedInUser.email, JSON.stringify(loggedInUser));
            alert('Custom cake saved to your account!');
        } else {
            alert('Please log in to save your custom cake.');
        }
    });
});
