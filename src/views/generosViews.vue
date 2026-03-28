<template>
    <h2 class="text-center my-5">Generos</h2>

    <GenerosForm :genero="generoSeleccionado" @guardar="guardarGenero" />

    <table class="table table-striped mb-5">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="genero in generos" :key="genero.id">
                <td>{{ genero.nombre }}</td>
                <td>
                    <button class="btn btn-primary btn-sm" @click="editarGenero(genero)">Editar</button>
                    <button class="btn btn-danger btn-sm" @click="removeGenero(genero.id)">Eliminar</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import { ref, onMounted } from "vue"
import {
    getGeneros,
    createGenero,
    updateGenero,
    deleteGenero
} from "@/services/generoService";
import GenerosForm from "@/components/GenerosForm.vue";

const generos = ref([])
const generoSeleccionado = ref(null)
const isEditing = ref(false)

const cargarGeneros = async () => {
    try {
        generos.value = await getGeneros()
    } catch (error) {
        console.error('Error al cargar los generos', error)
    }
}

onMounted(cargarGeneros)

const guardarGenero = async (genero) => {
    if (isEditing.value) {
        await updateGenero(generoSeleccionado.value.id, genero)
    } else {
        createGenero(genero)
    }

    generoSeleccionado.value = null
    isEditing.value = false;

    await cargarGeneros()
}

const editarGenero = (genero) => {
    generoSeleccionado.value = genero
    isEditing.value = true
}

const removeGenero = async (id) => {
    if (!confirm('¿Seguro/a que desea eliminar este genero?')) return
    await deleteGenero(id)
    cargarGeneros()
}
</script>

<style scoped></style>