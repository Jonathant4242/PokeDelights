document.addEventListener('DOMContentLoaded', () => {
    // Get references to HTML elements
    const gallery = document.getElementById('cake-gallery');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const searchBar = document.getElementById('search-bar');

    // Constants
    const cakeCount = 50; // Total number of cakes
    const cakesPerPage = { large: 10, medium: 8, small: 5 }; // Number of cakes per page based on screen size
    let currentPage = 1; // Current page number
    let searchQuery = ''; // Search query for filtering cakes

    // Function to get the number of cakes per page based on screen size
    function getCakesPerPage() {
        if (window.innerWidth <= 600) return cakesPerPage.small;
        if (window.innerWidth <= 900) return cakesPerPage.medium;
        return cakesPerPage.large;
    }

    // Function to generate all cakes
    function generateAllCakes() {
        const allCakes = [];
        for (let i = 1; i <= cakeCount; i++) {
            const cake = {
                id: i,
                name: `Pokémon Cake ${i}`,
                imgSrc: 'https://via.placeholder.com/200x200' // Placeholder image source
            };
            allCakes.push(cake);
        }
        return allCakes;
    }

    const allCakes = generateAllCakes(); // Generate all cakes once

    // Function to render cakes in the gallery
    function renderCakes() {
        const cakesPerPage = getCakesPerPage(); // Get number of cakes per page based on screen size
        const filteredCakes = allCakes.filter(cake => cake.name.toLowerCase().includes(searchQuery.toLowerCase())); // Filter cakes based on search query
        const start = (currentPage - 1) * cakesPerPage;
        const end = start + cakesPerPage;
        gallery.innerHTML = ''; // Clear the gallery

        // Loop through the cakes and add them to the gallery
        for (let i = start; i < end && i < filteredCakes.length; i++) {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            
            const img = document.createElement('img');
            img.src = filteredCakes[i].imgSrc;
            img.alt = filteredCakes[i].name;
            
            const caption = document.createElement('p');
            caption.textContent = filteredCakes[i].name;
            
            galleryItem.appendChild(img);
            galleryItem.appendChild(caption);
            gallery.appendChild(galleryItem);
        }

        // Enable/disable previous and next buttons
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage * cakesPerPage >= filteredCakes.length;
    }

    // Event listener for the previous button
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderCakes();
        }
    });

    // Event listener for the next button
    nextBtn.addEventListener('click', () => {
        const cakesPerPage = getCakesPerPage();
        if (currentPage * cakesPerPage < allCakes.filter(cake => cake.name.toLowerCase().includes(searchQuery.toLowerCase())).length) {
            currentPage++;
            renderCakes();
        }
    });

    // Event listener for the search bar
    searchBar.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        currentPage = 1; // Reset to first page on new search
        renderCakes();
    });

    // Initial render of cakes
    renderCakes();

    // Re-render cakes on window resize to adjust number of cakes per page
    window.addEventListener('resize', renderCakes);
});
