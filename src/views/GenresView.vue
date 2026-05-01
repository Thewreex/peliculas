<!-- Genres View -->

<template>
    <!-- Title -->
    <h2 class="text-center my-5">Generos</h2>

    <GeneresForm :genre="selectedGenre" @save="saveGenre" />

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
            <tr v-for="genre in genres" :key="genre.id">
                <td>{{ genre.name }}</td>
                <td>
                    <button class="btn btn-primary btn-sm" @click="editGenre(genre)">Editar</button>
                    <button class="btn btn-danger btn-sm" @click="removeGenre(genre.id)">Eliminar</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
// VUE Libraries
import { useToast } from "vue-toastification";
import { ref, onMounted, onUnmounted } from "vue"
// Services
import {
    createGenre,
    updateGenre,
    deleteGenre,
    subscribeGenres
} from "@/services/genreService";
// Components
import GeneresForm from "@/components/GenresForm.vue";

// Composables
const toast = useToast()

// Let
let unsubscribe;

// Refs
const genres = ref([])
const selectedGenre = ref(null)
const isEditing = ref(false)

// Lifecycle Hooks


// Method to start the subscription that updates data in real time when the component is mounted

onMounted(() => {
    unsubscribe = subscribeGenres((data) => {
        genres.value = data
    })


})

// Method to unsubscribe when the component is unmounted

onUnmounted(() => {
    if (unsubscribe) unsubscribe()
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

    selectedGenre.value = null
    isEditing.value = false;

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
    if (!confirm('¿Seguro/a de que desea eliminar este género?')) return
    await deleteGenre(id)
    toast.success("Género eliminado correctamente.")
}
</script>

<style scoped></style>