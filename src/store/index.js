import { createStore } from "vuex";

export default createStore({
  state: {
    user: null,
    rol: null,
    userProfile: null,
    errorMessage: null,
    favoritos: [],
    favoritosId: [],
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },

    setRol(state, rol) {
      state.rol = rol;
    },

    setUserProfile(state, profile) {
      state.userProfile = profile;
    },

    logout(state) {
      ((state.user = null),
        (state.rol = null),
        (state.userProfile = null),
        (state.favoritos = []),
        (state.favoritosId = []));
    },

    setErrorMessage(state, message) {
      state.errorMessage = message;
    },

    setFavoritos(state, favoritos) {
      state.favoritos = favoritos;
      state.favoritosId = favoritos.map((f) => f.peliculaId);
    },
  },
});
