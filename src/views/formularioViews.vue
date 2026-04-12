<template>
    <PeliculasForm @guardar="guardarPelicula" :actores="actores" :generos="generos" :peliculas="peliculas" />
    <!-- :pelicula="peliculaSeleccionada" :actores="actores" :generos="generos" -->
</template>


<script setup>
import PeliculasForm from '@/components/PeliculasForm.vue';
import { createPelicula, updatePelicula, getPeliculas, subscribePeliculas } from '@/services/peliculaService';
import { subscribeActores } from '@/services/actorService';
import { subscribeGeneros } from '@/services/generoService';
import { ref, onMounted, onUnmounted, computed } from "vue"
import { useToast } from 'vue-toastification';
import { convertirErrores } from '@/utils/errorMessages';
import { useMoviesStore } from '@/stores/moviesStore';

const toast = useToast()
const moviesStore = useMoviesStore()

const actores = ref([])
const generos = ref([])

const peliculas = ref([])

const peliculaSeleccionada = computed(() => moviesStore.selectedMovie)
const isEditing = computed(() => !!peliculaSeleccionada.value)

const guardarPelicula = async (pelicula) => {
    if (isEditing.value) {
        await updatePelicula(peliculaSeleccionada.value.id, pelicula)
        toast.success("Pelicula actualizada correctamente")
    } else {
        await createPelicula(pelicula)
        toast.success("Se ha ingresado la pelicula correctamente")
    }
    moviesStore.setMovie(null)
}


const obtenerPeliculas = async () => {
    return await getPeliculas()
}


let unsubscribeActores;
let unsubscribeGeneros;
let unsubscribePeliculas;

onMounted(() => {
    unsubscribePeliculas = subscribePeliculas((data) => {
        peliculas.value = data
    })
    unsubscribeActores = subscribeActores((data) => {
        actores.value = data
    })
    unsubscribeGeneros = subscribeGeneros((data) => {
        generos.value = data
    })
})

onUnmounted(() => {
    if (unsubscribePeliculas) unsubscribePeliculas()
    if (unsubscribeActores) unsubscribeActores()
    if (unsubscribeGeneros) unsubscribeGeneros()
})

</script>

<style scoped></style>