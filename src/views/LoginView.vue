<template>
    <div class="row justify-content-center my-5 pt-5">
        <div class="col-4 border rounded p-5 shadow">
            <h2 class="text-center mb-5">Iniciar sesion</h2>
            <form @submit.prevent="iniciarSesion" class="mb-3">
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" v-model="email" required>
                </div>
                <div class="mb-5">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" v-model="password" required>
                </div>
                <button class="btn btn-primary w-100">Crear cuenta</button>
            </form>
            <div class="text-center">
                <router-link to="/register" class="mt-3">Registrarse</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { login, getUserRol, getUserProfile } from '@/services/authService';

const store = useStore()
const router = useRouter()
const toast = useToast()

const email = ref('')
const password = ref('')

const iniciarSesion = async () => {
    try {
        const user = await login(email.value, password.value)

        store.commit('setUser', user)

        const rol = await getUserRol(user.uid)

        store.commit('setRol', rol)

        const profile = await getUserProfile(user.uid)

        store.commit('setUserProfile', profile)

        router.push('/peliculas')

        toast.success(`Bienvenido: ${profile.nombre}`)
    } catch (error) {
        toast.error("Vaya, algo salio mal: " + error.message)
    }
}
</script>


<style scoped></style>