// src/index.js

// Log a message to ensure the script is working
console.log('PokeDelights website is up and running!');

document.addEventListener('DOMContentLoaded', () => {
    const customizeButton = document.querySelector('#customize-button');
    
    if (customizeButton) {
        customizeButton.addEventListener('click', () => {
            alert('Customize your cake!');
        });
    }

    // Fetch Pokémon data from the API and display it
    fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
        .then(response => response.json())
        .then(data => {
            const pokemonList = document.querySelector('#pokemon-list');
            if (pokemonList) {
                data.results.forEach(pokemon => {
                    const listItem = document.createElement('li');
                    listItem.textContent = pokemon.name;
                    pokemonList.appendChild(listItem);
                });
            }
        })
        .catch(error => console.error('Error fetching Pokémon data:', error));
});