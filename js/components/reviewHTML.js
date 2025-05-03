import { score } from "./score.js";
export const reviewHTML = (review) => {
  const reviewElement = document.createElement("div");
  reviewElement.className = `${
    "movieId" in review ? "review-user" : "review"
  } shadow`;
  reviewElement.innerHTML = `
    
  <div class="user">
    <i class="bi bi-person-fill"></i>
    <strong>${review.username}</strong>
  </div>

  <span class="score">
  ${score(review.rating)}
  </span>
  <small class="date">${new Date(
    review.date
  ).toLocaleDateString()}</small></div>
  <p class="body">${review.review}</p>
  <p class="note">
    ${
      "movieId" in review
        ? `<small>*Pendiente de validaci&oacute;n</small>`
        : ""
    } </p>
    `;
  return reviewElement;
};
