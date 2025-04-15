import { getMovieById } from "./api.js";
import { score } from "./score.js";

const IdMovie = new URLSearchParams(window.location.search).get("id");
const HeroSection = document.getElementById("Hero-movie");
const Poster = HeroSection.childNodes[1].childNodes[1];
const TitleMovie = document.getElementById("Title-movie");
const DateMovie = document.getElementById("Date-movie");
const RatingMovie = document.getElementById("Rating-movie");
const DetailsMovie = document.getElementById("Details-movie");
const SynopsisMovie = document.getElementById("Synopsis-movie");
const GenresMovie = document.getElementById("Genres-movie");
const DirectorMovie = document.getElementById("Director-movie");
const DurationMovie = document.getElementById("Duration-movie");
const CastMovie = document.getElementById("Cast-movie");
const Photographs = document.getElementById("Photographs-movie");
const ReviewsSection = document.getElementById("Reviews");
const TrailerMovie = document.getElementById("Trailer-movie");
const rating = document.getElementById("rating");
const review = document.getElementById("review");
const stars = document.getElementById("stars");
const ViewData = async () => {
  try {
    const movie = await getMovieById(IdMovie);
    if (movie == null) {
      window.location.href = "./404.html"; //Redirect to index page if movie not found
    }
    //Set data
    document.title = "CineFan | " + movie.title; //Page title
    Poster.src = "images/" + movie.poster; //Image path
    Poster.alt = movie.title; //Image alt
    TitleMovie.innerText = movie.title; //Movie title
    DateMovie.innerHTML = new Date(movie.release_date).toLocaleDateString(); //Movie release date
    GenresMovie.innerHTML = movie.genres.join(", "); //Movie genres
    DirectorMovie.innerHTML = movie.director; //Movie director
    DurationMovie.innerHTML = movie.duration; //Movie duration
    CastMovie.innerHTML = movie.cast.join(", "); //Movie cast
    TrailerMovie.src = movie.trailer; //Movie trailer
    RatingMovie.innerHTML =
      "<b>Calificaci&oacute;n: </b> " +
      score(movie.score) +
      `(${movie.score == null ? `Sin rese&ntilde;as` : movie.score})`; //Movie score
    DetailsMovie.innerHTML = movie.detail;
    SynopsisMovie.innerText = movie.synopsis; //Movie synopsis
    //Print all reviews
    if ("reviews" in movie && movie.reviews.length > 0) {
      movie.reviews.forEach((review) => {
        const reviewElement = document.createElement("p");
        reviewElement.innerHTML = `
      <div class="card my-3 shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="mb-0 fw-bold text-primary">${review.username}</h6>
            <small class="text-muted">${review.date}</small>
          </div>
          <p class="mb-1">${review.review}</p>
          <div class="text-warning">
            ${score(review.rating)}
          </div>
        </div>
      </div>
    `;
        ReviewsSection.appendChild(reviewElement);
      });
    } else {
      const noReviewsElement = document.createElement("p");
      noReviewsElement.innerHTML = `
        <div class="alert alert-warning" role="alert">
          No hay rese&ntilde;as para esta pel&iacute;cula.
        </div>
      `;
      ReviewsSection.appendChild(noReviewsElement);
    }
    //Print all photographs
    if ("photos" in movie && movie.photos.length > 0) {
      movie.photos.forEach((photograph) => {
        const photographElement = document.createElement("img");
        photographElement.src = "images/" + photograph; //Image path
        photographElement.alt = movie.title; //Image alt
        photographElement.className = "img-fluid rounded-start";
        Photographs.appendChild(photographElement);
      });
    } else {
      const noPhotographsElement = document.createElement("p");
      noPhotographsElement.innerHTML = `
        <div class="alert alert-warning" role="alert">
          No hay fotograf&iacute;as para esta pel&iacute;cula.
        </div>
      `;
      Photographs.appendChild(noPhotographsElement);
    }
  } catch (error) {
    console.error("Error fetching movie:", error);
  }
};
// Add review to the movie
rating.addEventListener("change", (e) => {
  renderScore(e.target.value);
});
rating.addEventListener("keyup", (e) => {
  renderScore(e.target.value);
});
const renderScore = (e) => {
  if (e >= 0 && e <= 5) stars.innerHTML = score(e);
};
ViewData();
renderScore(0);
