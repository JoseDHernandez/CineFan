import {
  getMoviesByCategory,
  getMovieByIndex,
  getMovies,
  getMoviesByName,
  allCategories,
} from "./api.js";
import { movieCard } from "./components/movieCard.js";
import { score } from "./components/score.js";

/* All  constants of Dom elements*/
const HeroSection = document.getElementById("Hero-movie"); // Get the Hero section
const HeroMovieSection = HeroSection.childNodes[1].childNodes[1]; // Get the movie image
const HeroDataSection = HeroSection.childNodes[3].childNodes; // Get the data section of the movie
const categorySelect = document.getElementById("categories"); // Get the category select element
const gridMovies = document.getElementById("Grid-movies"); // Get the grid section for movies
const searchInput = document.getElementById("title"); // Get the search input field
const searchButton = document.getElementById("btnSearch"); // Get the search button
/*All arrow functions*/
//Hero movie: show a random movie in the hero section
const HeroMovie = async () => {
  try {
    //Get Movie
    const lengthOfMovies = await getMovies();
    const movie = await getMovieByIndex(
      Math.floor(Math.random() * lengthOfMovies.length)
    );
    //Set data
    const movieTitle =
      movie.title + ` (${new Date(movie.release_date).getFullYear()})`;
    HeroDataSection[1].innerText = movieTitle; //Movie title
    HeroDataSection[3].innerHTML =
      movie.score != null
        ? "<b>Calificaci&oacute;n: </b> " +
          score(movie.score) +
          ` (${movie.score})`
        : "&nbsp;"; //Movie score

    document.getElementById("Synopsis").innerHTML = `<p>${movie.synopsis}</p>`; //Movie synopsis
    document.getElementById("Quote").innerHTML = `<q>${movie.review}</q>`; //Movie review
    document.getElementById("btnDetails").href = `./movie.html?id=${movie.id}`; //Movie link
    HeroMovieSection.src = "images/" + movie.poster; //Image path
    HeroMovieSection.alt = movieTitle; //Image alt
  } catch (error) {
    console.error("Error fetching movie:", error);
  }
};
// Print all movies in the grid
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
    gridMovies.appendChild(movieCard(movie));
  });
};
/*Search and filter functions*/
let delayTimer; // Timer for debounce
//Events listener for the search button and the search input field
searchButton.addEventListener("click", async () => {
  findMovieByName(event.target.value.trim());
});
searchInput.addEventListener("keyup", async (event) => {
  clearTimeout(delayTimer); // Clear the previous timer
  delayTimer = setTimeout(async () => {
    findMovieByName(event.target.value.trim());
  }, 300);
});
// Function to find movies by name
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
// Get and set categories
const setCategories = async () => {
  try {
    const categories = await allCategories();
    //console.log(categories)
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};
// Event listener for category selection
categorySelect.addEventListener("change", async (event) => {
  const selectedCategory = event.target.value;
  if (selectedCategory != 0) {
    try {
      const movies = await getMoviesByCategory(selectedCategory);
      renderMovies(movies); // Render the filtered movies in the grid
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  } else {
    ViewAllMovies(); // Show all movies if no category is selected
  }
});

/*Call all arrow functions*/
HeroMovie();
ViewAllMovies();
setCategories();
