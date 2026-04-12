<template>
    <div v-if="!cargando" class="row justify-content-center my-5 pt-5">
        <div class="col-4 border rounded p-5 shadow">
            <h2 class="text-center mb-5">Formulario de registro</h2>
            <form @submit.prevent="registrar">
                <div class="mb-3">
                    <label class="form-label">Nombre</label>
                    <input type="text" class="form-control" :class="{ 'is-invalid': v$.nombre.$error }"
                        v-model="nombre">
                    <div v-if="v$.nombre.required.$invalid" class="invalid-feedback">El nombre es obligatorio</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="text" class="form-control" :class="{ 'is-invalid': v$.email.$error }" v-model="email">
                    <div class="invalid-feedback" v-if="v$.email.required.$invalid">El correo es obligatorio</div>
                    <div class="invalid-feedback" v-if="v$.email.email.$invalid">Ingrese un formato de correo valido
                    </div>
                    <div class="invalid-feedback" v-if="v$.email.isUnique.$invalid">Este correo ya esta registrado</div>
                </div>
                <div class="mb-5">
                    <label class="form-label">Contraseña</label>
                    <input type="password" class="form-control" :class="{ 'is-invalid': v$.password.$error }"
                        v-model="password">
                    <div v-if="v$.password.minLength.$invalid" class="invalid-feedback">La contraseña debe ser de un
                        minimo de 6 caracteres</div>
                    <div v-if="v$.password.required.$invalid" class="invalid-feedback">La contraseña es obligatoria
                    </div>

                </div>
                <button class="btn btn-primary w-100">Registrarse</button>
            </form>
        </div>
    </div>
    <div v-else class="d-flex min-vh-100 justify-content-center align-items-center">
        <Spinner />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register, getUserRol, checkEmailExists } from '@/services/authService';
import { helpers, required, email as emailValidator, minLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { useToast } from 'vue-toastification';
import Spinner from '@/components/Spinner.vue';
import { convertirErrores } from '@/utils/errorMessages';
import { useLoginStore } from '@/stores/loginStore';

const loginStore = useLoginStore()
const router = useRouter()
const toast = useToast()

const nombre = ref('')
const email = ref('')
const password = ref('')

const cargando = ref(false)


const isUniqueEmail = async (value) => {
    if (value === '') return true
    const exists = await checkEmailExists(value)
    return !exists
}

const rules = {
    email: {
        required,
        email: emailValidator,
        isUnique: helpers.withAsync(isUniqueEmail)
    },
    nombre: {
        required
    },
    password: {
        required, minLength: minLength(6)
    }
}

const v$ = useVuelidate(rules, { nombre, email, password })


const registrar = async () => {
    cargando.value = true
    try {
        const result = await v$.value.$validate()

        if (!result) return

        const user = await register(email.value, password.value, nombre.value)

        loginStore.setUser(user)

        const rol = await getUserRol(user.uid)

        loginStore.setRole(rol)

        router.push('/peliculas')

        v$.value.$reset()
        toast.success("Se ha creado la cuenta exitosamente")
    } catch (error) {
        toast.error("Ha ocurrido un error al crear la cuenta: " + convertirErrores(error.code))
    } finally {
        cargando.value = false
    }
}
</script>


<style scoped></style>