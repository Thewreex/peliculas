<!-- FormView -->
<template>
    <MoviesForm @save="saveMovie" :actors="actors" :genres="genres" :movies="movies" />
</template>


<script setup>
// Components
import MoviesForm from '@/components/MoviesForm.vue';
// Services
import { createMovie, updateMovie, subscribeMovies } from '@/services/movieService';
import { subscribeActors } from '@/services/actorService';
import { subscribeGenres } from '@/services/genreService';
// VUE Libraries
import { ref, onMounted, onUnmounted, computed } from "vue"
import { useToast } from 'vue-toastification';
// Stores
import { useMoviesStore } from '@/stores/moviesStore';

// Composables
const toast = useToast()
const moviesStore = useMoviesStore()

// Lets

let unsubscribeActors;
let unsubscribeGenres;
let unsubscribeMovies;

// Refs

const actors = ref([])
const genres = ref([])
const movies = ref([])

// Computed

const selectedMovie = computed(() => moviesStore.selectedMovie)
const isEditing = computed(() => !!selectedMovie.value)

// Lifecycle Hooks

// Method to start the subscription that updates data in real time when the component is mounted
onMounted(() => {
    unsubscribeMovies = subscribeMovies((data) => {
        movies.value = data
    })
    unsubscribeActors = subscribeActors((data) => {
        actors.value = data
    })
    unsubscribeGenres = subscribeGenres((data) => {
        genres.value = data
    })
})


// Method to unsubscribe when the component is unmounted
onUnmounted(() => {
    if (unsubscribeMovies) unsubscribeMovies()
    if (unsubscribeActors) unsubscribeActors()
    if (unsubscribeGenres) unsubscribeGenres()
})

// Methods

/**
* Method to save the movie in the database
* If the form is in edit mode, it will use the update method to update the data in the database based on the selected movie's ID
* If the form is NOT in edit mode, it will use the create method to insert data into the database
*/
const saveMovie = async (movie) => {
    if (isEditing.value) {
        await updateMovie(selectedMovie.value.id, movie)
        toast.success("Película actualizada correctamente.")
    } else {
        await createMovie(movie)
        toast.success("Se ha ingresado la película correctamente.")
    }
    moviesStore.setMovie(null)
}


</script>

<style scoped></style>