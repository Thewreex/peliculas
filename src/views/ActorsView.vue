<!-- Actors View -->

<template>
    <!-- Title -->
    <h2 class="text-center my-5">Actores</h2>

    <ActorForm :actor="selectedActor" @save="saveActor" />

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
            <tr v-for="actor in actors" :key="actor.id">
                <td>{{ actor.name }}</td>
                <td>
                    <button class="btn btn-primary btn-sm" @click="editActor(actor)">Editar</button>
                    <button class="btn btn-danger btn-sm" @click="removeActor(actor.id)">Eliminar</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
// VUE Libraries
import { ref, onMounted, onUnmounted } from "vue"
import { useToast } from "vue-toastification";
// Services
import {
    createActor,
    updateActor,
    deleteActor,
    subscribeActors
} from "@/services/actorService";
// Components
import ActorForm from "@/components/ActorForm.vue";


// Composables
const toast = useToast()

// Let
let unsubscribe;

// Refs
const actors = ref([])
const selectedActor = ref(null)
const isEditing = ref(false)

// Lifecycle Hooks


// Method to start the subscription that updates data in real time when the component is mounted
onMounted(() => {
    unsubscribe = subscribeActors((data) => {
        actors.value = data
    })
})

// Method to unsubscribe when the component is unmounted
onUnmounted(() => {
    if (unsubscribe) unsubscribe()
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

    selectedActor.value = null
    isEditing.value = false;
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
    if (!confirm('¿Seguro/a de que desea eliminar este actor/actriz?')) return
    await deleteActor(id)
    toast.success("Se ha eliminado correctamente el actor.")
}
</script>

<style scoped></style>