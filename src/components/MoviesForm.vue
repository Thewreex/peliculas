<!-- MoviesForm Component
This component is used to create and update movies in the database
It also includes buttons that display the forms for adding actors and genres -->

<template>
    <!-- Modal to edit actors and genres data -->
    <div class="modal" id="inputModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ingresar</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ActorsView v-if="inputSelection === 'actor'" />
                    <GenresView v-else-if="inputSelection === 'genre'" />
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal to edit and delete movies -->
    <div class="modal" id="movieModal" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modificar</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <MoviesView />
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Input to autocomplete the form with TMDB data -->
    <div class="my-5 p-4 border rounded shadow-sm bg-light">
        <label class="form-label fw-bold">Buscar en TMDB para autocompletar</label>
        <div class="position-relative">
            <input type="text" class="form-control" placeholder="Escribe el nombre de la película"
                v-model="tmdbSearchTerm" @input="searchInTMDB">

            <div class="list-group mt-1 position-absolute w-100 shadow" v-if="tmdbResults?.length"
                style="z-index: 1000;">
                <button type="button" v-for="res in tmdbResults" :key="res.id"
                    class="list-group-item list-group-item-action d-flex align-items-center"
                    @click="selectTMDBMovie(res.id)">
                    <img :src="'https://image.tmdb.org/t/p/w92' + res.poster_path" class="me-3 rounded"
                        style="width: 40px;">
                    <div>
                        <strong> {{ res.title }}</strong> <br>
                        <small class="text-muted">{{ res.release_date?.slice(0, 4) }}</small>
                    </div>
                </button>
            </div>
        </div>
    </div>

    <!-- Button to edit movies -->
    <div class="d-flex gap-4 mb-4">
        <button class=" btn btn-primary" data-bs-toggle="modal" data-bs-target="#movieModal">Modificar
            películas</button>
        <button class="btn btn-danger" @click="resetForm">Limpiar</button>
    </div>
    <form @submit.prevent="submitForm" class="mb-5">

        <!-- NAME FIELD -->
        <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': v$.name.$error }" v-model="name">
            <div v-if="v$.name.$dirty"></div>
            <div class="invalid-feedback" v-if="v$.name.required.$invalid">
                Este campo es obligatorio
            </div>
            <div class="invalid-feedback" v-if="v$.name.minLength.$invalid">
                El nombre debe tener al menos {{ v$.name.minLength.$params.min }} caracteres.
            </div>
        </div>

        <!-- YEAR FIELD -->
        <div class="mb-3">
            <label class="form-label">Año</label>
            <input type="number" step="1" @keydown="['.', ','].includes($event.key) && $event.preventDefault()"
                class="form-control" :class="{ 'is-invalid': v$.year.$error }" v-model="year">
            <div class="invalid-feedback" v-if="v$.year.required.$invalid">
                Este campo es obligatorio
            </div>
            <div class="invalid-feedback" v-else-if="v$.year.between.$invalid && !v$.year.integer.$invalid">
                Ingrese un valor entre 1900 y {{ v$.year.between.$params.max }}.
            </div>
        </div>

        <!-- POSTER FIELD -->
        <div class="mb-3">
            <label class="form-label">Poster</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': v$.poster.$error }" v-model="poster">
            <div class="invalid-feedback" v-if="poster && v$.poster.url.$invalid">
                Ingrese una URL válida
            </div>
        </div>

        <!-- SYNOPSIS FIELD -->
        <div class="mb-3">
            <label class="form-label">Sinopsis</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': v$.synopsis.$error }" v-model="synopsis">
            <div class="invalid-feedback" v-if="v$.synopsis.required.$invalid">
                Este campo es obligatorio
            </div>
            <div class="invalid-feedback" v-if="v$.synopsis.minLength.$invalid">
                La sinopsis debe tener al menos {{ v$.synopsis.minLength.$params.min }} caracteres
            </div>
        </div>


        <div class="row mb-3">

            <!-- BACKDROP FIELD -->
            <div class="col-md-6 mb-3">
                <label for="form-label">Imagen de fondo (URL)</label>
                <input type="text" class="form-control" v-model="backdrop"
                    :class="{ 'is-invalid': v$.backdrop.$error }">
                <div class="invalid-feedback" v-if="backdrop && v$.backdrop.url.$invalid">
                    Ingrese una URL válida
                </div>
            </div>

            <!-- TAGLINE FIELD -->
            <div class="col-md-6 mb-3">
                <label for="form-label">Frase promocional</label>
                <input type="text" class="form-control" v-model="tagline" :class="{ 'is-invalid': v$.tagline.$error }">
                <div class="invalid-feedback" v-if="tagline && v$.tagline.minLength.$invalid">
                    El eslogan debe tener al menos {{ v$.tagline.minLength.$params.min }} caracteres.
                </div>
            </div>
        </div>

        <div class="row mb-3">

            <!-- TMDB RATING FIELD -->
            <div class="col-md-4 mb-3">
                <label for="form-label">Puntuación de TMDB (0–10)</label>
                <input type="text" class="form-control" disabled v-model="vote_average"
                    :class="{ 'is-invalid': v$.vote_average.$error }">
            </div>

            <!-- TMDB VOTES FIELD -->
            <div class="col-md-4 mb-3">
                <label for="form-label">Cantidad de votos en TMDB</label>
                <input type="number" class="form-control" disabled v-model="vote_count">
            </div>

            <!-- DURATION FIELD -->
            <div class="col-md-4 mb-3">
                <label for="form-label">Duración en minutos</label>
                <input type="number" class="form-control" v-model="runtime"
                    :class="{ 'is-invalid': v$.runtime.$error }">
                <div class="invalid-feedback" v-if="v$.runtime.$error">
                    Este campo es obligatorio
                </div>
            </div>
        </div>

        <!-- BUDGET FIELD -->
        <div class="row mb-3">
            <div class="col-md-6 mb-3">
                <label for="form-label">Presupuesto (USD)</label>
                <input type="number" class="form-control" v-model="budget" :class="{ 'is-invalid': v$.budget.$error }">
            </div>

            <!-- REVENUE FIELD -->
            <div class="col-md-6 mb-3">
                <label for="form-label">Recaudación (USD)</label>
                <input type="number" class="form-control" v-model="revenue"
                    :class="{ 'is-invalid': v$.revenue.$error }">
            </div>
        </div>
        <div class="mb-3">
            <!-- ACTOR FIELD -->
            <div class="mb-3">
                <button class="btn btn-primary me-3" data-bs-toggle="modal" data-bs-target="#inputModal"
                    @click="inputSelection = 'actor'">Agregar actor</button>
                <label class="form-label">Actores</label>
            </div>
            <select class="form-select" :class="{ 'is-invalid': v$.actors.$error }" multiple v-model="selectedActors">
                <option v-for="actor in actors" :key="actor.id" :value="actor.id">
                    {{ actor.name }}
                </option>
            </select>
            <div class="invalid-feedback" v-if="v$.actors.$error">
                Seleccione al menos un actor
            </div>
        </div>
        <div class="mb-3">
            <!-- GENRE FIELD -->
            <div class="mb-3">
                <button class="btn btn-primary me-3" data-bs-toggle="modal" data-bs-target="#inputModal"
                    @click="inputSelection = 'genre'">Ingresar género</button>
                <label class="form-label">Géneros</label>
            </div>
            <select class="form-select" multiple :class="{ 'is-invalid': v$.genres.$error }" v-model="selectedGenres">
                <option v-for="genre in genres" :key="genre.id" :value="genre.id">
                    {{ genre.name }}
                </option>

            </select>
            <div class="invalid-feedback" v-if="v$.genres.$error">
                Seleccione al menos un género
            </div>
        </div>
        <div class="d-flex gap-2">
            <button class="btn btn-primary">Guardar</button>
            <button v-if="moviesStore.selectedMovie" @click="cancelEdit" class="btn btn-danger">Cancelar
                edición</button>
        </div>
    </form>


</template>

<script setup>

// VUE Libraries
import { ref, watch } from 'vue';
import useVuelidate from '@vuelidate/core';
import { between, minLength, numeric, required, url, integer } from '@vuelidate/validators';
import { useToast } from 'vue-toastification';
// Services
import { searchTMDBMovies, getTMDBDetails } from '@/services/tmdbService';
// Stores
import { useMoviesStore } from '@/stores/moviesStore';
// Components
import ActorsView from '@/views/ActorsView.vue';
import GenresView from '@/views/GenresView.vue';
import MoviesView from '@/views/MoviesView.vue';

// Props

const props = defineProps({
    movie: Object,
    actors: Array,
    genres: Array,
    movies: Array
})

// Emits (from MoviesView)

const emit = defineEmits(['save'])

// Composables 

const moviesStore = useMoviesStore()
const toast = useToast()

// Constants

const actualYear = new Date().getFullYear()

// Refs

// Movie data
const name = ref('')
const year = ref(null)
const poster = ref('')
const synopsis = ref('')
const selectedActors = ref([])
const selectedGenres = ref([])
const backdrop = ref('')
const vote_average = ref(0)
const vote_count = ref(0)
const runtime = ref(0)
const tagline = ref('')
const budget = ref(0)
const revenue = ref(0)
const tmdbId = ref(null)

const inputSelection = ref("")
const tmdbSearchTerm = ref('')
const tmdbResults = ref([])


// Vuelidate
const rules = {
    name: { required, minLength: minLength(4) },
    year: { required, integer, between: between(1900, actualYear + 5) },
    poster: { url },
    synopsis: { required, minLength: minLength(10) },
    backdrop: { url },
    vote_average: { numeric, between: between(0, 10) },
    vote_count: { numeric },
    tagline: { minLength: minLength(6) },
    budget: { numeric },
    revenue: { numeric },
    runtime: { required, numeric, between: between(1, 240) },
    actors: { required },
    genres: { required }
}

const v$ = useVuelidate(rules, { name, year, poster, synopsis, backdrop, vote_average, vote_count, tagline, budget, revenue, runtime, actors: selectedActors, genres: selectedGenres })


// Watchers

watch(() => moviesStore.selectedMovie, (newMovie) => {
    if (newMovie) {
        name.value = newMovie.name
        poster.value = newMovie.poster
        year.value = newMovie.year
        synopsis.value = newMovie.synopsis
        selectedActors.value = newMovie.actors || []
        selectedGenres.value = newMovie.genres || []
        backdrop.value = newMovie.backdrop || ''
        vote_average.value = newMovie.vote_average || 0
        vote_count.value = newMovie.vote_count || 0
        runtime.value = newMovie.runtime || 0
        tagline.value = newMovie.tagline || ''
        budget.value = newMovie.budget || 0
        revenue.value = newMovie.revenue || 0
    } else {
        resetForm()
    }
})

// Methods

// Clear all form values

const resetForm = () => {
    tmdbId.value = 0
    name.value = ""
    poster.value = ""
    year.value = ""
    synopsis.value = ""
    selectedActors.value = []
    selectedGenres.value = []
    backdrop.value = ""
    vote_average.value = 0
    vote_count.value = 0
    runtime.value = 0
    tagline.value = ""
    budget.value = 0
    revenue.value = 0
}

/**
* Function to cancel the editing of a movie
* Clears the form values and assigns null to the movie being edited in the store
*/


const cancelEdit = () => {
    resetForm()
    moviesStore.setMovie(null)
}


/**
* Function to submit the form values to the database
* First, it checks if all fields meet the requirements defined by Vuelidate
* If so, it creates an object with all the form values
* After that, it verifies whether the entered movie already exists based on its name and year; if it exists, it throws an error
* If not, it uploads the values to the database
*/


const submitForm = async () => {
    const result = await v$.value.$validate()

    if (!result) return

    const movieSubmit = {
        name: name.value,
        tmdbId: tmdbId.value,
        poster: poster.value,
        year: year.value,
        synopsis: synopsis.value,
        actors: selectedActors.value,
        genres: selectedGenres.value,
        backdrop: backdrop.value,
        vote_average: vote_average.value,
        vote_count: vote_count.value,
        runtime: runtime.value,
        tagline: tagline.value,
        budget: budget.value,
        revenue: revenue.value
    }

    const existingMovie = props.movies?.find(p => p.name.toLowerCase() === movieSubmit.name.toLowerCase() && p.year === movieSubmit.year)

    const editingId = moviesStore.selectedMovie?.id


    if (existingMovie && existingMovie.id !== editingId) {
        toast.error("La película que estás ingresando ya existe en la base de datos")
        return
    }
    emit('save', movieSubmit)
    resetForm()

    v$.value.$reset()
}

/**
* Function that limits the TMDB search
* If the input has fewer than 3 characters, it will not display movies
*/

const searchInTMDB = async () => {
    if (tmdbSearchTerm.value.length < 3) {
        tmdbResults.value = []
        return
    }
    tmdbResults.value = await searchTMDBMovies(tmdbSearchTerm.value)
}


/**

* Function to auto-fill the entry form with TMDB data
* If no data is found, it returns null
* If data is found, it assigns the retrieved values to the form
* It also uses the forEach method to find all movie genres that exist in the database and assigns them to the form
  */


const selectTMDBMovie = async (id) => {
    const p = await getTMDBDetails(id)

    if (!p || !p.genres) {
        toast.error("No se pudieron cargar los detalles de esta película.");
        return;
    }
    name.value = p.title
    synopsis.value = p.overview
    year.value = p.release_date ? parseInt(p.release_date.slice(0, 4)) : null
    poster.value = p.poster_path ? `https://image.tmdb.org/t/p/w500${p.poster_path}` : ""
    backdrop.value = p.backdrop_path ? `https://image.tmdb.org/t/p/w1280${p.backdrop_path}` : ""
    vote_average.value = p.vote_average
    vote_count.value = p.vote_count
    runtime.value = p.runtime
    tagline.value = p.tagline
    budget.value = p.budget
    revenue.value = p.revenue
    tmdbId.value = id

    const idsGenerosMatched = []
    p.genres.forEach(gTMDB => {
        const geneMatch = props.genres.find(gLoc => gLoc.name.toLowerCase() === gTMDB.name.toLowerCase())
        if (geneMatch) idsGenerosMatched.push(geneMatch.id)
    });
    selectedGenres.value = idsGenerosMatched
    tmdbResults.value = []
    tmdbSearchTerm.value = ''
}
</script>

<style scoped></style>