<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary bg-dark" data-bs-theme="dark">
        <div class="container">
            <a class="navbar-brand" href="#">Peliculas</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav ms-auto">
                    <router-link class="nav-link active" to="/peliculas">Peliculas </router-link>
                    <router-link class="nav-link active" to="/actores">Actores </router-link>
                    <router-link class="nav-link active" to="/generos">Generos </router-link>
                    <template v-if="!user">
                        <div class="navbar-nav ms-auto">
                            <router-link class="nav-link" to="/register">Registrarse</router-link>
                            <router-link class="nav-link" to="/login">Login</router-link>
                        </div>
                    </template>

                    <template v-else>
                        <span class="nav-link me-3">Bienvenido: {{ nombre }}</span>
                        <button @click="cerrarSesion" class="btn btn-outline-light">Cerrar Sesion</button>
                    </template>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { logout } from '@/services/authService';

const store = useStore()
const router = useRouter()

const user = computed(() => store.state.user)

const nombre = computed(() => {
    return store.state.userProfile?.nombre || ''
})

const cerrarSesion = async () => {
    if (!confirm('¿Seguro/a que desea cerrar sesion?')) return
    await logout()
    store.commit('logout')
}



</script>

<style scoped></style>