import ActoresViews from "@/views/actoresViews.vue";
import DetallePelicula from "@/views/detallePelicula.vue";
import GenerosViews from "@/views/generosViews.vue";
import LoginView from "@/views/LoginView.vue";
import PeliculasViews from "@/views/PeliculasViews.vue";
import RegisterView from "@/views/RegisterView.vue";
import { useLoginStore } from "@/stores/loginStore";
import { getCurrentUser, getUserRol } from "@/services/authService";
import { createRouter, createWebHistory } from "vue-router";
import FormularioViews from "@/views/formularioViews.vue";

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
      path: "/ingreso",
      component: FormularioViews,
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

router.beforeEach(async (to) => {
  const loginStore = useLoginStore();
  const user = await getCurrentUser();
  let rol = loginStore.role;

  if (user && !rol) {
    rol = await getUserRol(user.uid);
    loginStore.setRole(rol);
  }

  if (to.meta.requiresAuth && !user) {
    loginStore.setErrorMessage(
      "Debes estar logeado para acceder a esta pagina",
    );
    return "/login";
  }

  if (to.meta.requiresAdmin && rol !== "admin") {
    loginStore.setErrorMessage("No tienes autorizacion para ver esta pagina");
    return "/peliculas";
  }
});

export default router;
