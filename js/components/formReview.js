import { score } from "./score.js";
import { reviewHTML } from "./reviewHTML.js";
const rating = document.getElementById("rating"); //Get the rating element
const ReviewForm = document.getElementById("ReviewForm"); //Get the review form element
const ReviewBTN = document.getElementById("formBtn"); //Get the review button element
const IdMovie = new URLSearchParams(window.location.search).get("id");
const ReviewsSection = document.getElementById("Reviews"); //Get the reviews section element
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
renderScore(0);
