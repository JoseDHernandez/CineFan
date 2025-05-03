import { score } from "./score.js";
export const movieCard = (movie) => {
  const movieTitle = movie.title;
  const movieYear = new Date(movie.release_date).getFullYear();
  const movieElement = document.createElement("a");
  movieElement.className = "movie-card shadow";
  movieElement.innerHTML = `
      <div>
      <span class="movie-card__year">${movieYear}</span>
      <img 
        src="images/${movie.poster}" 
        alt="${movieTitle}" 
        loading="lazy" 
        decoding="async"
        class="movie-card__img" 
      />
      <div class="movie-card__body">
        <p class="movie-card__title"><strong>${movieTitle}</strong></p>
        <div class="movie-card__score">${score(movie.score)}</div>
      </div>
      </div>
    `;
  movieElement.href = `./movie.html?id=${movie.id}`;
  return movieElement;
};
