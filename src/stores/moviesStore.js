import { defineStore } from "pinia";

export const useMoviesStore = defineStore("movies", {
  state: () => ({
    favorites: [],
    favoritesId: [],
    selectedMovie: null,
  }),

  actions: {
    setMovie(movie) {
      this.selectedMovie = movie;
    },

    setFavorites(favorites) {
      this.favorites = favorites;
      this.favoritesId = favorites.map((f) => f.peliculaId);
    },
  },
});
