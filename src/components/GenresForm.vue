<!-- genresForm component
This component is the form where genres can be created/updated -->

<template>
    <form @submit.prevent="submitForm" class="mb-5">
        <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': v$.name.$error }" v-model="name">
            <div class="invalid-feedback" v-if="v$.name.required.$invalid">
                Por favor, ingrese un nombre
            </div>
            <div class="invalid-feedback" v-if="v$.name.minLength.$invalid">
                El nombre debe ser de al menos {{ v$.name.minLength.$params.min }} caracteres.
            </div>
        </div>
        <button class="btn btn-primary">Guardar</button>
    </form>
</template>

<script setup>
// VUE Libraries
import { ref, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { minLength, required } from '@vuelidate/validators';

// PROPS

const props = defineProps({
    genre: Object
})

// EMITS (from genresView)

const emit = defineEmits(['save'])

// REFS

const name = ref('')

// Vuelidate

const rules = {
    name: { required, minLength: minLength(3) }
}

const v$ = useVuelidate(rules, { name })

// METHODS


/**

* Method used to submit the form data
* Checks whether the value exists and meets the Vuelidate requirements
* If valid: uses the save emit defined in genresView, and resets the form
* If not valid, returns null
*/
const submitForm = async () => {
    const result = await v$.value.$validate()

    if (!result) return


    emit('save', {
        name: name.value
    })

    name.value = ""

    v$.value.$reset()
}

// WATCHERS

// Watch used to assign the genre prop value after it loads
watch(() => props.genre, (newGenre) => {
    if (newGenre) {
        name.value = newGenre.name
    }
})
</script>

<style scoped></style>