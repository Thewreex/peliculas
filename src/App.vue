<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <div v-if="errorMessage" class="alert alert-warning" role="alert">
      {{ errorMessage }}
    </div>
    <main class="container flex-grow-1">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Footer from './components/layout/Footer.vue';
import Navbar from './components/layout/Navbar.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore()

const errorMessage = computed(() => store.state.errorMessage)

</script>


<style scoped></style>
