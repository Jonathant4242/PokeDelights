document.addEventListener('DOMContentLoaded', () => {
    // Get references to various elements in the form
    const primaryFrostingInput = document.getElementById('primary-frosting');
    const secondaryFrostingInput = document.getElementById('secondary-frosting');
    const primaryColorDisplay = document.getElementById('primary-color-display');
    const secondaryColorDisplay = document.getElementById('secondary-color-display');
    const primaryColorRGB = document.getElementById('primary-color-rgb');
    const secondaryColorRGB = document.getElementById('secondary-color-rgb');
    const cakeBaseSelect = document.getElementById('cake-base');
    const pokeballSelect = document.getElementById('pokeball');
    const fontSelect = document.getElementById('font');
    const messageShort = document.getElementById('message-short');
    const messageLong = document.getElementById('message-long');
    const previewButton = document.getElementById('preview-button');
    const purchaseButton = document.getElementById('purchase-button');
    const messagePreview = document.getElementById('message-preview');
    const form = document.getElementById('custom-cake-form');
    const totalPriceDiv = document.getElementById('total-price');
    const messageLengthRadios = document.getElementsByName('message-length');
    const pokemonSearch = document.getElementById('pokemon-search');
    const pokemonList = document.getElementById('pokemon-list');
    const pokemonTypeSelect = document.getElementById('pokemon-type');
    const pokemonImageContainer = document.getElementById('pokemon-image-container');
    const pokemonStampCheckboxes = document.querySelectorAll('#pokemon-stamp input[type="checkbox"]');

    let allPokemon = [];

    // Fetch and populate Pokémon types
    fetch('https://pokeapi.co/api/v2/type')
        .then(response => response.json())
        .then(data => {
            data.results.forEach(type => {
                const option = document.createElement('option');
                option.value = type.name;
                option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
                pokemonTypeSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching Pokémon types:', error));

    // Fetch and populate Pokémon list
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        .then(response => response.json())
        .then(data => {
            const promises = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
            Promise.all(promises).then(pokemonData => {
                allPokemon = pokemonData;
                updatePokemonList(allPokemon);
            });
        })
        .catch(error => console.error('Error fetching Pokémon:', error));

    // Update Pokémon list based on fetched data
    function updatePokemonList(pokemon) {
        pokemonList.innerHTML = '';
        pokemon.forEach(p => {
            const option = document.createElement('option');
            option.value = p.name;
            option.textContent = p.name.charAt(0).toUpperCase() + p.name.slice(1);
            option.dataset.url = p.sprites.front_default;
            pokemonList.appendChild(option);
        });
    }

    // Display selected Pokémon image
    function displayPokemonImage(pokemon) {
        pokemonImageContainer.innerHTML = `<img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">`;
    }

    // Filter Pokémon based on search query and selected types
    function filterPokemon() {
        let filteredPokemon = allPokemon;

        const searchQuery = pokemonSearch.value.toLowerCase().trim();
        if (searchQuery) {
            filteredPokemon = filteredPokemon.filter(p => p.name.includes(searchQuery));
        }

        const selectedTypes = Array.from(pokemonTypeSelect.selectedOptions).map(option => option.value);
        if (selectedTypes.length > 0) {
            filteredPokemon = filteredPokemon.filter(p => {
                return selectedTypes.every(type => p.types.some(t => t.type.name === type));
            });
        }

        updatePokemonList(filteredPokemon);
    }

    // Update the color display based on the selected frosting colors
    function updateColorDisplay() {
        primaryColorDisplay.style.backgroundColor = primaryFrostingInput.value;
        primaryColorRGB.textContent = primaryFrostingInput.value;
        secondaryColorDisplay.style.backgroundColor = secondaryFrostingInput.value;
        secondaryColorRGB.textContent = secondaryFrostingInput.value;
    }

    // Event listeners for filtering Pokémon
    pokemonSearch.addEventListener('input', filterPokemon);
    pokemonTypeSelect.addEventListener('change', filterPokemon);

    // Event listener for displaying selected Pokémon image
    pokemonList.addEventListener('change', () => {
        const selectedPokemon = pokemonList.value;
        const selectedPokemonData = allPokemon.find(p => p.name === selectedPokemon);
        displayPokemonImage(selectedPokemonData);
    });

    // Event listeners for updating color display
    primaryFrostingInput.addEventListener('input', updateColorDisplay);
    secondaryFrostingInput.addEventListener('input', updateColorDisplay);

    // Initial color display update
    updateColorDisplay();

    // Calculate total price based on selected options
    function calculateTotalPrice() {
        let totalPrice = 0;

        const selectedCakeBase = cakeBaseSelect.options[cakeBaseSelect.selectedIndex];
        const selectedPokeball = pokeballSelect.options[pokeballSelect.selectedIndex];
        const selectedPokemonStamps = Array.from(pokemonStampCheckboxes).filter(cb => cb.checked);

        totalPrice += parseFloat(selectedCakeBase.dataset.price);
        totalPrice += parseFloat(selectedPokeball.dataset.price);
        selectedPokemonStamps.forEach(stamp => {
            totalPrice += parseFloat(stamp.dataset.price);
        });

        const message = getCurrentMessage().replace(/_/g, '');
        if (message.length > 20) {
            totalPrice += (message.length - 20); // $1 per letter after the first 20 characters
        }

        totalPriceDiv.textContent = `Total Price: $${totalPrice}`;
    }

    // Get the current custom message
    function getCurrentMessage() {
        return messageShort.style.display === 'none' ? messageLong.value : messageShort.value;
    }

    // Format the custom message to fit within line limits
    function formatMessage(text, maxLineLength) {
        let lines = [];
        let line = '';

        for (let i = 0; i < text.length; i++) {
            if (text[i] === '_') {
                lines.push(line);
                line = '';
            } else {
                if (line.length >= maxLineLength) {
                    lines.push(line);
                    line = '';
                }
                line += text[i];
            }
        }
        if (line.length > 0) lines.push(line);

        return lines.join('_');
    }

    // Handle input for formatting custom message
    function handleInput(event) {
        const maxLineLength = event.target.id === 'message-short' ? 15 : 20;
        const formattedMessage = formatMessage(event.target.value, maxLineLength);
        event.target.value = formattedMessage;
    }

    // Preview the custom message
    function previewMessage() {
        const message = getCurrentMessage().replace(/_/g, '\n');
        messagePreview.innerHTML = `<pre style="font-family: ${fontSelect.value};">${message}</pre>`;
    }

    // Event listeners for custom message length options
    messageLengthRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'short') {
                messageShort.style.display = 'block';
                messageLong.style.display = 'none';
            } else {
                messageShort.style.display = 'none';
                messageLong.style.display = 'block';
            }
            calculateTotalPrice();
        });
    });

    // Event listeners for custom message input
    messageShort.addEventListener('input', handleInput);
    messageLong.addEventListener('input', handleInput);

    // Event listener for form changes to recalculate the total price
    form.addEventListener('change', calculateTotalPrice);

    // Event listener for preview button
    previewButton.addEventListener('click', () => {
        previewMessage();
        calculateTotalPrice();
    });

    // Event listener for purchase button
    purchaseButton.addEventListener('click', () => {
        const message = getCurrentMessage();
        if (message.length > 50) {
            const confirmPurchase = confirm('You have exceeded the recommended text length. Do you agree to proceed?');
            if (!confirmPurchase) {
                return;
            }
        }
        alert('Purchase complete!');
        // Handle the purchase action here
    });

    // Event listener for form submission to save custom cake
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Custom cake saved!');
        // Save the custom cake details to localStorage or handle submission here
    });

    // Initial total price calculation
    calculateTotalPrice();
});
