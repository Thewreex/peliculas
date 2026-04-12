<template>

    <div class="modal" id="modalIngreso" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ingresar</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ActoresViews v-if="seleccionIngreso === 'actor'" />
                    <GenerosViews v-else-if="seleccionIngreso === 'genero'" />
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal" id="modalPelicula" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modificar</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <PeliculasViews />
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <div class="my-5 p-4 border rounded shadow-sm bg-light">
        <label class="form-label fw-bold">Buscar en TMDB para autocompletar</label>
        <div class="position-relative">
            <input type="text" class="form-control" placeholder="Escribe el nombre de la pelicula"
                v-model="terminoBusquedaTMDB" @input="buscarEnTMDB">

            <div class="list-group mt-1 position-absolute w-100 shadow" v-if="resultadosTMDB?.length"
                style="z-index: 1000;">
                <button type="button" v-for="res in resultadosTMDB" :key="res.id"
                    class="list-group-item list-group-item-action d-flex align-items-center"
                    @click="seleccionarPeliculaTMDB(res.id)">
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
    <button class="mb-5 btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalPelicula">Modificar
        peliculas</button>
    <form @submit.prevent="submitForm" class="mb-5">

        <!-- CAMPO NOMBRE -->
        <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': v$.nombre.$error }" v-model="nombre">
            <div v-if="v$.nombre.$dirty"></div>
            <div class="invalid-feedback" v-if="v$.nombre.required.$invalid">
                El nombre es obligatorio
            </div>
            <div class="invalid-feedback" v-if="v$.nombre.minLength.$invalid">
                El nombre debe tener al menos {{ v$.nombre.minLength.$params.min }} caracteres
            </div>
        </div>

        <!-- CAMPO AÑO -->
        <div class="mb-3">
            <label class="form-label">Año</label>
            <input type="number" step="1" @keydown="['.', ','].includes($event.key) && $event.preventDefault()"
                class="form-control" :class="{ 'is-invalid': v$.year.$error }" v-model="year">
            <div class="invalid-feedback" v-if="v$.year.required.$invalid">
                Este campo es obligatorio
            </div>
            <div class="invalid-feedback" v-else-if="v$.year.between.$invalid && !v$.year.integer.$invalid">
                Ingrese un valor entre 1900 y {{ v$.year.between.$params.max }}
            </div>
        </div>

        <!-- CAMPO POSTER -->
        <div class="mb-3">
            <label class="form-label">Poster</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': v$.poster.$error }" v-model="poster">
            <div class="invalid-feedback" v-if="poster && v$.poster.url.$invalid">
                Ingrese un URL valido
            </div>
        </div>

        <!-- CAMPO SINOPSIS-->
        <div class="mb-3">
            <label class="form-label">Sinopsis</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': v$.sinopsis.$error }" v-model="sinopsis">
            <div class="invalid-feedback" v-if="v$.sinopsis.required.$invalid">
                Este campo es obligatorio
            </div>
            <div class="invalid-feedback" v-if="v$.sinopsis.minLength.$invalid">
                La sinopsis debe tener al menos {{ v$.sinopsis.minLength.$params.min }} caracteres
            </div>
        </div>


        <div class="row mb-3">

            <!-- CAMPO BACKDROP -->
            <div class="col-md-6 mb-3">
                <label for="form-label">Backdrop (URL Del fondo)</label>
                <input type="text" class="form-control" v-model="backdrop"
                    :class="{ 'is-invalid': v$.backdrop.$error }">
                <div class="invalid-feedback" v-if="backdrop && v$.backdrop.url.$invalid">
                    Ingrese un URL valido
                </div>
            </div>

            <!-- CAMPO TAGLINE -->
            <div class="col-md-6 mb-3">
                <label for="form-label">Tagline (Frase especial)</label>
                <input type="text" class="form-control" v-model="tagline" :class="{ 'is-invalid': v$.tagline.$error }">
                <div class="invalid-feedback" v-if="tagline && v$.tagline.minLength.$invalid">
                    La longitud del Tagline debe de ser de minimo {{ v$.tagline.minLength.$params.min }}
                </div>
            </div>
        </div>

        <div class="row mb-3">

            <!-- CAMPO PUNTUACION TMDB -->
            <div class="col-md-4 mb-3">
                <label for="form-label">Puntuacion TMDB (0 - 10)</label>
                <input type="text" class="form-control" disabled v-model="vote_average"
                    :class="{ 'is-invalid': v$.vote_average.$error }">
            </div>

            <!-- CAMPO VOTOS TMDB -->
            <div class="col-md-4 mb-3">
                <label for="form-label">Votos TMDB (Cantidad)</label>
                <input type="number" class="form-control" disabled v-model="vote_count">
            </div>

            <!-- CAMPO DURACION -->
            <div class="col-md-4 mb-3">
                <label for="form-label">Duracion (Minutos)</label>
                <input type="number" class="form-control" v-model="runtime"
                    :class="{ 'is-invalid': v$.runtime.$error }">
                <div class="invalid-feedback" v-if="v$.runtime.$error">
                    La duracion es obligatorio
                </div>
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-md-6 mb-3">
                <label for="form-label">Presupuesto ($)</label>
                <input type="number" class="form-control" v-model="budget" :class="{ 'is-invalid': v$.budget.$error }">
            </div>
            <div class="col-md-6 mb-3">
                <label for="form-label">Recaudacion ($)</label>
                <input type="number" class="form-control" v-model="revenue"
                    :class="{ 'is-invalid': v$.revenue.$error }">
            </div>
        </div>
        <div class="mb-3">
            <div class="mb-3">
                <button class="btn btn-primary me-3" data-bs-toggle="modal" data-bs-target="#modalIngreso"
                    @click="seleccionIngreso = 'actor'">Ingresar
                    Actor</button>
                <label class="form-label">Actores</label>
            </div>
            <select class="form-select" :class="{ 'is-invalid': v$.actores.$error }" multiple
                v-model="actoresSeleccionados">
                <option v-for="actor in actores" :key="actor.id" :value="actor.id">
                    {{ actor.nombre }}
                </option>
            </select>
            <div class="invalid-feedback" v-if="v$.actores.$error">
                Seleccione al menos un actor
            </div>
        </div>
        <div class="mb-3">
            <div class="mb-3">
                <button class="btn btn-primary me-3" data-bs-toggle="modal" data-bs-target="#modalIngreso"
                    @click="seleccionIngreso = 'genero'">Ingresar
                    Genero</button>
                <label class="form-label">Generos</label>
            </div>
            <select class="form-select" multiple :class="{ 'is-invalid': v$.generos.$error }"
                v-model="generosSeleccionados">
                <option v-for="genero in generos" :key="genero.id" :value="genero.id">
                    {{ genero.nombre }}
                </option>

            </select>
            <div class="invalid-feedback" v-if="v$.generos.$error">
                Seleccione al menos un genero
            </div>
        </div>
        <div class="d-flex gap-2">
            <button class="btn btn-primary">Guardar</button>
            <button v-if="store.state.peliculaSeleccionada" @click="cancelarEdit" class="btn btn-danger">Cancelar
                Modificacion</button>
        </div>
    </form>


</template>

<script setup>
import { ref, watch } from 'vue';
import useVuelidate from '@vuelidate/core';
import { between, minLength, numeric, required, url, integer } from '@vuelidate/validators';
import { buscarPeliculasTMDB, obtenerDetallesTMDB } from '@/services/tmdbService';
import ActorForm from './ActorForm.vue';
import ActoresViews from '@/views/actoresViews.vue';
import GenerosViews from '@/views/generosViews.vue';
import PeliculasViews from '@/views/PeliculasViews.vue';
import { useToast } from 'vue-toastification';
import { useMoviesStore } from '@/stores/moviesStore';

const moviesStore = useMoviesStore()

const anioActual = new Date().getFullYear()

const rules = {
    nombre: { required, minLength: minLength(4) },
    year: { required, integer, between: between(1900, anioActual + 5) },
    poster: { url },
    sinopsis: { required, minLength: minLength(10) },
    backdrop: { url },
    vote_average: { numeric, between: between(0, 10) },
    vote_count: { numeric },
    tagline: { minLength: minLength(6) },
    budget: { numeric },
    revenue: { numeric },
    runtime: { required, numeric, between: between(1, 240) },
    actores: { required },
    generos: { required }
}

const props = defineProps({
    pelicula: Object,
    actores: Array,
    generos: Array,
    peliculas: Array
})

const emit = defineEmits(['guardar'])

const toast = useToast()

const nombre = ref('')
const year = ref(null)
const poster = ref('')
const sinopsis = ref('')
const actoresSeleccionados = ref([])
const generosSeleccionados = ref([])
const backdrop = ref('')
const vote_average = ref(0)
const vote_count = ref(0)
const runtime = ref(0)
const tagline = ref('')
const budget = ref(0)
const revenue = ref(0)
const tmdbId = ref(null)

const seleccionIngreso = ref("")

const v$ = useVuelidate(rules, { nombre, year, poster, sinopsis, backdrop, vote_average, vote_count, tagline, budget, revenue, runtime, actores: actoresSeleccionados, generos: generosSeleccionados })


watch(() => moviesStore.selectedMovie, (nuevaPelicula) => {
    if (nuevaPelicula) {
        nombre.value = nuevaPelicula.nombre
        poster.value = nuevaPelicula.poster
        year.value = nuevaPelicula.year
        sinopsis.value = nuevaPelicula.sinopsis
        actoresSeleccionados.value = nuevaPelicula.actores || []
        generosSeleccionados.value = nuevaPelicula.generos || []
        backdrop.value = nuevaPelicula.backdrop || ''
        vote_average.value = nuevaPelicula.vote_average || 0
        vote_count.value = nuevaPelicula.vote_count || 0
        runtime.value = nuevaPelicula.runtime || 0
        tagline.value = nuevaPelicula.tagline || ''
        budget.value = nuevaPelicula.budget || 0
        revenue.value = nuevaPelicula.revenue || 0
    } else {
        resetForm()
    }
})

const resetForm = () => {
    nombre.value = ""
    poster.value = ""
    year.value = ""
    sinopsis.value = ""
    actoresSeleccionados.value = []
    generosSeleccionados.value = []
    backdrop.value = ""
    vote_average.value = 0
    vote_count.value = 0
    runtime.value = 0
    tagline.value = ""
    budget.value = 0
    revenue.value = 0
}

const cancelarEdit = () => {
    resetForm()
    moviesStore.setMovie(null)
}


const submitForm = async () => {
    const result = await v$.value.$validate()

    if (!result) return

    const peliculaSubmit = {
        nombre: nombre.value,
        tmdbId: tmdbId.value,
        poster: poster.value,
        year: year.value,
        sinopsis: sinopsis.value,
        actores: actoresSeleccionados.value,
        generos: generosSeleccionados.value,
        backdrop: backdrop.value,
        vote_average: vote_average.value,
        vote_count: vote_count.value,
        runtime: runtime.value,
        tagline: tagline.value,
        budget: budget.value,
        revenue: revenue.value
    }

    const peliExistente = props.peliculas?.find(p => p.nombre.toLowerCase() === peliculaSubmit.nombre.toLowerCase() && p.year === peliculaSubmit.year)

    const editandoId = moviesStore.selectedMovie?.id


    if (peliExistente && peliExistente.id !== editandoId) {
        toast.error("La pelicula que estas ingresando ya existe en la base de datos")
        return
    }
    emit('guardar', peliculaSubmit)
    resetForm()

    v$.value.$reset()
}

const terminoBusquedaTMDB = ref('')
const resultadosTMDB = ref([])

const buscarEnTMDB = async () => {
    if (terminoBusquedaTMDB.value.length < 3) {
        resultadosTMDB.value = []
        return
    }
    resultadosTMDB.value = await buscarPeliculasTMDB(terminoBusquedaTMDB.value)
}

const seleccionarPeliculaTMDB = async (id) => {
    const p = await obtenerDetallesTMDB(id)

    if (!p || !p.genres) {
        toast.error("No se pudieron cargar los detalles de esta película.");
        return;
    }
    nombre.value = p.title
    sinopsis.value = p.overview
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
        const geneMatch = props.generos.find(gLoc => gLoc.nombre.toLowerCase() === gTMDB.name.toLowerCase())
        if (geneMatch) idsGenerosMatched.push(geneMatch.id)
    });
    generosSeleccionados.value = idsGenerosMatched
    resultadosTMDB.value = []
    terminoBusquedaTMDB.value = ''
}
</script>

<style scoped></style>