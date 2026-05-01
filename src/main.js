import { createApp } from "vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from "./App.vue";
import router from "./router";
import { VueFire, VueFireFirestoreOptionsAPI } from "vuefire";
import { firebaseApp } from "./firebase/firebase";
import { auth } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserProfile } from "./services/authService";
import { subscribeFavorites } from "./services/favoriteService";
import { createPinia } from "pinia";

import { useLoginStore } from "./stores/loginStore";
import { useMoviesStore } from "./stores/moviesStore";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./assets/css/main.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Toast);

app.use(VueFire, {
  firebaseApp,
  modules: [VueFireFirestoreOptionsAPI()],
});

onAuthStateChanged(auth, async (user) => {
  const loginStore = useLoginStore();
  const moviesStore = useMoviesStore();

  if (user) {
    loginStore.setUser(user);
    const profile = await getUserProfile(user.uid);

    if (profile) {
      loginStore.setUserProfile(profile);
      loginStore.setRole(profile.role);
    } else {
      loginStore.logout();
    }

    subscribeFavorites(user.uid, (favorites) => {
      moviesStore.setFavorites(favorites);
    });
  }
});

app.mount("#app");
