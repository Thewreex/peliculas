<template>
    <div v-if="cargando" class="container animate-pulse">
        <h2 class="text-center my-5 py-5 placeholder-glow">
            <span class="placeholder col-6 py-4 rounded"></span>
        </h2>

        <div class="row">
            <div v-for="n in 8" :key="n" class="col-md-3 mb-5">
                <div class="placeholder rounded w-100" style="height: 600px;"></div>
                <div class="placeholder-glow mt-3">
                    <span class="placeholder col-8"></span>
                    <span class="placeholder col-4"></span>
                </div>
            </div>
        </div>
    </div>

    <div v-else>
        <h1 class="text-center my-5 fw-bold display-5">Peliculas!</h1>
        <div class="row my-5 g-3">
            <div class="col-md-6">
                <input type="text" class="form-control form-control-lg shadow-sm" placeholder="Buscar peliculas"
                    v-model="searchQuery">
                <button @click="toggleFavoritos" class="btn btn-white border border-3 w-100 mt-3">Mostrar
                    favoritos</button>
            </div>

            <div class="col-md-3">
                <select class="form-select form-select-lg shadow-sm" multiple v-model="generoSeleccionado">
                    <option value="">Todos los generos</option>
                    <option v-for="genero in generos" :key="genero.id" :value="genero.id">
                        {{ genero.nombre }}
                    </option>
                </select>
            </div>

            <div class="col-md-3">
                <select class="form-select form-select-lg shadow-sm" multiple="" v-model="actorSeleccionado">
                    <option value="">Todos los actores</option>
                    <option v-for="actor in actores" :key="actor.id" :value="actor.id">
                        {{ actor.nombre }}
                    </option>
                </select>
            </div>
        </div>


        <div class="row">
            <div v-if="filtrarPeliculas.length > 0" class="col-md-3 mb-5" v-for="pelicula in filtrarPeliculas"
                :key="pelicula.id">
                <PeliculaCard :pelicula="pelicula" @edit="editPelicula" @delete="removePelicula"></PeliculaCard>
            </div>
            <div v-else class="text-center my-5">
                <h3 class="text-muted">No se encontraron películas con esos filtros 🍿</h3>
            </div>
        </div>
    </div>
</template>

<script setup>
import PeliculaCard from '@/components/PeliculaCard.vue';
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
import { getPeliculas, createPelicula, updatePelicula, deletePelicula, subscribePeliculas } from '@/services/peliculaService';
import { getActores } from '@/services/actorService';
import { getGeneros } from '@/services/generoService';
import { useMoviesStore } from '@/stores/moviesStore';
import { useToast } from 'vue-toastification';
import { convertirErrores } from '@/utils/errorMessages';

const moviesStore = useMoviesStore()

const peliculas = ref([])
let unsubscribe;
const actores = ref([])
const generos = ref([])

const peliculaSeleccionada = ref(null)
const isEditing = ref(false)
const mostrandoFavoritas = ref(false)

const searchQuery = ref('')
const generoSeleccionado = ref('')
const actorSeleccionado = ref('')

const toast = useToast()

const cargando = ref(true)

const toggleFavoritos = async () => {
    mostrandoFavoritas.value = !mostrandoFavoritas.value
}


const removePelicula = async (id) => {
    if (!confirm('¿Seguro/a que desea eliminar esta pelicula?')) return
    await deletePelicula(id)
    toast.success("Pelicula eliminada correctamente")
}


const filtrarPeliculas = computed(() => {

    return peliculas.value.filter(pelicula => {
        const matchesName = pelicula.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesGenero = !generoSeleccionado.value || generoSeleccionado.value.every(g => pelicula.generos.includes(g))
        const matchesActor = !actorSeleccionado.value || actorSeleccionado.value.every(a => pelicula.actores.includes(a))
        const matchesFavorito = !mostrandoFavoritas.value || moviesStore.favoritesId.includes(pelicula.id)

        return matchesName && matchesGenero && matchesActor && matchesFavorito
    })
})


const cargarDatos = async () => {
    try {
        cargando.value = true
        actores.value = await getActores()
        generos.value = await getGeneros()
    } catch (error) {
        toast.error("Error al cargar los datos: " + convertirErrores(error.code))
    } finally {
        cargando.value = false
    }
}

onMounted(() => {
    unsubscribe = subscribePeliculas((data) => {
        peliculas.value = data
    })
    cargarDatos()
})

onUnmounted(() => {
    if (unsubscribe) unsubscribe()
})






</script>

<style scoped></style>