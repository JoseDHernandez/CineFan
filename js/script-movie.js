import { getMovieById } from "./api.js";
import { score } from "./score.js";

const IdMovie = new URLSearchParams(window.location.search).get("id"); //Get the id from the URL
const Poster = document.getElementById("Poster-movie"); //Get the movie image element
const GenresMovie = document.getElementById("Genres-movie"); //Get the movie genres element
const Photographs = document.getElementById("Photographs-movie"); //Get the movie photographs element
const ReviewsSection = document.getElementById("Reviews"); //Get the reviews section element
const rating = document.getElementById("rating"); //Get the rating element
const ReviewForm = document.getElementById("ReviewForm"); //Get the review form element
const ReviewBTN = document.getElementById("formBtn"); //Get the review button element
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
    Poster.src = "images/" + movie.poster; //Image path
    Poster.alt = movie.title; //Image alt
    document.getElementById("Title-movie").innerText = movie.title; //Movie title
    document.getElementById("breadcrumb-page").innerText = movie.title; //Breadcrumb page title
    document.getElementById("Date-movie").innerHTML = new Date(
      movie.release_date
    ).toLocaleDateString(); //Movie release date
    GenresMovie.innerHTML = "";
    movie.genres.map((genre) => {
      const genreElement = document.createElement("span");
      genreElement.className = "badge bg-secondary me-1 ";
      genreElement.innerText = genre;
      GenresMovie.appendChild(genreElement);
    }); //Movie genres
    document.getElementById("Director-movie").innerHTML = movie.director; //Movie director
    document.getElementById("Duration-movie").innerHTML = movie.duration; //Movie duration
    document.getElementById("Cast-movie").innerHTML = `<p>${movie.cast.join(
      ", "
    )}</p>`; //Movie cast
    document.getElementById("Trailer-movie").src = movie.trailer; //Movie trailer
    document.getElementById("Rating-movie").innerHTML =
      "<b>Calificaci&oacute;n: </b> " +
      score(movie.score) +
      `(${movie.score == null ? `Sin rese&ntilde;as` : movie.score})`; //Movie score
    document.getElementById("Details-movie").innerHTML = movie.detail;
    document.getElementById("Synopsis-movie").innerText = movie.synopsis; //Movie synopsis
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
    //Print all photographs
    Photographs.innerHTML = "";
    if ("photos" in movie && movie.photos.length > 0) {
      movie.photos.forEach((photograph) => {
        const photographElement = document.createElement("img");
        photographElement.src = "images/" + photograph; //Image path
        photographElement.alt = movie.title; //Image alt
        photographElement.loading = "lazy"; //Lazy load
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
const reviewHTML = (review) => {
  const reviewElement = document.createElement("p");
  reviewElement.innerHTML = `
      <div class="card my-3 shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="mb-0 fw-bold ${
              "movieId" in review ? "text-success" : "text-primary"
            } ">${review.username}</h6>
            <small class="text-body-secondary">${new Date(
              review.date
            ).toLocaleDateString()}</small>
          </div>
          <p class="mb-1">${review.review}</p>
          <div class="text-warning">
            ${score(review.rating)}
          </div>
          ${
            "movieId" in review
              ? `<small class="text-body-secondary">*Pendiente de validaci&oacute;n</small>`
              : ""
          } 
        </div>
      </div>
    `;
  return reviewElement;
};
// Add review to the movie
// View starts based on the score
rating.addEventListener("change", (e) => {
  renderScore(e.target.value);
});
rating.addEventListener("keyup", (e) => {
  renderScore(e.target.value);
});
const renderScore = (e) => {
  if (e >= 0 && e <= 5) document.getElementById("stars").innerHTML = score(e);
};
// Save the review
ReviewForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  ReviewBTN.setAttribute("disabled", true);
  const errorsMessage = document.getElementById("errors");
  errorsMessage.innerHTML = "";
  const regexPatterns = {
    Comment: /^[\wÀ-ÿ\s.,!?¿¡'"()-]{3,300}$/i,
    Score: /^(?:[0-4](?:\.\d)?|5(?:\.0)?)$/,
    Username: /^[a-zA-Z0-9]{1,10}$/,
  };
  const data = {
    Username: document.getElementById("username").value.trim(),
    Comment: document.getElementById("review").value.trim(),
    Score: document.getElementById("rating").value.trim(),
  };
  const errors = [];

  if (!regexPatterns.Username.test(data.Username)) {
    errors.push(
      "El nombre de usuario debe tener hasta 10 caracteres alfanuméricos."
    );
  }

  if (!regexPatterns.Comment.test(data.Comment)) {
    errors.push("El comentario debe tener entre 3 y 300 caracteres válidos.");
  }

  if (!regexPatterns.Score.test(data.Score)) {
    errors.push("La calificación debe ser un número entre 0.0 y 5.0.");
  }
  //If there are errors, show them
  if (errors.length > 0) {
    errorsMessage.className = "alert alert-danger mt-3";
    errorsMessage.innerHTML = `
      <ul class="mb-0">
        ${errors.map((err) => `<li>${err}</li>`).join("")}
      </ul>
    `;
    ReviewBTN.removeAttribute("disabled");
    return;
  }
  errorsMessage.className = "";
  errorsMessage.innerHTML = "";

  // Save the review to sessionStorage
  const review = {
    movieId: IdMovie,
    username: data.Username,
    review: data.Comment,
    rating: parseFloat(data.Score),
    date: new Date().toISOString(),
  };
  const reviews = JSON.parse(sessionStorage.getItem("reviews") || "[]");
  reviews.push(review);
  sessionStorage.setItem("reviews", JSON.stringify(reviews));
  ReviewsSection.appendChild(reviewHTML(review));
  // Clear the form
  document.getElementById("ReviewForm").reset();
  ReviewBTN.removeAttribute("disabled");
});
ViewData();
renderScore(0);
