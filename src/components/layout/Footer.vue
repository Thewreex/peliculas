<!-- FOOTER PAGE -->

<template>
    <footer class="footer container-fluid  ">
        <div class="d-flex justify-content-evenly py-5 text-center">
            <div class="d-flex justify-content-center align-items-center  ">
                <h2 class="footer-title">Filmados!</h2>
            </div>
            <div>
                <div class="items-list d-flex flex-column align-items-center gap-3 list-unstyled">
                    <h4 class="footer-items-title">Visitar</h4>
                    <router-link to="/peliculas">Peliculas</router-link>
                    <router-link>Actores</router-link>
                    <router-link>Generos</router-link>
                </div>
            </div>
            <div>
                <div v-if="isAdmin" class="items-list d-flex flex-column align-items-center gap-3 list-unstyled">
                    <h4 class="footer-items-title">Admin</h4>
                    <router-link to="/ingreso">Ingresar Peliculas</router-link>
                    <router-link to="/actores">Ingresar Actores</router-link>
                    <router-link to="/generos">Ingresar Generos</router-link>
                </div>
            </div>
            <div>
                <div class="items-list d-flex flex-column align-items-center gap-3 list-unstyled">
                    <h4 class="footer-items-title">Desarrollador</h4>
                    <a href="https://github.com/JuanPablo2518/peliculas">Repositorio</a>
                    <a href="https://github.com/JuanPablo2518/Portafolio">Portafolio</a>
                    <a href="https://www.linkedin.com/in/juan-pablo-ramirez-olivares-a19368313/">Linkedin</a>
                </div>
            </div>
        </div>
        <p class="text-center mt-2">&copy; 2026 JuanPablo2518. Todos los derechos reservados.</p>
    </footer>
</template>

<script setup>
import { useLoginStore } from '@/stores/loginStore';
import { computed } from 'vue';

const loginStore = useLoginStore()

const isAdmin = computed(() => loginStore.role === "admin")


</script>

<style scoped lang="scss">
@use '@/assets/scss/abstracts/variables' as *;
@use '@/assets/scss/abstracts/mixins' as *;


.footer {
    background-color: $secondary-color;
    color: $text-light
}

.footer-title {
    text-decoration: underline;
    text-decoration-color: $primary-color;
    text-underline-offset: 8px;
    font-weight: 600;
}

.footer-items-title {
    text-decoration: underline;
    text-underline-offset: 8px;
    font-weight: 600;
}

.items-list a {
    cursor: pointer;
    @include underline-animation($text-light, -2px)
}
</style>