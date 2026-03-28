<template>
    <h2 class="text-center my-5">Actores</h2>

    <ActorForm :actor="actorSeleccionado" @guardar="guardarActor" />

    <table class="table table-striped mb-5">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="actor in actores" :key="actor.id">
                <td>{{ actor.nombre }}</td>
                <td>
                    <button class="btn btn-primary btn-sm" @click="editarActor(actor)">Editar</button>
                    <button class="btn btn-danger btn-sm" @click="removeActor(actor.id)">Eliminar</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import { ref, onMounted } from "vue"
import {
    getActores,
    createActor,
    updateActor,
    deleteActor,
    subscribeActores
} from "@/services/actorService";
import ActorForm from "@/components/ActorForm.vue";

const actores = ref([])
let unsubscribe;
const actorSeleccionado = ref(null)
const isEditing = ref(false)

const cargarActores = async () => {
    try {
        actores.value = await getActores()
    } catch (error) {
        console.error('Error al cargar los actores', error)
    }
}

onMounted(() => {
    unsubscribe = subscribeActores((data) => {
        actores.value = data
    })
    cargarActores()
})

const guardarActor = async (actor) => {
    if (isEditing.value) {
        await updateActor(actorSeleccionado.value.id, actor)
    } else {
        createActor(actor)
    }

    actorSeleccionado.value = null
    isEditing.value = false;

}

const editarActor = (actor) => {
    actorSeleccionado.value = actor
    isEditing.value = true
}

const removeActor = async (id) => {
    if (!confirm('¿Seguro/a que desea eliminar este actor/actriz?')) return
    await deleteActor(id)
}
</script>

<style scoped></style>