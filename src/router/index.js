import ActoresViews from "@/views/actoresViews.vue";
import DetallePelicula from "@/views/detallePelicula.vue";
import GenerosViews from "@/views/generosViews.vue";
import LoginView from "@/views/LoginView.vue";
import PeliculasViews from "@/views/PeliculasViews.vue";
import RegisterView from "@/views/RegisterView.vue";
import store from "@/store";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/peliculas",
    },
    {
      path: "/peliculas",
      component: PeliculasViews,
    },
    {
      path: "/peliculas/:id",
      component: DetallePelicula,
      meta: { requiresAuth: true },
    },
    {
      path: "/actores",
      component: ActoresViews,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/generos",
      component: GenerosViews,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/register",
      component: RegisterView,
    },
    {
      path: "/login",
      component: LoginView,
    },
  ],
});

router.beforeEach((to) => {
  const user = store.state.user;
  const rol = store.state.rol;

  if (to.meta.requiresAuth && !user) {
    store.commit(
      "setErrorMessage",
      "Debes estar logeado para acceder a esta pagina",
    );
    return "/login";
  }

  if (to.meta.requiresAdmin && rol !== "admin") {
    store.commit(
      "setErrorMessage",
      "No tienes autorizacion para ver esta pagina",
    );
    return "/peliculas";
  }
});

export default router;
