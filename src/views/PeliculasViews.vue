<template>
    <h1 class="text-center my-5 fw-bold display-5">Peliculas!</h1>

    <PeliculasForm v-if="isAdmin" :pelicula="peliculaSeleccionada" :actores="actores" :generos="generos"
        @guardar="guardarPelicula" />

    <div class="row">
        <div class="col-md-3 mb-5" v-for="pelicula in peliculas" :key="pelicula.id">
            <PeliculaCard :pelicula="pelicula" @edit="editPelicula" @delete="removePelicula" />
        </div>
    </div>
</template>

<script setup>
import PeliculaCard from '@/components/PeliculaCard.vue';
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
import { getPeliculas, createPelicula, updatePelicula, deletePelicula, subscribePeliculas } from '@/services/peliculaService';
import { getActores } from '@/services/actorService';
import { getGeneros } from '@/services/generoService';
import PeliculasForm from '@/components/PeliculasForm.vue';
import { useStore } from 'vuex';

const store = useStore()

const peliculas = ref([])
let unsubscribe;
const actores = ref([])
const generos = ref([])

const peliculaSeleccionada = ref(null)
const isEditing = ref(false)

const isAdmin = computed(() => store.state.rol === 'admin')

const cargarDatos = async () => {
    try {
        actores.value = await getActores()
        generos.value = await getGeneros()
    } catch (error) {
        console.error('Error al cargar los datos: ', error)
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

const guardarPelicula = async (pelicula) => {
    if (isEditing.value) {
        await updatePelicula(peliculaSeleccionada.value.id, pelicula)
    } else {
        await createPelicula(pelicula)
    }

    peliculaSeleccionada.value = null
    isEditing.value = false

}

const editPelicula = (pelicula) => {
    peliculaSeleccionada.value = pelicula
    isEditing.value = true
}

const removePelicula = async (id) => {
    if (!confirm('¿Seguro/a que desea eliminar esta pelicula?')) return
    await deletePelicula(id)
}

</script>

<style scoped></style>