<!-- NAVBAR PAGE -->

<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary bg-dark" data-bs-theme="dark">
        <div class="container">
            <a class="navbar-brand" href="#">Películas</a>

            <!-- HAMBURGER MENU MODE FOR MOBILE DEVICES -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- LINK MENU FOR NAVIGATING BETWEEN DIFFERENT ROUTES -->
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav ms-auto">
                    <router-link class="nav-link active" to="/peliculas">Películas</router-link>
                    <router-link class="nav-link active" to="/actores">Actores</router-link>
                    <router-link class="nav-link active" to="/generos">Géneros</router-link>
                    <router-link class="nav-link active" to="/ingreso">Ingresar</router-link>

                    <!-- No User links -->
                    <template v-if="!user">
                        <div class="navbar-nav ms-auto">
                            <router-link class="nav-link" to="/registrar">Registrarse</router-link>
                            <router-link class="nav-link" to="/login">Login</router-link>
                        </div>
                    </template>

                    <!-- With user links -->
                    <template v-else>
                        <span class="nav-link me-3">Bienvenido: {{ name }}</span>
                        <button @click="logOut" class="btn btn-outline-light">Cerrar sesión</button>
                    </template>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
// VUE LIBRARIES
import { computed } from 'vue';
// STORE
import { useLoginStore } from '@/stores/loginStore';
// SERVICES
import { logout } from '@/services/authService';


// VARIABLES
const loginStore = useLoginStore()
const user = computed(() => loginStore.user)
const name = computed(() => {
    return loginStore.userProfile?.name || ''
})

//METHODS

/** 
 * Method that confirms whether the user wants to log out
 * If so, it calls the logout method
*/
const logOut = async () => {
    if (!confirm('¿Está seguro de que desea cerrar sesión?')) return
    await logout()
    loginStore.logout()
}
</script>

<style scoped></style>