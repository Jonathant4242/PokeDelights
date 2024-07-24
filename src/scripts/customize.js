document.addEventListener('DOMContentLoaded', () => {
    const pokemonFlavorSelect = document.getElementById('pokemon-flavor');
    const pokemonStampSelect = document.getElementById('pokemon-stamp');
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

    let allPokemon = [];

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

    function displayPokemonImage(pokemon) {
        pokemonImageContainer.innerHTML = `<img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">`;
    }

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

    pokemonSearch.addEventListener('input', filterPokemon);

    pokemonTypeSelect.addEventListener('change', filterPokemon);

    pokemonList.addEventListener('change', () => {
        const selectedPokemon = pokemonList.value;
        const selectedPokemonData = allPokemon.find(p => p.name === selectedPokemon);
        displayPokemonImage(selectedPokemonData);
    });

    function calculateTotalPrice() {
        let totalPrice = 0;

        const selectedCakeBase = cakeBaseSelect.options[cakeBaseSelect.selectedIndex];
        const selectedPokemonFlavor = pokemonFlavorSelect.options[pokemonFlavorSelect.selectedIndex];
        const selectedPokeball = pokeballSelect.options[pokeballSelect.selectedIndex];
        const selectedPokemonStamp = pokemonStampSelect.options[pokemonStampSelect.selectedIndex];

        totalPrice += parseFloat(selectedCakeBase.dataset.price);
        totalPrice += parseFloat(selectedPokemonFlavor.dataset.price);
        totalPrice += parseFloat(selectedPokeball.dataset.price);
        totalPrice += parseFloat(selectedPokemonStamp.dataset.price);

        const message = getCurrentMessage().replace(/_/g, '');
        if (message.length > 20) {
            totalPrice += (message.length - 20); // $1 per letter after the first 20 characters
        }

        totalPriceDiv.textContent = `Total Price: $${totalPrice}`;
    }

    function getCurrentMessage() {
        return messageShort.style.display === 'none' ? messageLong.value : messageShort.value;
    }

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

    function handleInput(event) {
        const maxLineLength = event.target.id === 'message-short' ? 15 : 20;
        const formattedMessage = formatMessage(event.target.value, maxLineLength);
        event.target.value = formattedMessage;
    }

    function previewMessage() {
        const message = getCurrentMessage().replace(/_/g, '\n');
        messagePreview.innerHTML = `<pre style="font-family: ${fontSelect.value};">${message}</pre>`;
    }

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

    messageShort.addEventListener('input', handleInput);
    messageLong.addEventListener('input', handleInput);

    form.addEventListener('change', calculateTotalPrice);
    previewButton.addEventListener('click', () => {
        previewMessage();
        calculateTotalPrice();
    });

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

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Custom cake saved!');
        // Save the custom cake details to localStorage or handle submission here
    });

    calculateTotalPrice(); // Initial calculation
});
