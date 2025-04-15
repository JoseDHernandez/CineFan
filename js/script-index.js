import {
  getMovieById,
  getMovieByIndex,
  getMovies,
  getMoviesByName,
} from "./api.js";
import { score } from "./score.js";
//Hero
const HeroSection = document.getElementById("Hero-movie");
const HeroMovieSection = HeroSection.childNodes[1].childNodes[1];
const HeroDataSection = HeroSection.childNodes[3].childNodes;
const HeroMovie = async () => {
  try {
    //Get Movie
    const lengthOfMovies = await getMovies();
    const randomIndex = Math.floor(Math.random() * lengthOfMovies.length);
    const movie = await getMovieByIndex(randomIndex);
    //Set data
    const movieTitle =
      movie.title + ` (${new Date(movie.release_date).getFullYear()})`;
    HeroMovieSection.src = "images/" + movie.poster; //Image path
    HeroMovieSection.alt = movieTitle; //Image alt
    HeroDataSection[1].innerText = movieTitle; //Movie title
    HeroDataSection[3].innerHTML =
      movie.score != null
        ? "<b>Calificaci&oacute;n: </b> " +
          score(movie.score) +
          `(${movie.score})`
        : "&nbsp;"; //Movie score
    HeroDataSection[5].innerText = movie.synopsis; //Movie synopsis
    HeroDataSection[7].children[0].innerText = movie.review; //Movie review
    HeroDataSection[9].href = `./movie.html?id=${movie.id}`; //Movie link
  } catch (error) {
    console.error("Error fetching movie:", error);
  }
};
//Grid
const gridMovies = document.getElementById("Grid-movies");
const ViewAllMovies = async () => {
  try {
    const movies = await getMovies();
    renderMovies(movies); // Render movies in the grid
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};
//Render movies
const renderMovies = (movies) => {
  gridMovies.innerHTML = ""; // Clear the grid before adding new movies
  movies.map((movie) => {
    const movieTitle =
      movie.title + ` (${new Date(movie.release_date).getFullYear()})`;
    const movieElement = document.createElement("a");
    movieElement.className =
      "card text-decoration-none shadow border-0 bg-white rounded-4 overflow-hidden";
    movieElement.style.width = "200px"; // Fija para consistencia
    movieElement.style.transition = "transform 0.2s";
    movieElement.onmouseover = () =>
      (movieElement.style.transform = "scale(1.02)");
    movieElement.onmouseout = () => (movieElement.style.transform = "scale(1)");

    movieElement.innerHTML = `
  <img 
    src="images/${movie.poster}" 
    alt="${movieTitle}" 
    loading="lazy" 
    class="card-img-top rounded-top" 
    style="height: 300px; object-fit: cover;"
  />
  <div class="card-body p-3">
    <h6 class="card-title text-primary text-center mb-1">${movieTitle}</h6>
    <p class="card-text text-center text-warning mb-0" style="font-size: 1.2rem;">
      ${score(movie.score)}
    </p>
  </div>
`;

    movieElement.href = `./movie.html?id=${movie.id}`;

    gridMovies.appendChild(movieElement); // Append the movie element to the grid
  });
};
//Search
let delayTimer;
const searchInput = document.getElementById("title");
const searchButton = document.getElementById("btnSearch");
// Add event listener to the search button
searchButton.addEventListener("click", async () => {
  findMovieByName(event.target.value.trim());
});
// Add event listener to the search input field
searchInput.addEventListener("keyup", async (event) => {
  clearTimeout(delayTimer); // Clear the previous timer
  delayTimer = setTimeout(async () => {
    findMovieByName(event.target.value.trim());
  }, 300);
});
const findMovieByName = async (searchValue) => {
  if (searchValue.length > 0) {
    try {
      const movies = await getMoviesByName(searchValue); // Fetch movies based on the search value
      if (movies == null || movies.length == 0) {
        gridMovies.innerHTML = `<div class="col-12"><p>No se encontr&oacute; alguna pel&iacute;cula por <i>"${searchValue}"</i></p><br><button id="btnResetSearch" class="btn btn-primary">Ver todas las pel&iacute;culas</button></div>`; // Clear the grid if the input is empty
        document
          .getElementById("btnResetSearch")
          .addEventListener("click", () => {
            searchInput.value = "";
            ViewAllMovies();
          });
      } else {
        renderMovies(movies); // Render the filtered movies in the grid
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  } else {
    ViewAllMovies(); // Show all movies if the input is empty
  }
};

HeroMovie();
ViewAllMovies();
