<template>
    <div class="row justify-content-center my-5 pt-5">
        <div class="col-4 border rounded p-5 shadow">
            <h2 class="text-center mb-5">Formulario de registro</h2>
            <form @submit.prevent="registrar">
                <div class="mb-3">
                    <label class="form-label">Nombre</label>
                    <input type="text" class="form-control" v-model="nombre" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" v-model="email" required>
                </div>
                <div class="mb-5">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" v-model="password" required>
                </div>
                <button class="btn btn-primary w-100">Registrarse</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { register, getUserRol } from '@/services/authService';

const store = useStore()
const router = useRouter()

const nombre = ref('')
const email = ref('')
const password = ref('')

const registrar = async () => {
    try {
        const user = await register(email.value, password.value, nombre.value)

        store.commit('setUser', user)

        const rol = await getUserRol(user.uid)

        store.commit('setRol', rol)

        router.push('/peliculas')
    } catch (error) {
        alert(error.message)
    }
}
</script>


<style scoped></style>