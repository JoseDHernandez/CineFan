import { getMovieById } from "./api.js";
import { score } from "./components/score.js";
import { reviewHTML } from "./components/reviewHTML.js";
import { movieCardMini } from "./components/movieCardMini.js";

const IdMovie = new URLSearchParams(window.location.search).get("id"); //Get the id from the URL
const Poster = document.getElementById("Poster-movie"); //Get the movie image element
const GenresMovie = document.getElementById("Genres-movie"); //Get the movie genres element
const Photographs = document.getElementById("Photographs-movie"); //Get the movie photographs element
const ReviewsSection = document.getElementById("Reviews"); //Get the reviews section element
//Check if the id is valid
if (IdMovie == null || isNaN(IdMovie)) {
  window.location.href = "./404.html";
}
//Get and print the movie data
const ViewData = async () => {
  try {
    const movie = await getMovieById(IdMovie);
    if (movie == null) {
      window.location.href = "./404.html"; //Redirect to index page if movie not found
    }
    //Set data
    document.title = "CineFan | " + movie.title; //Page title
    document.getElementById("breadcrumb-page").innerText = movie.title; //Breadcrumb page title
    Poster.alt = movie.title; //Image alt
    document.getElementById("Title-movie").innerText = movie.title; //Movie title
    document.getElementById("Date-movie").innerHTML = new Date(
      movie.release_date
    ).toLocaleDateString(); //Movie release date
    document.getElementById("Duration-movie").innerHTML = movie.duration; //Movie duration
    document.getElementById("Rating-movie").innerHTML =
      "<b>Calificaci&oacute;n: </b> " +
      score(movie.score) +
      ` (${movie.score == null ? `Sin rese&ntilde;as` : movie.score})`; //Movie score
    document.getElementById("Director-movie").innerHTML = movie.director; //Movie director
    GenresMovie.innerHTML = "";
    movie.genres.map((genre) => {
      const genreElement = document.createElement("span");
      genreElement.className = "badge bg-secondary me-1 ";
      genreElement.innerText = genre;
      GenresMovie.appendChild(genreElement);
    }); //Movie genres
    document.getElementById("Details-movie").innerHTML = movie.detail;
    document.getElementById("Synopsis-movie").innerText = movie.synopsis; //Movie synopsis
    Poster.src = "images/" + movie.poster; //Image path
    document.getElementById("Cast-movie").innerHTML = `<p>${movie.cast.join(
      ", "
    )}</p>`; //Movie cast
    document.getElementById("Trailer-movie").src = movie.trailer; //Movie trailer
    //Print all photographs
    Photographs.innerHTML = "";
    if ("photos" in movie && movie.photos.length > 0) {
      movie.photos.forEach((photograph) => {
        const photographElement = document.createElement("img");
        photographElement.src = "images/" + photograph; //Image path
        photographElement.alt = movie.title; //Image alt
        photographElement.loading = "lazy"; //Lazy load
        photographElement.decoding = "async";
        photographElement.className = "img-fluid";
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
    //Similar's movies
    const selectedRecommendations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      .sort(() => 0.5 - Math.random())
      .slice(0, document.body.getBoundingClientRect().width <= 768 ? 3 : 6);
    // Solicitar los datos de esas 6 películas
    selectedRecommendations.forEach(async (movieId) => {
      try {
        const movieData = await getMovieById(movieId);
        document
          .getElementById("recommendations")
          .appendChild(movieCardMini(movieData));
      } catch (error) {
        console.error("Error loading recommendation:", error);
      }
    });

    //Print all reviews
    const reviewsSessionS = JSON.parse(sessionStorage.getItem("reviews")) || [];
    const filteredReviews = reviewsSessionS.filter(
      (review) => review.movieId === IdMovie
    );
    ReviewsSection.innerHTML = "";
    if ("reviews" in movie && movie.reviews.length > 0) {
      movie.reviews.forEach((review) => {
        ReviewsSection.appendChild(reviewHTML(review));
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
    if (filteredReviews.length > 0) {
      filteredReviews.forEach((review) => {
        ReviewsSection.appendChild(reviewHTML(review));
      });
    }
  } catch (error) {
    console.error("Error fetching movie:", error);
  }
};
ViewData();
//Set the height to gallery
const trailer = document.getElementById("Trailer-movie");
function setHeightFromVideo() {
  if (document.body.getBoundingClientRect().width > 992) {
    Photographs.style.height = trailer.getBoundingClientRect().height + "px";
  } else {
    Photographs.removeAttribute("style");
  }
}
//Get the trailer height
trailer.onload = () => {
  setHeightFromVideo();
};

window.addEventListener("resize", () => {
  setHeightFromVideo();
});
const scrollAmountMouseOver = 5;
let scrollInterval;
const startScroll = (direction) => {
  //Interval for a continuous scroll
  scrollInterval = setInterval(() => {
    Photographs.scrollTop += direction * scrollAmountMouseOver;
  }, 20);
};
//Detect the cursor
document.getElementById("scroll-up").addEventListener("mouseover", () => {
  startScroll(-1);
});
document.getElementById("scroll-down").addEventListener("mouseover", () => {
  startScroll(1);
});
//Stop scroll
const stopScroll = () => {
  clearInterval(scrollInterval);
};
document.getElementById("scroll-up").addEventListener("mouseout", stopScroll);
document.getElementById("scroll-down").addEventListener("mouseout", stopScroll);
