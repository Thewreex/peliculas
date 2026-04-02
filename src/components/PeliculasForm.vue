<template>
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

const rules = {
    nombre: { required, minLength: minLength(4) },
    year: { required, numeric, between: between(1900, 2026) },
    poster: { required, url },
    sinopsis: { required, minLength: minLength(10) }
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


const v$ = useVuelidate(rules, { nombre, year, poster, sinopsis })


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

const submitForm = async () => {
    const result = await v$.value.$validate()

    if (!result) return

    emit('guardar', {
        nombre: nombre.value,
        poster: poster.value,
        year: year.value,
        sinopsis: sinopsis.value,
        actores: actoresSeleccionados.value,
        generos: generosSeleccionados.value
    })
    resetForm()

    v$.value.$reset()
}
</script>

<style scoped></style>