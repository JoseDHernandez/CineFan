//This function was created by chatgpt
export function score(rating) {
  const estrellasLlenas = Math.floor(rating);
  const tieneMedia = rating % 1 >= 0.25 && rating % 1 < 0.75;
  const estrellasVacías =
    5 - estrellasLlenas - (tieneMedia ? 1 : rating % 1 >= 0.75 ? 0 : 0);
  let html = "";
  // Estrellas llenas
  for (let i = 0; i < estrellasLlenas; i++) {
    html += '<span class="text-warning">★</span>';
  }
  // Media estrella
  if (tieneMedia) {
    html += '<span class="text-warning">⯨</span>';
  } else if (rating % 1 >= 0.75) {
    html += '<span class="text-warning">★</span>';
  }
  // Estrellas vacías
  for (let i = 0; i < estrellasVacías; i++) {
    html += '<span class="text-secondary">☆</span>';
  }
  return html;
}
