<template>
    <div class="mb-5 pb-5" v-if="pelicula">
        <h2 class="text-center my-5 py-5 display-5 fw-bold">{{ pelicula.nombre }}</h2>
        <div v-if="trailerKey" class="my-5">
            <h5 class="fw-bold mb-3"> Trailer Oficial </h5>
            <div class="ratio ratio-16x9 shadow-sm rounded overflow-hidden">
                <iframe :src="'https://www.youtube.com/embed/' + trailerKey" title="Youtube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen=""></iframe>
            </div>
        </div>
        <div class="row justify-content-around me-5">
            <div class="col-5">
                <img :src="pelicula.poster" :alt="pelicula.nombre" class="w-100">
            </div>
            <div class="col-5">
                <p class="mb-5 fs-1"><strong>Año estreno {{ pelicula.year }}</strong></p>
                <h5 class="fw-bold">Full Cast</h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item" v-for="actor in getNombreActores()" :key="actor"> {{ actor }}</li>
                </ul>
                <h5 class="fw-bold">Generos</h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <p v-for="genero in getNombreGeneros()" :key="genero"> {{ genero }}</p>
                    </li>
                </ul>
                <h5 class="fw-bold">Sinopsis</h5>
                <p>{{ pelicula.sinopsis }}</p>
                <h5 class="fw-bold">Backdrop</h5>
                <p>{{ pelicula.backdrop }}</p>
                <h5 class="fw-bold">Budget</h5>
                <p>{{ pelicula.budget }}</p>
                <h5 class="fw-bold">Revenue</h5>
                <p>{{ pelicula.revenue }}</p>
                <h5 class="fw-bold">Runtime</h5>
                <p>{{ pelicula.runtime }}</p>
                <h5 class="fw-bold">Tagline</h5>
                <p>{{ pelicula.tagline }}</p>
                <h5 class="fw-bold">vote average</h5>
                <p>{{ pelicula.vote_average }}</p>
                <h5 class="fw-bold">vote_count</h5>
                <p>{{ pelicula.vote_count }}</p>

            </div>
        </div>
        <div class="text-center">
            <button @click="volver" class="btn btn-dark">Volver</button>
        </div>

        <hr class="my-5">

        <div class="row mt-5">
            <div class="col-md-8 mx-auto">
                <h3 class="mb-4 fw-bold">
                    Opiniones de la comunidad ({{ resenas.length }})
                </h3>

                <div v-if="user" class="card shadow-sm mb-5 border-0 bg-light p-4">
                    <h5 class="mb-3">Escribe tu opinion</h5>

                    <div class="mb-3">
                        <label class="form-label d-block text-muted small uppercase">Calificacion</label>
                        <div class="btn-group" role="group">
                            <button v-for="n in 5" :key="n" type="button" class="btn btn-sm"
                                :class="n <= calificacion ? 'btn-warning' : 'btn-outline-secondary'"
                                @click="calificacion = n">⭐</button>
                        </div>
                    </div>

                    <div class="mb-3">
                        <textarea class="form-control border-0" rows="3"
                            placeholder="Escribe tu opinion acerca de esta pelicula" v-model="nuevaResena"></textarea>
                    </div>

                    <button @click="enviarResena" class="btn btn-primary px-4 float-end">Enviar Reseña</button>
                </div>
                <div v-else class="alert alert-info text-center py-4 mb-5">
                    <p class="mb-2">Para dejar una reseña, primero debes iniciar sesion.</p>
                    <router-link to="/login" class="btn btn-outline-primary btn-sm">Iniciar sesion</router-link>
                </div>

                <div v-if="resenas.length > 0" class="list-group list-group-flush shadow-sm rounder border">
                    <div v-for="resena in resenas" :id="resena.id" class="list-group-item p-4">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <strong class="text-primary">{{ resena.userName }}</strong>
                            <span class="badge bg-warning text-dark">⭐ {{ resena.calificacion }} / 5</span>
                        </div>

                        <p class="mb-1 text-secondary italic">"{{ resena.comentario }}"</p>
                        <small class="text-muted">{{ resena.fecha?.toDate().toLocaleDateString() }}</small>
                    </div>
                </div>

                <div v-else class="text-center py-5">
                    <p class="text-muted">Aun no hay opiniones. ¡Se el primero en comentar!</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { obtenerTrailerTMDB } from '@/services/tmdbService';
import { ref, onMounted, computed } from 'vue';
import { getPeliculas } from '@/services/peliculaService';
import { getActores } from '@/services/actorService';
import { getGeneros } from '@/services/generoService';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { guardarResena, subscribeResenas } from '@/services/resenaService';
import { onUnmounted } from 'vue';

const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useStore()
const user = computed(() => store.state.user)
const userProfile = computed(() => store.state.userProfile)

const nuevaResena = ref("")
const trailerKey = ref(null)
const calificacion = ref(5)
const resenas = ref([])
let unsubscribe

const volver = () => {
    router.back()
}

const pelicula = ref(null)
const actores = ref([])
const generos = ref([])

const cargarDatos = async () => {
    try {
        const peliculas = await getPeliculas()
        pelicula.value = peliculas.find(p => p.id === route.params.id)
        actores.value = await getActores()
        generos.value = await getGeneros()

        if (pelicula.value.tmdbId) {
            trailerKey.value = await obtenerTrailerTMDB(pelicula.value.tmdbId)
        }
    } catch (error) {
        toast.error('Error al cargar los datos: ', error)
    }
}

onMounted(async () => {
    await cargarDatos()

    unsubscribe = subscribeResenas(route.params.id, (data) => {
        resenas.value = data
    })
})

onUnmounted(() => {
    if (unsubscribe) unsubscribe();
});

const enviarResena = async () => {
    if (nuevaResena.value.trim() === "") return

    try {
        await guardarResena({
            peliculaId: route.params.id,
            userId: user.value.uid,
            userName: userProfile.value.nombre,
            calificacion: calificacion.value,
            comentario: nuevaResena.value
        })

        nuevaResena.value = ""
        calificacion.value = 5
        toast.success("¡Gracias por tu opinion!")
    } catch (error) {
        toast.error("Error al publicar la reseña: " + error.message)
    }
}



const getNombreActores = () => {
    if (!pelicula.value.actores) return []

    return actores.value
        .filter(actor => pelicula.value.actores.includes(actor.id))
        .map(actor => actor.nombre)
}

const getNombreGeneros = () => {
    if (!pelicula.value.generos) return []

    return generos.value
        .filter(genero => pelicula.value.generos.includes(genero.id))
        .map(genero => genero.nombre)
}
</script>

<style scoped></style>