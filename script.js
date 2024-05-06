const apiKey = 'c51f110e'; // Api Key
const searchInput = document.getElementById('movie-search'); //selecting the input field
const searchResults = document.getElementById('search-results'); // selecting the area where we will be displaying results dynamically.
const movieDetails = document.getElementById('movie-details');
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};// we use debounce to ensure the search happens only after the user has stopped typing.
const fetchSearchResults = async (query) => {//we use sync function as we are using await below.
    if (query.trim() === '') {
        searchResults.innerHTML = '';
        return;
    }
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === 'True') {
            displaySearchResults(data.Search);
        } else {
            searchResults.innerHTML = '<p>No results found</p>';
        }
    } catch (error) {
        console.error('Error fetching movie data:', error);
        searchResults.innerHTML = '<p>Error fetching results</p>';
    }
};

const displaySearchResults = (results) => {
    searchResults.innerHTML = ''; // Clear existing results

    results.forEach((result) => {
        const movieItem = document.createElement('div');
        movieItem.className = 'row justify-content-md-center search-result';
        let shortName = String(result.Title);
        if (shortName.length > 20) {
            shortName = shortName.slice(0, 20);
        }
        const movieTitle = document.createElement('p');
        movieTitle.innerHTML = `<h6>${shortName}    </h6>`;
        movieTitle.className = "col";
        movieTitle.addEventListener('click', () => fetchMovieDetails(result.imdbID));
        const addToFav = document.createElement('button');
        addToFav.id = result.imdbID + "fav";
        addToFav.className = "col col-lg-2 buttonu";
        addToFav.addEventListener('click', () => toggleFavorite(result.imdbID, result.Title));
        addToFav.innerHTML = "Favorite";
        movieItem.appendChild(movieTitle);
        movieItem.appendChild(addToFav);
        searchResults.appendChild(movieItem);

    });
};

const fetchMovieDetails = async (imdbID) => {
    const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.Response === 'True') {
            movieInNewTab(data);//calling another function for showing result in new page.
        } else {
            movieDetails.innerHTML = '<p>Movie details not found</p>';
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
        movieDetails.innerHTML = '<p>Error fetching movie details</p>';
    }
};


const toggleFavorite = (imdbID, title) => {
    let favorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    const favButton = document.getElementById(imdbID + "fav");
    if (favorites.includes(title)) {
        // If already in favorites, remove it
        favorites = favorites.filter((id) => id !== title);
        favButton.innerHTML = "Favorite";
    } else {
        // If not in favorites, add it
        favorites.push(title);
        favButton.innerHTML = "Remove";
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
};




// Initialize the favorite movies and search functionality
searchInput.addEventListener('input', debounce((e) => {
    const query = e.target.value;
    fetchSearchResults(query);}, 500)); // 500 ms debounce

function movieInNewTab(data) {
    location.href = "moviedetail.html" + "?id=" + data.imdbID;
}
