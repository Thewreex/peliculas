<template>
    <div class="card shadow">
        <img :src="pelicula.poster" :alt="pelicula.nombre" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">
                {{ pelicula.nombre }}
            </h5>
            <p class="card-text text-muted">
                {{ pelicula.year }}
            </p>
            <p class="card-text text-muted">
                <span class="me-3">Actores: {{ pelicula.actores ? pelicula.actores.length : 0 }}</span>
                <span>Generos {{ pelicula.generos ? pelicula.generos.length : 0 }}</span>
            </p>
        </div>
        <div class="d-flex justify-content-center gap-2 card-footer">
            <router-link :to="`/peliculas/${pelicula.id}`" class="btn btn-sm btn-info">Detalles</router-link>
            <button v-if="isAdmin" data-bs-dismiss="modal" @click="enviarEdit"
                class="btn btn-sm btn-primary">Editar</button>
            <button v-if="isAdmin" @click="emit('delete', pelicula.id)" class="btn btn-sm btn-danger">Eliminar</button>
            <!-- Corazón de favorito -->
            <button @click="toggleFavorito" class="btn btn-sm"
                :class="isFavorito ? 'btn-danger' : 'btn-outline-danger'">
                {{ isFavorito ? '❤️' : '🤍' }}
            </button>

        </div>
    </div>
</template>

<script setup>

import { computed } from 'vue';
import { useStore } from 'vuex';
import { addFavorito, removeFavorito } from '@/services/favoritoService';
import { useToast } from 'vue-toastification';

const store = useStore()
const toast = useToast()
const props = defineProps({
    pelicula: Object
})

const enviarEdit = () => {
    store.commit("setPelicula", props.pelicula)
}

const emit = defineEmits(['delete'])

const isAdmin = computed(() => store.state.rol === 'admin')

const isFavorito = computed(() => {
    return store.state.favoritosId.includes(props.pelicula.id)
})

const toggleFavorito = async () => {
    const user = store.state.user

    if (!user) {
        toast.warning("¡Debes iniciar sesion para marcar favoritos!")
        return
    }

    if (isFavorito.value) {
        const favorito = store.state.favoritos.find(f => f.peliculaId === props.pelicula.id)

        if (favorito) await removeFavorito(favorito.id)
    } else {
        await addFavorito(user.uid, props.pelicula.id)
    }
}
</script>

<style scoped></style>