import { defineStore } from "pinia";
import { useMoviesStore } from "./moviesStore";
import { logout } from "@/services/authService";

export const useLoginStore = defineStore("login", {
  state: () => ({
    user: null,
    role: null,
    userProfile: null,
    errorMessage: null,
  }),

  actions: {
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
