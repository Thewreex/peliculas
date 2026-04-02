import { createApp } from "vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { VueFire, VueFireFirestoreOptionsAPI } from "vuefire";
import { firebaseApp } from "./firebase/firebase";
import { auth } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserProfile } from "./services/authService";
import { subscribeFavoritos } from "./services/favoritoService";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./assets/css/main.css";

const app = createApp(App);

app.use(router);
app.use(store);
app.use(Toast);

app.use(VueFire, {
  firebaseApp,
  modules: [VueFireFirestoreOptionsAPI()],
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    store.commit("setUser", user);
    const profile = await getUserProfile(user.uid);

    if (profile) {
      store.commit("setUserProfile", profile);
      store.commit("setRol", profile.rol);
    } else {
      store.commit("logout");
    }

    subscribeFavoritos(user.uid, (favoritos) => {
      store.commit("setFavoritos", favoritos);
    });
  }
});

app.mount("#app");
