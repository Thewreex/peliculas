<template>
    <div class="mb-5 pb-5" v-if="pelicula">
        <h2 class="text-center my-5 py-5 display-5 fw-bold">{{ pelicula.nombre }}</h2>
        <div class="row justify-content-around me-5">
            <div class="col-5">
                <img :src="pelicula.poster" :alt="pelicula.nombre" class="w-100">
            </div>
            <div class="col-5">
                <p class="mb-5 fs-1"><strong>Año estreno {{ pelicula.year }}</strong></p>
                <h5 class="fw-bold">Full Cast</h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item" v-for="actor in getNombreActores()" :key="actor"> {{ actor }}</li>
                </ul>
                <h5 class="fw-bold">Generos</h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <p v-for="genero in getNombreGeneros()" :key="genero"> {{ genero }}</p>
                    </li>
                </ul>
                <h5 class="fw-bold">Sinopsis</h5>
                <p>{{ pelicula.sinopsis }}</p>
                <h5 class="fw-bold">Backdrop</h5>
                <p>{{ pelicula.backdrop }}</p>
                <h5 class="fw-bold">Budget</h5>
                <p>{{ pelicula.budget }}</p>
                <h5 class="fw-bold">Revenue</h5>
                <p>{{ pelicula.revenue }}</p>
                <h5 class="fw-bold">Runtime</h5>
                <p>{{ pelicula.runtime }}</p>
                <h5 class="fw-bold">Tagline</h5>
                <p>{{ pelicula.tagline }}</p>
                <h5 class="fw-bold">vote average</h5>
                <p>{{ pelicula.vote_average }}</p>
                <h5 class="fw-bold">vote_count</h5>
                <p>{{ pelicula.vote_count }}</p>

            </div>
        </div>
        <div class="text-center">
            <button @click="volver" class="btn btn-dark">Volver</button>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { getPeliculas } from '@/services/peliculaService';
import { getActores } from '@/services/actorService';
import { getGeneros } from '@/services/generoService';
import { useToast } from 'vue-toastification';

const route = useRoute()
const router = useRouter()
const toast = useToast()

const volver = () => {
    router.back()
}

const pelicula = ref(null)
const actores = ref([])
const generos = ref([])

const cargarDatos = async () => {
    try {
        const peliculas = await getPeliculas()
        pelicula.value = peliculas.find(p => p.id === route.params.id)
        actores.value = await getActores()
        generos.value = await getGeneros()
    } catch (error) {
        toast.error('Error al cargar los datos: ', error)
    }
}

onMounted(cargarDatos)

const getNombreActores = () => {
    if (!pelicula.value.actores) return []

    return actores.value
        .filter(actor => pelicula.value.actores.includes(actor.id))
        .map(actor => actor.nombre)
}

const getNombreGeneros = () => {
    if (!pelicula.value.generos) return []

    return generos.value
        .filter(genero => pelicula.value.generos.includes(genero.id))
        .map(genero => genero.nombre)
}
</script>

<style scoped></style>