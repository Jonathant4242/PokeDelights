document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('cake-gallery');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const searchBar = document.getElementById('search-bar');
    const cakeCount = 50;
    const cakesPerPage = { large: 10, medium: 8, small: 5 };
    let currentPage = 1;
    let searchQuery = '';

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
                imgSrc: 'https://via.placeholder.com/200x200'
            };
            allCakes.push(cake);
        }
        return allCakes;
    }

    const allCakes = generateAllCakes();

    // Function to render cakes
    function renderCakes() {
        const cakesPerPage = getCakesPerPage();
        const filteredCakes = allCakes.filter(cake => cake.name.toLowerCase().includes(searchQuery.toLowerCase()));
        const start = (currentPage - 1) * cakesPerPage;
        const end = start + cakesPerPage;
        gallery.innerHTML = '';

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

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage * cakesPerPage >= filteredCakes.length;
    }

    // Event listeners for buttons
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderCakes();
        }
    });

    nextBtn.addEventListener('click', () => {
        const cakesPerPage = getCakesPerPage();
        if (currentPage * cakesPerPage < allCakes.filter(cake => cake.name.toLowerCase().includes(searchQuery.toLowerCase())).length) {
            currentPage++;
            renderCakes();
        }
    });

    // Event listener for search bar
    searchBar.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        currentPage = 1; // Reset to first page on new search
        renderCakes();
    });

    // Initial render
    renderCakes();

    // Re-render on window resize to adjust number of cakes per page
    window.addEventListener('resize', renderCakes);
});