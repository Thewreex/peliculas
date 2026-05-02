// Views
import ActorsView from "@/views/ActorsView.vue";
import MovieDetail from "@/views/MovieDetail.vue";
import GenresView from "@/views/GenresView.vue";
import LoginView from "@/views/LoginView.vue";
import MoviesView from "@/views/MoviesView.vue";
import RegisterView from "@/views/RegisterView.vue";
import FormView from "@/views/FormView.vue";
// Stores
import { useLoginStore } from "@/stores/loginStore";
// Services
import { getCurrentUser, getUserRole } from "@/services/authService";
// Router
import { createRouter, createWebHistory } from "vue-router";
// Toast
import { useToast } from "vue-toastification";

// Routes
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/peliculas",
    },
    {
      path: "/peliculas",
      component: MoviesView,
    },
    {
      path: "/peliculas/:id",
      component: MovieDetail,
    },
    {
      path: "/actores",
      component: ActorsView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/generos",
      component: GenresView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/ingreso",
      component: FormView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/registrar",
      component: RegisterView,
    },
    {
      path: "/login",
      component: LoginView,
    },
  ],
});

/**

* Navigation guard to restrict access to routes based on user roles
* Retrieves user data from the store and the database
* If the role is not found in the store, it fetches it from the database
* If a user does not meet the required role to access a page, they will be redirected with an error message
  */

router.beforeEach(async (to) => {
  const loginStore = useLoginStore();
  const user = await getCurrentUser();
  const toast = useToast();
  let rol = loginStore.role;

  if (user && !rol) {
    rol = await getUserRole(user.uid);
    loginStore.setRole(rol);
  }

  if (to.meta.requiresAuth && !user) {
    toast.warning("Debes estar logueado para acceder a esta página");
    return "/login";
  }

  if (to.meta.requiresAdmin && rol !== "admin") {
    toast.warning("No tienes autorización para ver esta página.");
    return "/peliculas";
  }
});

export default router;
