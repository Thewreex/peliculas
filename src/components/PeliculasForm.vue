<template>
    <div class="mb5 p-4 border rounded shadow-sm bg-light">
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
    <form @submit.prevent="submitForm" class="mb-5">
        <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': v$.nombre.$error }" v-model="nombre">
            <div class="invalid-feedback" v-if="v$.nombre.$error">
                El nombre es obligatorio y debe tener al menos 4 caracteres
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Año</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': v$.year.$error }" v-model="year">
            <div class="invalid-feedback" v-if="v$.year.$error">
                Ingrese un caracter numerico entre 1900 y el año actual
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Poster</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': v$.poster.$error }" v-model="poster">
            <div class="invalid-feedback" v-if="v$.poster.$error">
                Ingrese un enlace valido
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Sinopsis</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': v$.sinopsis.$error }" v-model="sinopsis">
            <div class="invalid-feedback" v-if="v$.sinopsis.$error">
                La sinopsis debe tener al menos 10 caracteres
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-6 mb-3">
                <label for="form-label">Backdrop (URL Del fondo)</label>
                <input type="text" class="form-control" v-model="backdrop"
                    :class="{ 'is-invalid': v$.backdrop.$error }">
            </div>
            <div class="col-md-6 mb-3">
                <label for="form-label">Tagline (Frase especial)</label>
                <input type="text" class="form-control" v-model="tagline" :class="{ 'is-invalid': v$.tagline.$error }">
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-md-4 mb-3">
                <label for="form-label">Puntuacion (0 - 10)</label>
                <input type="text" class="form-control" v-model="vote_average"
                    :class="{ 'is-invalid': v$.vote_average.$error }">
            </div>
            <div class="col-md-4 mb-3">
                <label for="form-label">Votos (Cantidad)</label>
                <input type="number" class="form-control" v-model="vote_count">
            </div>
            <div class="col-md-4 mb-3">
                <label for="form-label">Duracion (Minutos)</label>
                <input type="number" class="form-control" v-model="runtime">
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
            <label class="form-label">Actores</label>
            <select class="form-select" multiple v-model="actoresSeleccionados">
                <option v-for="actor in actores" :key="actor.id" :value="actor.id">
                    {{ actor.nombre }}
                </option>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">Generos</label>
            <select class="form-select" multiple v-model="generosSeleccionados">
                <option v-for="genero in generos" :key="genero.id" :value="genero.id">
                    {{ genero.nombre }}
                </option>
            </select>
        </div>
        <button class="btn btn-primary">Guardar</button>
    </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import useVuelidate from '@vuelidate/core';
import { between, minLength, numeric, required, url } from '@vuelidate/validators';
import { buscarPeliculasTMDB, obtenerDetallesTMDB } from '@/services/tmdbService';

const rules = {
    nombre: { required, minLength: minLength(4) },
    year: { required, numeric, between: between(1900, 2026) },
    poster: { required, url },
    sinopsis: { required, minLength: minLength(10) },
    backdrop: { url },
    vote_average: { numeric, between: between(0, 10) },
    vote_count: { numeric },
    tagline: {},
    budget: { numeric },
    revenue: { numeric }
}

const props = defineProps({
    pelicula: Object,
    actores: Array,
    generos: Array,
})

const emit = defineEmits(['guardar'])

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

const v$ = useVuelidate(rules, { nombre, year, poster, sinopsis, backdrop, vote_average, vote_count, tagline, budget, revenue })


watch(() => props.pelicula, (nuevaPelicula) => {
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


const submitForm = async () => {
    const result = await v$.value.$validate()

    if (!result) return

    emit('guardar', {
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
    })
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