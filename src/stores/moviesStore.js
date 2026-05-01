// VUE Libraries
import { defineStore } from "pinia";

export const useMoviesStore = defineStore("movies", {
  // Atributes
  state: () => ({
    favorites: [],
    favoritesId: [],
    selectedMovie: null,
  }),
  // Methods
  actions: {
    // Setters
    setMovie(movie) {
      this.selectedMovie = movie;
    },

    setFavorites(favorites) {
      this.favorites = favorites;
      this.favoritesId = favorites.map((f) => f.movieId);
    },
  },
});
