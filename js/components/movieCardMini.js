export const movieCardMini = (movie) => {
  const movieTitle = movie.title;
  const movieElement = document.createElement("a");
  movieElement.className = "movie-card-mini shadow";
  movieElement.innerHTML = `
      <div>
      <span class="movie-card__year">${movie.score}</span>
      <img 
        src="images/${movie.poster}" 
        alt="${movieTitle}" 
        loading="lazy" 
        decoding="async"
        class="movie-card__img" 
      />
      <div class="movie-card__body">
        <p class="movie-card__title"><strong>${movieTitle}</strong></p>
      </div>
      </div>
    `;
  movieElement.href = `./movie.html?id=${movie.id}`;
  return movieElement;
};
