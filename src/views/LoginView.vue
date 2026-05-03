<!-- LoginView -->

<template>
    <div v-if="!loading" class="row justify-content-center my-5 pt-5">
        <!-- Login Card -->
        <div class="col-4 border rounded p-5 shadow">
            <!-- Title -->
            <h2 class="text-center mb-5">Iniciar sesión</h2>
            <!-- Login Form -->
            <form @submit.prevent="logIn" class="mb-3">
                <!-- Email Field -->
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="text" class="form-control" v-model="email">
                </div>
                <!-- Passoword Field -->
                <div class="mb-5">
                    <label class="form-label">Contraseña</label>
                    <input type="password" class="form-control" v-model="password">
                </div>
                <!-- Login Button -->
                <button class="btn btn-primary w-100">Iniciar sesión</button>
            </form>
            <!-- Register Link -->
            <div class="text-center">
                <router-link to="/registrar" class="mt-3">Registrarse</router-link>
            </div>
        </div>
    </div>
    <!-- Loading Screen -->
    <div v-else class="d-flex min-vh-100 justify-content-center align-items-center">
        <Spinner />
    </div>
</template>

<script setup>
// VUE Libraries
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter, useRoute } from 'vue-router';
// Stores
import { useLoginStore } from '@/stores/loginStore';
// Services
import { login, getUserRole, getUserProfile } from '@/services/authService';
// Components
import Spinner from '@/components/Spinner.vue';
// Utils
import { convertErrors } from '@/utils/errorMessages';

// Composables
const loginStore = useLoginStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

// Refs
const loading = ref(false)
const email = ref('')
const password = ref('')

// Methods

/**
* Method that allows users to log in
* First, it uses the login method to verify the credentials in the database
* If they exist, it returns information such as the role and profile, and stores it in the store
* Then it redirects to the movies page and shows a welcome toast
* In case of an error, it displays the error in a toast
*/

const logIn = async () => {
    loading.value = true
    try {
        const user = await login(email.value, password.value)

        loginStore.setUser(user)

        const role = await getUserRole(user.uid)

        loginStore.setRole(role)

        const profile = await getUserProfile(user.uid)

        loginStore.setUserProfile(profile)

        const redirect = route.query.redirect || '/peliculas'
        router.push(redirect)

        toast.success(`Bienvenido: ${profile.name}`)
    } catch (error) {
        toast.error("Vaya, algo salió mal: " + convertErrors(error.code))
    } finally {
        loading.value = false
    }
}
</script>


<style scoped></style>