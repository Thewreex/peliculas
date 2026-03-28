<template>
    <form @submit.prevent="submitForm" class="mb-5">
        <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" v-model="nombre" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Año</label>
            <input type="text" class="form-control" v-model="year" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Poster</label>
            <input type="text" class="form-control" v-model="poster" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Sinopsis</label>
            <input type="text" class="form-control" v-model="sinopsis" required>
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

watch(() => props.pelicula, (nuevaPelicula) => {
    if (nuevaPelicula) {
        nombre.value = nuevaPelicula.nombre
        poster.value = nuevaPelicula.poster
        year.value = nuevaPelicula.year
        sinopsis.value = nuevaPelicula.sinopsis
        actoresSeleccionados.value = nuevaPelicula.actores || []
        generosSeleccionados.value = nuevaPelicula.generos || []
    } else {
        nombre.value = ""
        poster.value = ""
        year.value = ""
        sinopsis.value = ""
        actoresSeleccionados.value = null
        generosSeleccionados.value = []
    }
})

const resetForm = () => {
    nombre.value = ""
    poster.value = ""
    year.value = ""
    sinopsis.value = ""
    actoresSeleccionados.value = null
    generosSeleccionados.value = []
}

const submitForm = () => {
    emit('guardar', {
        nombre: nombre.value,
        poster: poster.value,
        year: year.value,
        sinopsis: sinopsis.value,
        actores: actoresSeleccionados.value,
        generos: generosSeleccionados.value
    })
    resetForm()
}
</script>

<style scoped></style>