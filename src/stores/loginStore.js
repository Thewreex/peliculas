// VUE Libraries
import { defineStore } from "pinia";
// Stores
import { useMoviesStore } from "./moviesStore";

export const useLoginStore = defineStore("login", {
  // Atributes
  state: () => ({
    user: null,
    role: null,
    userProfile: null,
    errorMessage: null,
  }),
  // Methods
  actions: {
    // Setters
    setUser(user) {
      this.user = user;
    },

    setRole(role) {
      this.role = role;
    },

    setUserProfile(userProfile) {
      this.userProfile = userProfile;
    },

    setErrorMessage(errorMessage) {
      this.errorMessage = errorMessage;
    },

    /**
     * Method executed when the user logs out
     * It is responsible for clearing all user data from the store
     */
    logout() {
      this.user = null;
      this.role = null;
      this.userProfile = null;

      const moviesStore = useMoviesStore();
      moviesStore.favorites = [];
      moviesStore.favoritesId = [];
    },
  },
});
