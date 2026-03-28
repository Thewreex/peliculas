<template>
    <form @submit.prevent="submitForm" class="mb-5">
        <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': v$.nombre.$error }" v-model="nombre">
            <div class="invalid-feedback" v-if="v$.nombre.$error">
                El nombre es obligatorio y debe tener al menos 4 caracteres
            </div>
        </div>
        <button class="btn btn-primary">Guardar</button>
    </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import useVuelidate from '@vuelidate/core';
import { minLength, required } from '@vuelidate/validators';

const rules = {
    nombre: { required, minLength: minLength(4) }
}

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

const v$ = useVuelidate(rules, { nombre })

const resetForm = () => {
    nombre.value = ""
}

const submitForm = async () => {
    const result = await v$.value.$validate()

    if (!result) return

    emit('guardar', {
        nombre: nombre.value
    })

    resetForm()

    v$.value.$reset()
}
</script>

<style scoped></style>