<template>
    <div v-if="!cargando" class="row justify-content-center my-5 pt-5">
        <div class="col-4 border rounded p-5 shadow">
            <h2 class="text-center mb-5">Iniciar sesion</h2>
            <form @submit.prevent="iniciarSesion" class="mb-3">
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="text" class="form-control" v-model="email">
                </div>
                <div class="mb-5">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" v-model="password">
                </div>
                <button class="btn btn-primary w-100">Iniciar sesion</button>
            </form>
            <div class="text-center">
                <router-link to="/registrar" class="mt-3">Registrarse</router-link>
            </div>
        </div>
    </div>
    <div v-else class="d-flex min-vh-100 justify-content-center align-items-center">
        <Spinner />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useLoginStore } from '@/stores/loginStore';
import { useRouter } from 'vue-router';
import { login, getUserRol, getUserProfile } from '@/services/authService';
import Spinner from '@/components/Spinner.vue';
import { convertirErrores } from '@/utils/errorMessages';

const loginStore = useLoginStore()
const router = useRouter()
const toast = useToast()
const cargando = ref(false)

const email = ref('')
const password = ref('')

const iniciarSesion = async () => {
    cargando.value = true
    try {
        const user = await login(email.value, password.value)

        loginStore.setUser(user)

        const rol = await getUserRol(user.uid)

        loginStore.setRole(rol)

        const profile = await getUserProfile(user.uid)

        loginStore.setUserProfile(profile)

        router.push('/peliculas')

        toast.success(`Bienvenido: ${profile.nombre}`)
    } catch (error) {
        toast.error("Vaya, algo salio mal: " + convertirErrores(error.code))
    } finally {
        cargando.value = false
    }
}
</script>


<style scoped></style>