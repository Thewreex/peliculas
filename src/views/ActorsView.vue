<!-- Actors View -->

<template>
    <!-- Title -->
    <h2 class="text-center my-5">Actores</h2>

    <ActorForm :actor="selectedActor" @save="saveActor" @cancel="resetForm" />

    <button class="btn btn-success" @click="activeFilter = (activeFilter === 'asc' ? 'desc' : 'asc')">Ordenar: {{
        activeFilter === 'asc' ? 'A - Z' : 'Z - A' }}</button>

    <!-- Table of actors -->
    <table class="table table-striped mb-5">
        <thead>
            <tr>

                <th>Nombre</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <!-- Table Content -->
            <tr v-for="actor in sortedActors" :key="actor.id">
                <td>{{ actor.name }}</td>
                <td>
                    <button class="btn btn-primary btn-sm" @click="editActor(actor)">Editar</button>
                    <button data-bs-toggle="modal" data-bs-target="#actorModal" @click="actorId = actor.id"
                        class="btn btn-danger btn-sm">Eliminar</button>
                </td>
            </tr>
        </tbody>
    </table>

    <div class="modal fade" id="actorModal">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">Advertencia</h5>

                    <button class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    {{ toDeleteMovies.length > 0 ? ` Este actor aparece en ${toDeleteMovies.length} peliculas, al borrar
                    este
                    actor, este desaparecera de estas mismas, ¿desea continuar?` : "¿Desea borrar este actor?" }}

                    <div class="my-3" v-for="movie in toDeleteMovies" :key="movie.id">
                        + {{ movie.name }}
                    </div>
                </div>

                <div class="modal-footer">
                    <button @click="removeActor(actorId)" class="btn btn-primary"
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
import { ref, onMounted, onUnmounted, computed } from "vue"
import { useToast } from "vue-toastification";
// Services
import {
    createActor,
    updateActor,
    deleteActor,
    subscribeActors
} from "@/services/actorService";
import { subscribeMovies } from "@/services/movieService";
// Components
import ActorForm from "@/components/ActorForm.vue";


// Composables
const toast = useToast()

// Let
let unsubscribe;
let unsubscribeMovies;

// Refs
const actors = ref([])
const movies = ref([])
const actorId = ref(null)
const selectedActor = ref(null)
const isEditing = ref(false)
const activeFilter = ref("")

// Computed

const toDeleteMovies = computed(() => {
    return movies.value.filter((movie) => movie.actors.includes(actorId.value));
})

// Lifecycle Hooks


// Method to start the subscription that updates data in real time when the component is mounted
onMounted(() => {
    unsubscribe = subscribeActors((data) => {
        actors.value = data
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
* Method to save the actor in the database
* If the form is in edit mode, it will use the update method to update the data in the database based on the selected actor's ID
* If the form is NOT in edit mode, it will use the create method to insert data into the database
*/

const saveActor = async (actor) => {
    if (isEditing.value) {
        await updateActor(selectedActor.value.id, actor)
        toast.success("Se ha editado correctamente el actor.")
    } else {
        createActor(actor)
        toast.success("Se ha ingresado correctamente el actor.")
    }

    resetForm()
}

// Method that activates edit mode
const editActor = (actor) => {
    selectedActor.value = actor
    isEditing.value = true
}

/**
* Method to delete actors from the database
* First, it shows a message to confirm whether the user wants to delete the data
* If so, it deletes the data from the database and notifies the user
*/


const removeActor = async (id) => {
    await deleteActor(id, toDeleteMovies.value)
    toast.success("Se ha eliminado correctamente el actor.")
}

const resetForm = () => {
    selectedActor.value = null
    isEditing.value = false
}

const sortedActors = computed(() => {
    const copy = [...actors.value]

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