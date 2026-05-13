<!-- Genres View -->

<template>
    <!-- Title -->
    <h2 class="text-center my-5">Generos</h2>

    <GeneresForm :genre="selectedGenre" @save="saveGenre" @cancel="resetForm" />

    <button class="btn btn-success" @click="activeFilter = (activeFilter === 'asc' ? 'desc' : 'asc')">Ordenar: {{
        activeFilter === 'asc' ? 'A - Z' : 'Z - A' }}</button>

    <!-- Table of genres -->
    <table class="table table-striped mb-5">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <!-- Table Content -->
            <tr v-for="genre in sortedGenres" :key="genre.id">
                <td>{{ genre.name }}</td>
                <td>
                    <button class="btn btn-primary btn-sm" @click="editGenre(genre)">Editar</button>
                    <button data-bs-toggle="modal" data-bs-target="#genreModal" class="btn btn-danger btn-sm"
                        @click="genreId = genre.id">Eliminar</button>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="modal fade" id="genreModal">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">Advertencia</h5>

                    <button class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    {{ toDeleteMovies.length > 0 ? ` Este genero aparece en ${toDeleteMovies.length} peliculas, al
                    borrar
                    este
                    genero, este desaparecera de estas mismas, ¿desea continuar?` : "¿Desea borrar este genero?" }}

                    <div class="my-3" v-for="movie in toDeleteMovies" :key="movie.id">
                        + {{ movie.name }}
                    </div>
                </div>

                <div class="modal-footer">
                    <button @click="removeGenre(genreId)" class="btn btn-primary"
                        data-bs-dismiss="modal">Eliminar</button>
                    <button class="btn btn-secondary" data-bs-dismiss="modal">
                        Cerrar
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
// VUE Libraries
import { useToast } from "vue-toastification";
import { ref, onMounted, onUnmounted, computed } from "vue"
// Services
import {
    createGenre,
    updateGenre,
    deleteGenre,
    subscribeGenres
} from "@/services/genreService";
import { subscribeMovies } from "@/services/movieService";
// Components
import GeneresForm from "@/components/GenresForm.vue";

// Composables
const toast = useToast()

// Let
let unsubscribe;
let unsubscribeMovies;

// Refs
const genres = ref([])
const movies = ref([])
const genreId = ref(null)
const selectedGenre = ref(null)
const isEditing = ref(false)
const activeFilter = ref("")

// Computed

const toDeleteMovies = computed(() => {
    return movies.value.filter((movie) => movie.genres.includes(genreId.value));
})

// Lifecycle Hooks


// Method to start the subscription that updates data in real time when the component is mounted

onMounted(() => {
    unsubscribe = subscribeGenres((data) => {
        genres.value = data
    })
    unsubscribeMovies = subscribeMovies((data) => {
        movies.value = data
    })

})

// Method to unsubscribe when the component is unmounted

onUnmounted(() => {
    if (unsubscribe) unsubscribe()
    if (unsubscribeMovies) unsubscribeMovies()
})

// Methods

/**
* Method to save the genre in the database
* If the form is in edit mode, it will use the update method to update the data in the database based on the selected genre's ID
* If the form is NOT in edit mode, it will use the create method to insert data into the database
*/

const saveGenre = async (genre) => {
    if (isEditing.value) {
        await updateGenre(selectedGenre.value.id, genre)
        toast.success("Género actualizado correctamente.")
    } else {
        createGenre(genre)
        toast.success("Género ingresado correctamente.")
    }

    resetForm()

}

// Method that activates edit mode
const editGenre = (genre) => {
    selectedGenre.value = genre
    isEditing.value = true
}

/**
* Method to delete genres from the database
* First, it shows a message to confirm whether the user wants to delete the data
* If so, it deletes the data from the database and notifies the user
*/

const removeGenre = async (id) => {
    await deleteGenre(id, toDeleteMovies.value)
    toast.success("Género eliminado correctamente.")
}
const resetForm = () => {
    selectedGenre.value = null
    isEditing.value = false
}

const sortedGenres = computed(() => {
    const copy = [...genres.value]

    if (!activeFilter.value) return copy

    copy.sort((a, b) => {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()

        if (activeFilter.value === 'asc') {
            return nameA.localeCompare(nameB)
        } else {
            return nameB.localeCompare(nameA)
        }
    })
    return copy
})
</script>

<style scoped></style>