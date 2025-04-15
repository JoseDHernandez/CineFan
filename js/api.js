const API_URL = "../db.json";
const normalize = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export const getMovies = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    let movies = data.movies; // Access to the movies property of the JSON response
    // Calculate the average score of the movie
    movies.map((movie) => {
      movie.score =
        "reviews" in movie
          ? movie.reviews.reduce((acc, review) => acc + review.rating, 0) /
            movie.reviews.length
          : null;
    });
    return data.movies;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return null;
  }
};

export const getMovieByIndex = async (index) => {
  try {
    const data = await getMovies();
    const movie = data[index]; // Access the movie by index
    return movie || null;
  } catch (error) {
    console.error("Error fetching movie by Index:", error);
  }
};

export const getMovieById = async (id) => {
  try {
    const data = await getMovies();
    const movie = data.find((movie) => movie.id == parseInt(id)); // Find the movie by ID
    return movie || null;
  } catch (error) {
    console.error("Error fetching movie by Index:", error);
  }
};

export const getMoviesByName = async (name) => {
  try {
    const data = await getMovies();
    const search = normalize(name);
    let movies = data.filter(
      (movie) => normalize(movie.title).startsWith(search) // Search for movies that start with the search term
    );
    if (movies.length == 0) {
      movies = data.filter((movie) => normalize(movie.title).includes(search)); //Search for movies that include the search term
    }
    return movies || null;
  } catch (error) {
    console.error("Error fetching movie by name:", error);
  }
};
