<!-- MovieDetail Component -->

<template>
  <!-- Skeleton Loader -->
  <div v-if="loading" class="mb-5 pb-5 container animate-pulse">
    <h2 class="text-center my-5 py-5 placeholder-glow">
      <span class="placeholder col-6 py-4 rounded"></span>
    </h2>

    <div class="row justify-content-around">
      <div class="col-md-5 placeholder-glow mb-4">
        <div class="placeholder rounded w-100" style="height: 600px"></div>
      </div>

      <div class="col-md-5">
        <div class="placeholder-glow">
          <p><span class="placeholder col-4 py-3"></span></p>
          <h5 class="placeholder col-3"></h5>
          <ul class="list-group list-group-flush mb-4">
            <li class="list-group-item border-0 p-0 mb-2" v-for="n in 3">
              <span class="placeholder col-8"></span>
            </li>
          </ul>

          <h5 class="placeholder col-2"></h5>
          <p>
            <span class="placeholder col-12"></span>
            <br />
            <span class="placeholder col-10"></span>
            <br />
            <span class="placeholder col-11"></span>
          </p>

          <h5 class="placeholder col-3 mt-4"></h5>
          <div class="placeholder rounded w-100" style="height: 150px"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Detali Container -->
  <div class="mb-5 pb-5" v-else-if="movie">
    <h2 class="text-center my-5 py-5 display-5 fw-bold">
      {{ movie.name }}
    </h2>
    <!-- Movie Trailer -->
    <div v-if="trailerKey" class="my-5">
      <h5 class="fw-bold mb-3">Tráiler oficial</h5>
      <div class="ratio ratio-16x9 shadow-sm rounded overflow-hidden">
        <iframe :src="'https://www.youtube.com/embed/' + trailerKey" title="Youtube video player" frameborder="0" allow="
            accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture;
          " allowfullscreen=""></iframe>
      </div>
    </div>

    <div class="row justify-content-around me-5">
      <!-- Movie Poster -->
      <div class="col-5">
        <img :src="movie.poster" :alt="movie.name" class="w-100" />
      </div>
      <div class="col-5">
        <!-- Movie Year -->
        <p class="mb-5 fs-1">
          <strong>Año de estreno {{ movie.year }}</strong>
        </p>
        <!-- Movie Cast -->
        <h5 class="fw-bold">Reparto</h5>
        <ul class="list-group list-group-flush">
          <li class="list-group-item" v-for="actor in filteredActors" :key="actor.id">
            {{ actor.name }}
          </li>
        </ul>
        <!-- Movie genres -->
        <h5 class="fw-bold">Géneros</h5>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <p v-for="genre in filteredGenres" :key="genre.id">
              {{ genre.name }}
            </p>
          </li>
        </ul>
        <!-- Movie Synopsis -->
        <h5 class="fw-bold">Sinopsis</h5>
        <p>{{ movie.synopsis }}</p>

        <!-- Movie Backdrop -->
        <h5 class="fw-bold">Imagen de fondo</h5>
        <p>{{ movie.backdrop }}</p>

        <!-- Movie Budget -->
        <h5 class="fw-bold">Presupuesto (USD)</h5>
        <p>{{ movie.budget }}</p>

        <!-- Movie Revenue -->
        <h5 class="fw-bold">Recaudación (USD)</h5>
        <p>{{ movie.revenue }}</p>

        <!-- Movie Runtine -->
        <h5 class="fw-bold">Duración</h5>
        <p>{{ movie.runtime }}</p>

        <!-- Movie Tagline -->
        <h5 class="fw-bold">Frase promocional</h5>
        <p>{{ movie.tagline }}</p>

        <!-- Movie Vote Average -->
        <h5 class="fw-bold">Puntuación de TMDB (0–10)</h5>
        <p>{{ movie.vote_average }}</p>

        <!-- Movie Vote Count -->
        <h5 class="fw-bold">Cantidad de votos en TMDB</h5>
        <p>{{ movie.vote_count }}</p>
      </div>
    </div>

    <!-- Return Button -->
    <div class="text-center">
      <button @click="returning" class="btn btn-dark">Volver</button>
    </div>

    <hr class="my-5" />

    <!-- Comments section -->
    <div class="row mt-5">
      <div class="col-md-8 mx-auto">
        <!-- Title -->
        <h3 class="mb-4 fw-bold">
          Opiniones de la comunidad ({{ reviews.length }})
        </h3>

        <!-- Opinion card -->
        <div v-if="user" class="card shadow-sm mb-5 border-0 bg-light p-4">
          <h5 class="mb-3">Escribe tu opinión.</h5>

          <!-- Rate Container -->
          <div class="mb-3">
            <label class="form-label d-block text-muted small uppercase">Calificación</label>
            <div class="btn-group" role="group">
              <button v-for="n in 5" :key="n" type="button" class="btn btn-sm" :class="n <= rating ? 'btn-warning' : 'btn-outline-secondary'
                " @click="rating = n">
                ⭐
              </button>
            </div>
          </div>

          <!-- Opinion text input -->
          <div class="mb-3">
            <textarea class="form-control border-0" rows="3" placeholder="Escribe tu opinión acerca de esta película."
              v-model="newReview"></textarea>
          </div>

          <!-- Submit Opinion button -->
          <button @click="sendReview" class="btn btn-primary px-4 float-end">
            Enviar reseña
          </button>
        </div>

        <!-- Login card (when the user is not logged in) -->
        <div v-else class="alert alert-info text-center py-4 mb-5">
          <p class="mb-2">
            Para dejar una reseña, primero debes iniciar sesión.
          </p>
          <router-link to="/login" class="btn btn-outline-primary btn-sm">Iniciar sesión</router-link>
        </div>

        <!-- User opinions section -->
        <div v-if="reviews.length > 0" class="list-group list-group-flush shadow-sm rounder border">
          <div v-for="review in reviews" :id="review.id" class="list-group-item p-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <strong class="text-primary">{{ review.userName }}</strong>
              <span class="badge bg-warning text-dark">⭐ {{ review.rating }} / 5</span>
            </div>

            <p class="mb-1 text-secondary italic">"{{ review.comment }}"</p>
            <small class="text-muted">{{
              review.date?.toDate().toLocaleDateString()
            }}</small>
          </div>
        </div>


        <div v-else class="text-center py-5">
          <p class="text-muted">
            Aún no hay opiniones. ¡Sé el primero en comentar!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// VUE Libraries
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useToast } from "vue-toastification";
import { onUnmounted } from "vue";
// Services
import { getTMDBTrailer } from "@/services/tmdbService";
import { getMovies } from "@/services/movieService";
import { getActors } from "@/services/actorService";
import { getGenres } from "@/services/genreService";
import { saveReview, subscribeReviews } from "@/services/reviewService";
// Store
import { useLoginStore } from "@/stores/loginStore";
// Utils
import { convertErrors } from "@/utils/errorMessages";

// Composables
const route = useRoute();
const router = useRouter();
const toast = useToast();
const loginStore = useLoginStore();

// Lets
let unsubscribe;

// Refs
const newReview = ref("");

const rating = ref(5);

const loading = ref(true);

const reviews = ref([]);
const actors = ref([]);
const genres = ref([]);
const filteredActors = ref([]);
const filteredGenres = ref([]);

const trailerKey = ref(null);
const movie = ref(null);

// Computed
const user = computed(() => loginStore.user);
const userProfile = computed(() => loginStore.userProfile);

// Lifecycle hooks

/**
* onMounted method used to initialize data
* Uses the subscribeReviews method to update comments in real time
* Additionally, it uses the filter method to find the corresponding actors and genres for each movie
*/
onMounted(async () => {
  await loadData();

  unsubscribe = subscribeReviews(route.params.id, (data) => {
    reviews.value = data;
  });

  filteredActors.value =
    actors.value.filter((actor) =>
      movie.value.actors.includes(actor.id),
    ) || [];
  filteredGenres.value =
    genres.value.filter((genre) =>
      movie.value.genres.includes(genre.id),
    ) || [];
});

// Method to unsubscribe when the component is unmounted
onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

// Methods

// Method to return to the movies menu
const returning = () => {
  router.back();
};

/**
* Method to load all data for the selected movie to view its details
* First, it uses a find method to locate the movie based on the movie ID from the page route
* Then it retrieves the actors and genres data
* If the movie has a tmdbId, its trailer will be fetched
* In case of an error, a toast will be shown to the user
*/

const loadData = async () => {
  try {
    loading.value = true;
    const movies = await getMovies();
    movie.value = movies.find((p) => p.id === route.params.id);
    actors.value = await getActors();
    genres.value = await getGenres();

    if (movie.value.tmdbId) {
      trailerKey.value = await getTMDBTrailer(movie.value.tmdbId);
    }
  } catch (error) {
    toast.error("Error al cargar los datos: " + convertErrors(error.code));
  } finally {
    loading.value = false;
  }
};

/**
* Method to publish a new review
* First, it checks that the review is not empty, returning null if it is
* Then it uses the saveReview method to publish the review with the required data
* In case of an error, a toast with the error will be shown to the user
*/
const sendReview = async () => {
  if (newReview.value.trim() === "") return;

  try {
    await saveReview({
      movieId: route.params.id,
      userId: user.value.uid,
      userName: userProfile.value.name,
      rating: rating.value,
      comment: newReview.value,
    });

    newReview.value = "";
    rating.value = 5;
    toast.success("¡Gracias por tu opinión!");
  } catch (error) {
    toast.error("Error al publicar la reseña: " + convertErrors(error.code));
  }
};
</script>

<style scoped></style>
