<template>
    <form @submit.prevent="submitForm" class="mb-5">
        <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" v-model="nombre" required>
        </div>
        <button class="btn btn-primary">Guardar</button>
    </form>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    actor: Object
})

const emit = defineEmits(['guardar'])

watch(() => props.actor, (nuevoActor) => {
    if (nuevoActor) {
        nombre.value = nuevoActor.nombre
    }
})

const nombre = ref('')

const resetForm = () => {
    nombre.value = ""
}

const submitForm = () => {
    emit('guardar', {
        nombre: nombre.value
    })

    resetForm()
}
</script>

<style scoped></style>