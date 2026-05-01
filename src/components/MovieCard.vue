<!-- MovieCard Component
This is the component for the movie cards displayed in MovieView -->
<template>
    <div class="card shadow">

        <!-- Movie Poster -->

        <img :src="movie.poster" :alt="movie.name" class="card-img-top">

        <!-- title and main movie details -->

        <div class="card-body">
            <h5 class="card-title">
                {{ movie.name }}
            </h5>
            <p class="card-text text-muted">
                {{ movie.year }}
            </p>
            <p class="card-text text-muted">
                <span class="me-3">Actores: {{ movie.actors ? movie.actors.length : 0 }}</span>
                <span>Genres {{ movie.genres ? movie.genres.length : 0 }}</span>
            </p>
        </div>

        <!-- card buttons -->

        <div class="d-flex justify-content-center gap-2 card-footer">
            <router-link :to="`/peliculas/${movie.id}`" class="btn btn-sm btn-info">Detalles</router-link>
            <button v-if="isAdmin" data-bs-dismiss="modal" @click="sendEdit"
                class="btn btn-sm btn-primary">Editar</button>
            <button v-if="isAdmin" @click="emit('delete', movie.id)" class="btn btn-sm btn-danger">Eliminar</button>

            <!-- favorite button -->
            <button @click="toggleFavorite" class="btn btn-sm"
                :class="isFavorite ? 'btn-danger' : 'btn-outline-danger'">
                {{ isFavorite ? '❤️' : '🤍' }}
            </button>

        </div>
    </div>
</template>

<script setup>
// VUE Libraries
import { computed } from 'vue';
import { useToast } from 'vue-toastification';
// Services
import { addFavorite, removeFavorite } from '@/services/favoriteService';
// Stores
import { useLoginStore } from '@/stores/loginStore';
import { useMoviesStore } from '@/stores/moviesStore';

// Props

const props = defineProps({
    movie: Object
})

// Emits (from MovieView)

const emit = defineEmits(['delete'])

// Composables

const loginStore = useLoginStore()
const moviesStore = useMoviesStore()

const toast = useToast()

// Computed 

// Computed function that checks in the store if the current user is an admin

const isAdmin = computed(() => loginStore.role === 'admin')

// Computed function that calculates the movies that are in favorites

const isFavorite = computed(() => {
    return moviesStore.favoritesId.includes(props.movie.id)
})

// Methods

/** Method to assign a movie to the form for editing
* This function will only be available for the edit movies button modal
*/

const sendEdit = () => {
    moviesStore.setMovie(props.movie)
}

/** Method for the favorites functionality
* Allows marking and unmarking favorites
* If a user tries to mark a favorite, it returns null
*/

const toggleFavorite = async () => {
    const user = loginStore.user

    if (!user) {
        toast.warning("¡Debes iniciar sesión para marcar favoritos!")
        return
    }

    if (isFavorite.value) {
        const favorite = moviesStore.favorites.find(f => f.movieId === props.movie.id)

        if (favorite) await removeFavorite(favorite.id)
    } else {
        await addFavorite(user.uid, props.movie.id)
    }
}
</script>

<style scoped></style>