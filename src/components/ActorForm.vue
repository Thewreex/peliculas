<!-- ActorForm component
This component is the form where actors can be created/updated -->
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
        <div class="d-flex gap-3">
            <button class="btn btn-primary">Guardar</button>
            <button type="button" class="btn btn-danger" @click="cancelEdit" v-if="props.actor">Cancelar
                Edicion</button>
        </div>
    </form>
</template>

<script setup>
// VUE Libraries
import { ref, watch } from 'vue';
import useVuelidate from '@vuelidate/core';
import { minLength, required } from '@vuelidate/validators';
import { useToast } from 'vue-toastification';
// Services
import { getActors } from '@/services/actorService';


// COMPOSABLES
const toast = useToast();

// PROPS
const props = defineProps({
    actor: Object
})

// EMITS (from actorsView)

const emit = defineEmits(['save', 'cancel'])


// REFS
const name = ref('')

// Vuelidate
const rules = {
    name: { required, minLength: minLength(4) }
}
const v$ = useVuelidate(rules, { name })


// METHODS

/**

* Method used to submit the form data
* Checks whether the value exists and meets the Vuelidate requirements
* If valid: uses the save emit defined in actorsView, and resets the form
* If not valid, returns null
*/

const submitForm = async () => {
    const result = await v$.value.$validate()
    if (!result) return

    const actors = await getActors()


    if (props.actor?.name !== name.value) {
        if (actors.find(a => a.name.trim().toLowerCase() === name.value.trim().toLowerCase())) {
            toast.warning("El actor ingresado ya existe.")
            return
        }
    }

    emit('save', {
        name: name.value
    })

    name.value = ""
    v$.value.$reset()
}

const cancelEdit = () => {
    name.value = ""
    v$.value.$reset()
    emit('cancel')
}

// WATCHERS

// Watch used to assign the actor prop value after it loads
watch(() => props.actor, (newActor) => {
    if (newActor) {
        name.value = newActor.name
    }
})

</script>

<style scoped></style>